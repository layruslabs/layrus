import Image from "next/image";

/**
 * Each product's own mark, at whatever size the caller needs.
 *
 * Two of these ship as real logo files. The other two have no logo asset at
 * all — their brands exist only as inline SVG inside their own front ends —
 * so the geometry here is copied from those components and drawn on the tile
 * each product puts it on. Nothing is redrawn by eye: the bolt path and the
 * crosshair coordinates are lifted verbatim, and the colours are the products'
 * own accent tokens.
 *
 * All four are decorative. The product name is always set as text beside them,
 * so the mark carries no information the page does not already state.
 */
export function ProductMark({ slug, size = 32 }: { slug: string; size?: number }) {
  if (slug === "rcareng" || slug === "videosynx" || slug === "peeng") {
    return (
      <Image
        src={`/projects/${slug}.png`}
        alt=""
        width={size}
        height={size}
        className="object-contain"
      />
    );
  }

  if (slug === "digital-tech-talent-hub") {
    // Their navbar: a crosshair over a near-black tile, with the two corner
    // marks that sit at 1.5 units in the original 28px container.
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" fill="#05070a" />
        <g transform="translate(4 4) scale(1.7143)" fill="none" stroke="#4ffbf2">
          <line x1="7" y1="1" x2="7" y2="13" strokeWidth="0.8" opacity="0.7" />
          <line x1="1" y1="7" x2="13" y2="7" strokeWidth="0.8" opacity="0.7" />
          <circle cx="7" cy="7" r="2.5" strokeWidth="1" opacity="0.9" />
          <circle cx="7" cy="7" r="1" fill="#4ffbf2" stroke="none" />
        </g>
        <g fill="none" stroke="#4ffbf2" strokeWidth="1" opacity="0.6">
          <path d="M3 8V3h5" />
          <path d="M29 24v5h-5" />
        </g>
      </svg>
    );
  }

  return null;
}
