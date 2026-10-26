import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/Arrow";
import { CtaBand } from "@/components/PageHeader";
import { ProductMark } from "@/components/ProductMark";
import { PROJECTS, projectBySlug } from "@/lib/projects";
import { JsonLd } from "@/components/JsonLd";
import { projectLd, breadcrumbLd } from "@/lib/seo";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.tagline,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} — ${project.category}`,
      description: project.tagline,
      url: `/projects/${project.slug}`,
      type: "article",
    },
  };
}

export default async function CaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const { name, category, status, summary, built, highlights, url, accent } = project;

  return (
    <>
      <JsonLd
        data={[
          projectLd(project),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.name, path: `/projects/${project.slug}` },
          ]),
        ]}
      />
      <header className="max-w-7xl mx-auto px-6 lg:px-10 pt-28 md:pt-36 pb-10 md:pb-14">
        <Link
          href="/projects"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
          className="inline-flex items-center gap-2 text-sm
                     transition-colors duration-150 hover:text-[var(--accent-terracotta)]"
        >
          <span aria-hidden="true">←</span>
          All projects
        </Link>

        <div className="mt-8 flex flex-col gap-7 md:flex-row md:items-start md:gap-10">
          <ProductMark slug={project.slug} size={96} />

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                className="eyebrow"
              >
                {category}
              </span>
              <span aria-hidden="true" style={{ color: "var(--text-muted)" }}>·</span>
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

            <h1
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
              className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3rem] font-bold leading-[1.1] tracking-tight"
            >
              {name}
            </h1>

            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                style={{ color: "var(--accent-terracotta)", fontFamily: "var(--font-inter)" }}
                className="inline-flex items-center gap-1.5 self-start text-sm
                           border-b border-current pb-0.5"
              >
                {url.replace(/^https?:\/\//, "")}
                <Arrow size={12} />
              </a>
            )}
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        {/* Terracotta rather than the project's accent: this is the most
            important paragraph on the page, and several of the project
            accents are dark greens that disappear against the dark theme. */}
        <p
          style={{ color: "var(--text-secondary)", borderLeftColor: "var(--accent-terracotta)", fontFamily: "var(--font-inter)" }}
          className="max-w-3xl border-l-2 pl-6 text-[1.0625rem] leading-relaxed"
        >
          {summary}
        </p>
      </section>

      <section aria-labelledby="built" className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <h2
          id="built"
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
          className="text-2xl font-bold mb-6"
        >
          What it does
        </h2>
        <ul className="flex max-w-3xl flex-col gap-3" role="list">
          {built.map((item) => (
            <li
              key={item}
              role="listitem"
              style={{ color: "var(--text-secondary)", borderBottomColor: "var(--border-subtle)", fontFamily: "var(--font-inter)" }}
              className="flex gap-3 border-b pb-3 text-base leading-relaxed"
            >
              <span style={{ backgroundColor: accent }} className="mt-2.5 h-1.5 w-1.5 shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby="highlights"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-subtle)" }}
        className="border-y"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
          <h2
            id="highlights"
            style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
            className="text-2xl font-bold mb-7"
          >
            Worth calling out
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((h) => (
              <div key={h.title} className="flex flex-col gap-2.5">
                <span style={{ backgroundColor: accent }} className="h-px w-8" aria-hidden="true" />
                <h3
                  style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
                  className="text-lg font-bold leading-snug"
                >
                  {h.title}
                </h3>
                <p
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
                  className="text-base leading-relaxed"
                >
                  {h.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
