import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { ILLUSTRATED, serviceHref, type IllustratedService } from "@/lib/services";

/* The four disciplines that come with an architecture to show. The other two
   services live on /services — this section illustrates a discipline, it is
   not the full list. Both read from the same source, so a service cannot be
   called one thing here and another where it is linked. */

function ServiceCard({ service }: { service: IllustratedService }) {
  const { num, title, tagline, accent, arch } = service;
  return (
    <article
      role="listitem"
      style={{ borderColor: "var(--border-card)" }}
      className="group flex h-full flex-col border"
    >
      <div
        style={{ borderBottomColor: "var(--border-subtle)" }}
        className="flex flex-1 items-center border-b p-5 pb-4"
      >
        <ArchitectureDiagram spec={arch} />
      </div>

      <div className="flex flex-col gap-4 p-5 flex-1">
        <span
          style={{ color: "var(--accent-terracotta)", fontFamily: "var(--font-inter)" }}
          className="text-[0.6rem] tracking-[0.18em]"
          aria-hidden="true"
        >
          {num}
        </span>

        <h3
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
          className="text-xl font-bold leading-snug"
        >
          {title}
        </h3>

        <p
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
          className="text-base leading-relaxed flex-1"
        >
          {tagline}
        </p>

        <div
          style={{ borderTopColor: "var(--border-subtle)" }}
          className="mt-auto flex items-center justify-between pt-4 border-t"
        >
          <Link
            href={serviceHref(service)}
            aria-label={`Learn more about ${title}`}
            style={{ color: "var(--text-primary)" }}
            className="inline-flex items-center gap-2 text-sm font-medium
                       transition-colors duration-150 hover:text-[var(--accent-terracotta)]"
          >
            Learn more
            <Arrow />
          </Link>
          <span
            style={{ backgroundColor: accent }}
            className="accent-rule"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}

export function CoreCapabilities() {
  return (
    <section aria-labelledby="capabilities-heading" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 mb-12 items-end">
          <div className="flex flex-col gap-3">
            <p className="section-label">Our Services</p>
            <h2
              id="capabilities-heading"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
              className="text-[2.75rem] md:text-[3.5rem] font-bold"
            >
              Core Capabilities
            </h2>
          </div>
          <p
            style={{ color: "var(--text-secondary)", borderLeftColor: "var(--border-subtle)", fontFamily: "var(--font-inter)" }}
            className="text-base leading-relaxed max-w-xs lg:pl-6 lg:border-l"
          >
            We combine deep technical expertise with practical business
            understanding to build solutions that solve real problems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" role="list">
          {ILLUSTRATED.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>

      </div>
    </section>
  );
}
