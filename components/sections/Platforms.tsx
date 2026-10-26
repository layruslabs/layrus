import Image from "next/image";
import Link from "next/link";
import { ProductMark } from "@/components/ProductMark";
import { PROJECTS } from "@/lib/projects";

/**
 * Everything shipped, in one grid — the index to the work, where
 * RecentProjects above shows the four as cards.
 *
 * Each row leads with the product's own mark. It used to carry a small
 * coloured square, which was colour-coding with nothing behind it: four tints
 * that distinguished nothing. A real logo distinguishes the products, which
 * is the only thing this grid is for.
 */

/* Running dashboards, which is what the band lists. Heavily scrimmed: it is
   there to give the band depth, not to be looked at. */
const PHOTO_DASHBOARD =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80";

export function Platforms() {
  return (
    <section
      aria-labelledby="platforms-heading"
      className="relative overflow-hidden py-20 md:py-24"
    >
      <Image
        src={PHOTO_DASHBOARD}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        style={{ filter: "blur(8px)", transform: "scale(1.06)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: "var(--bg-invert)", opacity: 0.78 }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">

        <div className="flex flex-col items-center text-center gap-3 mb-12">
          <p className="section-label">Shipped &amp; Running</p>
          <h2
            id="platforms-heading"
            style={{ color: "var(--text-on-invert)", fontFamily: "var(--font-playfair)" }}
            className="text-[2.75rem] md:text-[3.5rem] font-bold"
          >
            Systems we&rsquo;ve built
          </h2>
          <p
            style={{ color: "var(--text-on-invert-muted)", fontFamily: "var(--font-inter)" }}
            className="text-base leading-relaxed max-w-lg"
          >
            Fourteen systems across automotive, finance, agriculture,
            healthcare, education and logistics — from a workshop&rsquo;s back
            office to a marketplace that holds client money in escrow.
          </p>
        </div>

        {/* The tiles are transparent so the backdrop reads through them, which
            means the rules between them have to be drawn rather than revealed
            through the gaps. Every tile draws its own bottom and right rule,
            so the grid oversizes itself by a pixel and the clip cuts the outer
            pair — the negative margins belong on the grid, not the wrapper,
            or it just grows and the outer rules show. */}
        <div className="overflow-hidden">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 -mr-px -mb-px">
          {PROJECTS.map((p) => (
            <li
              key={p.slug}
              style={{ borderColor: "var(--text-on-invert-faint)" }}
              className="border-b border-r"
            >
              <Link
                href={`/projects/${p.slug}`}
                className="flex h-full items-start gap-3.5 p-5 transition-opacity duration-150 hover:opacity-80"
              >
                <span className="mt-0.5 shrink-0">
                  <ProductMark slug={p.slug} size={26} />
                </span>
                <span className="flex min-w-0 flex-col gap-1">
                  <span
                    style={{ color: "var(--text-on-invert)", fontFamily: "var(--font-inter)" }}
                    className="text-base font-semibold leading-snug"
                  >
                    {p.name}
                  </span>
                  <span
                    style={{ color: "var(--text-on-invert-muted)", fontFamily: "var(--font-inter)" }}
                    className="text-sm leading-snug"
                  >
                    {p.category}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        </div>

      </div>
    </section>
  );
}
