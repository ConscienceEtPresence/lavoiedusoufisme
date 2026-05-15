#!/usr/bin/env python3
"""Met à jour 8 fiches du dictionnaire des racines avec le texte authentique de Gloton."""
import json
from pathlib import Path

# Pour chaque racine : la glose Gloton AUTHENTIQUE (extraite et reformulée
# en gardant Gloton's signature phrasing intacte) + la référence d'entrée.
UPDATES = {
    "r-h-m": {
        "gloton_ref": "Gloton, entrée n°551 (p.403)",
        "glose_gloton": "Gloton écrit littéralement : <em>« Idée d'endroit dilatable où est déposé la semence qui actualise des possibilités selon un processus d'amour, d'où idée de matrice, de miséricorde, d'amour expansif, d'épanouissement, de rayonnement, de germination. »</em> Le verbe central — <em>rayonner d'amour, avoir pitié, faire miséricorde, avoir compassion, être clément</em> — comporte aussi une nuance saisissante : <em>mourir à la suite des couches</em>. La miséricorde divine est donc, chez Gloton, ce <em>dilatable</em> où la semence advient : un amour qui rayonne en germant, et qui peut coûter à celle qui le porte.",
        "core_fr": "L'amour rayonnant — matrice et miséricorde"
    },
    "t-w-b": {
        "gloton_ref": "Gloton, entrée n°189 (p.292)",
        "glose_gloton": "Gloton donne pour cette racine quatre verbes en chaîne : <em>« Revenir, retourner, se convertir, se repentir. »</em> Le nom d'action — <em>tawba</em> — signifie <em>« retour, repentir, conversion »</em>, et le nom intensif <em>tawwāb</em> celui <em>« qui revient sans cesse »</em>. Sans cesse — le mot importe : pour Gloton, la <em>tawba</em> n'est pas un acte ponctuel mais une qualité du cœur qui se retourne à chaque souffle. Et Dieu, comme l'homme, est nommé par cette racine : Il est at-Tawwāb, Celui qui revient toujours vers Sa créature.",
        "core_fr": "Le retour qui ne cesse pas"
    },
    "h-b-b": {
        "gloton_ref": "Gloton, entrée n°288 (p.321)",
        "glose_gloton": "Gloton est explicite sur le lien entre la graine et l'amour, qu'il pose en intuition centrale : <em>« Idée de graine, de semence dans laquelle l'amour est inclus, la création étant produite par et dans l'Amour. »</em> Les verbes — <em>aimer, chérir, affectionner, vouloir</em> — descendent de cette racine séminale. Le nom <em>ḥabba</em> est <em>« graine, semence — nom collectif et nom d'unité »</em> ; le nom d'action <em>ḥubb</em> est <em>« amour, affection, amour fécondant, germinatif »</em>. Pour Gloton, aimer c'est laisser une semence prendre — non subir une passion qui passe.",
        "core_fr": "L'amour fécondant — graine et germination"
    },
    "dh-k-r": {
        "gloton_ref": "Gloton, entrée n°518 (p.390)",
        "glose_gloton": "Gloton dévoile ici une parenté étonnante que la traduction courante voile : la même racine désigne le <em>« membre de la génération »</em> (le mâle, qui émet les germes) et l'acte de <em>« se souvenir, se rappeler, mentionner, se remémorer »</em>. Il écrit : <em>« Toucher, frapper ou blesser qqn au membre de la génération — Se souvenir, se rappeler, mentionner, se remémorer. »</em> Le <em>dhikr</em>, dans cette perspective, est donc proche du geste qui <em>féconde</em> : se souvenir de Dieu, c'est laisser tomber une semence qui pousse. Le rappel et le mâle partagent leur racine parce que tous deux <em>déposent</em>.",
        "core_fr": "Le rappel qui féconde"
    },
    "r-w-h": {
        "gloton_ref": "Gloton, entrée n°607 (p.420)",
        "glose_gloton": "Gloton retrouve sous cette racine plusieurs nuances inséparables : <em>« Idée de bonne odeur, de mouvement d'air rafraîchissant et reposant le soir, faire qqch le soir, s'en aller le soir, se coucher (soleil), avoir vent de qqch, être exposé au vent, se réjouir de qqch. »</em> Le premier dérivé <em>rawḥ</em> est <em>« souffle frais, léger du vent, repos, joie, détente, contentement, compassion, assistance, secours »</em> ; et c'est seulement au degré suivant que vient <em>rūḥ</em> — <em>« souffle spirituel de vie, esprit vital, principe spirituel de la vie, âme, esprit (divin) »</em>. L'esprit, en arabe coranique, n'est donc pas séparé du vent du soir : c'est l'air rafraîchissant lui-même, élevé jusqu'à porter la vie.",
        "core_fr": "Le souffle frais qui anime"
    },
    "sh-k-r": {
        "gloton_ref": "Gloton, entrée n°805 (p.482)",
        "glose_gloton": "Gloton lie l'idée de gratitude à celle d'accroissement organique : <em>« Idée d'accroissement, de fructification, d'abondance, de production, de plénitude, de reconnaissance. »</em> Les verbes — <em>remercier, louer, être reconnaissant, faire des actions de grâce, récompenser</em> — voisinent étonnamment avec des images concrètes : <em>« produire des rejetons, donner du lait en abondance, être gros de pluie, devenir généreux »</em>. Remercier, dans cette racine, c'est laisser le don <em>fructifier</em> — comme une bête nourrie devient grasse, comme un nuage gros de pluie féconde la terre.",
        "core_fr": "La gratitude qui fait fructifier"
    },
    "s-b-r": {
        "gloton_ref": "Gloton, entrée n°835 (p.491)",
        "glose_gloton": "Gloton ouvre cette racine sur un acte concret avant d'arriver au sens moral : <em>« 1/ Lier, attacher qqn à qqch, retenir qqn pour l'empêcher de faire qqch, retenir, empêcher, forcer, contraindre, 2/ être constant, patient, attendre, supporter avec endurance, endurer. »</em> La patience est donc d'abord un <em>lien</em> : se tenir <em>attaché</em> à ce qui ne change pas, là où tout incite à fuir. Ce n'est pas une vertu passive — c'est une fermeté <em>active</em>, un nœud serré contre le vent.",
        "core_fr": "La fermeté qui se tient liée"
    },
    "n-w-r": {
        "gloton_ref": "Gloton, entrée n°1572 (p.734)",
        "glose_gloton": "Gloton restitue le double mouvement de la racine : <em>« Briller, luire, apercevoir un feu ou la lumière de loin, illuminer, rayonner, éclairer, éviter qqch, prendre la fuite, fuir. »</em> Étonnamment, la même racine porte <em>illuminer</em> et <em>fuir</em> — comme si la lumière, quand on la cherche, à la fois éclaire et fait reculer. La lumière coranique n'est pas un simple éclairage : c'est une présence qui révèle, mais que la créature, parfois, fuit autant qu'elle l'attire.",
        "core_fr": "La lumière qui révèle et que l'on fuit"
    },
}

# Charger
DICT_PATH = Path(__file__).resolve().parents[1] / "data" / "racines.json"
data = json.loads(DICT_PATH.read_text(encoding="utf-8"))

# Appliquer
n_updated = 0
for r in data["racines"]:
    if r["id"] in UPDATES:
        u = UPDATES[r["id"]]
        r["glose_gloton"] = u["glose_gloton"]
        r["gloton_ref"] = u["gloton_ref"]
        if "core_fr" in u:
            # Garde l'ancien comme alternative, mais met la version Gloton-aligned
            r["core_fr_original"] = r.get("core_fr", "")
            r["core_fr"] = u["core_fr"]
        n_updated += 1

print(f"Updated {n_updated} fiches")

# Sauvegarder
DICT_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Saved to {DICT_PATH}")
