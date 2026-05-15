#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Génère 3 variantes d'icône à comparer (PNG 512×512)."""

import os, math
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets", "img", "variants")
os.makedirs(OUT, exist_ok=True)

ENCRE = (15, 24, 48, 255)
OR    = (184, 134, 11, 255)
SIZE  = 512


def find_arabic_font():
    """Cherche une police arabe disponible sur le système."""
    candidates = [
        "/tmp/amiri_fonts/Amiri-1.001/AmiriQuran.ttf",
        "/tmp/amiri_fonts/Amiri-1.001/Amiri-Regular.ttf",
        "/System/Library/Fonts/SFArabic.ttf",
        "/System/Library/Fonts/GeezaPro.ttc",
    ]
    for c in candidates:
        if os.path.exists(c):
            return c
    return None


# ---------- Variante 1 : Alif calligraphique ----------
def variant_alif():
    img = Image.new("RGBA", (SIZE, SIZE), ENCRE)
    d = ImageDraw.Draw(img)
    font_path = find_arabic_font()
    if font_path:
        # Caractère alif avec hamza ou seul
        try:
            font = ImageFont.truetype(font_path, int(SIZE * 0.78))
        except Exception:
            font = ImageFont.truetype(font_path, int(SIZE * 0.78), index=0)
        text = "ا"
        # Mesure et centre
        bbox = d.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        x = (SIZE - tw) / 2 - bbox[0]
        y = (SIZE - th) / 2 - bbox[1]
        d.text((x, y), text, font=font, fill=OR)
    else:
        # Fallback : trait vertical simple
        w = int(SIZE * 0.08)
        d.rounded_rectangle(
            [SIZE/2 - w/2, SIZE*0.12, SIZE/2 + w/2, SIZE*0.88],
            radius=w/2, fill=OR
        )
    img.save(os.path.join(OUT, "1-alif.png"))
    print("  ✓ 1-alif.png")


# ---------- Variante 2 : Étoile ✦ à 4 branches ----------
def variant_etoile():
    img = Image.new("RGBA", (SIZE, SIZE), ENCRE)
    d = ImageDraw.Draw(img)
    cx = cy = SIZE / 2
    R = SIZE * 0.40   # rayon des longues pointes
    r = SIZE * 0.10   # rayon du creux (étoile très effilée)
    # 8 points alternés (4 longues + 4 courtes intercalées)
    pts = []
    for i in range(8):
        angle = -math.pi/2 + i * math.pi/4
        radius = R if i % 2 == 0 else r
        pts.append((cx + radius * math.cos(angle),
                    cy + radius * math.sin(angle)))
    d.polygon(pts, fill=OR)
    img.save(os.path.join(OUT, "2-etoile.png"))
    print("  ✓ 2-etoile.png")


# ---------- Variante 3 : Khātam — rosette 8 pointes ----------
def variant_khatam():
    img = Image.new("RGBA", (SIZE, SIZE), ENCRE)
    d = ImageDraw.Draw(img)
    cx = cy = SIZE / 2
    R = SIZE * 0.42
    # Deux carrés superposés à 45°
    stroke = max(3, int(SIZE * 0.012))
    # carré 1 (droit)
    pts1 = [(cx + R * math.cos(-math.pi/2 + i * math.pi/2),
             cy + R * math.sin(-math.pi/2 + i * math.pi/2)) for i in range(4)]
    # carré 2 (tourné de 45°)
    pts2 = [(cx + R * math.cos(-math.pi/4 + i * math.pi/2),
             cy + R * math.sin(-math.pi/4 + i * math.pi/2)) for i in range(4)]
    # Polygones creux (juste le contour)
    d.polygon(pts1, outline=OR, width=stroke)
    d.polygon(pts2, outline=OR, width=stroke)
    # Point central
    rc = SIZE * 0.04
    d.ellipse([cx - rc, cy - rc, cx + rc, cy + rc], fill=OR)
    img.save(os.path.join(OUT, "3-khatam.png"))
    print("  ✓ 3-khatam.png")


if __name__ == "__main__":
    print(f"Police arabe : {find_arabic_font() or '(aucune trouvée — fallback trait)'}")
    variant_alif()
    variant_etoile()
    variant_khatam()
    print(f"\nFichiers dans : {OUT}")
