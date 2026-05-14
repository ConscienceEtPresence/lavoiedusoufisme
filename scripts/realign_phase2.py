#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Realigne les 49 racines de Phase 2 sur le style de Phase 1 :
- field ~240 caracteres (vs ~426 en Phase 2 actuelle)
- glose ~240 caracteres (vs ~380)
- attributions limitees a "Pour Gloton" / "Gloton souligne" / "Gloton insiste"
- meme densite, meme sobriete que les 15 racines initiales

Garde intactes : forms, quran, dict_links, nom_links, meditation, core_*
"""

import json, os, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, "data", "racines.json")
BAK  = DATA + ".before_realign_phase2"


# id -> (field, glose) recompactes au format Phase 1
REWRITES = {
    # ===== Lot 1 — socle theologique =====
    "ʾ-l-h": (
        "Ce qui est <em>adoré</em>, ce vers quoi un être se tourne pour s'en remettre. <em>Allāh</em> est la contraction de <em>al-ilāh</em> — <em>le</em> Dieu, l'Adoré par excellence. La racine partage avec <em>walaha</em> (être perdu d'amour) la nappe de l'éperdu.",
        "Pour Gloton, <em>ilāh</em> n'est jamais une abstraction : c'est ce qui m'arrache à moi-même. La <em>shahāda</em> ne profère pas une thèse, elle débusque les faux <em>ilāh</em> du cœur — ego, désir, opinion — pour ne plus se tourner que vers Lui."
    ),
    "ʾ-ḥ-d": (
        "<em>Aḥad</em> n'est pas l'unité qu'on pourrait compter, c'est l'<em>unicité absolue</em>, sans seconde possible. <em>Wāḥid</em> peut ouvrir une série, <em>aḥad</em> exclut toute série. Il s'emploie négativement (« personne ») et positivement (« le Seul »).",
        "Gloton souligne le choix de la sourate 112 : <em>Allāhu Aḥad</em>, non <em>Wāḥid</em>. Dieu n'est pas le premier d'une suite, Il est <em>Celui hors duquel rien ne peut être compté</em>. C'est la pointe du <em>tawḥīd</em>."
    ),
    "w-ḥ-d": (
        "Être un, isoler, faire un. La racine décrit aussi bien l'état (<em>wāḥid</em>) que l'acte (<em>tawḥīd</em>). Reconnaître l'unité n'est pas formuler une thèse — c'est unifier son regard, son intention, son cœur, jusqu'à ne plus voir que Lui en tout.",
        "Pour Gloton, le <em>tawḥīd</em> se déploie sur trois plans : « il n'y a de dieu que Lui » (théologique), « il n'agit qu'un » (Lui seul agit), « il n'est de réalité que Lui » (extinction). La racine porte ces trois lectures."
    ),
    "ṣ-m-d": (
        "Ce qui est plein, massif, sans interstice — et ce vers quoi <em>on se tourne</em> pour s'appuyer. Les deux sens se tiennent : seul ce qui est plein peut être un appui sans faille. <em>Aṣ-Ṣamad</em> n'a besoin de rien, et tout dépend de Lui.",
        "Gloton souligne la séquence de la sourate 112 : Dieu est Un (<em>aḥad</em>), et cet Un est <em>plein</em> (<em>ṣamad</em>) — sans manque, sans cavité par où le besoin pourrait s'engouffrer. Ce qui est Un n'a personne à qui demander."
    ),
    "q-d-s": (
        "Sanctifier, purifier, mettre à part. Le saint est ce qui est <em>séparé</em>, non par mépris mais par transcendance. <em>Al-Quds</em> = Jérusalem, la ville sainte ; <em>Rūḥ al-Qudus</em> = le Souffle saint qui sanctifie.",
        "Pour Gloton, la sainteté coranique n'est pas morale (être bon) mais ontologique : être inatteignable par la souillure, hors de portée du défaut. <em>Al-Quddūs</em> est Celui que toute imperfection lâche en s'approchant."
    ),
    "s-b-ḥ": (
        "Le verbe premier <em>sabaḥa</em> = nager, parcourir un grand espace. De là, <em>sabbaḥa</em> : glorifier en éloignant Dieu de toute imperfection — comme un nageur s'éloigne du rivage. <em>Subḥān Allāh</em> est ce mouvement, non un cri pieux.",
        "Gloton insiste sur l'image : <em>tasbīḥ</em> est un mouvement, pas un état. Glorifier, c'est se déplacer, éloigner toute représentation qui ramènerait Dieu à notre mesure. Les astres aussi <em>nagent</em> dans leur orbite (36,40) — leur cours est <em>tasbīḥ</em>."
    ),
    "ʾ-m-n": (
        "Être en sécurité, faire confiance, être digne de confiance. La foi (<em>īmān</em>) n'est pas d'abord adhésion à des dogmes — c'est l'état d'un cœur en sécurité parce qu'il s'est remis. L'<em>amāna</em> est ce qu'on confie à qui en est digne.",
        "Pour Gloton, <em>āmana</em> est un verbe d'accueil autant que de croyance : croire, c'est laisser entrer. Et la sécurité (<em>amn</em>) n'est pas l'absence de danger mais la présence d'un Garant. <em>Al-Muʾmin</em> est Dieu comme source de cette sécurité."
    ),
    "s-l-m": (
        "Une seule racine pour paix, salut, intégrité, remise. <em>Salima</em> : être entier. <em>Aslama</em> : remettre. <em>Salām</em> : la paix qui en résulte. Lien profond : seul ce qui se remet entier reste entier.",
        "Gloton récuse \"soumission\" comme traduction d'<em>islām</em>. <em>Aslama</em> est de la famille de <em>salām</em> et <em>salīm</em> (le cœur intègre, 26,89) : c'est l'acte par lequel je me remets entier — et donc <em>je redeviens</em> entier."
    ),
    "sh-h-d": (
        "Voir de ses yeux <em>et</em> attester de ce qu'on a vu : les deux gestes sont noués. Le <em>shāhid</em> n'est pas un croyant sur ouï-dire — c'est celui qui était là. D'où <em>shuhūd</em> (contemplation) et <em>shahīd</em> (martyr, dont le sang atteste).",
        "Pour Gloton, la <em>shahāda</em> est une certification de vue. \"J'atteste qu'il n'y a de dieu que Dieu\" ne vaut que si quelque chose en moi <em>a vu</em>. La voie passe de l'ouï-dire (<em>ʿilm al-yaqīn</em>) à la vision (<em>ʿayn al-yaqīn</em>)."
    ),
    "ḥ-m-d": (
        "Louer, rendre grâce. Distincte du remerciement (<em>shukr</em>, pour un bienfait reçu), la louange (<em>ḥamd</em>) s'adresse à ce qui est <em>bien en soi</em>. Le Coran ouvre par <em>al-ḥamdu li-Llāh</em> : la louange précède le don, due à la beauté même de Celui qui est.",
        "Gloton souligne le réseau : <em>Muḥammad</em> = le très-loué, <em>Aḥmad</em> = le plus louangeur. La louange est circulaire : elle part de Lui (<em>al-ḥamdu li-Llāh</em> est <em>Sa</em> parole), traverse l'homme, revient à Lui."
    ),
    "ṣ-l-w": (
        "Racine du lien rituel. Étymologie discutée : <em>ṣilā</em> (le lien) ou <em>ṣalan</em> (l'os qui fléchit dans la prosternation) — les deux convergent. Dieu Lui-même \"fait <em>ṣalāt</em>\" sur le Prophète (33,43) : ce n'est pas prier, c'est tourner Sa face avec amour.",
        "Pour Gloton, la racine porte le lien <em>des deux côtés</em> : prière de l'homme, bénédiction de Dieu — comme un fil tendu entre les deux extrémités d'un arc. La <em>ṣalāt</em> rituelle est l'inscription corporelle de ce fil dans le temps."
    ),
    "kh-l-ṣ": (
        "Être pur, sans mélange, dégagé. <em>Ikhlāṣ</em> n'est pas \"être sincère\" au sens moral — c'est <em>dépurer</em> son intention de tout ce qui n'est pas Lui. Le métal pur (<em>khāliṣ</em>) ne contient plus de scories : tel doit être le cœur.",
        "Gloton souligne la parenté avec <em>khalāṣ</em> (le salut, le dégagement) : être sincère, c'est se dégager. Tant que l'adoration est mélangée — un peu pour Lui, un peu pour moi — elle reste enchaînée. L'<em>ikhlāṣ</em> est libération par épuration."
    ),

    # ===== Lot 2 — anthropologie et noetique =====
    "ʿ-q-l": (
        "<em>ʿAqala</em> signifie d'abord <em>entraver</em> : la corde qui lie le chameau est <em>ʿiqāl</em>. L'intelligence retient l'âme de se disperser, <em>noue</em> les phénomènes pour en faire un sens. Comprendre, c'est nouer — non regarder.",
        "Pour Gloton, le <em>ʿaql</em> coranique n'est pas la raison spéculative mais la faculté de retenir le sens. D'où le refrain <em>la-ʿallakum taʿqilūn</em> : qu'on ne laisse pas s'échapper le signe. L'opposé n'est pas l'irrationalité, mais la dispersion."
    ),
    "f-h-m": (
        "Comprendre, saisir intérieurement. À la différence de <em>ʿaql</em> (lier) et de <em>fikr</em> (peser), <em>fahm</em> est <em>pénétration</em> du sens : ce moment où le voile tombe, où l'on voit ce qu'on entendait sans entendre. Salomon est rendu <em>fahīm</em> (21,79).",
        "Gloton souligne que le <em>fahm</em> a, dans la tradition spirituelle, une coloration propre : compréhension <em>donnée</em>, non simplement gagnée. Le sage demande <em>al-fahm fī kitābik</em> comme on demande la lumière — non comme on programme un raisonnement."
    ),
    "f-k-r": (
        "<em>Fakara</em>, <em>tafakkara</em> : retourner la chose dans son esprit, peser, considérer sous plusieurs angles. Le <em>fikr</em> n'est pas la pensée logique — c'est l'acte de méditer, de tourner autour d'un signe comme on tourne autour d'un mystère.",
        "Pour Gloton, le <em>tafakkur</em> est une discipline spirituelle entière. Le <em>dhikr</em> rappelle, le <em>fikr</em> creuse. On médite sur la création, le verset, l'événement — non pour expliquer, mais pour éprouver l'épaisseur."
    ),
    "ʿ-r-f": (
        "Connaître par <em>reconnaissance</em>, par familiarité — non par savoir appris. On <em>connaît</em> un visage parce qu'on l'a déjà vu. La <em>maʿrifa</em> de Dieu est de cet ordre : non savoir des choses sur Lui, mais Le re-connaître quand Il se montre.",
        "Gloton insiste : la <em>maʿrifa</em> est l'aboutissement de la voie soufie. Junayd disait \"je n'ai connu Dieu que par Dieu\" — connaître comme <em>retour</em> à ce qu'on avait toujours su, depuis l'alliance primordiale (<em>alastu bi-rabbikum</em>, 7,172)."
    ),
    "ḥ-k-m": (
        "Le sens premier : <em>mettre un frein</em>. Le mors du cheval est <em>ḥakama</em>. La sagesse est la maîtrise qui met chaque chose à sa juste place. Juger, gouverner, être sage : trois modalités d'un seul art de la mesure.",
        "Pour Gloton, la <em>ḥikma</em> n'est pas la <em>sophia</em> grecque mais une sagesse opératoire : <em>donner à chacun ce qui lui convient</em>. C'est pourquoi Dieu est <em>al-Ḥakam</em> (le Juge) et <em>al-Ḥakīm</em> (le Sage) — une seule maîtrise sous deux noms."
    ),
    "ʿ-d-l": (
        "Être équitable, équilibré, droit. La racine évoque la <em>balance</em> aux plateaux à niveau (<em>iʿtidāl</em>). Le ciel \"a été dressé selon une balance\" (55,7) : la justice coranique est cosmologique avant d'être juridique.",
        "Gloton souligne que l'<em>iʿtidāl</em> est un concept-clef de l'anthropologie coranique : l'homme est créé <em>fī aḥsani taqwīm</em> (95,4). Toute la voie est retour à cet équilibre originel. La justice avec autrui découle de la justice avec soi."
    ),
    "z-k-y": (
        "<em>Zakā</em> noue deux sens : <em>croître, prospérer</em> et <em>se purifier</em>. La beauté est dans l'unité : <em>purifier, c'est faire croître</em>. La <em>zakāt</em> prélève sur le bien non pour le diminuer, mais pour le faire prospérer.",
        "Pour Gloton, l'inversion est éclairante : nous croyons que purifier diminue. La racine dit l'inverse — ce qui n'est pas purifié n'est pas vivant. <em>Tazkiyat an-nafs</em> est ainsi condition même de la vie de l'âme."
    ),
    "t-q-y": (
        "Racine première <em>w-q-y</em> : préserver. <em>Ittaqā</em> : se mettre à l'abri, prendre garde. <em>Taqwā</em>, mal traduite par \"crainte de Dieu\", est plus exactement <em>la conscience vigilante qui préserve</em>. Précaution amoureuse, non peur servile.",
        "Gloton récuse \"crainte\" comme traduction unique : la <em>taqwā</em> est une intelligence du danger de se perdre. \"Le plus noble est le plus muttaqī\" (49,13) — non le plus craintif, mais le plus en garde, le plus conscient."
    ),
    "kh-sh-y": (
        "Crainte qui n'est pas peur, mais tremblement de qui se sait devant plus grand que soi. À la différence de <em>khawf</em> (peur du mal possible) et de <em>taqwā</em> (vigilance), la <em>khashya</em> est purement révérencielle — elle naît de la connaissance.",
        "Pour Gloton, la <em>khashya</em> est la signature de la connaissance vraie. \"Seuls craignent Dieu, parmi Ses serviteurs, les savants\" (35,28). Plus on connaît, plus on tremble — non par peur, mais par perception de la disproportion."
    ),
    "ṣ-d-q": (
        "Dire vrai. Mais la racine exige plus : <em>conformité de la parole, de l'acte et de l'être</em>. Est <em>ṣiddīq</em> (titre suprême après prophète) celui dont la vie atteste ce que dit sa bouche. <em>Ṣadaqa</em> = aumône : le don aussi atteste.",
        "Gloton souligne le lien <em>ṣidq</em> / <em>ṣadaqa</em> : donner prouve la sincérité, là où les mots sont gratuits. La vérité coranique n'est pas une thèse — c'est une incarnation. <em>Ṣiddīqūn</em> et <em>ṣadaqāt</em> partagent la racine pour cette raison."
    ),
    "ʾ-d-b": (
        "<em>Adab</em> n'a pas d'équivalent : ni politesse, ni morale, ni culture. C'est <em>l'ajustement intérieur et extérieur</em> à la situation, à la personne, au moment. Adab du disciple, adab de la prière, adab envers Dieu : chaque registre a le sien.",
        "Pour Gloton, l'<em>adab</em> est l'accomplissement humain de la <em>taqwā</em> : la vigilance devient grâce du geste. Le Prophète disait : <em>addabanī rabbī fa-aḥsana taʾdībī</em> — \"mon Seigneur m'a éduqué, et a parfait mon éducation\"."
    ),
    "kh-l-q": (
        "Splendeur de la racine : un seul mot, <em>khalq</em>, désigne à la fois <em>la création</em> et <em>le caractère</em>. Mon caractère est ma part de création — ce que Dieu a façonné en moi et que je dois à mon tour façonner. \"Un caractère immense\" (68,4) loue le Prophète.",
        "Gloton souligne cette unité : pour la pensée coranique, l'éthique n'est pas surajoutée à la nature — elle <em>est</em> la nature accomplie. Parfaire le <em>khuluq</em>, c'est parfaire le <em>khalq</em>. Une seule racine, deux faces d'une même œuvre."
    ),

    # ===== Lot 3 — vie spirituelle, perception, eschatologie =====
    "g-f-r": (
        "<em>Ghafara</em> = couvrir, voiler. Le casque du guerrier est <em>mighfar</em>. Le pardon n'est pas effacement : c'est <em>recouvrement</em>. Dieu pose un voile sur la faute, qui ne disparaît pas mais cesse d'agir.",
        "Pour Gloton, trois modalités : <em>ʿafw</em> efface, <em>ṣafḥ</em> tourne la page, <em>maghfira</em> couvre. La <em>maghfira</em> est la plus mystérieuse : la trace demeure dans le réel, tenue par la miséricorde. <em>Al-Ghaffār</em> ne cesse de couvrir."
    ),
    "h-d-y": (
        "Guider, conduire. La racine porte le chemin (<em>hudā</em>) <em>et</em> le présent qu'on offre (<em>hadiyya</em>) : guider est faire le plus précieux des cadeaux. Nul ne se guide soi-même — c'est Dieu qui guide qui Il veut (28,56).",
        "Gloton souligne le verset 1,6 (<em>ihdinā ṣ-ṣirāṭa l-mustaqīm</em>) : nous demandons la guidance plusieurs fois par jour, parce que la guidance n'est pas un acquis mais un renouvellement. La voie droite n'est jamais conquise — elle est offerte."
    ),
    "ḍ-l-l": (
        "S'égarer, perdre son chemin. La racine évoque celui qui <em>marche encore</em> mais ne sait plus où. Non pas l'arrêt, mais la marche désorientée. Opposé exact de <em>hudā</em>. Le Coran : \"Il t'a trouvé errant, et Il t'a guidé\" (93,7).",
        "Pour Gloton, <em>ḍalāl</em> n'est pas le mal moral mais la perte de repère. La Fātiḥa oppose <em>al-mustaqīm</em> à <em>al-ḍāllīn</em> — non aux méchants : les égarés sont ceux qui marchent sincèrement, mais dans le brouillard."
    ),
    "j-h-d": (
        "<em>Jahada</em> : peiner, déployer sa <em>juhd</em> (capacité maximale). Engagement total de soi dans une direction. <em>Jihād</em>, mal traduit par \"guerre sainte\", est avant tout l'effort soutenu — intérieur d'abord (<em>al-jihād al-akbar</em>).",
        "Gloton récuse la réduction au combat : la racine est centrée sur l'effort. <em>Jāhada fī sabīli Llāh</em> désigne toute la vie spirituelle. Hadith fameux : \"nous sommes revenus du petit combat (la bataille) vers le grand combat (contre nous-mêmes)\"."
    ),
    "n-ṣ-r": (
        "Secourir, venir en aide. Le <em>naṣr</em> coranique n'est pas la victoire seule — c'est tout secours qui arrive à temps. Les <em>Anṣār</em> sont les compagnons médinois ; <em>naṣrāniyy</em> (chrétien) vient de la même racine : ceux qui ont secouru Jésus.",
        "Pour Gloton, la racine décrit une réciprocité asymétrique : \"si vous secourez Dieu, Il vous secourra\" (47,7). Non que Dieu ait besoin d'aide — mais se mettre à Son service ouvre Son secours. <em>Naṣr</em> est l'inverse de l'isolement."
    ),
    "gh-y-b": (
        "Être absent, caché. Le <em>ghayb</em> n'est ni néant ni mensonge — c'est <em>ce qui est, mais n'apparaît pas</em>. Le couple <em>al-ghayb wa-sh-shahāda</em> couvre la totalité du réel : ce que je vois, et ce qui est sans m'apparaître.",
        "Gloton souligne : <em>ghayb</em> n'est pas \"surnaturel\". C'est la part du réel que les sens ne saisissent pas — le passé, l'avenir, les anges, le cœur d'autrui, Dieu Lui-même. Croire au <em>ghayb</em> (2,3), c'est apprendre à fréquenter cela."
    ),
    "ḥ-y-y": (
        "Être vivant. Étrangement, la même racine donne <em>ḥayāʾ</em> (la pudeur) — comme si être vivant et avoir de la pudeur étaient liés : ce qui est vivant <em>se réserve</em>. <em>Al-Ḥayy</em> est Celui qui se tient, et fait tenir tout ce qui vit.",
        "Pour Gloton, <em>al-Ḥayy</em> est souvent couplé à <em>al-Qayyūm</em> (2,255) : la vie n'est pas un processus, c'est <em>la qualité de se tenir</em>. <em>Aḥyā</em> et <em>amāta</em> reviennent toujours ensemble, comme les deux mains d'une seule œuvre."
    ),
    "m-w-t": (
        "Mourir. Pôle contraire et complémentaire de la vie. Le Coran évite la dualité tragique : \"Celui qui a créé la mort et la vie\" (67,2) — la mort est <em>créée</em>, donc voulue, donc bonne. La voie parle d'une <em>mort avant la mort</em>.",
        "Gloton souligne le caractère non-négatif : la mort n'est pas l'antithèse de la vie, c'est son corollaire. <em>Aḥyā</em> et <em>amāta</em> reviennent ensemble. Et la <em>fanāʾ</em> soufie prolonge l'intuition : il y a une mort qui fait vivre."
    ),
    "b-ṣ-r": (
        "Voir, percevoir. La racine distingue deux modes : <em>baṣar</em> (vue physique) et <em>baṣīra</em> (vision intérieure). Le Coran insiste sur la cécité possible de la <em>baṣīra</em> alors que les yeux fonctionnent : \"ce sont les cœurs qui sont aveugles\" (22,46).",
        "Pour Gloton, <em>baṣīra</em> est l'œil du cœur — c'est elle qu'on cultive sur la voie. <em>Al-Baṣīr</em>, couplé à <em>as-Samīʿ</em>, est Celui qui voit tout : non pas la vue surveillante, mais l'attention sans manque, le regard qui prend acte."
    ),
    "s-m-ʿ": (
        "Trois actes noués : entendre, écouter, obéir. Dans la racine sémitique, écouter vraiment <em>c'est</em> répondre. <em>Samiʿnā wa aṭaʿnā</em> (\"nous avons entendu et obéi\", 2,285) condense la foi en deux mots. <em>Samāʿ</em> = audition spirituelle soufie.",
        "Gloton souligne la priorité de l'audition : la révélation est <em>entendue</em> avant d'être lue. <em>As-Samīʿ</em> est Celui qui entend tout, y compris le murmure intérieur. Et la <em>samāʿ</em> mystique : entendre <em>au-delà</em> du son qui est dit."
    ),
    "w-j-h": (
        "<em>Wajh</em> désigne la face, la direction qu'on prend, l'aspect sous lequel une chose se présente. La \"face de Dieu\" est ce qui en Lui se tourne vers nous — non un anthropomorphisme, mais l'orientation divine elle-même. \"Tout périt sauf Sa face\" (28,88).",
        "Pour Gloton, le verset 2,115 est central : <em>où que vous vous tourniez, là est la face de Dieu</em>. Aucune direction n'est privée du Visage. Et le <em>tawajjuh</em> soufi est l'acte de tourner sa face vers Lui."
    ),
    "k-b-r": (
        "<em>Kabura</em> : être grand. Racine double : appliquée à Dieu, elle dit Sa transcendance (<em>Allāhu akbar</em>) ; appliquée à l'homme, elle dit l'orgueil (<em>takabbur</em>) — la prétention illégitime à la grandeur. Iblīs tombe par <em>istikbār</em>.",
        "Gloton souligne : <em>Allāhu akbar</em> n'est pas \"Dieu est le plus grand\" (clos) mais <em>plus grand</em> — élatif ouvert. Plus grand que toute mesure, plus grand que l'instant précédent où l'on a déjà dit qu'Il l'était."
    ),

    # ===== Lot 4 — royaute, parole, mouvement =====
    "k-t-b": (
        "Écrire, tracer, prescrire. Trois nappes : l'acte (<em>kitāba</em>), le livre (<em>kitāb</em>), la prescription (<em>kutiba ʿalaykum</em>). Écrire n'est pas seulement consigner — c'est inscrire dans le réel, fixer un destin. Tout est <em>déjà écrit</em>.",
        "Pour Gloton, <em>kitāb</em> désigne le Coran, mais aussi le destin et les Écritures antérieures (<em>ahl al-kitāb</em>). La racine pose une métaphysique : <em>écrire, c'est faire être</em>. La révélation est l'inscription du divin dans la langue humaine."
    ),
    "m-l-k": (
        "Posséder, régner. Trois mots-clés : <em>malik</em> (roi qui règne), <em>mālik</em> (maître qui possède), <em>mulk</em> (royauté). Le Coran utilise les deux pour Dieu : <em>al-Malik</em> et <em>Mālik al-Mulk</em>. La fātiḥa dit <em>Mālik yawm ad-dīn</em>.",
        "Gloton souligne la nuance : <em>malik</em> est qualité dynamique (qui gouverne en acte), <em>mālik</em> qualité statique (qui détient le titre). Dieu n'est pas seulement Celui qui a le droit — Il est Celui qui exerce. Les anges (<em>malāʾika</em>) sont au Roi."
    ),
    "r-b-b": (
        "<em>Rabb</em> n'est pas \"seigneur\" abstrait. La racine évoque <em>celui qui éduque, qui fait croître</em> — d'où <em>rabba</em> (élever un enfant), <em>tarbiya</em> (éducation). Dieu est <em>Rabb</em> : Celui qui fait croître chaque être vers son achèvement.",
        "Pour Gloton, <em>Rabb</em> est le nom le plus relationnel de Dieu. Là où <em>Allāh</em> dit Sa réalité absolue, <em>Rabb</em> dit Sa relation pédagogique avec chacun. \"Mon Rabb\" est l'expression intime — comme un dialogue."
    ),
    "w-l-y": (
        "Être proche, allié, protecteur. <em>Walī</em> = ami intime, allié, et chez les soufis le <em>saint</em> (proche de Dieu). <em>Walāya</em> est la qualité du <em>walī</em>. Dieu est <em>al-Walī</em> : le Très-Proche-protecteur des croyants.",
        "Gloton souligne la réciprocité : \"Dieu est le Walī de ceux qui croient\" (2,257) — Il l'est parce qu'eux le sont devenus. La <em>walāya</em> soufie n'est pas un état acquis : elle est <em>l'effet</em> de la <em>walāya</em> divine sur l'homme."
    ),
    "b-y-n": (
        "Apparaître clairement. Double tension : <em>bayna</em> (entre, l'espace qui sépare) et <em>bayān</em> (l'exposition qui rend clair). Pour qu'une chose apparaisse, il faut qu'un écart se creuse. Le Coran <em>al-mubīn</em> sépare le vrai du faux.",
        "Pour Gloton, la <em>bayān</em> est catégorie esthétique et théologique. Le verset 55,4 (\"Il lui a enseigné l'exposition claire\") fait de la <em>bayān</em> un don divin à l'homme : nous sommes l'animal capable de <em>rendre clair</em>."
    ),
    "q-d-r": (
        "Mesurer, fixer, décréter. Deux nappes liées : <em>qudra</em> (puissance, capacité) et <em>qadar</em> (mesure, décret). Tout ce qui est, est mesuré : \"Nous avons créé toute chose selon une mesure\" (54,49). Le \"destin\" n'est pas fatalité — c'est juste portion.",
        "Gloton dissipe le malentendu fataliste : <em>qadar</em> n'est pas \"ce qui doit arriver\", c'est <em>la mesure</em> selon laquelle chaque être est créé. <em>Al-Qādir</em> est Celui qui sait exactement ce qu'il faut, ni plus ni moins."
    ),
    "kh-y-r": (
        "<em>Khāra</em> : être bon ; <em>ikhtāra</em> : choisir. Une seule racine pour <em>le bien</em> et <em>le choix</em> — comme si choisir, c'était aller au bon. La <em>istikhāra</em> est l'acte par lequel le croyant demande à Dieu le bon choix.",
        "Pour Gloton, choisir n'est pas préférer : c'est <em>aller chercher le bien</em>. Le verbe contient l'orientation morale du choix. Mal choisir, ce n'est pas se tromper de préférence — c'est manquer le bien."
    ),
    "kh-l-d": (
        "Durer, demeurer sans fin. <em>Khulūd</em> est la durée éternelle — celle promise au Jardin (<em>jannāt al-khuld</em>, 25,15), redoutable pour qui s'attache au Feu. Ce qui est éternel l'est <em>parce que Dieu le veut tel</em> : suspendu à Sa permanence.",
        "Gloton souligne : <em>khulūd</em> n'est pas la même éternité que celle de Dieu. Dieu est <em>al-Bāqī</em> (permanent par soi). Le créé devient <em>khālid</em> par décret. Éternité essentielle et éternité donnée — toute la vie apprend cette différence."
    ),
    "j-n-n": (
        "<em>Janna</em> = couvrir, voiler, abriter. En cascade : <em>jannā</em> (jardin, frondaisons qui couvrent), <em>janīn</em> (embryon caché), <em>jinn</em> (invisibles), <em>junūn</em> (folie, esprit voilé). Tous disent <em>ce qui est tenu caché</em>.",
        "Pour Gloton, le paradis n'est pas un \"au-delà\" abstrait : c'est <em>une autre épaisseur du même réel</em>, voilée seulement. \"Précipitez-vous vers un jardin large comme les cieux et la terre\" (3,133) — il est déjà là, simplement couvert."
    ),
    "n-z-l": (
        "Descendre. La révélation est <em>tanzīl</em> ou <em>nuzūl</em> : la Parole descend du Très-Haut. <em>Manzil</em> = lieu où l'on descend, étape. La pluie aussi descend. Tout don véritable vient d'en haut.",
        "Gloton insiste : le <em>tanzīl</em> est <em>processus continu</em>, non événement passé. Le Coran continue de \"descendre\" sur qui le lit avec foi — il s'adapte au <em>manzil</em> (station) du lecteur. À chaque palier, une parole peut descendre."
    ),
    "ʿ-r-j": (
        "Monter, gravir. <em>Miʿrāj</em> = échelle, degré, voie ascensionnelle — et par excellence l'ascension nocturne du Prophète. Le couple <em>nuzūl / ʿurūj</em> structure la cosmologie : la révélation descend, l'âme monte.",
        "Pour Gloton, <em>ʿaraja</em> évoque une montée <em>par paliers</em>, non un envol direct. Sept cieux à traverser, sept stations à franchir. Le <em>miʿrāj</em> du Prophète est le modèle ; chaque acte sincère est une marche de l'échelle."
    ),
    "q-w-l": (
        "Dire. La cosmologie coranique : Dieu crée en disant <em>kun</em> (Sois) et <em>fa-yakūn</em> (cela est). Le <em>qawl</em> divin est performatif — il ne décrit pas, il fait être. Le <em>qawl</em> humain est appelé à imiter, à sa mesure, cette dignité.",
        "Gloton souligne la responsabilité immense : 33,70 enjoint <em>qulū qawlan sadīdan</em> (\"dites une parole droite\"). Le <em>qawl</em> n'est jamais innocent — c'est un acte créateur à petite échelle. Silence, véracité, invocation : trois modulations d'un même <em>qawl</em> ajusté."
    ),
    "s-ʾ-l": (
        "Demander : poser une question, solliciter, mendier. Au Jour, chacun sera <em>masʾūl</em> (interrogé). La prière est un <em>suʾāl</em> — dont le Prophète disait : <em>la prière est la moelle de l'adoration</em>. Demander n'est pas faible : c'est la posture juste du créé.",
        "Pour Gloton, la pauvreté ontologique du créé se traduit en posture par la <em>demande</em>. Le sage soufi <em>demande</em> sans cesse — non par avidité, mais par conscience d'être radicalement dépendant."
    ),
}


def main():
    if not os.path.exists(DATA):
        print(f"ERREUR : {DATA}", file=sys.stderr); sys.exit(1)

    with open(DATA, encoding="utf-8") as f:
        data = json.load(f)

    # Verifie qu'on couvre bien les 49 racines de Phase 2
    P1_IDS = {'r-h-m','ʿ-l-m','q-r-b','dh-k-r','ʿ-b-d','q-l-b','n-f-s','r-w-h',
              'h-b-b','s-b-r','sh-k-r','n-w-r','h-q-q','f-q-r','t-w-b'}
    p2_in_json = {r['id'] for r in data['racines']} - P1_IDS
    missing = p2_in_json - set(REWRITES.keys())
    extra   = set(REWRITES.keys()) - p2_in_json
    if missing or extra:
        print(f"ERREUR couverture : manque {missing}, en trop {extra}", file=sys.stderr)
        sys.exit(1)

    shutil.copy(DATA, BAK)
    print(f"Sauvegarde : {BAK}\n")

    n = 0
    total_before_field = total_after_field = 0
    total_before_glose = total_after_glose = 0
    for r in data['racines']:
        if r['id'] not in REWRITES: continue
        new_field, new_glose = REWRITES[r['id']]
        total_before_field += len(r['field']);  total_after_field += len(new_field)
        total_before_glose += len(r['glose_gloton']); total_after_glose += len(new_glose)
        r['field'] = new_field
        r['glose_gloton'] = new_glose
        n += 1

    with open(DATA, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✓ {n} racines réalignées sur le format Phase 1.")
    print(f"  field : moy {total_before_field/n:.0f} → {total_after_field/n:.0f} car.")
    print(f"  glose : moy {total_before_glose/n:.0f} → {total_after_glose/n:.0f} car.")

if __name__ == "__main__":
    main()
