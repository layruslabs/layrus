/**
 * LayrusWordmark — the LAYRUS logotype, set in the brand face.
 *
 * The face is traced from public/custom_font.png (see
 * scripts/build-brand-font.py), so this is the logotype itself rather than a
 * redrawing of it: the letterforms and the letter spacing — including the
 * A/Y interlock — come straight out of the bitmap via the font's kern
 * feature.
 *
 * This is the wordmark only. The brand mark that sits beside it is the
 * pangolin in public/logo.png.
 */

/* Cap height of the face, in font units per em. */
const CAP_RATIO = 0.7;

/** Font size that renders a given cap height. */
function sizeFor(capHeight: number) {
  return `${capHeight / CAP_RATIO}px`;
}

const baseStyle = {
  fontFamily: "var(--font-layrus)",
  fontKerning: "normal",
  lineHeight: 1,
  whiteSpace: "nowrap",
} as const;

interface LayrusWordmarkProps {
  /** CSS color value — defaults to currentColor so it inherits from parent */
  color?: string;
  /** Cap height in px. Width follows the logotype's own proportions. */
  height?: number;
  className?: string;
}

export function LayrusWordmark({
  color = "currentColor",
  height = 28,
  className,
}: LayrusWordmarkProps) {
  return (
    <span
      className={className}
      style={{ ...baseStyle, color, fontWeight: 700, fontSize: sizeFor(height) }}
    >
      LAYRUS
    </span>
  );
}

interface LayrusTaglineProps {
  color?: string;
  /** Cap height in px. The logotype sets it at 0.335 of the wordmark's. */
  height?: number;
  className?: string;
}

/**
 * The line under the wordmark: LABS, since the company became Layrus Labs Ltd.
 *
 * **Set in Inter, not the brand face**, and that is deliberate rather than a
 * shortcut. The display face is traced from a bitmap of the old logotype — two
 * rows, LAYRUS in Bold and TECHNOLOGY in Regular, sharing no letters. Regular
 * has neither an A nor an S, so "LABS" in it renders two empty boxes; Bold has
 * both, but setting the tagline in Bold makes it as heavy as the wordmark it
 * sits under. The display face is for the logotype. A descriptor is text, and
 * text is what a text face is for.
 *
 * Tracked wide so it reads as a label under the wordmark rather than as a
 * second word competing with it.
 */
export function LayrusTagline({
  color = "currentColor",
  height = 5.4,
  className,
}: LayrusTaglineProps) {
  return (
    <span
      className={className}
      style={{
        color,
        fontFamily: "var(--font-inter)",
        fontWeight: 500,
        // Inter's cap height is 0.727em where the display face's is 0.70, so
        // the caller's cap height has to be converted, not passed through.
        fontSize: `${height / 0.727}px`,
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      LABS
    </span>
  );
}
