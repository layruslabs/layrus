/**
 * The people.
 *
 * One entry, because one person is verifiable: John Okonkwo, whose CV lists
 * the work behind every project on this site. Nothing here is invented — a
 * made-up colleague on an About page is the one claim a visitor can check by
 * asking to meet them.
 *
 * To add someone:
 *   1. Drop their photograph in `public/team/` (square, 800×800 or larger)
 *   2. Add an entry below with `photo` set to that path
 *   3. Leave `photo` unset and the card falls back to their initials — which is
 *      deliberate, not a placeholder to be embarrassed about.
 */
export interface Person {
  name: string;
  role: string;
  /** One or two lines. What they actually do, not a job-description sentence. */
  bio: string;
  /** Path under /public. Unset renders initials instead. */
  photo?: string;
  /** Optional links. */
  website?: string;
  github?: string;
  linkedin?: string;
  /** "focus" areas shown as a small row under the bio. */
  focus: string[];
}

export const TEAM: Person[] = [
  {
    name: "John Okonkwo",
    role: "Founder & CTO",
    bio: "First-Class Software Engineering graduate from Veritas University, and the engineer behind every system on this site. Works across Rust and Go backends, Solidity contracts and embedded hardware — usually on the same project.",
    photo: "/team/john.png",
    website: "https://jvcbyte.dev",
    focus: ["Rust", "Solidity", "AI systems", "Embedded"],
    github: "https://github.com/jvcByte",
    linkedin: "https://linkedin.com/in/jvcbyte",
  },
  {
    name: "Goodness Iroegbu",
    role: "Chief Marketing Officer",
    bio: "Runs how Layrus is found and understood — the site, the case studies, and the work that turns interest into a conversation rather than a bounce.",
    photo: "/team/iroegbu-goodness.jpg",
    focus: ["Positioning", "Content", "Pipeline"],
  },
  {
    name: "Chidinma Okonkwo",
    role: "Company Secretary",
    bio: "Keeps the company's records, registrations and contracts in order — the paperwork procurement teams ask for, and the reason onboarding does not stall in a vendor queue.",
    photo: "/team/chidinma-okonkwo.jpg",
    focus: ["Compliance", "Contracts", "Governance"],
  },
];
