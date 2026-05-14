#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère les icônes du site à partir d'un alif calligraphié (Amiri Quran)
sur fond encre bleu nuit.

Produit :
- assets/img/icon-source.png      (1024×1024, source)
- assets/img/apple-touch-icon.png (180×180, iOS)
- assets/img/icon-192.png         (Android/PWA)
- assets/img/icon-512.png         (Android/PWA, splash)
- assets/img/favicon-32.png
- assets/img/favicon-16.png
- assets/img/favicon.ico          (16/32/48)
- manifest.webmanifest             (à la racine)
"""

import os, json
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG  = os.path.join(ROOT, "assets", "img")
os.makedirs(IMG, exist_ok=True)

ENCRE = (15, 24, 48, 255)
OR    = (184, 134, 11, 255)


def find_amiri():
    """Cherche Amiri Quran (préféré) ou Amiri Regular. Sinon fallback."""
    candidates = [
        os.path.join(ROOT, "assets", "fonts", "AmiriQuran.ttf"),
        os.path.join(ROOT, "assets", "fonts", "Amiri-Regular.ttf"),
        "/tmp/amiri_fonts/Amiri-1.001/AmiriQuran.ttf",
        "/tmp/amiri_fonts/Amiri-1.001/Amiri-Regular.ttf",
        "/System/Library/Fonts/SFArabic.ttf",
        "/System/Library/Fonts/GeezaPro.ttc",
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return None


def draw_alif(size: int, font_path: str) -> Image.Image:
    """Dessine un alif centré, or sur encre, qui occupe ~78% de la hauteur."""
    img = Image.new("RGBA", (size, size), ENCRE)
    d = ImageDraw.Draw(img)
    text = "ا"
    # Taille de police : l'alif Amiri est très étroit et grand, ~78% marche bien
    font_size = int(size * 0.78)
    font = ImageFont.truetype(font_path, font_size)
    bbox = d.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1]
    d.text((x, y), text, font=font, fill=OR)
    return img


def save(img: Image.Image, name: str):
    path = os.path.join(IMG, name)
    img.save(path, optimize=True)
    print(f"  ✓ {name}  ({img.size[0]}×{img.size[1]})")


def main():
    font_path = find_amiri()
    if not font_path:
        raise SystemExit("ERREUR : Amiri introuvable. Place AmiriQuran.ttf "
                         "dans assets/fonts/ ou /tmp/amiri_fonts/...")
    print(f"Police : {font_path}\nGénération des icônes…")

    source = draw_alif(1024, font_path)
    save(source, "icon-source.png")

    # Pour les petites tailles : on regénère depuis la source haute résolution
    # (resize Lanczos) — ça préserve mieux le trait que dessiner directement à 16px.
    save(source.resize((180, 180), Image.LANCZOS), "apple-touch-icon.png")
    save(source.resize((192, 192), Image.LANCZOS), "icon-192.png")
    save(source.resize((512, 512), Image.LANCZOS), "icon-512.png")
    save(source.resize((32, 32),   Image.LANCZOS), "favicon-32.png")
    save(source.resize((16, 16),   Image.LANCZOS), "favicon-16.png")

    ico_path = os.path.join(IMG, "favicon.ico")
    source.resize((48, 48), Image.LANCZOS).save(
        ico_path, sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print(f"  ✓ favicon.ico  (16, 32, 48)")

    # Manifest PWA
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
    with open(os.path.join(ROOT, "manifest.webmanifest"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print("  ✓ manifest.webmanifest")
    print("\nTerminé.")


if __name__ == "__main__":
    main()
