import { saveEnquiry } from "@/lib/enquiries";
import { notifyEnquiry } from "@/lib/mailer";

/**
 * The contact form.
 *
 * The enquiry is stored first, then emailed through Spacemail as a
 * notification. Storing first is the point: there is no mail delivery
 * guarantee, and an enquiry that only tried to send would vanish when
 * delivery failed.
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

  if (
    name.length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    message.length < 10
  ) {
    return Response.json(
      { error: "Please add your name, a valid email address, and a message." },
      { status: 400 },
    );
  }

  const enquiry = { name, email, subject: subject || null, message };
  const saved = await saveEnquiry(enquiry);

  if (!saved) {
    return Response.json(
      {
        error:
          "We could not save that just now. Email hello@layrus.com and we will pick it up.",
      },
      { status: 503 },
    );
  }

  // Awaited rather than fired and forgotten: if the mail does not leave, the
  // person has to know, because nobody is watching the table for new rows.
  const sent = await notifyEnquiry(enquiry);

  if (!sent) {
    return Response.json(
      {
        error:
          "Your message was saved, but we could not send it. Please email hello@layrus.com so it reaches us today.",
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
