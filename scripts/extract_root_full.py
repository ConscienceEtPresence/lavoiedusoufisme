#!/usr/bin/env python3
"""Pour chaque racine confirmée, extrait le corps entier de l'entrée (jusqu'à la prochaine)."""
import json, re
from pathlib import Path

# Pages contenant chaque entrée — on lit la page + la suivante
CONFIRMED = {
    "t-w-b":  ("0189", 292),
    "h-b-b":  ("0288", 321),
    "dh-k-r": ("0518", 390),
    "r-h-m":  ("0551", 403),
    "sh-k-r": ("0805", 482),
}

for root, (num, page) in CONFIRMED.items():
    print(f"\n{'='*70}")
    print(f"== {root}   entrée #{num}   page {page}")
    print(f"{'='*70}")
    # Lire 3 pages : la page de début + 2 suivantes (pour capturer toute l'entrée)
    parts = []
    for p in (page, page+1, page+2):
        f = Path(f"/tmp/gloton_lex_txt/p{p:04d}.txt")
        if f.exists():
            parts.append(f.read_text(encoding="utf-8"))
    txt = "\n".join(parts)
    # Trouver l'entrée par son numéro et l'entrée suivante
    m = re.search(rf"^{num}\s*$", txt, re.MULTILINE)
    if not m:
        print(f"  Numéro non trouvé dans les pages !")
        continue
    start = m.start()
    # entrée suivante = 4 chiffres > num
    next_num = f"{int(num)+1:04d}"
    m2 = re.search(rf"^{next_num}\s*$", txt[start:], re.MULTILINE)
    if m2:
        end = start + m2.start()
    else:
        end = len(txt)
    body = txt[start:end]
    print(body)
