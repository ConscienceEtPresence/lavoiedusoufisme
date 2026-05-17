/* ============================================================
   Rencontrer — Galerie des maîtres avec filtres
   ============================================================ */
(() => {
  let DATA = null;
  let filtre = { epoque: 'all', tradition: 'all', approche: 'all' };

  const RC_EN = document.documentElement.lang === 'en';
  const RC_T = RC_EN ? {
    epoque: 'Era', tradition: 'Tradition', approche: 'Approach',
    all: 'All', soon: 'coming soon'
  } : {
    epoque: 'Époque', tradition: 'Tradition', approche: 'Approche',
    all: 'Tous', soon: 'à venir'
  };

  const filtresEl = document.getElementById('filtres-container');
  const grilleEl  = document.getElementById('auteurs-grille');
  const emptyEl   = document.getElementById('auteurs-empty');

  fetch('../data/auteurs.json')
    .then(r => r.json())
    .then(data => {
      DATA = data;
      buildFiltres();
      render();
    });

  function buildFiltres() {
    const groupes = [
      { key: 'epoque',    label: RC_T.epoque,    items: DATA.filtres.epoque },
      { key: 'tradition', label: RC_T.tradition, items: DATA.filtres.tradition },
      { key: 'approche',  label: RC_T.approche,  items: DATA.filtres.approche }
    ];

    filtresEl.innerHTML = groupes.map(g => `
      <div class="filtre-groupe" data-groupe="${g.key}">
        <div class="filtre-label">${g.label}</div>
        <div class="filtre-pills">
          <button class="filtre-pill active" data-key="${g.key}" data-val="all">${RC_T.all}</button>
          ${g.items.map(it => `
            <button class="filtre-pill" data-key="${g.key}" data-val="${it.id}">
              ${it.label}${it.periode ? ` <span class="filtre-periode">${it.periode}</span>` : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `).join('');

    filtresEl.addEventListener('click', e => {
      const btn = e.target.closest('.filtre-pill');
      if (!btn) return;
      const key = btn.dataset.key;
      const val = btn.dataset.val;
      filtre[key] = val;
      // mettre à jour visuellement
      filtresEl.querySelectorAll(`.filtre-pill[data-key="${key}"]`).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
  }

  function render() {
    if (!DATA) return;
    const filtres = DATA.auteurs.filter(a => {
      if (filtre.epoque    !== 'all' && a.epoque    !== filtre.epoque)    return false;
      if (filtre.tradition !== 'all' && a.tradition !== filtre.tradition) return false;
      if (filtre.approche  !== 'all' && a.approche  !== filtre.approche)  return false;
      return true;
    });

    if (filtres.length === 0) {
      grilleEl.innerHTML = '';
      emptyEl.classList.add('show');
      return;
    }
    emptyEl.classList.remove('show');

    // Grouper par époque pour l'affichage
    const parEpoque = {};
    DATA.filtres.epoque.forEach(e => parEpoque[e.id] = []);
    filtres.forEach(a => {
      if (!parEpoque[a.epoque]) parEpoque[a.epoque] = [];
      parEpoque[a.epoque].push(a);
    });

    let html = '';
    DATA.filtres.epoque.forEach(e => {
      const auteurs = parEpoque[e.id];
      if (!auteurs || auteurs.length === 0) return;

      html += `<div class="epoque-section">`;
      html += `<h2 class="epoque-titre"><span class="epoque-titre__txt">${e.label}</span>`;
      html += `<span class="epoque-titre__periode">${e.periode}</span></h2>`;
      html += `<div class="epoque-cartes">`;

      auteurs.forEach(a => {
        const readyClass = a.status === 'ready' ? 'is-ready' : 'is-soon';
        const readyBadge = a.status === 'soon' ? `<span class="auteur-badge">${RC_T.soon}</span>` : '';
        html += `
          <a class="auteur-carte ${readyClass}" href="${a.href}">
            ${readyBadge}
            <div class="auteur-carte__ar" lang="ar" dir="rtl">${a.name_ar}</div>
            <div class="auteur-carte__tr">${a.name_tr}</div>
            <div class="auteur-carte__fr">${a.name_fr}</div>
            <div class="auteur-carte__dates">${a.dates}</div>
            <div class="auteur-carte__lieu">${a.lieu}</div>
            <div class="auteur-carte__tagline">${a.tagline}</div>
            <div class="auteur-carte__citation">${a.citation}</div>
          </a>
        `;
      });

      html += `</div></div>`;
    });

    grilleEl.innerHTML = html;
  }
})();
