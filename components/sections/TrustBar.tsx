import Image from "next/image";
import { PROJECTS } from "@/lib/projects";

/**
 * The band under the hero: what is shipped and running.
 *
 * It used to read "Trusted by" over six invented company names. That is the
 * one kind of claim this site cannot back: only one deployment names its
 * client anywhere in the portfolio (Learn2Earn, on Recoding), and a marquee
 * of two real names looks like a mistake. So it says what is true instead —
 * the systems that are live, read from the same list the rest of the site
 * renders, which is why it cannot drift from the portfolio or the hero
 * counters.
 *
 * Set as type because there are no client logo files yet; the layout takes
 * <Image> marks if those arrive. The backdrop is a photo of a network,
 * abstract enough to sit behind type — it drifts (see `.photo-drift`), and
 * the scrim is what keeps the names readable over it, so it stays close to
 * opaque.
 */
const PHOTO_NETWORK =
  "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1800&q=80";

const LIVE = PROJECTS.filter((p) => p.status === "Live");

export function TrustBar() {
  return (
    <section
      aria-label="Systems shipped and running in production"
      className="relative overflow-hidden"
    >
      <Image
        src={PHOTO_NETWORK}
        alt=""
        fill
        className="photo-drift object-cover"
        sizes="100vw"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundColor: "var(--bg-invert)", opacity: 0.62 }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-7">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
          <p
            style={{ color: "var(--text-on-invert-muted)", fontFamily: "var(--font-inter)" }}
            className="eyebrow shrink-0"
          >
            Shipped and running
          </p>
          {/* The names cross the band. Two identical groups sit side by side
              and the track slides exactly half its width, so the loop closes
              on itself — the second copy is the one doing the work at any
              moment the first has scrolled away. It is hidden from assistive
              tech, which has already read the list once. */}
          <div className="marquee min-w-0 sm:flex-1">
            <div className="marquee-track">
              {[false, true].map((duplicate) => (
                <ul
                  key={String(duplicate)}
                  className="marquee-group"
                  aria-hidden={duplicate || undefined}
                >
                  {LIVE.map((project) => (
                    <li
                      key={project.slug}
                      style={{ color: "var(--text-on-invert)", fontFamily: "var(--font-playfair)" }}
                      className="mr-8 whitespace-nowrap text-base opacity-70 sm:text-xl lg:mr-12"
                    >
                      {project.name}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
