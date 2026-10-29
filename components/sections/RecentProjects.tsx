import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { ProductMark } from "@/components/ProductMark";
import { PROJECTS, type Project } from "@/lib/projects";

/* Each card leads with a screenshot of the product itself. The mark still
   identifies it in the compact grid under Platforms and at the top of its
   case study, but a portfolio card should show the thing, not its logo. */

function ProjectCard({ project }: { project: Project }) {
  const { slug, name, category, tagline, status, shot, own } = project;

  return (
    <article
      role="listitem"
      style={{ borderColor: "var(--border-card)" }}
      className="group flex h-full flex-col border transition-colors duration-200
                 hover:bg-[var(--bg-surface)]"
    >
      {/* Screenshots are 16:10, cropped from the top so the card shows the
          top of the page rather than a squeezed whole-page thumbnail. A
          product with no page to show keeps the same panel and falls back to
          its mark — a shorter panel would misalign the row. */}
      <div
        style={{ borderBottomColor: "var(--border-subtle)", backgroundColor: shot ? undefined : "var(--bg-surface)" }}
        className="media aspect-[16/10] border-b"
      >
        {shot ? (
          <Image
            src={shot}
            alt={`${name} landing page`}
            fill
            className="object-cover object-top"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <ProductMark slug={slug} size={72} />
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2.5 p-5 flex-1">
        <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }} className="eyebrow">
          {category}
          {own && " · In-house"}
        </p>
        <h3
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
          className="text-xl font-bold leading-snug"
        >
          {name}
        </h3>
        <p
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
          className="text-base leading-relaxed flex-1"
        >
          {tagline}
        </p>

        <div
          style={{ borderTopColor: "var(--border-subtle)" }}
          className="flex items-center justify-between gap-3 pt-3.5 mt-auto border-t"
        >
          <Link
            href={`/projects/${slug}`}
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
            className="flex items-center gap-1.5 text-sm font-medium
                       transition-colors duration-150 hover:text-[var(--accent-terracotta)]"
          >
            View case study
            <Arrow size={12} />
          </Link>
          {/* Two states, not three: shipped and running, or not yet. */}
          <span
            style={{
              color: status === "Live" ? "var(--accent-green)" : "var(--text-muted)",
              fontFamily: "var(--font-inter)",
            }}
            className="shrink-0 text-[0.6875rem] uppercase tracking-[0.12em]"
          >
            {status}
          </span>
        </div>
      </div>
    </article>
  );
}

export function RecentProjects() {
  return (
    <section aria-labelledby="projects-heading" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="flex items-end justify-between gap-4 mb-10">
          <div className="flex flex-col gap-3">
            <p className="section-label">Featured Work</p>
            <h2
              id="projects-heading"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
              className="text-[2.75rem] md:text-[3.5rem] font-bold"
            >
              Recent projects
            </h2>
          </div>
          <Link
            href="/projects"
            style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
            className="hidden sm:inline-flex items-center gap-1.5 text-base font-medium shrink-0
                       border-b border-current pb-0.5
                       transition-colors duration-150 hover:text-[var(--accent-terracotta)]"
          >
            View all projects
            <Arrow />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" role="list">
          {PROJECTS.filter((p) => p.featured).map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>

        <div className="sm:hidden mt-8 flex justify-center">
          <Link href="/projects" className="btn-outline">
            View all projects
            <Arrow />
          </Link>
        </div>

      </div>
    </section>
  );
}
