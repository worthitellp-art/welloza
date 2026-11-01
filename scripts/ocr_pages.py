"""Reads the text on every rendered catalogue page into ../ocr-output/ocr.jsonl, so tile names can be found.

Usage: run scripts/run_ocr.bat. Saves after every page: close the window anytime and rerun to continue.
"""
import glob
import json
import multiprocessing as mp
import os

os.environ["OMP_NUM_THREADS"] = "1"

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = os.path.join(ROOT, "public", "catalogues")
OUT = os.path.join(os.path.dirname(ROOT), "ocr-output", "ocr.jsonl")
WORKERS = 2
engine = None


def key(path):
    return f"{os.path.basename(os.path.dirname(path))}/{os.path.basename(path)[:3]}"


def read_page(path):
    global engine
    import numpy as np
    from PIL import Image
    from rapidocr_onnxruntime import RapidOCR

    if engine is None:
        engine = RapidOCR()
    image = np.array(Image.open(path).convert("RGB"))
    found, _ = engine(image)
    items = [
        [round(min(p[0] for p in box)), round(min(p[1] for p in box)),
         round(max(p[0] for p in box)), round(max(p[1] for p in box)), text, round(float(score), 2)]
        for box, text, score in (found or [])
    ]
    return {"k": key(path), "w": image.shape[1], "h": image.shape[0], "t": items}


def main():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    done = set()
    if os.path.exists(OUT):
        with open(OUT, encoding="utf-8") as f:
            done = {json.loads(line)["k"] for line in f if line.endswith("\n")}
    pages = [
        p for p in sorted(glob.glob(os.path.join(PAGES, "*", "*.webp")))
        if not p.endswith("-t.webp") and key(p) not in done
    ]
    total = len(pages) + len(done)
    print(f"{len(done)} of {total} pages already done", flush=True)
    with mp.Pool(WORKERS) as pool, open(OUT, "a", encoding="utf-8") as out:
        for i, page in enumerate(pool.imap_unordered(read_page, pages), start=len(done) + 1):
            out.write(json.dumps(page, ensure_ascii=False) + "\n")
            out.flush()
            print(f"{i} of {total} pages", flush=True)
    print("ALL DONE. Tell Claude it has finished.", flush=True)


if __name__ == "__main__":
    main()
