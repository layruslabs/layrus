"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** The shipped system the quote is about. Rendered as a link to its case
   *  study, so a claim in the hero can be checked against the work itself. */
  project?: { name: string; slug: string };
}

const ADVANCE_MS = 7000;

/**
 * Client quotes, one at a time, sliding between them.
 *
 * The slides sit in a flex row and the track translates by whole slides. Flex
 * stretches every slide to the tallest, so the block is the same height on
 * every slide — which is load-bearing here rather than tidy: the two hero
 * columns are matched by height, so a carousel that grew and shrank would
 * drag the whole grid around with it.
 *
 * It advances on its own, holds while the pointer or focus is on it, and stops
 * for good once someone picks a slide. Rotation that resumes after you have
 * deliberately chosen something is just a thing that moves.
 */
export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const [taken, setTaken] = useState(false);

  useEffect(() => {
    if (held || taken || items.length < 2) return;
    // Auto-rotation is motion; anyone who asked for less of it gets the first
    // quote and the dots, and nothing moving on its own.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      ADVANCE_MS,
    );
    return () => clearInterval(id);
  }, [held, taken, items.length]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="What clients say"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
      style={{ borderLeftColor: "var(--border-subtle)" }}
      className="relative flex flex-col border-l pl-6"
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((t, i) => (
            <figure
              key={t.name}
              aria-hidden={i !== index}
              /* justify-between pins the attribution to the foot of the slide
                 so it lines up with the dots whichever quote is showing */
              className="flex w-full shrink-0 flex-col justify-between gap-3"
            >
              <blockquote
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-playfair)" }}
                className="text-[1.375rem] leading-[1.5]"
              >
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                className="pr-28 text-[0.8125rem]"
              >
                {t.name} &middot; {t.role}, {t.company}
                {t.project && (
                  <>
                    {" · "}
                    <Link
                      href={`/projects/${t.project.slug}`}
                      style={{ color: "var(--accent-green)" }}
                      className="underline-offset-2 hover:underline"
                    >
                      {t.project.name}
                    </Link>
                  </>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Sits on the attribution's line rather than under it, so the carousel
          costs the column no height. The padding is the tap target; the
          negative margin takes it back out of the layout. */}
      <div className="absolute bottom-0 right-0 flex items-center">
        {items.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => {
              setIndex(i);
              setTaken(true);
            }}
            aria-label={`Show testimonial ${i + 1} of ${items.length}`}
            aria-current={i === index ? "true" : undefined}
            className="p-2.5 -m-2.5"
          >
            <span
              style={{
                backgroundColor:
                  i === index ? "var(--text-primary)" : "var(--border-subtle)",
              }}
              className="block h-0.5 w-7 transition-colors duration-200"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
