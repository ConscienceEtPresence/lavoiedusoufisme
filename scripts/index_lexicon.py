#!/usr/bin/env python3
"""Construit un index des entrées du lexique : num -> (page, premiere_def, texte_complet)."""
import re, json
from pathlib import Path

TXT_DIR = Path("/tmp/gloton_lex_txt")
pages = sorted(TXT_DIR.glob("p*.txt"))

# Concaténer tout en gardant les sauts de page
big = []
for p in pages:
    page_num = int(re.search(r"p(\d+)", p.stem).group(1))
    txt = p.read_text(encoding="utf-8")
    big.append(f"\n\n=== PAGE {page_num} ===\n\n{txt}")
ALL = "".join(big)

# Découper en entrées : chaque entrée commence par un numéro 4 chiffres seul sur une ligne
entry_re = re.compile(r"^(\d{4})\s*$\s*\((\d+)\)\s*$", re.MULTILINE)

entries = []
matches = list(entry_re.finditer(ALL))
for i, m in enumerate(matches):
    num = m.group(1)
    occ = m.group(2)
    start = m.end()
    end = matches[i+1].start() if i+1 < len(matches) else len(ALL)
    body = ALL[start:end].strip()
    # page la plus proche
    pre = ALL[:m.start()]
    page_m = list(re.finditer(r"=== PAGE (\d+) ===", pre))
    page_num = int(page_m[-1].group(1)) if page_m else 0
    # première vraie ligne de définition (après les en-têtes éventuels)
    first_def = ""
    for line in body.split("\n"):
        line = line.strip()
        if not line: continue
        if line.startswith("==="): continue
        if line.startswith("UNE APPROCHE"): continue
        if line.isdigit() and len(line) <= 3: continue  # numéro de page
        first_def = line
        break
    entries.append({
        "num": num, "occ": int(occ), "page": page_num,
        "first_def": first_def, "body": body[:3000]
    })

print(f"Entries: {len(entries)}")
print(f"First few:")
for e in entries[:5]:
    print(f"  {e['num']} (p.{e['page']}) — {e['first_def'][:80]}")

# Sauvegarder
out = Path("/tmp/gloton_index.json")
out.write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"\nSaved to {out}")
