#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Injecte les balises icônes/manifest/theme-color dans le <head> de toutes les
pages HTML. Calcule le chemin relatif pour chaque page selon sa profondeur.
Idempotent : marqueur HTML pour ne pas dupliquer.
"""

import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARKER_BEGIN = "<!-- icons:begin -->"
MARKER_END   = "<!-- icons:end -->"


def block(prefix: str) -> str:
    """Construit le bloc à injecter, avec le bon préfixe relatif."""
    return f"""  {MARKER_BEGIN}
  <link rel="apple-touch-icon" sizes="180x180" href="{prefix}assets/img/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="32x32" href="{prefix}assets/img/favicon-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="{prefix}assets/img/favicon-16.png" />
  <link rel="shortcut icon" href="{prefix}assets/img/favicon.ico" />
  <link rel="manifest" href="{prefix}manifest.webmanifest" />
  <meta name="theme-color" content="#0F1830" />
  <meta name="apple-mobile-web-app-title" content="Soufisme" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  {MARKER_END}"""


def relprefix(html_path: str) -> str:
    """Chemin relatif (avec slashs) depuis le fichier HTML jusqu'à la racine du site."""
    rel = os.path.relpath(ROOT, os.path.dirname(html_path))
    if rel == ".":
        return ""
    return rel.replace(os.sep, "/") + "/"


def process(html_path: str):
    with open(html_path, encoding="utf-8") as f:
        html = f.read()

    prefix = relprefix(html_path)
    new_block = block(prefix)

    if MARKER_BEGIN in html:
        # Remplace le bloc existant
        pat = re.compile(re.escape(MARKER_BEGIN) + r".*?" + re.escape(MARKER_END),
                         re.DOTALL)
        updated = pat.sub(new_block.strip(), html)
        action = "MAJ"
    else:
        # Injecte juste après <meta name="viewport" …> si présent, sinon après <head>
        m = re.search(r"<meta[^>]+name=[\"']viewport[\"'][^>]*>", html)
        if m:
            i = m.end()
            updated = html[:i] + "\n" + new_block + html[i:]
        else:
            m = re.search(r"<head[^>]*>", html)
            if not m:
                print(f"  ! Pas de <head> dans {html_path}, ignoré")
                return
            i = m.end()
            updated = html[:i] + "\n" + new_block + html[i:]
        action = "ajout"

    if updated != html:
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(updated)
        rel = os.path.relpath(html_path, ROOT)
        print(f"  ✓ [{action}] {rel}  (préfixe = '{prefix or './'}')")


def main():
    files = []
    for dirpath, _, filenames in os.walk(ROOT):
        # Ignore dossiers non-pertinents
        if any(seg in dirpath for seg in ("/scripts", "/data", "/.git", "/node_modules")):
            continue
        for fn in filenames:
            if fn.endswith(".html"):
                files.append(os.path.join(dirpath, fn))
    files.sort()
    print(f"{len(files)} pages HTML à traiter…\n")
    for fp in files:
        process(fp)
    print("\nTerminé.")


if __name__ == "__main__":
    main()
