"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * The hero's backdrop: the six photographs cross-fading behind everything.
 *
 * Decorative, so it is `aria-hidden` and carries no captions or controls —
 * the hero's own content is the content. What keeps it readable is the wash:
 * the type in the hero is designed for the page colour, so the photograph sits
 * under a near-opaque layer of that colour and reads as depth rather than as
 * an image competing with the headline. The wash uses the theme token, so dark
 * mode gets the same treatment without a second rule.
 *
 * Same crops as the band had: all 21:9, so nothing changes height as they
 * cross-fade. Rotation stops entirely under `prefers-reduced-motion`; the
 * first photograph is `priority`, the rest lazy.
 */
const SLIDES = [
  "/hero/field-node.webp",
  "/hero/software-desk.webp",
  "/hero/bench.webp",
  "/hero/ops-desk.webp",
  "/hero/whiteboard.webp",
  "/hero/board-detail.webp",
];

const ADVANCE_MS = 7000;

export function HeroBackdrop() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      ADVANCE_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[1600ms] motion-reduce:transition-none ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      <div
        className="absolute inset-0"
        style={{ backgroundColor: "var(--bg-page)", opacity: 0.9 }}
      />
    </div>
  );
}
