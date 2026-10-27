import nodemailer, { type Transporter } from "nodemailer";
import type { Enquiry } from "@/lib/enquiries";

/**
 * The notification email, sent through the Spacemail mailbox.
 *
 * Spacemail has no sending API; it offers standard SMTP on
 * mail.spacemail.com:465 with implicit TLS, which is what this uses. Sending
 * from the real mailbox means SPF and DKIM already pass, so there is no second
 * provider to verify a domain with.
 *
 * The enquiry is written to Postgres before this runs, so a failed send loses
 * nothing — but it does not go unnoticed either: this returns whether the mail
 * actually left, and the form tells the person when it did not. The database
 * is a record for later; nobody is watching it for new enquiries.
 *
 * Without SMTP_USER and SMTP_PASS nothing is sent, which is how local
 * development runs, and the caller is told so.
 */
let cached: Transporter | undefined;

function transport(): Transporter | null {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return null;

  const port = Number(process.env.SMTP_PORT ?? 465);
  return (cached ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "mail.spacemail.com",
    port,
    secure: port === 465,
    auth: { user, pass },
    // A form submission must not hang on a mail handshake. These are the
    // documented failure points: connect, greeting, and the socket itself.
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10_000,
  }));
}

export async function notifyEnquiry(e: Enquiry): Promise<boolean> {
  const t = transport();
  if (!t) return false;

  try {
    await t.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to: process.env.ENQUIRY_TO ?? "hello@layrus.com",
      replyTo: e.email,
      subject: e.subject ? `Enquiry: ${e.subject}` : `Enquiry from ${e.name}`,
      text: [
        `Name:    ${e.name}`,
        `Email:   ${e.email}`,
        `Subject: ${e.subject ?? "(none)"}`,
        "",
        e.message,
      ].join("\n"),
    });
    return true;
  } catch (err) {
    console.error("mailer: send failed", err);
    return false;
  }
}
