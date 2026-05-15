#!/usr/bin/env python3
"""Phase 2 batch 1 : ajoute 12 racines centrales avec glose Gloton authentique."""
import json
from pathlib import Path

NEW = [
{
  "id": "ʾ-m-n",
  "letters": ["ا","م","ن"],
  "root_ar": "ا م ن",
  "root_tr": "ʾ-m-n",
  "core_ar": "الإِيمَان",
  "core_fr": "La foi — sécurité, fidélité, confiance",
  "field": "Sécurité, sûreté, fidélité, loyauté. La même racine donne <em>amān</em> (sécurité), <em>amāna</em> (dépôt confié), <em>īmān</em> (foi) et <em>amīn</em> (digne de confiance — surnom du Prophète). Pour les Arabes, croire et être en sécurité partagent leur racine.",
  "glose_gloton": "Gloton ouvre la racine sur un éventail saisissant : <em>« Idée de sécurité, sûreté, confiance, sauvegarde, d'être assuré, d'adhérer, de fidélité, d'ajouter foi, de loyauté, de protection, de croyance. »</em> Le verbe central est défini ainsi : <em>« être en sécurité, avoir confiance, se fier à — contraire de la crainte »</em>. La foi (<em>īmān</em>) n'est donc pas, en arabe, une adhésion mentale à des dogmes : c'est <em>l'état où l'on n'a plus peur</em>. Le croyant est, étymologiquement, <em>celui qui est en sécurité — et qui rend en sécurité</em>. Le dépôt confié (<em>amāna</em>) est l'autre versant de la même intuition : celui à qui Dieu a confié l'existence en garantit la sécurité.",
  "gloton_ref": "Gloton, entrée n°66 (p.252)",
  "forms": [
    {"ar": "أَمِنَ", "tr": "amina", "fr": "être en sécurité, avoir confiance", "form": "I", "type": "verbe"},
    {"ar": "آمَنَ", "tr": "āmana", "fr": "porter la foi, croire", "form": "IV", "type": "verbe causatif"},
    {"ar": "اِسْتَأْمَنَ", "tr": "istaʾmana", "fr": "demander la sécurité, demander asile", "form": "X", "type": "verbe demandeur"},
    {"ar": "الأَمَان", "tr": "al-amān", "fr": "la sécurité, la sûreté", "type": "nom d'action"},
    {"ar": "الأَمَانَة", "tr": "al-amāna", "fr": "le dépôt confié, la fidélité", "type": "nom féminin"},
    {"ar": "الإِيمَان", "tr": "al-īmān", "fr": "la foi", "type": "nom d'action de la forme IV"},
    {"ar": "المُؤْمِن", "tr": "al-Muʾmin", "fr": "le croyant ; Celui qui donne la sécurité (Nom divin)", "type": "participe actif"},
    {"ar": "الأَمِين", "tr": "al-Amīn", "fr": "le digne de confiance (surnom du Prophète)", "type": "intensif"}
  ],
  "quran": [
    {"ref": "2, 285", "ar": "ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ", "fr": "Le Messager a porté la foi en ce qui est descendu vers lui de son Seigneur."},
    {"ref": "33, 72", "ar": "إِنَّا عَرَضْنَا ٱلْأَمَانَةَ عَلَى ٱلسَّمَٰوَٰتِ وَٱلْأَرْضِ", "fr": "Nous avons proposé le dépôt aux cieux et à la terre."}
  ],
  "dict_links": ["iman", "islam", "ihsan"],
  "nom_links": [6],
  "meditation": "Suis-je en sécurité en Lui — ou est-ce que je crois sans cesser de craindre ?"
},
{
  "id": "ṣ-d-q",
  "letters": ["ص","د","ق"],
  "root_ar": "ص د ق",
  "root_tr": "ṣ-d-q",
  "core_ar": "الصِّدْق",
  "core_fr": "La véracité — offrande spontanée de soi",
  "field": "Être vrai, sincère, véridique. La même racine donne <em>ṣidq</em> (véracité), <em>ṣadaqa</em> (aumône spontanée), <em>ṣaddīq</em> (l'ami véritable, le très loyal). Pour Gloton, dire vrai et donner sans réserve partagent la même intuition : se livrer entièrement.",
  "glose_gloton": "Gloton donne pour cette racine une définition qui éclaire d'un coup tout le champ : <em>« Idée d'offrande de soi ou de ses biens en toute spontanéité, sans réserve — Etre vrai, sincère, véridique, authentique, loyal, droit, franc, véritable, réaliser, accomplir, ajouter foi en qqn, reconnaître sans réserve, avoir raison, dire la vérité, dire vrai. »</em> Le nom <em>ṣidq</em> couvre : <em>« vérité, authenticité, véridicité, véracité, loyauté, franchise, droiture, force, vigueur, excellence »</em>. Et — voici le saisissement — le même nom désigne aussi : <em>« offrande spontanée, donation, charité, don, aumône »</em>, et même <em>« dot, donation faite à la femme en vue du mariage »</em>. Dire vrai, donner sans contrepartie, faire l'aumône, livrer la dot — tous sont, pour Gloton, des actes de <em>ṣidq</em> : on se livre entièrement, sans réserve.",
  "gloton_ref": "Gloton, entrée n°847 (p.495)",
  "forms": [
    {"ar": "صَدَقَ", "tr": "ṣadaqa", "fr": "dire vrai, être véridique", "form": "I", "type": "verbe"},
    {"ar": "صَدَّقَ", "tr": "ṣaddaqa", "fr": "confirmer, ajouter foi, vérifier", "form": "II", "type": "verbe intensif"},
    {"ar": "تَصَدَّقَ", "tr": "taṣaddaqa", "fr": "faire l'aumône, donner spontanément", "form": "V", "type": "verbe réflexif"},
    {"ar": "الصِّدْق", "tr": "aṣ-ṣidq", "fr": "la véracité, la sincérité", "type": "nom d'action"},
    {"ar": "الصَّدَقَة", "tr": "aṣ-ṣadaqa", "fr": "l'aumône spontanée", "type": "nom d'instance"},
    {"ar": "الصَّادِق", "tr": "aṣ-ṣādiq", "fr": "le véridique", "type": "participe actif"},
    {"ar": "الصِّدِّيق", "tr": "aṣ-ṣiddīq", "fr": "le très véridique, l'ami véritable (Abū Bakr)", "type": "intensif"}
  ],
  "quran": [
    {"ref": "33, 35", "ar": "وَٱلصَّٰدِقِينَ وَٱلصَّٰدِقَٰتِ", "fr": "Les hommes véridiques et les femmes véridiques…"},
    {"ref": "9, 119", "ar": "يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱتَّقُوا۟ ٱللَّهَ وَكُونُوا۟ مَعَ ٱلصَّٰدِقِينَ", "fr": "Ô vous qui croyez, craignez Dieu et soyez avec les véridiques."}
  ],
  "dict_links": ["sidq", "ikhlas"],
  "nom_links": [],
  "meditation": "Suis-je vrai jusqu'à donner — ou je donne quelque chose en gardant le reste ?"
},
{
  "id": "ḥ-k-m",
  "letters": ["ح","ك","م"],
  "root_ar": "ح ك م",
  "root_tr": "ḥ-k-m",
  "core_ar": "الحِكْمَة",
  "core_fr": "La sagesse — règle pérenne qui maîtrise",
  "field": "Établir une règle, juger, gouverner. La même racine donne <em>ḥukm</em> (jugement, autorité), <em>ḥikma</em> (sagesse) et <em>ḥākim</em> (gouvernant). Et — image saisissante — la racine décrit aussi le mors qu'on met au cheval pour le diriger.",
  "glose_gloton": "Gloton donne pour cette racine une définition d'une rare amplitude : <em>« Idée d'établir une règle de sagesse pérenne, d'observer une norme, maintenir une règle, garder dans la voie, accomplir la Loi universelle — Arbitrer, juger, décider, déclarer, déterminer, trancher (un différend), condamner à, consolider, affermir, confirmer, conserver, empêcher de se gâter, administrer, réglementer, normaliser, régler, gouverner, régner, statuer, maîtriser, exercer l'autorité, être savant, être prudent, être d'un jugement solide. »</em> Et il ajoute, image concrète qui éclaire tout le champ : <em>« museler un cheval et lui mettre la martingale sous le menton, maintenir le cap, retenir, contenir et empêcher de faire qqch »</em>. La sagesse arabe est donc, étymologiquement, un <em>mors</em> : ce qui retient, dirige, empêche de se gâter — non un savoir spéculatif, mais une discipline qui tient le cap.",
  "gloton_ref": "Gloton, entrée n°349 (p.339)",
  "forms": [
    {"ar": "حَكَمَ", "tr": "ḥakama", "fr": "juger, gouverner, trancher", "form": "I", "type": "verbe"},
    {"ar": "حَكَّمَ", "tr": "ḥakkama", "fr": "désigner comme arbitre", "form": "II", "type": "verbe causatif"},
    {"ar": "أَحْكَمَ", "tr": "aḥkama", "fr": "consolider, raffermir, parfaire", "form": "IV", "type": "verbe"},
    {"ar": "الحُكْم", "tr": "al-ḥukm", "fr": "le jugement, l'autorité, le décret", "type": "nom d'action"},
    {"ar": "الحِكْمَة", "tr": "al-ḥikma", "fr": "la sagesse", "type": "nom"},
    {"ar": "الحَكَم", "tr": "al-Ḥakam", "fr": "l'Arbitre (Nom divin)", "type": "nom intensif"},
    {"ar": "الحَكِيم", "tr": "al-Ḥakīm", "fr": "le Sage (Nom divin)", "type": "intensif"},
    {"ar": "الحَاكِم", "tr": "al-ḥākim", "fr": "le gouvernant, le juge", "type": "participe actif"}
  ],
  "quran": [
    {"ref": "2, 269", "ar": "يُؤْتِى ٱلْحِكْمَةَ مَن يَشَآءُ ۚ وَمَن يُؤْتَ ٱلْحِكْمَةَ فَقَدْ أُوتِىَ خَيْرًا كَثِيرًا", "fr": "Il donne la sagesse à qui Il veut. Et celui à qui la sagesse a été donnée a reçu un bien immense."},
    {"ref": "31, 12", "ar": "وَلَقَدْ ءَاتَيْنَا لُقْمَٰنَ ٱلْحِكْمَةَ", "fr": "Nous avons donné la sagesse à Luqmān."}
  ],
  "dict_links": ["hikma"],
  "nom_links": [28, 46],
  "meditation": "La règle qui me tient en ce moment — est-elle le mors qui dirige, ou la chaîne qui empêche ?"
},
{
  "id": "s-l-m",
  "letters": ["س","ل","م"],
  "root_ar": "س ل م",
  "root_tr": "s-l-m",
  "core_ar": "السَّلَام",
  "core_fr": "La paix — sain et sauf, intact, livré",
  "field": "Être sain et sauf, intact, exempt. La même racine donne <em>salām</em> (paix), <em>islām</em> (soumission), <em>silm</em> (paix conclue), <em>salāma</em> (salut). Aussi <em>sullam</em> (échelle) — moyen par lequel on s'échappe et parvient.",
  "glose_gloton": "Gloton ouvre la racine sur deux sens distincts mais liés : <em>« 1/ piquer qqn (serpent, châtiment), faire une morsure — 2/ Etre sain et sauf, être ou demeurer intact, garder en bon état, se porter bien, échapper, être exempt de. »</em> Le nom couvre : <em>« paix, sécurité, sauvegarde »</em>, et le dérivé <em>islām</em> est défini comme <em>« action de se livrer sain et sauf, captif qui s'est rendu pour garder la vie sauve, paiement anticipé d'une marchandise, obéissance, soumission, qui est sans défaut, intact »</em>. Pour Gloton, l'islām n'est donc pas d'abord une religion : c'est <em>l'acte de se livrer entièrement pour garder la vie sauve</em> — comme le captif qui se rend, comme le marchand qui paie d'avance. Et <em>sullam</em> — l'échelle — est nommée de la même racine : <em>« moyen par lequel on s'échappe, on parvient à qqch »</em>. La paix est l'échelle.",
  "gloton_ref": "Gloton, entrée n°733 (p.458)",
  "forms": [
    {"ar": "سَلِمَ", "tr": "salima", "fr": "être sain et sauf, échapper", "form": "I", "type": "verbe d'état"},
    {"ar": "سَلَّمَ", "tr": "sallama", "fr": "saluer, livrer, remettre", "form": "II", "type": "verbe causatif"},
    {"ar": "أَسْلَمَ", "tr": "aslama", "fr": "se soumettre, se livrer entièrement à Dieu", "form": "IV", "type": "verbe"},
    {"ar": "تَسَلَّمَ", "tr": "tasallama", "fr": "recevoir, accepter", "form": "V", "type": "verbe réflexif"},
    {"ar": "السَّلَام", "tr": "as-salām", "fr": "la paix, le salut ; al-Salām (Nom divin)", "type": "nom"},
    {"ar": "السَّلَامَة", "tr": "as-salāma", "fr": "le salut, la préservation", "type": "nom féminin"},
    {"ar": "الإِسْلَام", "tr": "al-islām", "fr": "la soumission, l'islam", "type": "nom d'action IV"},
    {"ar": "المُسْلِم", "tr": "al-muslim", "fr": "celui qui se livre entièrement", "type": "participe actif IV"},
    {"ar": "السُّلَّم", "tr": "as-sullam", "fr": "l'échelle (moyen d'échapper)", "type": "nom concret"}
  ],
  "quran": [
    {"ref": "6, 127", "ar": "لَهُمْ دَارُ ٱلسَّلَٰمِ عِندَ رَبِّهِمْ", "fr": "Pour eux, la Demeure de la Paix, auprès de leur Seigneur."},
    {"ref": "3, 19", "ar": "إِنَّ ٱلدِّينَ عِندَ ٱللَّهِ ٱلْإِسْلَٰمُ", "fr": "Certes, la religion auprès de Dieu, c'est l'islām (la livraison de soi)."}
  ],
  "dict_links": ["islam", "ihsan"],
  "nom_links": [5],
  "meditation": "Quand je dis « la paix sur toi », est-ce que je donne vraiment <em>quelque chose</em> — ou un mot poli ?"
},
{
  "id": "ʿ-r-f",
  "letters": ["ع","ر","ف"],
  "root_ar": "ع ر ف",
  "root_tr": "ʿ-r-f",
  "core_ar": "المَعْرِفَة",
  "core_fr": "La gnose — connaître en prenant de la hauteur",
  "field": "Connaître, reconnaître, discerner. La même racine donne <em>maʿrifa</em> (connaissance gnostique), <em>ʿārif</em> (gnostique), <em>ʿurf</em> (coutume, usage) et — image saisissante — <em>ʿArafāt</em>, le Mont de la Connaissance près de La Mecque où les pèlerins se tiennent.",
  "glose_gloton": "Gloton ouvre cette racine sur trois mouvements simultanés : <em>« Idée de connaître en distinguant, en prenant de la hauteur, de se répandre, de se diffuser (parfum), sentir les parfums — Connaître, apprendre, reconnaître et distinguer, discerner, savoir, avouer. »</em> La connaissance arabe, dans cette racine, n'est ni intellectuelle ni signalétique (comme ʿ-l-m) : elle est <em>élévation</em> et <em>diffusion de parfum</em>. On reconnaît en prenant de la hauteur. Le nom <em>ʿurf</em> désigne : <em>« ce que l'on connaît ou reconnaît, usage établi, us et coutumes, droit coutumier, tradition, lieu élevé et reconnu, hauteur, aveu, connaissance »</em>. Et — clé du soufisme — Gloton précise : <em>« les Monts de 'Arafât (de la connaissance), près de La Mekke »</em>. Le sommet où les pèlerins se tiennent est, étymologiquement, le <em>Mont du Connaître</em>.",
  "gloton_ref": "Gloton, entrée n°999 (p.547)",
  "forms": [
    {"ar": "عَرَفَ", "tr": "ʿarafa", "fr": "connaître, reconnaître", "form": "I", "type": "verbe"},
    {"ar": "عَرَّفَ", "tr": "ʿarrafa", "fr": "faire connaître, instruire, identifier", "form": "II", "type": "verbe causatif"},
    {"ar": "تَعَارَفَ", "tr": "taʿārafa", "fr": "se reconnaître mutuellement", "form": "VI", "type": "verbe réciproque"},
    {"ar": "اِعْتَرَفَ", "tr": "iʿtarafa", "fr": "avouer, confesser, reconnaître", "form": "VIII", "type": "verbe"},
    {"ar": "المَعْرِفَة", "tr": "al-maʿrifa", "fr": "la connaissance, la gnose", "type": "nom de lieu"},
    {"ar": "العَارِف", "tr": "al-ʿārif", "fr": "le connaissant, le gnostique", "type": "participe actif"},
    {"ar": "العُرْف", "tr": "al-ʿurf", "fr": "la coutume, l'usage, le bien connu", "type": "nom"},
    {"ar": "عَرَفَات", "tr": "ʿArafāt", "fr": "le Mont de la Connaissance (près de La Mecque)", "type": "nom propre"}
  ],
  "quran": [
    {"ref": "49, 13", "ar": "وَجَعَلْنَٰكُمْ شُعُوبًا وَقَبَآئِلَ لِتَعَارَفُوٓا۟", "fr": "Et Nous vous avons faits peuples et tribus pour que vous vous connaissiez les uns les autres."},
    {"ref": "2, 198", "ar": "فَإِذَآ أَفَضْتُم مِّنْ عَرَفَٰتٍ فَٱذْكُرُوا۟ ٱللَّهَ", "fr": "Quand vous déferlez depuis ʿArafāt, faites le rappel de Dieu."}
  ],
  "dict_links": ["marifa", "irfan", "ilm"],
  "nom_links": [],
  "meditation": "Y a-t-il, dans ma vie, un parfum que je reconnais sans en connaître l'origine ?"
},
{
  "id": "q-d-s",
  "letters": ["ق","د","س"],
  "root_ar": "ق د س",
  "root_tr": "q-d-s",
  "core_ar": "القُدْس",
  "core_fr": "La sainteté — pureté sans mélange",
  "field": "Être pur, sacré, saint. La même racine donne <em>quds</em> (sainteté), <em>al-Quddūs</em> (le Très-Saint, Nom divin), <em>rūḥ al-quds</em> (l'Esprit de Sainteté), et — par toponyme — <em>Bayt al-Maqdis</em> (la Demeure sanctifiée, Jérusalem).",
  "glose_gloton": "Gloton donne pour cette racine une définition d'une concision absolue : <em>« Etre pur, sans tache, sans mélange, immaculé, saint. »</em> Le nom <em>quds</em> est : <em>« pureté, sainteté »</em>. Le nom intensif <em>al-Quddūs</em> est : <em>« très saint, très pur — un des Noms de Dieu »</em>. Et le verbe à la forme II : <em>« purifier, sanctifier, proclamer la sainteté, rendre saint, sacraliser, sacrer »</em>. Pour Gloton, la sainteté arabe est donc d'abord une <em>absence de mélange</em> — non un excès de valeur ajoutée, mais une simplicité radicale. Le Saint est ce qui ne se mêle pas, ce qui demeure pur sans réserve.",
  "gloton_ref": "Gloton, entrée n°1212 (p.617)",
  "forms": [
    {"ar": "قَدُسَ", "tr": "qadusa", "fr": "être saint, pur, sacré", "form": "I", "type": "verbe d'état"},
    {"ar": "قَدَّسَ", "tr": "qaddasa", "fr": "sanctifier, proclamer la sainteté", "form": "II", "type": "verbe causatif"},
    {"ar": "تَقَدَّسَ", "tr": "taqaddasa", "fr": "être sanctifié, devenir saint", "form": "V", "type": "verbe réflexif"},
    {"ar": "القُدْس", "tr": "al-quds", "fr": "la sainteté, la pureté ; Jérusalem", "type": "nom"},
    {"ar": "القُدُّوس", "tr": "al-Quddūs", "fr": "le Très-Saint (Nom divin)", "type": "intensif"},
    {"ar": "المُقَدَّس", "tr": "al-muqaddas", "fr": "le sanctifié", "type": "participe passif"},
    {"ar": "بَيْت المَقْدِس", "tr": "Bayt al-Maqdis", "fr": "Jérusalem (la Demeure sanctifiée)", "type": "nom propre"},
    {"ar": "رُوح القُدُس", "tr": "rūḥ al-quds", "fr": "l'Esprit de Sainteté", "type": "expression"}
  ],
  "quran": [
    {"ref": "59, 23", "ar": "هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَٰهَ إِلَّا هُوَ ٱلْمَلِكُ ٱلْقُدُّوسُ ٱلسَّلَٰمُ", "fr": "Lui, Dieu — il n'est pas de divinité adorée sinon Lui — le Roi, le Très-Saint, la Paix."},
    {"ref": "2, 87", "ar": "وَأَيَّدْنَٰهُ بِرُوحِ ٱلْقُدُسِ", "fr": "Et Nous l'avons affermi par l'Esprit de la Sainteté."}
  ],
  "dict_links": [],
  "nom_links": [4],
  "meditation": "Dans ce qui me touche au plus profond, y a-t-il un endroit <em>sans mélange</em> — ou tout est-il toujours mêlé ?"
},
{
  "id": "h-d-y",
  "letters": ["ه","د","ي"],
  "root_ar": "ه د ي",
  "root_tr": "h-d-y",
  "core_ar": "الهُدَى",
  "core_fr": "La guidance — direction droite",
  "field": "Guider, indiquer le chemin, bien diriger. La même racine donne <em>hudā</em> (guidance), <em>hādī</em> (guide), <em>hidāya</em> (orientation), et — par dérivation — <em>hadiyya</em> (cadeau : ce qu'on offre pour orienter le cœur).",
  "glose_gloton": "Gloton donne pour cette racine une définition d'une grande simplicité : <em>« Etre bien dirigé, être dans — ou suivre — la bonne direction, être orthodoxe. »</em> Et il précise sur les noms d'action : <em>« direction droite, action droite, marche en ligne droite, droiture, manière d'agir droite »</em>. Le participe actif est <em>« qui dirige bien »</em>, et la forme IV donne <em>hādī</em> : <em>« capable de bien diriger qqn, qui oriente bien, qui est d'un bon conseil »</em>. La guidance, en arabe, est donc une <em>rectitude</em> — une ligne sans déviation. La citation coranique de référence le confirme : <em>« Nulle contrainte en matière de religion ! La droite direction (rushd) se distingue assurément de la déviation. »</em> (2, 256).",
  "gloton_ref": "Gloton, entrée n°564 (p.408)",
  "forms": [
    {"ar": "هَدَى", "tr": "hadā", "fr": "guider, diriger, conduire", "form": "I", "type": "verbe"},
    {"ar": "اِهْتَدَى", "tr": "ihtadā", "fr": "se laisser guider, être bien dirigé", "form": "VIII", "type": "verbe réflexif"},
    {"ar": "اِسْتَهْدَى", "tr": "istahdā", "fr": "demander la guidance", "form": "X", "type": "verbe demandeur"},
    {"ar": "الهُدَى", "tr": "al-hudā", "fr": "la guidance, la voie droite", "type": "nom d'action"},
    {"ar": "الهِدَايَة", "tr": "al-hidāya", "fr": "l'orientation, la guidance", "type": "nom féminin"},
    {"ar": "الهَادِي", "tr": "al-Hādī", "fr": "le Guide (Nom divin)", "type": "participe actif"},
    {"ar": "المُهْتَدِي", "tr": "al-muhtadī", "fr": "celui qui suit la guidance", "type": "participe actif VIII"},
    {"ar": "الهَدِيَّة", "tr": "al-hadiyya", "fr": "le cadeau (ce qui oriente le cœur)", "type": "nom"}
  ],
  "quran": [
    {"ref": "1, 6", "ar": "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", "fr": "Guide-nous dans la voie droite."},
    {"ref": "28, 56", "ar": "إِنَّكَ لَا تَهْدِى مَنْ أَحْبَبْتَ وَلَٰكِنَّ ٱللَّهَ يَهْدِى مَن يَشَآءُ", "fr": "Tu ne guides pas qui tu aimes, mais Dieu guide qui Il veut."}
  ],
  "dict_links": [],
  "nom_links": [94],
  "meditation": "La direction que je suis — vient-elle d'une guidance reçue, ou d'une habitude ?"
},
{
  "id": "ḍ-l-l",
  "letters": ["ض","ل","ل"],
  "root_ar": "ض ل ل",
  "root_tr": "ḍ-l-l",
  "core_ar": "الضَّلَالَة",
  "core_fr": "L'errance — perte du chemin",
  "field": "S'égarer, se perdre, subir un dommage. La même racine donne <em>ḍalāl</em> (égarement), <em>ḍalāla</em> (errance), et — par contraste — fait apparaître la valeur de <em>hudā</em>. Le couple <em>hudā / ḍalāl</em> est l'un des plus structurants du Coran.",
  "glose_gloton": "Gloton donne pour cette racine une définition immédiatement concrète : <em>« S'écarter de la route et s'égarer, s'égarer, se perdre, être dépossédé, éprouver ou subir un dommage, s'endommager, avoir le dessous, se tromper dans une affaire de commerce. »</em> Le nom couvre : <em>« mécompte, perte, préjudice, dommage éprouvé, déception »</em>. L'errance arabe n'est donc pas seulement une dérive morale : c'est une <em>perte</em>, un <em>mécompte commercial</em> au sens propre — celui qui s'égare perd quelque chose qu'il avait, et se trouve <em>dépossédé</em>.",
  "gloton_ref": "Gloton, entrée n°412 (p.358)",
  "forms": [
    {"ar": "ضَلَّ", "tr": "ḍalla", "fr": "s'égarer, se perdre", "form": "I", "type": "verbe"},
    {"ar": "أَضَلَّ", "tr": "aḍalla", "fr": "égarer, induire en erreur", "form": "IV", "type": "verbe causatif"},
    {"ar": "تَضَالَّ", "tr": "taḍālla", "fr": "se laisser égarer", "form": "VI", "type": "verbe"},
    {"ar": "الضَّلَال", "tr": "aḍ-ḍalāl", "fr": "l'égarement, la perte", "type": "nom d'action"},
    {"ar": "الضَّلَالَة", "tr": "aḍ-ḍalāla", "fr": "l'errance, l'erreur", "type": "nom féminin"},
    {"ar": "الضَّالّ", "tr": "aḍ-ḍāll", "fr": "celui qui s'égare", "type": "participe actif"},
    {"ar": "المُضِلّ", "tr": "al-muḍill", "fr": "celui qui égare autrui", "type": "participe actif IV"}
  ],
  "quran": [
    {"ref": "1, 7", "ar": "غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", "fr": "Non celle de ceux qui ont encouru la colère, ni de ceux qui s'égarent."},
    {"ref": "39, 36", "ar": "وَمَن يُضْلِلِ ٱللَّهُ فَمَا لَهُۥ مِنْ هَادٍ", "fr": "Et celui que Dieu laisse s'égarer — il n'a pas de guide."}
  ],
  "dict_links": ["ghafla"],
  "nom_links": [],
  "meditation": "Quand je suis perdu — perds-je <em>quelque chose</em> en particulier, ou est-ce moi-même qui suis dépossédé ?"
},
{
  "id": "z-k-y",
  "letters": ["ز","ك","ي"],
  "root_ar": "ز ك ي",
  "root_tr": "z-k-y",
  "core_ar": "الزَّكَاة",
  "core_fr": "La purification qui fait croître",
  "field": "Être pur, croître, augmenter. La même racine donne <em>zakāt</em> (aumône légale), <em>tazkiya</em> (purification de l'âme), et — saisissement — l'idée que <em>purifier</em> et <em>faire croître</em> sont un seul mouvement. On enlève la souillure et la chose, du même geste, grandit.",
  "glose_gloton": "Gloton donne pour cette racine une définition qui révèle son intuition centrale : <em>« Etre pur, sans tache, croître, grandir, augmenter, convenir à, vivre dans le bien-être, se plaire dans un endroit. »</em> Pureté et croissance — un seul mot pour deux gestes. La zakāt — l'aumône légale — porte exactement cette dualité : en donnant une part de ses biens, on les <em>purifie</em>, et de ce fait ils <em>croissent</em>. Le hadith le dit explicitement : <em>« L'aumône ne diminue jamais les biens »</em>. Pour Gloton, donc, la purification arabe n'est jamais une simple ablation : c'est une <em>libération de la croissance</em>. Quand l'âme est purifiée, elle ne devient pas plus petite — elle <em>peut enfin grandir</em>.",
  "gloton_ref": "Gloton, entrée n°635 (p.428)",
  "forms": [
    {"ar": "زَكَا", "tr": "zakā", "fr": "être pur, croître", "form": "I", "type": "verbe"},
    {"ar": "زَكَّى", "tr": "zakkā", "fr": "purifier, faire croître", "form": "II", "type": "verbe causatif"},
    {"ar": "تَزَكَّى", "tr": "tazakkā", "fr": "se purifier, croître", "form": "V", "type": "verbe réflexif"},
    {"ar": "الزَّكَاة", "tr": "az-zakāt", "fr": "l'aumône légale (purifiante)", "type": "nom d'action"},
    {"ar": "التَّزْكِيَة", "tr": "at-tazkiya", "fr": "la purification (de l'âme)", "type": "nom d'action II"},
    {"ar": "الزَّكِيّ", "tr": "az-zakiyy", "fr": "le pur", "type": "intensif"},
    {"ar": "المُزَكِّي", "tr": "al-muzakkī", "fr": "celui qui purifie", "type": "participe actif II"}
  ],
  "quran": [
    {"ref": "91, 9", "ar": "قَدْ أَفْلَحَ مَن زَكَّىٰهَا", "fr": "Bienheureux celui qui la (l'âme) purifie."},
    {"ref": "62, 2", "ar": "وَيُزَكِّيهِمْ وَيُعَلِّمُهُمُ ٱلْكِتَٰبَ وَٱلْحِكْمَةَ", "fr": "Il les purifie et leur enseigne le Livre et la sagesse."}
  ],
  "dict_links": ["tazkiyat-an-nafs", "ikhlas"],
  "nom_links": [],
  "meditation": "Ce que j'essaie de purifier en moi — qu'est-ce qui pourrait <em>croître</em> si je le purifiais vraiment ?"
},
{
  "id": "t-q-y",
  "letters": ["و","ق","ي"],
  "root_ar": "و ق ي",
  "root_tr": "w-q-y (forme VIII = taqwā)",
  "core_ar": "التَّقْوَى",
  "core_fr": "La crainte protectrice — se garder",
  "field": "Se garder, se prémunir, se protéger. La racine donne, à la forme VIII, <em>ittaqā</em> (se garder de Dieu, le craindre par révérence) ; le nom d'action est <em>taqwā</em>. Pour Gloton, c'est d'abord un acte de <em>vigilance</em>.",
  "glose_gloton": "Gloton inscrit cette racine au sens premier de la protection vigilante : <em>« Prendre garde, chercher à éviter, se garder de, craindre, se protéger, être attentif, être vigilant, se méfier, appréhender. »</em> Le nom couvre : <em>« garde, protection, abri, refuge, vigilance »</em>. La <em>taqwā</em> — souvent rendue par « crainte de Dieu » — n'est donc pas une peur paralysante : c'est une <em>vigilance attentive</em>, comme celui qui marche pieds nus dans des ronces et regarde où il pose le pied. Le hadith dit, en commentaire de la racine : <em>« Mettez entre vous et la colère divine un voile (wiqāya) — fût-ce de la moitié d'une datte donnée en aumône. »</em> La taqwā est cette interposition vigilante.",
  "gloton_ref": "Gloton, entrée n°304 (p.326)",
  "forms": [
    {"ar": "وَقَى", "tr": "waqā", "fr": "garder, protéger, préserver", "form": "I", "type": "verbe"},
    {"ar": "اِتَّقَى", "tr": "ittaqā", "fr": "se garder de, craindre par révérence", "form": "VIII", "type": "verbe réflexif"},
    {"ar": "التَّقْوَى", "tr": "at-taqwā", "fr": "la crainte protectrice, la piété vigilante", "type": "nom d'action VIII"},
    {"ar": "المُتَّقِي", "tr": "al-muttaqī", "fr": "celui qui se garde, le pieux vigilant", "type": "participe actif VIII"},
    {"ar": "الوِقَايَة", "tr": "al-wiqāya", "fr": "la garde, la protection", "type": "nom"},
    {"ar": "التَّقِيّ", "tr": "at-taqiyy", "fr": "le pieux, le vigilant", "type": "intensif"}
  ],
  "quran": [
    {"ref": "49, 13", "ar": "إِنَّ أَكْرَمَكُمْ عِندَ ٱللَّهِ أَتْقَىٰكُمْ", "fr": "Le plus noble d'entre vous, auprès de Dieu, est le plus vigilant."},
    {"ref": "2, 197", "ar": "وَتَزَوَّدُوا۟ فَإِنَّ خَيْرَ ٱلزَّادِ ٱلتَّقْوَىٰ", "fr": "Munissez-vous de provisions — la meilleure provision est la taqwā."}
  ],
  "dict_links": ["taqwa", "ihsan"],
  "nom_links": [],
  "meditation": "De quoi suis-je en train de me garder en ce moment — et qu'est-ce que je laisse entrer sans vigilance ?"
},
{
  "id": "n-ṣ-r",
  "letters": ["ن","ص","ر"],
  "root_ar": "ن ص ر",
  "root_tr": "n-ṣ-r",
  "core_ar": "النَّصْر",
  "core_fr": "Le secours — assistance et victoire",
  "field": "Secourir, aider, donner la victoire. La même racine donne <em>naṣr</em> (secours, victoire), <em>nāṣir</em> (celui qui aide), <em>al-Naṣīr</em> (Nom divin) et — saisissement — <em>naṣārā</em> (chrétiens, nazaréens, étymologiquement les <em>aidants</em>).",
  "glose_gloton": "Gloton décrit cette racine sur l'amplitude de l'aide : <em>« Aider, secourir, assister, défendre qqn, délivrer, donner la victoire, soutenir, seconder, être auxiliaire, donner son appui, arroser abondamment. »</em> Le nom couvre : <em>« assistance, aide, secours, appui, victoire, auxiliaire, soutien, succès, triomphe »</em>. Et — détail remarquable — Gloton note explicitement : <em>« (singulier non coranique = nāṣrānī) chrétien, nazaréen »</em>. Les chrétiens portent, dans le Coran, le nom de ceux qui ont aidé Jésus — les <em>anṣār</em> de la racine n-ṣ-r. Le secours et la victoire partagent donc leur racine : pour Gloton, on ne triomphe pas seul, on triomphe <em>en aidant et en étant aidé</em>.",
  "gloton_ref": "Gloton, entrée n°1518 (p.717)",
  "forms": [
    {"ar": "نَصَرَ", "tr": "naṣara", "fr": "secourir, aider, donner la victoire", "form": "I", "type": "verbe"},
    {"ar": "نَاصَرَ", "tr": "nāṣara", "fr": "aider mutuellement", "form": "III", "type": "verbe"},
    {"ar": "تَنَاصَرَ", "tr": "tanāṣara", "fr": "s'entraider mutuellement", "form": "VI", "type": "verbe réciproque"},
    {"ar": "اِنْتَصَرَ", "tr": "intaṣara", "fr": "triompher, vaincre", "form": "VIII", "type": "verbe réflexif"},
    {"ar": "النَّصْر", "tr": "an-naṣr", "fr": "le secours, la victoire", "type": "nom d'action"},
    {"ar": "النَّاصِر", "tr": "an-nāṣir", "fr": "celui qui aide, l'auxiliaire", "type": "participe actif"},
    {"ar": "النَّصِير", "tr": "an-Naṣīr", "fr": "le Secourable (Nom divin)", "type": "intensif"},
    {"ar": "الأَنْصَار", "tr": "al-anṣār", "fr": "les Auxiliaires (les Médinois ayant accueilli le Prophète)", "type": "pluriel"},
    {"ar": "النَّصَارَى", "tr": "an-naṣārā", "fr": "les Chrétiens (étymologiquement, les aidants)", "type": "nom collectif"}
  ],
  "quran": [
    {"ref": "110, 1", "ar": "إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ", "fr": "Quand le secours de Dieu et l'ouverture viendront."},
    {"ref": "47, 7", "ar": "إِن تَنصُرُوا۟ ٱللَّهَ يَنصُرْكُمْ", "fr": "Si vous secourez Dieu, Il vous secourra."}
  ],
  "dict_links": [],
  "nom_links": [],
  "meditation": "À qui pourrais-je apporter mon secours aujourd'hui — sachant que c'est ainsi qu'on est secouru ?"
},
{
  "id": "w-l-y",
  "letters": ["و","ل","ي"],
  "root_ar": "و ل ي",
  "root_tr": "w-l-y",
  "core_ar": "الوَلَايَة",
  "core_fr": "La proximité — ami, protecteur, saint",
  "field": "Être proche, contigu, intime. La même racine donne <em>walī</em> (saint, ami de Dieu, protecteur), <em>walāya</em> (sainteté, proximité), <em>mawlā</em> (maître, patron), <em>wālī</em> (gouverneur). Pour Gloton, la sainteté est, étymologiquement, <em>une proximité où l'on est tenu</em>.",
  "glose_gloton": "Gloton donne pour cette racine un déploiement remarquable : <em>« Etre très proche, contigu, être très près, suivre de très près, toucher à, être à portée de la main, se charger de qqch, être préposé, être l'ami intime de qqn, gouverner, régir, administrer, s'ensuivre, suivre de près, défendre qqn. »</em> Le walī est défini comme : <em>« très proche, immédiat, préposé, ami, protecteur, intime, voisin, contigu, aide, auxiliaire, allié, associé, partisan, maître très proche, compagnon, bienfaiteur, tuteur — un des noms de Dieu »</em>. La sainteté arabe (<em>walāya</em>) est donc, étymologiquement, une <em>contiguïté</em> avec Dieu : le saint est <em>celui qui est à portée de main</em>, celui qui touche au divin. Et — détail capital — la racine porte aussi <em>gouverner, régir, administrer</em> : le walī n'est pas seulement un mystique, c'est aussi un <em>gérant</em>, celui à qui une affaire est confiée.",
  "gloton_ref": "Gloton, entrée n°1696 (p.772)",
  "forms": [
    {"ar": "وَلِيَ", "tr": "waliya", "fr": "être proche, prendre en charge", "form": "I", "type": "verbe"},
    {"ar": "وَلَّى", "tr": "wallā", "fr": "tourner, confier, déléguer", "form": "II", "type": "verbe causatif"},
    {"ar": "وَالَى", "tr": "wālā", "fr": "être allié, se rapprocher", "form": "III", "type": "verbe"},
    {"ar": "تَوَلَّى", "tr": "tawallā", "fr": "se charger de, prendre en main", "form": "V", "type": "verbe réflexif"},
    {"ar": "الوَلِيّ", "tr": "al-walī", "fr": "l'ami proche, le saint, le protecteur (Nom divin)", "type": "intensif"},
    {"ar": "الوَلَايَة", "tr": "al-walāya", "fr": "la sainteté, la proximité, la tutelle", "type": "nom d'action"},
    {"ar": "المَوْلَى", "tr": "al-mawlā", "fr": "le maître, le patron, le très proche", "type": "nom"},
    {"ar": "الوَالِي", "tr": "al-Wālī", "fr": "le Gouverneur (Nom divin)", "type": "participe actif"},
    {"ar": "الأَوْلِيَاء", "tr": "al-awliyāʾ", "fr": "les amis (de Dieu), les saints", "type": "pluriel"}
  ],
  "quran": [
    {"ref": "10, 62", "ar": "أَلَآ إِنَّ أَوْلِيَآءَ ٱللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ", "fr": "Certes, les amis de Dieu, nulle crainte sur eux, et ils ne s'attristent pas."},
    {"ref": "2, 257", "ar": "ٱللَّهُ وَلِىُّ ٱلَّذِينَ ءَامَنُوا۟", "fr": "Dieu est le Proche (le Protecteur) de ceux qui ont porté la foi."}
  ],
  "dict_links": ["wali", "qurb", "wasl"],
  "nom_links": [55, 77],
  "meditation": "Y a-t-il quelqu'un qui me soit assez <em>contigu</em> pour que sa présence me ramène à Lui — sans qu'il ait besoin de parler ?"
}
]

DICT_PATH = Path(__file__).resolve().parents[1] / "data" / "racines.json"
data = json.loads(DICT_PATH.read_text(encoding="utf-8"))

existing_ids = {r["id"] for r in data["racines"]}
added = 0
for entry in NEW:
    if entry["id"] in existing_ids:
        print(f"  ⚠️ {entry['id']} déjà présent — skip")
        continue
    data["racines"].append(entry)
    existing_ids.add(entry["id"])
    added += 1
    print(f"  + {entry['id']} ({entry['gloton_ref']})")

DICT_PATH.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"\n✓ {added} racines ajoutées. Total : {len(data['racines'])}")
