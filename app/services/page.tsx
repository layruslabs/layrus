import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { PageHeader, CtaBand } from "@/components/PageHeader";
import { SERVICES, serviceHref } from "@/lib/services";
import { JsonLd } from "@/components/JsonLd";
import { collectionLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom software, AI automation, embedded engineering and the cloud work that keeps them running. What Layrus Labs does, and what each engagement covers.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd
        data={collectionLd(
          "Layrus Labs services",
          "/services",
          SERVICES.map((s) => ({ name: s.title, path: serviceHref(s) })),
        )}
      />
      <PageHeader
        eyebrow="Our Services"
        title="What we build, and how we work"
        intro="Six ways we get involved. Most engagements start with discovery, run through a build, and continue as something we look after — but you can enter at any point."
      />

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" role="list">
          {SERVICES.map((s) => (
            <article
              key={s.slug}
              role="listitem"
              style={{ borderColor: "var(--border-card)" }}
              className="group flex h-full flex-col border transition-colors duration-200
                         hover:bg-[var(--bg-surface)]"
            >
              <div className="flex flex-1 flex-col gap-3 p-6">
                <span
                  style={{ color: "var(--accent-terracotta)", fontFamily: "var(--font-inter)" }}
                  className="text-[0.6rem] tracking-[0.18em]"
                  aria-hidden="true"
                >
                  {s.num}
                </span>
                <h2
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
                  className="text-2xl font-bold leading-snug"
                >
                  {s.title}
                </h2>
                <p
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
                  className="text-base leading-relaxed"
                >
                  {s.tagline}
                </p>

                <ul className="mt-2 flex flex-col gap-1.5">
                  {s.includes.slice(0, 3).map((item) => (
                    <li
                      key={item}
                      style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                      className="flex gap-2.5 text-sm leading-snug"
                    >
                      <span style={{ backgroundColor: s.accent }} className="mt-1.5 h-1 w-1 shrink-0" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{ borderTopColor: "var(--border-subtle)" }}
                className="border-t p-6 pt-4"
              >
                <Link
                  href={serviceHref(s)}
                  aria-label={`More about ${s.title}`}
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter)" }}
                  className="inline-flex items-center gap-2 text-sm font-medium
                             transition-colors duration-150 hover:text-[var(--accent-terracotta)]"
                >
                  What this covers
                  <Arrow />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
