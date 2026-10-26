#!/usr/bin/env python3
"""Build the Layrus brand fonts from public/custom_font.png.

The logo bitmap holds two weights of one geometric typeface:

    LAYRUS       heavy   (stroke ~20.6% of cap height)
    TECHNOLOGY   regular (stroke ~12.2% of cap height)

Every letter is traced from the bitmap into exact lines and circular arcs, so
each font reproduces its half of the logo to well under half a pixel. Letters
that only exist in one row are only in that weight; the two weights between
them cover every letter of the logo.

Usage:  python3 scripts/build-brand-font.py [--check]

Needs:  pillow, fonttools, brotli  (pip install pillow fonttools brotli)
"""
import os
import sys

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from brandfont import vectorize as V  # noqa: E402

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, "public", "custom_font.png")
OUT_DIR = os.path.join(ROOT, "app", "fonts")

UPEM = 1000
CAP_UNITS = 700          # cap height in font units
LEVEL = 146.0            # greyscale level of the traced outline (ink ~39, paper 255)

# Which rows of the bitmap are which weight, and what each row spells.
PLAN = [
    dict(family="Layrus Display", style="Bold", row=0,
         text="LAYRUS", space=250),
    dict(family="Layrus Display", style="Regular", row=1,
         text="TECHNOLOGY", space=400),
]


# ---------------------------------------------------------------- helpers


def load_gray(path):
    """Composite the PNG on white and return a 2D list of greyscale values."""
    im = Image.open(path)
    if im.mode != "RGBA":
        im = im.convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    comp = Image.alpha_composite(bg, im).convert("L")
    w, h = comp.size
    px = comp.load()
    return [[float(px[x, y]) for x in range(w)] for y in range(h)], (w, h)


def row_bands(gray, level, min_gap=8):
    """Vertical bands of ink, i.e. the text rows."""
    h, w = len(gray), len(gray[0])
    rows = [any(gray[y][x] < level for x in range(w)) for y in range(h)]
    bands, start = [], None
    for y, ink in enumerate(rows):
        if ink and start is None:
            start = y
        elif not ink and start is not None:
            bands.append((start, y - 1))
            start = None
    if start is not None:
        bands.append((start, h - 1))
    # merge bands separated by a small gap (e.g. an isolated dot)
    merged = []
    for b in bands:
        if merged and b[0] - merged[-1][1] <= min_gap:
            merged[-1] = (merged[-1][0], b[1])
        else:
            merged.append(b)
    return merged


def baseline_and_cap(fitted_loops):
    """Baseline and cap line are the lowest and highest flat edges in the row;
    rounded letters overshoot them slightly and are (correctly) ignored."""
    ys = []
    for prims, _holes in fitted_loops:
        for pr in prims:
            m = pr["model"]
            if pr.get("closed") or m.kind != "line":
                continue
            (xa, ya), (xb, yb) = pr["start"], pr["end"]
            if abs(yb - ya) <= 0.5:
                ys.append((ya + yb) / 2)
    if len(ys) < 2:
        raise SystemExit("could not find the baseline/cap line for a row")
    ys.sort()
    return ys[-1], ys[0]


def contour_area(pts):
    s = 0.0
    n = len(pts)
    for i in range(n):
        x0, y0 = pts[i]
        x1, y1 = pts[(i + 1) % n]
        s += x0 * y1 - x1 * y0
    return s / 2


# ---------------------------------------------------------------- tracing


def trace_rows(gray, size, level):
    """Trace the bitmap and group contours into rows of glyphs."""
    loops = V.extract_contours(gray, level)
    fitted = [V.fit_loop(l) for l in loops]

    bands = row_bands(gray, level)
    rows = [[] for _ in bands]
    for loop, prims in zip(loops, fitted):
        cy = sum(p[1] for p in loop) / len(loop)
        for i, (y0, y1) in enumerate(bands):
            if y0 - 2 <= cy <= y1 + 2:
                rows[i].append((loop, prims))
                break


    out = []
    for row in rows:
        # an outer contour encloses an odd number of others (holes nested in it)
        outers, holes = [], []
        for loop, prims in row:
            depth = sum(1 for other, _ in row
                        if other is not loop and V.point_in_loop(other, loop[0]))
            (holes if depth % 2 else outers).append((loop, prims))
        outers.sort(key=lambda lf: min(p[0] for p in lf[0]))
        glyphs = []
        for loop, prims in outers:
            mine = [pr for other, pr in holes if V.point_in_loop(loop, other[0])]
            glyphs.append((loop, prims, mine))
        out.append(glyphs)
    return list(zip(out, bands))


# ---------------------------------------------------------------- font


# ---------------------------------------------------------------- the B

# Stroke widths of the two traced rows, as fractions of cap height. Recorded
# at the top of this file and repeated here so build_b() can match whichever
# weight it is drawing for.
STROKE = {"Bold": 0.206, "Regular": 0.122}

# Cubic approximation of a quarter arc — the standard 4/3·tan(π/8) constant.
_K = 0.5523


def _half_ellipse(cx, cy, rx, ry, upward):
    """The right half of an ellipse, as two cubics, top-to-bottom or the
    reverse. `upward` decides which end the contour starts at, which is what
    sets its winding."""
    top, right, bottom = (cx, cy + ry), (cx + rx, cy), (cx, cy - ry)
    # Leaving `top` the tangent is horizontal, so the first control point sits
    # out along x; arriving at `right` it is vertical, so the second sits along
    # y. Swapping them pinches the curve into a point instead of a bowl.
    if upward:
        return [
            ("C", bottom, (cx + rx * _K, cy - ry), (cx + rx, cy - ry * _K), right),
            ("C", right, (cx + rx, cy + ry * _K), (cx + rx * _K, cy + ry), top),
        ]
    return [
        ("C", top, (cx + rx * _K, cy + ry), (cx + rx, cy + ry * _K), right),
        ("C", right, (cx + rx, cy - ry * _K), (cx + rx * _K, cy - ry), bottom),
    ]


def build_b(stroke):
    """A `B`, drawn rather than traced.

    The source bitmap reads LAYRUS / TECHNOLOGY and has no B in it, so there is
    nothing to trace. This is the same construction the rest of the face is: a
    stem and two half-elliptical bowls, at the stroke width of the weight it is
    drawn for, so it sits correctly between the letters either side.

    Outer contour runs clockwise and the two counters anticlockwise, which is
    what TrueType wants (y-up) and what the traced glyphs are corrected to.
    """
    mid = 0.53 * CAP_UNITS          # where the two bowls meet
    # Roughly one cap height wide, which is where the traced O sits — an
    # earlier 0.60 of cap made a B noticeably narrower than its neighbours.
    w = 1.0 * CAP_UNITS             # outer extent, right of the stem
    up_cy, up_ry = (CAP_UNITS + mid) / 2, (CAP_UNITS - mid) / 2
    lo_cy, lo_ry = mid / 2, mid / 2

    outer = [
        ("L", (0.0, CAP_UNITS), (0.0, CAP_UNITS)),  # moveTo, then the bulge
        *_half_ellipse(0.0, up_cy, w, up_ry, upward=False),
        *_half_ellipse(0.0, lo_cy, w, lo_ry, upward=False),
        ("L", (0.0, 0.0), (0.0, CAP_UNITS)),        # back up the stem
    ]
    upper = _half_ellipse(stroke, up_cy, w - 2 * stroke, up_ry - stroke, upward=True)
    lower = _half_ellipse(stroke, lo_cy, w - 2 * stroke, lo_ry - stroke, upward=True)
    return [outer, upper, lower]


def to_font_units(pts, x0, baseline, scale, lsb):
    return [((x - x0) * scale + lsb, (baseline - y) * scale) for x, y in pts]


def draw_contour(pen, contour):
    """contour: list of ('L', p0, p1) / ('C', p0, c1, c2, p1) in font units."""
    pen.moveTo(contour[0][1])
    for seg in contour:
        if seg[0] == "L":
            pen.lineTo(seg[2])
        else:
            pen.curveTo(seg[2], seg[3], seg[4])
    pen.closePath()


def build_font(spec, glyphs_data, out_dir):
    """glyphs_data: list of (char, contours_font_units, advance, lsb)."""
    family, style = spec["family"], spec["style"]
    glyph_order = [".notdef"] + [c for c, _, _, _ in glyphs_data] + ["space"]
    cmap = {ord(c): c for c, _, _, _ in glyphs_data}
    cmap[ord(" ")] = "space"
    # caps-only display face: let lowercase reach the same glyphs
    for c, _, _, _ in glyphs_data:
        cmap[ord(c.lower())] = c

    metrics = {".notdef": (500, 0), "space": (spec["space"], 0)}
    glyf = {}

    pen = TTGlyphPen(None)
    pen.moveTo((50, 0)); pen.lineTo((50, CAP_UNITS * 0.7))
    pen.lineTo((CAP_UNITS * 0.45, CAP_UNITS * 0.7))
    pen.lineTo((CAP_UNITS * 0.45, 0)); pen.closePath()
    glyf[".notdef"] = pen.glyph()
    glyf["space"] = TTGlyphPen(None).glyph()

    for char, contours, advance, lsb in glyphs_data:
        pen = TTGlyphPen(None)
        cu2qu = Cu2QuPen(pen, max_err=0.6, reverse_direction=False)
        for contour in contours:
            draw_contour(cu2qu, contour)
        glyf[char] = pen.glyph()
        metrics[char] = (advance, lsb)

    fb = FontBuilder(UPEM, isTTF=True)
    fb.setupGlyphOrder(glyph_order)
    fb.setupCharacterMap(cmap)
    fb.setupGlyf(glyf)
    fb.setupHorizontalMetrics(metrics)
    fb.setupHorizontalHeader(ascent=int(CAP_UNITS * 1.15), descent=-int(UPEM * 0.2))
    fb.setupNameTable({
        "familyName": family,
        "styleName": style,
        "fullName": f"{family} {style}",
        "psName": f"{family.replace(' ', '')}-{style}",
        "version": "Version 1.000",
        "uniqueFontIdentifier": f"{family.replace(' ', '')}-{style};1.000",
        "manufacturer": "Layrus Technology",
        "designer": "Traced from the Layrus logotype",
        "description": f"{family} {style} — geometric display face traced from the "
                       f"Layrus logotype (custom_font.png).",
    })
    fb.setupOS2(sTypoAscender=int(CAP_UNITS * 1.15), sTypoDescender=-int(UPEM * 0.2),
                sCapHeight=CAP_UNITS, sxHeight=CAP_UNITS, usWinAscent=int(CAP_UNITS * 1.15),
                usWinDescent=int(UPEM * 0.2))
    fb.setupPost(isFixedPitch=0)
    fb.setupDummyDSIG()

    base = f"{family.replace(' ', '')}-{style}"
    ttf = os.path.join(out_dir, base + ".ttf")
    fb.save(ttf)
    return ttf, base


def add_kerning(ttf_path, pairs):
    """Write the logo's own letter spacing as a GPOS `kern` feature, which is
    what browsers actually honour (the legacy kern table is also written, for
    older desktop software)."""
    from fontTools.ttLib import TTFont, newTable
    from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
    font = TTFont(ttf_path)
    if pairs:
        fea = "feature kern {\n" + "".join(
            f"    pos {a} {b} {v};\n" for (a, b), v in pairs.items()) + "} kern;\n"
        addOpenTypeFeaturesFromString(font, fea)
        from fontTools.ttLib.tables._k_e_r_n import KernTable_format_0
        kern = newTable("kern")
        kern.version = 0
        sub = KernTable_format_0()
        sub.coverage = 1
        sub.version = 0
        sub.kernTable = {(a, b): v for (a, b), v in pairs.items()}
        kern.kernTables = [sub]
        font["kern"] = kern
    font.save(ttf_path)


# ---------------------------------------------------------------- main


def main():
    gray, size = load_gray(SOURCE)
    rows = trace_rows(gray, size, LEVEL)
    os.makedirs(OUT_DIR, exist_ok=True)

    made = []
    for spec in PLAN:
        row, band = rows[spec["row"]]
        text = spec["text"]
        if len(row) != len(text):
            raise SystemExit(f"{spec['style']}: found {len(row)} glyphs, "
                             f"expected {len(text)} for {text!r}")

        baseline, capline = baseline_and_cap([(p, h) for _, p, h in row])
        scale = CAP_UNITS / (baseline - capline)

        # Side bearings come from the logo's own letter gaps, so the font's
        # default spacing already looks like the logotype and the kern feature
        # only has to cover the exceptions.
        gaps = []
        for i in range(len(row) - 1):
            a = [p[0] for p in row[i][0]]
            b = [p[0] for p in row[i + 1][0]]
            gaps.append(min(b) - max(a))
        gaps.sort()
        lsb = max(int(round(gaps[len(gaps) // 2] / 2 * scale)), int(0.01 * UPEM))

        glyphs, seen, positions, widths, advance_of = [], {}, [], [], {}
        for (loop, prims, holes), char in zip(row, text):
            xs = [p[0] for p in loop]
            x0 = min(xs)
            ink_w = (max(xs) - x0) * scale
            positions.append(x0)
            widths.append(ink_w)
            if char in seen:      # a repeated letter (the O of TECHNOLOGY)
                continue
            contours = []
            for contour_prims in [prims] + holes:
                segs = _to_font_units(V.to_segments(contour_prims),
                                      x0, baseline, scale, lsb)
                pts = V.flatten(segs, steps=8)
                # TrueType wants outer contours clockwise (y-up), holes the
                # other way round
                want_positive = contour_prims in holes
                area = contour_area(pts)
                if (area > 0) != want_positive:
                    segs = _reverse_segments(segs)
                contours.append(segs)
            advance = int(round(lsb + ink_w + lsb))
            glyphs.append((char, contours, advance, lsb))
            seen[char] = True
            advance_of[char] = advance

        # The B has no source in the bitmap, so it is drawn to the face's own
        # geometry at this weight's stroke width. Everything else is traced.
        if "B" not in seen:
            ink_w = 1.0 * CAP_UNITS
            glyphs.append(
                ("B", build_b(STROKE[spec["style"]] * CAP_UNITS),
                 int(round(lsb + ink_w + lsb)), lsb)
            )

        ttf, base = build_font(spec, glyphs, OUT_DIR)

        # Kerning that reproduces the logo's own spacing exactly.
        kern = {}
        for i in range(len(text) - 1):
            want = (positions[i + 1] - positions[i]) * scale
            # against the glyph's own advance, so a repeated letter (the O of
            # TECHNOLOGY) kerns correctly off the advance that is actually used
            kern[(text[i], text[i + 1])] = int(round(want - advance_of[text[i]]))
        add_kerning(ttf, kern)

        # WOFF2 next to it
        from fontTools.ttLib import TTFont
        font = TTFont(ttf)
        font.flavor = "woff2"
        woff2 = os.path.join(OUT_DIR, base + ".woff2")
        font.save(woff2)

        dev = max(V.max_deviation(prims, loop) for loop, prims, _ in row)
        made.append((base, len(glyphs), dev, kern))
        print(f"{base}: {len(glyphs)} glyphs, worst fit {dev:.3f}px, "
              f"cap {baseline - capline:.2f}px -> {CAP_UNITS} units")
        print(f"   kerning {kern}")

    print("\nwrote:")
    for base, n, _, _ in made:
        for ext in (".ttf", ".woff2"):
            print("  ", os.path.join("app", "fonts", base + ext))


def _to_font_units(segs, x0, baseline, scale, lsb):
    """Source pixel coordinates -> font units (y up, origin on the baseline)."""
    def m(p):
        return ((p[0] - x0) * scale + lsb, (baseline - p[1]) * scale)
    out = []
    for s in segs:
        out.append(tuple([s[0]] + [m(p) for p in s[1:]]))
    return out


def _reverse_segments(segs):
    """Reverse a contour's drawing direction (for correct winding)."""
    out = []
    for s in reversed(segs):
        if s[0] == "L":
            out.append(("L", s[2], s[1]))
        else:
            _, p0, c1, c2, p3 = s
            out.append(("C", p3, c2, c1, p0))
    return out


if __name__ == "__main__":
    main()
