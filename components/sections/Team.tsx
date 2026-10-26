import Image from "next/image";
import { TEAM, type Person } from "@/lib/team";

/**
 * The people behind the systems.
 *
 * Deliberately not a stock-photo wall: a portrait slot renders the real
 * photograph when one exists and the person's initials when it does not. An
 * initials tile is honest; a stock face on a named engineer is not, and it is
 * the first thing a prospective client checks when they ask to meet someone.
 *
 * Motion: each portrait drifts slowly and continuously, offset per person so
 * the row never pulses in unison, with the existing hover zoom on top. It is
 * compositor-only (transform), pure CSS, and off under prefers-reduced-motion.
 */
function Portrait({ person, index }: { person: Person; index: number }) {
  const initials = person.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <article
      role="listitem"
      className="group flex flex-col sm:flex-row gap-6"
    >
      <div
        style={{ borderColor: "var(--border-card)" }}
        className="media relative aspect-square w-full sm:w-44 sm:shrink-0 border"
      >
        {/* The drift lives on this wrapper, not on the photograph: with the
            initials fallback there is no image to move, and the section would
            otherwise sit completely still on any site without portraits yet. */}
        <span
          aria-hidden={person.photo ? undefined : true}
          className="portrait-drift absolute inset-0 block"
          style={{ animationDelay: `${index * -7}s` }}
        >
          {person.photo ? (
            <Image
              src={person.photo}
              alt={`${person.name}, ${person.role}`}
              fill
              className="object-cover object-center"
              sizes="(max-width:640px) 100vw, 176px"
            />
          ) : (
            <span
              style={{
                backgroundColor: "var(--bg-surface)",
                color: "var(--accent-green)",
                fontFamily: "var(--font-playfair)",
              }}
              className="absolute inset-0 flex items-center justify-center
                         text-5xl font-bold tracking-tight"
            >
              {initials}
            </span>
          )}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <h3
          style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
          className="text-2xl font-bold leading-snug"
        >
          {person.name}
        </h3>
        <p
          style={{ color: "var(--accent-terracotta)", fontFamily: "var(--font-inter)" }}
          className="eyebrow"
        >
          {person.role}
        </p>
        <p
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
          className="mt-1 text-base leading-relaxed"
        >
          {person.bio}
        </p>
        <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
          {person.focus.map((f) => (
            <li
              key={f}
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
              className="text-[0.75rem] uppercase tracking-[0.12em]"
            >
              {f}
            </li>
          ))}
        </ul>
        {(person.website || person.github || person.linkedin) && (
          <div className="mt-2 flex gap-4">
            {person.website && (
              <a
                href={person.website}
                target="_blank"
                rel="noreferrer noopener"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                className="text-sm border-b border-transparent pb-0.5
                           transition-colors hover:border-current hover:text-[var(--accent-terracotta)]"
              >
                {person.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            {person.github && (
              <a
                href={person.github}
                target="_blank"
                rel="noreferrer noopener"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                className="text-sm border-b border-transparent pb-0.5
                           transition-colors hover:border-current hover:text-[var(--accent-terracotta)]"
              >
                GitHub
              </a>
            )}
            {person.linkedin && (
              <a
                href={person.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                className="text-sm border-b border-transparent pb-0.5
                           transition-colors hover:border-current hover:text-[var(--accent-terracotta)]"
              >
                LinkedIn
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export function Team() {
  return (
    <section aria-labelledby="team-heading" className="py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 mb-12 items-end">
          <div className="flex flex-col gap-3">
            <p className="section-label">The people</p>
            <h2
              id="team-heading"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
              className="text-[2.75rem] md:text-[3.5rem] font-bold"
            >
              Who you actually work with
            </h2>
          </div>
          <p
            style={{ color: "var(--text-secondary)", borderLeftColor: "var(--border-subtle)", fontFamily: "var(--font-inter)" }}
            className="text-base leading-relaxed max-w-xs lg:pl-6 lg:border-l"
          >
            Small enough that the person who scopes your system is the person
            who builds it — and the one you can still reach in year three.
          </p>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10"
          role="list"
        >
          {TEAM.map((person, i) => (
            <Portrait key={person.name} person={person} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
