#!/usr/bin/env python3
"""Trouve les 37 racines restantes dans le lexique Gloton."""
import re, json
from pathlib import Path

pages = sorted(Path("/tmp/gloton_lex_txt").glob("p*.txt"))
ALL = ""
for p in pages:
    page_num = int(re.search(r"p(\d+)", p.stem).group(1))
    ALL += f"\n=PAGE {page_num}=\n" + p.read_text(encoding="utf-8")

SEARCHES = {
    "ʾ-l-h":   ["Adorer en tant que Dieu", "Idée d'adoration absolue", "racine formant les noms Allâh"],
    "ʾ-ḥ-d":   ["Etre un, unique", "Idée d'unicité", "unicité absolue"],
    "w-ḥ-d":   ["Etre seul, unique, isolé", "Etre seul,", "faire un, unifier", "Idée d'unité"],
    "ṣ-m-d":   ["Etre plein, sans creux", "Recourir à qqn", "Idée d'aller droit"],
    "s-b-ḥ":   ["Nager, glisser", "Idée de glorification", "Idée de nage"],
    "sh-h-d":   ["Témoigner, être présent", "Etre témoin", "présent à qqch, témoigner"],
    "ḥ-m-d":   ["Louer, louanger, glorifier", "Idée de louange"],
    "ṣ-l-w":   ["Prier, faire la prière", "Idée de relation rituelle"],
    "kh-l-ṣ":  ["Etre pur, sans mélange", "Idée de pureté absolue", "se débarrasser"],
    "ʿ-q-l":   ["Lier, attacher, retenir", "Idée d'intelligence qui lie"],
    "f-h-m":   ["Comprendre, entendre", "Idée de compréhension"],
    "f-k-r":   ["Penser, réfléchir, méditer"],
    "ʿ-d-l":   ["Etre juste, équitable", "Etre équilibré", "Idée de justice"],
    "kh-sh-y": ["Craindre, redouter, avoir peur", "Idée de crainte révérencielle"],
    "ʾ-d-b":   ["Idée de courtoisie", "Etre bien élevé", "convier à un banquet"],
    "kh-l-q":  ["Créer, façonner", "Idée de création"],
    "g-f-r":   ["Couvrir, pardonner", "Idée de couverture protectrice"],
    "j-h-d":   ["Idée d'effort", "Faire effort", "Lutter"],
    "gh-y-b":  ["Etre absent, caché", "Idée d'absence", "disparaître"],
    "ḥ-y-y":   ["Vivre, être vivant", "Idée de vie"],
    "m-w-t":   ["Mourir, être mort", "Idée de mort"],
    "b-ṣ-r":   ["Voir, regarder", "Idée de vue", "voir avec acuité"],
    "s-m-ʿ":   ["Entendre, écouter", "Idée d'audition"],
    "w-j-h":   ["Tourner sa face", "Idée de face, visage"],
    "k-b-r":   ["Etre grand, devenir grand", "Idée de grandeur"],
    "k-t-b":   ["Ecrire, prescrire", "Idée d'écriture"],
    "m-l-k":   ["Posséder, régner", "Idée de royauté"],
    "r-b-b":   ["Etre seigneur", "Idée de seigneurie", "élever, éduquer"],
    "b-y-n":   ["Etre clair, manifeste", "Idée de clarté", "rendre clair"],
    "q-d-r":   ["Mesurer, décréter", "Idée de mesure", "déterminer la mesure"],
    "kh-y-r":  ["Choisir, préférer", "Idée de choix et de bien", "Etre bon"],
    "kh-l-d":  ["Etre éternel", "demeurer toujours", "Idée d'éternité"],
    "j-n-n":   ["Couvrir, abriter", "Idée de couverture", "être caché"],
    "n-z-l":   ["Descendre, faire descendre", "Idée de descente"],
    "ʿ-r-j":   ["Monter, s'élever", "Idée d'ascension", "Idée de mouvement ascensionnel"],
    "q-w-l":   ["Dire, parler", "Idée de parole"],
    "s-ʾ-l":   ["Demander, interroger", "Idée de question"],
}

results = {}
for root, phrases in SEARCHES.items():
    found = False
    for phrase in phrases:
        for m in re.finditer(re.escape(phrase), ALL, re.IGNORECASE):
            pre = ALL[max(0, m.start()-2500):m.start()]
            nums = list(re.finditer(r"\n(\d{4})\s*\n\s*\(\d+\)", pre))
            page_m = list(re.finditer(r"=PAGE (\d+)=", pre))
            if not nums: continue
            num = nums[-1].group(1)
            page = page_m[-1].group(1) if page_m else "?"
            results[root] = (num, page, phrase)
            print(f"  {root:>8}: #{num} p.{page} [{phrase[:30]}]")
            found = True
            break
        if found: break
    if not found:
        print(f"  {root:>8}: NOT FOUND")
        results[root] = None

# Save results
out = Path(__file__).parent / "found_roots.json"
out.write_text(json.dumps({k: v for k, v in results.items() if v}, ensure_ascii=False, indent=2),
               encoding="utf-8")
print(f"\nSaved to {out}")
