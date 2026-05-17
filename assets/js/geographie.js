/* ============================================================
   GÉOGRAPHIE — Grille de régions cliquables + modal
   ============================================================ */

const REGION_SYMBOLS = {
  "irak": "بغداد",
  "khorassan": "بخارا",
  "andalousie-maghreb": "الأندلس",
  "egypte-syrie": "القاهرة",
  "anatolie": "قونية",
  "iran": "شيراز",
  "inde": "أجمير",
  "afrique": "توبا",
  "occident": "هو"
};

let GEO_DATA = null;
const GEO_EN = document.documentElement.lang === 'en';
const GEO_T = GEO_EN
  ? { err: 'Unable to load the regions.', more: 'Open the entry ✦', close: 'Close', cities: 'Key cities', figures: 'Major figures', orders: 'Dominant orders', spirit: 'Spirit', keywords: 'Keywords' }
  : { err: 'Impossible de charger les régions.', more: 'Ouvrir la fiche ✦', close: 'Fermer', cities: 'Villes-clés', figures: 'Grandes figures', orders: 'Ordres dominants', spirit: 'Esprit', keywords: 'Mots-clés' };

async function loadGeo() {
  try {
    const res = await fetch('../data/geographie.json');
    GEO_DATA = await res.json();
    renderGrid();
  } catch (err) {
    console.error('Erreur de chargement', err);
    document.getElementById('regions-grid').innerHTML =
      `<p class="center muted">${GEO_T.err}</p>`;
  }
}

function renderGrid() {
  const root = document.getElementById('regions-grid');
  root.innerHTML = GEO_DATA.regions.map(r => `
    <article class="region-tile" data-slug="${r.slug}" role="button" tabindex="0">
      <div class="region-tile__ar" aria-hidden="true">${REGION_SYMBOLS[r.slug] || 'هو'}</div>
      <div class="region-tile__apogee">${r.apogee}</div>
      <h2 class="region-tile__name">${r.name.replace(/—.*/, '').trim()}</h2>
      <div class="region-tile__alt">${r.nameAlt}</div>
      <div class="region-tile__more">${GEO_T.more}</div>
    </article>
  `).join('');

  root.querySelectorAll('.region-tile').forEach(t => {
    t.addEventListener('click', () => openRegion(t.dataset.slug));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openRegion(t.dataset.slug);
      }
    });
  });
}

function openRegion(slug) {
  const r = GEO_DATA.regions.find(x => x.slug === slug);
  if (!r) return;

  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <button class="modal__close" data-close aria-label="${GEO_T.close}">✕</button>
    <div class="modal__ar">${REGION_SYMBOLS[r.slug] || 'هو'}</div>
    <h2 class="modal__name">${r.name}</h2>
    <div class="modal__sub">${r.apogee} · ${r.nameAlt}</div>

    <div class="modal__section">
      <p style="font-size:1.05rem;color:var(--ink);"><strong>${r.intro}</strong></p>
      <p>${r.body}</p>
    </div>

    <div class="modal__section">
      <h3>${GEO_T.cities}</h3>
      <div class="pills">${r.cities.map(c => `<span class="pill pill--city">${c}</span>`).join('')}</div>
    </div>

    <div class="modal__section">
      <h3>${GEO_T.figures}</h3>
      <div class="pills">${r.majorFigures.map(f => `<span class="pill pill--figure">${f}</span>`).join('')}</div>
    </div>

    <div class="modal__section">
      <h3>${GEO_T.orders}</h3>
      <div class="pills">${r.orders.map(o => `<span class="pill pill--order">${o}</span>`).join('')}</div>
    </div>

    <div class="modal__section">
      <h3>${GEO_T.spirit}</h3>
      <p style="font-style:italic;color:var(--ink);">${r.spirit}</p>
    </div>

    <blockquote style="margin-top: var(--space-lg); font-size: 1.1rem;">
      ${r.quote.text}
      <cite>${r.quote.author}</cite>
    </blockquote>

    <div class="modal__section" style="margin-top: var(--space-lg);">
      <h3>${GEO_T.keywords}</h3>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
        ${r.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
      </div>
    </div>
  `;

  const modal = document.getElementById('region-modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => {
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

loadGeo();
