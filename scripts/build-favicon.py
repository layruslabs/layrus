#!/usr/bin/env python3
"""Rasterise public/logo.svg into the favicon and app icons.

`app/favicon.ico` and `app/icon.png` are picked up by Next.js automatically,
so replacing those two files is all that is needed — no <link> tags.

The mark is detailed, so at 16px it is drawn a little larger than the tile
(cropping the outermost padding) to keep the silhouette readable.

Usage:  python3 scripts/build-favicon.py
Needs:  pillow, and chrome (or chromium) on PATH for the SVG raster
"""
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SVG = os.path.join(ROOT, "public", "logo.svg")
ICO = os.path.join(ROOT, "app", "favicon.ico")
ICON = os.path.join(ROOT, "app", "icon.png")     # 512px, modern browsers
APPLE = os.path.join(ROOT, "app", "apple-icon.png")

ICO_SIZES = [16, 32, 48, 64]
PAD = {16: 0.94, 32: 0.96, 48: 1.0, 64: 1.0}     # fill factor per size


def find_chrome():
    for name in ("google-chrome", "chromium", "chromium-browser", "chrome"):
        p = shutil.which(name)
        if p:
            return p
    sys.exit("no chrome/chromium on PATH — needed to rasterise the SVG")


def raster(svg_path, width, height, out):
    """Headless Chrome screenshot of the SVG at the requested pixel size."""
    with tempfile.TemporaryDirectory() as d:
        html = os.path.join(d, "r.html")
        with open(html, "w") as f:
            f.write(
                "<!doctype html><meta charset=utf-8>"
                "<style>html,body{margin:0;background:transparent}"
                f"img{{display:block;width:{width}px;height:{height}px}}</style>"
                f'<img src="file://{svg_path}">'
            )
        subprocess.run(
            [find_chrome(), "--headless", "--disable-gpu", "--no-sandbox",
             "--hide-scrollbars", "--default-background-color=00000000",
             f"--window-size={width},{height}", "--force-device-scale-factor=1",
             f"--screenshot={out}", f"file://{html}"],
            check=True, capture_output=True)


def fit(im, size, fill):
    """Centre the artwork in a square tile, scaled to `fill` of the tile."""
    im = im.crop(im.getbbox())
    target = int(round(size * fill))
    im = im.resize(
        (target, int(round(target * im.height / im.width))), Image.LANCZOS)
    tile = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    tile.paste(im, ((size - im.width) // 2, (size - im.height) // 2), im)
    return tile


def main():
    with tempfile.TemporaryDirectory() as d:
        raw = os.path.join(d, "big.png")
        raster(SVG, 1024, 909, raw)
        big = Image.open(raw).convert("RGBA")

        frames = []
        for size in ICO_SIZES:
            frames.append(fit(big, size, PAD[size]))
        # PIL writes a multi-resolution .ico from the largest frame; pass all
        frames[-1].save(ICO, format="ICO",
                        sizes=[(s, s) for s in ICO_SIZES],
                        append_images=frames[:-1])
        print(f"{os.path.relpath(ICO, ROOT)}  {ICO_SIZES}")

        fit(big, 512, 0.92).save(ICON)
        print(f"{os.path.relpath(ICON, ROOT)}  512x512")
        fit(big, 180, 0.86).save(APPLE)
        print(f"{os.path.relpath(APPLE, ROOT)}  180x180")


if __name__ == "__main__":
    sys.exit(main())
