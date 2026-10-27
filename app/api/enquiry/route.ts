import { saveEnquiry } from "@/lib/enquiries";

/**
 * The contact form.
 *
 * One row per enquiry in Postgres. There is no mail service configured, so the
 * database is the record rather than a notification: a submission that failed
 * to send would otherwise vanish without trace.
 *
 * Everything is validated here because the browser is not a trust boundary,
 * and the length caps are about the database, not the person.
 */
const MAX = { name: 120, email: 200, subject: 160, message: 5000 };

function text(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export async function POST(req: Request) {
  let body: Record<string, unknown> | null = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const name = text(body?.name, MAX.name);
  const email = text(body?.email, MAX.email);
  const subject = text(body?.subject, MAX.subject);
  const message = text(body?.message, MAX.message);

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return Response.json(
      { error: "Please add your name, a valid email address, and a message." },
      { status: 400 },
    );
  }

  const saved = await saveEnquiry({
    name,
    email,
    subject: subject || null,
    message,
  });

  if (!saved) {
    return Response.json(
      { error: "We could not save that just now. Email hello@layrus.com and we will pick it up." },
      { status: 503 },
    );
  }

  return Response.json({ ok: true });
}
