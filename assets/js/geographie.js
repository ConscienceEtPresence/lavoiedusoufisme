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

async function loadGeo() {
  try {
    const res = await fetch('../data/geographie.json');
    GEO_DATA = await res.json();
    renderGrid();
  } catch (err) {
    console.error('Erreur de chargement', err);
    document.getElementById('regions-grid').innerHTML =
      '<p class="center muted">Impossible de charger les régions.</p>';
  }
}

function renderGrid() {
  const root = document.getElementById('regions-grid');
  root.innerHTML = GEO_DATA.regions.map(r => `
    <article class="region-tile" data-slug="${r.slug}">
      <div class="region-tile__ar" aria-hidden="true">${REGION_SYMBOLS[r.slug] || 'هو'}</div>
      <div class="region-tile__apogee">${r.apogee}</div>
      <h2 class="region-tile__name">${r.name.replace(/—.*/, '').trim()}</h2>
      <div class="region-tile__alt">${r.nameAlt}</div>
      <div class="region-tile__more">Ouvrir la fiche ✦</div>
    </article>
  `).join('');

  root.querySelectorAll('.region-tile').forEach(t => {
    t.addEventListener('click', () => openRegion(t.dataset.slug));
  });
}

function openRegion(slug) {
  const r = GEO_DATA.regions.find(x => x.slug === slug);
  if (!r) return;

  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <button class="modal__close" data-close aria-label="Fermer">✕</button>
    <div class="modal__ar">${REGION_SYMBOLS[r.slug] || 'هو'}</div>
    <h2 class="modal__name">${r.name}</h2>
    <div class="modal__sub">${r.apogee} · ${r.nameAlt}</div>

    <div class="modal__section">
      <p style="font-size:1.05rem;color:var(--ink);"><strong>${r.intro}</strong></p>
      <p>${r.body}</p>
    </div>

    <div class="modal__section">
      <h3>Villes-clés</h3>
      <div class="pills">${r.cities.map(c => `<span class="pill pill--city">${c}</span>`).join('')}</div>
    </div>

    <div class="modal__section">
      <h3>Grandes figures</h3>
      <div class="pills">${r.majorFigures.map(f => `<span class="pill pill--figure">${f}</span>`).join('')}</div>
    </div>

    <div class="modal__section">
      <h3>Ordres dominants</h3>
      <div class="pills">${r.orders.map(o => `<span class="pill pill--order">${o}</span>`).join('')}</div>
    </div>

    <div class="modal__section">
      <h3>Esprit</h3>
      <p style="font-style:italic;color:var(--ink);">${r.spirit}</p>
    </div>

    <blockquote style="margin-top: var(--space-lg); font-size: 1.1rem;">
      ${r.quote.text}
      <cite>${r.quote.author}</cite>
    </blockquote>

    <div class="modal__section" style="margin-top: var(--space-lg);">
      <h3>Mots-clés</h3>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
        ${r.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
      </div>
    </div>
  `;

  document.getElementById('region-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('open'));
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

loadGeo();
