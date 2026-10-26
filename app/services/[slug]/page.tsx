import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/Arrow";
import { PageHeader, CtaBand } from "@/components/PageHeader";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { SERVICES, serviceBySlug, serviceHref } from "@/lib/services";
import { JsonLd } from "@/components/JsonLd";
import { serviceLd, breadcrumbLd } from "@/lib/seo";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.tagline,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = serviceBySlug(slug);
  // An unknown slug is a real 404, not an empty page: it renders the branded
  // not-found inside the shell rather than a page promising a service that
  // does not exist.
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <JsonLd
        data={[
          serviceLd(service),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
        ]}
      />
      <PageHeader
        eyebrow={`Service ${service.num}`}
        title={service.title}
        intro={service.intro}
      />

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-start">

          <div className="flex flex-col gap-5">
            <h2
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
              className="text-2xl font-bold"
            >
              What this covers
            </h2>
            <ul className="flex flex-col gap-3" role="list">
              {service.includes.map((item) => (
                <li
                  key={item}
                  role="listitem"
                  style={{ color: "var(--text-secondary)", borderBottomColor: "var(--border-subtle)", fontFamily: "var(--font-inter)" }}
                  className="flex gap-3 border-b pb-3 text-base leading-relaxed"
                >
                  <span
                    style={{ backgroundColor: service.accent }}
                    className="mt-2.5 h-1.5 w-1.5 shrink-0"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {service.arch ? (
            <figure
              aria-label={`${service.title} architecture`}
              style={{ backgroundColor: "var(--bg-page)", borderColor: "var(--border-card)" }}
              className="border p-5"
            >
              <ArchitectureDiagram spec={service.arch} />
              <figcaption
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                className="mt-4 text-sm leading-relaxed"
              >
                How a system in this discipline is put together, drawn in the
                same language as every other diagram on the site.
              </figcaption>
            </figure>
          ) : (
            <div
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-card)" }}
              className="flex flex-col gap-4 border p-6"
            >
              <h2
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
                className="text-xl font-bold"
              >
                Where this usually starts
              </h2>
              <p
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
                className="text-base leading-relaxed"
              >
                A conversation about what is actually slowing you down, and
                whether it needs building at all. If a smaller change would
                do, we will say so.
              </p>
              <Link href="/contact" className="btn-primary self-start">
                Start that conversation
                <Arrow />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section
        aria-labelledby="other-services"
        style={{ borderTopColor: "var(--border-subtle)" }}
        className="border-t"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          <p id="other-services" className="section-label">Also</p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={serviceHref(s)}
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
                  className="text-base border-b border-transparent pb-0.5
                             transition-colors duration-150 hover:border-current hover:text-[var(--accent-terracotta)]"
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
