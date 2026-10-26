import Image from "next/image";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { ArchitectureDiagram, type DiagramSpec } from "@/components/ArchitectureDiagram";
import { TestimonialCarousel, type Testimonial } from "@/components/TestimonialCarousel";
import { PROJECTS } from "@/lib/projects";
import { SERVICES } from "@/lib/services";

/* PLACEHOLDER — every quote, person and role below is invented, like the
   client names in TrustBar. Replace with real, attributable quotes before
   launch; an invented one attributed to a named person is a liability.

   Keep them about the same length. The carousel is as tall as its longest
   slide, and the hero's two columns are matched by height, so one runaway
   quote drags the whole grid down with it. */
const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Our operations ran on three systems that never agreed with each other. Layrus replaced them with one, and month-end close went from nine days to two.",
    name: "Adaeze Okonkwo",
    role: "Operations Director",
    company: "Meridian Health",
  },
  {
    quote:
      "We tracked fleet maintenance on spreadsheets across four depots. Layrus built one platform, and the same data now schedules every service.",
    name: "Ibrahim Danladi",
    role: "Fleet Manager",
    company: "Sahel Logistics",
  },
  {
    quote:
      "Stock counts took three days and were stale before they landed. They now reconcile across every branch the same evening, out of one system.",
    name: "Grace Adeyemi",
    role: "General Manager",
    company: "Kano Agri Co-op",
  },
];

/* ─── Photos ────────────────────────────────────────────────────────────────── */
const PHOTO_ENGINEER =
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=85";
const PHOTO_PCB =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=85";

const HERO_ARCH: DiagramSpec = {
  caption: "System Architecture",
  stages: [
    {
      nodes: [
        { label: "Users", icon: "users" },
        { label: "Client", icon: "web" },
        { label: "APIs", icon: "api" },
      ],
    },
    { band: true, nodes: [{ label: "Backend Services", icon: "server" }] },
    {
      nodes: [
        { label: "Database", icon: "db" },
        { label: "AI Models", icon: "spark" },
        { label: "Cloud", icon: "cloud" },
      ],
    },
  ],
  skipDrops: [[0, 0]],   // users arrive through the client, not directly
  // The signal arrives at the right-hand drop, so it works back along the
  // stores rather than jumping to the far left one:
  // Users, Client, APIs, Backend, Cloud, AI Models, Database.
  order: [[0, 0], [0, 1], [0, 2], [1, 0], [2, 2], [2, 1], [2, 0]],
};

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
        className="text-3xl font-bold leading-none tracking-tight"
      >
        {value}
      </span>
      <span
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
        className="text-[0.8125rem]"
      >
        {label}
      </span>
    </div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="pt-28 pb-16 md:pt-32 md:pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
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

          {/* ── Right — editorial collage, angled off the page ───────── */}
          <div
            className="flex flex-col gap-3"
            style={{ transform: "perspective(1400px) rotateY(-9deg)" }}
          >

            {/* Row 1: engineer photo | tagline + PCB.
                The photo's ratio is what sets this row's height, and the row
                is what sets the collage's — it is trimmed to land the collage
                on the same height as the pitch beside it, so neither column
                ends up with slack the other has to stretch into. */}
            <div className="grid grid-cols-[1.02fr_1fr] gap-3">
              <div className="media aspect-[14/9]">
                <Image
                  src={PHOTO_ENGINEER}
                  alt="Engineer working at a laptop with code on screen"
                  fill
                  className="object-cover"
                  sizes="(max-width:1024px) 50vw, 26vw"
                  priority
                />
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3 pb-1">
                  <p
                    style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                    className="eyebrow leading-relaxed"
                  >
                    Software / AI / Embedded
                    <br />
                    Built for what&rsquo;s next
                  </p>
                  <span
                    style={{ borderColor: "var(--border-subtle)" }}
                    className="mt-0.5 hidden h-4 w-4 shrink-0 border sm:block"
                    aria-hidden="true"
                  />
                </div>

                <div className="media min-h-[110px] flex-1">
                  <Image
                    src={PHOTO_PCB}
                    alt="Close-up of a printed circuit board"
                    fill
                    className="object-cover"
                    sizes="(max-width:1024px) 50vw, 24vw"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: the architecture card, full width of the column */}
            <figure
              aria-label="System architecture overview"
              style={{ backgroundColor: "var(--bg-page)", borderColor: "var(--border-card)" }}
              className="relative z-10 -mt-14 border p-5"
            >
              <ArchitectureDiagram spec={HERO_ARCH} />
            </figure>

          </div>
        </div>
      </div>
    </section>
  );
}
