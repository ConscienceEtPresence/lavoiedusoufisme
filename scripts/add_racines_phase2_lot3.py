#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Phase 2 — Lot 3 : vie spirituelle, perception, eschatologie (12 racines).
D'après Maurice Gloton.

Racines : g-f-r, h-d-y, ḍ-l-l, j-h-d, n-ṣ-r, gh-y-b,
          ḥ-y-y, m-w-t, b-ṣ-r, s-m-ʿ, w-j-h, k-b-r.
"""

import json, os, shutil, sys, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "racines.json")
BAK  = DATA + ".before_phase2_lot3"
HTML = os.path.join(ROOT, "pages", "racines", "index.html")


NEW_RACINES = [
    # -----------------------------------------------------------------
    {
        "id": "g-f-r",
        "letters": ["غ","ف","ر"],
        "root_ar": "غ ف ر",
        "root_tr": "gh-f-r",
        "core_ar": "المَغْفِرَة",
        "core_fr": "Le pardon — couvrir d'un voile protecteur",
        "field": "<em>Ghafara</em> signifie d'abord <em>couvrir, voiler</em>. Le casque qui protège la tête du guerrier s'appelle <em>mighfar</em>. De là, le pardon (<em>maghfira</em>) n'est pas effacement : c'est <em>recouvrement</em> — Dieu pose un voile sur la faute, qui ne disparaît pas mais cesse d'agir. La nuance est précieuse : le pardonné reste celui qui a fauté, mais il n'est plus défini par sa faute.",
        "glose_gloton": "Gloton distingue : <em>ʿafw</em> (effacer, biffer), <em>ṣafḥ</em> (passer outre, tourner la page), <em>maghfira</em> (couvrir). La <em>maghfira</em> est la modalité la plus mystérieuse — la trace demeure dans l'ordre du réel, mais elle est <em>tenue</em> par la miséricorde divine. <em>al-Ghaffār</em> (Nom n°15) est intensif : Celui qui ne cesse de couvrir.",
        "forms": [
            {"ar": "غَفَرَ", "tr": "ghafara", "fr": "pardonner, couvrir d'un voile", "form": "I", "type": "verbe"},
            {"ar": "اِسْتَغْفَرَ", "tr": "istaghfara", "fr": "demander pardon, demander la couverture", "form": "X", "type": "verbe"},
            {"ar": "المَغْفِرَة", "tr": "al-maghfira", "fr": "le pardon, la couverture", "type": "nom d'action"},
            {"ar": "الغَفُور", "tr": "al-Ghafūr", "fr": "le Très-Pardonnant", "type": "nom intensif"},
            {"ar": "الغَفَّار", "tr": "al-Ghaffār", "fr": "Celui qui ne cesse de pardonner", "type": "nom hyperbolique"},
            {"ar": "اِسْتِغْفَار", "tr": "istighfār", "fr": "la demande de pardon", "type": "nom d'action"},
            {"ar": "المِغْفَر", "tr": "al-mighfar", "fr": "le casque (ce qui couvre la tête)", "type": "nom concret"}
        ],
        "quran": [
            {"ref": "39, 53", "ar": "إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا ۚ إِنَّهُۥ هُوَ ٱلْغَفُورُ ٱلرَّحِيمُ", "fr": "Certes, Dieu pardonne tous les péchés. Il est, Lui, le Très-Pardonnant, le Très-Miséricordieux."},
            {"ref": "71, 10", "ar": "ٱسْتَغْفِرُوا۟ رَبَّكُمْ إِنَّهُۥ كَانَ غَفَّارًا", "fr": "Demandez pardon à votre Seigneur — Il a toujours été Celui qui ne cesse de pardonner."}
        ],
        "dict_links": ["istighfar"],
        "nom_links": [15, 35],
        "meditation": "Qu'est-ce qui, en moi, demande non pas à être effacé, mais simplement <em>couvert</em> ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "h-d-y",
        "letters": ["ه","د","ي"],
        "root_ar": "ه د ي",
        "root_tr": "h-d-y",
        "core_ar": "الهُدَى",
        "core_fr": "La guidance — le don du chemin",
        "field": "<em>Hadā</em> : guider, conduire sur la voie droite. La racine porte ensemble <em>le chemin</em> (<em>hudā</em>) et <em>le présent qu'on offre</em> (<em>hadiyya</em>) — guider est faire un cadeau, le plus précieux : montrer le chemin. La <em>hidāya</em> n'est pas une information, c'est une <em>orientation reçue</em>. Le Coran insiste : nul ne se guide soi-même — <em>innaka lā tahdī man aḥbabta wa-lākinna Llāha yahdī man yashāʾ</em> (28,56).",
        "glose_gloton": "Gloton souligne la profondeur du verset 1,6 (<em>ihdinā ṣ-ṣirāṭa l-mustaqīm</em>) : nous demandons la guidance plusieurs fois par jour, parce que la guidance n'est pas un acquis mais un <em>renouvellement</em>. Et le lien avec <em>hadiyya</em> (cadeau) dit l'essentiel : la voie droite n'est jamais conquise, elle est <em>offerte</em>.",
        "forms": [
            {"ar": "هَدَى", "tr": "hadā", "fr": "guider, conduire", "form": "I", "type": "verbe"},
            {"ar": "اِهْتَدَى", "tr": "ihtadā", "fr": "se laisser guider, trouver la voie", "form": "VIII", "type": "verbe réflexif"},
            {"ar": "الهُدَى", "tr": "al-hudā", "fr": "la guidance, la voie droite", "type": "nom"},
            {"ar": "الهِدَايَة", "tr": "al-hidāya", "fr": "la guidance, l'acte de guider", "type": "nom d'action"},
            {"ar": "الهَادِي", "tr": "al-Hādī", "fr": "le Guide", "type": "participe actif"},
            {"ar": "المُهْتَدِي", "tr": "al-muhtadī", "fr": "le bien-guidé", "type": "participe actif"},
            {"ar": "الهَدِيَّة", "tr": "al-hadiyya", "fr": "le cadeau, le présent", "type": "nom"}
        ],
        "quran": [
            {"ref": "1, 6", "ar": "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", "fr": "Guide-nous sur la voie droite."},
            {"ref": "28, 56", "ar": "إِنَّكَ لَا تَهْدِى مَنْ أَحْبَبْتَ وَلَٰكِنَّ ٱللَّهَ يَهْدِى مَن يَشَآءُ", "fr": "Tu ne guides pas ceux que tu aimes — c'est Dieu qui guide qui Il veut."}
        ],
        "dict_links": [],
        "nom_links": [95],
        "meditation": "Si la guidance est un cadeau, ai-je tendu les mains pour la recevoir aujourd'hui ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ḍ-l-l",
        "letters": ["ض","ل","ل"],
        "root_ar": "ض ل ل",
        "root_tr": "ḍ-l-l",
        "core_ar": "الضَّلَال",
        "core_fr": "L'errance — perdre la trace",
        "field": "<em>Ḍalla</em> : s'égarer, perdre son chemin. La racine évoque celui qui marche encore mais ne sait plus où — non pas l'arrêt, mais la <em>marche désorientée</em>. C'est l'opposé exact de <em>hudā</em>. Le Coran l'utilise pour décrire la condition humaine sans guidance (<em>wa-wajadaka ḍāllan fa-hadā</em>, 93,7 : \"Il t'a trouvé errant, et Il t'a guidé\") — l'errance précède la guidance et la rend possible.",
        "glose_gloton": "Gloton insiste : <em>ḍalāl</em> n'est pas le mal moral mais la <em>perte de repère</em>. La sourate Fātiḥa oppose <em>al-mustaqīm</em> (la voie droite) à <em>al-ḍāllīn</em> (les égarés) — non pas aux \"méchants\" : les égarés sont ceux qui marchent sincèrement mais dans le brouillard. La voie soufie part toujours de la reconnaissance de cet égarement initial.",
        "forms": [
            {"ar": "ضَلَّ", "tr": "ḍalla", "fr": "s'égarer, perdre la trace", "form": "I", "type": "verbe"},
            {"ar": "أَضَلَّ", "tr": "aḍalla", "fr": "égarer, faire perdre la voie", "form": "IV", "type": "verbe causatif"},
            {"ar": "الضَّلَال", "tr": "aḍ-ḍalāl", "fr": "l'errance, l'égarement", "type": "nom"},
            {"ar": "الضَّلَالَة", "tr": "aḍ-ḍalāla", "fr": "l'errance (état)", "type": "nom abstrait"},
            {"ar": "الضَّالّ", "tr": "aḍ-ḍāll", "fr": "l'égaré", "type": "participe actif"},
            {"ar": "المُضِلّ", "tr": "al-muḍill", "fr": "celui qui égare", "type": "participe actif"}
        ],
        "quran": [
            {"ref": "1, 7", "ar": "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", "fr": "La voie de ceux que Tu as comblés — non celle des objets de colère, ni des égarés."},
            {"ref": "93, 7", "ar": "وَوَجَدَكَ ضَآلًّا فَهَدَىٰ", "fr": "Il t'a trouvé errant, et Il t'a guidé."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Dans quel endroit de moi suis-je en train de marcher encore — mais sans savoir vers quoi ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "j-h-d",
        "letters": ["ج","ه","د"],
        "root_ar": "ج ه د",
        "root_tr": "j-h-d",
        "core_ar": "الجِهَاد",
        "core_fr": "L'effort — déployer toute sa capacité",
        "field": "<em>Jahada</em> : faire effort, peiner, déployer sa <em>juhd</em> (force, capacité maximale). La racine désigne <em>l'engagement total de soi</em> dans une direction. <em>Jihād</em> traduit faute de mieux par \"guerre sainte\" est avant tout l'<em>effort soutenu</em> — il est intérieur (<em>al-jihād al-akbar</em>, le grand combat contre l'ego) avant d'être extérieur. <em>Mujāhid</em> est celui qui <em>se dépense</em>.",
        "glose_gloton": "Gloton récuse la réduction médiatique de <em>jihād</em> à la guerre : la racine est centrée sur l'<em>effort</em>, non sur le combat. Le Coran emploie <em>jāhada fī sabīli Llāh</em> (\"faire effort sur la voie de Dieu\") pour désigner toute la vie spirituelle. Le hadith célèbre : <em>rajaʿnā min al-jihādi l-aṣghar ilā l-jihādi l-akbar</em> — \"nous sommes revenus du petit combat (la bataille) vers le grand combat (contre nous-mêmes)\".",
        "forms": [
            {"ar": "جَهَدَ", "tr": "jahada", "fr": "peiner, faire effort", "form": "I", "type": "verbe"},
            {"ar": "جَاهَدَ", "tr": "jāhada", "fr": "déployer un effort soutenu, combattre", "form": "III", "type": "verbe d'effort"},
            {"ar": "اِجْتَهَدَ", "tr": "ijtahada", "fr": "faire effort personnel (notamment intellectuel)", "form": "VIII", "type": "verbe réflexif"},
            {"ar": "الجِهَاد", "tr": "al-jihād", "fr": "l'effort soutenu sur la voie de Dieu", "type": "nom d'action"},
            {"ar": "المُجَاهِد", "tr": "al-mujāhid", "fr": "celui qui se dépense, le combattant intérieur", "type": "participe actif"},
            {"ar": "الِاجْتِهَاد", "tr": "al-ijtihād", "fr": "l'effort personnel (notamment de raisonnement)", "type": "nom d'action"},
            {"ar": "المُجْتَهِد", "tr": "al-mujtahid", "fr": "celui qui exerce son effort propre", "type": "participe actif"}
        ],
        "quran": [
            {"ref": "29, 69", "ar": "وَٱلَّذِينَ جَٰهَدُوا۟ فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا", "fr": "Et ceux qui font effort pour Nous, Nous les guiderons sur Nos voies."},
            {"ref": "22, 78", "ar": "وَجَٰهِدُوا۟ فِى ٱللَّهِ حَقَّ جِهَادِهِۦ", "fr": "Et faites effort en Dieu, du véritable effort qui Lui est dû."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Où, en moi, est-ce que je n'ai pas encore <em>déployé toute ma capacité</em> ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "n-ṣ-r",
        "letters": ["ن","ص","ر"],
        "root_ar": "ن ص ر",
        "root_tr": "n-ṣ-r",
        "core_ar": "النَّصْر",
        "core_fr": "Le secours — venir en aide",
        "field": "<em>Naṣara</em> : secourir, venir en aide. Le <em>naṣr</em> coranique n'est pas la victoire militaire seule — c'est tout secours qui arrive à temps, toute aide qui sauve. <em>Al-Naṣīr</em> est Celui qui aide, <em>al-Anṣār</em> (\"les auxiliaires\") sont les compagnons médinois du Prophète. Le mot <em>naṣrāniyy</em> (\"chrétien\") vient du même verbe : ceux qui ont secouru Jésus.",
        "glose_gloton": "Gloton souligne : la racine décrit une <em>réciprocité asymétrique</em>. Dieu secourt ceux qui Le secourent (<em>in tanṣurū Llāha yanṣurkum</em>, 47,7) — non que Dieu ait besoin d'aide, mais qu'il y a un mouvement de retour : se mettre à Son service ouvre Son secours. Le <em>naṣr</em> est l'inverse de l'isolement spirituel.",
        "forms": [
            {"ar": "نَصَرَ", "tr": "naṣara", "fr": "secourir, aider", "form": "I", "type": "verbe"},
            {"ar": "اِنْتَصَرَ", "tr": "intaṣara", "fr": "vaincre, se faire prêter secours", "form": "VIII", "type": "verbe réflexif"},
            {"ar": "اِسْتَنْصَرَ", "tr": "istanṣara", "fr": "demander secours", "form": "X", "type": "verbe"},
            {"ar": "النَّصْر", "tr": "an-naṣr", "fr": "le secours, la victoire", "type": "nom d'action"},
            {"ar": "النَّاصِر", "tr": "an-nāṣir", "fr": "le secourant", "type": "participe actif"},
            {"ar": "النَّصِير", "tr": "an-Naṣīr", "fr": "le Secourant (Nom divin)", "type": "nom intensif"},
            {"ar": "الأَنْصَار", "tr": "al-Anṣār", "fr": "les Auxiliaires (compagnons médinois)", "type": "pluriel"}
        ],
        "quran": [
            {"ref": "47, 7", "ar": "إِن تَنصُرُوا۟ ٱللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ", "fr": "Si vous secourez Dieu, Il vous secourra et raffermira vos pas."},
            {"ref": "110, 1", "ar": "إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ", "fr": "Lorsque viennent le secours de Dieu et l'ouverture."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Où ai-je besoin d'être secouru aujourd'hui — et où suis-je appelé à secourir ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "gh-y-b",
        "letters": ["غ","ي","ب"],
        "root_ar": "غ ي ب",
        "root_tr": "gh-y-b",
        "core_ar": "الغَيْب",
        "core_fr": "Le mystère — ce qui est absent à la vue",
        "field": "<em>Ghāba</em> : être absent, être caché. Le <em>ghayb</em> n'est pas le néant ni le mensonge — c'est <em>ce qui est, mais n'apparaît pas (encore)</em>. Le couple coranique <em>al-ghayb wa-sh-shahāda</em> (l'invisible et le visible) couvre la totalité du réel : il y a ce que je vois, et il y a ce qui est et que je ne vois pas. La foi (<em>īmān</em>) est définie dès 2,3 comme <em>croyance au ghayb</em> — non pas à l'absurde, mais au réel qui ne s'expose pas à la vue.",
        "glose_gloton": "Gloton insiste : <em>ghayb</em> ne signifie pas \"surnaturel\". C'est <em>la part du réel</em> que les sens ne saisissent pas — qui inclut le passé révolu, l'avenir, les anges, le cœur d'autrui, et finalement Dieu Lui-même. La vie spirituelle est l'apprentissage d'une certaine <em>fréquentation</em> du <em>ghayb</em> : ne pas Le voir, mais Le savoir là.",
        "forms": [
            {"ar": "غَابَ", "tr": "ghāba", "fr": "être absent, disparaître", "form": "I", "type": "verbe"},
            {"ar": "اِغْتَابَ", "tr": "ightāba", "fr": "médire (parler de quelqu'un en son absence)", "form": "VIII", "type": "verbe"},
            {"ar": "الغَيْب", "tr": "al-ghayb", "fr": "l'invisible, le mystère", "type": "nom"},
            {"ar": "الغَائِب", "tr": "al-ghāʾib", "fr": "l'absent", "type": "participe actif"},
            {"ar": "الغِيبَة", "tr": "al-ghība", "fr": "l'absence ; la médisance", "type": "nom"},
            {"ar": "غَيُوب", "tr": "ghayūb", "fr": "intensif : Celui qui connaît parfaitement l'invisible", "type": "nom intensif"}
        ],
        "quran": [
            {"ref": "2, 3", "ar": "ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ", "fr": "Ceux qui croient au mystère (au ghayb)."},
            {"ref": "6, 73", "ar": "عَٰلِمُ ٱلْغَيْبِ وَٱلشَّهَٰدَةِ", "fr": "Le Connaissant de l'invisible et du visible."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Quelle part de réel est en cet instant <em>là</em>, sans m'apparaître — et que je pourrais simplement saluer ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ḥ-y-y",
        "letters": ["ح","ي","ي"],
        "root_ar": "ح ي ي",
        "root_tr": "ḥ-y-y",
        "core_ar": "الحَيَاة",
        "core_fr": "La vie — ce qui se tient debout",
        "field": "<em>Ḥayya</em> : être vivant. La racine partage avec l'hébreu <em>ḥayyim</em> la même profondeur. Curieusement, la même racine donne <em>ḥayāʾ</em> (la pudeur, la retenue) — comme si <em>être vivant</em> et <em>avoir de la pudeur</em> étaient liés : ce qui est vivant <em>se réserve</em>, ne s'expose pas tout entier. Le Vivant (<em>al-Ḥayy</em>, Nom n°63) est Celui qui se tient, et qui fait tenir tout ce qui vit.",
        "glose_gloton": "Gloton montre que <em>al-Ḥayy</em> est souvent couplé à <em>al-Qayyūm</em> (\"Celui qui se tient debout par Lui-même et fait tenir le reste\", versets 2,255 et 3,2). La vie coranique n'est pas un simple processus biologique : c'est <em>la qualité de se tenir</em>, de ne pas s'effondrer. <em>Aḥyā</em> (faire vivre) et <em>amāta</em> (faire mourir) sont les deux verbes corrélés qui scandent l'œuvre divine.",
        "forms": [
            {"ar": "حَيِيَ", "tr": "ḥayiya", "fr": "vivre, être vivant", "form": "I", "type": "verbe"},
            {"ar": "أَحْيَا", "tr": "aḥyā", "fr": "faire vivre, ressusciter", "form": "IV", "type": "verbe causatif"},
            {"ar": "اِسْتَحْيَا", "tr": "istaḥyā", "fr": "épargner ; éprouver de la pudeur", "form": "X", "type": "verbe"},
            {"ar": "الحَيَاة", "tr": "al-ḥayāt", "fr": "la vie", "type": "nom"},
            {"ar": "الحَيّ", "tr": "al-Ḥayy", "fr": "le Vivant", "type": "nom de qualité"},
            {"ar": "المُحْيِي", "tr": "al-Muḥyī", "fr": "Celui qui donne la vie", "type": "participe actif"},
            {"ar": "الحَيَاء", "tr": "al-ḥayāʾ", "fr": "la pudeur, la retenue vitale", "type": "nom"},
            {"ar": "التَّحِيَّة", "tr": "at-taḥiyya", "fr": "la salutation (vœu de vie)", "type": "nom d'action"}
        ],
        "quran": [
            {"ref": "2, 255", "ar": "ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ", "fr": "Dieu — il n'y a de dieu que Lui — le Vivant, Celui qui subsiste par Lui-même."},
            {"ref": "30, 50", "ar": "إِنَّ ذَٰلِكَ لَمُحْيِى ٱلْمَوْتَىٰ ۖ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ", "fr": "Certes, Celui-là est Celui qui fait vivre les morts — Il est puissant sur toute chose."}
        ],
        "dict_links": [],
        "nom_links": [61, 63],
        "meditation": "En cet instant, qu'est-ce qui en moi se <em>tient</em> vraiment — et qu'est-ce qui s'affaisse ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "m-w-t",
        "letters": ["م","و","ت"],
        "root_ar": "م و ت",
        "root_tr": "m-w-t",
        "core_ar": "المَوْت",
        "core_fr": "La mort — la rétraction de la présence",
        "field": "<em>Māta</em> : mourir. La racine est le pôle contraire et complémentaire de ḥ-y-y. Le Coran évite la dualité tragique : <em>al-ladhī khalaqa l-mawta wa-l-ḥayāt</em> (67,2) — \"Celui qui a créé la mort et la vie\" : la mort est <em>créée</em>, donc voulue, donc bonne. Et la voie soufie parle d'une <em>mort avant la mort</em> (<em>mūtū qabla an tamūtū</em>) : mourir à l'ego pour vivre au Réel.",
        "glose_gloton": "Gloton souligne le caractère non-négatif de <em>mawt</em> dans le Coran : la mort n'est pas l'antithèse de la vie, c'est <em>son corollaire</em>. Les deux verbes <em>aḥyā</em> et <em>amāta</em> reviennent toujours ensemble, comme les deux mains d'une seule œuvre. Et la <em>fanāʾ</em> soufie (extinction) prolonge cette intuition : il y a une mort qui fait vivre.",
        "forms": [
            {"ar": "مَاتَ", "tr": "māta", "fr": "mourir", "form": "I", "type": "verbe"},
            {"ar": "أَمَاتَ", "tr": "amāta", "fr": "faire mourir, donner la mort", "form": "IV", "type": "verbe causatif"},
            {"ar": "المَوْت", "tr": "al-mawt", "fr": "la mort", "type": "nom"},
            {"ar": "المَيِّت", "tr": "al-mayyit", "fr": "le mort, le défunt", "type": "participe actif"},
            {"ar": "المَوْتَى", "tr": "al-mawtā", "fr": "les morts (collectif)", "type": "pluriel"},
            {"ar": "المُمِيت", "tr": "al-Mumīt", "fr": "Celui qui fait mourir", "type": "participe actif"}
        ],
        "quran": [
            {"ref": "67, 2", "ar": "ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا", "fr": "Celui qui a créé la mort et la vie pour vous éprouver — lequel d'entre vous serait le meilleur en œuvre."},
            {"ref": "3, 185", "ar": "كُلُّ نَفْسٍ ذَآئِقَةُ ٱلْمَوْتِ", "fr": "Toute âme goûtera à la mort."}
        ],
        "dict_links": [],
        "nom_links": [62],
        "meditation": "À quoi en moi est-ce que je suis appelé à <em>mourir</em> pour qu'autre chose puisse vivre ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "b-ṣ-r",
        "letters": ["ب","ص","ر"],
        "root_ar": "ب ص ر",
        "root_tr": "b-ṣ-r",
        "core_ar": "البَصِيرَة",
        "core_fr": "La vision — voir avec l'œil intérieur",
        "field": "<em>Baṣura</em> : voir, percevoir. La racine distingue deux modes : <em>baṣar</em> (la vue physique, ce que captent les yeux) et <em>baṣīra</em> (la vision intérieure, la clairvoyance). Le Coran insiste sur la possible <em>cécité de la baṣīra</em> alors que les yeux fonctionnent : <em>fa-innahā lā taʿmā l-abṣāru wa-lākin taʿmā l-qulūbu</em> (22,46) — \"ce ne sont pas les yeux qui sont aveugles, mais les cœurs qui sont dans les poitrines\".",
        "glose_gloton": "Gloton souligne la finesse : <em>baṣīra</em> est <em>l'œil du cœur</em>. C'est elle qu'on cultive par la voie. <em>al-Baṣīr</em> (Nom n°28, souvent couplé à <em>as-Samīʿ</em>) est Celui qui voit tout — non pas la vue surveillante d'un dieu juge, mais l'attention sans manque, le regard qui prend acte de chaque chose.",
        "forms": [
            {"ar": "بَصُرَ", "tr": "baṣura", "fr": "voir, percevoir", "form": "I", "type": "verbe"},
            {"ar": "أَبْصَرَ", "tr": "abṣara", "fr": "voir, apercevoir", "form": "IV", "type": "verbe"},
            {"ar": "تَبَصَّرَ", "tr": "tabaṣṣara", "fr": "regarder avec discernement", "form": "V", "type": "verbe réflexif"},
            {"ar": "البَصَر", "tr": "al-baṣar", "fr": "la vue (sens physique)", "type": "nom"},
            {"ar": "البَصِيرَة", "tr": "al-baṣīra", "fr": "la vision intérieure, la clairvoyance", "type": "nom"},
            {"ar": "البَصِير", "tr": "al-Baṣīr", "fr": "le Très-Voyant (Nom divin)", "type": "nom intensif"},
            {"ar": "الأَبْصَار", "tr": "al-abṣār", "fr": "les regards, les vues", "type": "pluriel"}
        ],
        "quran": [
            {"ref": "22, 46", "ar": "فَإِنَّهَا لَا تَعْمَى ٱلْأَبْصَٰرُ وَلَٰكِن تَعْمَى ٱلْقُلُوبُ ٱلَّتِى فِى ٱلصُّدُورِ", "fr": "Ce ne sont pas les yeux qui sont aveugles, mais les cœurs qui sont dans les poitrines."},
            {"ref": "12, 108", "ar": "قُلْ هَٰذِهِۦ سَبِيلِىٓ أَدْعُوٓا۟ إِلَى ٱللَّهِ ۚ عَلَىٰ بَصِيرَةٍ أَنَا۠ وَمَنِ ٱتَّبَعَنِى", "fr": "Dis : Voici ma voie — j'appelle à Dieu en pleine clairvoyance, moi et ceux qui me suivent."}
        ],
        "dict_links": [],
        "nom_links": [28],
        "meditation": "Mes yeux voient — mais qu'est-ce que mon cœur, lui, regarde vraiment en cet instant ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "s-m-ʿ",
        "letters": ["س","م","ع"],
        "root_ar": "س م ع",
        "root_tr": "s-m-ʿ",
        "core_ar": "السَّمْع",
        "core_fr": "L'audition — entendre, écouter, obéir",
        "field": "<em>Samiʿa</em> noue trois actes : <em>entendre</em>, <em>écouter</em>, <em>obéir</em>. Dans la racine sémitique, écouter vraiment <em>c'est</em> répondre — l'audition n'est pas passive. L'expression <em>samiʿnā wa aṭaʿnā</em> (\"nous avons entendu et obéi\", 2,285) condense la foi en deux mots. <em>Samāʿ</em> est aussi le terme technique soufi pour l'<em>audition spirituelle</em> (musique, chant, qawwālī) : entendre Dieu à travers le son.",
        "glose_gloton": "Gloton souligne la priorité accordée à l'audition dans le Coran : la révélation est <em>entendue</em> avant d'être lue (Muḥammad est <em>ummī</em>, non-lettré). <em>As-Samīʿ</em> (Nom n°27) est Celui qui entend toute chose — y compris le murmure intérieur qui ne devient pas parole. Et la <em>samāʿ</em> mystique : entendre <em>au-delà du son</em> qui est dit, ce que dit Celui qui parle à travers.",
        "forms": [
            {"ar": "سَمِعَ", "tr": "samiʿa", "fr": "entendre, écouter", "form": "I", "type": "verbe"},
            {"ar": "أَسْمَعَ", "tr": "asmaʿa", "fr": "faire entendre", "form": "IV", "type": "verbe causatif"},
            {"ar": "اِسْتَمَعَ", "tr": "istamaʿa", "fr": "écouter attentivement", "form": "VIII", "type": "verbe réflexif"},
            {"ar": "السَّمْع", "tr": "as-samʿ", "fr": "l'audition, l'ouïe", "type": "nom"},
            {"ar": "السَّمِيع", "tr": "as-Samīʿ", "fr": "le Très-Entendant (Nom divin)", "type": "nom intensif"},
            {"ar": "السَّامِع", "tr": "as-sāmiʿ", "fr": "celui qui entend", "type": "participe actif"},
            {"ar": "السَّمَاع", "tr": "as-samāʿ", "fr": "l'audition spirituelle (musique soufie)", "type": "nom d'action"}
        ],
        "quran": [
            {"ref": "2, 285", "ar": "وَقَالُوا۟ سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا", "fr": "Et ils ont dit : Nous avons entendu et nous avons obéi — Ton pardon, notre Seigneur."},
            {"ref": "20, 46", "ar": "إِنَّنِى مَعَكُمَآ أَسْمَعُ وَأَرَىٰ", "fr": "Je suis avec vous deux — J'entends et Je vois."}
        ],
        "dict_links": [],
        "nom_links": [27],
        "meditation": "Si entendre, c'est répondre — qu'est-ce que j'ai entendu aujourd'hui auquel je n'ai pas encore répondu ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "w-j-h",
        "letters": ["و","ج","ه"],
        "root_ar": "و ج ه",
        "root_tr": "w-j-h",
        "core_ar": "الوَجْه",
        "core_fr": "La face — l'orientation, ce qui se tourne vers",
        "field": "<em>Wajh</em> désigne <em>la face</em> au sens propre, mais aussi <em>la direction</em> qu'on prend (<em>jiha</em>, même racine, = côté, direction) et <em>l'aspect, le mode</em> sous lequel une chose se présente. La <em>face de Dieu</em> (<em>wajh Allāh</em>) est l'expression coranique de <em>ce qui en Lui se tourne vers nous</em> — non pas un anthropomorphisme, mais l'orientation divine elle-même. \"Tout périt sauf Sa face\" (28,88).",
        "glose_gloton": "Gloton montre la profondeur du verset 2,115 : <em>fa-aynamā tuwallū fa-thamma wajhu Llāh</em> — \"où que vous vous tourniez, là est la face de Dieu\". Ce verset est l'une des bases de l'expérience soufie de la présence : aucune direction n'est privée du Visage. Et <em>tawajjuh</em> (orientation, terme technique soufi) est l'acte de <em>tourner sa face</em> vers Lui.",
        "forms": [
            {"ar": "وَجَّهَ", "tr": "wajjaha", "fr": "diriger, orienter", "form": "II", "type": "verbe causatif"},
            {"ar": "تَوَجَّهَ", "tr": "tawajjaha", "fr": "se tourner vers, s'orienter", "form": "V", "type": "verbe réflexif"},
            {"ar": "وَاجَهَ", "tr": "wājaha", "fr": "faire face à", "form": "III", "type": "verbe"},
            {"ar": "الوَجْه", "tr": "al-wajh", "fr": "la face, la direction, l'aspect", "type": "nom"},
            {"ar": "الجِهَة", "tr": "al-jiha", "fr": "le côté, la direction", "type": "nom"},
            {"ar": "الوَجَاهَة", "tr": "al-wajāha", "fr": "la dignité, le rang (litt. : la qualité de la face)", "type": "nom abstrait"},
            {"ar": "التَّوَجُّه", "tr": "at-tawajjuh", "fr": "l'orientation spirituelle vers Dieu", "type": "nom d'action"}
        ],
        "quran": [
            {"ref": "2, 115", "ar": "فَأَيْنَمَا تُوَلُّوا۟ فَثَمَّ وَجْهُ ٱللَّهِ", "fr": "Où que vous vous tourniez, là est la face de Dieu."},
            {"ref": "28, 88", "ar": "كُلُّ شَىْءٍ هَالِكٌ إِلَّا وَجْهَهُۥ", "fr": "Toute chose périt, sauf Sa face."}
        ],
        "dict_links": ["tawajjuh"],
        "nom_links": [],
        "meditation": "Vers quoi est tournée ma face en cet instant — et où voudrais-je qu'elle se retourne ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "k-b-r",
        "letters": ["ك","ب","ر"],
        "root_ar": "ك ب ر",
        "root_tr": "k-b-r",
        "core_ar": "التَّكْبِير",
        "core_fr": "La grandeur — proclamer la transcendance",
        "field": "<em>Kabura</em> : être grand. La racine est double : appliquée à Dieu (<em>Allāhu akbar</em> — \"Dieu est plus grand\", élatif), elle dit Sa transcendance ; appliquée à l'homme (<em>takabbur, istikbār</em>), elle dit l'orgueil — la prétention illégitime à la grandeur. C'est la racine du grand partage spirituel : <em>la</em> grandeur appartient à Dieu, et la prétendre pour soi est <em>la</em> faute originelle (celle d'Iblīs, qui refuse de se prosterner par <em>istikbār</em>, 2,34).",
        "glose_gloton": "Gloton souligne que <em>Allāhu akbar</em> n'est pas \"Dieu est le plus grand\" (comparatif clos) mais <em>plus grand</em> — élatif ouvert : <em>plus grand que toute mesure</em>, plus grand que ce qu'on en peut dire, plus grand que l'instant précédent où l'on a déjà dit qu'Il était grand. Le <em>takbīr</em> est donc une <em>relativisation infinie</em> de tout ce qui n'est pas Lui.",
        "forms": [
            {"ar": "كَبُرَ", "tr": "kabura", "fr": "être grand", "form": "I", "type": "verbe d'état"},
            {"ar": "كَبَّرَ", "tr": "kabbara", "fr": "proclamer la grandeur (de Dieu)", "form": "II", "type": "verbe intensif"},
            {"ar": "تَكَبَّرَ", "tr": "takabbara", "fr": "s'enorgueillir, se faire grand", "form": "V", "type": "verbe réflexif"},
            {"ar": "اِسْتَكْبَرَ", "tr": "istakbara", "fr": "s'enfler d'orgueil, prétendre à la grandeur", "form": "X", "type": "verbe"},
            {"ar": "الكِبْر", "tr": "al-kibr", "fr": "l'orgueil", "type": "nom"},
            {"ar": "الكَبِير", "tr": "al-Kabīr", "fr": "le Grand (Nom divin)", "type": "nom intensif"},
            {"ar": "أَكْبَر", "tr": "akbar", "fr": "plus grand (élatif)", "type": "comparatif"},
            {"ar": "التَّكْبِير", "tr": "at-takbīr", "fr": "la proclamation de la grandeur divine (Allāhu akbar)", "type": "nom d'action"},
            {"ar": "المُتَكَبِّر", "tr": "al-Mutakabbir", "fr": "Celui qui possède en propre la grandeur (Nom divin) ; ou : l'orgueilleux (pour l'homme)", "type": "participe actif"}
        ],
        "quran": [
            {"ref": "17, 111", "ar": "وَكَبِّرْهُ تَكْبِيرًۢا", "fr": "Et proclame Sa grandeur d'une véritable proclamation."},
            {"ref": "2, 34", "ar": "أَبَىٰ وَٱسْتَكْبَرَ وَكَانَ مِنَ ٱلْكَٰفِرِينَ", "fr": "Il refusa, s'enfla d'orgueil, et fut du nombre des ingrats."}
        ],
        "dict_links": ["kibr"],
        "nom_links": [38],
        "meditation": "Lorsque je dis <em>Allāhu akbar</em>, qu'est-ce qui en moi consent vraiment à <em>n'être pas</em> grand ?"
    },
]


def main():
    if not os.path.exists(DATA):
        print(f"ERREUR : {DATA}", file=sys.stderr); sys.exit(1)
    with open(DATA, encoding="utf-8") as f:
        data = json.load(f)
    existing = {r["id"] for r in data["racines"]}
    dups = [r["id"] for r in NEW_RACINES if r["id"] in existing]
    if dups:
        print(f"ERREUR doublons : {dups}", file=sys.stderr); sys.exit(1)
    required = {"id","letters","root_ar","root_tr","core_ar","core_fr","field","glose_gloton","forms","quran","dict_links","nom_links","meditation"}
    for r in NEW_RACINES:
        m = required - set(r.keys())
        if m: print(f"ERREUR {r['id']} manque {m}", file=sys.stderr); sys.exit(1)
        if len(r["letters"]) != 3:
            print(f"ERREUR {r['id']} letters", file=sys.stderr); sys.exit(1)
    shutil.copy(DATA, BAK)
    print(f"Sauvegarde : {BAK}")
    data["racines"].extend(NEW_RACINES)
    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✓ {len(NEW_RACINES)} racines ajoutées. Total : {len(data['racines'])}.")
    if os.path.exists(HTML):
        with open(HTML, encoding="utf-8") as f: html = f.read()
        n = len(data["racines"])
        h2 = re.sub(r"<strong>\d+ racines actuellement</strong>",
                    f"<strong>{n} racines actuellement</strong>", html)
        if h2 != html:
            with open(HTML, "w", encoding="utf-8") as f: f.write(h2)
            print(f"✓ Compteur HTML → {n}")

if __name__ == "__main__":
    main()
