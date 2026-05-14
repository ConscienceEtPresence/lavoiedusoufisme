#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Phase 2 — Lot 4 : royaute, parole, mouvement, eschatologie (13 racines).
Cloture la liste suggeree par la Phase 2.

Racines : k-t-b, m-l-k, r-b-b, w-l-y, b-y-n, q-d-r, kh-y-r,
          kh-l-d, j-n-n, n-z-l, ʿ-r-j, q-w-l, s-ʾ-l.
"""

import json, os, shutil, sys, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "racines.json")
BAK  = DATA + ".before_phase2_lot4"
HTML = os.path.join(ROOT, "pages", "racines", "index.html")


NEW_RACINES = [
    # -----------------------------------------------------------------
    {
        "id": "k-t-b",
        "letters": ["ك","ت","ب"],
        "root_ar": "ك ت ب",
        "root_tr": "k-t-b",
        "core_ar": "الكِتَاب",
        "core_fr": "L'écriture — ce qui est tracé, ordonné, prescrit",
        "field": "<em>Kataba</em> : écrire, tracer, prescrire. La racine porte ensemble trois nappes : <em>l'acte d'écrire</em> (kitāba), <em>le livre</em> (kitāb), et <em>la prescription</em> (kutiba ʿalaykum — \"il vous est prescrit\", 2,183). Écrire, dans la culture coranique, n'est pas seulement consigner — c'est <em>inscrire dans le réel</em>, fixer un destin. Tout est <em>déjà écrit</em> dans le <em>Livre</em> (al-Kitāb al-mubīn).",
        "glose_gloton": "Gloton souligne le réseau lexical : <em>kitāb</em> désigne le Coran, mais aussi le destin (<em>kitāb maktūb</em>, livre écrit) et les écritures antérieures (<em>ahl al-kitāb</em>, les Gens du Livre — juifs et chrétiens). La racine pose une métaphysique : <em>écrire, c'est faire être</em>. Et la révélation est l'inscription du divin dans la langue humaine — l'écriture qui transmet l'Écriture.",
        "forms": [
            {"ar": "كَتَبَ", "tr": "kataba", "fr": "écrire, prescrire", "form": "I", "type": "verbe"},
            {"ar": "اِكْتَتَبَ", "tr": "iktataba", "fr": "se faire écrire, transcrire", "form": "VIII", "type": "verbe"},
            {"ar": "الكِتَاب", "tr": "al-Kitāb", "fr": "le Livre (le Coran ; l'écriture)", "type": "nom"},
            {"ar": "الكَاتِب", "tr": "al-kātib", "fr": "le scribe", "type": "participe actif"},
            {"ar": "المَكْتُوب", "tr": "al-maktūb", "fr": "ce qui est écrit, le destin", "type": "participe passif"},
            {"ar": "الكِتَابَة", "tr": "al-kitāba", "fr": "l'écriture (acte)", "type": "nom d'action"},
            {"ar": "الكُتُب", "tr": "al-kutub", "fr": "les Livres (révélations antérieures)", "type": "pluriel"}
        ],
        "quran": [
            {"ref": "2, 2", "ar": "ذَٰلِكَ ٱلْكِتَٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ", "fr": "Voici le Livre — nul doute en lui — guidance pour les vigilants."},
            {"ref": "2, 183", "ar": "كُتِبَ عَلَيْكُمُ ٱلصِّيَامُ", "fr": "Il vous a été prescrit (écrit) de jeûner."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Quelle ligne, en moi, est en train d'être <em>écrite</em> aujourd'hui — par mes choix ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "m-l-k",
        "letters": ["م","ل","ك"],
        "root_ar": "م ل ك",
        "root_tr": "m-l-k",
        "core_ar": "المُلْك",
        "core_fr": "La royauté — la maîtrise possessive",
        "field": "<em>Malaka</em> : posséder, régner. La racine porte trois mots-clés : <em>malik</em> (le roi qui règne), <em>mālik</em> (le maître qui possède), <em>mulk</em> (la royauté, la souveraineté). Le Coran utilise les deux variantes pour Dieu : <em>al-Malik</em> (n°4, le Roi régnant) et <em>Mālik al-Mulk</em> (n°85, le Possesseur de la souveraineté). La fātiḥa dit <em>Mālik yawm ad-dīn</em> — Maître du jour du jugement.",
        "glose_gloton": "Gloton distingue : <em>malik</em> est qualité dynamique (Celui qui gouverne en acte), <em>mālik</em> est qualité statique (Celui qui détient le titre). Ensemble, ils disent : Dieu n'est pas seulement Celui qui a le droit — Il est aussi Celui qui exerce. La racine est intéressante car elle s'applique aussi aux <em>anges</em> (<em>malāʾika</em>, étymologiquement \"les envoyés\" mais souvent rapproché de <em>malak</em>) : ceux qui appartiennent au Roi.",
        "forms": [
            {"ar": "مَلَكَ", "tr": "malaka", "fr": "posséder, dominer", "form": "I", "type": "verbe"},
            {"ar": "مَلَّكَ", "tr": "mallaka", "fr": "donner en possession", "form": "II", "type": "verbe causatif"},
            {"ar": "تَمَلَّكَ", "tr": "tamallaka", "fr": "s'approprier", "form": "V", "type": "verbe réflexif"},
            {"ar": "المُلْك", "tr": "al-mulk", "fr": "la royauté, la souveraineté", "type": "nom"},
            {"ar": "المَلِك", "tr": "al-Malik", "fr": "le Roi (Nom divin)", "type": "nom"},
            {"ar": "المَالِك", "tr": "al-Mālik", "fr": "le Maître, le Possesseur", "type": "participe actif"},
            {"ar": "المَلَكُوت", "tr": "al-malakūt", "fr": "le royaume, la dimension royale du réel", "type": "nom abstrait"},
            {"ar": "المَلَك", "tr": "al-malak", "fr": "l'ange (le messager du Roi)", "type": "nom"}
        ],
        "quran": [
            {"ref": "1, 4", "ar": "مَٰلِكِ يَوْمِ ٱلدِّينِ", "fr": "Maître du jour du jugement."},
            {"ref": "67, 1", "ar": "تَبَارَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ", "fr": "Béni soit Celui dans la main de qui est la royauté — Il est puissant sur toute chose."}
        ],
        "dict_links": [],
        "nom_links": [4, 85],
        "meditation": "Sur quoi est-ce que je crois <em>régner</em> dans ma vie — qui ne m'appartient pourtant pas ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "r-b-b",
        "letters": ["ر","ب","ب"],
        "root_ar": "ر ب ب",
        "root_tr": "r-b-b",
        "core_ar": "الرَّبّ",
        "core_fr": "Le Seigneur qui éduque et fait croître",
        "field": "<em>Rabb</em> n'est pas un simple synonyme de \"seigneur\". La racine évoque <em>celui qui éduque, qui fait croître, qui prend soin du développement</em> — d'où <em>rabba</em> (éduquer un enfant), <em>tarbiya</em> (éducation, terme central en pédagogie islamique). Dieu est <em>al-Rabb</em>, non comme un monarque distant, mais comme <em>Celui qui fait croître chaque être vers son achèvement</em>. <em>Rabbu l-ʿālamīn</em> : le Seigneur qui éduque tous les mondes.",
        "glose_gloton": "Gloton insiste : <em>Rabb</em> est le nom le plus relationnel de Dieu. Là où <em>Allāh</em> dit Sa réalité absolue, <em>Rabb</em> dit Sa relation pédagogique avec chacun. \"Mon Rabb\" (<em>rabbī</em>) est l'expression intime — comme un dialogue. Et toute la <em>tarbiya</em> soufie est une participation à l'œuvre éducative du <em>Rabb</em> dans le disciple.",
        "forms": [
            {"ar": "رَبَّ", "tr": "rabba", "fr": "élever, éduquer, faire grandir", "form": "I", "type": "verbe"},
            {"ar": "رَبَّى", "tr": "rabbā", "fr": "éduquer (forme moderne)", "form": "II", "type": "verbe"},
            {"ar": "تَرَبَّى", "tr": "tarabbā", "fr": "être éduqué, grandir", "form": "V", "type": "verbe réflexif"},
            {"ar": "الرَّبّ", "tr": "ar-Rabb", "fr": "le Seigneur qui éduque", "type": "nom de qualité"},
            {"ar": "التَّرْبِيَة", "tr": "at-tarbiya", "fr": "l'éducation, la formation", "type": "nom d'action"},
            {"ar": "الرَّبَّانِيّ", "tr": "ar-rabbāniyy", "fr": "le maître spirituel (qui éduque par Dieu)", "type": "nom de qualité"},
            {"ar": "الرُّبُوبِيَّة", "tr": "ar-rubūbiyya", "fr": "la Seigneurie (Dieu comme Rabb)", "type": "nom abstrait"}
        ],
        "quran": [
            {"ref": "1, 2", "ar": "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", "fr": "Louange à Dieu, Seigneur (éducateur) des mondes."},
            {"ref": "17, 24", "ar": "وَقُل رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًا", "fr": "Et dis : Mon Seigneur, fais-leur miséricorde, comme ils m'ont élevé tout petit."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "En quoi suis-je éduqué, en ce moment même, par Celui qui me fait grandir sans que je le voie ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "w-l-y",
        "letters": ["و","ل","ي"],
        "root_ar": "و ل ي",
        "root_tr": "w-l-y",
        "core_ar": "الوَلَايَة",
        "core_fr": "La proximité-protection — sainteté et alliance",
        "field": "<em>Waliya</em> : être proche, être lié par une alliance, prendre sous sa protection. La racine est l'une des plus denses du Coran. <em>Walī</em> (pl. <em>awliyāʾ</em>) signifie ami intime, allié, protecteur, et chez les soufis <em>saint</em> (proche de Dieu). <em>Walāya</em> est la qualité du <em>walī</em> : sainteté comme proximité. Dieu est <em>al-Walī</em> (n°56) — le Très-Proche-protecteur.",
        "glose_gloton": "Gloton montre la dialectique fondamentale : <em>Allāhu waliyyu l-ladhīna āmanū</em> (2,257 — \"Dieu est le Walī de ceux qui croient\"). La proximité est réciproque : Il est leur Walī parce qu'eux le sont devenus. La sainteté soufie (<em>walāya</em>) n'est pas un état acquis par l'homme, c'est <em>l'effet</em> de la <em>walāya</em> divine sur lui. Le saint (<em>walī</em>) est celui que Dieu a pris pour proche.",
        "forms": [
            {"ar": "وَلِيَ", "tr": "waliya", "fr": "être proche, gouverner, prendre soin", "form": "I", "type": "verbe"},
            {"ar": "وَالَى", "tr": "wālā", "fr": "s'allier, se faire proche", "form": "III", "type": "verbe"},
            {"ar": "تَوَلَّى", "tr": "tawallā", "fr": "se charger de ; se détourner (selon contexte)", "form": "V", "type": "verbe réflexif"},
            {"ar": "الوَلِيّ", "tr": "al-Walī", "fr": "le Proche, l'Allié, le Saint", "type": "nom de qualité"},
            {"ar": "الأَوْلِيَاء", "tr": "al-awliyāʾ", "fr": "les saints, les proches de Dieu", "type": "pluriel"},
            {"ar": "الوَلَايَة", "tr": "al-walāya", "fr": "la sainteté, la proximité (avec Dieu)", "type": "nom abstrait"},
            {"ar": "المَوْلَى", "tr": "al-Mawlā", "fr": "le Maître, le Protecteur, l'Ami suprême", "type": "nom"}
        ],
        "quran": [
            {"ref": "2, 257", "ar": "ٱللَّهُ وَلِىُّ ٱلَّذِينَ ءَامَنُوا۟ يُخْرِجُهُم مِّنَ ٱلظُّلُمَٰتِ إِلَى ٱلنُّورِ", "fr": "Dieu est le Walī (Proche-protecteur) de ceux qui croient — Il les fait sortir des ténèbres vers la lumière."},
            {"ref": "10, 62", "ar": "أَلَآ إِنَّ أَوْلِيَآءَ ٱللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ", "fr": "Les awliyāʾ (proches) de Dieu — nulle crainte sur eux, ni tristesse."}
        ],
        "dict_links": [],
        "nom_links": [56],
        "meditation": "Est-ce que je laisse Celui qui veut être proche <em>se faire proche</em> de moi aujourd'hui ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "b-y-n",
        "letters": ["ب","ي","ن"],
        "root_ar": "ب ي ن",
        "root_tr": "b-y-n",
        "core_ar": "البَيَان",
        "core_fr": "L'exposition claire — ce qui sépare et fait voir",
        "field": "<em>Bāna</em> : apparaître clairement, être manifeste. La racine porte une double tension : <em>bayna</em> (entre, l'espace qui sépare) et <em>bayān</em> (l'exposition qui rend clair). Pour que quelque chose <em>apparaisse</em>, il faut qu'un <em>écart</em> se creuse — la clarté est un effet de la distinction. <em>al-Qurʾān al-mubīn</em> : le Coran clair, qui sépare le vrai du faux. Et <em>al-Bayyina</em> est <em>la preuve évidente</em>.",
        "glose_gloton": "Gloton souligne : la <em>bayān</em> est une catégorie esthétique et théologique. C'est <em>la capacité du Coran à se rendre clair par sa propre structure</em>. Le verset 55,4 (\"Il lui a enseigné l'exposition claire\") fait de la <em>bayān</em> un don divin à l'homme : nous sommes l'animal capable de <em>rendre clair</em>. La rhétorique arabe a fait de <em>ʿilm al-bayān</em> tout un art.",
        "forms": [
            {"ar": "بَانَ", "tr": "bāna", "fr": "apparaître clairement", "form": "I", "type": "verbe"},
            {"ar": "بَيَّنَ", "tr": "bayyana", "fr": "rendre clair, exposer", "form": "II", "type": "verbe causatif"},
            {"ar": "تَبَيَّنَ", "tr": "tabayyana", "fr": "devenir clair, se manifester", "form": "V", "type": "verbe réflexif"},
            {"ar": "اِسْتَبَانَ", "tr": "istabāna", "fr": "s'éclaircir, devenir évident", "form": "X", "type": "verbe"},
            {"ar": "البَيَان", "tr": "al-bayān", "fr": "l'exposition claire, l'éloquence", "type": "nom d'action"},
            {"ar": "المُبِين", "tr": "al-mubīn", "fr": "ce qui est clair, manifeste", "type": "participe actif"},
            {"ar": "البَيِّنَة", "tr": "al-bayyina", "fr": "la preuve évidente", "type": "nom"},
            {"ar": "بَيْن", "tr": "bayna", "fr": "entre (préposition de séparation)", "type": "préposition"}
        ],
        "quran": [
            {"ref": "55, 3-4", "ar": "خَلَقَ ٱلْإِنسَٰنَ ۝ عَلَّمَهُ ٱلْبَيَانَ", "fr": "Il a créé l'homme — Il lui a enseigné l'exposition claire."},
            {"ref": "2, 256", "ar": "قَد تَّبَيَّنَ ٱلرُّشْدُ مِنَ ٱلْغَىِّ", "fr": "La droiture s'est distinguée clairement de l'égarement."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Qu'est-ce qui demande, en moi, à devenir <em>clair</em> aujourd'hui — fût-ce au prix d'une séparation ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "q-d-r",
        "letters": ["ق","د","ر"],
        "root_ar": "ق د ر",
        "root_tr": "q-d-r",
        "core_ar": "القَدَر",
        "core_fr": "La mesure — le décret, la juste portion",
        "field": "<em>Qadara</em> : mesurer, fixer, décréter. La racine porte deux nappes liées : <em>qudra</em> (la puissance, capacité d'agir) et <em>qadar</em> (la mesure, le décret divin). Tout ce qui est, est <em>mesuré</em> — créé selon une juste portion : <em>innā kulla shayʾin khalaqnāhu bi-qadar</em> (54,49 — \"Nous avons créé toute chose selon une mesure\"). Le \"destin\" coranique n'est donc pas une fatalité aveugle — c'est <em>la mesure juste</em> de chaque chose.",
        "glose_gloton": "Gloton dissipe le malentendu fataliste : <em>qadar</em> n'est pas \"ce qui doit arriver\", c'est <em>la mesure</em> selon laquelle chaque être est créé. Et <em>qudra</em> n'est pas une puissance brute — c'est la <em>capacité d'établir la juste mesure</em>. <em>Al-Qādir</em> (Nom n°70) est donc Celui qui sait exactement ce qu'il faut, ni plus ni moins. La <em>laylat al-qadr</em> (97,1) est la \"nuit du décret\", où chaque destin est ajusté pour l'année.",
        "forms": [
            {"ar": "قَدَرَ", "tr": "qadara", "fr": "mesurer, fixer, pouvoir", "form": "I", "type": "verbe"},
            {"ar": "قَدَّرَ", "tr": "qaddara", "fr": "décréter, prédéterminer", "form": "II", "type": "verbe causatif"},
            {"ar": "اِقْتَدَرَ", "tr": "iqtadara", "fr": "être puissant, avoir capacité", "form": "VIII", "type": "verbe"},
            {"ar": "القَدَر", "tr": "al-qadar", "fr": "le décret, la mesure divine", "type": "nom"},
            {"ar": "القُدْرَة", "tr": "al-qudra", "fr": "la puissance, la capacité", "type": "nom abstrait"},
            {"ar": "القَدِير", "tr": "al-Qadīr", "fr": "le Tout-Puissant (intensif)", "type": "nom intensif"},
            {"ar": "القَادِر", "tr": "al-Qādir", "fr": "le Puissant (capable)", "type": "participe actif"},
            {"ar": "المِقْدَار", "tr": "al-miqdār", "fr": "la mesure, la quantité", "type": "nom concret"}
        ],
        "quran": [
            {"ref": "54, 49", "ar": "إِنَّا كُلَّ شَىْءٍ خَلَقْنَٰهُ بِقَدَرٍ", "fr": "Nous avons créé toute chose selon une mesure."},
            {"ref": "97, 1", "ar": "إِنَّآ أَنزَلْنَٰهُ فِى لَيْلَةِ ٱلْقَدْرِ", "fr": "Nous l'avons fait descendre dans la Nuit du Décret."}
        ],
        "dict_links": [],
        "nom_links": [70],
        "meditation": "Et si ce qui m'arrive aujourd'hui n'était ni hasard ni punition — mais la <em>juste mesure</em> de cet instant ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "kh-y-r",
        "letters": ["خ","ي","ر"],
        "root_ar": "خ ي ر",
        "root_tr": "kh-y-r",
        "core_ar": "الخَيْر",
        "core_fr": "Le bien — et l'acte de choisir",
        "field": "<em>Khāra</em> : être bon ; <em>ikhtāra</em> : choisir, élire. Une seule racine pour <em>le bien</em> et <em>le choix</em> — comme si choisir, c'était <em>aller au bon</em>. <em>Khayr</em> est ce qui vaut, ce qui est désirable. Et la <em>khiyara</em> est l'élection (Dieu \"choisit\" — <em>ikhtāra</em> — Ses prophètes, 28,68). La <em>istikhāra</em> (prière de demande de discernement) est l'acte par lequel le croyant demande à Dieu de <em>faire pour lui le bon choix</em>.",
        "glose_gloton": "Gloton montre la délicatesse : choisir n'est pas seulement préférer — c'est <em>aller chercher le bien</em>. Le verbe contient l'<em>orientation morale</em> du choix. Et l'élection divine (Dieu <em>choisit</em> les prophètes) n'est pas un arbitraire : c'est la reconnaissance de ce qui est meilleur. Inversement, mal choisir, ce n'est pas se tromper de préférence — c'est manquer le bien.",
        "forms": [
            {"ar": "خَارَ", "tr": "khāra", "fr": "être bon", "form": "I", "type": "verbe d'état"},
            {"ar": "اِخْتَارَ", "tr": "ikhtāra", "fr": "choisir, élire", "form": "VIII", "type": "verbe réflexif"},
            {"ar": "اِسْتَخَارَ", "tr": "istakhāra", "fr": "demander à Dieu le meilleur choix", "form": "X", "type": "verbe"},
            {"ar": "الخَيْر", "tr": "al-khayr", "fr": "le bien, ce qui vaut", "type": "nom"},
            {"ar": "الخِيرَة", "tr": "al-khīra", "fr": "l'élection, le choix divin", "type": "nom"},
            {"ar": "الِاسْتِخَارَة", "tr": "al-istikhāra", "fr": "la prière de discernement", "type": "nom d'action"},
            {"ar": "خَيْرٌ مِّن", "tr": "khayrun min", "fr": "meilleur que", "type": "comparatif"},
            {"ar": "الأَخْيَار", "tr": "al-akhyār", "fr": "les meilleurs, les élus", "type": "pluriel"}
        ],
        "quran": [
            {"ref": "28, 68", "ar": "وَرَبُّكَ يَخْلُقُ مَا يَشَآءُ وَيَخْتَارُ ۗ مَا كَانَ لَهُمُ ٱلْخِيَرَةُ", "fr": "Et ton Seigneur crée ce qu'Il veut et choisit. Le choix ne leur appartient pas."},
            {"ref": "2, 216", "ar": "وَعَسَىٰٓ أَن تَكْرَهُوا۟ شَيْـًٔا وَهُوَ خَيْرٌ لَّكُمْ", "fr": "Il se peut que vous détestiez une chose qui est un bien pour vous."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Ce que je préfère — est-ce vraiment le <em>bien</em>, ou seulement ce qui me plaît ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "kh-l-d",
        "letters": ["خ","ل","د"],
        "root_ar": "خ ل د",
        "root_tr": "kh-l-d",
        "core_ar": "الخُلُود",
        "core_fr": "L'éternité — durer sans terme",
        "field": "<em>Khalada</em> : durer, demeurer sans fin. <em>Khulūd</em> est la durée éternelle — celle promise au Jardin (<em>jannāt al-khuld</em>, le Jardin de l'éternité, 25,15). Mais aussi celle, redoutable, du séjour dans le Feu pour qui s'y attache. La racine porte une asymétrie : ce qui est éternel l'est <em>parce que Dieu le veut tel</em> — l'éternité créée est suspendue à la Permanence divine (<em>al-Bāqī</em>, n°97).",
        "glose_gloton": "Gloton souligne que <em>khulūd</em> n'est pas la même éternité que celle de Dieu. Dieu est <em>al-Bāqī</em> (le Permanent par soi). Le créé devient <em>khālid</em> par décret. La nuance philosophique est importante : il y a une éternité <em>essentielle</em> (Dieu) et une éternité <em>donnée</em> (la créature ressuscitée). Toute la vie est l'apprentissage de cette différence.",
        "forms": [
            {"ar": "خَلَدَ", "tr": "khalada", "fr": "durer, demeurer", "form": "I", "type": "verbe"},
            {"ar": "أَخْلَدَ", "tr": "akhlada", "fr": "rendre éternel ; s'attacher (à la terre)", "form": "IV", "type": "verbe"},
            {"ar": "الخُلُود", "tr": "al-khulūd", "fr": "l'éternité, la durée perpétuelle", "type": "nom"},
            {"ar": "الخَالِد", "tr": "al-khālid", "fr": "l'éternel (créé)", "type": "participe actif"},
            {"ar": "خَالِدِينَ فِيهَا", "tr": "khālidīna fīhā", "fr": "y demeurant éternellement (formule coranique)", "type": "expression"}
        ],
        "quran": [
            {"ref": "25, 15", "ar": "قُلْ أَذَٰلِكَ خَيْرٌ أَمْ جَنَّةُ ٱلْخُلْدِ ٱلَّتِى وُعِدَ ٱلْمُتَّقُونَ", "fr": "Dis : Cela est-il meilleur, ou le Jardin de l'éternité promis aux vigilants ?"},
            {"ref": "11, 108", "ar": "خَٰلِدِينَ فِيهَا مَا دَامَتِ ٱلسَّمَٰوَٰتُ وَٱلْأَرْضُ", "fr": "Y demeurant éternellement, tant que durent les cieux et la terre."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Qu'est-ce qui, en moi, voudrait <em>durer toujours</em> — et qu'est-ce qui consent à passer ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "j-n-n",
        "letters": ["ج","ن","ن"],
        "root_ar": "ج ن ن",
        "root_tr": "j-n-n",
        "core_ar": "الجَنَّة",
        "core_fr": "Le jardin caché — couvrir, abriter, voiler",
        "field": "Splendeur de la racine : <em>janna</em> signifie <em>couvrir, voiler, abriter</em>. De là, en cascade : <em>jannā</em> (le jardin, parce que les frondaisons couvrent), <em>janīn</em> (l'embryon, caché dans le ventre), <em>jinn</em> (les djinns, êtres invisibles), <em>junūn</em> (la folie, l'esprit voilé). Tous ces mots disent <em>ce qui est tenu caché</em>. Le paradis (<em>al-Janna</em>) est ainsi nommé parce qu'il est <em>le jardin couvert</em> — et parce qu'il est, ici-bas, <em>caché</em> à nos sens.",
        "glose_gloton": "Gloton développe magnifiquement cette unité : le paradis, l'embryon, le jardin, l'invisible spirituel, la folie — tous sous une seule racine, qui dit <em>le tenu-caché</em>. Le jardin coranique n'est donc pas un \"au-delà\" abstrait : c'est <em>une autre épaisseur du même réel</em>, voilée seulement. \"Et précipitez-vous vers un jardin large comme les cieux et la terre\" (3,133) — il est déjà là, simplement couvert.",
        "forms": [
            {"ar": "جَنَّ", "tr": "janna", "fr": "couvrir, voiler, abriter", "form": "I", "type": "verbe"},
            {"ar": "أَجَنَّ", "tr": "ajanna", "fr": "rendre fou ; cacher", "form": "IV", "type": "verbe"},
            {"ar": "الجَنَّة", "tr": "al-janna", "fr": "le jardin, le paradis", "type": "nom"},
            {"ar": "الجَنَّات", "tr": "al-jannāt", "fr": "les jardins (souvent au pluriel pour le paradis)", "type": "pluriel"},
            {"ar": "الجَنِين", "tr": "al-janīn", "fr": "l'embryon, le fœtus", "type": "nom"},
            {"ar": "الجِنّ", "tr": "al-jinn", "fr": "les djinns, les êtres invisibles", "type": "nom collectif"},
            {"ar": "الجُنُون", "tr": "al-junūn", "fr": "la folie (l'esprit voilé)", "type": "nom"},
            {"ar": "المَجْنُون", "tr": "al-majnūn", "fr": "le fou (le \"djinné\")", "type": "participe passif"}
        ],
        "quran": [
            {"ref": "3, 133", "ar": "وَسَارِعُوٓا۟ إِلَىٰ مَغْفِرَةٍ مِّن رَّبِّكُمْ وَجَنَّةٍ عَرْضُهَا ٱلسَّمَٰوَٰتُ وَٱلْأَرْضُ", "fr": "Et hâtez-vous vers le pardon de votre Seigneur et un jardin large comme les cieux et la terre."},
            {"ref": "55, 46", "ar": "وَلِمَنْ خَافَ مَقَامَ رَبِّهِۦ جَنَّتَانِ", "fr": "Et pour qui a craint la station de son Seigneur, deux jardins."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Le Jardin est <em>couvert</em>, non absent — où, ici-bas, en perçois-je l'épaisseur cachée ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "n-z-l",
        "letters": ["ن","ز","ل"],
        "root_ar": "ن ز ل",
        "root_tr": "n-z-l",
        "core_ar": "النُّزُول",
        "core_fr": "La descente — venue d'en haut",
        "field": "<em>Nazala</em> : descendre. La racine est centrale dans la pensée coranique : la <em>révélation</em> est nommée <em>tanzīl</em> (descente) ou <em>nuzūl</em> — la Parole <em>descend</em> du Très-Haut sur le Prophète. <em>Manzil</em> est <em>le lieu où l'on descend</em>, l'étape, la station. La pluie aussi <em>descend</em> (<em>anzala l-māʾa</em>, fréquent). La métaphore est cohérente : tout don véritable vient <em>d'en haut</em>.",
        "glose_gloton": "Gloton insiste : le <em>tanzīl</em> (Coran qui descend) doit être pensé comme <em>processus continu</em>, non comme événement passé. Le Coran continue de \"descendre\" sur celui qui le lit avec foi — il s'adapte à l'état (<em>manzil</em>) du lecteur. Et chaque <em>manzil</em> spirituel est une \"station\" (proche de <em>maqām</em>) — un lieu d'arrêt sur la voie où une nouvelle parole peut descendre.",
        "forms": [
            {"ar": "نَزَلَ", "tr": "nazala", "fr": "descendre", "form": "I", "type": "verbe"},
            {"ar": "نَزَّلَ", "tr": "nazzala", "fr": "faire descendre par étapes", "form": "II", "type": "verbe causatif"},
            {"ar": "أَنْزَلَ", "tr": "anzala", "fr": "faire descendre (en bloc)", "form": "IV", "type": "verbe causatif"},
            {"ar": "تَنَزَّلَ", "tr": "tanazzala", "fr": "descendre progressivement", "form": "V", "type": "verbe"},
            {"ar": "النُّزُول", "tr": "an-nuzūl", "fr": "la descente", "type": "nom d'action"},
            {"ar": "التَّنْزِيل", "tr": "at-tanzīl", "fr": "la révélation (descente progressive)", "type": "nom d'action"},
            {"ar": "المَنْزِل", "tr": "al-manzil", "fr": "le lieu où l'on descend, l'étape, la maison", "type": "nom de lieu"},
            {"ar": "المُنَزَّل", "tr": "al-munazzal", "fr": "ce qui est fait descendre (la révélation)", "type": "participe passif"}
        ],
        "quran": [
            {"ref": "17, 105", "ar": "وَبِٱلْحَقِّ أَنزَلْنَٰهُ وَبِٱلْحَقِّ نَزَلَ", "fr": "C'est par le Vrai que Nous l'avons fait descendre, et par le Vrai qu'il est descendu."},
            {"ref": "97, 4", "ar": "تَنَزَّلُ ٱلْمَلَٰٓئِكَةُ وَٱلرُّوحُ فِيهَا", "fr": "Les anges et le Souffle y descendent."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Qu'est-ce qui voudrait <em>descendre</em> sur moi en cet instant, si je faisais silence ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ʿ-r-j",
        "letters": ["ع","ر","ج"],
        "root_ar": "ع ر ج",
        "root_tr": "ʿ-r-j",
        "core_ar": "المِعْرَاج",
        "core_fr": "L'ascension — monter par degrés",
        "field": "<em>ʿAraja</em> : monter, gravir, s'élever. Le terme <em>miʿrāj</em> désigne <em>l'échelle, le degré, la voie ascensionnelle</em> — et par excellence l'ascension nocturne du Prophète. Le couple <em>nuzūl / ʿurūj</em> (descente / montée) structure la cosmologie spirituelle coranique : la révélation descend, l'âme monte. <em>Maʿārij</em> (sourate 70) est le nom des <em>degrés de l'ascension</em>.",
        "glose_gloton": "Gloton fait remarquer : <em>ʿaraja</em> évoque une montée par <em>paliers</em>, non un envol direct. Toute la vie spirituelle est cette montée graduelle — sept cieux à traverser, sept stations à franchir. Le <em>miʿrāj</em> du Prophète est le modèle, mais aussi le possible offert à tout croyant : chaque acte sincère est une marche de l'échelle.",
        "forms": [
            {"ar": "عَرَجَ", "tr": "ʿaraja", "fr": "monter, gravir", "form": "I", "type": "verbe"},
            {"ar": "عَرَّجَ", "tr": "ʿarrajа", "fr": "faire monter, faire une halte", "form": "II", "type": "verbe"},
            {"ar": "المِعْرَاج", "tr": "al-Miʿrāj", "fr": "l'échelle d'ascension, l'ascension nocturne", "type": "nom"},
            {"ar": "المَعَارِج", "tr": "al-Maʿārij", "fr": "les degrés (titre de la sourate 70)", "type": "pluriel"},
            {"ar": "العُرُوج", "tr": "al-ʿurūj", "fr": "l'ascension", "type": "nom d'action"},
            {"ar": "العَارِج", "tr": "al-ʿārij", "fr": "celui qui monte", "type": "participe actif"}
        ],
        "quran": [
            {"ref": "70, 3-4", "ar": "مِّنَ ٱللَّهِ ذِى ٱلْمَعَارِجِ ۝ تَعْرُجُ ٱلْمَلَٰٓئِكَةُ وَٱلرُّوحُ إِلَيْهِ", "fr": "De Dieu, Maître des degrés. Les anges et le Souffle montent vers Lui."},
            {"ref": "17, 1", "ar": "سُبْحَٰنَ ٱلَّذِىٓ أَسْرَىٰ بِعَبْدِهِۦ لَيْلًا", "fr": "Gloire à Celui qui fit voyager Son serviteur de nuit. (verset du voyage nocturne / miʿrāj)"}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Quelle marche puis-je gravir aujourd'hui — petite, mais réelle ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "q-w-l",
        "letters": ["ق","و","ل"],
        "root_ar": "ق و ل",
        "root_tr": "q-w-l",
        "core_ar": "القَوْل",
        "core_fr": "La parole — dire, déclarer, faire être par la voix",
        "field": "<em>Qāla</em> : dire. Verbe omniprésent dans le Coran (<em>qāla, qālū, qul, qulnā…</em>). La racine porte la <em>parole comme acte</em> : dans la cosmologie coranique, Dieu crée en disant <em>kun</em> (\"Sois\") et <em>fa-yakūn</em> (\"et cela est\", 2,117 etc.). Le <em>qawl</em> divin est performatif — il ne décrit pas, il fait être. Le <em>qawl</em> humain est appelé à imiter, à sa mesure, cette dignité : <em>qawlan sadīdan</em> (\"une parole juste\", 33,70).",
        "glose_gloton": "Gloton souligne la responsabilité immense que la racine fait peser sur la parole humaine. Le verset 33,70 enjoint <em>qulū qawlan sadīdan</em> — \"dites une parole droite\". Le <em>qawl</em> n'est jamais innocent : c'est un acte créateur en petite échelle. La voie soufie travaille beaucoup la parole : silence (<em>ṣamt</em>), véracité (<em>ṣidq</em>), invocation (<em>dhikr</em>) — trois modulations d'un même <em>qawl</em> ajusté.",
        "forms": [
            {"ar": "قَالَ", "tr": "qāla", "fr": "dire", "form": "I", "type": "verbe"},
            {"ar": "تَقَوَّلَ", "tr": "taqawwala", "fr": "inventer des paroles, calomnier", "form": "V", "type": "verbe"},
            {"ar": "القَوْل", "tr": "al-qawl", "fr": "la parole, le dire", "type": "nom d'action"},
            {"ar": "القَائِل", "tr": "al-qāʾil", "fr": "celui qui dit, le locuteur", "type": "participe actif"},
            {"ar": "المَقُول", "tr": "al-maqūl", "fr": "ce qui est dit", "type": "participe passif"},
            {"ar": "المَقَال", "tr": "al-maqāl", "fr": "le propos, le discours", "type": "nom"},
            {"ar": "قُلْ", "tr": "qul", "fr": "Dis ! (impératif fréquent en ouverture de sourate)", "type": "impératif"}
        ],
        "quran": [
            {"ref": "33, 70", "ar": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱتَّقُوا۟ ٱللَّهَ وَقُولُوا۟ قَوْلًا سَدِيدًا", "fr": "Ô vous qui croyez, soyez vigilants envers Dieu, et dites une parole juste."},
            {"ref": "2, 117", "ar": "وَإِذَا قَضَىٰٓ أَمْرًا فَإِنَّمَا يَقُولُ لَهُۥ كُن فَيَكُونُ", "fr": "Lorsqu'Il décide une chose, Il lui dit simplement : Sois — et elle est."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Ma parole, ce matin, est-elle <em>sadīda</em> — droite, juste, efficace pour le bien ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "s-ʾ-l",
        "letters": ["س","ا","ل"],
        "root_ar": "س ء ل",
        "root_tr": "s-ʾ-l",
        "core_ar": "السُّؤَال",
        "core_fr": "La question — demander, mendier, interroger",
        "field": "<em>Saʾala</em> : demander. La racine couvre toute la gamme : <em>poser une question</em>, <em>solliciter</em>, <em>mendier</em>. Au Jour du Jugement, chacun sera <em>questionné</em> (<em>masʾūl</em>) — <em>la-tusʾalunna</em>, \"vous serez interrogés\" (16,93). Et la prière elle-même est un <em>suʾāl</em>, une demande, dont le Prophète disait : <em>la prière est la moelle de l'adoration</em>. Demander n'est pas faible — c'est la posture juste du créé devant le Créateur.",
        "glose_gloton": "Gloton montre : la pauvreté ontologique (<em>faqr</em>) du créé se traduit en posture par la <em>demande</em>. Le sage soufi est celui <em>qui demande sans cesse</em> — non par avidité, mais par conscience d'être radicalement dépendant. Et la <em>responsabilité</em> (<em>masʾūliyya</em>, mot moderne tiré de la même racine) est étymologiquement <em>la qualité d'avoir à répondre</em> de soi.",
        "forms": [
            {"ar": "سَأَلَ", "tr": "saʾala", "fr": "demander, interroger", "form": "I", "type": "verbe"},
            {"ar": "تَسَاءَلَ", "tr": "tasāʾala", "fr": "s'interroger mutuellement, se questionner", "form": "VI", "type": "verbe"},
            {"ar": "السُّؤَال", "tr": "as-suʾāl", "fr": "la question, la demande", "type": "nom d'action"},
            {"ar": "السَّائِل", "tr": "as-sāʾil", "fr": "celui qui demande, le mendiant", "type": "participe actif"},
            {"ar": "المَسْؤُول", "tr": "al-masʾūl", "fr": "celui à qui on demande compte, le responsable", "type": "participe passif"},
            {"ar": "المَسْأَلَة", "tr": "al-masʾala", "fr": "la question (de fiqh ou de doctrine)", "type": "nom"},
            {"ar": "المَسْؤُولِيَّة", "tr": "al-masʾūliyya", "fr": "la responsabilité (terme moderne)", "type": "nom abstrait"}
        ],
        "quran": [
            {"ref": "16, 93", "ar": "وَلَتُسْـَٔلُنَّ عَمَّا كُنتُمْ تَعْمَلُونَ", "fr": "Et vous serez assurément interrogés sur ce que vous faisiez."},
            {"ref": "2, 186", "ar": "وَإِذَا سَأَلَكَ عِبَادِى عَنِّى فَإِنِّى قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ ٱلدَّاعِ إِذَا دَعَانِ", "fr": "Et lorsque Mes serviteurs t'interrogent sur Moi — Je suis proche, Je réponds à l'appel de qui M'appelle."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Quelle question, en moi, demande à être posée — non à un autre, mais à Lui ?"
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
