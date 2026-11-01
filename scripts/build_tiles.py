"""Builds lib/tiles.json and public/tiles/*.webp from the rendered catalogue pages and ../ocr-output/ocr.jsonl.

Usage: python scripts/build_tiles.py [--list]   (needs pillow; --list prints names without cropping)
Boxes are (x0, y0, x1, y1) in pixels of the 1600 px wide page renders.
"""
import colorsys
import json
import os
import re
import sys
from collections import defaultdict

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = os.path.join(ROOT, "public", "catalogues")
TILES = os.path.join(ROOT, "public", "tiles")
OCR = os.path.join(os.path.dirname(ROOT), "ocr-output", "ocr.jsonl")
CORRECTIONS = os.path.join(ROOT, "scripts", "tile_name_corrections.json")

MG, DF, FN = "marble-glossy", "decor-feature", "fullbody-natural"

# slug: (collection, category, finish, anchor text proving a tile page, name box, tile crop)
SINGLE = {
    "infinite-1": ("Infinite", MG, "Glossy", r"Random", (580, 295, 950, 375), (75, 80, 476, 1055)),
    "infinite-3": ("Infinite", MG, "Glossy", r"Random", (580, 295, 950, 375), (75, 80, 476, 1055)),
    "ideal": ("Ideal", MG, "Glossy", r"1200", (610, 510, 950, 590), (156, 166, 587, 1023)),
    "inky": ("Inky", MG, "Glossy", r"1200", (610, 510, 950, 590), (156, 166, 587, 1023)),
    "radiance-1": ("Radiance", MG, "Glossy", r"SIZE", (1270, 725, 1600, 792), (75, 0, 640, 1132)),
    "radiance-2": ("Radiance", MG, "Glossy", r"SIZE", (1270, 725, 1600, 792), (75, 0, 640, 1132)),
    "glossy-1": ("Glossy", MG, "Glossy", r"Thickness", (650, 240, 880, 318), (75, 75, 565, 1058)),
    "glossy-2": ("Glossy", MG, "Glossy", r"Thickness", (650, 240, 880, 318), (75, 75, 565, 1058)),
    "glossy-3": ("Glossy", MG, "Glossy", r"Thickness", (650, 240, 880, 318), (75, 75, 565, 1058)),
    "three-d": ("Three-D", DF, "Glossy", r"Thickness", (1200, 400, 1560, 448), (75, 75, 1200, 635)),
    "bookmatch": ("Bookmatch", DF, "Glossy", r"DETAILS", (1100, 55, 1600, 112), (605, 139, 1525, 600)),
    "travertino": ("Travertino", FN, "Matt", r"Design", (70, 232, 500, 296), (83, 333, 713, 643)),
    "magic": ("Magic", FN, "Glossy / Matt", r"FULLBODY", (60, 60, 800, 128), (78, 209, 300, 650)),
    "mono": ("Mono", FN, "Matt", r"FULLBODY", (60, 60, 800, 128), (78, 209, 300, 650)),
}
PAIRS = {
    "pearl": ("Pearl", MG, "Glossy", ((50, 785, 500, 822), (63, 292, 766, 645)), ((840, 785, 1300, 822), (849, 292, 1552, 645))),
    "monolux": ("Monolux", MG, "Glossy", ((470, 225, 800, 262), (75, 184, 444, 920)), ((1250, 225, 1600, 262), (857, 184, 1227, 920))),
}
BLOOM_BOXES = (("Decor", (75, 75, 610, 343)), ("Light", (75, 411, 610, 675)), ("Dark", (75, 743, 610, 1013)))
AURA_BOXES = ((910, 708, 1177, 844, 845, 880), (1217, 708, 1487, 844, 845, 880), (910, 885, 1177, 1021, 1022, 1060), (1217, 885, 1487, 1021, 1022, 1060))

NOISE = re.compile(r"^(WERR|CER|\d+$|Random|SERIES$|600|1200|FINISH|Finish|TILE|Randoms|DECOR$)", re.I)


def norm(text):
    return re.sub(r"[^A-Z0-9]", "", text.upper())


def pretty(text):
    return " ".join(w.capitalize() for w in text.rstrip(":. ").split())


def inside(item, box):
    cx, cy = (item[0] + item[2]) / 2, (item[1] + item[3]) / 2
    return box[0] <= cx <= box[2] and box[1] <= cy <= box[3]


def words(page, box):
    found = [t for t in page["t"] if t[5] > 0.5 and inside(t, box) and not NOISE.match(t[4])]
    return " ".join(t[4].strip() for t in sorted(found, key=lambda t: (t[1] // 12, t[0])))


def load_pages():
    pages = defaultdict(dict)
    with open(OCR, encoding="utf-8") as f:
        for line in f:
            row = json.loads(line)
            slug, number = row["k"].split("/")
            pages[slug][number] = row
    return pages


def has(page, pattern):
    return any(re.search(pattern, t[4]) for t in page["t"])


def captions(pages):
    """Room photos print the tile name in a corner: use it for correct spacing and to attach the photo."""
    found = {}
    for number, page in sorted(pages.items()):
        low = [t for t in page["t"] if t[5] > 0.5 and t[1] > 940 and t[0] < 500 and not NOISE.match(t[4])]
        if not low or has(page, r"COLLECTION|Thickness|SIZE|DETAILS"):
            continue
        text = " ".join(t[4].strip() for t in sorted(low, key=lambda t: t[1]))
        found[norm(text)] = (text, number)
    return found


def extract():
    pages = load_pages()
    tiles = []

    def add(slug, collection, category, finish, name, number, box, caption=None):
        tiles.append({"slug": slug, "collection": collection, "category": category, "finish": finish,
                      "raw": name, "page": number, "box": box, "caption": caption})

    for slug, (collection, category, finish, anchor, name_box, crop) in SINGLE.items():
        caps = captions(pages[slug])
        for number, page in sorted(pages[slug].items()):
            if has(page, anchor) and not has(page, r"PRODUCT ?INDEX"):
                name = words(page, name_box)
                if name:
                    add(slug, collection, category, finish, name, number, crop, caps)

    for slug, (collection, category, finish, *slots) in PAIRS.items():
        caps = captions(pages[slug])
        for number, page in sorted(pages[slug].items()):
            for name_box, crop in slots:
                name = words(page, name_box)
                if name and not has(page, r"PRODUCT ?INDEX"):
                    add(slug, collection, category, finish, name, number, crop, caps)

    for number, page in sorted(pages["bloom"].items()):
        series = words(page, (680, 285, 950, 325))
        if has(page, r"Thickness") and series:
            for shade, box in BLOOM_BOXES:
                add("bloom", "Bloom", DF, "Glossy", f"{series} {shade}", number, box)

    for number, page in sorted(pages["rock-aura"].items()):
        series = words(page, (890, 240, 1300, 290))
        if has(page, r"Rock") and has(page, r"Thickness") and series:
            for x0, y0, x1, y1, ty0, ty1 in AURA_BOXES:
                shade = words(page, (x0 - 10, ty0, x1, ty1))
                if shade:
                    add("rock-aura", "Rock Aura", FN, "Matt", f"{series} {shade}", number, (x0, y0, x1, y1))

    for number, page in sorted(pages["fullbody"].items()):
        series = next((s for s in ("TERRAZZO", "VENICE") if has(page, s)), None)
        labels = [t for t in page["t"] if series and t[5] > 0.5 and t[1] in range(790, 960) and not NOISE.match(t[4]) and t[3] - t[1] < 45]
        if labels:
            label = labels[0]
            x0 = label[0]
            add("fullbody", "Fullbody", FN, "Matt", f"{series} {label[4]}", number, (x0, 513 if series == "VENICE" else 373, x0 + 275, label[1] - 20))

    for number, page in sorted(pages["pastel"].items()):
        if has(page, r"pastel"):
            label = [t for t in page["t"] if t[5] > 0.5 and 56 <= t[0] <= 330 and 171 <= t[1] <= 441]
            if label:
                add("pastel", "Pastel", FN, "Matt", f"Pastel {label[0][4]}", number, (97, 210, 289, 402))
    return tiles


JUNK = {("pearl", "004"), ("monolux", "005"), ("magic", "001"), ("mono", "001"), ("rock-aura", "003"), ("pastel", "001"), ("pastel", "003")}
MONOLUX_SERIES = ("ARGOS", "ASTOM", "ATMANA", "EQUIDAR", "FORMIA", "HILTON", "JURASSIC", "LEERA", "MIRACAL", "OXFORD", "RIGATO", "SMOKE", "VERONA")
SHADE = re.compile(r"(LIGHT|WHITE)$")


def monolux_name(raw):
    text = re.sub(r"\s+(T?I?L?E|TLE|ILE)\s+SHO.*$", "", raw).replace(" ", "")
    series = next((s for s in MONOLUX_SERIES if text.startswith(s)), None)
    if not series:
        return pretty(raw)
    rest = text[len(series):]
    match = SHADE.search(rest)
    if match and match.start() > 0:
        rest = f"{rest[:match.start()]} {match.group(1)}"
    return pretty(f"{series} {rest}")


def clean_name(tile, corrections):
    raw = tile["raw"].replace("CON SILK", "CORN SILK").replace("BLACKSLATE", "BLACK SLATE").replace("PEWTERTRV", "PEWTER TRV").rstrip(":. ")
    if tile["slug"] == "monolux":
        return monolux_name(raw)
    key = norm(raw)
    if key in corrections:
        return corrections[key]
    caption = (tile["caption"] or {}).get(key)
    # Captions only help when OCR lost the spaces in the name itself.
    return pretty(caption[0] if caption and " " not in raw else raw)


def colour_of(image):
    small = image.convert("RGB").resize((32, 32))
    pixels = sorted((small.getpixel((x, y)) for x in range(32) for y in range(32)), key=sum)
    r, g, b = pixels[len(pixels) // 2]
    h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    h *= 360
    if s < 0.1:
        return "White" if v > 0.85 else "Grey" if v > 0.3 else "Black"
    if v < 0.2:
        return "Black"
    if 170 <= h < 265:
        return "Blue"
    if 65 <= h < 170:
        return "Green"
    if h >= 300 or h < 12:
        return "Pink"
    if v > 0.82 and s < 0.22:
        return "Cream"
    return "Beige" if v > 0.6 and s < 0.45 else "Brown"


def room_for(tile, name, rooms):
    wanted = norm(name)
    for key, number in rooms.get(tile["slug"], {}).items():
        if wanted in key.split("|"):
            return f"/catalogues/{tile['slug']}/{number}.webp"
    return None


def room_index(pages):
    rooms = {}
    for slug, by_page in pages.items():
        rooms[slug] = {}
        for key, (text, number) in captions(by_page).items():
            rooms[slug]["|".join(norm(part) for part in re.split(r"\s*-\s*", text))] = number
    return rooms


def main():
    tiles = [t for t in extract() if (t["slug"], t["page"]) not in JUNK]
    with open(CORRECTIONS, encoding="utf-8") as f:
        corrections = json.load(f)
    rooms = room_index(load_pages())
    os.makedirs(TILES, exist_ok=True)
    list_only = "--list" in sys.argv
    if list_only:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    out, seen = [], set()
    for t in tiles:
        name = clean_name(t, corrections)
        tile_id = f"{t['collection']}-{name}".lower().replace(" ", "-")
        tile_id = re.sub(r"[^a-z0-9-]", "", tile_id)
        if tile_id in seen:
            continue
        seen.add(tile_id)
        room = room_for(t, name, rooms)
        if list_only:
            print(t["slug"], t["page"], name, "ROOM" if room else "")
            continue
        path = os.path.join(TILES, f"{tile_id}.webp")
        with Image.open(os.path.join(PAGES, t["slug"], f"{t['page']}.webp")) as page:
            crop = page.convert("RGB").crop(t["box"])
        crop.save(path, "WEBP", quality=80, method=4)
        out.append({"id": tile_id, "name": name, "category": t["category"], "collection": t["collection"],
                    "colour": colour_of(crop), "finish": t["finish"], "image": f"/tiles/{tile_id}.webp",
                    "room": room, "uploaded": False, "catalogue": t["slug"], "page": int(t["page"])})
    if not list_only:
        with open(os.path.join(ROOT, "lib", "tiles.json"), "w", encoding="utf-8") as f:
            json.dump(out, f, indent=1, ensure_ascii=False)
        keep = {f"{t['id']}.webp" for t in out}
        for leftover in set(os.listdir(TILES)) - keep:
            os.remove(os.path.join(TILES, leftover))
        print("TILES", len(out), "with room", sum(1 for t in out if t["room"]))


if __name__ == "__main__":
    main()
