import { Pool } from "pg";

/**
 * Chat transcripts, one row per conversation in Postgres (Neon in production).
 *
 * Kept so a question about a project can be picked up by a person afterwards
 * rather than disappearing when the tab closes.
 *
 * Two random ids come from the browser. `sessionId` is new on every page load
 * and keys one conversation. `visitorId` is kept in localStorage, so the same
 * browser coming back writes a second row that can be linked to the first.
 * Neither identifies a person: no IP, no cookie, no user agent, no account.
 *
 * `pg` rather than Neon's own driver because it speaks ordinary Postgres and
 * so runs against the local database in development as well as Neon in
 * production, which is what makes this testable. Use Neon's pooled connection
 * string (the `-pooler` host) so serverless invocations do not exhaust
 * connections; `max: 1` gives each invocation its own single connection.
 *
 * Every failure here is swallowed on purpose. Someone who got an answer must
 * not see an error because the database was unreachable, and a transcript is
 * not worth failing a reply over. Missing `DATABASE_URL` is not an error
 * either: it is how the site runs locally and in previews.
 */
type Turn = { role: "user" | "assistant"; content: string };

export type VisitorDetails = { name: string; email: string };

let pool: Pool | undefined;

function connect(): Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return (pool ??= new Pool({
    connectionString: url,
    max: 1,
    // Neon requires TLS and presents a certificate chain node-postgres does
    // not verify by default; a local database has neither.
    ssl: /sslmode=require|neon\.tech/.test(url)
      ? { rejectUnauthorized: false }
      : undefined,
  }));
}

export async function saveTranscript(
  sessionId: string,
  visitorId: string | null,
  details: VisitorDetails | null,
  turns: Turn[],
  reply: string,
): Promise<void> {
  if (reply.trim() === "") return;
  const db = connect();
  if (!db) return;

  try {
    const messages = [...turns, { role: "assistant", content: reply }];
    // One row per conversation; each turn replaces the previous copy, so a row
    // is always the whole conversation and never a fragment of one.
    await db.query(
      `insert into conversations
         (session_id, visitor_id, visitor_name, visitor_email, messages)
       values ($1, $2, $3, $4, $5::jsonb)
       on conflict (session_id) do update
         set messages = excluded.messages,
             visitor_id = coalesce(excluded.visitor_id, conversations.visitor_id),
             visitor_name = coalesce(excluded.visitor_name, conversations.visitor_name),
             visitor_email = coalesce(excluded.visitor_email, conversations.visitor_email),
             updated_at = now()`,
      [
        sessionId,
        visitorId,
        details?.name ?? null,
        details?.email ?? null,
        JSON.stringify(messages),
      ],
    );
  } catch (err) {
    console.error("transcripts: save failed", err);
  }
}

/**
 * The last conversation saved by this browser, for the resume path.
 *
 * Only rows with a visitor id qualify; a one-off chat belongs to nobody and is
 * deliberately unreachable from here.
 */
export async function loadTranscript(visitorId: string): Promise<Turn[] | null> {
  const db = connect();
  if (!db) return null;

  try {
    const { rows } = await db.query<{ messages: Turn[] }>(
      `select messages from conversations
       where visitor_id = $1
       order by updated_at desc
       limit 1`,
      [visitorId],
    );
    const messages = rows[0]?.messages;
    return Array.isArray(messages) ? messages : null;
  } catch (err) {
    console.error("transcripts: load failed", err);
    return null;
  }
}
