#!/usr/bin/env python3
"""Render the built brand fonts and diff them against the source bitmap.

End-to-end check: lays the logo text out the way a text engine would (advance
widths plus the GPOS kern feature), rasterises it with FreeType, slides it to
the best alignment and reports how much ink lands in the wrong place. The
alignment search is there because where the text sits on the page is the
layout's business, not the font's.

Usage: python3 scripts/check-brand-font.py
"""
import os
import sys

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, "public", "custom_font.png")
FONTS = os.path.join(ROOT, "app", "fonts")
CAP_UNITS = 700
UPEM = 1000
INK_LEVEL = 146

# name, text, cap height in the source, and the source row it should match
CASES = [
    ("LayrusDisplay-Bold", "LAYRUS", 100.77, (0, 0, 751, 130)),
    ("LayrusDisplay-Regular", "TECHNOLOGY", 33.74, (40, 145, 751, 197)),
]


def kern_pairs(path):
    """Read the GPOS kern pairs back out of the built font."""
    font = TTFont(path)
    pairs = {}
    if "GPOS" not in font:
        return pairs
    for lookup in font["GPOS"].table.LookupList.Lookup:
        if lookup.LookupType != 2:
            continue
        for st in lookup.SubTable:
            if st.Format == 1:
                for i, first in enumerate(st.Coverage.glyphs):
                    for pvr in st.PairSet[i].PairValueRecord:
                        v = pvr.Value1.XAdvance
                        if v:
                            pairs[(first, pvr.SecondGlyph)] = v
            elif st.Format == 2:
                for i, first in enumerate(st.Coverage.glyphs):
                    for j, second in enumerate(st.Coverage2.glyphs):
                        v = st.Class1Record[i].Class2Record[j].Value1.XAdvance
                        if v:
                            pairs[(first, second)] = v
    return pairs


def render(name, text, cap_px):
    """Lay the text out with the font's own metrics and rasterise it."""
    path = os.path.join(FONTS, name + ".ttf")
    size = cap_px * UPEM / CAP_UNITS
    font = ImageFont.truetype(path, size)
    tt = TTFont(path)
    hmtx = tt["hmtx"]
    pairs = kern_pairs(path)
    scale = size / UPEM

    img = Image.new("L", (1400, 400), 255)
    draw = ImageDraw.Draw(img)
    pen, baseline, prev = 100.0, 300.0, None
    for ch in text:
        if prev is not None:
            pen += pairs.get((prev, ch), 0) * scale
        draw.text((pen, baseline), ch, font=font, fill=0, anchor="ls")
        pen += hmtx[ch][0] * scale
        prev = ch
    return img


def ink_set(img):
    px = img.load()
    w, h = img.size
    return {(x, y) for y in range(h) for x in range(w) if px[x, y] < INK_LEVEL}


def main():
    src = Image.open(SOURCE)
    bg = Image.new("RGBA", src.size, (255, 255, 255, 255))
    srcL = Image.alpha_composite(bg, src).convert("L")
    failures = 0

    for name, text, cap, box in CASES:
        src_ink = ink_set(srcL.crop(box))
        w = box[2] - box[0]
        h = box[3] - box[1]
        rendered = render(name, text, cap)
        ren_ink = ink_set(rendered)
        # coarse alignment from the ink boxes, then a small local search
        sx = [p[0] for p in src_ink]; sy = [p[1] for p in src_ink]
        rx = [p[0] for p in ren_ink]; ry = [p[1] for p in ren_ink]
        cx = min(rx) - min(sx)
        cy = min(ry) - min(sy)
        best, best_ink = None, None
        for dy in range(cy - 12, cy + 13):
            for dx in range(cx - 12, cx + 13):
                shifted = {(x - dx, y - dy) for x, y in ren_ink}
                bad = len(src_ink ^ shifted)
                if best is None or bad < best:
                    best, best_ink = bad, shifted
        only_src = len(src_ink - best_ink)
        only_ren = len(best_ink - src_ink)
        ink = len(src_ink)
        print(f"{name:24s} {text:12s} mismatch={best:6d}px "
              f"({100*best/ink:5.2f}% of ink)  "
              f"missing {100*only_src/ink:4.1f}%  extra {100*only_ren/ink:4.1f}%")

        ov = Image.new("RGB", (w, h), (255, 255, 255))
        pa = ov.load()
        for y in range(h):
            for x in range(w):
                si, ri = (x, y) in src_ink, (x, y) in best_ink
                if si and ri:
                    pa[x, y] = (40, 40, 40)
                elif si:
                    pa[x, y] = (220, 40, 40)
                elif ri:
                    pa[x, y] = (40, 90, 220)
        ov.resize((w * 3, h * 3), Image.NEAREST).save(f"/tmp/overlay-{name}.png")
        if best > 0.06 * ink:
            failures += 1

    print("\noverlays: /tmp/overlay-LayrusDisplay-*.png")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
