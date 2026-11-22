#!/usr/bin/env python3
"""Turn raw iPhone screenshots into the site's screenshot set for one language.

    python3 tools/make-screens.py en path/to/raw/en

The input folder holds full-screen PNG or JPEG screenshots named after the screens the site
shows: home, adaptive, puzzle, streak, games, 3d, progress, duel (and optionally neuron).
Each is cropped to the phone frame's proportions if needed, then saved as WebP at 948 × 2052
and 474 × 1026 in assets/screens/<lang>/. Afterwards assets/js/screens.js lists every
language with a complete set, so the site starts showing it straight away.

Needs Pillow: pip install pillow
"""
import pathlib
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("This needs Pillow: pip install pillow")

ROOT = pathlib.Path(__file__).resolve().parent.parent
SCREENS = ROOT / "assets" / "screens"
REQUIRED = ["home", "adaptive", "puzzle", "streak", "games", "3d", "progress", "duel"]
OPTIONAL = ["neuron"]
FULL = (948, 2052)
SMALL = (474, 1026)


def fit(image):
    """Centre crop to the screen's proportions, so any iPhone's screenshot fits the frame."""
    want = FULL[0] / FULL[1]
    w, h = image.size
    if abs(w / h - want) < 0.004:
        return image
    if w / h > want:
        nw = round(h * want)
        left = (w - nw) // 2
        return image.crop((left, 0, left + nw, h))
    nh = round(w / want)
    top = (h - nh) // 2
    return image.crop((0, top, w, top + nh))


def find(folder, name):
    for ext in (".png", ".PNG", ".jpg", ".jpeg", ".webp"):
        path = folder / f"{name}{ext}"
        if path.exists():
            return path
    return None


def write_manifest():
    langs = sorted(
        d.name for d in SCREENS.iterdir()
        if d.is_dir() and all((d / f"{n}.webp").exists() and (d / f"{n}-sm.webp").exists() for n in REQUIRED)
    )
    (ROOT / "assets" / "js" / "screens.js").write_text(
        "// Which languages have their own set of app screenshots in assets/screens/<lang>/.\n"
        "// tools/make-screens.py rewrites this file whenever it adds a set. A language without its\n"
        "// own set shows the Georgian screens, and the page says so.\n"
        f"export const SCREEN_LANGS = {langs!r};\n"
        "export const FALLBACK_SCREENS = 'ka';\n"
    )
    return langs


def main():
    if len(sys.argv) != 3 or sys.argv[1] not in ("en", "ka"):
        sys.exit(__doc__)
    lang, folder = sys.argv[1], pathlib.Path(sys.argv[2])
    missing = [n for n in REQUIRED if not find(folder, n)]
    if missing:
        sys.exit(f"Missing in {folder}: {', '.join(missing)}")
    out = SCREENS / lang
    out.mkdir(parents=True, exist_ok=True)
    for name in REQUIRED + OPTIONAL:
        src = find(folder, name)
        if not src:
            continue
        image = fit(Image.open(src).convert("RGB"))
        image.resize(FULL, Image.LANCZOS).save(out / f"{name}.webp", "WEBP", quality=84, method=6)
        image.resize(SMALL, Image.LANCZOS).save(out / f"{name}-sm.webp", "WEBP", quality=84, method=6)
        print(f"  {lang}/{name}.webp")
    print(f"Languages with their own screens: {', '.join(write_manifest())}")


if __name__ == "__main__":
    main()
