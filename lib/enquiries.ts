import { db } from "@/lib/transcripts";

/**
 * Enquiries from the contact form, in the same Postgres database as the chat
 * transcripts. The site has no mail service, so the database is the record:
 * an enquiry that only sent an email would be lost the moment delivery failed.
 *
 * Validation happens in the route, not here; by the time this is called the
 * fields have already been checked and trimmed.
 */
export interface Enquiry {
  name: string;
  email: string;
  subject: string | null;
  message: string;
}

export async function saveEnquiry(e: Enquiry): Promise<boolean> {
  const pool = db();
  if (!pool) return false;

  try {
    await pool.query(
      `insert into enquiries (name, email, subject, message)
       values ($1, $2, $3, $4)`,
      [e.name, e.email, e.subject, e.message],
    );
    return true;
  } catch (err) {
    console.error("enquiries: save failed", err);
    return false;
  }
}
