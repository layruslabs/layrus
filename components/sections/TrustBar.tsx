import Image from "next/image";

/**
 * Trust strip — the "trusted by" band that sits under the hero.
 *
 * Layrus has no client logo files yet, so the names are set as type. Swap the
 * strings for <Image> logos when the real marks are available; the layout
 * takes either.
 *
 * The backdrop is a photo of a network — abstract enough to sit behind type.
 * It drifts (see `.photo-drift`), and the scrim is what keeps the names
 * readable over it, so it stays close to opaque.
 */
const PHOTO_NETWORK =
  "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1800&q=80";

const CLIENTS = [
  "Northbridge Group",
  "Sahel Logistics",
  "Kano Agri Co-op",
  "Meridian Health",
  "Lagos Retail Partners",
  "Vantage Energy",
] as const;

export function TrustBar() {
  return (
    <section
      aria-label="Organisations we work with"
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
            Trusted by
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
                  {CLIENTS.map((name) => (
                    <li
                      key={name}
                      style={{ color: "var(--text-on-invert)", fontFamily: "var(--font-playfair)" }}
                      className="mr-8 whitespace-nowrap text-base opacity-70 sm:text-xl lg:mr-12"
                    >
                      {name}
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
