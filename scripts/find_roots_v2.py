#!/usr/bin/env python3
"""Recherche par phrases-signatures dans le corps entier des entrées."""
import json, re

idx = json.load(open("/tmp/gloton_index.json"))

# Phrases TRÈS spécifiques pour chaque racine — chercher dans le corps entier
# Format: (root_id, [phrases qui doivent matcher], (lo, hi) plage de num d'entrées)
QUERIES = [
    # racine → mots/phrases distinctifs dans la déf principale
    ("t-w-b", ["Revenir", "se repentir", "Repentir"], (1, 500)),
    ("h-b-b", ["Aimer", "chérir", "graine"], (300, 600)),
    ("h-q-q", ["Etre vrai", "Etre véritable", "Etre fondé", "Etre avéré", "vérité"], (300, 700)),
    ("dh-k-r", ["Rappeler", "Mentionner", "Se souvenir", "rappel"], (500, 800)),
    ("r-h-m", ["Avoir pitié", "miséricorde", "tendresse", "utérus", "matrice"], (600, 900)),
    ("r-w-h", ["souffle", "souffler", "Vent", "Esprit"], (700, 950)),
    ("sh-k-r", ["Remercier", "reconnaiss", "gratitude"], (850, 1050)),
    ("s-b-r", ["Etre patient", "patience", "Endurer"], (900, 1100)),
    ("ʿ-b-d", ["Adorer", "servir", "Esclave", "serviteur"], (1000, 1200)),
    ("ʿ-l-m", ["Savoir", "Connaître", "Enseigner", "signe distinctif"], (1100, 1300)),
    ("f-q-r", ["pauvre", "Etre pauvre", "indigent", "vertèbre"], (1230, 1380)),
    ("q-r-b", ["Etre proche", "Approcher", "Se rapprocher"], (1300, 1450)),
    ("q-l-b", ["retourner", "Renverser", "cœur"], (1350, 1480)),
    ("n-f-s", ["Respirer", "Souffler", "Etre précieux", "Ame"], (1550, 1700)),
    ("n-w-r", ["Briller", "Eclairer", "Donner de la lumière", "Luire"], (1580, 1706)),
]

for root_id, phrases, (lo, hi) in QUERIES:
    print(f"\n{'='*60}")
    print(f"== {root_id}")
    print(f"{'='*60}")
    cands = []
    for e in idx:
        n = int(e["num"])
        if not (lo <= n <= hi): continue
        body = e["body"]
        # Pour chaque phrase, vérifier la présence
        hits = [ph for ph in phrases if ph.lower() in body.lower()]
        if hits:
            # Le rang de la phrase dans le body (plus haut = plus probable que ce soit la def principale)
            pos = min(body.lower().find(ph.lower()) for ph in hits)
            cands.append({
                "num": e["num"], "page": e["page"],
                "pos": pos, "hits": hits, "body": body[:400]
            })
    # Trier : ceux où la phrase apparaît tôt dans le body (= déf principale) en premier
    cands.sort(key=lambda x: x["pos"])
    for c in cands[:3]:
        print(f"\n  → #{c['num']} (p.{c['page']}) pos={c['pos']} hits={c['hits']}")
        first_line = "\n    ".join(c['body'].split('\n')[:6])
        print(f"    {first_line}")
