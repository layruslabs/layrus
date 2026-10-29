/**
 * The WhatsApp link, in one place.
 *
 * It appears in four surfaces — the footer, the floating button, the contact
 * panel and Lyra's prompt — and when the business number changed, all four had
 * to be found by hand. One constant means the next change is one line.
 *
 * The text parameter pre-fills the message box. A bare number opens an empty
 * chat, which asks the visitor to think of an opener before they have said
 * anything; a first line they can edit is a lower bar than a blank one.
 */
const PREFILLED = "Hi, I'd like to talk about a project.";

export const WHATSAPP_URL = `https://wa.me/2349029733354?text=${encodeURIComponent(PREFILLED)}`;
