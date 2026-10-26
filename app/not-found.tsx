import Link from "next/link";
import { Arrow } from "@/components/Arrow";

/**
 * Renders inside the root layout, so the navbar and footer stay put and only
 * the content area reports the miss. A 404 that replaces the whole page takes
 * the navigation with it, which is the moment a visitor most needs it.
 */
export default function NotFound() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-28 md:pt-36 pb-20">
      <p className="section-label">Error 404</p>
      <h1
        style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
        className="mt-4 text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.08] tracking-tight"
      >
        That page isn&rsquo;t here.
      </h1>
      <p
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
        className="mt-5 max-w-xl text-[1.0625rem] leading-relaxed"
      >
        The link may be out of date, or the page may have moved. Everything
        below is still where you left it.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-5">
        <Link href="/" className="btn-primary">
          Back to the homepage
          <Arrow />
        </Link>
        <Link href="/contact" className="btn-ghost">
          Tell us what you were looking for
          <Arrow />
        </Link>
      </div>
    </section>
  );
}
