#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère les icônes du site à partir du motif "brand__mark" :
3 cercles concentriques dorés sur fond encre bleu nuit.

Produit :
- assets/img/icon-source.png     (1024×1024, source)
- assets/img/apple-touch-icon.png (180×180, iOS)
- assets/img/icon-192.png        (Android/PWA)
- assets/img/icon-512.png        (Android/PWA, splash)
- assets/img/favicon-32.png
- assets/img/favicon-16.png
- assets/img/favicon.ico         (multi-tailles 16/32/48)
- manifest.webmanifest            (à la racine du site)
"""

import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG  = os.path.join(ROOT, "assets", "img")
os.makedirs(IMG, exist_ok=True)

# Palette du site
ENCRE = (15, 24, 48, 255)       # #0F1830
OR    = (184, 134, 11, 255)     # #B8860B
CREME = (251, 247, 239, 255)    # #FBF7EF


def draw_mark(size: int, bg=ENCRE, fg=OR) -> Image.Image:
    """Dessine le motif : grand cercle, cercle intérieur, petit point central.
    Reproduit fidèlement le SVG brand__mark (viewBox 32, r=13/7/1.5)."""
    img = Image.new("RGBA", (size, size), bg)
    d = ImageDraw.Draw(img)

    # Échelle : SVG est en 32 unités. On centre.
    scale = size / 32.0
    cx = cy = size / 2.0

    # Épaisseur du trait (SVG : stroke-width 1.2 sur viewBox 32)
    stroke = max(2, int(round(1.2 * scale)))

    # Grand cercle (r = 13)
    r1 = 13 * scale
    d.ellipse([cx - r1, cy - r1, cx + r1, cy + r1],
              outline=fg, width=stroke)

    # Cercle intérieur (r = 7)
    r2 = 7 * scale
    d.ellipse([cx - r2, cy - r2, cx + r2, cy + r2],
              outline=fg, width=stroke)

    # Point central plein (r = 1.5)
    r3 = 1.5 * scale
    d.ellipse([cx - r3, cy - r3, cx + r3, cy + r3], fill=fg)

    return img


def save(img: Image.Image, name: str):
    path = os.path.join(IMG, name)
    img.save(path, optimize=True)
    print(f"  ✓ {name}  ({img.size[0]}×{img.size[1]})")


def main():
    print("Génération des icônes…")

    # Source haute résolution (or sur encre — version principale)
    source = draw_mark(1024)
    save(source, "icon-source.png")

    # iOS : apple-touch-icon (180×180), fond opaque obligatoire
    save(source.resize((180, 180), Image.LANCZOS), "apple-touch-icon.png")

    # PWA / Android
    save(source.resize((192, 192), Image.LANCZOS), "icon-192.png")
    save(source.resize((512, 512), Image.LANCZOS), "icon-512.png")

    # Favicons PNG
    save(source.resize((32, 32), Image.LANCZOS), "favicon-32.png")
    save(source.resize((16, 16), Image.LANCZOS), "favicon-16.png")

    # Favicon multi-tailles
    ico_path = os.path.join(IMG, "favicon.ico")
    source.resize((48, 48), Image.LANCZOS).save(
        ico_path, sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print(f"  ✓ favicon.ico  (16, 32, 48)")

    # Manifest Web pour Android/Chrome
    manifest = {
        "name": "La voie du soufisme",
        "short_name": "Soufisme",
        "description": "Bibliothèque vivante du soufisme — en français, arabe vocalisé.",
        "start_url": "/lavoiedusoufisme/",
        "scope": "/lavoiedusoufisme/",
        "display": "standalone",
        "background_color": "#0F1830",
        "theme_color": "#0F1830",
        "icons": [
            {"src": "assets/img/icon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "assets/img/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any"},
            {"src": "assets/img/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}
        ]
    }
    import json
    manifest_path = os.path.join(ROOT, "manifest.webmanifest")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"  ✓ manifest.webmanifest")

    print("\nTerminé.")


if __name__ == "__main__":
    main()
