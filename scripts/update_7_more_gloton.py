#!/usr/bin/env python3
"""Met à jour les 7 racines restantes avec le texte authentique de Gloton."""
import json
from pathlib import Path

UPDATES = {
    "h-q-q": {
        "gloton_ref": "Gloton, entrée n°348 (p.338)",
        "glose_gloton": "Gloton ouvre la racine sur une intuition juridique avant d'aboutir au métaphysique : <em>« L'emporter sur qqn par le droit, devoir, rendre nécessaire, indispensable, être dû, savoir avec certitude, s'assurer de, tomber juste, (se) constater, se réaliser. »</em> Le ḥaqq, dans cette perspective, n'est pas une vérité abstraite — c'est <em>ce qui s'impose, ce qui ne peut qu'être</em>. Dire que Dieu est al-Ḥaqq, c'est dire qu'Il est ce qui ne <em>peut pas ne pas être</em> : Lui seul tombe juste, Lui seul se constate, Lui seul se réalise. Le nom dérivé <em>ḥaqīqa</em> désigne donc la <em>réalité essentielle</em> : ce qui demeure quand tout le reste a passé.",
        "core_fr": "Ce qui s'impose comme réel"
    },
    "ʿ-b-d": {
        "gloton_ref": "Gloton, entrée n°970 (p.536)",
        "glose_gloton": "Gloton aligne pour cette racine un déploiement de verbes serviciels qui couvre toute l'amplitude du sens : <em>« Servir, être en service, travailler, faire des efforts, s'évertuer, devenir pieux, se dévouer entièrement, adorer, rendre un culte, avoir de la dévotion pour, vénérer, exercer une fonction, suppléer. »</em> Le <em>ʿabd</em> est défini comme <em>« servant, serviteur, adorateur, qui exerce une fonction subalterne, esclave, serf — serviteur ou adorateur (de Dieu) »</em>. Et le nom abstrait <em>ʿibāda</em> rassemble : <em>« service, servitude, adoration, fonction subalterne, dévotion, culte »</em>. Pour Gloton, donc, la frontière entre travail, fonction et adoration s'efface dans cette racine — celui qui sert vraiment <em>adore</em>, qu'il en ait conscience ou non.",
        "core_fr": "Le service qui devient adoration"
    },
    "ʿ-l-m": {
        "gloton_ref": "Gloton, entrée n°1040 (p.560)",
        "glose_gloton": "Gloton restitue ici une genèse remarquable de la connaissance : <em>« 1/ Marquer, distinguer par une marque, un signe, fixer, fendre, 2/ discerner, signifier, établir un lien entre différents signes, savoir, connaître, être savant, savoir distinguer une chose d'une autre, être instruit, informé, avoir conscience de, surpasser qqn en science. »</em> Le savoir naît donc, en arabe, du geste de <em>marquer</em> — fendre la matière pour y poser un signe distinctif. Le nom <em>ʿalāma</em> est <em>« signe, marque distinctive (qui sépare deux ou plusieurs choses), tout repère, indice, montagne, étendard, drapeau, borne, signe qui indique les limites, jalons, bannière, bordure »</em>. Connaître, dans cette intuition, c'est <em>établir un lien entre des signes</em> ; et l'univers (<em>ʿālam</em>) lui-même est, étymologiquement, le <em>signifiant</em>.",
        "core_fr": "Le savoir qui lit les signes"
    },
    "f-q-r": {
        "gloton_ref": "Gloton, entrée n°1174 (p.605)",
        "glose_gloton": "Gloton décrit cette racine dans sa concrétude la plus saisissante : <em>« Creuser la terre, percer, perforer, démunir, briser les vertèbres, briser qqn, l'accabler, être dans le besoin, dans le dénuement, dans la pénurie, être dépourvu, pauvre. »</em> La pauvreté arabe n'est pas une simple privation : c'est, étymologiquement, une <em>colonne vertébrale brisée</em> — celui qui ne peut plus se tenir debout par soi-même. Le nom <em>faqr</em> couvre : <em>« pauvreté, besoin, indigence, le fait d'être démuni, manque, misère, souci, peine, chagrin »</em>. Et le <em>faqīr</em> est <em>« démuni, pauvre, qui manque, indigent, nécessiteux, qui ne possède rien, miséreux, gueux »</em>. Pour Gloton, donc, le faqr soufi est non métaphore mais constatation : la créature, par structure, est <em>brisée à la colonne</em> — elle ne se tient debout que tenue.",
        "core_fr": "La colonne brisée qui ne tient plus seule"
    },
    "q-r-b": {
        "gloton_ref": "Gloton, entrée n°1217 (p.619)",
        "glose_gloton": "Gloton ouvre la racine sur une scène concrète, presque biblique : <em>« Marcher pendant la nuit jusqu'au point du jour, faire un voyage de nuit, se trouver tout près de qqn, s'approcher, être à proximité, être proche, imminent, venir près de, approcher, avoisiner, accéder, être aisé, facile — remettre le sabre au fourreau. »</em> Approcher, en arabe, c'est <em>marcher la nuit</em>. Et le <em>qurb</em> couvre tout un champ : <em>« proximité, voisinage, rapprochement, parenté, consanguinité, familiarité, moyen de se rapprocher, confiance, crédit, faveur dont on jouit près de qqn »</em>. Plus subtil encore — la définition mentionne explicitement : <em>« pratique d'adoration qui favorise la proximité de Dieu, moyen d'approche, bonnes œuvres »</em>. La racine elle-même contient donc déjà sa dimension spirituelle.",
        "core_fr": "Le voyage nocturne vers le proche"
    },
    "q-l-b": {
        "gloton_ref": "Gloton, entrée n°1253 (p.631)",
        "glose_gloton": "Gloton donne pour cette racine une définition saisissante du cœur : <em>« 1/ Tourner, retourner, culbuter, bêcher, inverser, intervertir, permuter, muter, renverser, bouleverser, basculer, bousculer, mettre qqch à l'envers, ôter la moelle du palmier, frapper qqn au cœur — 2/ être retourné, renversé. »</em> Le nom d'action <em>qalb</em> couvre : <em>« conversion, inversion, permutation, renversement, retournement, changement, revirement, bouleversement »</em>. Et il ajoute, à la même ligne : <em>« cœur, organe central de la vie physique, psychologique et spirituel <strong>en perpétuel mutation ou mouvement</strong>, esprit, âme, intérieur, centre, moelle, noyau, essence »</em>. Pour Gloton, donc, le cœur arabe est <em>par définition</em> l'organe qui se retourne — non un siège stable de l'identité, mais le lieu du revirement continuel. Le mot et l'organe partagent leur instabilité.",
        "core_fr": "Le cœur — organe en perpétuel mouvement"
    },
    "n-f-s": {
        "gloton_ref": "Gloton, entrée n°1541 (p.724)",
        "glose_gloton": "Gloton déploie pour cette racine un éventail surprenant : <em>« Avoir une influence sur qqn par le souffle ou le regard, relever de couches (femme), regretter ce qu'on donne, être précieux, d'un grand prix, être recherché. »</em> Le nom <em>nafs</em> est défini comme : <em>« âme (incorporée), souffle, souffle animé, principe vital, sang, essence, être, individu, le fond même d'une chose, la propre personne, soi-même, lui-même, (moi)-même, œil, regard »</em>. Et les formes dérivées : <em>« respirer, pousser un soupir, exhaler un souffle, s'épanouir, être soulagé, briller »</em>. Pour Gloton, donc, la nafs n'est ni un moi abstrait, ni un souffle séparé : c'est l'<em>être-incarné-qui-respire</em>, et qui — fait remarquable — partage sa racine avec <em>nafīs</em> (précieux). L'âme est précieuse parce qu'elle est ce qui peut être <em>regretté quand on le donne</em> ; et le don de soi est, par sa racine même, un don du précieux.",
        "core_fr": "Le souffle précieux — âme incarnée"
    },
}

DICT_PATH = Path(__file__).resolve().parents[1] / "data" / "racines.json"
data = json.loads(DICT_PATH.read_text(encoding="utf-8"))

n = 0
for r in data["racines"]:
    if r["id"] in UPDATES:
        u = UPDATES[r["id"]]
        r["glose_gloton"] = u["glose_gloton"]
        r["gloton_ref"] = u["gloton_ref"]
        if "core_fr" in u:
            r["core_fr_original"] = r.get("core_fr", "")
            r["core_fr"] = u["core_fr"]
        n += 1

print(f"Updated {n} fiches")
DICT_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Saved.")
