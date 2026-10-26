#!/usr/bin/env python3
"""Scale and brighten the pangolin logo.

The source is flat artwork: a single green, separated by transparent seams,
with a cream matte on the antialiased edges. That lets it be enlarged
properly — the coverage (alpha) channel is what carries the shape, so it is
resampled smoothly and the colour is then laid in flat. Upscaling the RGB
directly would instead drag the cream matte out into a visible fringe, which
is also what makes the mark look dirty on the dark theme.

The green is remapped to the palette's Deep Forest Green, which is what
"brighter" means here: the source green (#174032) is far darker than any
colour in the brand palette.

Usage:  python3 scripts/build-logo.py [--factor 3]
Needs:  pillow, numpy
"""
import argparse
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, "..", "docs", "images", "logo-source.png")
OUT = os.path.join(ROOT, "public", "logo.png")

FOREST_GREEN = (15, 107, 67)   # --forest-green, from the client's palette


def build(src_path, factor):
    src = Image.open(src_path).convert("RGBA")
    w, h = src.size
    a = np.asarray(src)
    alpha = a[:, :, 3]

    # Resample the coverage channel only — that is the actual shape.
    cov = Image.fromarray(alpha, "L").resize(
        (int(round(w * factor)), int(round(h * factor))), Image.LANCZOS)
    # a gentle unsharp keeps the plate edges from going soft at 3x; much more
    # than this and the source's own pixel steps get magnified into jaggies
    cov = cov.filter(ImageFilter.UnsharpMask(radius=3, percent=25, threshold=1))

    cov = np.asarray(cov).astype(np.uint8)
    out = np.zeros((cov.shape[0], cov.shape[1], 4), np.uint8)
    out[:, :, 0], out[:, :, 1], out[:, :, 2] = FOREST_GREEN
    out[:, :, 3] = cov
    return Image.fromarray(out, "RGBA")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--factor", type=float, default=3.0)
    args = ap.parse_args()

    src = Image.open(SOURCE)
    im = build(SOURCE, args.factor)
    im.save(OUT)
    print(f"{os.path.relpath(SOURCE, ROOT)}  {src.size[0]}x{src.size[1]}"
          f"  ->  {os.path.relpath(OUT, ROOT)}  {im.size[0]}x{im.size[1]}")
    print(f"green: #174032 -> #{FOREST_GREEN[0]:02X}{FOREST_GREEN[1]:02X}{FOREST_GREEN[2]:02X}")


if __name__ == "__main__":
    sys.exit(main())
