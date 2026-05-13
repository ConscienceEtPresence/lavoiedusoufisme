#!/usr/bin/env python3
"""Ajoute 50 entrées (Phase 4 — focus ego/nafs) au dictionnaire.
D'après Rafīq al-ʿAjam, Mawsūʿat muṣṭalaḥāt at-taṣawwuf al-islāmī."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DICT = ROOT / "data" / "dictionnaire.json"

NEW_ENTRIES = [

# ============== EGO — le cœur du combat (10) ==============
{
  "id": "hawa", "ar": "الهَوَى", "tr": "al-hawā", "tr_simple": "al-hawa",
  "fr": "La passion, le désir bas",
  "racine": "ه و ي", "racine_sens": "hawā — tomber, descendre ; pencher, désirer",
  "category": "anthropologie",
  "tags": ["ego", "nafs", "passion", "combat"],
  "definition_concise": "L'inclinaison du cœur vers ce qui n'est pas Dieu — la pente naturelle de la nafs (النَّفْس) vers ses propres jouissances, en aveugle. Le hawā est l'idole intérieure : on lui obéit sans même le savoir.",
  "sens_profond": "La racine arabe <em>h-w-y</em> signifie <em>tomber</em> : le hawā est ce qui fait <em>descendre</em> l'âme de son orientation verticale. Le Coran dit : <em>« As-tu vu celui qui a pris son hawā pour dieu ? »</em> (45, 23) — le hawā prend la place de Dieu dans le cœur, et celui qui le suit ne s'en rend même pas compte, car il croit suivre <em>sa</em> volonté propre, alors qu'il obéit à un dieu intérieur déguisé. Pour les soufis, le hawā n'est pas le désir en soi (qui peut être sain), mais le désir <em>devenu maître</em>, qui dicte au cœur ce qu'il doit aimer et fuir. Tout le travail de la voie est de désapprendre cette obéissance aveugle — de retourner l'âme vers Dieu seul (<em>ikhlāṣ</em>). Al-Junayd : <em>« La voie est fermée à toute créature, sauf à celui qui suit les traces du Messager et qui s'oppose à son hawā. »</em> Le hawā est l'ennemi le plus intime : il parle avec ta voix.",
  "voix_des_maitres": [
    {"auteur": "Coran 79, 40-41", "texte": "« Quant à celui qui craint la station de son Seigneur et qui interdit à son âme le hawā — le Jardin sera sa demeure. »"},
    {"auteur": "Ibn ʿAṭāʾ Allāh", "texte": "« La racine de toute désobéissance, de toute insouciance et de toute passion, c'est de se contenter de soi-même. Et la racine de toute obéissance, de toute vigilance et de toute chasteté, c'est de ne pas se contenter de soi-même. »"}
  ],
  "meditation": "Quel est le hawā que je n'ai pas encore reconnu — celui que je sers en croyant servir Dieu ?",
  "resonance": ["nafs", "nafs-ammara", "shahwa", "ghurur", "ikhlas", "mujahada"],
  "lectures_site": []
},
{
  "id": "shahwa", "ar": "الشَّهْوَة", "tr": "ash-shahwa", "tr_simple": "shahwa",
  "fr": "La convoitise, l'appétit",
  "racine": "ش ه و", "racine_sens": "shahā — désirer ardemment, convoiter",
  "category": "anthropologie",
  "tags": ["ego", "nafs", "désir", "combat"],
  "definition_concise": "L'appétit qui pousse l'âme vers ce qu'elle goûte — nourriture, sexe, possession, reconnaissance. La shahwa n'est pas mauvaise en soi : elle devient piège quand elle prend la place du but.",
  "sens_profond": "La shahwa désigne tout désir d'appropriation — manger, posséder, jouir, être vu. Les soufis distinguent les <em>shahawāt</em> du ventre, du sexe, du regard, de la langue. Aucune n'est condamnée en soi : la voie n'est pas un refus du corps, mais une recentration. Le danger vient quand la shahwa devient un <em>but</em> au lieu d'un signe — quand on mange pour manger, et non pour subsister ; quand on se montre pour être vu, et non pour transmettre. Al-Ghazālī consacre tout un livre de l'<em>Iḥyāʾ</em> aux <em>shahawāt</em> du ventre et du sexe : non pour les supprimer, mais pour les <em>habiter</em> avec conscience. La discipline soufie classique (jeûne, retraite, veille, silence) vise à réduire l'emprise des shahawāt jusqu'à ce que l'âme soit assez légère pour entendre la voix subtile. Le contraire de la shahwa n'est pas l'ascèse : c'est l'<em>ikhlāṣ (إِخْلَاص)</em> — la simplicité du désir orienté vers Dieu seul.",
  "voix_des_maitres": [
    {"auteur": "Al-Ghazālī", "texte": "« Le ventre est la source de toutes les shahawāt et le foyer de toutes les maladies. »"}
  ],
  "meditation": "Quelle shahwa me gouverne sans que je le sache — au point que je l'appelle « besoin » ?",
  "resonance": ["nafs", "hawa", "zuhd", "sawm", "mujahada"],
  "lectures_site": []
},
{
  "id": "hubb-ad-dunya", "ar": "حُبُّ الدُّنْيَا", "tr": "ḥubb ad-dunyā", "tr_simple": "hubb ad-dunya",
  "fr": "L'amour du monde",
  "racine": "ح ب ب / د ن و", "racine_sens": "ḥubb — l'amour ; dunyā — le proche, l'ici-bas",
  "category": "anthropologie",
  "tags": ["ego", "monde", "racine du mal", "détachement"],
  "definition_concise": "L'attachement à l'ici-bas comme à un but en soi. Selon un célèbre dit prophétique : « L'amour du monde est la racine de toute faute. » Non pas le monde comme tel — mais l'amour qui <em>retient</em>.",
  "sens_profond": "Le mot <em>dunyā</em> signifie <em>la plus proche</em> — la vie immédiate, présente. La voie ne demande pas de fuir le monde (le soufisme classique condamne la rahbāniyya, le monachisme), mais de ne pas le prendre pour ultime. <em>Ḥubb ad-dunyā</em>, c'est aimer la création comme on devrait aimer le Créateur : confondre le signe avec ce qu'il indique. Le hadith dit : <em>« L'amour du monde est la racine (raʾs) de toute faute. »</em> Pourquoi racine ? Parce que toutes les autres maladies — orgueil, envie, avidité, colère — naissent de cette confusion fondamentale : prendre ce qui passe pour ce qui demeure. Le détachement soufi n'est pas pauvreté matérielle obligatoire — c'est <em>faqr</em> intérieur, l'âme qui sait que rien de ce qu'elle possède n'est à elle. Al-Ḥasan al-Baṣrī : <em>« Le monde est un pont — traverse-le, mais ne t'y construis pas de demeure. »</em>",
  "voix_des_maitres": [
    {"auteur": "Hadith", "texte": "« L'amour du monde est la racine de toute faute. »"},
    {"auteur": "ʿĪsā ibn Maryam (attribué)", "texte": "« Le monde est un pont — traversez-le, n'y bâtissez pas. »"}
  ],
  "meditation": "Qu'est-ce qui, dans ma vie quotidienne, m'enchaîne à ce qui passe — comme si cela ne passait pas ?",
  "resonance": ["dunya", "zuhd", "faqr", "tawakkul", "akhira"],
  "lectures_site": []
},
{
  "id": "kibr", "ar": "الكِبْر", "tr": "al-kibr", "tr_simple": "kibr",
  "fr": "L'orgueil",
  "racine": "ك ب ر", "racine_sens": "kabura — être grand ; kibr — se faire grand",
  "category": "anthropologie",
  "tags": ["ego", "défaut majeur", "obstacle"],
  "definition_concise": "Se croire au-dessus des autres — la maladie qui ferme le cœur à la vérité et aux créatures. Pour les soufis, c'est le premier voile et le dernier à tomber.",
  "sens_profond": "Le kibr est défini par le hadith comme <em>« le rejet de la vérité et le mépris des hommes »</em>. C'est la maladie spirituelle la plus redoutable parce qu'elle se cache mieux que les autres : on peut accomplir mille pratiques tout en étant intérieurement supérieur — et ce supérieur invisible empoisonne tout. Iblīs n'est pas tombé par convoitise mais par kibr : il a refusé de se prosterner devant Adam parce qu'il se croyait <em>meilleur</em>. Le kibr est donc l'origine de la chute, le péché originel cosmique. Les soufis le distinguent du <em>ʿujb (العُجْب)</em> (la complaisance en soi, qui peut exister seul) : le kibr s'exprime <em>contre l'autre</em>. Sa cure n'est pas l'humiliation extérieure — qui peut nourrir un orgueil plus subtil (« regardez comme je suis humble ») — mais la conscience claire que toute qualité vient de Dieu, et que rien de ce qu'on est ne nous appartient. Le contraire du kibr n'est pas la bassesse, c'est la <em>ʿubūdiyya (عُبُودِيَّة)</em> juste : être à sa place de serviteur, ni plus, ni moins.",
  "voix_des_maitres": [
    {"auteur": "Hadith", "texte": "« N'entrera pas au Jardin celui qui a dans son cœur un atome de kibr. »"},
    {"auteur": "Rūmī", "texte": "« Quand l'ego s'efface, le Roi entre. Le seul obstacle, c'est toi. »"}
  ],
  "meditation": "Devant qui me sens-je supérieur — même sans le dire ? Et qui suis-je vraiment, sans ce que je me suis attribué ?",
  "resonance": ["ujb", "riyaa", "ananiyya", "uboodiyya", "tawba"],
  "lectures_site": []
},
{
  "id": "ghurur", "ar": "الغُرُور", "tr": "al-ghurūr", "tr_simple": "ghurur",
  "fr": "L'illusion sur soi",
  "racine": "غ ر ر", "racine_sens": "gharra — tromper, leurrer",
  "category": "anthropologie",
  "tags": ["ego", "illusion", "vigilance"],
  "definition_concise": "Se laisser leurrer — par le monde, par soi-même, par sa propre piété. Le ghurūr est le voile qui fait croire qu'on est arrivé, alors qu'on commence à peine.",
  "sens_profond": "Le ghurūr couvre toutes les formes de fausse sécurité : croire qu'on a le temps, croire qu'on est sauvé, croire que Dieu fait exception pour soi, croire que ses pratiques suffisent. Al-Ghazālī ferme l'<em>Iḥyāʾ ʿulūm ad-dīn</em> par un livre entier (Kitāb al-Ghurūr) sur les illusions des dévots — il distingue le ghurūr des savants, des ascètes, des soufis, des riches, des pauvres : chacun a sa façon de se croire arrivé. Le ghurūr le plus dangereux n'est pas chez les pécheurs (qui savent leur état), mais chez les pieux qui prennent leurs propres œuvres pour un capital. Le hadith dit : <em>« Si Dieu voulait punir un homme par son meilleur acte, Il le pourrait. »</em> Toute œuvre est suspecte tant qu'elle ne nous a pas appris la pauvreté <em>(faqr (الفَقْر))</em>. La sortie du ghurūr passe par la <em>muḥāsaba (المُحَاسَبَة)</em> — l'examen sévère de l'âme — et par le souvenir de la mort, qui ramène à la vérité.",
  "voix_des_maitres": [
    {"auteur": "Al-Ghazālī", "texte": "« Le pire des leurrés est celui qui prend son leurre pour une certitude. »"}
  ],
  "meditation": "Quelle est l'illusion sur moi-même que je n'ose pas regarder en face ?",
  "resonance": ["kibr", "ujb", "muhasaba", "tawba", "yaqin"],
  "lectures_site": []
},
{
  "id": "hasad", "ar": "الحَسَد", "tr": "al-ḥasad", "tr_simple": "hasad",
  "fr": "L'envie",
  "racine": "ح س د", "racine_sens": "ḥasada — envier, désirer la perte d'un bien chez l'autre",
  "category": "anthropologie",
  "tags": ["ego", "défaut", "cœur"],
  "definition_concise": "Souhaiter la disparition d'un bien chez autrui. Le ḥasad accuse Dieu — il dit : <em>Tu as mal partagé.</em> Il consume celui qui l'éprouve avant tout autre.",
  "sens_profond": "Le ḥasad va plus loin que la simple jalousie (qui peut être saine, le <em>ghibṭa</em>, désir d'avoir aussi). L'envie est noire : elle désire que l'autre <em>perde</em>. Pour les soufis, c'est une accusation directe portée contre Dieu : <em>« Tu as donné à celui-ci ce que Tu aurais dû me donner. »</em> Le hadith dit : <em>« Le ḥasad dévore les bonnes actions comme le feu dévore le bois sec. »</em> Le ḥasad est aussi la cause de la première mort sur terre — celle de Hābīl par Qābīl — et de la chute d'Iblīs (qui envia Adam). C'est donc, comme le kibr, une maladie cosmogonique. Sa cure passe par : reconnaître que tout don vient de Dieu et n'est pas un dû ; bénir l'autre intérieurement chaque fois qu'on a un mouvement d'envie ; et, plus profondément, se réjouir <em>parce que</em> l'autre reçoit — devenir <em>maḥabba (مَحَبَّة)</em>, capable de joie pour ce qui ne nous arrive pas.",
  "voix_des_maitres": [
    {"auteur": "Hadith", "texte": "« Méfiez-vous du ḥasad : il dévore les bonnes actions comme le feu dévore le bois sec. »"}
  ],
  "meditation": "Devant la grâce reçue par un autre, quelle est ma première pensée — vraiment ?",
  "resonance": ["kibr", "ujb", "qalb", "mahabba", "shukr"],
  "lectures_site": []
},
{
  "id": "ghadab", "ar": "الغَضَب", "tr": "al-ghaḍab", "tr_simple": "ghadab",
  "fr": "La colère",
  "racine": "غ ض ب", "racine_sens": "ghaḍiba — s'emporter, s'enflammer",
  "category": "anthropologie",
  "tags": ["ego", "feu", "maîtrise"],
  "definition_concise": "Le feu qui monte quand le moi est blessé. Le ghaḍab n'est pas mauvais en soi (il a sa place pour défendre la vérité), mais devenu maître, il aveugle.",
  "sens_profond": "Le ghaḍab est, pour les soufis, l'un des trois feux intérieurs (avec la shahwa et le ḥasad). Il vient quand la nafs (النَّفْس) se sent attaquée, méprisée, contrariée. La voie ne demande pas d'éteindre ce feu — il y a une colère juste, celle des prophètes contre l'injustice — mais de le <em>contenir</em>. Le Prophète disait : <em>« Le fort n'est pas celui qui terrasse les hommes, mais celui qui se maîtrise dans la colère. »</em> Les Anciens préconisent : changer de posture (debout → assis → couché), faire silence, faire les ablutions (l'eau éteint le feu), différer la réponse. Plus profondément, le ghaḍab dévoile ce qu'on aime vraiment : on s'emporte pour ce qui menace nos idoles. Examiner ses colères, c'est cartographier ses attachements. Le terme contraire est le <em>ḥilm (حِلْم)</em> — la patience douce, qui est l'un des plus beaux Noms de Dieu : <em>al-Ḥalīm</em>, l'Indulgent.",
  "voix_des_maitres": [
    {"auteur": "Hadith", "texte": "« Le fort n'est pas celui qui terrasse les hommes, mais celui qui se maîtrise dans la colère. »"}
  ],
  "meditation": "De quoi mes colères dernières voulaient-elles défendre — vraiment ?",
  "resonance": ["nafs", "hawa", "sabr", "hilm", "akhlaq"],
  "lectures_site": []
},
{
  "id": "waswasa", "ar": "الوَسْوَسَة", "tr": "al-waswasa", "tr_simple": "waswasa",
  "fr": "Le susurrement intérieur",
  "racine": "و س و س", "racine_sens": "waswasa — chuchoter, suggérer en secret",
  "category": "anthropologie",
  "tags": ["ego", "pensées", "vigilance"],
  "definition_concise": "La voix basse qui suggère le doute, la transgression, le découragement — venue du shayṭān, de la nafs (النَّفْس), ou d'un repli du cœur sur lui-même. Reconnaître la waswasa, c'est déjà n'en être plus dupe.",
  "sens_profond": "Le Coran nomme l'ennemi <em>al-waswās al-khannās</em> — celui qui chuchote et se retire. La waswasa est l'art du soupçon : elle n'attaque pas frontalement, elle insinue. <em>Tu n'es pas sincère. Ta prière n'a pas valu. Dieu ne t'écoute pas. Tu peux remettre à demain.</em> Les soufis distinguent quatre sources possibles pour une pensée qui surgit dans le cœur (les <em>khawāṭir (خَوَاطِر)</em>) : divine (<em>rabbānī</em>), angélique (<em>malakī</em>), de la nafs (النَّفْس) (<em>nafsānī</em>), satanique (<em>shayṭānī</em>). Apprendre à les distinguer est tout un art de discernement. La règle simple : ce qui te <em>diminue</em> dans la confiance et l'élan vers Dieu n'est jamais de Lui. La waswasa peut aussi devenir maladive — scrupules sur les ablutions, doutes sur la prière refaite dix fois. Les maîtres recommandent alors de <em>ne pas répondre</em> : la waswasa s'éteint dès qu'on cesse de discuter avec elle.",
  "voix_des_maitres": [
    {"auteur": "Coran 114, 4-5", "texte": "« Du mal du susurreur sournois — qui susurre dans les poitrines des hommes. »"}
  ],
  "meditation": "Quelle est la voix basse qui revient le plus en moi ? Si je l'écoute, où me conduit-elle ?",
  "resonance": ["khatir", "qalb", "yaqin", "muraqaba", "dhikr"],
  "lectures_site": []
},
{
  "id": "tazkiyat-an-nafs", "ar": "تَزْكِيَةُ النَّفْس", "tr": "tazkiyat an-nafs", "tr_simple": "tazkiyat an-nafs",
  "fr": "La purification de l'âme",
  "racine": "ز ك و", "racine_sens": "zakā — croître, devenir pur ; tazkiya — purification active",
  "category": "doctrine",
  "tags": ["ego", "voie", "but central"],
  "definition_concise": "Le travail central du soufisme : purifier la nafs (النَّفْس) de ses voiles pour qu'elle reflète la lumière qu'elle reçoit. <em>« Bienheureux celui qui la purifie »</em> (Coran 91, 9).",
  "sens_profond": "Le mot <em>tazkiya</em> contient deux sens : <em>purifier</em> et <em>faire croître</em>. Ce n'est pas seulement enlever des défauts — c'est nourrir une qualité jusqu'à ce qu'elle prenne toute la place. Le Coran lie systématiquement la mission prophétique à la tazkiya : <em>« Il leur récite Ses signes, les purifie, et leur enseigne le Livre et la sagesse. »</em> (62, 2) — l'ordre compte : on ne reçoit vraiment la connaissance qu'après la purification. Pour les soufis, toute la voie est tazkiyat an-nafs (النَّفْس) : du combat contre les maladies du cœur (kibr, ḥasad, ḥubb ad-dunyā, hawā, riyāʾ…) jusqu'à la transformation des qualités humaines en attributs divins (<em>takhalluq bi-akhlāq Allāh</em>). C'est ce qu'on appelle parfois la <em>chimie spirituelle</em> : transmuter le plomb de la nafs ammāra (النَّفْس) en or de la nafs muṭmaʾinna. Le maître véritable est celui qui sait guider cette purification — c'est son rôle premier, plus encore que de transmettre du savoir.",
  "voix_des_maitres": [
    {"auteur": "Coran 91, 7-10", "texte": "« Par une âme et Celui qui l'a façonnée, et lui a inspiré son péché comme sa piété ! Bienheureux qui la purifie, perdu qui la corrompt. »"}
  ],
  "meditation": "Quelle est la maladie du cœur que je travaille en ce moment — et celle que je n'ose même pas regarder ?",
  "resonance": ["nafs", "mujahada", "muhasaba", "akhlaq", "suluk"],
  "lectures_site": []
},
{
  "id": "ananiyya", "ar": "الأَنَانِيَّة", "tr": "al-ananiyya", "tr_simple": "ananiyya",
  "fr": "L'égoïté, le « moi-isme »",
  "racine": "أ ن ا", "racine_sens": "anā — moi, je ; ananiyya — le fait de dire « moi »",
  "category": "anthropologie",
  "tags": ["ego", "moi", "extinction"],
  "definition_concise": "Le sentiment d'être un <em>moi</em> séparé, autonome — le voile fondamental que la voie doit traverser. Tant que je dis vraiment « je », je n'ai pas encore commencé.",
  "sens_profond": "L'ananiyya est plus radicale que la nafs ammāra. Elle n'est pas un défaut moral : c'est la <em>structure</em> du moi en tant qu'il se croit autonome. Tant que je pense, juge, agis depuis le centre <em>je</em>, je suis dans l'ananiyya — même quand je fais le bien, même quand je prie, même quand je crois aimer Dieu. C'est l'égoïté la plus subtile : celle qui s'attribue ses bonnes actions. Bāyazīd al-Bisṭāmī : <em>« J'ai vu Dieu en songe et Il m'a dit : que m'apportes-tu ? J'ai dit : l'ascèse. Il a dit : je n'ai pas besoin de ton ascèse. J'ai dit : la pauvreté. Il a dit : non plus. J'ai dit : alors quoi ? Il a dit : laisse ton « moi » et viens. »</em> Le fanāʾ (الفَنَاء) est précisément l'extinction de l'ananiyya — non pas la suppression de la personne (cela serait absurde), mais la transparence du <em>je</em> au <em>Tu</em>. Quand al-Ḥallāj dit <em>Anā-l-Ḥaqq (أَنَا الْحَقّ)</em> — <em>Je suis le Vrai</em> — ce n'est pas son moi qui parle : c'est l'ananiyya elle-même qui s'est dissoute, et seul reste Celui qui dit <em>Anā</em>.",
  "voix_des_maitres": [
    {"auteur": "Bāyazīd al-Bisṭāmī", "texte": "« Laisse ton « moi » et viens. »"},
    {"auteur": "Rūmī", "texte": "« Quand l'ego s'efface, l'Aimé entre par la porte. »"}
  ],
  "meditation": "Quand je dis « je », qu'est-ce que je désigne — vraiment ?",
  "resonance": ["nafs", "fanaa", "baqaa", "shath", "tawhid"],
  "lectures_site": []
},

# ============== PSYCHOLOGIE SPIRITUELLE (7) ==============
{
  "id": "himma", "ar": "الهِمَّة", "tr": "al-himma", "tr_simple": "himma",
  "fr": "L'aspiration, la résolution intérieure",
  "racine": "ه م م", "racine_sens": "hamma — concevoir, se proposer ; himma — la force qui tend vers",
  "category": "anthropologie",
  "tags": ["aspiration", "volonté", "force du cœur"],
  "definition_concise": "La force concentrée du cœur tendue vers son but. La himma fait l'aspirant ; sans elle, toute pratique se dilue. Pour Ibn ʿArabī, elle a un pouvoir cosmologique : elle <em>oriente</em> le réel.",
  "sens_profond": "La himma n'est pas la simple volonté psychologique. C'est la résolution unifiée de tout l'être vers un point unique — Dieu. Les maîtres disent : <em>« Tu n'es que ta himma. »</em> Celui qui veut Dieu de partout, de tout son temps, de tout son désir — celui-là <em>est</em> sa himma. Celui qui veut Dieu un peu, à ses moments perdus — celui-là est dispersé. Pour Ibn ʿArabī, la himma a une dimension cosmologique : le cœur du saint, par sa concentration unifiée, <em>oriente</em> les événements eux-mêmes. C'est pourquoi la prière du véritable serviteur n'est jamais formelle — elle <em>tient</em> le monde. Le contraire de la himma n'est pas la paresse : c'est la <em>tafriqa (تَفْرِقَة)</em>, la dispersion — l'âme tirée vers cent objets, qui finit par ne plus vouloir vraiment aucun. La voie commence par recueillir la himma : faire converger tous les courants intérieurs vers un seul lit.",
  "voix_des_maitres": [
    {"auteur": "Ibn ʿAṭāʾ Allāh", "texte": "« Comment celui dont la himma est ici-bas pourrait-il prétendre vouloir Dieu ? »"},
    {"auteur": "Adage soufi", "texte": "« Tu n'es que ta himma. »"}
  ],
  "meditation": "Ma himma, en cet instant — vers quoi est-elle vraiment tendue ?",
  "resonance": ["niyya", "ikhlas", "irada", "suluk", "shawq"],
  "lectures_site": []
},
{
  "id": "jadhb", "ar": "الجَذْب", "tr": "al-jadhb", "tr_simple": "jadhb",
  "fr": "L'attraction divine",
  "racine": "ج ذ ب", "racine_sens": "jadhaba — tirer, attirer",
  "category": "etats",
  "tags": ["grâce", "attraction", "pôle"],
  "definition_concise": "Le mouvement par lequel Dieu <em>tire</em> l'âme à Lui sans effort de sa part — la grâce qui devance toute pratique. Un seul instant de jadhb, dit-on, vaut l'œuvre des deux mondes.",
  "sens_profond": "La tradition soufie reconnaît deux mouvements complémentaires : le <em>sulūk (السُّلُوك)</em>, le cheminement actif (l'aspirant marche vers Dieu), et le <em>jadhb</em>, l'attraction passive (Dieu tire l'aspirant à Lui). L'adage classique dit : <em>« Une seule attraction du Vrai vaut toutes les œuvres des hommes et des génies. »</em> Le jadhb peut frapper sans préavis — au cœur d'une lecture, d'une rencontre, d'un samāʿ, parfois sans cause apparente. Il <em>déstabilise</em> : celui qui en est saisi peut, un temps, ne plus pouvoir parler, manger, garder ses gestes habituels. C'est l'état du <em>majdhūb</em> — l'attiré. Les maîtres disent que la voie complète unit les deux : <em>sālik majdhūb</em> (le cheminant attiré) — celui qui marche, mais que Dieu accompagne en le tirant. Sans sulūk, le jadhb laisse l'aspirant désordonné ; sans jadhb, le sulūk dessèche. La grâce et l'effort se cherchent mutuellement.",
  "voix_des_maitres": [
    {"auteur": "Adage soufi", "texte": "« Une seule attraction du Vrai (jadhba) vaut toutes les œuvres des hommes et des génies. »"}
  ],
  "meditation": "Y a-t-il eu, dans ma vie, un moment où j'ai été <em>tiré</em> — sans que je le veuille, sans que je le mérite ?",
  "resonance": ["majdhub", "suluk", "fath", "hal", "ilham"],
  "lectures_site": []
},
{
  "id": "majdhub", "ar": "المَجْذُوب", "tr": "al-majdhūb", "tr_simple": "majdhub",
  "fr": "L'attiré, le saisi par Dieu",
  "racine": "ج ذ ب", "racine_sens": "majdhūb — celui qui a été tiré, attiré",
  "category": "poles",
  "tags": ["pôle", "attraction", "extase"],
  "definition_concise": "Celui que Dieu a saisi par la jadhba (الجَذْب) — qui demeure dans l'attraction sans toujours pouvoir traverser le cheminement ordinaire. Figure paradoxale : très près, et pourtant souvent désordonnée.",
  "sens_profond": "Le majdhūb est celui dont la balance a basculé du côté de l'attraction. Il peut perdre les usages communs — la propreté, les heures, la parole sociale — sans pour autant être fou : il est <em>habité</em>. Les sociétés musulmanes traditionnelles reconnaissaient les majādhīb comme des figures à respecter (et à ne pas imiter) : ils portent une présence brute du sacré, mais ne peuvent pas guider — il leur manque le sulūk (السُّلُوك). À l'inverse, le pur sālik sans jadhb (الجَذْب) peut connaître tout des cartes sans avoir jamais été <em>touché</em>. L'idéal classique est le <em>sālik majdhūb</em> — l'aspirant qui chemine <em>et</em> qui est attiré. C'est le profil du véritable shaykh : il a marché, il a été tiré, il sait à la fois la route et le saisissement. Méfiez-vous, disent les maîtres, à la fois du fou qui se prend pour un saint, et du savant qui se croit arrivé sans avoir été ébranlé.",
  "voix_des_maitres": [
    {"auteur": "Tradition soufie", "texte": "« Le majdhūb n'est pas un fou ; le fou n'est pas un majdhūb. Et seul un cœur éveillé sait distinguer les deux. »"}
  ],
  "meditation": "Suis-je seulement un cheminant qui marche — ou ai-je accepté, parfois, d'être <em>tiré</em> sans comprendre ?",
  "resonance": ["jadhb", "suluk", "sukr", "shath", "wali"],
  "lectures_site": []
},
{
  "id": "waqt", "ar": "الوَقْت", "tr": "al-waqt", "tr_simple": "waqt",
  "fr": "L'instant spirituel",
  "racine": "و ق ت", "racine_sens": "waqata — fixer un temps ; waqt — moment précis",
  "category": "etats",
  "tags": ["instant", "présence", "discernement"],
  "definition_concise": "L'instant tel qu'il est <em>donné</em> par Dieu — le seul lieu où la voie se vit. Le soufi est <em>fils de l'instant</em> : il ne devance pas, il ne s'attarde pas.",
  "sens_profond": "Le waqt, dans le vocabulaire technique, ne désigne pas le temps en général mais l'<em>état</em> dans lequel Dieu place l'aspirant à un moment donné — joie ou serrement, ouverture ou contraction, présence ou absence. La règle d'or : <em>« Le soufi est fils de l'instant »</em> (<em>ibn al-waqt (اِبْنُ الوَقْت)</em>). Il ne s'agit pas de fuir le passé ou l'avenir : il s'agit de reconnaître que la seule prière possible se fait <em>maintenant</em>, avec ce que Dieu m'a donné <em>maintenant</em>. Si je suis dans la joie, je ne dois pas la mépriser au nom d'une austérité d'hier ; si je suis dans le serrement, je ne dois pas faire semblant d'être ailleurs. Al-Junayd : <em>« Le waqt est précieux : si tu le laisses passer, il ne revient pas. »</em> Plus haut encore, certains maîtres parlent de <em>ṣāhib al-waqt (صَاحِبُ الوَقْت)</em> — celui qui n'est plus fils de l'instant mais <em>maître</em> de l'instant : Dieu lui obéit, en quelque sorte, parce qu'il s'est totalement remis à Lui.",
  "voix_des_maitres": [
    {"auteur": "Adage soufi", "texte": "« Le soufi est fils de l'instant. »"},
    {"auteur": "Al-Junayd", "texte": "« Le waqt est précieux : si tu le laisses passer, il ne revient pas. »"}
  ],
  "meditation": "Quel est l'état que Dieu me donne <em>maintenant</em> — et ai-je le courage de le prendre tel qu'il est ?",
  "resonance": ["hal", "huduur", "muraqaba", "qabd-bast", "ibn-al-waqt"],
  "lectures_site": []
},
{
  "id": "ibn-al-waqt", "ar": "اِبْنُ الوَقْت", "tr": "ibn al-waqt", "tr_simple": "ibn al-waqt",
  "fr": "Le fils de l'instant",
  "racine": "ب ن و / و ق ت", "racine_sens": "ibn — fils ; waqt — instant",
  "category": "anthropologie",
  "tags": ["présence", "discernement", "soufi"],
  "definition_concise": "Le soufi accompli : celui qui prend ce que Dieu lui donne à l'instant présent, sans regret de ce qui a été, sans anticipation de ce qui viendra.",
  "sens_profond": "L'expression <em>ibn al-waqt</em> est l'une des définitions classiques du soufi : <em>« Le soufi est fils de l'instant. »</em> Être fils de l'instant, c'est obéir à ce que cet instant exige — non pas à ce qu'un autre instant exigeait. Si l'instant demande la joie, je ne fais pas semblant d'être dans la tristesse. Si l'instant demande l'effort, je ne me réfugie pas dans une grâce passée. C'est une discipline subtile : le moi voudrait <em>continuer</em> ce qu'il aimait, ou <em>anticiper</em> ce qui viendra. L'ibn al-waqt rompt avec cette pesanteur. Mais attention : il ne s'agit pas d'inconstance — bien au contraire, c'est la plus grande fidélité. Fidèle non pas à ses propres états, mais à Celui qui donne les états. Rūmī : <em>« Sois comme une coupe qui ne sait pas ce qu'on y verse — sois fils de l'instant. »</em>",
  "voix_des_maitres": [
    {"auteur": "Définition classique", "texte": "« Le soufi est fils de l'instant. »"}
  ],
  "meditation": "Est-ce que je vis cet instant, ou est-ce que j'essaie d'y faire revivre un autre instant ?",
  "resonance": ["waqt", "huduur", "hal", "tawakkul", "rida"],
  "lectures_site": []
},
{
  "id": "nafas", "ar": "النَّفَس", "tr": "an-nafas", "tr_simple": "nafas",
  "fr": "Le souffle",
  "racine": "ن ف س", "racine_sens": "nafs — âme ; nafas — souffle (même racine)",
  "category": "anthropologie",
  "tags": ["souffle", "présence", "économie spirituelle"],
  "definition_concise": "Le souffle — unité fondamentale de la vie spirituelle. Chaque souffle est un capital : <em>« Compte tes souffles »</em>, disent les maîtres. Le naqshbandī <em>hūsh dar dam</em> — <em>conscience dans le souffle</em> — fait du souffle même le lieu du dhikr (الذِّكْر).",
  "sens_profond": "Pour les soufis, le souffle (<em>nafas</em>) et l'âme (<em>nafs (النَّفْس)</em>) ont la même racine : ce qui anime un corps, c'est ce qui le respire. Chaque inspiration reçoit, chaque expiration donne — l'économie spirituelle se calque sur cette alternance. Les maîtres disent : <em>« Le sage compte ses souffles. »</em> Cela veut dire deux choses : d'abord la précarité — chaque souffle peut être le dernier ; ensuite la dignité — chaque souffle est un don, un instant offert. La voie naqshbandī systématise ce travail dans la règle <em>hūsh dar dam</em> (en persan : <em>conscience dans le souffle</em>) — chaque souffle est habité par le souvenir de Dieu. À l'inspiration, le nom est aspiré ; à l'expiration, il est offert. Le souffle devient lui-même prière. Ibn ʿArabī parle du <em>nafas ar-Raḥmān (نَفَسُ الرَّحْمَٰن)</em> — <em>le Souffle du Miséricordieux</em> : Dieu, par Son Souffle, donne l'existence à toute chose. Notre souffle, alors, est une participation à ce Souffle universel.",
  "voix_des_maitres": [
    {"auteur": "Adage naqshbandī", "texte": "« Hūsh dar dam — conscience dans le souffle. Chaque respiration habitée par Dieu. »"}
  ],
  "meditation": "Ce souffle que je prends maintenant — l'ai-je vraiment senti, ou est-il déjà passé sans moi ?",
  "resonance": ["dhikr", "muraqaba", "huduur", "qalb", "nafs"],
  "lectures_site": []
},
{
  "id": "yaqdha", "ar": "اليَقَظَة", "tr": "al-yaqẓa", "tr_simple": "yaqdha",
  "fr": "L'éveil",
  "racine": "ي ق ظ", "racine_sens": "yaqiẓa — s'éveiller, sortir du sommeil",
  "category": "stations",
  "tags": ["éveil", "première station", "vigilance"],
  "definition_concise": "La toute première station de la voie : se réveiller. Tant qu'on dort dans la ghafla (الغَفْلَة), on est mort. La yaqẓa, c'est l'instant où l'on s'aperçoit qu'on a vécu sans avoir vraiment été là.",
  "sens_profond": "Avant toute autre station, il faut la yaqẓa. C'est elle qui rend la voie possible. Sans elle, toute pratique est mécanique, toute pensée pieuse est de surface. Le hadith dit : <em>« Les hommes dorment ; quand ils meurent, ils s'éveillent. »</em> La yaqẓa, c'est ne pas attendre la mort pour s'éveiller. Elle peut surgir de mille façons : la rencontre d'un maître, la lecture d'un verset, une épreuve, le simple regard de la mort en face. Une fois éveillé, on ne peut plus <em>ne pas savoir</em>. Le sommeil ordinaire devient impossible — non pas le sommeil du corps (qui reste sain), mais celui de l'âme. La yaqẓa précède la tawba : on ne se repent que de ce qu'on a vu. Et la tawba (التَّوْبَة) elle-même devient permanente — non pas un événement, mais une qualité du regard. Ibn ʿAṭāʾ Allāh : <em>« Le sommeil dans le cœur des insouciants est plus mortel que le sommeil de la mort. »</em>",
  "voix_des_maitres": [
    {"auteur": "Hadith", "texte": "« Les hommes dorment ; quand ils meurent, ils s'éveillent. »"},
    {"auteur": "Ibn ʿAṭāʾ Allāh", "texte": "« Comment ton cœur s'éclairerait-il alors que les images de l'ici-bas sont gravées dans son miroir ? »"}
  ],
  "meditation": "Qu'est-ce qui m'a déjà <em>éveillé</em> dans ma vie — et est-ce que je suis resté éveillé ?",
  "resonance": ["ghafla", "tawba", "muraqaba", "muhasaba", "fitra"],
  "lectures_site": []
},

# ============== PRATIQUES (7) ==============
{
  "id": "istighfar", "ar": "الاِسْتِغْفَار", "tr": "al-istighfār", "tr_simple": "istighfar",
  "fr": "La demande de pardon",
  "racine": "غ ف ر", "racine_sens": "ghafara — couvrir, pardonner ; istighfār — demander la couverture du pardon",
  "category": "pratique",
  "tags": ["pardon", "purification", "pratique quotidienne"],
  "definition_concise": "Demander à Dieu de couvrir ses fautes. Pratique quotidienne : <em>« Astaghfiru Llāh »</em> — <em>Je demande pardon à Dieu</em> — réitéré comme un battement du cœur, qui nettoie sans cesse.",
  "sens_profond": "Le mot <em>ghafara</em> signifie d'abord <em>couvrir</em> — comme un manteau qui recouvre une blessure. Demander le pardon, ce n'est pas effacer (Dieu seul efface), c'est demander à être <em>recouvert</em> par Sa miséricorde. L'istighfār, dans la tradition, est l'une des pratiques quotidiennes les plus puissantes — le Prophète disait : <em>« Je demande pardon à Dieu et me tourne vers Lui plus de soixante-dix fois par jour. »</em> Lui qui était sans péché ! Cela montre que l'istighfār n'est pas seulement remède aux fautes : c'est un acte de tendresse, de retour, de proximité — un mouvement permanent du cœur vers Dieu. La formule la plus simple — <em>Astaghfiru Llāh</em> — peut être répétée comme un wird (الوِرْد), comme un souffle. Plus profondément, les maîtres disent : faites istighfār même de votre istighfār — car même votre demande de pardon est une œuvre humaine, qui peut s'enorgueillir.",
  "voix_des_maitres": [
    {"auteur": "Hadith", "texte": "« Par Celui qui tient mon âme dans Sa main, je demande pardon à Dieu plus de soixante-dix fois par jour. »"}
  ],
  "meditation": "Quand ai-je, pour la dernière fois, demandé pardon — non pour un acte précis, mais simplement parce que je n'étais pas tourné vers Lui ?",
  "resonance": ["tawba", "wird", "dhikr", "ikhlas", "muhasaba"],
  "lectures_site": []
},
{
  "id": "duaa", "ar": "الدُّعَاء", "tr": "ad-duʿāʾ", "tr_simple": "duaa",
  "fr": "L'invocation, la prière de demande",
  "racine": "د ع و", "racine_sens": "daʿā — appeler, invoquer",
  "category": "pratique",
  "tags": ["invocation", "demande", "intimité"],
  "definition_concise": "La parole adressée à Dieu — non comme un rituel obligatoire, mais comme un appel. Le hadith dit : <em>« Le duʿāʾ est l'essence du culte. »</em>",
  "sens_profond": "Le duʿāʾ se distingue de la ṣalāt (الصَّلَاة) (qui est ritualisée) : c'est la parole libre adressée à Dieu, dans sa propre langue ou en arabe, à n'importe quel moment. On invoque pour soi, pour ses proches, pour les vivants, pour les morts, pour les ennemis. Le Coran multiplie les modèles de duʿāʾ — celui d'Adam après la chute, celui d'Ibrāhīm, celui de Mūsā, celui de Maryam… On y apprend la grammaire de l'appel : commencer par louer, reconnaître la pauvreté, demander, remercier. Pour les soufis, le duʿāʾ a une dimension paradoxale : on demande, mais on sait que Dieu sait mieux que nous ce qui nous est bon. La vraie réponse au duʿāʾ peut être l'inverse de ce qu'on demandait. Ibn ʿAṭāʾ Allāh : <em>« Que ton retard à répondre, malgré l'insistance de tes demandes, ne te désespère pas — Il a garanti qu'Il répondrait dans ce qu'Il choisit pour toi, non dans ce que tu choisis pour toi, et au moment qu'Il veut, non au moment que tu veux. »</em>",
  "voix_des_maitres": [
    {"auteur": "Hadith", "texte": "« Le duʿāʾ est l'essence du culte. »"},
    {"auteur": "Ibn ʿAṭāʾ Allāh", "texte": "« Il répond, mais dans ce qu'Il choisit pour toi — non dans ce que tu choisis pour toi. »"}
  ],
  "meditation": "Si je n'avais qu'un seul duʿāʾ à offrir à Dieu en cet instant, quel serait-il — vraiment ?",
  "resonance": ["salat", "dhikr", "tawakkul", "rida", "ibada"],
  "lectures_site": []
},
{
  "id": "itikaf", "ar": "الاِعْتِكَاف", "tr": "al-iʿtikāf", "tr_simple": "itikaf",
  "fr": "La retraite en mosquée",
  "racine": "ع ك ف", "racine_sens": "ʿakafa — se tenir auprès, persister ; iʿtikāf — la retraite",
  "category": "pratique",
  "tags": ["retraite", "ramadan", "khalwa"],
  "definition_concise": "Se retirer dans une mosquée — particulièrement durant les dix derniers jours de Ramadan — pour ne plus rien faire que prier, lire, méditer. Forme courte et intense de la khalwa (الخَلْوَة).",
  "sens_profond": "L'iʿtikāf est une pratique prophétique : le Prophète passait les dix derniers jours de Ramadan dans la mosquée, sans en sortir que pour ses besoins essentiels. C'est un retrait du monde social, des affaires, des plaisirs ordinaires — une condensation de l'attention. Pendant trois, sept, dix jours, la vie se réduit à : prier, lire le Coran, faire dhikr (الذِّكْر), dormir un peu, manger sobrement, attendre. C'est précisément l'attente qui compte : on attend la Nuit du Destin (Laylat al-Qadr), où le Coran fut révélé, et où Dieu est <em>plus proche</em>. L'iʿtikāf moderne reste accessible : trois jours dans une mosquée, ou même dans une chambre dédiée. La condition profonde n'est pas l'enceinte, c'est l'<em>arrêt</em>. On cesse les chaînes ordinaires. On laisse Dieu venir. Comme la khalwa des confréries, l'iʿtikāf est une accélération du temps spirituel : on traverse en quelques jours ce qui demanderait des mois.",
  "voix_des_maitres": [
    {"auteur": "Hadith", "texte": "« Le Prophète, durant les dix derniers jours du mois, se retirait en iʿtikāf, et il y mettait du sien — il veillait et réveillait sa famille. »"}
  ],
  "meditation": "Quand ai-je, pour la dernière fois, vraiment <em>arrêté</em> — pour rien d'autre que Lui ?",
  "resonance": ["khalwa", "ramadan", "salat", "dhikr", "uzla"],
  "lectures_site": []
},
{
  "id": "samt", "ar": "الصَّمْت", "tr": "aṣ-ṣamt", "tr_simple": "samt",
  "fr": "Le silence",
  "racine": "ص م ت", "racine_sens": "ṣamata — se taire",
  "category": "pratique",
  "tags": ["silence", "langue", "discipline"],
  "definition_concise": "Le silence intentionnel — non pas l'absence de parole, mais le choix de ne pas parler. Discipline première de la voie : <em>« Qui se tait, est sauvé. »</em>",
  "sens_profond": "La langue est, pour les soufis, l'organe le plus dangereux après le cœur : par elle s'échappent le mensonge, la médisance, le babillage vain, la flatterie, la vantardise. Tant qu'on n'a pas gouverné sa langue, on ne gouverne rien. Le silence est donc une discipline préalable. Beaucoup de maîtres imposaient à leurs aspirants des semaines, parfois des mois de silence absolu — non pour faire taire la parole, mais pour <em>entendre</em> ce que la parole couvrait. Sous le bavardage, il y a une autre voix : celle du cœur. On ne l'entend que dans le silence. Mais le ṣamt soufi ne s'arrête pas au silence des lèvres : il y a aussi le silence intérieur (ne plus monologuer, ne plus juger, ne plus commenter), qui est beaucoup plus difficile. Et plus haut encore, le silence devant Dieu — où l'on cesse même de demander, où l'on cesse même de remercier, où l'on se tient seulement, présent. Les maîtres disent : <em>« Quand tu connais Dieu, ta langue se fatigue. »</em>",
  "voix_des_maitres": [
    {"auteur": "Hadith", "texte": "« Qui croit en Dieu et au Jour dernier, qu'il dise du bien, ou qu'il se taise. »"},
    {"auteur": "Adage soufi", "texte": "« Quand tu connais Dieu, ta langue se fatigue. »"}
  ],
  "meditation": "Aujourd'hui, quelle parole aurais-je dû taire — et quel silence aurais-je dû rompre ?",
  "resonance": ["adab", "khalwa", "muraqaba", "ikhlas", "akhlaq"],
  "lectures_site": []
},
{
  "id": "uzla", "ar": "العُزْلَة", "tr": "al-ʿuzla", "tr_simple": "uzla",
  "fr": "La solitude choisie",
  "racine": "ع ز ل", "racine_sens": "ʿazala — séparer, mettre à part",
  "category": "pratique",
  "tags": ["solitude", "discernement", "discipline"],
  "definition_concise": "Se mettre à l'écart des fréquentations vaines pour préserver le cœur. Non pas la fuite du monde — mais la sélection rigoureuse de ce qui mérite d'occuper l'âme.",
  "sens_profond": "La ʿuzla n'est pas le retrait total (ce serait la rahbāniyya, le monachisme, que l'islam refuse). C'est une discipline du <em>tri</em> : choisir avec qui on parle, qui on écoute, où on va. Les soufis distinguent la ʿuzla extérieure (réduire les fréquentations) et la ʿuzla intérieure (être seul même au milieu de la foule, ne pas laisser le cœur être emporté). Cette seconde forme est plus haute : on peut être seul devant son écran, et avoir le cœur dispersé dans cent affaires. Al-Junayd disait : <em>« J'ai fréquenté soixante shaykh — je n'en ai retiré qu'une chose : la ʿuzla. »</em> Cela ne veut pas dire qu'il a cessé d'enseigner — il a continué jusqu'à la fin. Mais son cœur, lui, s'est tenu à part. La ʿuzla a une condition préalable : il faut être prêt à supporter sa propre compagnie. Beaucoup fuient les autres et découvrent qu'ils ne se supportent pas seuls — c'est précisément le signe que la ʿuzla est nécessaire.",
  "voix_des_maitres": [
    {"auteur": "Al-Junayd", "texte": "« J'ai fréquenté soixante shaykh — je n'en ai retiré qu'une chose : la ʿuzla. »"}
  ],
  "meditation": "Quelles sont les fréquentations qui me dispersent — et qu'est-ce qui m'empêche de m'en éloigner ?",
  "resonance": ["khalwa", "samt", "suhba", "adab", "muraqaba"],
  "lectures_site": []
},
{
  "id": "rabita", "ar": "الرَّابِطَة", "tr": "ar-rābiṭa", "tr_simple": "rabita",
  "fr": "Le lien au maître",
  "racine": "ر ب ط", "racine_sens": "rabaṭa — lier, attacher ; rābiṭa — le lien",
  "category": "pratique",
  "tags": ["maître", "lien", "naqshbandiyya"],
  "definition_concise": "La connexion intérieure que l'aspirant entretient avec son shaykh — particulièrement développée dans la Naqshbandiyya. Visualiser le maître, sentir sa présence, recevoir par son intermédiaire.",
  "sens_profond": "La rābiṭa est l'une des techniques les plus subtiles de la voie, et l'une des plus discutées. Dans la Naqshbandiyya, elle prend une forme codifiée : l'aspirant visualise le visage de son maître au moment de méditer, et par ce lien — comme un canal — la grâce du Prophète, transmise de maître en maître, lui parvient. Les opposants y voient un risque d'idolâtrie ; les défenseurs répondent que le maître n'est pas adoré, il est un <em>miroir</em> — on regarde à travers lui ce qu'on ne peut pas regarder en face. Tant que le miroir est juste, la lumière qui s'y reflète est celle du Prophète, et derrière lui, celle de Dieu. La rābiṭa requiert un maître authentique (un faux maître renverrait sa propre obscurité) et une vigilance constante (on ne s'arrête pas au reflet). Plus largement, dans toutes les voies, le simple fait de penser fréquemment à son shaykh, de se demander <em>« qu'en dirait-il ? »</em>, est déjà une forme de rābiṭa.",
  "voix_des_maitres": [
    {"auteur": "Maître naqshbandī", "texte": "« Que ton cœur reste lié au cœur de ton maître — c'est par lui que la lumière passe. »"}
  ],
  "meditation": "Y a-t-il, dans ma vie, un visage qui me ramène à Dieu rien qu'en m'apparaissant ?",
  "resonance": ["shaykh", "silsila", "suhba", "muraqaba", "baraka"],
  "lectures_site": []
},
{
  "id": "tawajjuh", "ar": "التَّوَجُّه", "tr": "at-tawajjuh", "tr_simple": "tawajjuh",
  "fr": "L'orientation, le tournement",
  "racine": "و ج ه", "racine_sens": "wajh — visage, face ; tawajjuh — tourner sa face vers",
  "category": "pratique",
  "tags": ["orientation", "intention", "présence"],
  "definition_concise": "Tourner son visage — extérieur et intérieur — vers Dieu. Le tawajjuh est aussi le geste du maître qui oriente son aspirant par la seule force de son attention.",
  "sens_profond": "Le mot <em>wajh</em> signifie <em>visage, face</em> — mais aussi, métaphoriquement, <em>direction</em>. <em>Tawajjuh</em>, c'est tourner sa face : extérieurement vers la qibla, intérieurement vers Dieu. Ibrāhīm dit dans le Coran : <em>« Je tourne ma face vers Celui qui a créé les cieux et la terre. »</em> (6, 79). Toute prière commence par un tawajjuh — on s'oriente, on choisit. Au-delà de la prière rituelle, il y a un tawajjuh de chaque instant : à chaque acte, à chaque parole, vers quoi est tourné mon cœur ? Vers Dieu, vers moi-même, vers le regard des autres ? Dans la tradition naqshbandī, le tawajjuh désigne aussi une grâce particulière : le maître <em>tourne son attention</em> vers l'aspirant, et par ce simple regard intérieur, transmet une lumière. Récit célèbre : un disciple demande à son shaykh quelques mots ; le shaykh ne dit rien, le regarde simplement — et le disciple repart transformé. C'est le tawajjuh du maître.",
  "voix_des_maitres": [
    {"auteur": "Coran 6, 79", "texte": "« Je tourne ma face vers Celui qui a créé les cieux et la terre, en monothéiste pur — et je ne suis pas parmi les associateurs. »"}
  ],
  "meditation": "Vers où est tournée ma face — visible et invisible — en cet instant ?",
  "resonance": ["niyya", "ikhlas", "qibla", "rabita", "huduur"],
  "lectures_site": []
},

# ============== ÉTATS COMPLÉMENTAIRES (5) ==============
{
  "id": "inaba", "ar": "الإِنَابَة", "tr": "al-ināba", "tr_simple": "inaba",
  "fr": "Le retour vers Dieu",
  "racine": "ن و ب", "racine_sens": "nāba — revenir, retourner ; ināba — retour répété",
  "category": "stations",
  "tags": ["retour", "repentir", "intimité"],
  "definition_concise": "Le retour permanent du cœur vers Dieu — plus profond que la tawba (qui est l'acte initial). L'ināba est l'habitus du retour : à chaque fois qu'on s'éloigne, on revient.",
  "sens_profond": "La tradition distingue plusieurs degrés du retour : la <em>tawba (التَّوْبَة)</em> est l'événement (on se retourne, on quitte la faute), la <em>nadāma</em> est le regret, l'<em>ināba</em> est la qualité durable du cœur qui ne sait plus revenir ailleurs. Le Coran multiplie les termes : <em>munīb</em> — celui qui revient sans cesse — est l'un des qualificatifs des amis de Dieu. <em>Et orientez-vous vers votre Seigneur (anībū ilā Rabbikum), et soumettez-vous à Lui</em> (39, 54). L'ināba est l'inverse de l'inertie : à chaque distraction, à chaque éloignement, à chaque souffle, on se retourne. C'est moins un acte qu'un battement. Le cœur du <em>munīb</em> bat comme un cœur d'amant qui ne sait plus que revenir. Ibn ʿAṭāʾ Allāh : <em>« Reviens à Lui, fût-ce après une longue absence ; Il accueille avec la même douceur le premier jour et le millième. »</em>",
  "voix_des_maitres": [
    {"auteur": "Coran 39, 54", "texte": "« Orientez-vous vers votre Seigneur, soumettez-vous à Lui avant que le châtiment ne vous arrive. »"}
  ],
  "meditation": "Quand je m'éloigne — combien de temps mets-je à revenir ?",
  "resonance": ["tawba", "istighfar", "qalb", "mahabba", "shawq"],
  "lectures_site": []
},
{
  "id": "talwin-tamkin", "ar": "التَّلْوِين والتَّمْكِين", "tr": "at-talwīn wa-t-tamkīn", "tr_simple": "talwin tamkin",
  "fr": "La coloration et la stabilité",
  "racine": "ل و ن / م ك ن", "racine_sens": "lawn — couleur ; talwīn — changement de couleur. makana — être stable ; tamkīn — affermissement.",
  "category": "etats",
  "tags": ["états changeants", "stabilité", "maturation"],
  "definition_concise": "Le <em>talwīn</em> est l'état de l'aspirant encore changeant — un jour joie, l'autre serrement, un jour présent, l'autre absent. Le <em>tamkīn</em> est l'état du maître arrivé : il ne change plus, parce qu'il <em>est</em> en Dieu.",
  "sens_profond": "Cette paire technique décrit deux étapes de la maturation spirituelle. Tant qu'on chemine, on est <em>coloré</em> par les états : la joie nous remplit puis nous quitte, le serrement vient puis s'en va. On dépend des aḥwāl (الأَحْوَال) — les dons de Dieu qui passent. C'est le talwīn. Puis vient (parfois, pour certains) le <em>tamkīn</em> — l'affermissement. Ce n'est pas que les états cessent — ils continuent — mais on n'est plus emporté. On reste soi-même dans la joie comme dans le serrement. On est <em>ancré</em>. Al-Qushayrī écrit : <em>« Le talwīn est l'attribut du voyageur ; le tamkīn est l'attribut de l'arrivé. »</em> Mais attention : certains maîtres (Ibn ʿArabī notamment) renversent la perspective — le tamkīn dans le talwīn est plus haut que le tamkīn pur, car alors on est stable <em>tout en</em> recevant tous les états. C'est la stabilité du serviteur qui change avec les souffles divins sans jamais perdre son centre.",
  "voix_des_maitres": [
    {"auteur": "Al-Qushayrī", "texte": "« Le talwīn est l'attribut du voyageur ; le tamkīn est l'attribut de l'arrivé. »"}
  ],
  "meditation": "Suis-je colorié par mes états — ou tiens-je en moi quelque chose qui ne change pas ?",
  "resonance": ["hal", "maqam", "qabd-bast", "suluk", "rida"],
  "lectures_site": []
},
{
  "id": "jam-farq", "ar": "الجَمْع والفَرْق", "tr": "al-jamʿ wa-l-farq", "tr_simple": "jam farq",
  "fr": "La réunion et la distinction",
  "racine": "ج م ع / ف ر ق", "racine_sens": "jamaʿa — réunir, rassembler ; faraqa — séparer, distinguer",
  "category": "doctrine",
  "tags": ["unité", "distinction", "vision"],
  "definition_concise": "Le <em>jamʿ</em> est la vision où l'on ne voit que Dieu — tout est Lui, rien d'autre. Le <em>farq</em> est la vision distincte — Dieu est Dieu, la création est création. Les deux sont nécessaires.",
  "sens_profond": "C'est l'une des paires les plus fines du soufisme spéculatif. Dans le <em>jamʿ</em>, l'aspirant est saisi par l'unité : il ne voit plus que Dieu derrière chaque chose, et finalement il oublie les choses elles-mêmes. C'est l'état du <em>fanāʾ (الفَنَاء)</em> — où la dualité s'éteint. Dans le <em>farq</em>, au contraire, il revient à la vision distincte : Dieu reste Dieu, la créature reste créature, et chacun a sa place. Sans le farq, la voie devient confusion (<em>« je suis Dieu »</em>, sans nuance, sans serviteur, sans Loi). Sans le jamʿ, elle reste à la surface (<em>« il y a Dieu, et il y a nous »</em>, sans intimité). Le degré supérieur est le <em>jamʿ al-jamʿ (جَمْعُ الجَمْع)</em> — la réunion de la réunion — où l'on voit à la fois Dieu et la création, non séparés ni confondus. C'est la vision du <em>parfait</em> : voir Lui dans tout, et tout en Lui, sans rien oublier.",
  "voix_des_maitres": [
    {"auteur": "Al-Junayd", "texte": "« Le tawḥīd vrai, c'est que tu sois Lui par Lui — et que tu Lui sois serviteur par toi. »"}
  ],
  "meditation": "Vois-je Dieu et la créature comme deux — ou comme un seul ? Et est-ce que les deux visions s'excluent vraiment ?",
  "resonance": ["fanaa", "baqaa", "tawhid", "tajalli", "tanzih-tashbih"],
  "lectures_site": []
},
{
  "id": "iftiqar", "ar": "الاِفْتِقَار", "tr": "al-iftiqār", "tr_simple": "iftiqar",
  "fr": "La conscience aiguë du besoin",
  "racine": "ف ق ر", "racine_sens": "faqr — pauvreté ; iftiqār — besoin ressenti, dénuement intérieur",
  "category": "stations",
  "tags": ["pauvreté", "besoin", "vérité"],
  "definition_concise": "Sentir, à chaque souffle, qu'on n'a rien — ni l'être, ni le souffle, ni la pensée. L'iftiqār est la vérité de la créature : besoin, besoin, besoin.",
  "sens_profond": "Le faqr (الفَقْر) est la station extérieure (on possède peu) ; l'iftiqār en est la dimension intérieure (on <em>ressent</em> qu'on n'est rien). On peut être pauvre matériellement et nourrir secrètement la vanité du pauvre ; on peut être riche et habité par l'iftiqār — sentir, à chaque souffle, qu'on dépend totalement, qu'on ne maintient rien soi-même. Le Coran dit : <em>« Ô hommes, c'est vous les pauvres en besoin de Dieu, et Dieu est le Riche, le Digne de louange »</em> (35, 15). L'iftiqār est la prise de conscience aiguë de cette structure : être créé, c'est <em>être en manque de</em> son Créateur, à chaque instant. Le souffle suivant n'est pas garanti. La pensée suivante non plus. Tout est tenu. Plus on est conscient de cela, plus le cœur est doux, ouvert, suppliant. L'iftiqār est aussi ce qui éteint le kibr : on ne peut pas se croire grand quand on sent qu'on ne tient pas debout par soi-même.",
  "voix_des_maitres": [
    {"auteur": "Coran 35, 15", "texte": "« Ô hommes, c'est vous les pauvres en besoin de Dieu, et Dieu est le Riche, le Digne de louange. »"}
  ],
  "meditation": "Est-ce que je sens, en ce souffle même, que je ne le tiens pas — que je le reçois ?",
  "resonance": ["faqr", "tawakkul", "uboodiyya", "shukr", "rida"],
  "lectures_site": []
},
{
  "id": "safa", "ar": "الصَّفَاء", "tr": "aṣ-ṣafāʾ", "tr_simple": "safa",
  "fr": "La limpidité du cœur",
  "racine": "ص ف و", "racine_sens": "ṣafā — être pur, limpide ; ṣafāʾ — la pureté transparente",
  "category": "etats",
  "tags": ["pureté", "cœur", "miroir"],
  "definition_concise": "L'état du cœur poli, où Dieu se reflète sans tache. L'une des étymologies les plus retenues du mot <em>ṣūfī</em>. Limpidité — non pas absence, mais transparence.",
  "sens_profond": "Le ṣafāʾ n'est pas un état mais une qualité durable du cœur — sa transparence. Pour les soufis, le cœur est un miroir : ce qu'il reflète dépend de sa propreté. Un miroir terni reflète des choses floues, déformées, partielles. Un miroir poli reflète sans déformer. Le travail de la voie est entièrement un travail de polissage (<em>tajliyat al-qalb</em>). Quand le cœur est limpide, il reflète : Dieu d'abord, puis tout ce qui est, vu en Dieu. Le ṣafāʾ permet la vision juste — non seulement de Dieu, mais aussi de soi (sans illusion), des autres (sans projection), du monde (sans avidité). C'est sans doute cette limpidité que désigne l'étymologie la plus douce du mot <em>ṣūfī (الصُّوفِيّ)</em> — celui dont le cœur est limpide. Plus haut que la limpidité, certains maîtres parlent de la <em>ṣafwat aṣ-ṣafwa</em> — la limpidité de la limpidité — où même la conscience d'être limpide a disparu : pure transparence sans témoin.",
  "voix_des_maitres": [
    {"auteur": "Bishr al-Ḥāfī", "texte": "« Le ṣūfī est celui dont le cœur est devenu limpide pour Dieu. »"}
  ],
  "meditation": "Mon cœur, en cet instant — qu'est-ce qu'il reflète ? Si Dieu s'y regardait, Le verrait-Il sans déformation ?",
  "resonance": ["qalb", "tasawwuf", "sufi", "tajalli", "tazkiyat-an-nafs"],
  "lectures_site": []
},

# ============== COSMOLOGIE (5) ==============
{
  "id": "alam-jabarut", "ar": "عَالَمُ الجَبَرُوت", "tr": "ʿālam al-jabarūt", "tr_simple": "alam al-jabarut",
  "fr": "Le monde de la Toute-Puissance",
  "racine": "ج ب ر", "racine_sens": "jabara — contraindre, imposer ; jabarūt — la souveraineté absolue",
  "category": "cosmologie",
  "tags": ["mondes", "hiérarchie", "puissance"],
  "definition_concise": "Le plus haut des mondes créés — celui des Attributs divins en eux-mêmes, avant toute manifestation distincte. Au-dessus du Malakūt, en dessous de la Lāhūt.",
  "sens_profond": "La cosmologie soufie classique distingue plusieurs <em>mondes</em> (<em>ʿawālim (عَوَالِم)</em>) qui ne sont pas spatiaux mais ontologiques — des degrés de réalité. Le plus bas est le <em>nāsūt</em> (l'humain, le sensible). Au-dessus, le <em>mulk</em> (le visible structuré). Au-dessus encore, le <em>malakūt</em> (le monde des anges, des Noms agissants). Plus haut, le <em>jabarūt</em> — où les Attributs divins se tiennent dans leur pureté, sans encore se distribuer aux êtres. Au sommet, certains maîtres placent la <em>lāhūt</em> — la pure divinité, l'Essence avant les Attributs. Le jabarūt est le monde des <em>aʿyān thābita</em> — les essences immuables, les modèles éternels de chaque chose dans la science divine. Quand un saint accède au jabarūt, il voit les choses non plus comme elles sont en bas, mais comme elles sont <em>dans Sa pensée</em>. C'est l'horizon de la prophétie.",
  "voix_des_maitres": [
    {"auteur": "Ibn ʿArabī", "texte": "« Le jabarūt est le monde où les choses sont vues telles qu'elles sont dans le savoir divin, avant leur descente. »"}
  ],
  "meditation": "Cette chose que je tiens dans la main, ce visage que je regarde — quelle est leur réalité <em>là-haut</em>, avant qu'ils ne descendent ici ?",
  "resonance": ["alam", "alam-mithal", "alam-lahut", "alam-nasut", "asmaa"],
  "lectures_site": []
},
{
  "id": "alam-lahut", "ar": "عَالَمُ اللَّاهُوت", "tr": "ʿālam al-lāhūt", "tr_simple": "alam al-lahut",
  "fr": "Le monde de la pure Divinité",
  "racine": "أ ل ه", "racine_sens": "ilāh — divinité ; lāhūt — la divinité comme telle",
  "category": "cosmologie",
  "tags": ["essence", "mondes", "sommet"],
  "definition_concise": "Le sommet absolu : Dieu en Lui-même, l'Essence avant toute relation, avant tout Attribut distinct. Aucun être créé n'y accède en tant que tel — c'est le pur Mystère.",
  "sens_profond": "La lāhūt désigne la divinité considérée en elle-même, sans aucun rapport aux créatures. C'est l'Essence pure — <em>al-Dhāt</em> — avant que ne se déploient les Noms, les Attributs, les Actes. Aucune contemplation, aucune extase, aucune vision n'atteint la lāhūt en tant que telle — car elle est par définition <em>au-delà de toute manifestation</em>. C'est l'horizon ultime : non un lieu où l'on va, mais un point qui orient. Ibn ʿArabī parle de la <em>ghayb al-ghuyūb</em> — le mystère des mystères — qui est cette lāhūt. Les soufis, parlant de la lāhūt, ne décrivent pas : ils se taisent, ou parlent par négations (<em>« ni ceci, ni cela »</em>). Le tanzīh (التَّنْزِيه) absolu est ici. Pourquoi alors en parler ? Parce que c'est le rappel constant : tout ce que tu connais de Dieu n'est pas Dieu. Toute image, tout Nom, toute extase — sont des dons, mais Dieu reste, derrière, l'Insondable.",
  "voix_des_maitres": [
    {"auteur": "Ibn ʿArabī", "texte": "« La lāhūt est le mystère des mystères — celui dont on ne parle qu'en se taisant. »"}
  ],
  "meditation": "Y a-t-il en moi un endroit où je sais que Dieu est plus que tout ce que je peux dire de Lui ?",
  "resonance": ["dhat", "ghayb", "tanzih-tashbih", "alam", "alam-jabarut"],
  "lectures_site": []
},
{
  "id": "alam-nasut", "ar": "عَالَمُ النَّاسُوت", "tr": "ʿālam an-nāsūt", "tr_simple": "alam an-nasut",
  "fr": "Le monde humain, le monde sensible",
  "racine": "ن و س", "racine_sens": "nās — les hommes ; nāsūt — l'humanité",
  "category": "cosmologie",
  "tags": ["humain", "monde", "incarnation"],
  "definition_concise": "Le monde sensible — celui où nous sommes. Le plus bas dans la hiérarchie, et pourtant celui où la voie se vit. Le nāsūt n'est pas méprisé : il est le lieu de l'épreuve.",
  "sens_profond": "Le nāsūt est le monde de la chair, des sens, du temps, des affaires humaines. Dans certaines lectures rigides, il est ce qu'il faut <em>quitter</em>. Mais la voie soufie majoritaire enseigne autre chose : le nāsūt n'est pas à fuir, il est à <em>habiter</em> autrement. C'est ici, dans ce monde, dans ce corps, dans cette vie ordinaire, que se joue tout le cheminement. Manger, dormir, travailler, se marier, élever des enfants — autant d'occasions de présence ou d'oubli. Le maître véritable est celui qui, ayant traversé les mondes supérieurs, <em>redescend</em> dans le nāsūt sans rien perdre — et y enseigne. La trajectoire prophétique est exactement cela : Muḥammad monte au miʿrāj (ascension nocturne), traverse les sept cieux, atteint <em>qāba qawsayn</em> (la distance de deux arcs ou plus près encore de Dieu), et puis <em>revient</em> — pour transmettre. Sans la redescente, l'expérience est stérile.",
  "voix_des_maitres": [
    {"auteur": "Adage soufi", "texte": "« Sois dans le monde sans être du monde. »"}
  ],
  "meditation": "Suis-je en train d'habiter ce monde — ou de l'attendre que je le quitte ?",
  "resonance": ["dunya", "alam", "alam-mithal", "alam-jabarut", "insan-kamil"],
  "lectures_site": []
},
{
  "id": "alam-arwah", "ar": "عَالَمُ الأَرْوَاح", "tr": "ʿālam al-arwāḥ", "tr_simple": "alam al-arwah",
  "fr": "Le monde des esprits",
  "racine": "ر و ح", "racine_sens": "rūḥ — esprit, souffle ; arwāḥ — esprits (pluriel)",
  "category": "cosmologie",
  "tags": ["esprit", "préexistence", "origine"],
  "definition_concise": "Le monde où les esprits ont préexisté avant la descente dans les corps. C'est là qu'a eu lieu le <em>jour alast</em> — le pacte primordial où Dieu demande : <em>« Ne suis-Je pas votre Seigneur ? »</em>",
  "sens_profond": "Selon la cosmologie soufie, les esprits sont créés avant les corps. Ils existent dans le <em>ʿālam al-arwāḥ</em>, un monde lumineux, immatériel, où ils contemplent Dieu directement. C'est dans ce monde qu'a lieu la scène du <em>mīthāq</em> — le pacte primordial : Dieu réunit tous les esprits et demande : <em>« Ne suis-Je pas votre Seigneur ? »</em> (<em>alastu bi-rabbikum</em>). Tous répondent : <em>« Oui, nous en témoignons »</em> (<em>balā shahidnā</em>, Coran 7, 172). Puis les esprits descendent dans les corps. Ils oublient. Toute la voie est un <em>se rappeler</em> ce moment. Quand l'aspirant fait dhikr (الذِّكْر) — souvenir — ce qu'il essaie de raviver, c'est ce <em>balā</em> du jour alast, ce <em>oui</em> primordial qui le précède. Rūmī : <em>« Ne demande pas pourquoi le rossignol cherche la rose — il l'a entendu chanter <em>là-bas</em>. »</em>",
  "voix_des_maitres": [
    {"auteur": "Coran 7, 172", "texte": "« Ne suis-Je pas votre Seigneur ? — Oui, nous en témoignons. »"}
  ],
  "meditation": "Y a-t-il en moi un souvenir qui n'a pas de date — comme si j'avais déjà dit <em>oui</em> avant de pouvoir parler ?",
  "resonance": ["mithaq", "ruh", "alam", "fitra", "dhikr"],
  "lectures_site": []
},
{
  "id": "alam-amr", "ar": "عَالَمُ الأَمْر", "tr": "ʿālam al-amr", "tr_simple": "alam al-amr",
  "fr": "Le monde de l'Ordre divin",
  "racine": "أ م ر", "racine_sens": "amr — ordre, commandement",
  "category": "cosmologie",
  "tags": ["ordre", "création", "verbe"],
  "definition_concise": "Le monde de l'Ordre — où Dieu crée par Sa parole : <em>« Sois »</em>, et la chose est. Opposé au <em>ʿālam al-khalq</em>, le monde du modelage progressif.",
  "sens_profond": "Le Coran établit cette distinction : <em>« Son Ordre, lorsqu'Il veut une chose, est seulement qu'Il dise : Sois ! — et elle est »</em> (36, 82). Les soufis en tirent une cosmologie : il y a deux modes de création — par <em>khalq</em> (modelage, façonnage, dans le temps, à travers des causes secondes) et par <em>amr</em> (ordre immédiat, sans intermédiaire, hors du temps). Le monde de l'amr inclut les esprits, les anges, le <em>kun</em> divin, le Verbe agissant. C'est aussi le monde du miracle — où l'ordre habituel des causes est suspendu par un commandement direct. Quand un saint accède au monde de l'amr, il peut, par permission divine, parler à une chose comme Dieu lui parle : <em>« Sois telle. »</em> Mais peu y accèdent, et ceux qui y accèdent l'utilisent rarement — car le pouvoir n'est jamais le but. La connaissance du ʿālam al-amr est surtout une clé : comprendre que sous le monde des causes (où nous vivons d'ordinaire), il y a un monde du commandement direct, et que le second est plus réel que le premier.",
  "voix_des_maitres": [
    {"auteur": "Coran 36, 82", "texte": "« Son Ordre, lorsqu'Il veut une chose, est seulement qu'Il dise : Sois ! — et elle est. »"}
  ],
  "meditation": "Cette vie que je tiens — est-elle l'effet d'une chaîne de causes, ou la conséquence d'un <em>« Sois »</em> ?",
  "resonance": ["alam", "alam-jabarut", "ruh", "qadar", "muʿjiza"],
  "lectures_site": []
},

# ============== DOCTRINE (5) ==============
{
  "id": "mithaq", "ar": "المِيثَاق", "tr": "al-mīthāq", "tr_simple": "mithaq",
  "fr": "Le pacte primordial",
  "racine": "و ث ق", "racine_sens": "wathiqa — être ferme, lié ; mīthāq — pacte solennel",
  "category": "doctrine",
  "tags": ["pacte", "origine", "mémoire"],
  "definition_concise": "Le pacte que Dieu a conclu avec toutes les âmes <em>avant</em> la création des corps. Il leur demande : <em>« Ne suis-Je pas votre Seigneur ? »</em> Toutes répondent : <em>« Oui. »</em>",
  "sens_profond": "Le mīthāq est la scène cosmogonique centrale du soufisme. Coran 7, 172 : <em>« Et lorsque ton Seigneur tira des fils d'Adam, de leurs reins, leur descendance, et les fit témoigner contre eux-mêmes : Ne suis-Je pas votre Seigneur ? Ils dirent : Oui, nous en témoignons. »</em> Tous les humains, dans leur préexistence, ont dit <em>oui</em>. Ce <em>oui</em> précède la naissance, l'éducation, la culture, la religion confessée. Il est le fond originel de chaque âme. Toute quête spirituelle, dans la lecture soufie, est un <em>se rappeler</em> ce moment. Quand quelqu'un, en lisant un verset, en entendant une musique, en rencontrant un visage, se sent <em>traversé</em> par quelque chose qu'il connaît sans le connaître — c'est le mīthāq qui remonte. La conversion n'est jamais qu'un retour. La fitra (الفِطْرَة) (la nature originelle) est précisément ce dépôt du mīthāq dans chaque être. Rien à apprendre — tout à <em>se souvenir</em>.",
  "voix_des_maitres": [
    {"auteur": "Coran 7, 172", "texte": "« Ne suis-Je pas votre Seigneur ? — Oui, nous en témoignons. »"}
  ],
  "meditation": "Quel est, en moi, ce <em>oui</em> que je n'ai pas appris — et que je n'arrive pas à retirer ?",
  "resonance": ["fitra", "alam-arwah", "dhikr", "ruh", "marifa"],
  "lectures_site": []
},
{
  "id": "yawm-alast", "ar": "يَوْمُ أَلَسْت", "tr": "yawm alast", "tr_simple": "yawm alast",
  "fr": "Le jour du « Ne suis-Je pas »",
  "racine": "أ ل س ت", "racine_sens": "alastu — Ne suis-Je pas ?",
  "category": "doctrine",
  "tags": ["origine", "amour", "mémoire"],
  "definition_concise": "Le jour du mīthāq (المِيثَاق) — celui où Dieu demanda aux âmes : <em>alastu bi-rabbikum ?</em> Pour les poètes soufis, particulièrement persans, c'est le jour de la première rencontre, et toute la vie une nostalgie.",
  "sens_profond": "Si le mīthāq est le concept doctrinal, <em>yawm alast</em> est son nom poétique. C'est l'expression abrégée du verset : <em>alastu bi-rabbikum</em> (<em>« Ne suis-Je pas votre Seigneur ? »</em>). Pour Rūmī, Ḥāfeẓ, ʿAṭṭār, Sanāʾī, tout l'amour mystique n'est qu'une reprise de cet instant. L'âme a vu le Visage avant de descendre, elle l'a oublié sous le voile du corps, et toute sa vie elle pleure cette séparation — sans savoir parfois ce qu'elle pleure. Ḥāfeẓ : <em>« Depuis le jour d'alast jusqu'au jour du Jugement, mon contrat avec l'Aimé n'a pas changé d'une lettre. »</em> Le saint, le poète, l'amoureux véritable, le pauvre <em>(faqīr)</em> — ce sont ceux qui n'ont pas oublié. Toute la voie consiste à <em>réveiller le souvenir</em>. Le samāʿ (السَّمَاع), particulièrement, est une technique pour cela : entendre une mélodie qui ressemble à <em>la</em> mélodie d'alast, et soudain se rappeler.",
  "voix_des_maitres": [
    {"auteur": "Ḥāfeẓ", "texte": "« Depuis le jour d'alast jusqu'au jour du Jugement, mon contrat avec l'Aimé n'a pas changé d'une lettre. »"},
    {"auteur": "Rūmī", "texte": "« Écoute ce roseau, comme il se lamente — c'est la nostalgie d'alast. »"}
  ],
  "meditation": "Y a-t-il en moi une nostalgie pour ce que je n'ai jamais consciemment connu ?",
  "resonance": ["mithaq", "fitra", "shawq", "sama", "alam-arwah"],
  "lectures_site": []
},
{
  "id": "haqiqa-muhammadiyya", "ar": "الحَقِيقَة المُحَمَّدِيَّة", "tr": "al-ḥaqīqa al-muḥammadiyya", "tr_simple": "haqiqa muhammadiyya",
  "fr": "La Réalité muhammadienne",
  "racine": "ح ق ق / ح م د", "racine_sens": "ḥaqīqa — réalité, vérité essentielle ; Muḥammad — le très loué",
  "category": "doctrine",
  "tags": ["prophétie", "cosmologie", "métaphysique"],
  "definition_concise": "La réalité spirituelle de Muḥammad — non l'homme historique seul, mais la première création de Dieu, le miroir originel à travers lequel le monde tout entier a été créé.",
  "sens_profond": "Pour Ibn ʿArabī et toute la tradition métaphysique qui le suit, Muḥammad n'est pas seulement le Prophète historique du VII<sup>e</sup> siècle — il est aussi une réalité cosmique, créée avant le monde. Hadith célèbre : <em>« La première chose que Dieu a créée, c'est ma lumière. »</em> Cette lumière première — le <em>nūr muḥammadī (النُّورُ المُحَمَّدِيّ)</em> — est le prototype, le miroir intermédiaire entre Dieu et la création. Tout être qui vient à l'existence vient à travers cette réalité. Chaque prophète (Ādam, Nūḥ, Ibrāhīm, Mūsā, ʿĪsā…) est une <em>part</em> de cette réalité muhammadienne ; Muḥammad seul la rassemble tout entière. C'est pourquoi il est appelé <em>khātam al-anbiyāʾ</em> — sceau des prophètes. Pour les soufis, la ḥaqīqa muḥammadiyya est aussi l'<em>insān kāmil (إِنْسَانٌ كَامِل)</em> archétypal : l'humain accompli, modèle de toute marche spirituelle. Quand un aspirant pratique la rābiṭa (الرَّابِطَة) avec son shaykh, c'est, par-delà le shaykh, à cette ḥaqīqa qu'il se lie.",
  "voix_des_maitres": [
    {"auteur": "Hadith", "texte": "« La première chose que Dieu a créée, c'est ma lumière. »"},
    {"auteur": "Ibn ʿArabī", "texte": "« Il est la première manifestation et la dernière compréhension. »"}
  ],
  "meditation": "Quand je dis le nom <em>Muḥammad</em>, est-ce un homme du passé, ou une lumière qui me précède ?",
  "resonance": ["nubuwwa", "insan-kamil", "nur", "nur-muhammadi", "rabita"],
  "lectures_site": []
},
{
  "id": "nur-muhammadi", "ar": "النُّورُ المُحَمَّدِيّ", "tr": "an-nūr al-muḥammadī", "tr_simple": "nur muhammadi",
  "fr": "La lumière muhammadienne",
  "racine": "ن و ر / ح م د", "racine_sens": "nūr — lumière ; muḥammadī — relatif à Muḥammad",
  "category": "doctrine",
  "tags": ["lumière", "prophétie", "création"],
  "definition_concise": "La première lumière créée — pure manifestation divine, par laquelle tout le reste a été créé. Substance subtile dont les prophètes, puis les saints, héritent.",
  "sens_profond": "Le nūr muḥammadī est l'aspect lumineux de la ḥaqīqa muḥammadiyya (الحَقِيقَة المُحَمَّدِيَّة). Avant que le monde ne soit, Dieu créa cette lumière ; puis, de cette lumière, Il créa toutes choses. Ce n'est pas une lumière physique mais une réalité subtile — pure manifestation divine, premier voile. Cette lumière s'est transmise prophète après prophète, de Ādam à Muḥammad, comme un héritage qui ne se diminue pas en se partageant. À la mort du Prophète, elle se distribue entre les saints (<em>awliyāʾ</em>) qui la portent ensuite — chacun selon sa capacité, chacun selon sa fonction. Tout maître authentique en porte une part. C'est ce qui explique, pour les soufis, l'expérience de la baraka (البَرَكَة) auprès d'un saint : on est touché par une lumière qui, par sa silsila (السِّلْسِلَة), remonte jusqu'au Prophète, et au-delà jusqu'à la première création. Le pèlerinage aux tombes des saints n'est pas adoration du saint, mais visite à un lieu où cette lumière s'est posée.",
  "voix_des_maitres": [
    {"auteur": "Hadith", "texte": "« La première chose que Dieu a créée, c'est ma lumière. »"}
  ],
  "meditation": "Y a-t-il, dans ma vie, des moments où j'ai touché une lumière qui ne venait pas d'ici-bas ?",
  "resonance": ["nur", "haqiqa-muhammadiyya", "baraka", "silsila", "tajalli"],
  "lectures_site": []
},
{
  "id": "isma", "ar": "العِصْمَة", "tr": "al-ʿiṣma", "tr_simple": "isma",
  "fr": "L'inviolabilité, la protection divine",
  "racine": "ع ص م", "racine_sens": "ʿaṣama — protéger, préserver",
  "category": "doctrine",
  "tags": ["prophétie", "protection", "infaillibilité"],
  "definition_concise": "La préservation que Dieu accorde à Ses prophètes contre le péché et l'erreur — et, dans une moindre mesure, à Ses saints contre les déviations majeures.",
  "sens_profond": "La ʿiṣma désigne au sens strict l'<em>infaillibilité</em> des prophètes : ils sont préservés du péché grave, du mensonge, de l'erreur doctrinale. Ce n'est pas qu'ils sont incapables de pécher (cela contredirait leur liberté), mais que Dieu les <em>protège</em> à l'instant où la faute pourrait survenir. La théologie distingue la ʿiṣma absolue (totale, après la mission prophétique) de la ʿiṣma relative (qui peut admettre quelques erreurs mineures, vite corrigées). Pour les soufis, une forme atténuée de ʿiṣma est accordée aux saints : non l'infaillibilité, mais une <em>protection</em> contre les déviations majeures. Le saint authentique est gardé — par Dieu, par sa silsila (السِّلْسِلَة), par sa propre vigilance — de ce qui pourrait le faire chuter. Cette protection n'est jamais un dû : elle peut se retirer si le saint oublie son rang. La ʿiṣma véritable, dit-on, est invisible : ceux qui s'en prévalent l'ont déjà perdue.",
  "voix_des_maitres": [
    {"auteur": "Théologie classique", "texte": "« Les prophètes sont protégés du péché et de l'erreur — non parce qu'ils ne peuvent pas, mais parce que Dieu les empêche. »"}
  ],
  "meditation": "Y a-t-il un endroit en moi qui sait que je suis tenu — que je ne tomberai pas plus bas que ce que Dieu permet ?",
  "resonance": ["nubuwwa", "wali", "karamat", "tawfiq", "baraka"],
  "lectures_site": []
},

# ============== EXTINCTION / SUBSISTANCE (4) ==============
{
  "id": "mahw", "ar": "المَحْو", "tr": "al-maḥw", "tr_simple": "mahw",
  "fr": "L'effacement",
  "racine": "م ح و", "racine_sens": "maḥā — effacer, oblitérer",
  "category": "extinction",
  "tags": ["effacement", "fanaa", "purification"],
  "definition_concise": "L'effacement des attributs humains pour laisser place aux attributs divins. Moins radical que le fanāʾ (الفَنَاء) : non la disparition du moi, mais la <em>raturation</em> de ce qui en lui empêche Dieu.",
  "sens_profond": "Le maḥw est l'opération inverse de l'<em>ithbāt</em> (l'établissement, l'affirmation). On <em>efface</em> du cœur ce qui ne devrait pas y être : les défauts, les attaches, les habitudes mortes, les vieilles identités. On <em>établit</em> à la place ce qui doit y être : les qualités divines réfléchies dans le serviteur — la patience, la générosité, la véracité, la miséricorde. Le couple <em>maḥw / ithbāt</em> est aussi connu sous d'autres noms : <em>takhliya / taḥliya</em> (vidange / parure), <em>tafriq / jamʿ</em>. C'est le mouvement constant de la voie : on enlève, on remet. On déconstruit les voiles, on installe les présences. Le maḥw demande une vigilance constante — sans elle, ce qu'on a effacé revient. Et un seul oubli peut redéfaire des années d'effacement. Ibn ʿAṭāʾ Allāh : <em>« Comment ton cœur s'éclairerait-il alors que les images de l'ici-bas y sont gravées comme dans un miroir ? »</em> — la cure est d'effacer les images, l'une après l'autre.",
  "voix_des_maitres": [
    {"auteur": "Ibn ʿAṭāʾ Allāh", "texte": "« Comment ton cœur s'éclairerait-il alors que les images de l'ici-bas y sont gravées comme dans un miroir ? »"}
  ],
  "meditation": "Qu'est-ce qui, en moi, demande à être effacé — non parce que c'est mauvais, mais parce que cela prend la place de Lui ?",
  "resonance": ["fanaa", "tazkiyat-an-nafs", "muhasaba", "ithbat", "tawba"],
  "lectures_site": []
},
{
  "id": "ithbat", "ar": "الإِثْبَات", "tr": "al-ithbāt", "tr_simple": "ithbat",
  "fr": "L'établissement, l'affirmation",
  "racine": "ث ب ت", "racine_sens": "thabata — être ferme, établi ; ithbāt — affermissement",
  "category": "extinction",
  "tags": ["établissement", "baqaa", "subsistance"],
  "definition_concise": "Le contre-mouvement du maḥw (المَحْو) : établir dans le cœur, à la place de ce qu'on a effacé, les qualités divines qui doivent l'habiter. Sans ithbāt, le maḥw laisse le cœur vide.",
  "sens_profond": "Effacer ne suffit pas. Si on n'établit rien à la place, le vide attire d'autres images, parfois pires. C'est pourquoi la tradition couple toujours maḥw et ithbāt : <em>« Vide la maison de ses idoles — puis fais-y entrer le Roi. »</em> L'ithbāt établit dans le cœur les qualités divines réfléchies : la <em>ṣabr (الصَّبْر)</em> (patience) au lieu de l'impatience ; l'<em>ikhlāṣ (إِخْلَاص)</em> au lieu de la duplicité ; la <em>maḥabba (المَحَبَّة)</em> au lieu de la peur ; le <em>shukr (الشُّكْر)</em> au lieu de la plainte. Mais l'ithbāt va plus loin que la simple discipline morale : il établit la <em>présence</em> de Dieu Lui-même dans le cœur, par le dhikr (الذِّكْر) répété, par la muraqaba (المُرَاقَبَة), par la ḥuḍūr (الحُضُور) constante. Au bout, le serviteur ne s'établit plus dans des qualités, il s'établit en <em>Lui</em> — c'est le baqāʾ (البَقَاء), la subsistance par Dieu.",
  "voix_des_maitres": [
    {"auteur": "Adage soufi", "texte": "« Vide la maison de ses idoles — puis fais-y entrer le Roi. »"}
  ],
  "meditation": "Si je laissais Dieu remplir l'espace qu'Il m'a fait — qu'est-ce qui prendrait la place de ce que je veux garder ?",
  "resonance": ["mahw", "baqaa", "dhikr", "muraqaba", "akhlaq"],
  "lectures_site": []
},
{
  "id": "jam-al-jam", "ar": "جَمْعُ الجَمْع", "tr": "jamʿ al-jamʿ", "tr_simple": "jam al-jam",
  "fr": "La réunion de la réunion",
  "racine": "ج م ع", "racine_sens": "jamaʿa — réunir ; jamʿ al-jamʿ — la réunion de la réunion",
  "category": "extinction",
  "tags": ["unité", "sommet", "vision parfaite"],
  "definition_concise": "Le sommet de la vision : voir Dieu <em>et</em> la création, non séparés, non confondus. Au-delà du fanāʾ (الفَنَاء) (où la créature s'efface) et du farq (الفَرْق) (où elle se distingue), c'est la vision qui contient les deux.",
  "sens_profond": "Le jamʿ al-jamʿ est, pour les soufis spéculatifs, la vision la plus haute. Dans le pur <em>jamʿ</em>, on ne voit que Dieu — la création s'efface, l'aspirant disparaît, il ne reste que Lui. C'est l'état du <em>fanāʾ</em>. Dans le pur <em>farq</em>, on voit la créature distincte de Dieu — Dieu est Dieu, la créature est créature. C'est la vision juridique, normale, qui sauve de la confusion. Le jamʿ al-jamʿ contient les deux : on voit Dieu dans la création, et la création <em>en</em> Dieu, sans séparer, sans confondre. C'est la vision du <em>parfait</em>, du <em>insān kāmil (إِنْسَانٌ كَامِل)</em>. Sa formule paradoxale : <em>« Il est Lui, et Il n'est pas Lui ; Il est la créature, et Il n'est pas la créature. »</em> Ibn ʿArabī, dans les <em>Fuṣūṣ al-Ḥikam (فُصُوصُ الحِكَم)</em>, en fait l'horizon ultime. Concrètement : on accomplit la Loi parfaitement (farq), tout en sachant que Dieu agit à travers chaque geste (jamʿ), et que cette double vérité ne se contredit pas — elle se <em>résout</em> dans le cœur du saint accompli.",
  "voix_des_maitres": [
    {"auteur": "Ibn ʿArabī", "texte": "« Il est Lui, et Il n'est pas Lui — celui qui comprend cela connaît le jamʿ al-jamʿ. »"}
  ],
  "meditation": "Suis-je capable de voir, dans un même regard, l'unité de tout et la dignité particulière de chaque chose ?",
  "resonance": ["jam-farq", "fanaa", "baqaa", "tawhid", "insan-kamil"],
  "lectures_site": []
},
{
  "id": "fayd", "ar": "الفَيْض", "tr": "al-fayḍ", "tr_simple": "fayd",
  "fr": "L'effusion divine",
  "racine": "ف ي ض", "racine_sens": "fāḍa — déborder, se répandre ; fayḍ — l'effusion qui sort de soi",
  "category": "doctrine",
  "tags": ["grâce", "effusion", "création"],
  "definition_concise": "L'effusion par laquelle Dieu se répand dans la création — non par nécessité, mais par surabondance d'amour. Concept central de la métaphysique soufie, particulièrement chez Ibn ʿArabī.",
  "sens_profond": "Le fayḍ est une métaphore vieille comme la philosophie : Dieu, en Sa plénitude, <em>déborde</em>. Le monde n'est pas un acte arbitraire mais une effusion — comme l'eau d'une source ne peut pas s'empêcher de sortir. Pourquoi ? À cause du hadith qudsī : <em>« J'étais un trésor caché, J'ai aimé être connu — alors J'ai créé les êtres pour qu'ils Me connaissent. »</em> L'amour de Dieu pour Sa propre manifestation est la cause du fayḍ. Ibn ʿArabī distingue plusieurs niveaux : le <em>fayḍ al-aqdas</em> (l'effusion la plus sainte) — Dieu dans Son auto-manifestation à Lui-même ; le <em>fayḍ al-muqaddas</em> (l'effusion sainte) — Dieu se manifestant à travers les essences immuables ; et enfin la création concrète, qui en découle. Chaque souffle de chaque créature est, à chaque instant, soutenu par un fayḍ — sans cela, l'existence s'effondrerait. La grâce qui touche le saint, l'inspiration du poète, le souffle même de l'homme ordinaire — tout est fayḍ.",
  "voix_des_maitres": [
    {"auteur": "Hadith qudsī", "texte": "« J'étais un trésor caché, J'ai aimé être connu — alors J'ai créé les êtres pour qu'ils Me connaissent. »"}
  ],
  "meditation": "Si chaque souffle est un fayḍ — qu'est-ce qui m'empêche de le recevoir comme tel ?",
  "resonance": ["rahma", "tajalli", "alam-jabarut", "nur", "nubuwwa"],
  "lectures_site": []
},

# ============== CHEMINEMENT (7) ==============
{
  "id": "bidaya", "ar": "البِدَايَة", "tr": "al-bidāya", "tr_simple": "bidaya",
  "fr": "Le commencement",
  "racine": "ب د أ", "racine_sens": "badaʾa — commencer, débuter",
  "category": "stations",
  "tags": ["commencement", "début", "voie"],
  "definition_concise": "Le premier moment de la voie — celui où l'on n'est plus dans la ghafla (الغَفْلَة), mais où l'on n'a encore rien parcouru. La bidāya est précieuse parce que tout y est encore possible.",
  "sens_profond": "Les soufis distinguent bidāya (commencement) et nihāya (fin) — non comme deux moments dans le temps, mais comme deux qualités de la voie. Le commençant (<em>mubtadiʾ</em>) a besoin d'efforts, de pratiques, de lectures, d'un maître proche, d'encouragements. Tout est nouveau pour lui : chaque verset, chaque méditation, chaque expérience peut le bouleverser. C'est aussi la période la plus fragile — où l'on peut tout abandonner pour une seule difficulté. Les maîtres recommandent au commençant : régularité avant intensité, suḥba (la compagnie des frères), patience avec soi-même. La bidāya a une beauté propre : la fraîcheur de la première fois. Certains maîtres disent même que tout grand cheminant garde, sous toutes ses années, un <em>cœur de commençant</em> — c'est-à-dire la capacité à s'émerveiller, à recevoir, à pleurer devant un verset. Sans ce cœur, on devient un savant sec.",
  "voix_des_maitres": [
    {"auteur": "Adage soufi", "texte": "« Garde le cœur du commençant — c'est lui qui pleure, et qui voit. »"}
  ],
  "meditation": "Suis-je encore capable de pleurer devant un verset — ou ai-je <em>déjà entendu</em> ?",
  "resonance": ["mubtadiʾ", "nihaya", "tawba", "fitra", "shawq"],
  "lectures_site": []
},
{
  "id": "nihaya", "ar": "النِّهَايَة", "tr": "an-nihāya", "tr_simple": "nihaya",
  "fr": "L'achèvement",
  "racine": "ن ه و", "racine_sens": "nahā — arriver à la fin",
  "category": "stations",
  "tags": ["fin", "achèvement", "arrivée"],
  "definition_concise": "Le terme de la voie — non un lieu où l'on s'arrête, mais un état où l'on est devenu ce que l'on cherchait. La nihāya rejoint la bidāya : à la fin, on est nu comme au commencement.",
  "sens_profond": "La nihāya n'est pas une <em>fin</em> au sens où la voie s'arrêterait : tant qu'on respire, on chemine. Mais c'est l'état du <em>muntahī</em> — celui qui est arrivé. Plus besoin d'efforts artificiels : la pratique est devenue sa nature. Plus besoin de chercher : ce qu'il cherchait l'a trouvé. Il n'a plus à <em>se rappeler</em> Dieu — il <em>vit</em> en Lui. Et pourtant, paradoxe central de la mystique : à la fin, on est ramené au commencement. On retrouve la fraîcheur de l'enfant, le <em>oui</em> simple de la fitra. Les maîtres disent : <em>« La fin des cheminants est le commencement des arrivants. »</em> Et plus haut : <em>« Le retour est plus complet que l'aller. »</em> Le muntahī revient parmi les hommes — non pas par déchéance, mais pour transmettre. Il enseigne. Il accueille. Il ne se distingue plus extérieurement de ses frères — c'est intérieurement qu'il est tout autre. Junayd dit : <em>« La couleur de l'eau, c'est la couleur de son récipient. »</em> Le muntahī prend la forme de tout récipient sans rien perdre de son eau.",
  "voix_des_maitres": [
    {"auteur": "Al-Junayd", "texte": "« La couleur de l'eau, c'est la couleur de son récipient. »"}
  ],
  "meditation": "Y a-t-il une part en moi qui est déjà <em>arrivée</em> — qui sait, sans chercher ?",
  "resonance": ["bidaya", "muntahi", "baqaa", "insan-kamil", "wali"],
  "lectures_site": []
},
{
  "id": "mubtadiʾ", "ar": "المُبْتَدِئ", "tr": "al-mubtadiʾ", "tr_simple": "mubtadi",
  "fr": "Le commençant",
  "racine": "ب د أ", "racine_sens": "ibtadaʾa — débuter ; mubtadiʾ — celui qui commence",
  "category": "poles",
  "tags": ["commençant", "aspirant", "premier degré"],
  "definition_concise": "L'aspirant à la voie qui en est au tout début — encore plein de zèle, de questions, d'erreurs naïves. Le mubtadiʾ a besoin d'un maître proche, de règles claires, et de la suḥba.",
  "sens_profond": "Le mubtadiʾ traverse une période passionnante et dangereuse. Passionnante : tout est nouveau, chaque expérience peut être bouleversante, le cœur s'enflamme facilement. Dangereuse : on peut prendre une émotion forte pour une station, une lecture pour une réalisation, un maître pour un dieu. Beaucoup tombent au début — non pas dans la faute, mais dans l'<em>excès</em> (rigorisme, scrupule, exaltation), ou dans la déception (quand l'enthousiasme initial retombe). Les maîtres insistent : le mubtadiʾ doit s'attacher à un guide vivant, suivre les pratiques de base avec régularité (prière, dhikr (الذِّكْر), lecture, suḥba), et ne pas se précipiter sur les ouvrages des grands ouvrants (Ibn ʿArabī, Niffarī, al-Ḥallāj) avant d'avoir les fondations. La règle d'or : <em>la régularité avant l'intensité</em>. Mieux vaut faire dix minutes de dhikr (الذِّكْر) chaque jour pendant dix ans, que cinq heures un jour et plus rien la semaine suivante.",
  "voix_des_maitres": [
    {"auteur": "Adage soufi", "texte": "« Au commençant, deux ennemis : la précipitation et le découragement. »"}
  ],
  "meditation": "Suis-je un mubtadiʾ qui se croit avancé — ou un avancé qui a oublié d'être mubtadiʾ ?",
  "resonance": ["bidaya", "murid", "shaykh", "wird", "suluk"],
  "lectures_site": []
},
{
  "id": "muntahi", "ar": "المُنْتَهِي", "tr": "al-muntahī", "tr_simple": "muntahi",
  "fr": "L'arrivé, l'accompli",
  "racine": "ن ه و", "racine_sens": "intahā — arriver à la fin ; muntahī — celui qui est arrivé",
  "category": "poles",
  "tags": ["accomplissement", "saint", "maître"],
  "definition_concise": "Celui qui est arrivé au terme de la voie — non comme un acquis fini, mais comme une qualité durable de l'être. Le muntahī ne se signale plus par des prouesses : il est devenu <em>simple</em>.",
  "sens_profond": "Le muntahī a traversé les efforts du mubtadiʾ et les expériences du wāṣil (l'arrivant). Maintenant, il est. Sa caractéristique première est la simplicité : il ne se distingue plus extérieurement, il ne porte plus de signes, il vit comme un homme parmi les hommes. Mais ceux qui ont l'œil reconnaissent en lui une présence particulière — la <em>sakīna</em>, la paix qui descend. Il a la connaissance sans avoir besoin de la montrer ; les pouvoirs (s'ils lui sont donnés) sans avoir besoin de les exercer ; l'autorité spirituelle sans imposer. Le muntahī, paradoxalement, est souvent revenu à la pratique ordinaire — il fait les prières comme tout le monde, il jeûne comme tout le monde, il vit. Mais derrière la simplicité de ses gestes, il y a une plénitude que les autres ne perçoivent qu'en s'approchant. Les maîtres distinguent encore le <em>muntahī al-muntahīn</em> — l'arrivé des arrivés — qui est devenu transparent à un point tel qu'il <em>disparaît</em> dans Dieu sans cesser d'être présent aux hommes.",
  "voix_des_maitres": [
    {"auteur": "Tradition soufie", "texte": "« Le muntahī ne se voit plus — c'est ce qui le distingue. »"}
  ],
  "meditation": "Y a-t-il, dans ma vie, un être que j'ai reconnu <em>arrivé</em> — non par ses paroles, mais par sa simple présence ?",
  "resonance": ["nihaya", "wali", "insan-kamil", "baqaa", "wasl"],
  "lectures_site": []
},
{
  "id": "itidal", "ar": "الاِعْتِدَال", "tr": "al-iʿtidāl", "tr_simple": "itidal",
  "fr": "L'équilibre, la juste mesure",
  "racine": "ع د ل", "racine_sens": "ʿadala — être juste ; iʿtidāl — équilibre, tempérance",
  "category": "stations",
  "tags": ["mesure", "équilibre", "voie moyenne"],
  "definition_concise": "Tenir le milieu entre les extrêmes. La voie soufie classique n'est pas extrême : elle équilibre travail et repos, ascèse et joie, retrait et présence aux hommes.",
  "sens_profond": "L'iʿtidāl traduit en arabe l'idée de la <em>voie moyenne</em>. Le Coran nomme la communauté musulmane <em>ummatan wasaṭan</em> — communauté du milieu (2, 143). Pour les soufis, cela vaut autant pour la pratique extérieure que pour la conduite intérieure : ni l'ascétisme tueur de joie, ni le laxisme qui dilue tout. Ni la sècheresse du juriste, ni l'effervescence du <em>jadhb (الجَذْب)</em> mal contrôlé. Ni l'isolement total, ni la dispersion dans le monde. Le maître véritable enseigne à <em>tenir le milieu</em>, et chaque milieu est unique : la juste mesure de tel aspirant n'est pas celle d'un autre. C'est précisément le rôle du shaykh — sentir, pour chacun, où passe la ligne d'équilibre. La voie demande beaucoup, mais pas tout — elle réclame de la patience avec soi-même autant qu'avec les autres. Le Prophète, modèle des modèles, est l'icône de l'iʿtidāl : il jeûnait <em>et</em> mangeait, veillait <em>et</em> dormait, se retirait <em>et</em> rentrait chez les siens. La sainteté soufie classique n'est pas surhumaine — elle est <em>humaine</em>, mais habitée.",
  "voix_des_maitres": [
    {"auteur": "Coran 2, 143", "texte": "« Et ainsi avons-Nous fait de vous une communauté du milieu — pour que vous soyez témoins parmi les hommes. »"}
  ],
  "meditation": "Où, en ce moment, suis-je dans l'extrême — et où serait, ici, le vrai milieu ?",
  "resonance": ["adab", "akhlaq", "sabr", "akhlaq", "tariqa"],
  "lectures_site": []
},
{
  "id": "khalwa-ramadan", "ar": "رَمَضَان", "tr": "ramaḍān", "tr_simple": "ramadan",
  "fr": "Le mois de Ramadan",
  "racine": "ر م ض", "racine_sens": "ramaḍ — chaleur brûlante du sol",
  "category": "pratique",
  "tags": ["jeûne", "mois", "révélation"],
  "definition_concise": "Le neuvième mois du calendrier — celui du jeûne obligatoire, et celui où le Coran descendit. Pour les soufis, c'est le grand champ d'entraînement annuel.",
  "sens_profond": "Le mois de Ramadan condense toutes les pratiques majeures : jeûne du lever au coucher du soleil (eau, nourriture, intimité conjugale exclus), prières surérogatoires nocturnes (<em>tarāwīḥ</em>), lectures intensifiées du Coran, charité augmentée, et — pour les soufis — souvent une retraite (iʿtikāf (الاِعْتِكَاف)) sur les dix derniers jours. La nuit du Destin (<em>Laylat al-Qadr</em>), située dans les dix derniers jours impairs, est <em>« meilleure que mille mois »</em> (Coran 97, 3) — c'est la nuit où le Coran fut révélé, et où chaque acte est démultiplié. Pour le soufi, Ramadan n'est pas seulement la privation : c'est un <em>changement de mode</em>. Le corps ralentit, l'âme s'allège, le cœur s'ouvre. Les voiles tombent plus facilement, les inspirations affluent. Les confréries intensifient leurs dhikr (الذِّكْر), leurs samāʿ (السَّمَاع), leurs veilles. Le mois est aussi un microcosme de la voie entière : on commence avec zèle, on traverse un creux au milieu, on s'élève à la fin — comme dans tout cheminement. C'est pourquoi il est répété chaque année : pour que personne ne se croie arrivé.",
  "voix_des_maitres": [
    {"auteur": "Coran 2, 185", "texte": "« Le mois de Ramadan, durant lequel a été descendu le Coran, guidance pour les hommes, signes clairs de la guidance et du discernement. »"}
  ],
  "meditation": "Si Ramadan devait commencer demain, qu'est-ce que je voudrais avoir <em>déposé</em> avant qu'il finisse ?",
  "resonance": ["sawm", "itikaf", "salat", "khalwa", "tazkiyat-an-nafs"],
  "lectures_site": []
},
{
  "id": "mawlid", "ar": "المَوْلِد", "tr": "al-mawlid", "tr_simple": "mawlid",
  "fr": "La naissance du Prophète",
  "racine": "و ل د", "racine_sens": "walada — naître ; mawlid — naissance",
  "category": "pratique",
  "tags": ["prophète", "fête", "amour"],
  "definition_concise": "La célébration de la naissance du Prophète Muḥammad — le 12 du mois de Rabīʿ al-awwal. Fête centrale pour la plupart des soufis, occasion de chants, de méditations, de transmission.",
  "sens_profond": "La célébration du mawlid est, pour la grande majorité des soufis (et au-delà, pour une grande part du monde musulman), un moment fort de l'année : on lit la sīra (biographie du Prophète), on chante les odes en sa louange (la <em>Burda</em> d'al-Būṣīrī par-dessus tout), on médite sur sa lumière (nūr muḥammadī), on partage des repas, on visite les confréries. Pour les soufis, l'amour du Prophète n'est pas optionnel — c'est la <em>porte</em> de l'amour de Dieu. <em>« Vous n'aimerez Dieu que si vous m'aimez d'abord »</em>, disent les maîtres en commentant le verset : <em>« Dis : si vous aimez Dieu, suivez-moi, Dieu vous aimera »</em> (3, 31). Le mawlid est donc un acte d'amour visible — non un anniversaire au sens occidental, mais une <em>actualisation</em> de la présence prophétique. Certaines confréries, comme la Naqshbandī ou la Tijānī, font du dhikr (الذِّكْر) sur le Prophète (<em>ṣalāt ʿalā-n-nabī</em>) un axe central. La <em>ṣalāt al-fātiḥ</em> des Tijānī, par exemple, est une bénédiction sur le Prophète considérée comme équivalente à toute la création.",
  "voix_des_maitres": [
    {"auteur": "Coran 33, 56", "texte": "« Dieu et Ses anges prient sur le Prophète. Ô vous qui croyez, priez sur lui et saluez-le abondamment. »"}
  ],
  "meditation": "Qu'est-ce que la présence du Prophète, pour mon cœur — un nom du passé, ou une lumière vivante ?",
  "resonance": ["nubuwwa", "nur-muhammadi", "haqiqa-muhammadiyya", "rabita", "salat"],
  "lectures_site": []
}

]

# === Load, append, save ===
data = json.loads(DICT.read_text(encoding="utf-8"))
existing_ids = {e["id"] for e in data["entries"]}
added = 0
for entry in NEW_ENTRIES:
    if entry["id"] in existing_ids:
        print(f"  ⚠️  Déjà présent : {entry['id']} — ignoré")
        continue
    # Validate references in resonance (warn only)
    for rid in entry.get("resonance", []):
        if rid not in existing_ids and rid not in {e["id"] for e in NEW_ENTRIES}:
            print(f"  · {entry['id']} → résonance inconnue : {rid}")
    data["entries"].append(entry)
    existing_ids.add(entry["id"])
    added += 1

DICT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"\n✓ {added} entrées ajoutées. Total : {len(data['entries'])}")
