#!/usr/bin/env python3
"""Correction b-ṣ-r (#0126 etait labellisé b-y-n par erreur) + ajout ṣ-m-d."""
import json
from pathlib import Path

UPDATES = {
    "b-ṣ-r": ("Gloton, entrée n°126 (p.271)",
        "Gloton ouvre la racine sur un double mouvement de la vision : <em>« Voir clair, regarder, saisir intuitivement, être clairvoyant, comprendre. »</em> Le nom <em>baṣar</em> couvre <em>« vue, regard, clairvoyance, pénétration, perspicacité, intelligence »</em>. Et la <em>baṣīra</em> est précisée comme : <em>« vue intérieure, faculté de pénétration, intuition, preuve claire, attention, soin »</em>. Pour Gloton, donc, la vision arabe se déploie sur deux niveaux : l'œil physique (<em>baṣar</em>) et l'œil intérieur (<em>baṣīra</em>). Le saint, le sage, le prophète possèdent au plus haut la <em>baṣīra</em> — voir non seulement les choses, mais le sens des choses. Et le verbe <em>tabaṣṣara</em> à la cinquième forme : <em>« observer, considérer, chercher à voir clair »</em> — l'effort actif du regard. Al-Baṣīr (le Très-Voyant) est un Nom divin : Dieu voit non seulement l'apparence mais l'intérieur."),
    "ṣ-m-d": ("Gloton, entrée n°877 (p.505)",
        "Gloton donne pour cette racine une définition d'une densité métaphysique remarquable : <em>« Idée d'appui consistant ou de but précis où l'on se propose d'aller — Se diriger vers qqn, se rendre chez qqn, poser, mettre, fixer qqch ; s'appuyer sur qqn, tenir bon, résister, rester sur ses positions, n'avoir besoin de rien pour exister. »</em> Et le nom est défini explicitement comme : <em>« nom divin — Celui sur lequel on s'appuie — l'Impénétrable — le Soutien universel, maître, seigneur, celui à qui tout s'adresse et qui arrange toute affaire — massif, qui n'a pas de creux ni de bosse. »</em> Gloton cite directement la sourate 112 : <em>« Lui, Allâh (est) Un — Allâh, l'Impénétrable Soutien universel. »</em> Pour Gloton, donc, le <em>Ṣamad</em> coranique est tout à la fois : le but où l'on se dirige (la cible spirituelle), le soutien sur lequel on s'appuie, et l'être <em>sans creux</em> — totalement plein, sans manque, sans besoin. C'est l'unique <em>recours</em> absolu."),
}

DICT_PATH = Path(__file__).resolve().parents[1] / "data" / "racines.json"
data = json.loads(DICT_PATH.read_text(encoding="utf-8"))

# IMPORTANT : la racine b-y-n actuelle dans le JSON pointe à tort vers #0126
# qui est en réalité b-ṣ-r. Il faut :
#   1) retirer le gloton_ref de b-y-n (puisque #0126 n'est pas b-y-n)
#   2) ajouter gloton_ref à b-ṣ-r avec #0126
fixed_byn = False
for r in data["racines"]:
    if r["id"] == "b-y-n":
        if "gloton_ref" in r:
            del r["gloton_ref"]
        if "glose_gloton" in r:
            # Garder une glose neutre (sans citer Gloton)
            r["glose_gloton"] = "Pour la grammaire arabe, la racine b-y-n désigne ce qui sépare et fait apparaître clairement : <em>bayāna</em> (clarté), <em>bayna</em> (entre, intervalle), <em>bayyināt</em> (signes manifestes), <em>tabyīn</em> (exposition). L'entrée précise dans le lexique de Gloton sera ajoutée prochainement."
        fixed_byn = True
        print(f"  ↻ b-y-n : gloton_ref retiré (était erroné)")

# Maintenant appliquer les updates
n = 0
for r in data["racines"]:
    if r["id"] in UPDATES:
        ref, glose = UPDATES[r["id"]]
        r["glose_gloton"] = glose
        r["gloton_ref"] = ref
        n += 1
        print(f"  ✓ {r['id']:>10} → {ref}")

DICT_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"\n{n} racines révisées. b-y-n: {'corrigé' if fixed_byn else 'non touché'}")
