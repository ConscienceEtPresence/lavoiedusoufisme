#!/usr/bin/env python3
"""Ajoute la catégorie 'confreries' + 7 entrées de confréries majeures."""
import json
from pathlib import Path

NEW_ENTRIES = [
{
  "id": "naqshbandiyya",
  "ar": "النَّقْشْبَنْدِيَّة",
  "tr": "an-naqshbandiyya",
  "tr_simple": "naqshbandiyya",
  "fr": "L'ordre des Naqshbandī",
  "racine": "ن ق ش",
  "racine_sens": "naqsh — le motif, la gravure ; le maître Bahāʾ ad-Dīn fut surnommé an-Naqshband, « celui qui grave le motif (sur le cœur) »",
  "category": "confreries",
  "tags": ["confrérie", "dhikr silencieux", "Asie centrale"],
  "definition_concise": "Confrérie sunnite fondée à Boukhara au XIVe siècle par <em>Bahāʾ ad-Dīn Muḥammad al-Bukhārī</em>, dit <em>Naqshband</em>. Particularité centrale : le <em>dhikr silencieux</em> (<em>dhikr khafī</em>), sans musique, sans danse, intégré au cœur même de la vie ordinaire.",
  "sens_profond": "Bahāʾ ad-Dīn (1318-1389) reçoit l'enseignement de la voie par Khwāja Muḥammad Bābā as-Samāsī, mais sa lignée spirituelle remonte par filiation alternative jusqu'à Abū Bakr aṣ-Ṣiddīq — fait unique parmi les grandes confréries, qui passent presque toutes par ʿAlī. Cette particularité donne à la voie sa coloration : sobre, intériorisée, transmettant <em>de cœur à cœur</em> sans démonstration. Les <em>onze principes</em> formulés par Bahāʾ ad-Dīn (<em>hūsh dar dam</em> — conscience dans le souffle ; <em>naẓar bar qadam</em> — regard sur le pas ; <em>safar dar waṭan</em> — voyage en sa propre patrie…) condensent une discipline du quotidien. La <em>rābiṭa (الرَّابِطَة)</em> — lien intérieur au maître — y prend une centralité particulière. La voie s'est répandue à travers l'Asie centrale, le Caucase, la Turquie ottomane, l'Inde moghole, puis le monde entier au XXe siècle.",
  "voix_des_maitres": [
    {"auteur": "Bahāʾ ad-Dīn Naqshband", "texte": "« Notre voie est la voie de la suḥba — la compagnie. Et la suḥba est plus efficace que mille livres. »"},
    {"auteur": "Adage naqshbandī", "texte": "« Hūsh dar dam — conscience dans le souffle. Chaque respiration habitée par Dieu. »"}
  ],
  "meditation": "Si l'enseignement passait de cœur à cœur, sans paroles — quel maître, dans ma vie, m'aurait déjà touché ?",
  "resonance": ["tariqa", "silsila", "suhba", "rabita", "dhikr"],
  "lectures_site": [{"titre": "Page détaillée — Naqshbandiyya", "url": "../confreries/naqshbandiyya.html"}]
},
{
  "id": "qadiriyya",
  "ar": "القَادِرِيَّة",
  "tr": "al-qādiriyya",
  "tr_simple": "qadiriyya",
  "fr": "L'ordre des Qādirī",
  "racine": "ق د ر",
  "racine_sens": "qadar — la mesure, le décret ; le fondateur ʿAbd al-Qādir = « Serviteur du Tout-Puissant »",
  "category": "confreries",
  "tags": ["confrérie", "Bagdad", "amour"],
  "definition_concise": "L'une des plus anciennes et plus répandues des confréries soufies, fondée à Bagdad par <em>ʿAbd al-Qādir al-Jīlānī</em> (1077-1166). Caractérisée par un <em>dhikr vocal</em>, une mystique de l'amour et une grande accessibilité.",
  "sens_profond": "ʿAbd al-Qādir al-Jīlānī, né en Iran (Jīlān), formé à Bagdad, devient le saint le plus aimé du monde sunnite — appelé <em>al-Ghawth al-Aʿẓam</em> (le Secours suprême) et <em>Sulṭān al-Awliyāʾ</em> (le Sultan des saints). Sa voie se diffuse à une vitesse extraordinaire après sa mort, portée par ses fils puis par ses disciples. Aujourd'hui, on trouve des Qādirī dans presque tous les pays musulmans — du Maroc à l'Indonésie, du Sénégal au Caucase. La transmission de la lignée passe par ʿAlī (comme presque toutes les confréries). Caractéristiques : <em>dhikr vocal</em> (souvent <em>Lā ilāha illā Llāh</em> en collectif), grande générosité envers les pauvres, mystique de l'amour bien plus que de l'ascèse. Le wird quotidien est accessible. Les <em>karāmāt</em> (miracles) attribués à ʿAbd al-Qādir sont innombrables, et la Qādiriyya est ainsi la voie la plus populaire.",
  "voix_des_maitres": [
    {"auteur": "ʿAbd al-Qādir al-Jīlānī (Futūḥ al-Ghayb)", "texte": "« Quand tu trouveras le Vrai, tu seras serviteur des hommes. Avant cela, tu cherches encore. »"}
  ],
  "meditation": "Une voie ouverte à tous, pour celui qui ose demander — est-ce que je demande, ou est-ce que je cherche encore à mériter avant ?",
  "resonance": ["tariqa", "silsila", "wali", "ghawth", "mahabba"],
  "lectures_site": []
},
{
  "id": "shadhiliyya",
  "ar": "الشَّاذِلِيَّة",
  "tr": "ash-shādhiliyya",
  "tr_simple": "shadhiliyya",
  "fr": "L'ordre des Shādhilī",
  "racine": "ش ذ ل",
  "racine_sens": "Shādhila — nom du village marocain où le fondateur fut formé ; al-Shādhilī = « le Shadhilien »",
  "category": "confreries",
  "tags": ["confrérie", "Maghreb", "intégration au quotidien"],
  "definition_concise": "Confrérie sunnite fondée au XIIIe siècle par <em>Abū al-Ḥasan al-Shādhilī</em> (1196-1258) au Maghreb puis en Égypte. Principe central : <em>vivre la voie sans la montrer</em> — pas d'ascétisme ostentatoire, pas de vêtement particulier, la sainteté en habits ordinaires.",
  "sens_profond": "Abū al-Ḥasan al-Shādhilī, né au Maroc, formé par ʿAbd as-Salām ibn Mashīsh (le maître caché du Rif), s'établit à Alexandrie. Sa voie devient l'une des plus influentes du soufisme sunnite. Particularité : <em>al-Shādhilī ne demande pas à ses disciples de quitter le monde</em>. Ses disciples sont marchands, juristes, paysans — la voie se vit dans la <em>suḥba</em> du maître et dans l'intériorisation des actes ordinaires. Le <em>Ḥizb al-Baḥr</em> (Litanie de la Mer), composé par al-Shādhilī, est devenu l'une des grandes prières du monde musulman. Son disciple <em>Ibn ʿAṭāʾ Allāh al-Iskandarī</em> a fixé la doctrine dans les <em>Ḥikam</em> (Sentences) — un sommet de la littérature soufie. La Shādhiliyya a engendré de nombreuses branches majeures : <em>Darqāwiyya</em> (Maroc, XVIIIe), <em>ʿAlawiyya</em> (XXe), <em>Burhāniyya</em>, <em>Buṭchichiyya</em>. Tradition centrale dans le soufisme contemporain.",
  "voix_des_maitres": [
    {"auteur": "Abū al-Ḥasan al-Shādhilī", "texte": "« Notre voie n'est pas une voie de rapprochement par les œuvres, mais une voie d'effacement et de pauvreté devant Allâh. »"},
    {"auteur": "Ibn ʿAṭāʾ Allāh al-Iskandarī (Ḥikam)", "texte": "« Ta meilleure parcelle de temps, c'est celle où tu reconnais ta pauvreté et où tu te réfugies dans ton humilité. »"}
  ],
  "meditation": "Peut-on être pleinement de cette voie sans que personne autour de soi ne le sache ?",
  "resonance": ["tariqa", "suhba", "faqr", "hikma", "wird"],
  "lectures_site": [{"titre": "Page détaillée — Shādhiliyya", "url": "../confreries/shadhiliyya.html"}]
},
{
  "id": "tijaniyya",
  "ar": "التِّجَانِيَّة",
  "tr": "at-tijāniyya",
  "tr_simple": "tijaniyya",
  "fr": "L'ordre des Tijānī",
  "racine": "ت ج ن",
  "racine_sens": "Tijān — nom du fondateur, lui-même issu d'une ancienne tribu d'Aïn Madhi (sud algérien)",
  "category": "confreries",
  "tags": ["confrérie", "Afrique de l'Ouest", "ṣalāt al-fātiḥ"],
  "definition_concise": "Confrérie sunnite fondée à la fin du XVIIIe siècle par <em>Aḥmad at-Tijānī</em> (1735-1815) à ʿAïn Madhi (Algérie) puis Fès (Maroc). Très influente en Afrique de l'Ouest. Caractéristique : centralité absolue de la prière sur le Prophète, en particulier la <em>ṣalāt al-fātiḥ</em>.",
  "sens_profond": "Aḥmad at-Tijānī reçoit son investiture, selon la tradition tijānī, directement du Prophète à l'état de veille (<em>fī l-yaqẓa lā fī l-manām</em>) — affirmation qui distingue cette confrérie. Son <em>wird</em> quotidien (lāzima) est exigeant : prières précises matin et soir, prière sur le Prophète mille fois ou plus, et la <em>ṣalāt al-fātiḥ</em> — une bénédiction sur le Prophète considérée par les Tijānī comme équivalente à toute la création en valeur. La voie ne se mélange pas avec d'autres : un Tijānī ne peut être affilié à une seconde confrérie. Caractéristique forte : revendication d'un rang spirituel exceptionnel pour ses adhérents (<em>qutb al-aqṭāb</em>). L'expansion en Afrique de l'Ouest, à partir du XIXe siècle (notamment via al-Ḥājj ʿUmar Tall, puis Ibrāhīm Niasse), en fait l'une des forces spirituelles majeures du continent — au Sénégal, au Mali, en Mauritanie, au Nigeria, au Tchad. Branches : Niassène, Ḥamāwiyya.",
  "voix_des_maitres": [
    {"auteur": "Aḥmad at-Tijānī (attribué)", "texte": "« Notre voie est facile par l'amour, et difficile par l'exclusivité. »"}
  ],
  "meditation": "Une voie qui demande tout — fidélité, exclusivité, régularité — est-elle un fardeau ou une libération ?",
  "resonance": ["tariqa", "silsila", "wird", "mawlid", "salat"],
  "lectures_site": []
},
{
  "id": "mevleviyya",
  "ar": "المَوْلَوِيَّة",
  "tr": "al-mawlawiyya",
  "tr_simple": "mevleviyya",
  "fr": "L'ordre des Mevlevî (derviches tourneurs)",
  "racine": "م و ل و",
  "racine_sens": "Mawlānā — « notre maître » (titre donné à Jalāl ad-Dīn Rūmī par ses disciples)",
  "category": "confreries",
  "tags": ["confrérie", "Konya", "samāʿ", "danse", "poésie"],
  "definition_concise": "Confrérie fondée à Konya (Anatolie) par les disciples de <em>Jalāl ad-Dīn Rūmī</em> (1207-1273) après sa mort, principalement par son fils <em>Sulṭān Walad</em>. Caractéristique mondialement célèbre : le <em>samāʿ</em> avec danse tournoyante — les <em>derviches tourneurs</em>.",
  "sens_profond": "Rūmī lui-même ne fonda pas formellement une voie : il vécut en saint, écrivit le <em>Mathnawī</em> et le <em>Dīwān-i Shams</em>, et laissa son fils Sulṭān Walad codifier l'enseignement après sa mort. La cérémonie du <em>samāʿ</em> — où les danseurs tournoient lentement, paume droite levée vers le ciel pour recevoir, paume gauche tournée vers la terre pour donner — est devenue l'emblème universel du soufisme aux yeux du monde. Mais le samāʿ n'est pas une danse : c'est une <em>prière en mouvement</em>, où le corps imite la rotation cosmique des sphères et des atomes autour de leur centre. La tradition est restée concentrée en Anatolie ottomane, puis interdite par Atatürk en 1925 — survivante surtout dans la tradition culturelle. Renaissance contemporaine : confréries actives en Turquie, branches en Occident. Le <em>Mathnawī</em> de Rūmī reste l'un des grands livres mystiques de l'humanité.",
  "voix_des_maitres": [
    {"auteur": "Jalāl ad-Dīn Rūmī (Mathnawī I, 1-2)", "texte": "« Écoute ce roseau, comme il se lamente — c'est de la séparation qu'il fait son récit. »"},
    {"auteur": "Rūmī", "texte": "« Viens, viens, qui que tu sois — païen, idolâtre, adorateur du feu. Viens même si tu as rompu cent fois ta promesse. Notre porte n'est pas une porte du désespoir. Viens, comme tu es. »"}
  ],
  "meditation": "Si le corps qui tourne devient prière — qu'est-ce qui, dans ma vie, pourrait devenir prière sans le dire ?",
  "resonance": ["tariqa", "sama", "ishq", "fanaa", "mahabba"],
  "lectures_site": [{"titre": "Page détaillée — Mevleviyya", "url": "../confreries/mevleviyya.html"}]
},
{
  "id": "alawiyya",
  "ar": "العَلَوِيَّة",
  "tr": "al-ʿalawiyya",
  "tr_simple": "alawiyya",
  "fr": "L'ordre des ʿAlawī (Mostaganem)",
  "racine": "ع ل و",
  "racine_sens": "ʿalā — être élevé ; ʿAlawī — du fondateur Aḥmad al-ʿAlawī, qui prit ce nom",
  "category": "confreries",
  "tags": ["confrérie", "Maghreb", "Europe", "branche shādhilī"],
  "definition_concise": "Branche moderne de la <em>Darqāwiyya</em> (elle-même issue de la Shādhiliyya), fondée par <em>Aḥmad al-ʿAlawī</em> (1869-1934) à Mostaganem (Algérie). Importante pour avoir été la première confrérie soufie à porter l'enseignement en Europe au XXe siècle.",
  "sens_profond": "Aḥmad ibn Muṣṭafā al-ʿAlawī, formé dans la Darqāwiyya, fonde sa propre branche en 1909. Son enseignement combine la rigueur classique shādhilī (effacement de soi, faqr, pas d'extravagance) avec une remarquable ouverture aux problématiques modernes. C'est par lui que la voie arrive en Europe : ses disciples français (<em>Frithjof Schuon</em>, <em>Titus Burckhardt</em>, <em>Martin Lings</em>) deviendront des figures majeures de la pensée traditionaliste et de la transmission du soufisme à l'Occident au XXe siècle. La <em>ʿAlawiyya</em> reste active à Mostaganem (la <em>zāwiya</em> originelle) et essaime à travers le monde, notamment en France et au Royaume-Uni. Particularité : forte dimension contemplative, accent sur la <em>khalwa (الخَلْوَة)</em> et la lecture des grands textes (Ibn ʿArabī notamment).",
  "voix_des_maitres": [
    {"auteur": "Aḥmad al-ʿAlawī", "texte": "« La voie est plus simple qu'on ne le dit. Ce qui est difficile, c'est de se rendre simple. »"},
    {"auteur": "Martin Lings (sur son maître al-ʿAlawī)", "texte": "« Sa simple présence dans une pièce changeait tout. »"}
  ],
  "meditation": "Une grande voie peut-elle traverser les langues, les pays, les cultures, et rester elle-même ?",
  "resonance": ["tariqa", "silsila", "khalwa", "suhba", "shadhiliyya"],
  "lectures_site": []
},
{
  "id": "chishtiyya",
  "ar": "الچِشْتِيَّة",
  "tr": "al-chishtiyya",
  "tr_simple": "chishtiyya",
  "fr": "L'ordre des Chishtī (Inde)",
  "racine": "چ ش ت",
  "racine_sens": "Chisht — village d'Afghanistan, lieu d'origine de la lignée",
  "category": "confreries",
  "tags": ["confrérie", "Inde", "samāʿ", "qawwālī", "amour universel"],
  "definition_concise": "Confrérie majeure du sous-continent indien, fondée à <em>Ajmer</em> (Inde) par <em>Muʿīn ad-Dīn Chishtī</em> (1141-1230), originaire d'Afghanistan. Caractéristiques : ouverture à tous (musulmans et non-musulmans), <em>samāʿ</em> et chant <em>qawwālī</em>, accent sur l'amour universel et le service du pauvre.",
  "sens_profond": "Muʿīn ad-Dīn Chishtī arrive à Ajmer en Inde après une longue formation au Khorasan. Il y établit une <em>zāwiya</em> qui devient l'un des centres spirituels les plus importants du sous-continent. Son tombeau (<em>dargāh</em>) attire encore aujourd'hui des millions de pèlerins par an, musulmans et hindous confondus. Les grands successeurs — <em>Quṭb ad-Dīn Bakhtiyār Kākī</em>, <em>Farīd ad-Dīn Ganj-i-Shakar</em>, <em>Niẓām ad-Dīn Awliyāʾ</em>, <em>Naṣīr ad-Dīn Chirāgh-i Dehlī</em> — étendent la voie à toute l'Inde du Nord. Caractéristiques saillantes : ouverture totale (« samā chist » — qu'importe la couleur, la caste, la religion : le cœur seul compte) ; primauté du <em>samāʿ</em> et du <em>qawwālī</em> (chant dévotionnel persan/ourdou, dont <em>Nusrat Fateh Ali Khan</em> au XXe siècle reste le maître mondial) ; refus catégorique de toute relation avec le pouvoir politique ; centralité de la table commune (<em>langar</em>) où riches et pauvres mangent ensemble.",
  "voix_des_maitres": [
    {"auteur": "Muʿīn ad-Dīn Chishtī", "texte": "« Aime tout le monde et aime tout — car cette nature est aussi la nature de Dieu. »"},
    {"auteur": "Niẓām ad-Dīn Awliyāʾ", "texte": "« Il y a beaucoup de chemins jusqu'à Dieu. Mais ma préférence est celle qui passe par le service du créé. »"}
  ],
  "meditation": "Si l'amour de tous est un attribut divin — qui suis-je en train d'exclure de mon amour ?",
  "resonance": ["tariqa", "sama", "mahabba", "khidma", "suhba"],
  "lectures_site": [{"titre": "Page détaillée — Chishtiyya", "url": "../confreries/chishtiyya.html"}]
}
]

DICT_PATH = Path(__file__).resolve().parents[1] / "data" / "dictionnaire.json"
data = json.loads(DICT_PATH.read_text(encoding="utf-8"))

# Ajouter la catégorie "confreries"
if "confreries" not in data["categories"]:
    data["categories"]["confreries"] = {
        "label": "Confréries (ṭuruq)",
        "couleur": "#7a3a5f",
        "description": "Les grandes voies initiatiques du soufisme — chacune avec sa lignée (silsila), son maître fondateur, son wird quotidien, ses pratiques propres."
    }
    print("  + catégorie 'confreries' créée")

existing_ids = {e["id"] for e in data["entries"]}
added = 0
for entry in NEW_ENTRIES:
    if entry["id"] in existing_ids:
        print(f"  ⚠️ {entry['id']} déjà présent — skip")
        continue
    data["entries"].append(entry)
    existing_ids.add(entry["id"])
    added += 1
    print(f"  + {entry['id']} ({entry['fr']})")

DICT_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"\n✓ {added} entrées ajoutées. Total : {len(data['entries'])}")
