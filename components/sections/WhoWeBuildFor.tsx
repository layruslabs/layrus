import Link from "next/link";
import { Arrow } from "@/components/Arrow";

/* Sector cards — the audiences Layrus already serves. */
const SECTORS = [
  {
    title: "SMEs & Startups",
    description: "Scalable systems for growing businesses, priced for the stage you are at.",
    icon: (
      <>
        <path d="M4 19V9l8-5 8 5v10" />
        <path d="M9 19v-5h6v5" />
      </>
    ),
  },
  {
    title: "Enterprises",
    description: "Modernisation, integration and automation across existing systems.",
    icon: (
      <>
        <rect x="4" y="4" width="7" height="7" />
        <rect x="13" y="4" width="7" height="7" />
        <rect x="4" y="13" width="7" height="7" />
        <rect x="13" y="13" width="7" height="7" />
      </>
    ),
  },
  {
    title: "Government & Public Sector",
    description: "Secure, compliant and mission-critical systems built to last.",
    icon: (
      <>
        <path d="M4 20h16M6 20V10M18 20V10M4 10h16L12 4Z" />
      </>
    ),
  },
  {
    title: "High-Growth Industries",
    description: "Fintech, healthcare, education, logistics, manufacturing and more.",
    icon: (
      <>
        <path d="M4 18 9 12l4 3 7-8" />
        <path d="M20 7h-4M20 7v4" />
      </>
    ),
  },
] as const;

export function WhoWeBuildFor() {
  return (
    <section aria-labelledby="who-heading" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 mb-12 items-end">
          <div className="flex flex-col gap-3">
            <p className="section-label">Who We Build For</p>
            <h2
              id="who-heading"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
              className="text-[2.75rem] md:text-[3.5rem] font-bold"
            >
              Organisations we work with
            </h2>
          </div>
          <p
            style={{ color: "var(--text-secondary)", borderLeftColor: "var(--border-subtle)", fontFamily: "var(--font-inter)" }}
            className="text-base leading-relaxed max-w-xs lg:pl-6 lg:border-l"
          >
            Businesses and institutions with complex technical challenges and
            no patience for a partner who needs hand-holding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" role="list">
          {SECTORS.map((s) => (
            <article
              key={s.title}
              role="listitem"
              style={{ borderColor: "var(--border-card)" }}
              className="group flex flex-col gap-4 border p-6 transition-colors duration-200
                         hover:bg-[var(--bg-surface)]"
            >
              <span
                style={{ color: "var(--accent-green)" }}
                aria-hidden="true"
              >
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {s.icon}
                </svg>
              </span>

              <h3
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
                className="text-xl font-bold leading-snug"
              >
                {s.title}
              </h3>

              <p
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
                className="text-base leading-relaxed flex-1"
              >
                {s.description}
              </p>

              <Link
                href="/about"
                aria-label={`More about working with ${s.title}`}
                style={{ color: "var(--text-muted)" }}
                className="transition-colors duration-150 hover:text-[var(--accent-terracotta)]"
              >
                <Arrow />
              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
