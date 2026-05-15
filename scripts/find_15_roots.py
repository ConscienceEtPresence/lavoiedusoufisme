#!/usr/bin/env python3
"""Trouve les 15 racines de la Phase 1 dans le lexique de Gloton."""
import json, re
from pathlib import Path

idx = json.load(open("/tmp/gloton_index.json"))

# Pour chaque racine : signature française dans la 1ère définition + position alphabétique approximative
# Position approximative dans l'ordre alphabétique arabe
ROOTS = [
    ("t-w-b", ["repent", "revenir vers", "retour vers"], 200, 500),
    ("h-b-b", ["aimer", "chérir", "amour"], 380, 480),
    ("h-q-q", ["être avéré", "vrai", "véritable", "réalité"], 470, 600),
    ("dh-k-r", ["rappeler", "mentionner", "se souvenir"], 600, 750),
    ("r-h-m", ["miséricord", "utérus", "matrice"], 700, 850),
    ("r-w-h", ["souffler", "esprit", "vent"], 750, 900),
    ("sh-k-r", ["remercier", "reconnaissan", "gratitude"], 900, 1020),
    ("s-b-r", ["patien", "endurer", "constance"], 950, 1080),
    ("ʿ-b-d", ["adorer", "servir"], 1050, 1200),
    ("ʿ-l-m", ["savoir", "connaître", "instruire", "enseigner"], 1100, 1280),
    ("f-q-r", ["pauvre", "vertèbre", "besoin essentiel", "indigent"], 1250, 1380),
    ("q-r-b", ["approcher", "rapprocher", "être proche"], 1330, 1450),
    ("q-l-b", ["retourner", "renverser", "cœur"], 1370, 1480),
    ("n-f-s", ["respirer", "souffler", "âme"], 1560, 1680),
    ("n-w-r", ["lumière", "éclairer", "luire", "briller"], 1600, 1700),
]

# Construire une vue facilement cherchable : num, full_def_text
for root_id, signatures, lo, hi in ROOTS:
    print(f"\n{'='*60}")
    print(f"== ROOT {root_id}  (entries {lo}-{hi})")
    print(f"{'='*60}")
    found = []
    for e in idx:
        n = int(e["num"])
        if not (lo <= n <= hi): continue
        body_lower = e["body"].lower()
        for sig in signatures:
            if sig.lower() in body_lower:
                # Ne pas répéter
                if not any(x["num"] == e["num"] for x in found):
                    # Calculer score
                    score = sum(1 for s in signatures if s.lower() in body_lower)
                    found.append({"num": e["num"], "page": e["page"], "first_def": e["first_def"][:120], "score": score, "match": sig})
                    break
    found.sort(key=lambda x: -x["score"])
    for f in found[:5]:
        print(f"  [{f['score']}] #{f['num']} p.{f['page']} → {f['first_def']}")
