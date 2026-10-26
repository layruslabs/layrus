import Image from "next/image";

const PHOTO_WORKSPACE =
  "https://images.unsplash.com/photo-1600267175161-cfaa711b4a81?auto=format&fit=crop&w=1200&q=85";

const STATS = [
  { value: "3+", label: "Core Divisions" },
  { value: "Custom", label: "Solutions" },
  { value: "Long-Term", label: "Partnerships" },
] as const;

export function WhyLayrus() {
  return (
    <section
      aria-labelledby="why-layrus-heading"
      style={{ backgroundColor: "var(--bg-invert)" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[480px]">

        {/* ── Left — the argument ──────────────────────────────────── */}
        <div className="flex flex-col justify-between gap-10 px-8 py-14 md:px-12 lg:px-16">
          <div className="flex flex-col gap-6">
            <p
              style={{ color: "var(--accent-terracotta)", fontFamily: "var(--font-inter)" }}
              className="text-[0.8125rem] font-semibold tracking-[0.14em] uppercase"
            >
              // Why Layrus
            </p>

            <h2
              id="why-layrus-heading"
              style={{ color: "var(--text-on-invert)", fontFamily: "var(--font-playfair)" }}
              className="text-[2.75rem] sm:text-[3.5rem] lg:text-[3.75rem] font-bold leading-[1.1]"
            >
              From idea to
              <br />
              real-world impact.
            </h2>

            <p
              style={{ color: "var(--text-on-invert-muted)", fontFamily: "var(--font-inter)" }}
              className="text-[1.0625rem] leading-relaxed max-w-sm"
            >
              We don&rsquo;t just build technology. We engineer solutions that
              help businesses operate smarter, move faster and scale
              sustainably.
            </p>
          </div>

          <div
            role="list"
            aria-label="Layrus at a glance"
            style={{ borderTopColor: "var(--text-on-invert-faint)" }}
            className="flex flex-wrap sm:flex-nowrap items-stretch gap-4 sm:gap-0 pt-6 border-t"
          >
            {STATS.map((s, i) => (
              <div
                key={s.label}
                role="listitem"
                style={{ borderRightColor: "var(--text-on-invert-faint)" }}
                className={`flex flex-col gap-1 ${i > 0 ? "sm:pl-8" : ""} ${
                  i < STATS.length - 1 ? "sm:pr-8 sm:border-r" : ""
                }`}
              >
                <span
                  style={{ color: "var(--text-on-invert)", fontFamily: "var(--font-inter)" }}
                  className="text-xl font-bold leading-none tracking-tight"
                >
                  {s.value}
                </span>
                <span
                  style={{ color: "var(--text-on-invert-muted)", fontFamily: "var(--font-inter)" }}
                  className="text-[0.75rem] tracking-[0.14em] uppercase"
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — workspace photo with the strapline ───────────── */}
        <div className="relative min-h-[320px] lg:min-h-0">
          <Image
            src={PHOTO_WORKSPACE}
            alt="Engineer at a warm wooden workbench with a laptop and blueprints"
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
          <div className="absolute top-8 right-8 text-right z-10">
            <div
              style={{ backgroundColor: "var(--accent-terracotta)" }}
              className="w-6 h-px mb-3 ml-auto"
              aria-hidden="true"
            />
            <p
              style={{ color: "var(--text-on-invert-muted)", fontFamily: "var(--font-inter)" }}
              className="text-[0.75rem] tracking-[0.16em] uppercase leading-loose"
            >
              Better Systems.
              <br />
              Smarter Businesses.
              <br />
              A Stronger Tomorrow.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
