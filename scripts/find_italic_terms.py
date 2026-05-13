#!/usr/bin/env python3
"""Trouve tous les termes en <em>...</em> ressemblant à de la translittération
arabe (diacritiques) qui ne sont PAS suivis d'arabe, dans tout le JSON."""
import json, re
from pathlib import Path
from collections import Counter

ROOT = Path(__file__).resolve().parents[1]
ARABIC = re.compile(r"[؀-ۿ]")
# diacritiques typiques de translit arabe
DIAC = re.compile(r"[ʿʾāīūēōṣḍḥṭẓšǧġḏṯĀĪŪṢḌḤṬẒ]")

def walk(obj):
    if isinstance(obj, str): yield obj
    elif isinstance(obj, dict):
        for v in obj.values(): yield from walk(v)
    elif isinstance(obj, list):
        for v in obj: yield from walk(v)

found = Counter()
for jpath in ["data/dictionnaire.json", "data/noms-divins.json"]:
    data = json.loads((ROOT/jpath).read_text(encoding="utf-8"))
    for txt in walk(data):
        # tous les <em>...</em>
        for m in re.finditer(r"<em>([^<]+)</em>", txt):
            term = m.group(1).strip()
            # filtre : doit avoir au moins un diacritique de translit
            if not DIAC.search(term): continue
            # filtre : pas trop long (phrases courtes uniquement)
            if len(term) > 60: continue
            # vérifie : arabe juste après ?
            tail = txt[m.end():m.end()+15]
            if ARABIC.search(tail): continue
            found[term] += 1

print(f"{len(found)} termes uniques en <em> non annotés.\n")
for term, n in found.most_common():
    print(f"  {n:>3}× {term}")
