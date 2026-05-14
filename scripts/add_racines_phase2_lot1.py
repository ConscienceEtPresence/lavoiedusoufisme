#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Phase 2 — Lot 1 : le socle théologique (12 racines).
Ajoute à data/racines.json. D'après Maurice Gloton, *Approche du Coran
par la grammaire et le lexique* (Albouraq, 2002).

Racines : ʾ-l-h, ʾ-ḥ-d, w-ḥ-d, ṣ-m-d, q-d-s, s-b-ḥ, ʾ-m-n, s-l-m,
          sh-h-d, ḥ-m-d, ṣ-l-w, kh-l-ṣ.
"""

import json
import os
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "racines.json")
BAK  = DATA + ".before_phase2_lot1"
HTML = os.path.join(ROOT, "pages", "racines", "index.html")


NEW_RACINES = [
    # -----------------------------------------------------------------
    {
        "id": "ʾ-l-h",
        "letters": ["ا","ل","ه"],
        "root_ar": "ء ل ه",
        "root_tr": "ʾ-l-h",
        "core_ar": "الإِلَٰه",
        "core_fr": "Le Dieu adoré, ce vers quoi le cœur se tourne",
        "field": "La racine désigne ce qui est <em>adoré</em>, ce vers quoi un être se tourne pour s'en remettre absolument. <em>Allāh</em> est la contraction de <em>al-ilāh</em> : <em>le</em> Dieu, par excellence — non un dieu parmi d'autres, mais Celui qui est Adoré en vérité. La racine partage avec <em>walaha</em> (être perdu d'amour, brûlé de désir) une nappe sémantique de l'éperdu : adorer, c'est aller vers Lui comme une plante vers la lumière.",
        "glose_gloton": "Pour Gloton, <em>ilāh</em> ne se résume jamais à \"divinité\" au sens abstrait. C'est <em>ce qui m'arrache à moi-même</em>, ce devant quoi je consens à m'abaisser. D'où l'enjeu de la <em>shahāda</em> : <em>lā ilāha illā Llāh</em> — il n'y a pas d'adoré sinon Lui. Toute la vie spirituelle consiste à débusquer les faux <em>ilāh</em> du cœur (l'ego, le désir, l'opinion d'autrui) pour ne plus se tourner que vers le Réel.",
        "forms": [
            {"ar": "أَلِهَ", "tr": "aliha", "fr": "adorer, vouer un culte", "form": "I", "type": "verbe"},
            {"ar": "تَأَلَّهَ", "tr": "taʾallaha", "fr": "se faire dieu, prétendre à la divinité", "form": "V", "type": "verbe réflexif"},
            {"ar": "اللَّه", "tr": "Allāh", "fr": "Dieu (al-ilāh contracté)", "type": "nom propre"},
            {"ar": "الإِلَٰه", "tr": "al-ilāh", "fr": "le Dieu adoré", "type": "nom"},
            {"ar": "الأُلُوهِيَّة", "tr": "al-ulūhiyya", "fr": "la divinité (comme rapport d'adoration)", "type": "nom abstrait"},
            {"ar": "آلِهَة", "tr": "āliha", "fr": "des dieux, des idoles", "type": "pluriel"},
            {"ar": "اللَّهُمَّ", "tr": "Allāhumma", "fr": "Ô mon Dieu (vocatif intensif)", "type": "vocatif"}
        ],
        "quran": [
            {"ref": "2, 163", "ar": "وَإِلَٰهُكُمْ إِلَٰهٌ وَٰحِدٌ ۖ لَّآ إِلَٰهَ إِلَّا هُوَ ٱلرَّحْمَٰنُ ٱلرَّحِيمُ", "fr": "Et votre Dieu est un Dieu unique — il n'y a de dieu que Lui, le Tout-Miséricordieux, le Très-Miséricordieux."},
            {"ref": "37, 35", "ar": "إِنَّهُمْ كَانُوٓا۟ إِذَا قِيلَ لَهُمْ لَآ إِلَٰهَ إِلَّا ٱللَّهُ يَسْتَكْبِرُونَ", "fr": "Lorsqu'on leur disait : Il n'y a de dieu que Dieu, ils s'enflaient d'orgueil."},
            {"ref": "112, 1", "ar": "قُلْ هُوَ ٱللَّهُ أَحَدٌ", "fr": "Dis : Lui, Dieu, est Un (Aḥad)."}
        ],
        "dict_links": ["tawhid"],
        "nom_links": [1],
        "meditation": "Vers quoi mon cœur se tourne-t-il vraiment, quand je crois prier ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ʾ-ḥ-d",
        "letters": ["ا","ح","د"],
        "root_ar": "ء ح د",
        "root_tr": "ʾ-ḥ-d",
        "core_ar": "الأَحَد",
        "core_fr": "L'Un indivisible, le Seul",
        "field": "<em>Aḥad</em> ne désigne pas une unité que l'on pourrait compter (\"un, deux, trois…\") mais une <em>unicité absolue</em>, indivisible, sans seconde possible. Il s'emploie négativement (<em>aḥad</em> = personne, pas un seul) et positivement (<em>al-Aḥad</em> = l'Un par excellence). La différence avec <em>wāḥid</em> est fondamentale : <em>wāḥid</em> peut ouvrir une série, <em>aḥad</em> exclut toute série.",
        "glose_gloton": "Gloton souligne que la sourate 112 (al-Ikhlāṣ) ouvre par <em>Allāhu Aḥad</em> et non <em>Allāhu Wāḥid</em>. Le choix est doctrinal : Dieu n'est pas \"le premier d'une suite\", Il est <em>Celui hors duquel rien ne peut être compté</em>. C'est la pointe du <em>tawḥīd</em> : non pas affirmer qu'il y a un seul Dieu, mais qu'il n'y a <em>que</em> Lui.",
        "forms": [
            {"ar": "الأَحَد", "tr": "al-Aḥad", "fr": "l'Un indivisible, le Seul", "type": "nom"},
            {"ar": "أَحَدٌ", "tr": "aḥadun", "fr": "quelqu'un, personne (selon contexte)", "type": "pronom"},
            {"ar": "إِحْدَى", "tr": "iḥdā", "fr": "l'une (féminin)", "type": "ordinal"},
            {"ar": "الأَحَدِيَّة", "tr": "al-aḥadiyya", "fr": "l'unicité essentielle (terme soufi : Dieu en Soi)", "type": "nom abstrait"}
        ],
        "quran": [
            {"ref": "112, 1-4", "ar": "قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ", "fr": "Dis : Lui, Dieu, est Un. Dieu, le Recours absolu. Il n'a pas engendré, n'a pas été engendré, et nul n'est égal à Lui."},
            {"ref": "72, 18", "ar": "وَأَنَّ ٱلْمَسَٰجِدَ لِلَّهِ فَلَا تَدْعُوا۟ مَعَ ٱللَّهِ أَحَدًا", "fr": "Les lieux de prosternation appartiennent à Dieu : n'invoquez personne aux côtés de Dieu."}
        ],
        "dict_links": ["tawhid"],
        "nom_links": [68],
        "meditation": "Y a-t-il en moi un \"second\" silencieux à qui j'accorde de la place — à côté de Lui ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "w-ḥ-d",
        "letters": ["و","ح","د"],
        "root_ar": "و ح د",
        "root_tr": "w-ḥ-d",
        "core_ar": "التَّوْحِيد",
        "core_fr": "Faire un, reconnaître l'Un",
        "field": "<em>Waḥada</em> : être un, isolé, unique. La racine décrit aussi bien l'<em>état</em> d'être un (<em>wāḥid</em>) que l'<em>acte</em> de reconnaître l'unité (<em>tawḥīd</em>). Le <em>tawḥīd</em> n'est donc pas seulement une thèse théologique, c'est un travail : <em>unifier</em> son regard, son intention, son cœur — jusqu'à ne plus voir que Lui en tout.",
        "glose_gloton": "Gloton distingue trois niveaux du <em>tawḥīd</em>, hérités de la tradition : <em>tawḥīd al-ʿawāmm</em> (\"il n'y a de dieu que Dieu\" — théologique), <em>tawḥīd al-khawāṣṣ</em> (\"il n'est d'agent que Lui\" — Lui seul agit), <em>tawḥīd khāṣṣ al-khawāṣṣ</em> (\"il n'est de réalité que Lui\" — extinction). La racine porte ces trois lectures.",
        "forms": [
            {"ar": "وَحَدَ", "tr": "waḥada", "fr": "être unique, être isolé", "form": "I", "type": "verbe"},
            {"ar": "وَحَّدَ", "tr": "waḥḥada", "fr": "unifier, reconnaître l'unité de Dieu", "form": "II", "type": "verbe causatif"},
            {"ar": "تَوَحَّدَ", "tr": "tawaḥḥada", "fr": "s'unifier, devenir un en soi", "form": "V", "type": "verbe réflexif"},
            {"ar": "اِتَّحَدَ", "tr": "ittaḥada", "fr": "s'unir à, faire un avec", "form": "VIII", "type": "verbe"},
            {"ar": "التَّوْحِيد", "tr": "at-tawḥīd", "fr": "l'attestation/réalisation de l'unicité divine", "type": "nom d'action"},
            {"ar": "الوَاحِد", "tr": "al-Wāḥid", "fr": "l'Un (qui n'a pas de pareil)", "type": "nom de qualité"},
            {"ar": "الوَحْدَة", "tr": "al-waḥda", "fr": "l'unité, la solitude habitée", "type": "nom abstrait"},
            {"ar": "وَحْدَهُ", "tr": "waḥdahu", "fr": "Lui seul, à Lui seul", "type": "adverbe"},
            {"ar": "الوَحْدَانِيَّة", "tr": "al-waḥdāniyya", "fr": "l'unicité comme attribut divin", "type": "nom abstrait"}
        ],
        "quran": [
            {"ref": "39, 45", "ar": "وَإِذَا ذُكِرَ ٱللَّهُ وَحْدَهُ ٱشْمَأَزَّتْ قُلُوبُ ٱلَّذِينَ لَا يُؤْمِنُونَ بِٱلْءَاخِرَةِ", "fr": "Et lorsque Dieu est mentionné, Lui seul, les cœurs de ceux qui ne croient pas à l'au-delà se rétractent."},
            {"ref": "2, 163", "ar": "وَإِلَٰهُكُمْ إِلَٰهٌ وَٰحِدٌ", "fr": "Et votre Dieu est un Dieu unique."}
        ],
        "dict_links": ["tawhid"],
        "nom_links": [67],
        "meditation": "Où, en moi, l'unité s'est-elle fendue aujourd'hui — et que faudrait-il pour la recoudre ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ṣ-m-d",
        "letters": ["ص","م","د"],
        "root_ar": "ص م د",
        "root_tr": "ṣ-m-d",
        "core_ar": "الصَّمَد",
        "core_fr": "Le Recours absolu, le Plein sans creux",
        "field": "La racine ṣ-m-d évoque ce qui est <em>plein, massif, sans interstice</em> — et corrélativement, ce vers quoi <em>on se tourne</em> pour s'appuyer. <em>Aṣ-Ṣamad</em> est à la fois Celui qui n'a besoin de rien (plein) et Celui dont tout dépend (recours). Les deux sens se tiennent : seul ce qui est plein peut être un appui sans faille.",
        "glose_gloton": "Pour Gloton, <em>aṣ-Ṣamad</em> (sourate 112) répond directement à <em>aḥad</em> : Dieu est Un, et cet Un est <em>plein</em> — sans manque, sans dépendance, sans cavité par où le besoin pourrait s'engouffrer. Le verset bascule de l'unité essentielle (<em>aḥad</em>) à l'autosuffisance absolue (<em>ṣamad</em>) : ce qui est Un n'a personne à qui demander.",
        "forms": [
            {"ar": "صَمَدَ", "tr": "ṣamada", "fr": "se tourner vers, viser, recourir à", "form": "I", "type": "verbe"},
            {"ar": "الصَّمَد", "tr": "aṣ-Ṣamad", "fr": "le Recours absolu, le Plein", "type": "nom de qualité"},
            {"ar": "الصَّمَدِيَّة", "tr": "aṣ-ṣamadiyya", "fr": "l'autosuffisance absolue (terme soufi)", "type": "nom abstrait"}
        ],
        "quran": [
            {"ref": "112, 2", "ar": "ٱللَّهُ ٱلصَّمَدُ", "fr": "Dieu, le Recours absolu."}
        ],
        "dict_links": [],
        "nom_links": [69],
        "meditation": "Vers quoi est-ce que je me tourne quand je manque — et est-ce assez plein pour me porter ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "q-d-s",
        "letters": ["ق","د","س"],
        "root_ar": "ق د س",
        "root_tr": "q-d-s",
        "core_ar": "القُدْس",
        "core_fr": "La sainteté — la mise à part qui purifie",
        "field": "<em>Qaddasa</em> : sanctifier, purifier, mettre à part. La racine partage avec l'hébreu <em>qadosh</em> la même intuition : le saint est ce qui est <em>séparé</em> — non par mépris, mais par transcendance. <em>Al-Quds</em> désigne Jérusalem (la ville sainte) et plus profondément le pôle de pureté en Dieu. <em>Rūḥ al-Qudus</em> est le Souffle saint (l'Esprit) qui sanctifie.",
        "glose_gloton": "Gloton insiste : la sainteté coranique n'est pas une qualité morale (\"être bon\") mais une qualité <em>ontologique</em> — être inatteignable par la souillure, hors de portée du défaut. <em>Al-Quddūs</em> (Nom n°5) signifie : Celui de qui rien ne peut être dit qui ne soit pur, Celui que toute imperfection lâche en s'approchant.",
        "forms": [
            {"ar": "قَدَّسَ", "tr": "qaddasa", "fr": "sanctifier, purifier", "form": "II", "type": "verbe causatif"},
            {"ar": "تَقَدَّسَ", "tr": "taqaddasa", "fr": "être sanctifié, se purifier", "form": "V", "type": "verbe réflexif"},
            {"ar": "القُدْس", "tr": "al-Quds", "fr": "la sainteté ; Jérusalem", "type": "nom"},
            {"ar": "القُدُّوس", "tr": "al-Quddūs", "fr": "le Très-Saint", "type": "nom intensif"},
            {"ar": "المُقَدَّس", "tr": "al-muqaddas", "fr": "le sanctifié, le sacré", "type": "participe passif"},
            {"ar": "رُوحُ القُدُس", "tr": "Rūḥ al-Qudus", "fr": "le Souffle saint, l'Esprit de sainteté", "type": "expression"},
            {"ar": "التَّقْدِيس", "tr": "at-taqdīs", "fr": "la sanctification, l'acte de proclamer la sainteté", "type": "nom d'action"}
        ],
        "quran": [
            {"ref": "59, 23", "ar": "هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَٰهَ إِلَّا هُوَ ٱلْمَلِكُ ٱلْقُدُّوسُ", "fr": "Il est Dieu — il n'y a de dieu que Lui — le Roi, le Très-Saint."},
            {"ref": "2, 30", "ar": "وَنَحْنُ نُسَبِّحُ بِحَمْدِكَ وَنُقَدِّسُ لَكَ", "fr": "Et nous Te glorifions par Ta louange et Te sanctifions."}
        ],
        "dict_links": [],
        "nom_links": [5],
        "meditation": "Qu'est-ce qui, en moi, demande à être <em>mis à part</em> — non par mépris du reste, mais pour Lui faire place ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "s-b-ḥ",
        "letters": ["س","ب","ح"],
        "root_ar": "س ب ح",
        "root_tr": "s-b-ḥ",
        "core_ar": "التَّسْبِيح",
        "core_fr": "Glorifier en transcendant — \"il nage loin de toute imperfection\"",
        "field": "Le verbe premier <em>sabaḥa</em> signifie <em>nager, flotter</em>, parcourir un grand espace sans s'arrêter. De là, la forme intensive <em>sabbaḥa</em> : <em>déclarer Dieu transcendant</em>, c'est-à-dire <em>L'éloigner par la parole de toute imperfection</em>, comme un nageur s'éloigne du rivage. <em>Subḥān Allāh</em> n'est pas une exclamation pieuse vague : c'est l'acte de <em>poser une distance</em> entre Dieu et ce qui pourrait Le limiter.",
        "glose_gloton": "Gloton montre la beauté de cette image : <em>tasbīḥ</em> est <em>un mouvement</em>, pas un état. Quand je dis <em>Subḥān Allāh</em>, je <em>nage</em> dans la louange — je me déplace, j'éloigne de Lui toute représentation qui Le ramènerait à ma mesure. Les astres aussi <em>nagent</em> (<em>kullun fī falakin yasbaḥūn</em>, 36,40) — leur orbite est elle-même un <em>tasbīḥ</em>.",
        "forms": [
            {"ar": "سَبَحَ", "tr": "sabaḥa", "fr": "nager, flotter, parcourir", "form": "I", "type": "verbe"},
            {"ar": "سَبَّحَ", "tr": "sabbaḥa", "fr": "glorifier, déclarer transcendant", "form": "II", "type": "verbe causatif"},
            {"ar": "التَّسْبِيح", "tr": "at-tasbīḥ", "fr": "la glorification (Subḥān Allāh)", "type": "nom d'action"},
            {"ar": "السُّبْحَة", "tr": "as-subḥa", "fr": "le chapelet (objet de la glorification)", "type": "nom concret"},
            {"ar": "سُبْحَانَ", "tr": "subḥān", "fr": "gloire à, transcendance de", "type": "nom verbal"},
            {"ar": "المُسَبِّح", "tr": "al-musabbiḥ", "fr": "celui qui glorifie", "type": "participe actif"}
        ],
        "quran": [
            {"ref": "17, 44", "ar": "تُسَبِّحُ لَهُ ٱلسَّمَٰوَٰتُ ٱلسَّبْعُ وَٱلْأَرْضُ وَمَن فِيهِنَّ ۚ وَإِن مِّن شَىْءٍ إِلَّا يُسَبِّحُ بِحَمْدِهِۦ", "fr": "Les sept cieux Le glorifient, et la terre, et ceux qui y sont — il n'est de chose qui ne Le glorifie par Sa louange."},
            {"ref": "36, 40", "ar": "وَكُلٌّ فِى فَلَكٍ يَسْبَحُونَ", "fr": "Et chacun nage dans une orbite."}
        ],
        "dict_links": ["tanzih-tashbih"],
        "nom_links": [],
        "meditation": "Quelle image de Lui ai-je laissée s'installer, qu'il faudrait <em>éloigner</em> à nouveau ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ʾ-m-n",
        "letters": ["ا","م","ن"],
        "root_ar": "ء م ن",
        "root_tr": "ʾ-m-n",
        "core_ar": "الإِيمَان",
        "core_fr": "La foi — être en sécurité, se confier",
        "field": "La racine ʾ-m-n porte ensemble trois nappes inséparables : <em>être en sécurité</em> (<em>amina</em>), <em>faire confiance</em> (<em>āmana</em>), <em>être digne de confiance</em> (<em>amīn</em>). La foi (<em>īmān</em>) n'est donc pas d'abord une adhésion intellectuelle à des dogmes — c'est <em>l'état d'un cœur en sécurité parce qu'il s'est remis</em>. Le dépôt (<em>amāna</em>) est ce qu'on me confie parce que je suis digne de la garde.",
        "glose_gloton": "Pour Gloton, <em>āmana</em> est un verbe d'<em>accueil</em> autant que de croyance : croire, c'est <em>laisser entrer</em>. Et la sécurité (<em>amn</em>) n'est pas l'absence de danger mais la présence d'un Garant. Le <em>muʾmin</em> n'est pas celui qui sait, c'est celui qui s'est confié. Et <em>al-Muʾmin</em> (Nom n°7) est Dieu lui-même comme <em>Source</em> de la sécurité confiée.",
        "forms": [
            {"ar": "أَمِنَ", "tr": "amina", "fr": "être en sécurité, être à l'abri", "form": "I", "type": "verbe"},
            {"ar": "آمَنَ", "tr": "āmana", "fr": "croire, faire confiance", "form": "IV", "type": "verbe"},
            {"ar": "اِسْتَأْمَنَ", "tr": "istaʾmana", "fr": "demander la protection, se mettre sous la garde de", "form": "X", "type": "verbe"},
            {"ar": "الإِيمَان", "tr": "al-īmān", "fr": "la foi, la confiance remise", "type": "nom d'action"},
            {"ar": "الأَمْن", "tr": "al-amn", "fr": "la sécurité", "type": "nom"},
            {"ar": "الأَمَانَة", "tr": "al-amāna", "fr": "le dépôt, ce qui m'est confié", "type": "nom concret"},
            {"ar": "المُؤْمِن", "tr": "al-muʾmin", "fr": "le croyant, le confiant ; al-Muʾmin = Dieu, source de la sécurité", "type": "participe actif"},
            {"ar": "أَمِين", "tr": "amīn", "fr": "digne de confiance, fidèle", "type": "nom de qualité"},
            {"ar": "آمِين", "tr": "āmīn", "fr": "amen — qu'il en soit ainsi, en confiance", "type": "interjection"}
        ],
        "quran": [
            {"ref": "13, 28", "ar": "ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ ۗ أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ", "fr": "Ceux qui ont cru et dont les cœurs s'apaisent par le rappel de Dieu — n'est-ce pas par le rappel de Dieu que les cœurs s'apaisent ?"},
            {"ref": "33, 72", "ar": "إِنَّا عَرَضْنَا ٱلْأَمَانَةَ عَلَى ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ وَٱلْجِبَالِ فَأَبَيْنَ أَن يَحْمِلْنَهَا وَأَشْفَقْنَ مِنْهَا وَحَمَلَهَا ٱلْإِنسَٰنُ", "fr": "Nous avons proposé le dépôt aux cieux, à la terre et aux montagnes — ils ont refusé de le porter, en ont eu peur ; et l'homme l'a porté."}
        ],
        "dict_links": ["iman"],
        "nom_links": [7],
        "meditation": "Mon cœur est-il en sécurité parce qu'il sait — ou parce qu'il s'est remis ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "s-l-m",
        "letters": ["س","ل","م"],
        "root_ar": "س ل م",
        "root_tr": "s-l-m",
        "core_ar": "السَّلَام",
        "core_fr": "La paix — l'intégrité de ce qui se remet entier",
        "field": "Une seule racine pour : <em>paix, salut, intégrité, soumission</em>. <em>Salima</em> : être entier, sain, indemne. <em>Aslama</em> : remettre, livrer en confiance — d'où <em>islām</em>, la <em>remise</em> de soi à Dieu. Et <em>salām</em> : la paix qui résulte de cette remise. Le lien profond : <em>seul ce qui se remet entier reste entier</em>. La paix coranique n'est pas la cessation des conflits, c'est l'intégrité retrouvée du cœur unifié.",
        "glose_gloton": "Gloton récuse la traduction réductrice de <em>islām</em> par \"soumission\" (avec sa connotation servile). <em>Aslama</em> est de la même famille que <em>salām</em> et <em>salīm</em> (le cœur intègre, 26,89) : c'est <em>l'acte par lequel je me remets entier</em>, et donc <em>je redeviens entier</em>. Soumettre, ici, c'est rendre à Dieu ce qui est à Lui pour redevenir soi.",
        "forms": [
            {"ar": "سَلِمَ", "tr": "salima", "fr": "être sain, être indemne, être en paix", "form": "I", "type": "verbe d'état"},
            {"ar": "سَلَّمَ", "tr": "sallama", "fr": "saluer, livrer, remettre en bon état", "form": "II", "type": "verbe"},
            {"ar": "أَسْلَمَ", "tr": "aslama", "fr": "se remettre, s'en remettre à Dieu", "form": "IV", "type": "verbe"},
            {"ar": "اِسْتَسْلَمَ", "tr": "istaslama", "fr": "se rendre, capituler en confiance", "form": "X", "type": "verbe"},
            {"ar": "السَّلَام", "tr": "as-Salām", "fr": "la Paix ; le Salut (Nom divin)", "type": "nom de qualité"},
            {"ar": "الإِسْلَام", "tr": "al-islām", "fr": "la remise de soi à Dieu", "type": "nom d'action"},
            {"ar": "المُسْلِم", "tr": "al-muslim", "fr": "celui qui s'est remis", "type": "participe actif"},
            {"ar": "سَلِيم", "tr": "salīm", "fr": "intègre, indemne (le cœur intègre, qalb salīm)", "type": "nom de qualité"},
            {"ar": "تَسْلِيم", "tr": "taslīm", "fr": "remise, salutation, consentement intérieur", "type": "nom d'action"}
        ],
        "quran": [
            {"ref": "26, 89", "ar": "إِلَّا مَنْ أَتَى ٱللَّهَ بِقَلْبٍ سَلِيمٍ", "fr": "Sinon celui qui vient à Dieu avec un cœur intègre."},
            {"ref": "2, 208", "ar": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱدْخُلُوا۟ فِى ٱلسِّلْمِ كَآفَّةً", "fr": "Ô vous qui avez cru, entrez dans la paix tous ensemble."},
            {"ref": "59, 23", "ar": "ٱلْمَلِكُ ٱلْقُدُّوسُ ٱلسَّلَامُ ٱلْمُؤْمِنُ", "fr": "Le Roi, le Très-Saint, la Paix, le Confiant."}
        ],
        "dict_links": ["islam"],
        "nom_links": [6],
        "meditation": "Qu'est-ce que je retiens encore, que je pourrais <em>remettre</em> pour redevenir entier ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "sh-h-d",
        "letters": ["ش","ه","د"],
        "root_ar": "ش ه د",
        "root_tr": "sh-h-d",
        "core_ar": "الشَّهَادَة",
        "core_fr": "Témoigner — voir, et attester de ce qu'on a vu",
        "field": "<em>Shahida</em> noue deux gestes inséparables : <em>voir de ses propres yeux</em> (être présent, témoin oculaire) et <em>attester</em> par la parole de ce qu'on a vu. Le <em>shāhid</em> n'est pas un croyant sur ouï-dire — c'est celui qui était là. D'où <em>shuhūd</em> (la contemplation soufie comme vision directe) et <em>shahīd</em> (le martyr, celui dont le sang atteste).",
        "glose_gloton": "Pour Gloton, la <em>shahāda</em> n'est pas une formule à réciter : c'est une <em>certification de vue</em>. \"J'atteste qu'il n'y a de dieu que Dieu\" ne vaut que si quelque chose en moi <em>a vu</em>. Toute la voie soufie travaille à faire passer la formule de l'ouï-dire (<em>ʿilm al-yaqīn</em>) à la vision (<em>ʿayn al-yaqīn</em>) puis à l'identité (<em>ḥaqq al-yaqīn</em>).",
        "forms": [
            {"ar": "شَهِدَ", "tr": "shahida", "fr": "être présent, témoigner, voir", "form": "I", "type": "verbe"},
            {"ar": "شَاهَدَ", "tr": "shāhada", "fr": "contempler, observer", "form": "III", "type": "verbe"},
            {"ar": "أَشْهَدَ", "tr": "ashhada", "fr": "prendre à témoin", "form": "IV", "type": "verbe"},
            {"ar": "اِسْتَشْهَدَ", "tr": "istashhada", "fr": "appeler à témoigner ; être pris comme martyr", "form": "X", "type": "verbe"},
            {"ar": "الشَّهَادَة", "tr": "ash-shahāda", "fr": "l'attestation ; le témoignage", "type": "nom d'action"},
            {"ar": "الشَّاهِد", "tr": "ash-shāhid", "fr": "le témoin", "type": "participe actif"},
            {"ar": "الشَّهِيد", "tr": "ash-Shahīd", "fr": "le Témoin (Nom divin) ; le martyr", "type": "nom intensif"},
            {"ar": "المَشْهُود", "tr": "al-mashhūd", "fr": "ce qui est vu, ce dont on témoigne", "type": "participe passif"},
            {"ar": "الشُّهُود", "tr": "ash-shuhūd", "fr": "la contemplation (terme soufi)", "type": "nom d'action"}
        ],
        "quran": [
            {"ref": "3, 18", "ar": "شَهِدَ ٱللَّهُ أَنَّهُۥ لَآ إِلَٰهَ إِلَّا هُوَ", "fr": "Dieu atteste qu'il n'y a de dieu que Lui."},
            {"ref": "41, 53", "ar": "أَوَلَمْ يَكْفِ بِرَبِّكَ أَنَّهُۥ عَلَىٰ كُلِّ شَىْءٍ شَهِيدٌ", "fr": "Ne suffit-il pas que ton Seigneur soit Témoin de toute chose ?"}
        ],
        "dict_links": [],
        "nom_links": [51],
        "meditation": "Ma <em>shahāda</em> tient-elle de ce que j'ai entendu, ou de ce que quelque chose en moi a déjà vu ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ḥ-m-d",
        "letters": ["ح","م","د"],
        "root_ar": "ح م د",
        "root_tr": "ḥ-m-d",
        "core_ar": "الحَمْد",
        "core_fr": "La louange — reconnaître le bien et le dire",
        "field": "<em>Ḥamida</em> : louer, rendre grâce. La louange (<em>ḥamd</em>) se distingue du remerciement (<em>shukr</em>) : on remercie pour un bienfait reçu, on loue ce qui est <em>bien en soi</em>, qu'on en ait reçu quelque chose ou non. C'est pourquoi le Coran s'ouvre par <em>al-ḥamdu li-Llāh</em> et non <em>ash-shukru li-Llāh</em> : la louange précède le don, elle est due à la beauté même de Celui qui est.",
        "glose_gloton": "Gloton souligne le lien : <em>Muḥammad</em> = \"le très-loué\", <em>maḥmūd</em> = le digne de louange, <em>aḥmad</em> = le plus louangeur. La racine décrit autant celui qui loue que Celui qui est loué — Dieu louange Sa propre œuvre (\"<em>al-ḥamdu li-Llāh</em>\" est <em>Sa</em> parole avant d'être la nôtre). La louange est circulaire : elle part de Lui, traverse l'homme, revient à Lui.",
        "forms": [
            {"ar": "حَمِدَ", "tr": "ḥamida", "fr": "louer, faire l'éloge", "form": "I", "type": "verbe"},
            {"ar": "الحَمْد", "tr": "al-ḥamd", "fr": "la louange", "type": "nom d'action"},
            {"ar": "الحَمِيد", "tr": "al-Ḥamīd", "fr": "le Très-Digne-de-louange (Nom divin)", "type": "nom intensif"},
            {"ar": "مُحَمَّد", "tr": "Muḥammad", "fr": "le très-loué (prénom du Prophète)", "type": "participe passif intensif"},
            {"ar": "أَحْمَد", "tr": "Aḥmad", "fr": "le plus louangeur / le plus loué", "type": "comparatif/superlatif"},
            {"ar": "مَحْمُود", "tr": "maḥmūd", "fr": "digne de louange", "type": "participe passif"},
            {"ar": "المَقَامُ المَحْمُود", "tr": "al-maqām al-maḥmūd", "fr": "la station louée (promise au Prophète, 17,79)", "type": "expression"}
        ],
        "quran": [
            {"ref": "1, 2", "ar": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", "fr": "La louange est à Dieu, Seigneur des mondes."},
            {"ref": "17, 79", "ar": "عَسَىٰٓ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا", "fr": "Il se peut que ton Seigneur t'élève à une station louée."}
        ],
        "dict_links": ["hamd"],
        "nom_links": [57],
        "meditation": "Qu'est-ce que je peux louer en cet instant, qui ne demande rien en retour ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ṣ-l-w",
        "letters": ["ص","ل","و"],
        "root_ar": "ص ل و",
        "root_tr": "ṣ-l-w",
        "core_ar": "الصَّلَاة",
        "core_fr": "La prière — le lien rituel qui tient la verticale",
        "field": "La racine ṣ-l-w est complexe et discutée. Une étymologie probable la rattache à <em>ṣilā</em> (le lien), une autre au <em>ṣalan</em> (l'os du bas du dos qui fléchit dans la prosternation). Les deux convergent : <em>ṣalāt</em> est <em>l'acte qui relie</em> en pliant le corps. Dieu Lui-même \"<em>fait ṣalāt</em>\" sur le Prophète et les croyants (33,43) — ce qui ne peut signifier \"prier\" mais <em>tourner Sa face avec bienveillance</em>, <em>établir un lien</em>.",
        "glose_gloton": "Gloton montre l'asymétrie révélatrice : quand l'homme fait <em>ṣalāt</em>, c'est prière ; quand Dieu fait <em>ṣalāt</em> sur le Prophète, c'est bénédiction et orientation amoureuse. La racine porte donc le <em>lien des deux côtés</em> — comme un fil tendu entre les deux extrémités d'un arc. La <em>ṣalāt</em> rituelle est l'inscription corporelle de ce fil dans le temps.",
        "forms": [
            {"ar": "صَلَّى", "tr": "ṣallā", "fr": "prier ; (Dieu :) bénir, orienter Sa face avec amour", "form": "II", "type": "verbe"},
            {"ar": "الصَّلَاة", "tr": "aṣ-ṣalāt", "fr": "la prière rituelle ; la bénédiction divine", "type": "nom d'action"},
            {"ar": "المُصَلِّي", "tr": "al-muṣallī", "fr": "le priant", "type": "participe actif"},
            {"ar": "المُصَلَّى", "tr": "al-muṣallā", "fr": "le lieu de prière", "type": "nom de lieu"},
            {"ar": "الصَّلَوَات", "tr": "aṣ-ṣalawāt", "fr": "les prières (rituelles ; ou : les synagogues/lieux de culte)", "type": "pluriel"}
        ],
        "quran": [
            {"ref": "33, 43", "ar": "هُوَ ٱلَّذِى يُصَلِّى عَلَيْكُمْ وَمَلَٰٓئِكَتُهُۥ لِيُخْرِجَكُم مِّنَ ٱلظُّلُمَٰتِ إِلَى ٱلنُّورِ", "fr": "C'est Lui qui prie sur vous (vous bénit, tourne Sa face vers vous), avec Ses anges, pour vous faire sortir des ténèbres vers la lumière."},
            {"ref": "29, 45", "ar": "إِنَّ ٱلصَّلَوٰةَ تَنْهَىٰ عَنِ ٱلْفَحْشَآءِ وَٱلْمُنكَرِ", "fr": "Certes la prière préserve de l'indécence et du blâmable."}
        ],
        "dict_links": ["salat"],
        "nom_links": [],
        "meditation": "Quand je prie, est-ce que je tends un fil — ou est-ce que je m'aperçois qu'il était déjà tendu vers moi ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "kh-l-ṣ",
        "letters": ["خ","ل","ص"],
        "root_ar": "خ ل ص",
        "root_tr": "kh-l-ṣ",
        "core_ar": "الإِخْلَاص",
        "core_fr": "La sincérité — ce qui ne se mélange à rien",
        "field": "<em>Khalaṣa</em> : être pur, sans mélange, dégagé. <em>Ikhlāṣ</em> (sourate 112) est l'acte de <em>dépurer</em> son intention de tout ce qui n'est pas Lui — non pas \"être sincère\" au sens psychologique (ne pas mentir), mais <em>ne plus laisser rien d'autre coexister</em> avec l'intention dirigée vers Dieu. Le métal pur (<em>khāliṣ</em>) ne contient plus de scories : tel doit être le cœur.",
        "glose_gloton": "Gloton rapproche <em>khalaṣa</em> de <em>khalāṣ</em> (le salut, le dégagement) : être sincère, c'est se <em>dégager</em>. Tant que mon adoration est mélangée — un peu pour Lui, un peu pour mon image, un peu pour la récompense — elle reste enchaînée. L'<em>ikhlāṣ</em> est la libération par épuration. Et la sourate 112 s'appelle <em>al-Ikhlāṣ</em> non parce qu'elle parle de sincérité, mais parce que celui qui la prend au sérieux ne peut plus rien mélanger à son <em>tawḥīd</em>.",
        "forms": [
            {"ar": "خَلَصَ", "tr": "khalaṣa", "fr": "être pur, être dégagé, parvenir indemne", "form": "I", "type": "verbe"},
            {"ar": "خَلَّصَ", "tr": "khallaṣa", "fr": "purifier, sauver, dégager", "form": "II", "type": "verbe causatif"},
            {"ar": "أَخْلَصَ", "tr": "akhlaṣa", "fr": "rendre exclusivement sincère (envers Dieu)", "form": "IV", "type": "verbe"},
            {"ar": "اِسْتَخْلَصَ", "tr": "istakhlaṣa", "fr": "élire, se choisir exclusivement", "form": "X", "type": "verbe"},
            {"ar": "الإِخْلَاص", "tr": "al-ikhlāṣ", "fr": "la sincérité exclusive, l'épuration de l'intention", "type": "nom d'action"},
            {"ar": "المُخْلِص", "tr": "al-mukhliṣ", "fr": "celui qui rend sincère son adoration", "type": "participe actif"},
            {"ar": "المُخْلَص", "tr": "al-mukhlaṣ", "fr": "celui que Dieu a rendu pur, l'élu", "type": "participe passif"},
            {"ar": "خَالِص", "tr": "khāliṣ", "fr": "pur, sans mélange", "type": "nom de qualité"}
        ],
        "quran": [
            {"ref": "39, 3", "ar": "أَلَا لِلَّهِ ٱلدِّينُ ٱلْخَالِصُ", "fr": "N'est-ce pas à Dieu qu'appartient la religion pure ?"},
            {"ref": "98, 5", "ar": "وَمَآ أُمِرُوٓا۟ إِلَّا لِيَعْبُدُوا۟ ٱللَّهَ مُخْلِصِينَ لَهُ ٱلدِّينَ", "fr": "Et il ne leur a été ordonné que d'adorer Dieu, Lui rendant la religion exclusivement pure."}
        ],
        "dict_links": ["ikhlas"],
        "nom_links": [],
        "meditation": "À quoi d'autre, en cet instant, est mélangée mon intention de Le chercher ?"
    },
]


def main():
    if not os.path.exists(DATA):
        print(f"ERREUR : {DATA} introuvable", file=sys.stderr)
        sys.exit(1)

    with open(DATA, encoding="utf-8") as f:
        data = json.load(f)

    existing_ids = {r["id"] for r in data["racines"]}
    duplicates = [r["id"] for r in NEW_RACINES if r["id"] in existing_ids]
    if duplicates:
        print(f"ERREUR : IDs déjà présents : {duplicates}", file=sys.stderr)
        sys.exit(1)

    required = {"id","letters","root_ar","root_tr","core_ar","core_fr",
                "field","glose_gloton","forms","quran","dict_links",
                "nom_links","meditation"}
    for r in NEW_RACINES:
        missing = required - set(r.keys())
        if missing:
            print(f"ERREUR : racine {r.get('id','?')} : champs manquants {missing}", file=sys.stderr)
            sys.exit(1)
        if len(r["letters"]) != 3:
            print(f"ERREUR : racine {r['id']} : letters doit en avoir 3", file=sys.stderr)
            sys.exit(1)

    shutil.copy(DATA, BAK)
    print(f"Sauvegarde : {BAK}")

    data["racines"].extend(NEW_RACINES)

    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✓ {len(NEW_RACINES)} racines ajoutées.")
    print(f"  Total : {len(data['racines'])} racines.")

    # Met à jour le compteur dans l'HTML
    if os.path.exists(HTML):
        with open(HTML, encoding="utf-8") as f:
            html = f.read()
        new_count = len(data["racines"])
        old = "<strong>15 racines actuellement</strong>"
        new = f"<strong>{new_count} racines actuellement</strong>"
        if old in html:
            html = html.replace(old, new)
            with open(HTML, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"✓ Compteur HTML mis à jour : {new_count}")
        else:
            print(f"  ⚠ Compteur HTML non trouvé (déjà modifié ?) — à vérifier manuellement.")


if __name__ == "__main__":
    main()
