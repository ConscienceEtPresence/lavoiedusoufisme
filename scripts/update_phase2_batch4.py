#!/usr/bin/env python3
"""Phase 2 batch 4 : 5 racines de plus avec Gloton authentique."""
import json
from pathlib import Path

UPDATES = {
    "j-n-n": ("Gloton, entrée n°270 (p.316)",
        "Gloton donne pour cette racine l'intuition matricielle : <em>« Idée de recouvrir, d'être possédé — (se) couvrir, envelopper, obscurcir, cacher, être rendu invisible. »</em> Toutes les dérivés saisissants de cette racine descendent du même geste : <em>janna</em> (le jardin, couvert de végétation) ; <em>jinn</em> (les êtres cachés au regard humain) ; <em>junūn</em> (la folie, où l'esprit est <em>recouvert</em>) ; <em>janīn</em> (l'embryon, couvert dans la matrice). Pour Gloton, donc, le jardin paradisiaque et l'être caché partagent leur structure : tous deux sont <em>recouverts</em>. Quand le Coran promet la <em>janna</em> aux serviteurs, ce n'est pas seulement un jardin de plaisir — c'est un lieu où l'on est enveloppé, abrité, voilé du regard ordinaire."),
    "kh-l-ṣ": ("Gloton, entrée n°433 (p.359)",
        "Gloton donne pour cette racine une définition saisissante par sa précision philosophique : <em>« Idée de fin d'un processus sélectif (catharsis) — Etre tout blanc, pur, sans tache, limpide, sans mélange, dégagé de tout ce qui le souillait. »</em> Le mot <em>ikhlāṣ</em> (sincérité) descend donc d'un processus de <em>catharsis</em> : il n'est pas un état initial mais l'<em>aboutissement</em> d'un long travail de purification. La sourate 112 — la sourate de la pure unicité — porte le nom <em>al-Ikhlāṣ</em> : non parce qu'elle évoque la sincérité, mais parce qu'elle est la <em>quintessence dégagée</em> de la doctrine du tawḥīd. Pour Gloton, donc, être sincère est étymologiquement <em>avoir été passé au feu de la sélection</em> — ne rester que ce qui ne se mêle à rien."),
    "kh-sh-y": ("Gloton, entrée n°450 (p.371)",
        "Gloton donne pour cette racine une gradation de la peur : <em>« Craindre, se méfier, avoir peur, s'alarmer, s'effrayer, appréhender, redouter, être inquiet. »</em> Mais — et c'est essentiel — la khashya coranique se distingue de la simple peur (<em>khawf</em>) en ceci : elle s'accompagne de <em>connaissance</em>. Le verset le dit explicitement : <em>« Parmi Ses serviteurs, seuls les savants (al-ʿulamāʾ) craignent Dieu (yakhshā) »</em> (35, 28). Pour Gloton, donc, la khashya est <em>la peur du connaissant</em> — celle qui naît de la conscience aiguë du rang divin, non d'une menace extérieure. C'est trembler de proximité, non d'éloignement."),
    "s-ʾ-l": ("Gloton, entrée n°761 (p.469)",
        "Gloton donne pour cette racine une définition apparemment simple : <em>« Demander, questionner, interroger qqn. »</em> Mais le déploiement du nom est riche : <em>« question, demande, requête, prière, supplication, mendicité »</em>. Pour Gloton, la racine s-ʾ-l englobe toute la gamme du <em>demander</em> — de la question intellectuelle à la mendicité. Et le Coran insiste : <em>« Demande à ceux qui savent »</em> (16, 43). La question n'est pas marque d'ignorance — c'est porte de connaissance. Et la <em>mendicité</em> spirituelle (être <em>sāʾil</em> auprès de Dieu) est la condition même de la création : <em>« Ô hommes, c'est vous les mendiants en besoin de Dieu »</em> (35, 15)."),
    "ʾ-d-b": ("Gloton, entrée n°609 (p.421)",
        "Gloton donne pour cette racine un déploiement étonnant qui joint discipline et jardin : <em>« Dompter, dresser par des exercices ; jardin bien arrangé, bien cultivé et prospère, riche verger ordonné, riche parterre, végétation prospère. »</em> Le mot <em>adab</em> couvre donc <em>« discipline, exercice, civilité, savoir-vivre, courtoisie, raffinement »</em> mais aussi <em>« banquet, festin »</em>. L'intuition centrale est limpide : la courtoisie spirituelle est l'<em>ordonnancement</em> de la conduite, comme un jardin est ordonné. Pour Gloton, donc, l'<em>adab</em> soufi est l'art de cultiver son comportement comme un verger — élaguer ce qui dépasse, arroser ce qui pousse droit, et offrir la beauté résultante en <em>banquet</em> à l'invité divin."),
}

DICT_PATH = Path(__file__).resolve().parents[1] / "data" / "racines.json"
data = json.loads(DICT_PATH.read_text(encoding="utf-8"))
n = 0
for r in data["racines"]:
    if r["id"] in UPDATES:
        ref, glose = UPDATES[r["id"]]
        r["glose_gloton"] = glose
        r["gloton_ref"] = ref
        n += 1
        print(f"  ✓ {r['id']:>10} → {ref}")
DICT_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"\n{n} racines révisées.")
