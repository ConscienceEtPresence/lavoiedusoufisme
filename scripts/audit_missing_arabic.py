#!/usr/bin/env python3
"""Audite les translittérations techniques qui ne sont PAS suivies d'arabe."""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORD_CHARS = r"A-Za-zÀ-ſƀ-ɏʿʾāīūēōăĭŭṣḍḥṭẓšǧġḏṯĀĪŪṢḌḤṬẒŠǦĠḎṮ'ʼ"
ARABIC = re.compile(r"[؀-ۿ]")

def lookup_map():
    L = {}
    dico = json.loads((ROOT/"data/dictionnaire.json").read_text(encoding="utf-8"))
    noms = json.loads((ROOT/"data/noms-divins.json").read_text(encoding="utf-8"))
    for e in dico["entries"]:
        if e.get("tr") and e.get("ar"):
            L.setdefault(e["tr"], e["ar"])
    for n in noms["noms"]:
        if n.get("tr") and n.get("ar"):
            L.setdefault(n["tr"], n["ar"])
            if n["tr"].startswith("al-"):
                L.setdefault(n["tr"][3:], n["ar"])
    return L, dico, noms

def texts_of(item, fields):
    for f in fields:
        v = item.get(f)
        if isinstance(v, str): yield f, v
        elif isinstance(v, list):
            for s in v:
                if isinstance(s, dict) and "texte" in s:
                    yield f, s["texte"]

def audit(items, fields, own_key, label):
    L, _, _ = lookup_map()
    missing = {}  # term -> [(entry_id, field, snippet)]
    for it in items:
        own = it.get(own_key, "")
        own_norm = {own}
        if own.startswith("al-"): own_norm.add(own[3:])
        for f, txt in texts_of(it, fields):
            if not txt: continue
            for tr in L:
                if tr in own_norm: continue
                pat = re.compile(rf"(?<![{WORD_CHARS}]){re.escape(tr)}(?![{WORD_CHARS}])")
                for m in pat.finditer(txt):
                    tail = txt[m.end():m.end()+15]
                    if ARABIC.search(tail): continue
                    missing.setdefault(tr, []).append((it.get("id") or f"n°{it.get('n')}", f, txt[max(0,m.start()-25):m.end()+30]))
                    break  # une fois par champ suffit
    print(f"\n=== {label} ===")
    print(f"{len(missing)} translittérations avec au moins une occurrence non annotée.\n")
    for tr in sorted(missing, key=lambda t: -len(missing[t])):
        occs = missing[tr]
        print(f"• {tr}  ({L[tr]})  — {len(occs)} occ.")
        for eid, f, snip in occs[:2]:
            print(f"     [{eid}/{f}] …{snip}…")
    return missing

L, dico, noms = lookup_map()
print(f"Lookup : {len(L)} termes connus.")
audit(dico["entries"], ["definition_concise","sens_profond","meditation","voix_des_maitres"], "tr", "DICTIONNAIRE")
audit(noms["noms"], ["sens_court","lugha","aqli","sufi","part"], "tr", "99 NOMS")
