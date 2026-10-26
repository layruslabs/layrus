import Link from "next/link";
import { Arrow } from "@/components/Arrow";

/**
 * Compliance / registration strip.
 *
 * These are the registrations a Nigerian engineering firm is expected to
 * hold. Confirm each one with the client and delete any that are not in
 * place before this goes live — an inaccurate compliance claim is a real
 * liability, not a placeholder.
 */
const CREDENTIALS = [
  "CAC Registered",
  "NDPR Compliant",
  "NITDA Aligned",
  "ISO 27001 Aligned Practices",
  "Data Processing Agreement",
  "Tax Clearance (TCC)",
  "PENCOM Compliant",
  "SCUML Registered",
  "GDPR Aware",
  "NDPC Registered",
] as const;

export function Compliance() {
  return (
    <section
      aria-labelledby="compliance-heading"
      style={{ borderTopColor: "var(--rule)" }}
      className="border-t py-20 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">

          <div className="flex flex-col gap-5">
            <p className="section-label">Compliance</p>
            <h2
              id="compliance-heading"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
              className="text-4xl md:text-[2.75rem] font-bold"
            >
              Cleared to work with the public sector
            </h2>
            <p
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
              className="text-base leading-relaxed max-w-md"
            >
              Layrus holds the registrations and compliance certifications
              that procurement teams ask for, so onboarding does not stall in
              a vendor-review queue.
            </p>
            <div className="pt-1">
              <Link href="/contact" className="btn-outline">
                Request our compliance pack
                <Arrow />
              </Link>
            </div>
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-px"
              style={{ backgroundColor: "var(--border-subtle)" }}>
            {CREDENTIALS.map((c) => (
              <li
                key={c}
                style={{ backgroundColor: "var(--bg-page)" }}
                className="flex items-center gap-3 px-4 py-3"
              >
                <span style={{ color: "var(--accent-green)" }} className="shrink-0" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" strokeWidth="2.2"
                       strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12.5 4.5 4.5L19 7" />
                  </svg>
                </span>
                <span
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
                  className="text-sm leading-snug"
                >
                  {c}
                </span>
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
}
