#!/usr/bin/env python3
"""Trouve les entrées Gloton pour les 12 racines du batch 1 Phase 2."""
import re
from pathlib import Path

pages = sorted(Path("/tmp/gloton_lex_txt").glob("p*.txt"))
ALL = ""
for p in pages:
    page_num = int(re.search(r"p(\d+)", p.stem).group(1))
    ALL += f"\n=PAGE {page_num}=\n" + p.read_text(encoding="utf-8")

# Phrases TRÈS distinctives qui devraient apparaître dans la 1ère ligne de définition
# de chaque racine
SEARCHES = {
    "ʾ-m-n":  ["Etre fidèle, sûr, en sécurité", "Etre en sécurité", "Idée de sécurité"],
    "ʿ-r-f":  ["Reconnaître, connaître", "Idée de reconnaissance", "Idée de connaissance acquise"],
    "s-l-m":  ["Etre sain et sauf", "Etre exempt", "Idée de paix et de salut", "Idée de soumission"],
    "ḥ-k-m":  ["Idée d'établir une règle de sagesse", "Etre sage", "Juger, gouverner"],
    "w-l-y":  ["Etre près, proche", "Etre l'ami", "Idée de proximité, d'alliance"],
    "q-d-s":  ["Etre saint", "Etre pur, sacré", "Idée de sainteté"],
    "h-d-y":  ["Guider, indiquer le chemin", "Mener droit", "Etre bien dirigé"],
    "ḍ-l-l":  ["S'égarer, se fourvoyer", "Idée d'errance", "Etre dans l'erreur"],
    "n-ṣ-r":  ["Secourir, porter secours", "Idée d'assistance", "Aider, assister"],
    "z-k-y":  ["Etre pur", "Pousser, croître", "Idée de purification et de croissance"],
    "t-q-y":  ["Se garder de", "Craindre Dieu", "Idée de se prémunir"],
    "ṣ-d-q":  ["Etre véridique", "Etre vrai dans le dire", "Idée de véracité"],
}

results = {}
for root, phrases in SEARCHES.items():
    found = None
    for phrase in phrases:
        for m in re.finditer(re.escape(phrase), ALL, re.IGNORECASE):
            pre = ALL[max(0, m.start()-1500):m.start()]
            nums = list(re.finditer(r"\n(\d{4})\s*\n\s*\(\d+\)", pre))
            page_m = list(re.finditer(r"=PAGE (\d+)=", pre))
            if not nums: continue
            num = nums[-1].group(1)
            page = page_m[-1].group(1) if page_m else "?"
            ctx = ALL[m.start()-30:m.end()+150].replace('\n', ' / ')
            if not found:
                found = (num, page, phrase, ctx)
                print(f"{root:>8}: #{num} p.{page} [{phrase[:25]}] → ...{ctx[:160]}...")
            break
        if found: break
    if not found:
        print(f"{root:>8}: NOT FOUND")
    results[root] = found
