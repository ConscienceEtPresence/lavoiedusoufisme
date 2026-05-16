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

  let INDEX = null;
  let loading = false;

  function loadJSON(file) {
    return fetch(ROOT + 'data/' + file).then(r => r.json()).catch(() => null);
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
        type: 'Amour', label: m.translit,
        sub: m.definition, ar: m.ar,
        url: ROOT + 'pages/amour/mot.html?id=' + m.id,
        search: [m.translit, m.ar, m.definition, m.id, (m.themes || []).join(' ')].join(' ').toLowerCase()
      }));
    }
    if (hodja && hodja.contes) {
      hodja.contes.forEach(c => idx.push({
        type: 'Conte', label: c.titre,
        sub: c.question || '', ar: '',
        url: ROOT + 'pages/contes/nasr-eddin/conte.html?id=' + c.id,
        search: [c.titre, c.question, c.id, (c.themes || []).join(' '), (c.texte || '').slice(0, 200)].join(' ').toLowerCase()
      }));
    }
    if (poesie && poesie.poemes) {
      poesie.poemes.forEach(p => {
        if (p.status === 'soon') return;
        idx.push({
          type: 'Poème', label: p.titre_fr,
          sub: p.auteur_nom, ar: p.titre_orig,
          url: ROOT + (p.href || 'pages/poesie/index.html'),
          search: [p.titre_fr, p.titre_orig, p.titre_tr, p.auteur_nom, p.tagline].join(' ').toLowerCase()
        });
      });
    }
    if (noms && noms.noms) {
      noms.noms.forEach(n => idx.push({
        type: 'Nom divin', label: 'al-' + n.tr + ' — ' + n.fr,
        sub: n.theme || '', ar: n.ar,
        url: ROOT + 'pages/noms-divins/index.html#' + n.n,
        search: [n.tr, n.fr, n.ar, n.theme, ('al-' + n.tr)].join(' ').toLowerCase()
      }));
    }
    if (racines && racines.racines) {
      racines.racines.forEach(r => idx.push({
        type: 'Racine', label: r.core_fr || r.letters,
        sub: r.root_tr || r.letters, ar: r.root_ar,
        url: ROOT + 'pages/racines/index.html#' + r.id,
        search: [r.letters, r.core_fr, r.root_tr, r.root_ar, r.id].join(' ').toLowerCase()
      }));
    }
    if (auteurs && auteurs.auteurs) {
      auteurs.auteurs.forEach(a => {
        idx.push({
          type: 'Auteur', label: a.name_fr || a.name_tr || a.id,
          sub: a.dates || a.epoque || '', ar: a.name_ar || '',
          url: ROOT + 'pages/auteurs/' + a.id + '.html',
          search: [a.name_fr, a.name_tr, a.name_ar, a.epoque, a.tradition, a.approche, (a.tagline || '')].join(' ').toLowerCase()
        });
      });
    }

    INDEX = idx;
    loading = false;
    return idx;
  }

  // Recherche : substring + scoring simple
  function search(query, idx) {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/).filter(Boolean);
    const scored = [];
    for (const item of idx) {
      let score = 0;
      let allMatch = true;
      for (const w of words) {
        if (!item.search.includes(w)) { allMatch = false; break; }
        // bonus si label commence par le mot
        if (item.label.toLowerCase().startsWith(w)) score += 10;
        if (item.label.toLowerCase().includes(w)) score += 5;
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
          <input type="search" class="search-palette__input" placeholder="Chercher un mot, un poème, un nom divin, une racine…" autocomplete="off" autofocus />
          <kbd class="search-palette__kbd">esc</kbd>
        </div>
        <div class="search-palette__results"></div>
        <div class="search-palette__hint">
          Taper pour chercher · <kbd>↑↓</kbd> naviguer · <kbd>↵</kbd> ouvrir · <kbd>esc</kbd> fermer
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
        results.innerHTML = '<p class="search-palette__empty">Rien trouvé sous ces mots.</p>';
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
        results.innerHTML = '<p class="search-palette__empty">Taper pour chercher…</p>';
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
    btn.setAttribute('aria-label', 'Rechercher');
    btn.setAttribute('title', 'Rechercher (Cmd+K)');
    btn.innerHTML = '<span class="search-toggle__icon">⌕</span>';
    document.body.appendChild(btn);
    btn.addEventListener('click', openPalette);
  }
  if (document.body) buildButton();
  else document.addEventListener('DOMContentLoaded', buildButton);

  window.openSearch = openPalette;
})();
