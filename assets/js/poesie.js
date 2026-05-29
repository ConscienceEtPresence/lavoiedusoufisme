/* ============================================================
   Poésie — Anthologie filtrable de poèmes soufis
   ============================================================ */
(() => {
  let DATA = null;
  let filtre = { auteur: 'all', langue: 'all', theme: 'all' };
  const isEN = document.documentElement.lang === 'en';
  const T = isEN
    ? { auteur: 'Author', langue: 'Language', theme: 'Theme', tous: 'All', soon: 'coming soon' }
    : { auteur: 'Auteur', langue: 'Langue', theme: 'Thème', tous: 'Tous', soon: 'à venir' };

  const filtresEl = document.getElementById('poesie-filtres');
  const grilleEl  = document.getElementById('poesie-grille');
  const emptyEl   = document.getElementById('poesie-empty');

  function ensurePartage(cb) {
    if (window.LVDDPartage) { cb(); return; }
    let s = document.querySelector('script[data-partage-js]');
    if (!s) {
      s = document.createElement('script');
      s.src = '../../assets/js/partage.js?v=1';
      s.dataset.partageJs = '1';
      document.head.appendChild(s);
    }
    s.addEventListener('load', function () { if (window.LVDDPartage) cb(); });
  }
  if (grilleEl) grilleEl.addEventListener('click', function (e) {
    const b = e.target.closest('[data-share-poem]');
    if (!b) return;
    e.preventDefault();
    const p = DATA && DATA.poemes.find(x => x.id === b.dataset.sharePoem);
    if (p) ensurePartage(function () {
      window.LVDDPartage.open({
        ar: p.titre_orig, tr: p.titre_tr, text: p.extrait_fr,
        attribution: p.auteur_nom + ' · ' + p.titre_fr
      });
    });
  });

  fetch('../../data/poesie.json')
    .then(r => r.json())
    .then(data => {
      DATA = data;
      buildFiltres();
      render();
    });

  function buildFiltres() {
    const groupes = [
      { key: 'auteur',    label: T.auteur,    items: DATA.filtres.auteur },
      { key: 'langue',    label: T.langue,    items: DATA.filtres.langue },
      { key: 'theme',     label: T.theme,     items: DATA.filtres.theme  }
    ];

    filtresEl.innerHTML = groupes.map(g => `
      <div class="poesie-filtre-groupe">
        <div class="poesie-filtre-label">${g.label}</div>
        <div class="poesie-filtre-pills">
          <button class="poesie-pill active" data-key="${g.key}" data-val="all">${T.tous}</button>
          ${g.items.map(it => `
            <button class="poesie-pill" data-key="${g.key}" data-val="${it.id}">${it.label}</button>
          `).join('')}
        </div>
      </div>
    `).join('');

    filtresEl.addEventListener('click', e => {
      const btn = e.target.closest('.poesie-pill');
      if (!btn) return;
      const key = btn.dataset.key;
      const val = btn.dataset.val;
      filtre[key] = val;
      filtresEl.querySelectorAll(`.poesie-pill[data-key="${key}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  }

  function render() {
    if (!DATA) return;
    const filtres = DATA.poemes.filter(p => {
      if (filtre.auteur !== 'all' && p.auteur !== filtre.auteur) return false;
      if (filtre.langue !== 'all' && p.langue !== filtre.langue) return false;
      if (filtre.theme  !== 'all' && !(p.themes && p.themes.includes(filtre.theme))) return false;
      return true;
    });

    if (filtres.length === 0) {
      grilleEl.innerHTML = '';
      emptyEl.classList.add('show');
      return;
    }
    emptyEl.classList.remove('show');

    grilleEl.innerHTML = filtres.map(p => {
      const readyClass = p.status === 'ready' ? 'is-ready' : 'is-soon';
      const readyBadge = p.status === 'soon' ? `<span class="poesie-badge">${T.soon}</span>` : '';
      const dir = p.langue === 'turque' ? 'ltr' : 'rtl';
      return `
        <div class="poesie-carte-wrap">
          <a class="poesie-carte ${readyClass}" href="${p.href}">
            ${readyBadge}
            <div class="poesie-carte__corpus">${p.corpus} · ${p.date}</div>
            <div class="poesie-carte__titre-orig" lang="${p.langue === 'turque' ? 'tr' : (p.langue === 'persane' ? 'fa' : 'ar')}" dir="${dir}">${p.titre_orig}</div>
            <div class="poesie-carte__titre-tr">${p.titre_tr}</div>
            <h2 class="poesie-carte__titre-fr">${p.titre_fr}</h2>
            <div class="poesie-carte__auteur">${p.auteur_nom}</div>
            <p class="poesie-carte__extrait">${isEN ? `&ldquo;${p.extrait_fr}&rdquo;` : `« ${p.extrait_fr} »`}</p>
            <p class="poesie-carte__tagline"><em>${p.tagline}</em></p>
          </a>
          ${p.status === 'ready' ? `<button type="button" class="poesie-share" data-share-poem="${p.id}" title="${isEN ? 'Offer' : 'Offrir'}" aria-label="${isEN ? 'Offer this poem' : 'Offrir ce poème'}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 13 C6 9.5 9 9.5 12 12"/><path d="M12 12 C15 9.5 18 9.5 21.5 13"/></svg></button>` : ''}
        </div>
      `;
    }).join('');
  }
})();
