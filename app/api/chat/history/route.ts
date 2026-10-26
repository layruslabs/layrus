import { loadTranscript } from "@/lib/transcripts";

/**
 * The last conversation this browser saved, so a returning visitor can pick it
 * up where they left off.
 *
 * The id is a random string generated in the browser and kept in localStorage.
 * It is the whole authorisation: whoever holds it can read that conversation,
 * which is why it is never rendered or put in a URL anywhere else on the site.
 * No id, or an unknown one, returns an empty list rather than an error — a
 * visitor who has never saved anything is the normal case, not a failure.
 */
export async function GET(req: Request) {
  const visitorId = new URL(req.url).searchParams.get("visitorId") ?? "";

  if (!/^[A-Za-z0-9_-]{8,64}$/.test(visitorId)) {
    return Response.json({ messages: [] });
  }

  const messages = await loadTranscript(visitorId);
  return Response.json(
    { messages: messages ?? [] },
    { headers: { "cache-control": "no-store" } },
  );
}
