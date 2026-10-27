"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface Slide {
  src: string;
  alt: string;
  caption: string;
}

/**
 * The band under the hero: what the work looks like.
 *
 * A full-width strip rather than something inside the hero, because the hero's
 * two columns are height-matched to the collage and a 21:9 image is only a
 * third that tall. Here it can be 550px of photograph at 1440, which is the
 * point of generating them.
 *
 * Cross-fades rather than slides sideways: these are photographs, and a
 * horizontal track would read as a slideshow widget. The first image is
 * `priority` and the rest are lazy, so the band never delays the hero.
 *
 * Rotation stops on hover, on focus, and permanently once someone picks a
 * slide, and never starts at all under `prefers-reduced-motion`. Same rule as
 * the testimonials, for the same reason: WCAG 2.2.2.
 */
const ADVANCE_MS = 6500;

export const HERO_SLIDES: Slide[] = [
  {
    src: "/hero/field-node.webp",
    alt: "Solar-powered sensor unit mounted on a pole at the edge of a farm at dusk",
    caption: "Farm telemetry, running in the field",
  },
  {
    src: "/hero/software-desk.webp",
    alt: "Developer at a desk reviewing a dashboard on a large monitor",
    caption: "Software built around how the business works",
  },
  {
    src: "/hero/bench.webp",
    alt: "Engineer soldering a circuit board at a workbench with an oscilloscope behind",
    caption: "Boards designed and assembled in-house",
  },
  {
    src: "/hero/ops-desk.webp",
    alt: "Dim operations desk with two monitors showing monitoring graphs and a server rack",
    caption: "Deployed, monitored, and still up in year three",
  },
  {
    src: "/hero/whiteboard.webp",
    alt: "Two colleagues at a whiteboard covered in diagrams, one holding a laptop",
    caption: "Scope, design and build in one team",
  },
  {
    src: "/hero/board-detail.webp",
    alt: "Close-up of a hand soldering components onto a green circuit board",
    caption: "Firmware, tested on the bench before it ships",
  },
];

export function HeroCarousel({ slides = HERO_SLIDES }: { slides?: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [taken, setTaken] = useState(false);

  useEffect(() => {
    if (held || taken || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      ADVANCE_MS,
    );
    return () => clearInterval(id);
  }, [held, taken, slides.length]);

  return (
    <section aria-label="What our work looks like" className="relative">
      <div
        className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[21/9]"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocusCapture={() => setHeld(true)}
        onBlurCapture={() => setHeld(false)}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={i === index ? slide.alt : ""}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}

        {/* The scrim is what makes the caption legible over whatever the
            photograph happens to be doing at the bottom edge. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(23,17,11,0.78) 0%, rgba(23,17,11,0.28) 32%, rgba(23,17,11,0) 55%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 pb-5 lg:px-10 lg:pb-6">
          <p
            aria-live="polite"
            style={{ color: "var(--text-on-invert)", fontFamily: "var(--font-playfair)" }}
            className="text-base leading-tight sm:text-lg lg:text-xl"
          >
            {slides[index].caption}
          </p>

          <div className="flex shrink-0 items-center">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setTaken(true);
                }}
                aria-label={`Show image ${i + 1} of ${slides.length}`}
                aria-current={i === index ? "true" : undefined}
                className="p-2.5 -m-2.5"
              >
                <span
                  style={{
                    backgroundColor:
                      i === index
                        ? "var(--text-on-invert)"
                        : "rgba(239, 235, 223, 0.42)",
                  }}
                  className="block h-0.5 w-6 transition-colors duration-200 sm:w-7"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
