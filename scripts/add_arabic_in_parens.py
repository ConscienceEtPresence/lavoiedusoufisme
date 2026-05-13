#!/usr/bin/env python3
"""
Ajoute la forme arabe vocalisée entre parenthèses après chaque
translittération technique connue, à sa PREMIÈRE occurrence dans chaque
champ rédigé du dictionnaire et des 99 Noms.

Règles :
- on n'insère pas si la translittération est déjà suivie d'arabe (à <10 car.)
- on respecte les balises HTML (on ne réinsère pas DANS une balise)
- bords de mots tolérants aux signes ʿ ʾ ā ī ū ṣ ḍ ḥ ṭ ẓ š ǧ ġ ḏ ṯ etc.
- les termes plus longs sont essayés avant les plus courts (ex: nafs ammāra
  avant nafs)
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DICT_PATH = ROOT / "data" / "dictionnaire.json"
NOMS_PATH = ROOT / "data" / "noms-divins.json"

# caractères considérés comme "lettres" pour les bords de mot
WORD_CHARS = r"A-Za-zÀ-ſƀ-ɏʿʾāīūēōăĭŭṣḍḥṭẓšǧġḏṯĀĪŪṢḌḤṬẒŠǦĠḎṮ'ʼ"

# plage de caractères arabes
ARABIC_RANGE = re.compile(r"[؀-ۿݐ-ݿ]")

# champs où l'on insère
DICT_FIELDS = ["definition_concise", "sens_profond", "meditation"]
# `voix_des_maitres` est une liste de dicts {auteur, texte} : traité à part.
# `resonance` n'est qu'une liste d'IDs, on ne touche pas.
NOM_FIELDS = ["sens_court", "lugha", "aqli", "sufi", "part"]


def build_lookup():
    """tr_normalisé → arabe_vocalisé, agrégé depuis les deux JSON."""
    lookup = {}
    dico = json.loads(DICT_PATH.read_text(encoding="utf-8"))
    noms = json.loads(NOMS_PATH.read_text(encoding="utf-8"))

    for e in dico["entries"]:
        if e.get("tr") and e.get("ar"):
            lookup.setdefault(e["tr"], e["ar"])
        if e.get("tr_simple") and e.get("ar"):
            lookup.setdefault(e["tr_simple"], e["ar"])

    # Pour les 99 Noms : on ajoute la forme avec et sans "al-"
    for n in noms["noms"]:
        tr, ar = n.get("tr", ""), n.get("ar", "")
        if not tr or not ar:
            continue
        lookup.setdefault(tr, ar)
        if tr.startswith("al-"):
            lookup.setdefault(tr[3:], ar)

    # Lexique supplémentaire (termes techniques qui ne sont pas entrées)
    supp_path = ROOT / "data" / "lexique_supplementaire.json"
    if supp_path.exists():
        supp = json.loads(supp_path.read_text(encoding="utf-8"))
        for tr, ar in supp.get("termes", {}).items():
            lookup.setdefault(tr, ar)

    return lookup, dico, noms


def split_html(text):
    """Découpe en segments (is_tag, content). On n'insère pas dans les tags."""
    parts = []
    i = 0
    for m in re.finditer(r"<[^>]+>", text):
        if m.start() > i:
            parts.append((False, text[i:m.start()]))
        parts.append((True, m.group(0)))
        i = m.end()
    if i < len(text):
        parts.append((False, text[i:]))
    return parts


def annotate_text(text, terms_sorted, used_in_field):
    """Insère ` (arabe)` après la 1ère occurrence non annotée de chaque terme."""
    if not text:
        return text, 0

    segments = split_html(text)
    inserts = 0

    for tr in terms_sorted:
        if tr in used_in_field:
            continue
        ar = LOOKUP[tr]
        # bord de mot tolérant
        pattern = re.compile(
            rf"(?<![{WORD_CHARS}])"
            + re.escape(tr)
            + rf"(?![{WORD_CHARS}])"
        )

        done = False
        for idx, (is_tag, content) in enumerate(segments):
            if is_tag or done:
                continue
            m = pattern.search(content)
            if not m:
                continue
            # déjà annoté ? (arabe dans les 10 car. suivants, en tenant
            # compte du segment courant + suivant)
            tail = content[m.end():m.end() + 12]
            if not tail and idx + 1 < len(segments):
                # peek next segment if next is tag like </em>, look further
                nxt = "".join(c for _, c in segments[idx + 1:idx + 4])
                tail = nxt[:12]
            if ARABIC_RANGE.search(tail):
                used_in_field.add(tr)  # déjà annoté → on l'ignore pour la suite
                done = True
                continue
            # on insère
            insertion = f" ({ar})"
            new_content = content[:m.end()] + insertion + content[m.end():]
            segments[idx] = (False, new_content)
            inserts += 1
            used_in_field.add(tr)
            done = True

    return "".join(c for _, c in segments), inserts


def process_entries(items, fields, own_tr_key=None):
    total = 0
    for item in items:
        own = item.get(own_tr_key) if own_tr_key else None
        # ordre : termes plus longs d'abord
        terms = sorted(LOOKUP.keys(), key=lambda t: -len(t))
        # `used` partagé pour TOUTE l'entrée : un terme annoté une seule fois.
        # On exclut aussi le terme propre de l'entrée (déjà dans l'en-tête).
        used = set()
        if own:
            used.add(own)
            if own.startswith("al-"):
                used.add(own[3:])
        for f in fields:
            if not item.get(f):
                continue
            val = item[f]
            if isinstance(val, str):
                new_text, n = annotate_text(val, terms, used)
                if n:
                    item[f] = new_text
                    total += n
            elif isinstance(val, list):
                for sub in val:
                    if isinstance(sub, dict) and "texte" in sub:
                        nt, n = annotate_text(sub["texte"], terms, used)
                        if n:
                            sub["texte"] = nt
                            total += n
        # voix_des_maitres au cas où on l'ait omis des fields
        if isinstance(item.get("voix_des_maitres"), list):
            for sub in item["voix_des_maitres"]:
                if isinstance(sub, dict) and "texte" in sub:
                    nt, n = annotate_text(sub["texte"], terms, used)
                    if n:
                        sub["texte"] = nt
                        total += n
    return total


if __name__ == "__main__":
    LOOKUP, dico, noms = build_lookup()
    print(f"Lookup : {len(LOOKUP)} translittérations connues.")

    n_dict = process_entries(dico["entries"], DICT_FIELDS, own_tr_key="tr")
    n_noms = process_entries(noms["noms"], NOM_FIELDS, own_tr_key="tr")

    print(f"Insertions dictionnaire : {n_dict}")
    print(f"Insertions 99 Noms     : {n_noms}")

    if "--dry-run" in sys.argv:
        print("(dry-run : aucun fichier écrit)")
        sys.exit(0)

    DICT_PATH.write_text(
        json.dumps(dico, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")
    NOMS_PATH.write_text(
        json.dumps(noms, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8")
    print("Fichiers sauvegardés.")
