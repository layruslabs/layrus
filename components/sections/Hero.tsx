import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { HeroBackdrop } from "@/components/sections/HeroBackdrop";
import { TestimonialCarousel, type Testimonial } from "@/components/TestimonialCarousel";
import { PROJECTS } from "@/lib/projects";
import { SERVICES } from "@/lib/services";

/* PLACEHOLDER — every quote and person below is invented, like the client
   names in TrustBar. Replace with real, attributable quotes before launch; an
   invented one attributed to a named person is a liability.

   Each quote is anchored to one of the systems in lib/projects, and describes
   a mechanism that system actually has — the link beside it opens the case
   study. Keep it that way. A quote that praises work the portfolio does not
   contain is the one a visitor can catch, and once they have caught it every
   other claim on the page is worth less.

   Keep them about the same length. The carousel is as tall as its longest
   slide, and the hero's two columns are matched by height, so one runaway
   quote drags the whole grid down with it. */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We quoted from memory and lost track of who approved what. The customer now gets a running estimate, and work does not continue until they accept it.",
    name: "Emeka Nwosu",
    role: "Workshop Manager",
    company: "Mercedes-Benz specialist",
    project: { name: "RCareNG", slug: "rcareng" },
  },
  {
    quote:
      "Marking code by hand took the team a week. Candidates now write against a real runtime, and we can replay how any answer was produced.",
    name: "Halima Sani",
    role: "Programme Lead",
    company: "Coding bootcamp",
    project: { name: "Recoding", slug: "recoding" },
  },
  {
    quote:
      "The client's money is held before work starts and only released when they approve it. Neither side is relying on the other's goodwill.",
    name: "Tobi Adebayo",
    role: "Founder",
    company: "Software studio",
    project: { name: "Digital Tech Talent Hub", slug: "digital-tech-talent-hub" },
  },
];

/**
 * The three numbers in the hero, counted rather than claimed.
 *
 * They used to read "50+ Projects Delivered" and "98% Client Satisfaction" —
 * neither had a source, and the first contradicted the portfolio two sections
 * below it, which lists nine systems by name. Anything here is now derived
 * from the data, so the hero cannot say something the rest of the page
 * disproves, and a project going live updates it without anyone remembering to.
 */
const STATS = [
  { value: String(PROJECTS.length), label: "Systems built", color: "var(--stat-1)" },
  {
    value: String(PROJECTS.filter((p) => p.status === "Live").length),
    label: "Live in production",
    color: "var(--stat-2)",
  },
  { value: String(SERVICES.length), label: "Services offered", color: "var(--stat-3)" },
];

/* ─── Stat ──────────────────────────────────────────────────────────────────── */
function Stat({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        style={{ color, fontFamily: "var(--font-inter)" }}
        className="text-[2.125rem] font-bold leading-none tracking-tight"
      >
        {value}
      </span>
      <span
        style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
        className="text-sm font-medium"
      >
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20"
    >
      <HeroBackdrop />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Columns stretch to a common height — the collage sets it, and the
            stats ride the bottom of it rather than leaving the pitch short. */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.12fr_1fr] gap-12 lg:gap-10">

          {/* ── Left — the pitch ─────────────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:pt-2">
            <p className="section-label">Engineering Technology</p>

            <h1
              id="hero-heading"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
              className="text-[2.5rem] sm:text-[3rem] lg:text-[3.25rem] xl:text-[3.5rem] font-bold leading-[1.06] tracking-tight"
            >
              We build technology
              <br />
              around your business<span style={{ color: "var(--accent-terracotta)" }}>.</span>
            </h1>

            <p
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
              className="text-[1.0625rem] leading-relaxed max-w-md"
            >
              Layrus Labs designs, builds and implements custom software
              systems, AI solutions and connected hardware for real-world
              businesses.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-1">
              <Link href="/contact" className="btn-primary">
                Start a project
                <Arrow />
              </Link>
              <Link href="/projects" className="btn-ghost">
                Explore our work
                <Arrow />
              </Link>
            </div>

            <TestimonialCarousel items={TESTIMONIALS} />

            {/* Stats — ruled off from each other, as in the design */}
            <div
              role="list"
              aria-label="Layrus at a glance"
              style={{ borderTopColor: "var(--rule)" }}
              className="mt-2 lg:mt-auto flex flex-wrap items-stretch gap-y-6 pt-8 border-t"
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  role="listitem"
                  style={{ borderRightColor: "var(--rule)" }}
                  className={`flex-1 pr-6 ${i > 0 ? "pl-6" : ""} ${i < 2 ? "border-r" : ""}`}
                >
                  <Stat {...s} />
                </div>
              ))}
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}
