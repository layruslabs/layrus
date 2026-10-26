import Link from "next/link";
import { Arrow } from "@/components/Arrow";

/**
 * The masthead every page under the homepage opens with. The homepage has the
 * hero; everything else gets this, so they read as one site rather than as
 * pages bolted on one at a time.
 *
 * `pt-28` clears the fixed navbar — it overlaps the page rather than pushing
 * it down, so every route has to make room for it itself.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="max-w-7xl mx-auto px-6 lg:px-10 pt-28 md:pt-36 pb-10 md:pb-14">
      <p className="section-label">{eyebrow}</p>
      <h1
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
        className="mt-4 max-w-3xl text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.08] tracking-tight"
      >
        {title}
      </h1>
      {intro && (
        <p
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
          className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed"
        >
          {intro}
        </p>
      )}
    </header>
  );
}

/**
 * Long-form text — the legal pages. Deliberately narrow: a wall of full-width
 * legal prose is unreadable at 1400px.
 */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
      className="mx-auto max-w-2xl px-6 pb-20 flex flex-col gap-4 text-base leading-relaxed
                 [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-[var(--text-primary)]
                 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_ul]:list-disc
                 [&_a]:text-[var(--accent-terracotta)] [&_a]:underline [&_a]:underline-offset-2"
    >
      {children}
    </div>
  );
}

/** The sign-off on every sub-page. The homepage has the full enquiry form. */
export function CtaBand() {
  return (
    <section
      style={{ backgroundColor: "var(--bg-surface)", borderTopColor: "var(--border-subtle)" }}
      className="border-t"
      aria-label="Get in touch"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 flex flex-wrap items-center justify-between gap-6">
        <p
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
          className="text-2xl md:text-3xl font-bold"
        >
          Have something that needs building?
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <Link href="/contact" className="btn-primary">
            Start a project
            <Arrow />
          </Link>
          <Link href="/projects" className="btn-ghost">
            See our work
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
