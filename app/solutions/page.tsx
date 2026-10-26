import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { PageHeader, CtaBand } from "@/components/PageHeader";
import { serviceBySlug } from "@/lib/services";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "The problems businesses usually come to us with, and which of our services answers each one.",
  alternates: { canonical: "/solutions" },
};

/**
 * The same six services, indexed by the problem rather than by the
 * discipline. People arrive knowing what is going wrong, not which of our
 * service names covers it — /services is for the ones who already know.
 */
const PROBLEMS = [
  {
    problem: "Everything runs on spreadsheets",
    detail:
      "Stock lives in one file, sales in another and neither agrees with the invoices. We replace the sprawl with one system that the whole team works from.",
    service: "software",
  },
  {
    problem: "Customers ask the same questions all day",
    detail:
      "The answers are written down somewhere, and somebody still has to type them out forty times a day. We put an assistant in front of the repetitive ones and a person in front of the rest.",
    service: "ai",
  },
  {
    problem: "We can't see what's happening in the field",
    detail:
      "Machines, vehicles and sites that only report a problem when somebody phones in. We build the sensors, the firmware and the link back to a dashboard.",
    service: "embedded",
  },
  {
    problem: "It works fine until it gets busy",
    detail:
      "The system was built for last year's volume. We rework the architecture so growth is a configuration change rather than a rewrite.",
    service: "cloud",
  },
  {
    problem: "We don't know what to build",
    detail:
      "Everyone agrees something needs to change, nobody agrees what. We work out what the problem actually is and what solving it would take, before anyone commits to building.",
    service: "discovery",
  },
  {
    problem: "Nobody is looking after it",
    detail:
      "The person who built it has moved on. We take responsibility for keeping it running, patched and moving forward.",
    service: "managed",
  },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Start from the problem, not the technology"
        intro="Most people arrive knowing what is going wrong rather than what they need built. Here is the shape of what we usually hear, and what answers it."
      />

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" role="list">
          {PROBLEMS.map((p) => {
            const service = serviceBySlug(p.service);
            if (!service) return null;
            return (
              <article
                key={p.problem}
                role="listitem"
                style={{ borderColor: "var(--border-card)" }}
                className="flex h-full flex-col gap-3 border p-6 transition-colors duration-200
                           hover:bg-[var(--bg-surface)]"
              >
                <h2
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
                  className="text-xl font-bold leading-snug"
                >
                  &ldquo;{p.problem}&rdquo;
                </h2>
                <p
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
                  className="flex-1 text-base leading-relaxed"
                >
                  {p.detail}
                </p>
                <div
                  style={{ borderTopColor: "var(--border-subtle)" }}
                  className="mt-auto flex items-center justify-between gap-3 border-t pt-4"
                >
                  <Link
                    href={`/services/${service.slug}`}
                    style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter)" }}
                    className="inline-flex items-center gap-2 text-sm font-medium
                               transition-colors duration-150 hover:text-[var(--accent-terracotta)]"
                  >
                    {service.title}
                    <Arrow />
                  </Link>
                  <span
                    style={{ backgroundColor: service.accent }}
                    className="h-1.5 w-1.5 shrink-0"
                    aria-hidden="true"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
