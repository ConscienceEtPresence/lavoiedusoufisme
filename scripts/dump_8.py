#!/usr/bin/env python3
"""Dump le texte complet des 8 racines confirmées."""
import re
from pathlib import Path

CONFIRMED = {
    "t-w-b":  ("0189", 292),
    "h-b-b":  ("0288", 321),
    "dh-k-r": ("0518", 390),
    "r-h-m":  ("0551", 403),
    "r-w-h":  ("0607", 420),
    "sh-k-r": ("0805", 482),
    "s-b-r":  ("0835", 491),
    "n-w-r":  ("1572", 734),
}

out_dir = Path("/tmp/gloton_roots")
out_dir.mkdir(exist_ok=True)

for root, (num, page) in CONFIRMED.items():
    parts = []
    for p in (page-1, page, page+1, page+2):
        f = Path(f"/tmp/gloton_lex_txt/p{p:04d}.txt")
        if f.exists():
            parts.append(f.read_text(encoding="utf-8"))
    txt = "\n".join(parts)
    m = re.search(rf"^{num}\s*$", txt, re.MULTILINE)
    if not m: continue
    start = m.start()
    next_num = f"{int(num)+1:04d}"
    m2 = re.search(rf"^{next_num}\s*$", txt[start:], re.MULTILINE)
    end = start + (m2.start() if m2 else 2500)
    body = txt[start:end]
    (out_dir / f"{root}.txt").write_text(body, encoding="utf-8")
    print(f"{root}: {len(body)} chars saved")

print(f"\nFichiers sauvegardés dans {out_dir}/")
