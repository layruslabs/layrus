import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { PageHeader, CtaBand } from "@/components/PageHeader";
import { ProductMark } from "@/components/ProductMark";
import { PROJECTS, type Project } from "@/lib/projects";
import { JsonLd } from "@/components/JsonLd";
import { collectionLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Systems Layrus Labs has designed, built and shipped — across automotive, financial services, agriculture, healthcare, education, mobility, logistics and blockchain.",
  alternates: { canonical: "/projects" },
};

function ProjectRow({ project }: { project: Project }) {
  const { slug, name, category, tagline, status, url } = project;

  return (
    <article
      role="listitem"
      style={{ borderColor: "var(--border-card)" }}
      className="flex flex-col gap-5 border p-6 md:flex-row md:items-start md:gap-8"
    >
      <div className="flex shrink-0 items-center gap-4 md:w-56 md:flex-col md:items-start">
        <ProductMark slug={slug} size={64} />
        <div className="flex flex-col gap-1">
          <span
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
            className="eyebrow"
          >
            {category}
          </span>
          <span
            style={{
              color: status === "Live" ? "var(--accent-green)" : "var(--text-muted)",
              fontFamily: "var(--font-inter)",
            }}
            className="text-[0.6875rem] uppercase tracking-[0.12em]"
          >
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <h2
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
          className="text-2xl font-bold leading-snug"
        >
          {name}
        </h2>
        <p
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
          className="text-base leading-relaxed"
        >
          {tagline}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-6">
          <Link
            href={`/projects/${slug}`}
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-inter)" }}
            className="inline-flex items-center gap-2 text-sm font-medium
                       transition-colors duration-150 hover:text-[var(--accent-terracotta)]"
          >
            Read the case study
            <Arrow />
          </Link>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noreferrer noopener"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
              className="inline-flex items-center gap-1.5 text-sm
                         transition-colors duration-150 hover:text-[var(--accent-terracotta)]"
            >
              {url.replace(/^https?:\/\//, "")}
              <Arrow size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <JsonLd
        data={collectionLd(
          "Systems Layrus Labs has built",
          "/projects",
          PROJECTS.map((p) => ({ name: p.name, path: `/projects/${p.slug}` })),
        )}
      />
      <PageHeader
        eyebrow="Shipped & Running"
        title="Systems we've built"
        intro="Fourteen systems, built end to end across automotive, financial services, agriculture, healthcare, education, mobility, logistics and blockchain. Each entry says whether it is live, in pilot or pre-launch, because a portfolio that rounds everything up to “live” is not much use to anybody."
      />

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="flex flex-col gap-5" role="list">
          {PROJECTS.map((p) => (
            <ProjectRow key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
