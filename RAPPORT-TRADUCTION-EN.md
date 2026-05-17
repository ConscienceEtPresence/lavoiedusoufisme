# RAPPORT DE PASSATION — Traduction anglaise de « La voie du dedans »

### Document de reprise · dernière mise à jour : 2026-05-17

> **À lire intégralement avant toute intervention.** Ce document permet à une nouvelle
> session (humaine ou IA) de **reprendre la traduction anglaise du site sans rupture**.
> Il décrit l'objectif, l'emplacement des fichiers, le workflow, ce qui est déjà fait,
> les conventions techniques établies, et **précisément ce qui reste à faire**.
>
> Lire AUSSI le rapport général du projet : `RAPPORT-PROJET.md` (à la racine de `site/`).

---

## 1. OBJECTIF

Traduire **tout le site** *La voie du dedans* (soufisme, FR + arabe vocalisé) en **anglais**,
par séquences, en gardant le site français intact à tout moment.

- Titre anglais retenu : **The Inner Path**
- Sous-titre du hero : « L'intérieur de l'intérieur » → *The inmost of the inmost*
- Ampleur totale : ~106 pages + modules JSON ≈ 150 000–200 000 mots.
- Méthode : traduction **à la main**, soignée. **Jamais de traduction automatique.**
- L'arabe vocalisé et les translittérations restent **identiques** (ne pas re-translittérer :
  garder « Qâdiriyya », « Rûmî », « ʿishq » tels quels).
- Ton : sobre, noble, contemplatif. Pas d'émojis (fleurons ✦ ✧ seulement).

---

## 2. EMPLACEMENT DES FICHIERS (machine de Brahms, macOS)

- **Dossier SOURCE (on édite ICI)** : `/Users/brahms/Documents/soufisme/site/`
- **Dépôt git de déploiement** :
  `/Users/brahms/Documents/GitHub/ConscienceEtPresence/lavoiedusoufisme/`
- Le dossier `site/` n'est PAS un dépôt git. On édite dans `site/`, on **copie** vers le
  dépôt, on `commit` + `push` **depuis le dépôt**.
- Site en ligne : `lavoiedudedans.fr` (GitHub Pages, déploiement auto après push).

### Structure du miroir anglais

Le site anglais est un **miroir sous `/en/`** :
- FR : `site/index.html`, `site/pages/...`, `site/data/...`
- EN : `site/en/index.html`, `site/en/pages/...`, `site/en/data/...`
- Les **assets sont partagés** (`site/assets/` — CSS, JS, images) : un seul exemplaire.

---

## 3. WORKFLOW DE DÉPLOIEMENT (à appliquer après chaque séquence)

```bash
SRC=/Users/brahms/Documents/soufisme/site
REPO=/Users/brahms/Documents/GitHub/ConscienceEtPresence/lavoiedusoufisme

# 1. Éditer les fichiers dans $SRC
# 2. Copier les fichiers modifiés/créés vers $REPO (mêmes chemins relatifs)
# 3. Commit + push depuis le dépôt :
cd "$REPO"
git add -A
git commit -m "feat(bilingue): ..." -m "détail" -m "Co-Authored-By: Claude ..."
git push
```

- Authentification GitHub : PAT déjà configuré, `git push` marche sans mot de passe.
- **Déployer par séquences cohérentes** (une unité fonctionnelle = un commit + push).
- Messages de commit signés `Co-Authored-By: Claude`.

### Vérification dans le navigateur

Un serveur de preview sert le site depuis une copie temporaire `/tmp/soufisme_preview`
(serveur Ruby WEBrick sur le port 8120). **Cette copie est obsolète** — avant de tester,
re-synchroniser : `rsync -a --delete --exclude='.git' "$SRC/" /tmp/soufisme_preview/`
puis tester `http://localhost:8120/en/...`.

---

## 4. ARCHITECTURE TECHNIQUE BILINGUE (conventions établies — À RESPECTER)

### 4.1 Sélecteur de langue
Injecté automatiquement dans la nav par `main.js` (section 6). Aucune page à éditer pour
l'avoir. Détecte la langue via `document.documentElement.lang`. Sur une page FR il affiche
« EN », sur une page EN « FR ». Repli intelligent : si la page EN n'existe pas encore, un
`fetch HEAD` bascule vers l'accueil `/en/` au lieu d'un 404.

### 4.2 JS partagés rendus « sensibles à la langue »
Les fichiers JS sont **partagés** entre FR et EN. Pattern systématique : en tête du script,
```js
const XX_EN = document.documentElement.lang === 'en';
const XX_T = XX_EN ? { /* libellés EN */ } : { /* libellés FR */ };
```
puis on remplace chaque chaîne d'UI codée en dur par `XX_T.cle`.

**JS déjà rendus bilingues** (et leur version de cache actuelle) :
| Fichier | Version | Pages concernées |
|---|---|---|
| `main.js` | `?v=9` | toutes (sélecteur de langue ajouté) |
| `hub.js` | `?v=3` | decouvrir, cheminer |
| `poesie.js` | `?v=2` | poesie/index |
| `timeline.js` | `?v=3` | histoire |
| `courants.js` | `?v=3` | courants |
| `geographie.js` | `?v=3` | geographie |
| `nasr-eddin.js` | `?v=3` | contes/nasr-eddin/* |
| `racines.js` | `?v=2` | racines/index (FR + EN) |
| `noms-divins.js` | `?v=3` | noms-divins/index (FR + EN) |

**JS PAS ENCORE bilingues** : `amour.js`, `dictionnaire.js`, `metaphysique.js`,
`rencontrer.js`, `search.js`, `tirage-global.js`. `lexique.js` n'a aucune chaîne FR
→ rien à faire.

### 4.3 Données JSON par langue
Les JS chargent leur JSON en chemin relatif (ex. `../data/x.json`, `../../data/x.json`).
Depuis une page EN, ce chemin résout **automatiquement** dans `/en/data/`. Il suffit donc
de créer la version traduite du JSON dans `site/en/data/`.

### 4.4 Règle des chemins relatifs (IMPORTANT)
Pour une page EN à `en/<chemin>` :
- **Liens internes** (brand, nav, autres pages EN, liens `../index.html`) : relatifs à
  `/en/` — donc **identiques** à ceux de la page FR équivalente relative à la racine.
- **Assets et manifest** (`assets/...`, `manifest.webmanifest`, favicons) : pointent vers
  la racine du site → **ajouter UN niveau `../`** de plus que la page FR.
- Exemple : `site/pages/essence.html` utilise `../assets/` ; `site/en/pages/essence.html`
  utilise `../../assets/` mais garde `../index.html` et `../pages/...` pour brand/nav.

### 4.5 En-tête `<head>` d'une page EN
- `<html lang="en">`
- `<title>` et meta `description` traduits
- `og:locale` → `en_US`, ajouter `og:locale:alternate` → `fr_FR`
- `og:url` / `canonical` → URL `/en/...`
- Ajouter 3 balises hreflang :
  ```html
  <link rel="alternate" hreflang="fr" href="https://lavoiedudedans.fr/<chemin-fr>" />
  <link rel="alternate" hreflang="en" href="https://lavoiedudedans.fr/en/<chemin-fr>" />
  <link rel="alternate" hreflang="x-default" href="https://lavoiedudedans.fr/<chemin-fr>" />
  ```
- `<span>` du brand : « La voie du dedans » → **The Inner Path**
- Nav (9 entrées EN) : Home · Discover · Journeying · Encounter · Metaphysics · Poetry ·
  Tales · م Dictionary · جذر Roots
- Footer : « M'écrire » → **Write to me** ; « ← Retour à l'accueil » → **← Back to home**

### 4.6 Gestion du cache
Quand on modifie un JS, **incrémenter son `?v=`** sur toutes les pages qui le chargent,
ET dans `sw.js` si listé. État actuel de `sw.js` : `VERSION = 'lvdd-v7'`.
ATTENTION : `sed` macOS gère mal le `?` — utiliser `perl -pi -e 's/x\.js\?v=2/x.js?v=3/g'`.

---

## 5. CE QUI EST DÉJÀ FAIT (11 commits poussés, site EN en ligne et fonctionnel)

Branche `main`, du commit `1c8a795` au commit `ac83e93`.

### SÉQUENCE 1 — Infrastructure (commit 1c8a795)
- Sélecteur FR/EN dans `main.js`, miroir `/en/`, `hreflang`.
- `assets/css/layout.css` : style `.lang-switch` ajouté.
- `sw.js` : VERSION → `lvdd-v7`, `main.js?v=9`.
- `main.js?v=8` → `?v=9` propagé sur toutes les pages HTML.
- **Accueil EN** : `en/index.html` + `en/data/citations.json` (citations du hero traduites).

### SÉQUENCE 2 — Section « Discover » entièrement bilingue
- 2a (7827a72) : `hub.js` bilingue + `en/pages/decouvrir.html`, `en/pages/cheminer.html`
  + `en/data/decouvrir.json`, `en/data/cheminer.json`.
- 2b (f0343d3) : module **Poetry** — `poesie.js` bilingue, `en/pages/poesie/index.html`,
  `en/data/poesie.json`.
- 2c (84af3b0) : 4 pages de prose — `en/pages/essence.html`, `malentendus.html`,
  `hadith-gabriel.html`, `origine-mot.html`.
- 2d (4f1b632) : **History** — `timeline.js` bilingue, `en/pages/histoire.html`,
  `en/data/chronologie.json` (10 périodes).
- 2e (597d2c1) : **Currents & orders** — `courants.js` bilingue, `en/pages/courants.html`,
  `en/data/ordres.json` (14 ordres).
- 2f (65917ce) : **Spiritual geography** — `geographie.js` bilingue,
  `en/pages/geographie.html`, `en/data/geographie.json` (9 terres).
- 2g (4b11e29) : **The essential lexicon** — `en/pages/lexique.html` (40 termes,
  page statique, `lexique.js` inchangé).

### SÉQUENCE 3a — Module Contes (commit ac83e93)
- `nasr-eddin.js` bilingue, `en/data/nasr-eddin.json` (18 contes traduits).
- `en/pages/contes/index.html` (hub Contes), + les 4 pages du module :
  `en/pages/contes/nasr-eddin/{index,parcours,conte,hasard}.html`.

### SÉQUENCE 3b — Module Racines (commit 707aab9)
- `racines.js` bilingue déployé, `?v=2` sur les pages FR et EN.
- `en/data/racines.json` : 64 racines traduites à la main (gloses Gloton
  reformulées en prose anglaise originale sans guillemets verbatim).
- `en/pages/racines/index.html` créée.
- Outils de build laissés en local dans `site/` (non déployés) :
  `build_racines_en.py` + `en/racines_translations.json` (source des
  traductions, à réutiliser pour toute correction du JSON EN).

### SÉQUENCE 3c — Module 99 Noms divins (commit 3ee12ad)
- `noms-divins.js` bilingue (bloc `ND_T`/`ND_EN`), `?v=3` sur FR et EN.
- `en/data/noms-divins.json` : 100 Noms traduits à la main (commentaires
  d'al-Kāfījī, domaine public — traduits normalement).
- `en/pages/noms-divins/index.html` créée.
- Outils de build laissés en local : `build_noms_en.py` +
  `en/noms_translations.json`.

### Fichiers EN existants (à ce jour)
```
site/en/index.html
site/en/data/   : citations, decouvrir, cheminer, poesie, chronologie,
                  ordres, geographie, nasr-eddin  (.json)
site/en/pages/  : decouvrir, cheminer, essence, malentendus, hadith-gabriel,
                  origine-mot, histoire, courants, geographie, lexique  (.html)
site/en/pages/poesie/index.html
site/en/pages/contes/index.html
site/en/pages/contes/nasr-eddin/{index,parcours,conte,hasard}.html
```

---

## 6. CE QUI RESTE À FAIRE (par ordre conseillé)

### SÉQUENCE 3 (suite) — Modules JSON restants

Chaque module = rendre le JS bilingue (si pas fait) + traduire le JSON dans `en/data/` +
créer la/les page(s) EN. Pattern identique à ce qui a été fait pour Poésie et Contes.

**3b — Module Racines : FAIT (commit 707aab9).** Voir §5.

**3c — Module 99 Noms divins : FAIT (commit 3ee12ad).** Voir §5.

**3d — Module Dictionnaire** (`pages/dictionnaire/index.html`, `data/dictionnaire.json` —
~227 entrées, `assets/js/dictionnaire.js`). Gros fichier. Même méthode.

**3e — Module Amour** (`pages/amour/` : index, parcours, mot, hasard ; `data/amour.json` —
100 mots ; `assets/js/amour.js`). Module le plus abouti du site. Traduire les 100 fiches.

### SÉQUENCE 4 — Rencontrer + auteurs
- `pages/rencontrer.html` : page galerie des maîtres. `rencontrer.js` à rendre bilingue
  (peu de chaînes : « Tous »). Dépend de `data/auteurs.json` → traduire dans `en/data/`.
- `pages/auteurs/` : **28 fiches d'auteurs** + sous-dossiers d'ouvrages
  (`guenon/` 5 pages, `schuon/` 5 pages, `rumi/mathnawi.html`). Pages statiques HTML.
  Voir le rapport général §10 pour le détail des fiches enrichies vs squelettes.

### SÉQUENCE 5 — Le reste
- `pages/metaphysique/index.html` + `pages/metaphysique/themes/` (11 pages).
  `metaphysique.js` à rendre bilingue.
- `pages/cheminer-pages/` : 10 pages (qalb, dhikr, amour, fana-baqa, nafs, sama, khalwa,
  stations, faqr, tawakkul).
- `pages/confreries/` : 5 pages (index + naqshbandiyya, shadhiliyya, mevleviyya, chishtiyya).
- Pages racine restantes : `geographie`(fait), `courants`(fait), `histoire`(fait),
  `index-arabe`, `maitres`, `plan`, `resonances`, `textes-fondamentaux`, `decouvrir`(fait),
  `cheminer`(fait), `rencontrer`. Vérifier lesquelles restent.
- `tirage-global.js` et `search.js` à rendre bilingues (le tirage et la recherche sur les
  pages EN tirent encore dans les JSON FR tant que ce n'est pas fait).

### SÉQUENCE 6 — SEO bilingue final
- Ajouter les 3 balises `hreflang` sur **toutes les pages FR** (seul `index.html` FR les a
  pour l'instant — fait en séquence 1).
- Régénérer `sitemap.xml` avec les URLs `/en/`.
- Vérifier l'audit des liens cassés (doit retourner 0).

---

## 7. POINTS DE VIGILANCE / PIÈGES CONNUS

- **`sed` + `?`** : sur macOS, `sed 's/x.js?v=2/.../'` peut échouer silencieusement.
  Utiliser `perl -pi -e 's/x\.js\?v=2/x.js?v=3/g' fichier`.
- **Preview** : `/tmp/soufisme_preview` est une copie figée ; toujours `rsync` avant de tester.
- **Guillemets** : sur une page/JS EN, utiliser les guillemets anglais `“ ”` (ou
  `&ldquo; &rdquo;`), pas les guillemets français `« »`.
- **`racines.json`** est le plus gros fichier — prévoir une session dédiée.
- Toujours valider un JSON après traduction : `python3 -c "import json;json.load(open('...'))"`.
- Après avoir rendu un JS bilingue, **tester les deux langues** dans le navigateur.

---

## 8. ÉTAT AU 2026-05-18 (session autonome de nuit)

Séquences déployées depuis le commit 3ee12ad :

- **3d Dictionnaire** — FAIT (commit 78c86a2). `dictionnaire.js` bilingue, 208 entrées
  traduites, `en/data/dictionnaire.json`, `en/pages/dictionnaire/index.html`.
- **3e Amour** — FAIT (commit 07afe21). `amour.js` bilingue, 100 mots traduits,
  4 pages EN (`en/pages/amour/{index,parcours,mot,hasard}.html`).
- **Séquence 4 Rencontrer + auteurs** — FAIT en grande partie :
  - `rencontrer.js` bilingue, `en/data/auteurs.json`, `en/pages/rencontrer.html`.
  - **28 fiches auteurs EN** créées dans `en/pages/auteurs/` : les 16 fiches « ready »
    traduites intégralement à la main (rabia, bistami, junayd, hallaj, ghazali,
    suhrawardi, ibn-arabi, ibn-ata-allah, rumi, attar, saadi, yunus-emre, hafez,
    abdelkader, alawi, nasr) + 10 squelettes « à venir » générés
    (`gen_auteurs_stubs_en.py`) + guenon et schuon (fiches complètes).
- **Séquence 6 (partielle)** — FAIT : balises hreflang fr/en/x-default ajoutées aux
  53 pages FR disposant d'une version EN ; `sitemap.xml` enrichi des 53 URLs EN.

### CE QUI RESTE À FAIRE

- **11 sous-pages d'œuvres auteurs** non traduites (liens 404 depuis guenon/schuon/rumi
  EN) : `pages/auteurs/guenon/` (5), `pages/auteurs/schuon/` (5), `pages/auteurs/rumi/mathnawi.html`.
- **Séquence 5** : module `metaphysique/` (index + 11 thèmes, `metaphysique.js` bilingue) ;
  `cheminer-pages/` (10 pages) ; `confreries/` (5 pages) ; pages racine `index-arabe`,
  `maitres`, `plan`, `resonances`, `textes-fondamentaux`.
- `tirage-global.js` et `search.js` à rendre bilingues.
- Une fois ces pages EN créées : relancer le script hreflang (il ne traite que les pages
  FR ayant déjà une contrepartie EN) et régénérer le bloc EN de `sitemap.xml`.
- Audit final des liens cassés (doit renvoyer 0).

---

*Fin du rapport de passation. Tenir à jour à chaque séquence terminée.*
