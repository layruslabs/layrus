import Anthropic from "@anthropic-ai/sdk";
import { after } from "next/server";
import { systemPrompt } from "@/lib/assistant";
import { saveTranscript } from "@/lib/transcripts";

/** Longest answer we will pay for, in tokens. Roughly 700 words. */
const MAX_TOKENS = 1024;
/** Turns kept from the client. Older turns are dropped rather than rejected. */
const MAX_TURNS = 16;
/** Per-message ceiling, so one enormous paste cannot run up a bill. */
const MAX_CHARS = 2000;

let cached: Anthropic | undefined;
function anthropic(): Anthropic {
  return (cached ??= new Anthropic());
}

type Turn = { role: "user" | "assistant"; content: string };

/**
 * Parse the conversation the browser sent. Nothing here is trusted: the
 * message array is the one part of the request an attacker fully controls, and
 * it is billed by the token.
 *
 * Returns null for anything malformed. A turn that is merely too long is cut,
 * not rejected — losing the tail of a long question beats losing the question.
 */
function parseTurns(raw: unknown): Turn[] | null {
  if (!Array.isArray(raw) || raw.length === 0) return null;

  const turns: Turn[] = [];
  for (const entry of raw.slice(-MAX_TURNS)) {
    if (typeof entry !== "object" || entry === null) return null;
    const { role, content } = entry as Record<string, unknown>;
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.trim() === "") return null;
    turns.push({ role, content: content.slice(0, MAX_CHARS) });
  }

  // The API requires the conversation to open with the user.
  while (turns.length && turns[0].role !== "user") turns.shift();
  return turns.length ? turns : null;
}

/**
 * Best-effort rate limit: a token bucket per IP, held in the instance.
 *
 * ponytail: module state, so it is per-instance and Vercel runs many. It stops
 * a script hammering one instance and a person holding down Enter; it does not
 * stop a distributed one. The real ceilings are the token cap above and the
 * spend limit on the Anthropic account. Upgrade path is Vercel's WAF rate
 * limiting (no code) or Upstash, which is shared state.
 */
const BUCKET = new Map<string, { tokens: number; seen: number }>();
const CAPACITY = 8;
const REFILL_PER_MS = 1 / 6000; // one message every six seconds, sustained

function take(ip: string): boolean {
  const now = Date.now();
  const b = BUCKET.get(ip) ?? { tokens: CAPACITY, seen: now };
  b.tokens = Math.min(CAPACITY, b.tokens + (now - b.seen) * REFILL_PER_MS);
  b.seen = now;
  if (BUCKET.size > 5000) BUCKET.clear(); // ponytail: crude, bounds memory only
  if (b.tokens < 1) {
    BUCKET.set(ip, b);
    return false;
  }
  b.tokens -= 1;
  BUCKET.set(ip, b);
  return true;
}

const UNAVAILABLE =
  "I could not answer that just now. Email hello@layrus.com and we will pick it up.";

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!take(ip)) {
    return Response.json(
      { error: "Too many messages. Please wait a moment." },
      { status: 429 },
    );
  }

  let payload: {
    messages?: unknown;
    sessionId?: unknown;
    visitorId?: unknown;
    visitor?: unknown;
  } | null = null;
  try {
    payload = await req.json();
  } catch {
    payload = null;
  }
  const turns = parseTurns(payload?.messages);
  if (!turns) {
    return Response.json({ error: "Malformed request." }, { status: 400 });
  }

  // A random id the browser makes per conversation. Used only to group turns
  // of one chat into one row; it identifies nobody. Anything that is not the
  // expected shape means the transcript is skipped, not that the chat fails.
  const id = (value: unknown) =>
    typeof value === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(value) ? value : null;

  const sessionId = id(payload?.sessionId);
  // Stable across visits on one browser, so returning conversations link up.
  // Absent for a one-off chat, which is stored but linked to nobody.
  const visitorId = id(payload?.visitorId);

  // Only sent when the visitor chose to save the chat. Validation happens
  // here because the browser is not a trust boundary: a name and an email
  // that fail these checks are dropped, not stored.
  const raw = payload?.visitor as { name?: unknown; email?: unknown } | undefined;
  const details =
    visitorId &&
    typeof raw?.name === "string" &&
    typeof raw?.email === "string" &&
    raw.name.trim().length >= 2 &&
    raw.name.trim().length <= 80 &&
    raw.email.trim().length <= 200 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.email.trim())
      ? { name: raw.name.trim(), email: raw.email.trim() }
      : null;

  // The full reply only exists once the stream ends, and the response must not
  // wait on a database write. `after` runs when the response is finished; the
  // promise makes that ordering explicit rather than assumed.
  let reply = "";
  let finish!: () => void;
  const finished = new Promise<void>((resolve) => (finish = resolve));
  const conversation = turns;
  after(async () => {
    await finished;
    if (sessionId) {
      await saveTranscript(sessionId, visitorId, details, conversation, reply);
    }
  });

  const stream = anthropic().beta.messages.stream({
    // Both providers understand a Claude model name: DeepSeek's
    // Anthropic-compatible endpoint maps claude-opus* to deepseek-v4-pro and
    // claude-sonnet*/claude-haiku* to deepseek-flash. Override only to pin
    // something specific — see .env.example.
    model: process.env.LYRA_MODEL ?? "claude-opus-5-5",
    max_tokens: MAX_TOKENS,
    // Chat, not analysis: low effort is the documented setting for
    // latency-sensitive routes and keeps a support reply quick.
    output_config: { effort: "low" },
    system: systemPrompt(),
    messages: turns,
    // A support assistant should not go silent on a policy decline. Claude
    // Opus 5.5 is served by the newest models already, so "default" routes by
    // refusal category and we never maintain a model list.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });

  // The first text delta is pulled before we commit to a response.
  //
  // This is not an optimisation. `new Anthropic()` does not check credentials —
  // the SDK resolves them when the request is made — and `toReadableStream()`
  // only reports that failure once the response headers have already gone out.
  // The result is a 200 followed by a dead connection, which the browser can
  // do nothing useful with. Awaiting the first delta moves every failure —
  // missing key, bad key, rate limit, model gone — to a point where we can
  // still choose the status code.
  // Thinking deltas are real and billed, and are deliberately not forwarded:
  // a visitor should not watch the model reason about them.
  async function* textDeltas() {
    for await (const event of stream) {
      if (
        event.type === "content_block_delta" &&
        event.delta.type === "text_delta"
      ) {
        yield event.delta.text;
      }
    }
  }

  const deltas = textDeltas();
  let first: IteratorResult<string>;
  try {
    first = await deltas.next();
  } catch (err) {
    console.error("chat: upstream call failed", err);
    return Response.json({ error: UNAVAILABLE }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!first.done) {
          reply += first.value;
          controller.enqueue(encoder.encode(first.value));
        }
        for await (const chunk of deltas) {
          reply += chunk;
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (err) {
        // The headers are long gone; the client notices a short reply and
        // offers the email route.
        console.error("chat: stream ended early", err);
        controller.error(err);
      } finally {
        // Whatever the stream managed to produce still gets recorded, which is
        // how a broken reply is visible rather than silent.
        finish();
      }
    },
  });

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
