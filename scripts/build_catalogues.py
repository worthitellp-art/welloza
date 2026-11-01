"""Renders every page of the seed catalogue PDFs to public/catalogues and writes lib/catalogues.json.

Usage: python scripts/build_catalogues.py <seed_dir> <temp_dir>  (needs pypdf, pypdfium2, pillow)
Finished pages are skipped, so an interrupted run can be restarted.
"""
import io
import json
import multiprocessing as mp
import os
import sys

import pypdfium2 as pdfium
from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "catalogues")
FULL_EDGE, THUMB_EDGE = 1600, 560

# (file, slug, title). The WhatsApp screen capture in seed/ is a private chat, not a catalogue: never add it.
CATALOGUES = [
    ("01_1_WB_INFINATE_COLLECTION_600X1200MM_WERROZA.pdf", "infinite-1", "Infinite Collection, Part 1"),
    ("01_3_WB_INFINATE_COLLECTION_600X1200MM_1_WERROZA.pdf", "infinite-3", "Infinite Collection, Part 3"),
    ("02_WB_PEARL_COLLECTION_600X1200MM_WERROZA.pdf", "pearl", "Pearl Collection"),
    ("03_WB_IDEAL_COLLECTION_600X1200MM_1_WERROZA.pdf", "ideal", "Ideal Collection"),
    ("05_1_WB_RADIANCE_COLLECTION_600X1200MM_V_1_WERROZA.pdf", "radiance-1", "Radiance Collection, Part 1"),
    ("05_2_WB_RADIANCE_COLLECTION_600X1200MM_V_2_WERROZA.pdf", "radiance-2", "Radiance Collection, Part 2"),
    ("09_WB_THREE-D_COLLECTION_600X1200MM_WERROZA.pdf", "three-d", "Three-D Collection"),
    ("10_WB_BOOKMATCH_COLLECTION_600X1200MM_WERROZA.pdf", "bookmatch", "Bookmatch Collection"),
    ("12_1_WB_GLOSSY_COLLECTION_600X1200MM_WERROZA.pdf", "glossy-1", "Glossy Collection, Part 1"),
    ("12_2_WB_GLOSSY_COLLECTION_600X1200MM_WERROZA.pdf", "glossy-2", "Glossy Collection, Part 2"),
    ("12_3_WB_GLOSSY_COLLECTION_600X1200MM_WERROZA.pdf", "glossy-3", "Glossy Collection, Part 3"),
    ("14_WB_BLOOM_COLLECTION_600X1200MM_WERROZA.pdf", "bloom", "Bloom Collection"),
    ("19_WB_INKY_COLLECTION_600X1200MM__WERROZA.pdf", "inky", "Inky Collection"),
    ("20_WB_MONOLUX_COLLECTION_600X1200MM__WERROZA.pdf", "monolux", "Monolux Collection"),
    ("Our_60x120cm___60x60cm_Fullbody_E-Catalogue_Oct_21_High_WERROZA.pdf", "fullbody", "Fullbody Collection"),
    ("Our_Magic_Series_E-Catalogue_Oct_21_High_WERROZA.pdf", "magic", "Magic Series"),
    ("Our_Mono_Series_E-Catalogue_July_21_High_WERROZA.pdf", "mono", "Mono Series"),
    ("Our_Pastel_Colors_Catalogue_Sep_21_High_WERROZA.pdf", "pastel", "Pastel Colours"),
    ("ROCK_AURA_WH_WERROZA_small.pdf", "rock-aura", "Rock Aura"),
    ("traventino_600x1200MM_catalogue_Final_wo_logo__WERROZA.pdf", "travertino", "Travertino"),
]


def is_cmyk_icc(obj):
    cs = obj.get("/ColorSpace")
    cs = cs.get_object() if cs is not None else None
    return isinstance(cs, list) and cs[0] == "/ICCBased" and cs[1].get_object().get("/N") == 4


def without_cmyk(src, temp_dir, slug):
    """PDFium draws images with a CMYK ICC profile solid black, so those are converted to RGB first."""
    writer = PdfWriter(clone_from=src)
    done, changed = set(), 0
    for page in writer.pages:
        for im in page.images:
            ref = im.indirect_reference
            if ref is None or ref.idnum in done:
                continue
            done.add(ref.idnum)
            obj = ref.get_object()
            if not is_cmyk_icc(obj):
                continue
            buf = io.BytesIO()
            im.image.convert("RGB").save(buf, "JPEG", quality=92)
            obj._data = buf.getvalue()
            obj[NameObject("/ColorSpace")] = NameObject("/DeviceRGB")
            obj[NameObject("/Filter")] = NameObject("/DCTDecode")
            obj.pop("/Decode", None)
            obj.pop("/DecodeParms", None)
            changed += 1
    if not changed:
        return src
    path = os.path.join(temp_dir, f"{slug}.pdf")
    writer.write(path)
    print(slug, "converted CMYK images:", changed, flush=True)
    return path


def render(args):
    pdf, folder, index = args
    full = os.path.join(folder, f"{index + 1:03}.webp")
    thumb = os.path.join(folder, f"{index + 1:03}-t.webp")
    if os.path.exists(full) and os.path.exists(thumb):
        return
    page = pdfium.PdfDocument(pdf)[index]
    image = page.render(scale=FULL_EDGE / max(page.get_size())).to_pil().convert("RGB")
    image.save(full + ".tmp", "WEBP", quality=80, method=4)
    os.replace(full + ".tmp", full)
    image.thumbnail((THUMB_EDGE, THUMB_EDGE))
    image.save(thumb + ".tmp", "WEBP", quality=72, method=4)
    os.replace(thumb + ".tmp", thumb)


def main(seed, temp_dir):
    manifest = []
    with mp.Pool(max(1, (os.cpu_count() or 2) - 1)) as pool:
        for file, slug, title in CATALOGUES:
            src = os.path.join(seed, file)
            folder = os.path.join(OUT, slug)
            os.makedirs(folder, exist_ok=True)
            count = len(PdfReader(src).pages)
            missing = [
                i for i in range(count)
                if not (os.path.exists(os.path.join(folder, f"{i + 1:03}.webp"))
                        and os.path.exists(os.path.join(folder, f"{i + 1:03}-t.webp")))
            ]
            if missing:
                pdf = without_cmyk(src, temp_dir, slug)
                for _ in pool.imap_unordered(render, [(pdf, folder, i) for i in missing]):
                    pass
            w, h = pdfium.PdfDocument(src)[0].get_size()
            manifest.append({"slug": slug, "title": title, "pages": count, "width": round(w), "height": round(h)})
            print(slug, count, "pages done", flush=True)
    with open(os.path.join(ROOT, "lib", "catalogues.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print("ALL DONE", sum(c["pages"] for c in manifest), flush=True)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
