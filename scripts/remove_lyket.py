#!/usr/bin/env python3
"""Supprime toutes les références à Lyket sur le site."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Fichiers à nettoyer (HTML)
files = sorted(ROOT.rglob("*.html"))
n_touched = 0
n_blocks_removed = 0
n_links_removed = 0
n_scripts_removed = 0

for f in files:
    text = f.read_text(encoding="utf-8")
    orig = text

    # 1) Lien CSS lyket
    text, n = re.subn(
        r'[ \t]*<link[^>]*lyket\.css[^>]*>\s*\n?', '', text, flags=re.IGNORECASE)
    n_links_removed += n

    # 2) Script lyket (avec apiKey)
    text, n = re.subn(
        r'[ \t]*<script[^>]*lyket[^>]*>\s*</script>\s*\n?', '', text, flags=re.IGNORECASE)
    n_scripts_removed += n

    # 3) Le bloc "like-block" entier — souvent enveloppé dans <section class="container...">
    # On supprime la <section> qui contient le bloc like
    pattern = re.compile(
        r'(?:[ \t]*<section[^>]*>\s*)?'
        r'[ \t]*<div class="like-block">.*?</div>\s*'
        r'(?:</section>\s*)?',
        flags=re.DOTALL | re.IGNORECASE)
    text, n = pattern.subn('', text)
    n_blocks_removed += n

    # Nettoyage des lignes vides multiples qui auraient pu apparaître
    text = re.sub(r'\n{4,}', '\n\n\n', text)

    if text != orig:
        f.write_text(text, encoding="utf-8")
        n_touched += 1
        print(f"  {f.relative_to(ROOT)}")

print(f"\n{n_touched} fichiers modifiés")
print(f"  - {n_links_removed} liens CSS supprimés")
print(f"  - {n_scripts_removed} scripts supprimés")
print(f"  - {n_blocks_removed} blocs <like-block> supprimés")

# Nettoyer aussi le JS principal (noms-divins.js peut avoir des refs)
js_files = list(ROOT.rglob("*.js"))
for jf in js_files:
    text = jf.read_text(encoding="utf-8")
    if "lyket" in text.lower():
        # Pour le JS, on ne touche pas automatiquement — on affiche juste où
        for i, line in enumerate(text.split("\n"), 1):
            if "lyket" in line.lower():
                print(f"  JS ref: {jf.relative_to(ROOT)}:{i} → {line.strip()[:100]}")

# Supprimer le fichier lyket.css
lyket_css = ROOT / "assets" / "css" / "lyket.css"
if lyket_css.exists():
    lyket_css.unlink()
    print(f"\n✗ Supprimé : {lyket_css.relative_to(ROOT)}")
