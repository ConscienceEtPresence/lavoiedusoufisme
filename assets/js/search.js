/* ============================================================
   RECHERCHE GLOBALE — palette de commande avec Cmd+K
   ============================================================ */
(function() {
  function siteRoot() {
    const scripts = document.querySelectorAll('script[src*="search"]');
    if (!scripts.length) return '';
    return scripts[scripts.length - 1].src.replace(/assets\/js\/search\.js.*$/, '');
  }
  const ROOT = siteRoot();
  const SR_EN = document.documentElement.lang === 'en';
  const DATA_ROOT = ROOT + (SR_EN ? 'en/' : '');
  const SR_T = SR_EN ? {
    amour: 'Love', conte: 'Tale', poeme: 'Poem', nom: 'Divine name', racine: 'Root', auteur: 'Author',
    placeholder: 'Search a word, a poem, a divine name, a root…',
    hint: 'Type to search · <kbd>↑↓</kbd> navigate · <kbd>↵</kbd> open · <kbd>esc</kbd> close',
    empty: 'Nothing found under those words.', start: 'Type to search…',
    searchLabel: 'Search', searchTitle: 'Search (Cmd+K)'
  } : {
    amour: 'Amour', conte: 'Conte', poeme: 'Poème', nom: 'Nom divin', racine: 'Racine', auteur: 'Auteur',
    placeholder: 'Chercher un mot, un poème, un nom divin, une racine…',
    hint: 'Taper pour chercher · <kbd>↑↓</kbd> naviguer · <kbd>↵</kbd> ouvrir · <kbd>esc</kbd> fermer',
    empty: 'Rien trouvé sous ces mots.', start: 'Taper pour chercher…',
    searchLabel: 'Rechercher', searchTitle: 'Rechercher (Cmd+K)'
  };

  let INDEX = null;
  let loading = false;

  // ============ Repli des accents et signes diacritiques ============
  // Permet de chercher "rumi" et trouver "Rūmī", "hallaj" → "Ḥallāj", etc.
  const DIACRITICS = {
    'ā':'a','â':'a','à':'a','á':'a','ä':'a','ã':'a','ă':'a',
    'ī':'i','î':'i','ì':'i','í':'i','ï':'i',
    'ū':'u','û':'u','ù':'u','ú':'u','ü':'u',
    'ē':'e','ê':'e','è':'e','é':'e','ë':'e',
    'ō':'o','ô':'o','ò':'o','ó':'o','ö':'o','õ':'o',
    'ḥ':'h','ḫ':'h','ẖ':'h','ḩ':'h',
    'ṣ':'s',' š':'s','ş':'s','ś':'s',
    'ḍ':'d','ḏ':'d','đ':'d',
    'ṭ':'t','ṯ':'t','ţ':'t',
    'ẓ':'z','ż':'z','ž':'z','ź':'z',
    'ġ':'g','ğ':'g',
    'ñ':'n','ṅ':'n','ņ':'n','ṇ':'n',
    'ç':'c','č':'c','ć':'c',
    'ḳ':'k','ḷ':'l','ṃ':'m','ṛ':'r','ŕ':'r',
    'ʿ':'', 'ʾ':'', 'ʻ':'', 'ʼ':'', '`':'', '´':'', 'ʹ':'',
    '‘':'', '’':'', '"':'', '«':'', '»':'',
    'ﺀ':'', 'ء':''
  };
  function fold(s) {
    if (!s) return '';
    // 1. décompose les caractères composés (NFD) et retire les marques combinantes
    let t = String(s).normalize('NFD').replace(/[̀-ͯ]/g, '');
    // 2. remplace les diacritiques résiduels (translittération scientifique)
    t = t.replace(/[^\x00-\x7f]/g, c => (c in DIACRITICS ? DIACRITICS[c] : c));
    // 3. minuscules + espaces normalisés
    return t.toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function loadJSON(file) {
    return fetch(DATA_ROOT + 'data/' + file).then(r => r.json()).catch(() => null);
  }

  // Construit l'index unifié
  async function buildIndex() {
    if (INDEX) return INDEX;
    if (loading) return new Promise(res => setTimeout(() => res(buildIndex()), 100));
    loading = true;

    const [poesie, amour, hodja, racines, noms, auteurs] = await Promise.all([
      loadJSON('poesie.json'),
      loadJSON('amour.json'),
      loadJSON('nasr-eddin.json'),
      loadJSON('racines.json'),
      loadJSON('noms-divins.json'),
      loadJSON('auteurs.json'),
    ]);

    const idx = [];

    if (amour && amour.mots) {
      amour.mots.forEach(m => idx.push({
        type: SR_T.amour, label: m.translit,
        sub: m.definition, ar: m.ar,
        url: DATA_ROOT + 'pages/amour/mot.html?id=' + m.id,
        search: [m.translit, m.ar, m.definition, m.id, (m.themes || []).join(' ')].join(' ').toLowerCase()
      }));
    }
    if (hodja && hodja.contes) {
      hodja.contes.forEach(c => idx.push({
        type: SR_T.conte, label: c.titre,
        sub: c.question || '', ar: '',
        url: DATA_ROOT + 'pages/contes/nasr-eddin/conte.html?id=' + c.id,
        search: [c.titre, c.question, c.id, (c.themes || []).join(' '), (c.texte || '').slice(0, 200)].join(' ').toLowerCase()
      }));
    }
    if (poesie && poesie.poemes) {
      poesie.poemes.forEach(p => {
        if (p.status === 'soon') return;
        idx.push({
          type: SR_T.poeme, label: p.titre_fr,
          sub: p.auteur_nom, ar: p.titre_orig,
          url: new URL('pages/poesie/' + (p.href || 'index.html'), DATA_ROOT).href,
          search: [p.titre_fr, p.titre_orig, p.titre_tr, p.auteur_nom, p.tagline].join(' ').toLowerCase()
        });
      });
    }
    if (noms && noms.noms) {
      noms.noms.forEach(n => idx.push({
        type: SR_T.nom, label: n.tr + ' — ' + n.fr,
        sub: n.theme || '', ar: n.ar,
        url: DATA_ROOT + 'pages/noms-divins/index.html#' + n.n,
        search: [n.tr, n.fr, n.ar, n.theme].join(' ').toLowerCase()
      }));
    }
    if (racines && racines.racines) {
      racines.racines.forEach(r => idx.push({
        type: SR_T.racine, label: r.core_fr || r.letters,
        sub: r.root_tr || r.letters, ar: r.root_ar,
        url: DATA_ROOT + 'pages/racines/index.html#' + r.id,
        search: [r.letters, r.core_fr, r.root_tr, r.root_ar, r.id].join(' ').toLowerCase()
      }));
    }
    if (auteurs && auteurs.auteurs) {
      auteurs.auteurs.forEach(a => {
        idx.push({
          type: SR_T.auteur, label: a.name_fr || a.name_tr || a.id,
          sub: a.dates || a.epoque || '', ar: a.name_ar || '',
          url: DATA_ROOT + 'pages/auteurs/' + a.id + '.html',
          search: [a.name_fr, a.name_tr, a.name_ar, a.epoque, a.tradition, a.approche, (a.tagline || '')].join(' ').toLowerCase()
        });
      });
    }

    // ---- Sections du site (navigation) : trouvables par leur nom ----
    // noEN: la page n'existe qu'en français → on garde le chemin FR dans les deux langues.
    const SECTION = SR_EN ? 'Section' : 'Rubrique';
    const PAGES = [
      { fr: "L'Échiquier des gnostiques", en: 'The Chessboard of the Gnostics', path: 'pages/echiquier/', kw: 'echiquier gnostiques plateau ame soul chessboard gnostics' },
      { fr: 'Comment je me sens aujourd’hui', en: 'How I feel today', path: 'pages/echiquier/meteo/', kw: 'meteo emotion colere peur tristesse paix etat mood feel today state how i feel anger fear sadness peace' },
      { fr: 'Le plateau — 100 cases', en: 'The board — 100 squares', path: 'pages/echiquier/plateau/', kw: 'plateau cases board squares' },
      { fr: 'Journal intérieur', en: 'Inner journal', path: 'pages/echiquier/journal/', kw: 'journal note inner' },
      { fr: 'Mes répétitions', en: 'My recurrences', path: 'pages/echiquier/repetitions/', kw: 'repetitions boucles patterns recurrences' },
      { fr: 'Comment utiliser l’Échiquier', en: 'How to use the Chessboard', path: 'pages/echiquier/utiliser/', kw: 'mode emploi utiliser how to use guide' },
      { fr: 'Cheminer', en: 'Journeying', path: 'pages/cheminer.html', kw: 'cheminer chemin voie path journey way' },
      { fr: 'Le carnet', en: 'The notebook', path: 'pages/carnet/', kw: 'carnet notebook vigilance instant' },
      { fr: 'Le Coran', en: 'The Qur’an', path: 'pages/coran/', kw: 'coran quran sourate surah' },
      { fr: 'Les 99 Noms divins', en: 'The 99 Divine Names', path: 'pages/noms-divins/', kw: 'noms divins divine names asma allah mediter meditate' },
      { fr: 'Mots à méditer', en: 'Words to meditate', path: 'pages/dictionnaire/', kw: 'dictionnaire mots soufisme mediter meditate words terms' },
      { fr: 'À la racine (arabe)', en: 'At the root (Arabic)', path: 'pages/racines/', kw: 'racines root arabe arabic mediter' },
      { fr: 'La voie des sagesses — al-Iskandarī', en: 'The way of wisdom — al-Iskandarī', path: 'pages/iskandari/', kw: 'iskandari hikam sagesse wisdom ibn ata allah aphorisme' },
      { fr: 'Poésie', en: 'Poetry', path: 'pages/poesie/', kw: 'poesie poetry rumi hafiz poeme mediter' },
      { fr: 'Les noms de l’amour', en: 'The names of love', path: 'pages/amour/', kw: 'amour love hubb mediter' },
      { fr: 'Contes', en: 'Tales', path: 'pages/contes/', kw: 'contes tales nasreddin histoire' },
    ];
    PAGES.forEach(p => {
      const base = p.noEN ? ROOT : DATA_ROOT;     // page FR-only → chemin FR dans les deux langues
      idx.push({
        type: SECTION, label: SR_EN ? p.en : p.fr, sub: SR_EN ? p.fr : p.en, ar: '',
        url: base + p.path,
        search: [p.fr, p.en, p.kw].join(' ').toLowerCase()
      });
    });

    // Repli des accents : index cherché sans diacritiques (rumi == Rūmī)
    idx.forEach(it => {
      it.search = fold(it.search);
      it.labelFold = fold(it.label);
    });

    INDEX = idx;
    loading = false;
    return idx;
  }

  // Recherche : substring + scoring simple, insensible aux accents
  function search(query, idx) {
    if (!query) return [];
    const q = fold(query);
    const words = q.split(/\s+/).filter(Boolean);
    const scored = [];
    for (const item of idx) {
      let score = 0;
      let allMatch = true;
      for (const w of words) {
        if (!item.search.includes(w)) { allMatch = false; break; }
        // bonus si label commence par le mot
        if (item.labelFold.startsWith(w)) score += 10;
        if (item.labelFold.includes(w)) score += 5;
        score += 1;
      }
      if (allMatch) scored.push({ item, score });
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 12).map(s => s.item);
  }

  // ============ UI ============
  function openPalette() {
    if (document.querySelector('.search-palette')) return;

    const palette = document.createElement('div');
    palette.className = 'search-palette';
    palette.innerHTML = `
      <div class="search-palette__backdrop"></div>
      <div class="search-palette__inner">
        <div class="search-palette__input-wrap">
          <span class="search-palette__icon">⌕</span>
          <input type="search" class="search-palette__input" placeholder="${SR_T.placeholder}" autocomplete="off" autofocus />
          <kbd class="search-palette__kbd">esc</kbd>
        </div>
        <div class="search-palette__results"></div>
        <div class="search-palette__hint">
          ${SR_T.hint}
        </div>
      </div>
    `;
    document.body.appendChild(palette);
    requestAnimationFrame(() => palette.classList.add('is-open'));

    const input = palette.querySelector('.search-palette__input');
    const results = palette.querySelector('.search-palette__results');
    let currentIndex = -1;
    let lastResults = [];

    function render(items) {
      lastResults = items;
      currentIndex = items.length ? 0 : -1;
      if (!items.length) {
        results.innerHTML = `<p class="search-palette__empty">${SR_T.empty}</p>`;
        return;
      }
      results.innerHTML = items.map((it, i) => `
        <a class="search-result ${i === 0 ? 'is-focused' : ''}" href="${it.url}" data-idx="${i}">
          <span class="search-result__type">${it.type}</span>
          ${it.ar ? `<span class="search-result__ar" lang="ar" dir="rtl">${it.ar}</span>` : ''}
          <span class="search-result__label">${it.label}</span>
          ${it.sub ? `<span class="search-result__sub">${it.sub}</span>` : ''}
        </a>
      `).join('');
    }

    async function update() {
      const q = input.value.trim();
      if (!q) {
        results.innerHTML = `<p class="search-palette__empty">${SR_T.start}</p>`;
        lastResults = []; currentIndex = -1;
        return;
      }
      const idx = await buildIndex();
      render(search(q, idx));
    }

    input.addEventListener('input', update);

    function setFocus(i) {
      results.querySelectorAll('.search-result').forEach(el => el.classList.remove('is-focused'));
      const el = results.querySelector(`.search-result[data-idx="${i}"]`);
      if (el) {
        el.classList.add('is-focused');
        el.scrollIntoView({ block: 'nearest' });
      }
    }

    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (lastResults.length) { currentIndex = (currentIndex + 1) % lastResults.length; setFocus(currentIndex); }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (lastResults.length) { currentIndex = (currentIndex - 1 + lastResults.length) % lastResults.length; setFocus(currentIndex); }
      } else if (e.key === 'Enter') {
        if (lastResults[currentIndex]) {
          window.location.href = lastResults[currentIndex].url;
        }
      } else if (e.key === 'Escape') {
        close();
      }
    });

    function close() {
      palette.classList.remove('is-open');
      setTimeout(() => palette.remove(), 250);
    }

    palette.querySelector('.search-palette__backdrop').addEventListener('click', close);

    // Pré-charge l'index dès l'ouverture
    buildIndex();
    update();
  }

  // Hotkey Cmd+K / Ctrl+K  ou /
  document.addEventListener('keydown', e => {
    const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
    const isSlash = e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName);
    if (isCmdK || isSlash) {
      e.preventDefault();
      openPalette();
    }
  });

  // Bouton flottant (à côté du theme-toggle)
  function buildButton() {
    if (document.querySelector('.search-toggle')) return;
    const btn = document.createElement('button');
    btn.className = 'search-toggle';
    btn.setAttribute('aria-label', SR_T.searchLabel);
    btn.setAttribute('title', SR_T.searchTitle);
    btn.innerHTML = '<span class="search-toggle__icon">⌕</span>';
    document.body.appendChild(btn);
    btn.addEventListener('click', openPalette);
  }
  if (document.body) buildButton();
  else document.addEventListener('DOMContentLoaded', buildButton);

  window.openSearch = openPalette;
})();
