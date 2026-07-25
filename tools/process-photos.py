#!/usr/bin/env python3
"""Turn the supplied HEIC job photos into web assets.

sips passes the HEIC EXIF orientation tag through rather than baking the
rotation in, so every image gets exif_transpose() before it is measured or
cropped. Without that, IMG_2453/IMG_0464 come out on their side and
IMG_1787/IMG_9518 come out upside down at unchanged dimensions.

Each entry: source stem, output slug, target width, crop aspect (None keeps
the native ratio), and a vertical bias (0 = keep the top, 1 = keep the
bottom) used only when the crop trims height.
"""
import subprocess, sys
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path("/Users/brandonoaks/Downloads")
TMP = Path(__file__).parent / "heic-jpg"
OUT = Path("/Users/brandonoaks/Documents/Claude Code/chaneys-pressure-washing/assets/img/work")

SQ = 1.0          # recent-work grid tiles, uniform across mixed orientations
JOBS = [
    # Hero feature — portrait source, keep the basket and the spray high in frame
    ("IMG_2453", "hero-action", 1000, 4 / 5, 0.30),

    # Confirmed before/after pair: same commercial flat roof
    ("IMG_1311", "roof-before", 1400, 4 / 3, 0.45),
    ("IMG_1787", "roof-after", 1400, 4 / 3, 0.45),

    # Residential feature
    ("IMG_3210", "residential-home", 1400, 3 / 2, 0.50),

    # Recent-work grid
    ("IMG_0952", "state-capitol", 900, SQ, 0.40),
    ("IMG_0464", "commercial-office", 900, SQ, 0.45),
    ("IMG_1415", "historic-residence", 900, SQ, 0.40),
    ("IMG_3251", "storefront", 900, SQ, 0.35),
    ("IMG_4604", "stadium-structure", 900, SQ, 0.40),
    ("IMG_9518", "stadium-seating", 900, SQ, 0.45),

    # Social share card
    ("IMG_0952", "og-share", 1200, 1200 / 630, 0.45),
]


def to_jpg(stem: str) -> Path:
    """HEIC -> full-size JPEG via sips; Pillow has no HEIC decoder here."""
    TMP.mkdir(parents=True, exist_ok=True)
    dst = TMP / f"{stem}.jpg"
    if not dst.exists():
        src = SRC / f"{stem}.HEIC"
        if not src.exists():
            sys.exit(f"missing source: {src}")
        subprocess.run(
            ["sips", "-s", "format", "jpeg", "-s", "formatOptions", "100",
             str(src), "--out", str(dst)],
            check=True, capture_output=True,
        )
    return dst


def crop_to(im: Image.Image, aspect: float, bias: float) -> Image.Image:
    w, h = im.size
    if abs((w / h) - aspect) < 0.01:
        return im
    if w / h > aspect:                      # too wide -> trim sides evenly
        new_w = int(round(h * aspect))
        left = (w - new_w) // 2
        return im.crop((left, 0, left + new_w, h))
    new_h = int(round(w / aspect))          # too tall -> trim by bias
    top = max(0, min(int(round((h - new_h) * bias)), h - new_h))
    return im.crop((0, top, w, top + new_h))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    rows = []
    for stem, slug, width, aspect, bias in JOBS:
        im = ImageOps.exif_transpose(Image.open(to_jpg(stem))).convert("RGB")
        native = im.size
        if aspect:
            im = crop_to(im, aspect, bias)
        if im.width > width:
            height = int(round(width * im.height / im.width))
            im = im.resize((width, height), Image.LANCZOS)

        webp = OUT / f"{slug}.webp"
        jpg = OUT / f"{slug}.jpg"
        im.save(webp, "WEBP", quality=80, method=6)
        im.save(jpg, "JPEG", quality=80, optimize=True, progressive=True)
        rows.append((slug, native, im.size,
                     webp.stat().st_size // 1024, jpg.stat().st_size // 1024))

    print(f"{'slug':22} {'native':>11} {'output':>11} {'webp':>6} {'jpg':>6}")
    for slug, nat, out, kw, kj in rows:
        print(f"{slug:22} {nat[0]:>5}x{nat[1]:<5} {out[0]:>5}x{out[1]:<5} "
              f"{kw:>4}K {kj:>5}K")
    print(f"\n{len(rows)} slugs -> {OUT}")


if __name__ == "__main__":
    main()
