#!/usr/bin/env python3
"""Rend toutes les pages du lexique en PNG, puis lance OCR en parallèle."""
import fitz, subprocess, os, sys, concurrent.futures, time
from pathlib import Path

PDF = "/Users/brahms/Documents/soufisme/maurice gloton/Approche-Coran-grammaire-lexique.pdf"
OUT_DIR = Path("/tmp/gloton_lex")
OUT_DIR.mkdir(exist_ok=True)
TEXT_DIR = Path("/tmp/gloton_lex_txt")
TEXT_DIR.mkdir(exist_ok=True)
OCR_BIN = "/Users/brahms/Documents/soufisme/site/scripts/ocr"

# Pages du lexique : 233 (entry 0001) à 830 environ
START_PAGE = 233
END_PAGE   = 830

def render(i):
    doc = fitz.open(PDF)
    page = doc[i-1]
    pix = page.get_pixmap(dpi=160)
    out = OUT_DIR / f"p{i:04d}.png"
    if not out.exists() or out.stat().st_size < 1000:
        pix.save(str(out))
    doc.close()

def ocr(i):
    img = OUT_DIR / f"p{i:04d}.png"
    txt = TEXT_DIR / f"p{i:04d}.txt"
    if txt.exists() and txt.stat().st_size > 50:
        return  # déjà fait
    try:
        out = subprocess.run([OCR_BIN, str(img), "fr-FR,ar-SA"],
                             capture_output=True, text=True, timeout=60)
        txt.write_text(out.stdout, encoding="utf-8")
    except Exception as e:
        txt.write_text(f"ERR: {e}", encoding="utf-8")

phase = sys.argv[1] if len(sys.argv) > 1 else "all"
pages = list(range(START_PAGE, END_PAGE + 1))

if phase in ("render", "all"):
    t0 = time.time()
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        list(ex.map(render, pages))
    print(f"Render: {time.time()-t0:.1f}s — {len(pages)} pages")

if phase in ("ocr", "all"):
    t0 = time.time()
    done = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
        for _ in ex.map(ocr, pages):
            done += 1
            if done % 50 == 0:
                print(f"  OCR: {done}/{len(pages)} ({time.time()-t0:.0f}s)", flush=True)
    print(f"OCR: {time.time()-t0:.1f}s")

# stats
done = sum(1 for p in pages if (TEXT_DIR / f"p{p:04d}.txt").exists())
print(f"Done: {done}/{len(pages)} pages OCR'd")
