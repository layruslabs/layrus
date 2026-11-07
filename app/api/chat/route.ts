import { after } from "next/server";
import { systemPrompt } from "@/lib/assistant";
import { saveTranscript } from "@/lib/transcripts";

/** Longest answer we will pay for, in tokens. Roughly 700 words. */
const MAX_TOKENS = 1024;
/** Turns kept from the client. Older turns are dropped rather than rejected. */
const MAX_TURNS = 16;
/** Per-message ceiling, so one enormous paste cannot run up a bill. */
const MAX_CHARS = 2000;

const ENDPOINT = `${process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com"}/chat/completions`;
const MODEL = process.env.DEEPSEEK_MODEL ?? "deepseek-chat";

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

  // The conversation must open with the user.
  while (turns.length && turns[0].role !== "user") turns.shift();
  return turns.length ? turns : null;
}

/**
 * Best-effort rate limit: a token bucket per IP, held in the instance.
 *
 * ponytail: module state, so it is per-instance and Vercel runs many. It stops
 * a script hammering one instance and a person holding down Enter; it does not
 * stop a distributed one. The real ceilings are the token cap above and the
 * spend limit on the DeepSeek account. Upgrade path is Vercel's WAF rate
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

/**
 * Yield the text of each SSE event from DeepSeek's stream.
 *
 * Chunks arrive at arbitrary byte boundaries, so the buffer is split on the
 * blank line between events rather than on each read — otherwise a JSON object
 * that straddles two reads is parsed as two broken halves.
 */
async function* events(res: Response): AsyncGenerator<string> {
  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let split: number;
    while ((split = buffer.indexOf("\n\n")) !== -1) {
      const event = buffer.slice(0, split);
      buffer = buffer.slice(split + 2);
      for (const line of event.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") return;
        yield data;
      }
    }
  }
}

/** The visible text of one chunk. Reasoning deltas, when a model sends them, are dropped. */
function deltaText(event: string): string {
  try {
    const parsed = JSON.parse(event) as {
      choices?: { delta?: { content?: unknown } }[];
    };
    const content = parsed.choices?.[0]?.delta?.content;
    return typeof content === "string" ? content : "";
  } catch {
    // A malformed event is not worth failing the stream over; the reply simply
    // does not contain whatever it held.
    return "";
  }
}

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

  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    console.error("chat: DEEPSEEK_API_KEY is not set");
    return Response.json({ error: UNAVAILABLE }, { status: 503 });
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

  const upstream = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "text/event-stream",
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: "system", content: systemPrompt() }, ...turns],
      max_tokens: MAX_TOKENS,
      stream: true,
    }),
    // The visitor closing the panel should stop the tokens, not just hide them.
    signal: req.signal,
  }).catch((err) => {
    console.error("chat: upstream call failed", err);
    return null;
  });

  if (!upstream || !upstream.ok || !upstream.body) {
    console.error("chat: upstream refused", upstream?.status, upstream ? await upstream.text().catch(() => "") : "");
    return Response.json({ error: UNAVAILABLE }, { status: 502 });
  }

  // Narrowed once, because a hoisted function does not keep the guard above.
  const source: Response = upstream;

  // The first text delta is pulled before we commit to a response, so a bad
  // key, a rate limit or an empty stream still becomes a status code the
  // browser can act on rather than a 200 followed by a dead connection.
  async function* textDeltas() {
    for await (const event of events(source)) {
      const text = deltaText(event);
      if (text) yield text;
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

  if (first.done) {
    // A stream that produced no text at all is a failure, not an empty answer.
    console.error("chat: upstream returned no text");
    return Response.json({ error: UNAVAILABLE }, { status: 502 });
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        reply += first.value;
        controller.enqueue(encoder.encode(first.value));
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
