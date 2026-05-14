#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Phase 2 — Lot 2 : anthropologie et noétique (12 racines).
D'après Maurice Gloton, *Approche du Coran par la grammaire et le lexique*.

Racines : ʿ-q-l, f-h-m, f-k-r, ʿ-r-f, ḥ-k-m, ʿ-d-l,
          z-k-y, t-q-y, kh-sh-y, ṣ-d-q, ʾ-d-b, kh-l-q.
"""

import json, os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "racines.json")
BAK  = DATA + ".before_phase2_lot2"
HTML = os.path.join(ROOT, "pages", "racines", "index.html")


NEW_RACINES = [
    # -----------------------------------------------------------------
    {
        "id": "ʿ-q-l",
        "letters": ["ع","ق","ل"],
        "root_ar": "ع ق ل",
        "root_tr": "ʿ-q-l",
        "core_ar": "العَقْل",
        "core_fr": "L'intelligence qui lie",
        "field": "<em>ʿAqala</em> signifie d'abord <em>entraver, attacher</em> — la corde qui lie le chameau s'appelle <em>ʿiqāl</em>. L'intelligence (<em>ʿaql</em>) est ainsi nommée parce qu'elle <em>retient</em> l'âme de se disperser, <em>lie</em> les phénomènes entre eux pour en faire un sens. Comprendre, c'est nouer. À l'opposé du grec <em>nous</em> (regard pur), <em>ʿaql</em> est tactile, fonctionnel : un nœud bien fait.",
        "glose_gloton": "Gloton insiste : le <em>ʿaql</em> coranique n'est pas la raison spéculative mais <em>la faculté de retenir le sens</em>. C'est pourquoi les versets répètent <em>la-ʿallakum taʿqilūn</em> (\"afin que vous reteniez/compreniez\") — il s'agit de <em>ne pas laisser s'échapper</em> le signe. L'opposé n'est pas l'irrationalité mais la dispersion.",
        "forms": [
            {"ar": "عَقَلَ", "tr": "ʿaqala", "fr": "entraver, retenir, comprendre", "form": "I", "type": "verbe"},
            {"ar": "تَعَقَّلَ", "tr": "taʿaqqala", "fr": "user de raison, raisonner", "form": "V", "type": "verbe réflexif"},
            {"ar": "العَقْل", "tr": "al-ʿaql", "fr": "l'intelligence, la raison liante", "type": "nom d'action"},
            {"ar": "العَاقِل", "tr": "al-ʿāqil", "fr": "l'intelligent, le doué de raison", "type": "participe actif"},
            {"ar": "المَعْقُول", "tr": "al-maʿqūl", "fr": "l'intelligible, ce qui peut être saisi", "type": "participe passif"},
            {"ar": "العِقَال", "tr": "al-ʿiqāl", "fr": "l'entrave, la corde qui lie le chameau", "type": "nom concret"}
        ],
        "quran": [
            {"ref": "2, 164", "ar": "لَءَايَٰتٍ لِّقَوْمٍ يَعْقِلُونَ", "fr": "Des signes pour des gens qui comprennent (qui lient le sens)."},
            {"ref": "67, 10", "ar": "لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِىٓ أَصْحَٰبِ ٱلسَّعِيرِ", "fr": "Si seulement nous avions entendu ou compris, nous ne serions pas parmi les habitants du Brasier."}
        ],
        "dict_links": ["aql"],
        "nom_links": [],
        "meditation": "Qu'est-ce que je laisse s'échapper aujourd'hui, faute d'avoir <em>noué</em> le sens ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "f-h-m",
        "letters": ["ف","ه","م"],
        "root_ar": "ف ه م",
        "root_tr": "f-h-m",
        "core_ar": "الفَهْم",
        "core_fr": "Comprendre — saisir le sens en profondeur",
        "field": "<em>Fahima</em> : comprendre, saisir intérieurement le sens. À la différence de <em>ʿaql</em> (lier les éléments) et de <em>fikr</em> (peser, examiner), <em>fahm</em> désigne la <em>pénétration</em> du sens — ce moment où le voile tombe et où l'on \"voit\" ce que l'on entendait sans entendre. Le Coran dit que Salomon \"a fait comprendre\" à Salomon ce que David ne saisissait pas (21,79).",
        "glose_gloton": "Pour Gloton, le <em>fahm</em> a une coloration spécifique dans la tradition spirituelle : il est cette <em>compréhension donnée</em>, qui n'est pas simplement le fruit de l'effort mais d'une grâce d'élucidation. Le sage demande <em>al-fahm fī kitābik</em> — \"la compréhension dans Ton Livre\" — comme on demande la lumière, non comme on programme un raisonnement.",
        "forms": [
            {"ar": "فَهِمَ", "tr": "fahima", "fr": "comprendre", "form": "I", "type": "verbe"},
            {"ar": "فَهَّمَ", "tr": "fahhama", "fr": "faire comprendre", "form": "II", "type": "verbe causatif"},
            {"ar": "تَفَهَّمَ", "tr": "tafahhama", "fr": "chercher à comprendre, étudier", "form": "V", "type": "verbe d'effort"},
            {"ar": "الفَهْم", "tr": "al-fahm", "fr": "la compréhension", "type": "nom d'action"},
            {"ar": "الفَهَامَة", "tr": "al-fahāma", "fr": "la pénétration d'esprit, la perspicacité", "type": "nom abstrait"},
            {"ar": "الفَهِيم", "tr": "al-fahīm", "fr": "celui qui comprend en profondeur", "type": "nom intensif"}
        ],
        "quran": [
            {"ref": "21, 79", "ar": "فَفَهَّمْنَٰهَا سُلَيْمَٰنَ ۚ وَكُلًّا ءَاتَيْنَا حُكْمًا وَعِلْمًا", "fr": "Nous fîmes comprendre [le jugement] à Salomon. À chacun Nous avons donné sagesse et savoir."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Qu'est-ce qui, lu cent fois, demande encore à m'être <em>donné</em> à comprendre ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "f-k-r",
        "letters": ["ف","ك","ر"],
        "root_ar": "ف ك ر",
        "root_tr": "f-k-r",
        "core_ar": "الفِكْر",
        "core_fr": "La pensée — peser, retourner, méditer",
        "field": "<em>Fakara</em> et la forme intensive <em>tafakkara</em> : <em>retourner la chose dans son esprit</em>, peser, considérer sous plusieurs angles. Le <em>fikr</em> n'est pas la pensée logique linéaire (qui relèverait du <em>ʿaql</em>) — c'est l'acte de <em>méditer</em>, de prendre un objet et de tourner autour comme on tourne autour d'un signe. Les versets clés : <em>afa-lā tatafakkarūn</em> (\"ne réfléchissez-vous donc pas ?\").",
        "glose_gloton": "Gloton montre que <em>tafakkur</em> est, dans la tradition soufie, une <em>discipline spirituelle</em> à part entière (l'<em>une des deux ailes</em> avec le <em>dhikr</em>, selon certains : le <em>dhikr</em> rappelle, le <em>fikr</em> creuse). On médite sur les signes (la création, le verset, l'événement) — non pour les expliquer, mais pour <em>en éprouver l'épaisseur</em>.",
        "forms": [
            {"ar": "فَكَرَ", "tr": "fakara", "fr": "penser à, considérer", "form": "I", "type": "verbe"},
            {"ar": "فَكَّرَ", "tr": "fakkara", "fr": "réfléchir, méditer attentivement", "form": "II", "type": "verbe intensif"},
            {"ar": "تَفَكَّرَ", "tr": "tafakkara", "fr": "se livrer à la méditation, retourner dans son esprit", "form": "V", "type": "verbe réflexif"},
            {"ar": "الفِكْر", "tr": "al-fikr", "fr": "la pensée, la méditation", "type": "nom d'action"},
            {"ar": "التَّفَكُّر", "tr": "at-tafakkur", "fr": "la méditation, l'examen prolongé", "type": "nom d'action"},
            {"ar": "الفِكْرَة", "tr": "al-fikra", "fr": "l'idée, la pensée particulière", "type": "nom"}
        ],
        "quran": [
            {"ref": "3, 191", "ar": "وَيَتَفَكَّرُونَ فِى خَلْقِ ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ", "fr": "Et ils méditent sur la création des cieux et de la terre."},
            {"ref": "59, 21", "ar": "وَتِلْكَ ٱلْأَمْثَٰلُ نَضْرِبُهَا لِلنَّاسِ لَعَلَّهُمْ يَتَفَكَّرُونَ", "fr": "Telles sont les paraboles que Nous proposons aux hommes, afin qu'ils méditent."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Quel signe d'aujourd'hui mérite que j'en fasse plusieurs fois le tour ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ʿ-r-f",
        "letters": ["ع","ر","ف"],
        "root_ar": "ع ر ف",
        "root_tr": "ʿ-r-f",
        "core_ar": "المَعْرِفَة",
        "core_fr": "Connaître par familiarité, par goût",
        "field": "<em>ʿArafa</em> diffère profondément de <em>ʿalima</em> : <em>ʿilm</em> est un savoir qui s'apprend, <em>maʿrifa</em> est une connaissance par <em>reconnaissance</em>, par familiarité acquise. On <em>connaît</em> un visage parce qu'on l'a déjà vu — la <em>maʿrifa</em> de Dieu est de cet ordre : non pas savoir des choses sur Lui, mais Le re-connaître quand Il se montre. <em>ʿArafāt</em> (le mont du pèlerinage) est étymologiquement le \"lieu où l'on (se) reconnaît\".",
        "glose_gloton": "Gloton insiste : la <em>maʿrifa</em> est l'aboutissement épistémique de la voie soufie. Quand al-Junayd dit \"je n'ai connu Dieu que par Dieu\" (<em>mā ʿaraftu Llāha illā bi-Llāh</em>), il ne contredit pas le savoir — il pointe vers une autre modalité : la connaissance comme <em>retour</em> à ce qu'on avait toujours déjà su, depuis l'alliance primordiale (<em>alastu bi-rabbikum</em>, 7,172).",
        "forms": [
            {"ar": "عَرَفَ", "tr": "ʿarafa", "fr": "connaître, reconnaître", "form": "I", "type": "verbe"},
            {"ar": "عَرَّفَ", "tr": "ʿarrafa", "fr": "faire connaître, présenter", "form": "II", "type": "verbe causatif"},
            {"ar": "تَعَارَفَ", "tr": "taʿārafa", "fr": "se connaître mutuellement", "form": "VI", "type": "verbe réciproque"},
            {"ar": "اِعْتَرَفَ", "tr": "iʿtarafa", "fr": "reconnaître, avouer", "form": "VIII", "type": "verbe"},
            {"ar": "المَعْرِفَة", "tr": "al-maʿrifa", "fr": "la connaissance par familiarité (gnose)", "type": "nom d'action"},
            {"ar": "العَارِف", "tr": "al-ʿārif", "fr": "le connaissant (terme soufi pour le gnostique)", "type": "participe actif"},
            {"ar": "العِرْفَان", "tr": "al-ʿirfān", "fr": "la gnose, la connaissance ésotérique", "type": "nom abstrait"},
            {"ar": "المَعْرُوف", "tr": "al-maʿrūf", "fr": "le connu (et donc : le bien connu, le convenable)", "type": "participe passif"},
            {"ar": "العُرْف", "tr": "al-ʿurf", "fr": "la coutume, ce qui est reconnu socialement", "type": "nom"}
        ],
        "quran": [
            {"ref": "49, 13", "ar": "وَجَعَلْنَٰكُمْ شُعُوبًا وَقَبَآئِلَ لِتَعَارَفُوٓا۟", "fr": "Et Nous vous avons faits peuples et tribus pour que vous vous connaissiez les uns les autres."},
            {"ref": "47, 6", "ar": "وَيُدْخِلُهُمُ ٱلْجَنَّةَ عَرَّفَهَا لَهُمْ", "fr": "Et Il les fera entrer au Jardin qu'Il leur aura fait connaître."}
        ],
        "dict_links": ["marifa", "irfan"],
        "nom_links": [],
        "meditation": "Ce que je crois découvrir aujourd'hui — n'est-ce pas plutôt quelque chose que je <em>re</em>connais ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ḥ-k-m",
        "letters": ["ح","ك","م"],
        "root_ar": "ح ك م",
        "root_tr": "ḥ-k-m",
        "core_ar": "الحِكْمَة",
        "core_fr": "La sagesse — juger juste, mettre chaque chose à sa place",
        "field": "La racine ḥ-k-m couvre : <em>juger</em> (<em>ḥakama</em>), <em>gouverner</em> (<em>ḥukm</em>), <em>être sage</em> (<em>ḥakīm</em>). Le sens premier est : <em>mettre un frein</em>, <em>tenir d'une main ferme</em> — le mors du cheval s'appelle <em>ḥakama</em>. De là : la sagesse est <em>la maîtrise qui met chaque chose à sa juste place</em>. Juger, gouverner, être sage : trois modalités d'un même art de la mesure.",
        "glose_gloton": "Gloton souligne que la <em>ḥikma</em> coranique n'est pas la <em>sophia</em> grecque (savoir contemplatif) mais une sagesse <em>opératoire</em> : <em>donner à chacun, à chaque chose, à chaque instant, ce qui lui convient</em>. C'est pourquoi Dieu est à la fois <em>al-Ḥakam</em> (le Juge, Nom n°29) et <em>al-Ḥakīm</em> (le Sage, Nom n°47) — la justice et la sagesse sont une seule maîtrise.",
        "forms": [
            {"ar": "حَكَمَ", "tr": "ḥakama", "fr": "juger, gouverner, décider", "form": "I", "type": "verbe"},
            {"ar": "أَحْكَمَ", "tr": "aḥkama", "fr": "rendre solide, bien faire, perfectionner", "form": "IV", "type": "verbe"},
            {"ar": "تَحَاكَمَ", "tr": "taḥākama", "fr": "porter un litige devant un juge", "form": "VI", "type": "verbe"},
            {"ar": "اِسْتَحْكَمَ", "tr": "istaḥkama", "fr": "se consolider, devenir ferme", "form": "X", "type": "verbe"},
            {"ar": "الحُكْم", "tr": "al-ḥukm", "fr": "le jugement, le gouvernement, la sentence", "type": "nom d'action"},
            {"ar": "الحِكْمَة", "tr": "al-ḥikma", "fr": "la sagesse", "type": "nom"},
            {"ar": "الحَكِيم", "tr": "al-Ḥakīm", "fr": "le Très-Sage", "type": "nom intensif"},
            {"ar": "الحَكَم", "tr": "al-Ḥakam", "fr": "l'Arbitre, le Juge", "type": "nom intensif"},
            {"ar": "المُحْكَم", "tr": "al-muḥkam", "fr": "le ferme, le clair (verset à sens univoque)", "type": "participe passif"}
        ],
        "quran": [
            {"ref": "2, 269", "ar": "يُؤْتِى ٱلْحِكْمَةَ مَن يَشَآءُ ۚ وَمَن يُؤْتَ ٱلْحِكْمَةَ فَقَدْ أُوتِىَ خَيْرًا كَثِيرًا", "fr": "Il donne la sagesse à qui Il veut, et celui à qui la sagesse est donnée a reçu un grand bien."},
            {"ref": "31, 12", "ar": "وَلَقَدْ ءَاتَيْنَا لُقْمَٰنَ ٱلْحِكْمَةَ أَنِ ٱشْكُرْ لِلَّهِ", "fr": "Nous avons donné à Luqmān la sagesse : Sois reconnaissant envers Dieu."}
        ],
        "dict_links": ["hikma"],
        "nom_links": [29, 47],
        "meditation": "Quelle chose, en cet instant, n'est pas à sa juste place — et que faudrait-il déplacer ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ʿ-d-l",
        "letters": ["ع","د","ل"],
        "root_ar": "ع د ل",
        "root_tr": "ʿ-d-l",
        "core_ar": "العَدْل",
        "core_fr": "La justice — l'équilibre, le poids égal",
        "field": "<em>ʿAdala</em> : être équitable, équilibré, droit. La racine évoque la <em>balance</em> dont les deux plateaux sont à niveau (<em>iʿtidāl</em>). À la différence de <em>qisṭ</em> (la part juste), <em>ʿadl</em> insiste sur l'<em>égalité de poids</em> — rien ne penche d'un côté ou de l'autre. La justice coranique est cosmologique avant d'être juridique : le ciel \"a été dressé selon une balance\" (55,7).",
        "glose_gloton": "Gloton montre que l'<em>iʿtidāl</em> (équilibre, position médiane) est un concept-clef de l'anthropologie coranique. L'homme est créé <em>fī aḥsani taqwīm</em> — \"selon le plus bel équilibre\" (95,4). Toute la voie est un retour à cet équilibre originel, qui est aussi la <em>droiture</em> (<em>istiqāma</em>). La justice extérieure découle de la justice intérieure : on est juste avec les autres si on est en équilibre avec soi.",
        "forms": [
            {"ar": "عَدَلَ", "tr": "ʿadala", "fr": "être juste, équilibrer", "form": "I", "type": "verbe"},
            {"ar": "عَادَلَ", "tr": "ʿādala", "fr": "égaler, mettre en balance", "form": "III", "type": "verbe"},
            {"ar": "اِعْتَدَلَ", "tr": "iʿtadala", "fr": "se tenir droit, atteindre l'équilibre", "form": "VIII", "type": "verbe réflexif"},
            {"ar": "العَدْل", "tr": "al-ʿadl", "fr": "la justice, l'équité, l'équilibre", "type": "nom"},
            {"ar": "العَادِل", "tr": "al-ʿādil", "fr": "le juste", "type": "participe actif"},
            {"ar": "العَدْل", "tr": "al-ʿAdl", "fr": "le Juste (Nom divin)", "type": "nom de qualité"},
            {"ar": "الِاعْتِدَال", "tr": "al-iʿtidāl", "fr": "l'équilibre, la position médiane", "type": "nom d'action"}
        ],
        "quran": [
            {"ref": "16, 90", "ar": "إِنَّ ٱللَّهَ يَأْمُرُ بِٱلْعَدْلِ وَٱلْإِحْسَٰنِ", "fr": "Certes Dieu commande la justice et l'excellence."},
            {"ref": "55, 7-9", "ar": "وَٱلسَّمَآءَ رَفَعَهَا وَوَضَعَ ٱلْمِيزَانَ ۝ أَلَّا تَطْغَوْا۟ فِى ٱلْمِيزَانِ", "fr": "Et le ciel, Il l'a élevé, et Il a posé la balance : afin que vous ne transgressiez pas dans la balance."}
        ],
        "dict_links": [],
        "nom_links": [30],
        "meditation": "Où est-ce que je penche aujourd'hui — et que faudrait-il pour revenir au milieu ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "z-k-y",
        "letters": ["ز","ك","و"],
        "root_ar": "ز ك و",
        "root_tr": "z-k-y",
        "core_ar": "التَّزْكِيَة",
        "core_fr": "Purifier en faisant croître",
        "field": "<em>Zakā</em> noue deux sens apparemment distincts : <em>croître, prospérer</em> (une plante <em>zakā</em> se développe) et <em>se purifier</em>. La beauté de la racine est dans cette unité : <em>purifier, c'est faire croître</em>. La <em>zakāt</em> (aumône légale) prélève une part du bien — non pour le diminuer, mais pour le faire prospérer. La <em>tazkiya</em> de l'âme est de même nature : on retranche pour que pousse.",
        "glose_gloton": "Gloton souligne l'inversion paradoxale : nous croyons que purifier diminue (qu'enlever du superflu appauvrit). La racine dit l'inverse : <em>ce qui n'est pas purifié n'est pas vivant</em>. C'est pourquoi <em>tazkiyat an-nafs</em> est la condition même de la <em>vie</em> de l'âme — et non un ascétisme stérile.",
        "forms": [
            {"ar": "زَكَا", "tr": "zakā", "fr": "croître, prospérer, être pur", "form": "I", "type": "verbe"},
            {"ar": "زَكَّى", "tr": "zakkā", "fr": "purifier, faire croître", "form": "II", "type": "verbe causatif"},
            {"ar": "تَزَكَّى", "tr": "tazakkā", "fr": "se purifier", "form": "V", "type": "verbe réflexif"},
            {"ar": "الزَّكَاة", "tr": "az-zakāt", "fr": "l'aumône légale (litt. : ce qui fait croître)", "type": "nom"},
            {"ar": "التَّزْكِيَة", "tr": "at-tazkiya", "fr": "la purification (de l'âme)", "type": "nom d'action"},
            {"ar": "الزَّكِيّ", "tr": "az-zakiyy", "fr": "le pur, le prospère", "type": "nom de qualité"}
        ],
        "quran": [
            {"ref": "91, 9-10", "ar": "قَدْ أَفْلَحَ مَن زَكَّىٰهَا ۝ وَقَدْ خَابَ مَن دَسَّىٰهَا", "fr": "Réussit celui qui la purifie (l'âme), perd celui qui l'enfouit."},
            {"ref": "62, 2", "ar": "وَيُزَكِّيهِمْ وَيُعَلِّمُهُمُ ٱلْكِتَٰبَ وَٱلْحِكْمَةَ", "fr": "Il les purifie et leur enseigne le Livre et la sagesse."}
        ],
        "dict_links": ["tazkiyat-an-nafs"],
        "nom_links": [],
        "meditation": "Qu'est-ce que je crois perdre en retranchant — alors que c'est ce qui ferait croître ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "t-q-y",
        "letters": ["و","ق","ي"],
        "root_ar": "و ق ي",
        "root_tr": "w-q-y → t-q-y",
        "core_ar": "التَّقْوَى",
        "core_fr": "Se préserver — la crainte qui protège",
        "field": "La racine première est <em>w-q-y</em> (préserver, protéger). De là <em>ittaqā</em> (forme VIII) : <em>se mettre à l'abri, prendre garde</em> — et <em>taqwā</em>, traduit faute de mieux par \"crainte de Dieu\" mais signifiant plus précisément <em>la conscience vigilante qui préserve</em>. Ce n'est pas la peur (<em>khawf</em>) ni la terreur (<em>khashya</em>) — c'est <em>la précaution amoureuse</em> de qui ne veut pas s'égarer.",
        "glose_gloton": "Gloton récuse vigoureusement \"crainte\" comme traduction unique : la <em>taqwā</em>, dit-il, est <em>une intelligence du danger</em> de se perdre. C'est la qualité de l'âme qui <em>se sait fragile</em> et qui, pour cette raison, marche avec soin. <em>Le plus noble d'entre vous est le plus muttaqī</em> (49,13) — non pas le plus craintif, mais le plus <em>conscient</em>, le plus <em>en garde</em>.",
        "forms": [
            {"ar": "وَقَى", "tr": "waqā", "fr": "préserver, protéger", "form": "I", "type": "verbe"},
            {"ar": "اِتَّقَى", "tr": "ittaqā", "fr": "se prémunir, prendre garde, craindre", "form": "VIII", "type": "verbe réflexif"},
            {"ar": "التَّقْوَى", "tr": "at-taqwā", "fr": "la conscience protectrice, la \"crainte\" de Dieu", "type": "nom d'action"},
            {"ar": "المُتَّقِي", "tr": "al-muttaqī", "fr": "celui qui se prémunit, le pieux vigilant", "type": "participe actif"},
            {"ar": "الوِقَايَة", "tr": "al-wiqāya", "fr": "la protection, le bouclier", "type": "nom"},
            {"ar": "تَقِيّ", "tr": "taqiyy", "fr": "celui qui est dans la taqwā", "type": "nom de qualité"}
        ],
        "quran": [
            {"ref": "49, 13", "ar": "إِنَّ أَكْرَمَكُمْ عِندَ ٱللَّهِ أَتْقَىٰكُمْ", "fr": "Certes, le plus noble d'entre vous auprès de Dieu est le plus muttaqī (le plus vigilant)."},
            {"ref": "2, 197", "ar": "وَتَزَوَّدُوا۟ فَإِنَّ خَيْرَ ٱلزَّادِ ٱلتَّقْوَىٰ", "fr": "Faites provision : la meilleure provision est la taqwā."}
        ],
        "dict_links": ["taqwa"],
        "nom_links": [],
        "meditation": "De quoi ai-je vraiment besoin de me préserver aujourd'hui — pas par peur, mais par soin de l'essentiel ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "kh-sh-y",
        "letters": ["خ","ش","ي"],
        "root_ar": "خ ش ي",
        "root_tr": "kh-sh-y",
        "core_ar": "الخَشْيَة",
        "core_fr": "La crainte révérencielle — trembler de proximité",
        "field": "<em>Khashiya</em> : éprouver une crainte qui n'est pas la peur, mais le <em>tremblement de qui se sait devant plus grand que soi</em>. À la différence de <em>khawf</em> (peur d'un mal qui pourrait survenir) et de <em>taqwā</em> (vigilance protectrice), <em>khashya</em> est purement révérencielle — elle naît de la <em>connaissance</em>. Aussi le Coran dit-il : <em>seuls craignent (yakhshā) Dieu, parmi Ses serviteurs, les savants</em> (35,28).",
        "glose_gloton": "Gloton rapproche <em>khashya</em> de l'awe biblique : ce n'est pas un sentiment qu'on s'impose, c'est un <em>retentissement</em>. Plus on connaît, plus on tremble — non parce qu'on a peur, mais parce qu'on perçoit la disproportion. La crainte révérencielle est <em>la signature de la connaissance vraie</em>. Sans elle, le savoir reste froid.",
        "forms": [
            {"ar": "خَشِيَ", "tr": "khashiya", "fr": "craindre avec révérence, redouter", "form": "I", "type": "verbe"},
            {"ar": "الخَشْيَة", "tr": "al-khashya", "fr": "la crainte révérencielle", "type": "nom d'action"},
            {"ar": "الخَاشِي", "tr": "al-khāshī", "fr": "celui qui craint avec révérence", "type": "participe actif"},
            {"ar": "خَاشِع", "tr": "khāshiʿ", "fr": "humble (proche, dérivé de la même nappe sémantique)", "type": "nom de qualité"}
        ],
        "quran": [
            {"ref": "35, 28", "ar": "إِنَّمَا يَخْشَى ٱللَّهَ مِنْ عِبَادِهِ ٱلْعُلَمَٰٓؤُا۟", "fr": "Seuls craignent Dieu, parmi Ses serviteurs, les savants."},
            {"ref": "59, 21", "ar": "لَوْ أَنزَلْنَا هَٰذَا ٱلْقُرْءَانَ عَلَىٰ جَبَلٍ لَّرَأَيْتَهُۥ خَٰشِعًا مُّتَصَدِّعًا مِّنْ خَشْيَةِ ٱللَّهِ", "fr": "Si Nous avions fait descendre ce Coran sur une montagne, tu l'aurais vue humble, se fendre par crainte de Dieu."}
        ],
        "dict_links": [],
        "nom_links": [],
        "meditation": "Y a-t-il en moi un savoir qui ne <em>tremble</em> plus — et que vaut-il alors ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ṣ-d-q",
        "letters": ["ص","د","ق"],
        "root_ar": "ص د ق",
        "root_tr": "ṣ-d-q",
        "core_ar": "الصِّدْق",
        "core_fr": "La véracité — l'accord du dit, du fait et de l'être",
        "field": "<em>Ṣadaqa</em> : dire vrai, être véridique. La racine ne se limite pas à la conformité de la parole au fait — elle exige <em>la conformité de la parole, de l'acte et de l'être</em>. Est <em>ṣiddīq</em> (\"très-véridique\", titre suprême après prophète) celui dont la vie atteste ce que dit la bouche. La même racine donne <em>ṣadaqa</em> (l'aumône volontaire) : le don atteste lui aussi la vérité du cœur.",
        "glose_gloton": "Gloton souligne le lien profond entre <em>ṣidq</em> (véracité) et <em>ṣadaqa</em> (aumône) : <em>donner</em>, c'est <em>prouver</em> la sincérité de la foi. Les mots seuls sont gratuits, le don coûte. C'est pourquoi <em>ṣadaqāt</em> et <em>ṣiddīqūn</em> partagent la racine : la vérité, dans le Coran, n'est pas une thèse — c'est une <em>incarnation</em>.",
        "forms": [
            {"ar": "صَدَقَ", "tr": "ṣadaqa", "fr": "dire vrai, être véridique", "form": "I", "type": "verbe"},
            {"ar": "صَدَّقَ", "tr": "ṣaddaqa", "fr": "ajouter foi à, confirmer", "form": "II", "type": "verbe causatif"},
            {"ar": "تَصَدَّقَ", "tr": "taṣaddaqa", "fr": "faire l'aumône", "form": "V", "type": "verbe réflexif"},
            {"ar": "الصِّدْق", "tr": "aṣ-ṣidq", "fr": "la véracité, la vérité incarnée", "type": "nom"},
            {"ar": "الصَّادِق", "tr": "aṣ-ṣādiq", "fr": "le véridique", "type": "participe actif"},
            {"ar": "الصِّدِّيق", "tr": "aṣ-ṣiddīq", "fr": "le très-véridique (rang spirituel)", "type": "nom intensif"},
            {"ar": "الصَّدَقَة", "tr": "aṣ-ṣadaqa", "fr": "l'aumône volontaire (preuve de sincérité)", "type": "nom concret"},
            {"ar": "الصَّدَاقَة", "tr": "aṣ-ṣadāqa", "fr": "l'amitié (fondée sur la véracité réciproque)", "type": "nom"}
        ],
        "quran": [
            {"ref": "19, 41", "ar": "وَٱذْكُرْ فِى ٱلْكِتَٰبِ إِبْرَٰهِيمَ ۚ إِنَّهُۥ كَانَ صِدِّيقًا نَّبِيًّا", "fr": "Et mentionne dans le Livre Abraham — il était très-véridique, prophète."},
            {"ref": "33, 23", "ar": "مِّنَ ٱلْمُؤْمِنِينَ رِجَالٌ صَدَقُوا۟ مَا عَٰهَدُوا۟ ٱللَّهَ عَلَيْهِ", "fr": "Parmi les croyants, il est des hommes qui ont rendu vrai (par leurs actes) ce qu'ils avaient promis à Dieu."}
        ],
        "dict_links": ["sidq"],
        "nom_links": [],
        "meditation": "Ce que je viens de dire — mon corps et mes actes le rendent-ils vrai ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "ʾ-d-b",
        "letters": ["ا","د","ب"],
        "root_ar": "ء د ب",
        "root_tr": "ʾ-d-b",
        "core_ar": "الأَدَب",
        "core_fr": "La courtoisie spirituelle — l'ajustement du geste au sacré",
        "field": "<em>Adab</em> n'a pas d'équivalent français satisfaisant. Ce n'est ni la politesse mondaine, ni la morale, ni la culture (bien que le mot moderne <em>adab</em> = littérature). C'est <em>l'ajustement intérieur et extérieur</em> à la situation, à la personne, au moment. La tradition soufie en a fait une discipline centrale : il y a un <em>adab</em> du disciple envers le maître, un <em>adab</em> de la prière, un <em>adab</em> du repas, un <em>adab</em> envers Dieu.",
        "glose_gloton": "Gloton montre que la racine est rare dans le Coran mais que le concept y est partout : <em>se tenir comme il convient</em> devant le sacré. Le Prophète disait : <em>addabanī rabbī fa-aḥsana taʾdībī</em> — \"mon Seigneur m'a éduqué (à l'adab) et a parfait mon éducation\". L'<em>adab</em> est l'accomplissement humain de la <em>taqwā</em> : la vigilance devient grâce du geste.",
        "forms": [
            {"ar": "أَدُبَ", "tr": "aduba", "fr": "être bien éduqué, courtois", "form": "I", "type": "verbe d'état"},
            {"ar": "أَدَّبَ", "tr": "addaba", "fr": "éduquer, former à l'adab", "form": "II", "type": "verbe causatif"},
            {"ar": "تَأَدَّبَ", "tr": "taʾaddaba", "fr": "se former, acquérir l'adab", "form": "V", "type": "verbe réflexif"},
            {"ar": "الأَدَب", "tr": "al-adab", "fr": "l'ajustement spirituel, la courtoisie sacrée", "type": "nom"},
            {"ar": "الأَدِيب", "tr": "al-adīb", "fr": "l'homme cultivé, l'homme d'adab", "type": "nom de qualité"},
            {"ar": "التَّأْدِيب", "tr": "at-taʾdīb", "fr": "l'éducation, la formation à l'adab", "type": "nom d'action"}
        ],
        "quran": [
            {"ref": "Hadith", "ar": "أَدَّبَنِي رَبِّي فَأَحْسَنَ تَأْدِيبِي", "fr": "Mon Seigneur m'a éduqué et a parfait mon éducation. (parole prophétique)"}
        ],
        "dict_links": ["adab"],
        "nom_links": [],
        "meditation": "Quel geste, ce matin, demande à être ajusté — non par règle, mais par égard ?"
    },
    # -----------------------------------------------------------------
    {
        "id": "kh-l-q",
        "letters": ["خ","ل","ق"],
        "root_ar": "خ ل ق",
        "root_tr": "kh-l-q",
        "core_ar": "الخَلْق",
        "core_fr": "Créer — et : le caractère, ce qui est créé en l'homme",
        "field": "Splendeur de la racine : un seul mot, <em>khalq</em>, signifie à la fois <em>la création</em> (l'univers comme œuvre) et <em>le caractère</em> (la disposition créée en l'homme). Et <em>khuluq</em>, dérivé direct, désigne <em>le naturel moral</em>. La parenté n'est pas fortuite : <em>mon caractère est ma part de création</em>, ce que Dieu a façonné en moi et que je dois à mon tour façonner. Le Prophète est loué pour son <em>khuluq ʿaẓīm</em> (68,4) — \"un caractère immense\".",
        "glose_gloton": "Gloton met en lumière cette unité <em>création / caractère</em> : pour la pensée coranique, l'éthique n'est pas surajoutée à la nature — elle <em>est</em> la nature accomplie. <em>Khalqī</em> (création) et <em>khuluqī</em> (caractère) ne sont qu'une seule racine vue de deux côtés. D'où la finesse du hadith : \"j'ai été envoyé pour parfaire les nobles caractères\" — parfaire le <em>khuluq</em> est parfaire le <em>khalq</em>.",
        "forms": [
            {"ar": "خَلَقَ", "tr": "khalaqa", "fr": "créer, façonner", "form": "I", "type": "verbe"},
            {"ar": "الخَلْق", "tr": "al-khalq", "fr": "la création, les créatures", "type": "nom d'action"},
            {"ar": "الخُلُق", "tr": "al-khuluq", "fr": "le caractère, le naturel moral", "type": "nom"},
            {"ar": "الأَخْلَاق", "tr": "al-akhlāq", "fr": "les caractères, la morale", "type": "pluriel"},
            {"ar": "الخَالِق", "tr": "al-Khāliq", "fr": "le Créateur", "type": "participe actif"},
            {"ar": "الخَلَّاق", "tr": "al-Khallāq", "fr": "le Créateur intense, le Façonneur sans cesse", "type": "nom intensif"},
            {"ar": "المَخْلُوق", "tr": "al-makhlūq", "fr": "la créature", "type": "participe passif"}
        ],
        "quran": [
            {"ref": "68, 4", "ar": "وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ", "fr": "Et certes, tu es d'un caractère immense."},
            {"ref": "23, 14", "ar": "فَتَبَارَكَ ٱللَّهُ أَحْسَنُ ٱلْخَٰلِقِينَ", "fr": "Béni soit Dieu, le meilleur des créateurs."}
        ],
        "dict_links": [],
        "nom_links": [12],
        "meditation": "Mon caractère est une part de la création — qu'est-ce que je peux y <em>poursuivre</em> de ce que Dieu y a commencé ?"
    },
]


def main():
    if not os.path.exists(DATA):
        print(f"ERREUR : {DATA} introuvable", file=sys.stderr); sys.exit(1)
    with open(DATA, encoding="utf-8") as f:
        data = json.load(f)
    existing = {r["id"] for r in data["racines"]}
    dups = [r["id"] for r in NEW_RACINES if r["id"] in existing]
    if dups:
        print(f"ERREUR : IDs déjà présents : {dups}", file=sys.stderr); sys.exit(1)
    required = {"id","letters","root_ar","root_tr","core_ar","core_fr","field","glose_gloton","forms","quran","dict_links","nom_links","meditation"}
    for r in NEW_RACINES:
        m = required - set(r.keys())
        if m: print(f"ERREUR : {r.get('id','?')} : manque {m}", file=sys.stderr); sys.exit(1)
        if len(r["letters"]) != 3:
            print(f"ERREUR : {r['id']} : letters doit en avoir 3", file=sys.stderr); sys.exit(1)
    shutil.copy(DATA, BAK)
    print(f"Sauvegarde : {BAK}")
    data["racines"].extend(NEW_RACINES)
    with open(DATA, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✓ {len(NEW_RACINES)} racines ajoutées.")
    print(f"  Total : {len(data['racines'])} racines.")
    if os.path.exists(HTML):
        with open(HTML, encoding="utf-8") as f: html = f.read()
        new_count = len(data["racines"])
        import re
        html2 = re.sub(r"<strong>\d+ racines actuellement</strong>",
                       f"<strong>{new_count} racines actuellement</strong>", html)
        if html2 != html:
            with open(HTML, "w", encoding="utf-8") as f: f.write(html2)
            print(f"✓ Compteur HTML → {new_count}")
        else:
            print("  ⚠ Compteur HTML non trouvé.")

if __name__ == "__main__":
    main()
