# RAPPORT DE PROJET — La voie du dedans
### Document de passation complet · dernière mise à jour : 2026-05-16

> Ce document permet à toute nouvelle session (humaine ou IA) de reprendre le projet
> sans rupture. Il décrit l'identité, la philosophie, l'architecture technique,
> le contenu, les conventions, le workflow de déploiement, et l'objectif en cours
> (traduction anglaise). **À lire intégralement avant toute intervention.**

---

## 1. IDENTITÉ DU PROJET

- **Nom du site** : *La voie du dedans* (anciennement « La voie du soufisme »).
- **Domaine** : `lavoiedudedans.fr` (et `lavoiedudedans.com`, achetés chez OVH).
- **Nature** : bibliothèque contemplative en ligne consacrée au **soufisme** et à la
  spiritualité comparée — en français, avec l'arabe vocalisé.
- **Auteur/propriétaire** : Brahms (enseignant PSE en lycée professionnel, profil de
  pensée intégrative — soufisme, sciences humaines, mystique comparée, ennéagramme).
- **Public** : francophone, du débutant curieux au lecteur avancé.
- **Hébergement** : GitHub Pages, domaine personnalisé via fichier `CNAME`.
- **Analytics** : Google Analytics (ID `G-B7WRGPZMT3`) présent sur les pages.
- **Newsletter** : Buttondown (`buttondown.email/lavoiedudedans`), gratuit < 100 abonnés.

### Emplacements physiques (machine de Brahms, macOS)

- **Dossier de travail (SOURCE)** : `/Users/brahms/Documents/soufisme/site/`
  → C'est ICI qu'on édite les fichiers.
- **Dépôt git (REPO de déploiement)** :
  `/Users/brahms/Documents/GitHub/ConscienceEtPresence/lavoiedusoufisme/`
  → C'est ce dossier qui est lié à GitHub et déclenche le déploiement Pages.
- **Dossier des ressources brutes** (livres EPUB/PDF, non publiés) :
  `/Users/brahms/Documents/soufisme/` (et sous-dossiers : `contes/hodja/`,
  `schuon frithjof/`, `maurice gloton/`, etc.)

> ⚠️ **WORKFLOW CRITIQUE** : on édite dans `site/`, puis on **copie** les fichiers
> modifiés vers le dépôt `lavoiedusoufisme/`, puis on `git add` + `git commit` +
> `git push` depuis le dépôt. Le dossier `site/` n'est PAS un dépôt git lui-même.
> Voir §9 pour la procédure exacte.

---

## 2. PHILOSOPHIE ET INTENTION

Le site n'est pas un blog ni une encyclopédie. C'est une **bibliothèque vivante et
contemplative**. Principes directeurs :

1. **La lenteur plutôt que la performance.** On invite à lire lentement, à méditer.
   Le ton est sobre, noble, jamais racoleur.
2. **Le bilinguisme arabe/français** comme cœur de l'expérience : chaque mot arabe est
   donné vocalisé (signes diacritiques) + translittération scientifique + traduction.
3. **L'intériorité.** Le titre « La voie du dedans » et le sous-titre du hero
   (« L'intérieur de l'intérieur », بَاطِنُ البَاطِن) disent tout : on cherche le sens caché.
4. **La rigueur intellectuelle SANS la lourdeur universitaire.** On vulgarise sans
   trahir. On cite les sources. On distingue le savoir de l'opinion.
5. **Le respect du droit d'auteur** (voir §8, règle absolue).
6. **Pas d'émojis.** Le client a explicitement demandé : aucune émoticône colorée.
   Seuls les fleurons typographiques unicode (✦, ✧) sont admis — ils sont sobres et
   présents dans toute l'identité visuelle.
7. **Pas de commentaires de code superflus, pas de fioritures.** Le code reste simple,
   vanilla (aucun framework).

---

## 3. PHILOSOPHIE TECHNIQUE

- **Stack** : HTML/CSS/JavaScript **purs (vanilla)**. Aucun framework, aucune
  compilation, aucun build. Les pages sont servies telles quelles.
- **Modules pilotés par JSON** : les grands modules (Amour, Contes, Poésie, Racines,
  Noms divins, Dictionnaire) ne sont PAS des centaines de pages HTML. Ce sont :
  - un fichier `data/<module>.json` contenant toutes les entrées,
  - un fichier `assets/js/<module>.js` qui charge le JSON et génère le HTML,
  - quelques pages-gabarits (`index.html`, `parcours.html`, `mot.html` /
    `conte.html`, `hasard.html`) qui s'adaptent via le paramètre d'URL `?id=`.
- **Test local** : `cd /Users/brahms/Documents/soufisme/site && python3 -m http.server 8080`
  puis ouvrir `http://localhost:8080/`.

---

## 4. ARBORESCENCE COMPLÈTE

```
site/
├── index.html               ← page d'accueil (hero, 3 portes, "Pour méditer", newsletter)
├── CNAME                     ← "lavoiedudedans.fr"
├── manifest.webmanifest      ← PWA (nom, icônes, raccourcis)
├── sw.js                     ← service worker (cache offline)
├── robots.txt                ← SEO
├── sitemap.xml               ← SEO (180 URLs, généré par script)
├── RAPPORT-PROJET.md         ← CE DOCUMENT
│
├── assets/
│   ├── css/   (21 fichiers)  ← base.css, layout.css, components.css, bilingue.css,
│   │                            accueil.css, dark-mode.css, + 1 par module
│   ├── js/    (16 fichiers)  ← main.js, search.js, tirage-global.js, + 1 par module
│   └── img/                  ← icônes, favicons
│
├── data/      (16 JSON)      ← amour.json, nasr-eddin.json, racines.json,
│                                noms-divins.json, poesie.json, auteurs.json, etc.
│
├── scripts/                  ← scripts Python ponctuels (intégration Gloton, etc.)
│
└── pages/
    ├── (16 pages racine)     ← decouvrir, cheminer, rencontrer, histoire, essence,
    │                            courants, geographie, maitres, plan, index-arabe,
    │                            hadith-gabriel, lexique, malentendus, origine-mot,
    │                            resonances, textes-fondamentaux
    │
    ├── auteurs/  (28 fiches) ← une page par maître ; + sous-dossiers d'ouvrages :
    │   ├── guenon/   (5 pages d'ouvrages)
    │   ├── schuon/   (5 pages d'ouvrages)
    │   └── rumi/     (1 page : mathnawi.html)
    │
    ├── metaphysique/
    │   ├── index.html        ← les 10 chapitres thématiques
    │   └── themes/  (11 pages thématiques développées)
    │
    ├── cheminer-pages/ (10)  ← qalb, dhikr, amour, fana-baqa, nafs, sama, etc.
    │
    ├── confreries/   (5)     ← index + naqshbandiyya, shadhiliyya, mevleviyya,
    │                            chishtiyya (qadiriyya/tijaniyya/alawiyya = "à venir")
    │
    ├── amour/        ← MODULE "Les noms de l'amour" : index, parcours, mot, hasard
    ├── contes/       ← index + nasr-eddin/ (index, parcours, conte, hasard)
    ├── poesie/       ← index (module poésie)
    ├── racines/      ← index (dictionnaire des racines arabes)
    ├── noms-divins/  ← index (99 Noms divins)
    └── dictionnaire/ ← index (dictionnaire du soufisme)
```

**Total : 106 pages HTML.**

---

## 5. LE GABARIT (TEMPLATE) DES PAGES

Il n'y a **pas de système de templates** : chaque page a son HTML complet en dur.
C'est un choix assumé (simplicité, pas de build), mais cela implique que toute
modification de structure commune doit être propagée par script.

### Structure-type d'une page

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset / viewport />
  <link rel="icon" ... />  (favicons + apple-touch-icon)
  <link rel="manifest" href=".../manifest.webmanifest" />
  <meta name="theme-color" content="#0F1830" />
  <title>... — La voie du dedans</title>
  <meta name="description" ... />
  <!-- Open Graph + Twitter Card + canonical (ajoutés sur 96 pages) -->
  <link rel="preconnect" + Google Fonts />
  <link rel="stylesheet" href=".../base.css" />  (+ layout, components, bilingue, + CSS module)
  <!-- Google Analytics gtag -->
</head>
<body class="page-enter">
  <header class="site-header">
    <div class="container site-header__inner">
      <a class="brand"> ... La voie du dedans </a>
      <button class="nav-toggle"> ... </button>
      <nav><ul class="site-nav"> ... 9 liens ... </ul></nav>
    </div>
  </header>
  <main> ... </main>
  <footer class="site-footer">
    <div class="container"> ornement ✦ + citation + "M'écrire" </div>
  </footer>
  <script src=".../main.js?v=8"></script>
</body>
</html>
```

### La navigation (harmonisée sur 94 pages)

Menu unique, 9 entrées, dans cet ordre :
**Accueil · Découvrir · Cheminer · Rencontrer · Métaphysique · Poésie · Contes ·
م Dictionnaire · جذر Racines**

Les chemins sont **relatifs**, calculés selon la profondeur de la page (`../` × n).
L'item actif porte `class="active"`, détecté automatiquement par l'emplacement.
Le script d'harmonisation est réutilisable (voir §11).

### Polices (Google Fonts)

- **Cormorant Garamond** — titres, citations (display, italique élégante)
- **Source Serif 4** — corps de texte
- **Amiri** — texte arabe vocalisé
- **Inter** — éléments d'interface (labels, boutons)

### Palette (variables CSS dans `base.css`)

Mode clair : `--paper #FBF7EF` (parchemin), `--ink #0F1830` (encre nuit),
`--gold #B8860B`, `--rose #A65A4A`, `--turquoise #2E7D7A`.
Mode nuit (`dark-mode.css`, `[data-theme="dark"]`) : `--paper #11161F`,
`--ink #E8DFC9` (parchemin clair), or conservé.

---

## 6. LES MODULES (pilotés par JSON)

| Module | Page d'entrée | JSON | JS | Entrées | Couleur |
|---|---|---|---|---|---|
| Les noms de l'amour | `pages/amour/` | `amour.json` | `amour.js` | **100 mots** | grenat #8E2A3D |
| Contes (Nasr Eddin Hodja) | `pages/contes/nasr-eddin/` | `nasr-eddin.json` | `nasr-eddin.js` | **18 contes** | ocre #B8762F |
| Poésie | `pages/poesie/` | `poesie.json` | `poesie.js` | 6 poèmes | rose #A65A4A |
| Racines arabes du Coran | `pages/racines/` | `racines.json` | `racines.js` | **64 racines** | — |
| 99 Noms divins | `pages/noms-divins/` | `noms-divins.json` | `noms-divins.js` | 100 noms | — |
| Dictionnaire du soufisme | `pages/dictionnaire/` | `dictionnaire.json` | `dictionnaire.js` | — | — |

### Module "Les noms de l'amour" (le plus abouti)
100 mots arabes pour dire l'amour, classés en **6 stations** (éveil → chant → brûlure
→ perte → retrouvailles → divin) et **9 thèmes** (feu, eau, corps, folie, lien,
séparation, douceur, éclat, ivresse). Chaque fiche : arabe vocalisé, translittération,
définition, description en prose, témoin (citation classique : Coran, poésie, mystique),
question méditative, ouverture métaphysique soufie, racine, mots de la famille.
Carte d'accès sur l'accueil dans la section « Pour méditer ».

### Module "Contes — Nasr Eddin Hodja"
18 contes, classés par **12 thèmes** et **7 esprits** (koan, retournement, miroir,
insolence, idiotie, porte fermée, enseignement inversé). Chaque conte : récit en prose
ORIGINALE (réécrite à partir de plots folkloriques du domaine public — voir §8),
question méditative, suggestion métaphysique. Page auteur (`pages/contes/nasr-eddin/
index.html`) + parcours filtrable + fiche conte + tirage hasard.

### Racines — intégration Maurice Gloton
Les **64 racines** portent toutes une « glose Gloton » authentique : citation de
*Maurice Gloton, Une approche du Coran par la grammaire et le lexique* (Albouraq),
avec référence n° d'entrée + page, accompagnée d'une synthèse interprétative originale.

---

## 7. FONCTIONNALITÉS TRANSVERSALES

Toutes injectées automatiquement par `main.js` (chargé sur toutes les pages) :

1. **Mode nuit** (`dark-mode.css` + logique dans `main.js`) — bouton flottant ☾/☀
   en bas à droite, mémorisation `localStorage` (clé `lvdd-theme`), respect de
   `prefers-color-scheme`.
2. **Recherche globale** (`search.js`, injecté par main.js) — palette `Cmd+K` ou `/`,
   ou loupe flottante. Indexe les 6 JSON. **Insensible aux accents/diacritiques**
   (fonction `fold()` : « rumi » trouve « Rūmī »). Navigation clavier.
3. **Tirage global** (`tirage-global.js`) — bouton sur l'accueil ; pioche au hasard
   parmi ~288 contenus, affiche un modal contemplatif.
4. **PWA** (`manifest.webmanifest` + `sw.js`) — site installable, fonctionne offline.
   Le service worker n'est enregistré qu'en production (lavoiedudedans.fr/.com,
   github.io), pas en localhost.
5. **Menu mobile** — bascule en menu hamburger sous 1100px.
6. **Citation tournante** sur l'accueil (`rotateQuote()` dans main.js).

### Gestion du cache (IMPORTANT)
Les fichiers JS portent un numéro de version dans l'URL : `main.js?v=8`,
`search.js?v=3`. Quand on modifie un JS, il FAUT incrémenter ce numéro partout
(sed sur les .html), ET dans `sw.js` (constante `VERSION` + liste `PRECACHE_URLS`).
État au 2026-05-16 : `main.js?v=8`, `search.js?v=3`, `tirage-global.js?v=1`,
`dark-mode.css?v=2`, `sw.js VERSION = 'lvdd-v6'`.

---

## 8. RÈGLE ABSOLUE — DROIT D'AUTEUR

**Aucune reproduction de texte sous droits d'auteur.** Cette règle a été établie
après un incident : des contes avaient d'abord été recopiés de la traduction Maunoury
(sous droits), puis entièrement réécrits.

Méthode validée et à appliquer systématiquement :
- Les **œuvres anciennes** (Coran, ʿAṭṭār XIIIᵉ s., Ibn ʿArabī, poésie classique,
  Margaret Smith 1928, etc.) sont **domaine public** → citations courtes autorisées.
- Les **œuvres récentes** (Schuon †1998, Guénon †1951, Gloton, traductions modernes,
  Vandestra 2018, Maunoury 2002…) sont **sous droits** → on s'en sert comme
  **source de recherche** (catalogue d'idées, structure), mais on **rédige une prose
  entièrement originale**. Les citations directes restent **courtes** (fair use
  académique), entre guillemets, attribuées.
- Les **intrigues folkloriques** (contes de Hodja) sont du patrimoine public : on les
  **réécrit dans nos propres mots**, jamais en paraphrasant une traduction moderne.

---

## 9. WORKFLOW DE DÉPLOIEMENT

```bash
# 1. On édite dans le dossier SOURCE :
#    /Users/brahms/Documents/soufisme/site/

# 2. On copie les fichiers modifiés vers le DÉPÔT :
SRC=/Users/brahms/Documents/soufisme/site
REPO=/Users/brahms/Documents/GitHub/ConscienceEtPresence/lavoiedusoufisme
cp "$SRC/<fichier>" "$REPO/<fichier>"
# ou en masse pour le HTML :
rsync -a --include="*.html" --include="*/" --exclude="*" "$SRC/pages/" "$REPO/pages/"

# 3. On commit + push DEPUIS le dépôt :
cd "$REPO"
git add -A
git commit -m "message"   # signature : Co-Authored-By: Claude ...
git push
```

- L'authentification GitHub utilise un **PAT (Personal Access Token)** déjà configuré
  dans le remote — `git push` fonctionne sans mot de passe.
- L'identité git a été réécrite : tous les commits sont sous
  `Brahms <245812015+ConscienceEtPresence@users.noreply.github.com>`.
- GitHub Pages déploie automatiquement après le push (~1 min).

---

## 10. ÉTAT ACTUEL DÉTAILLÉ (2026-05-16)

### Auteurs (28 fiches dans `pages/auteurs/`)
abdelkader, alawi, attar, bistami, burckhardt, chittick, chodkiewicz, corbin,
ghazali, **guenon**, hafez, hallaj, ibn-arabi, ibn-ata-allah, jili, junayd, lings,
mulla-sadra, nasr, qushayri, **rabia**, **rumi**, saadi, **schuon**, sirhindi,
suhrawardi, tijani, yunus-emre.

Fiches **complètes et enrichies** : Râbiʿa (7 récits de sainteté + sources),
Schuon (bio complète + 5 pages d'ouvrages), Guénon (bio complète + 5 pages d'ouvrages).
Les autres fiches sont à des degrés divers ; plusieurs sont encore des **squelettes**
(« À venir » dans les sections).

### Pages d'ouvrages déjà rédigées (gabarit « présentation d'ouvrage »)
- **Schuon** : oeil-du-coeur (1950), sentiers-de-gnose (1957), du-divin-a-l-humain
  (1981), avoir-un-centre (1988), le-jeu-des-masques (1992).
- **Guénon** : orient-et-occident (1924), crise-du-monde-moderne (1927),
  symbolisme-de-la-croix (1931), etats-multiples-de-l-etre (1932),
  esoterisme-islamique-et-taoisme (1973).
- **Rumi** : mathnawi.html (le chant du roseau).

> **Gabarit d'une page d'ouvrage** (à réutiliser pour les futurs auteurs) :
> en-tête bilingue (titre + date) → « Le geste central » (l'intuition du livre) →
> « Les concepts-clés (vulgarisés) » (liste `<ul class="concept-list">`) →
> « L'architecture de l'ouvrage » (les parties) → « Quelques voix » (3 citations
> courtes) → « Pour le lire » (conseils) → « Résonances » (liens internes).
> Chaque ouvrage est lié depuis la fiche auteur par une carte `.oeuvre-carte`.

### Module Amour : 100 mots, COMPLET.
### Module Contes : 18 contes Hodja, fonctionnel (peut être étendu).
### Racines : 64 racines, glose Gloton COMPLÈTE (64/64).
### SEO : sitemap.xml (180 URLs), robots.txt, Open Graph sur 96 pages.

### Travaux récents (voir `git log`)
Mode nuit, recherche globale, tirage global, PWA, index-arabe, SEO, pages Schuon,
pages Guénon, corrections d'un audit externe (liens cassés, footer, nav harmonisée),
recherche insensible aux accents.

### Points connus restant à traiter (mineurs)
- Plusieurs fiches auteurs encore en squelette « À venir » → à enrichir
  progressivement (même méthode : EPUB en source de recherche → prose originale).
- Confréries qadiriyya / tijaniyya / alawiyya : cartes « à venir » non cliquables,
  pages à créer un jour.
- Pas de gabarit central : toute modif structurelle commune se fait par script Python.

---

## 11. SCRIPTS RÉUTILISABLES

Dans `site/scripts/` ou à reconstruire au besoin :
- **Audit des liens cassés** (Python) : parcourt tous les .html, vérifie chaque
  href/src local, ignore commentaires et `<script>`. Doit toujours retourner 0.
- **Harmonisation de la nav** : remplace le bloc `<ul class="site-nav">…</ul>` sur
  toutes les pages, avec chemins relatifs calculés par profondeur + item actif.
- **Génération du sitemap** : lit les JSON + liste les pages, écrit `sitemap.xml`.
- **Ajout Open Graph** : insère les balises OG/Twitter avant `</head>`.
- Scripts d'intégration Gloton : `update_*_gloton.py`.

---

## 12. OBJECTIF EN COURS — TRADUCTION ANGLAISE COMPLÈTE

**Décision prise par le client : traduire TOUT le site en anglais, par séquences.**

### Ampleur
~106 pages + 6 JSON de données = environ **150 000 à 200 000 mots** de prose
littéraire soignée. C'est un chantier équivalent à la construction du site.

### Architecture bilingue recommandée (à valider/poser)
1. **Schéma d'URL** : créer un miroir sous `/en/` (ex. `/en/index.html`,
   `/en/pages/amour/…`). Le français reste à la racine.
2. **Attribut de langue** : `<html lang="en">` sur les pages anglaises.
3. **Sélecteur FR/EN** : un bouton dans le header (ou flottant comme le mode nuit),
   qui bascule vers la page équivalente dans l'autre langue, avec mémorisation
   `localStorage` (clé suggérée `lvdd-lang`).
4. **JSON bilingues** : soit dupliquer (`amour.json` / `amour.en.json`), soit ajouter
   des champs `_en` à chaque entrée. La duplication est plus simple à maintenir.
5. **`hreflang`** dans le `<head>` pour le SEO (indiquer à Google les paires FR/EN).
6. **sitemap.xml** : ajouter les URLs `/en/`.

### Méthode de traduction
- Traduire **à la main, avec soin** — surtout la poésie, les concepts soufis, les
  citations. **Ne JAMAIS utiliser de traduction automatique** : elle massacrerait
  les translittérations arabes et la prose contemplative.
- Garder l'arabe vocalisé **identique** (il ne se traduit pas).
- Les translittérations restent identiques (ex. *ʿishq*, *Rūmī*).
- Adapter les titres : « La voie du dedans » → *The Inward Way* (à valider avec le
  client) ; « L'intérieur de l'intérieur » → *The Inmost of the Inmost*.
- Préserver le **ton** : sobre, noble, contemplatif — pas de registre familier.
- Respecter la **règle du droit d'auteur** (§8) à l'identique en anglais.

### Séquençage suggéré
Travailler par vagues, pousser après chaque vague :
1. Infrastructure bilingue (sélecteur, routage `/en/`, attribut lang).
2. Accueil + les 6 pages d'entrée de module.
3. Les modules pilotés par JSON (traduire les JSON un par un).
4. Les pages auteurs + pages d'ouvrages.
5. Les pages métaphysique, cheminer, confréries, et le reste.
6. SEO bilingue (hreflang, sitemap).

---

## 13. CONVENTIONS À RESPECTER (récapitulatif)

- ❌ Pas d'émojis colorés. ✅ Fleurons ✦ ✧ uniquement.
- ✅ Prose originale ; citations courtes attribuées ; jamais de copie d'œuvre sous droits.
- ✅ Arabe toujours vocalisé + translittération scientifique + traduction.
- ✅ Code vanilla, simple, sans framework, sans build.
- ✅ Éditer dans `site/`, copier vers le dépôt, commit + push depuis le dépôt.
- ✅ Incrémenter les versions de cache (`?v=`) quand on modifie un JS/CSS, + `sw.js`.
- ✅ Après toute modif de liens/structure : relancer l'audit des liens cassés (→ 0).
- ✅ Ton sobre, contemplatif, noble. La lenteur, l'intériorité, le mot juste.
- ✅ Commits signés `Co-Authored-By: Claude`.

---

*Fin du rapport. Ce document doit être tenu à jour à chaque évolution majeure.*
