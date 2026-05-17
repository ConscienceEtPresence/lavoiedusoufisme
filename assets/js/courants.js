/* ============================================================
   COURANTS — Charge les ordres, rend grille filtrable, modal détail
   ============================================================ */

let ORDERS_DATA = null;
const CO_EN = document.documentElement.lang === 'en';
const CO_T = CO_EN
  ? { err: 'Unable to load the orders. Check that the site is served by a local server.', more: 'Read the full entry ✦', close: 'Close', founder: 'Founder', presentation: 'Presentation', practices: 'Distinctive practices', themes: 'Spiritual themes', branches: 'Branches and ramifications', works: 'Major works', keywords: 'Keywords' }
  : { err: 'Impossible de charger les courants. Vérifie que le site est servi par un serveur local.', more: 'Lire la fiche complète ✦', close: 'Fermer', founder: 'Fondateur', presentation: 'Présentation', practices: 'Pratiques distinctives', themes: 'Thèmes spirituels', branches: 'Branches et ramifications', works: 'Œuvres majeures', keywords: 'Mots-clés' };

async function loadOrders() {
  try {
    const res = await fetch('../data/ordres.json');
    ORDERS_DATA = await res.json();
    renderIntro();
    renderFilters();
    renderGrid('all');
  } catch (err) {
    console.error('Erreur de chargement des ordres', err);
    document.getElementById('orders-grid').innerHTML =
      `<p class="center muted">${CO_T.err}</p>`;
  }
}

function renderIntro() {
  document.getElementById('intro-text').textContent = ORDERS_DATA.intro;
}

function renderFilters() {
  const root = document.getElementById('region-filters');
  ORDERS_DATA.regions.forEach(r => {
    const btn = document.createElement('button');
    btn.className = 'region-btn';
    btn.dataset.region = r.id;
    btn.textContent = r.label;
    root.appendChild(btn);
  });

  // Click handler
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.region-btn');
    if (!btn) return;
    root.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGrid(btn.dataset.region);
  });
}

function renderGrid(region) {
  const root = document.getElementById('orders-grid');
  const filtered = region === 'all'
    ? ORDERS_DATA.orders
    : ORDERS_DATA.orders.filter(o => o.diffusionRegions.includes(region));

  root.innerHTML = filtered.map(o => `
    <article class="order-card" data-slug="${o.slug}" role="button" tabindex="0">
      <div class="order-card__ar">${o.nameAr}</div>
      <h3 class="order-card__name">${o.name}</h3>
      <p class="order-card__founder">
        <strong>${o.founder}</strong><br>
        ${o.founderDates} · ${o.originRegion}
      </p>
      <p class="order-card__intro">${o.intro}</p>
      <div class="order-card__footer">
        ${o.keywords.slice(0, 4).map(k => `<span class="keyword">${k}</span>`).join('')}
      </div>
      <div class="order-card__more">${CO_T.more}</div>
    </article>
  `).join('');

  // Click → open modal
  root.querySelectorAll('.order-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.dataset.slug));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.dataset.slug);
      }
    });
  });
}

function openModal(slug) {
  const o = ORDERS_DATA.orders.find(x => x.slug === slug);
  if (!o) return;

  const content = document.getElementById('modal-content');
  content.querySelector('.modal__close')?.remove();

  content.innerHTML = `
    <button class="modal__close" data-close aria-label="${CO_T.close}">✕</button>
    <div class="modal__ar">${o.nameAr}</div>
    <h2 class="modal__name">${o.name}</h2>
    <div class="modal__sub">${o.century} · ${o.originRegion}</div>

    <div class="modal__section">
      <h3>${CO_T.founder}</h3>
      <p><strong style="color: var(--ink); font-weight: 500;">${o.founder}</strong> (${o.founderDates})</p>
    </div>

    <div class="modal__section">
      <h3>${CO_T.presentation}</h3>
      <p>${o.intro}</p>
      <p>${o.body}</p>
    </div>

    <div class="modal__section">
      <h3>${CO_T.practices}</h3>
      <ul>${o.practices.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>

    <div class="modal__section">
      <h3>${CO_T.themes}</h3>
      <ul>${o.themes.map(t => `<li>${t}</li>`).join('')}</ul>
    </div>

    ${o.branches && o.branches.length ? `
    <div class="modal__section">
      <h3>${CO_T.branches}</h3>
      <ul>${o.branches.map(b => `<li>${b}</li>`).join('')}</ul>
    </div>` : ''}

    ${o.majorWorks && o.majorWorks.length ? `
    <div class="modal__section">
      <h3>${CO_T.works}</h3>
      <ul>${o.majorWorks.map(w => `<li><em>${w}</em></li>`).join('')}</ul>
    </div>` : ''}

    <blockquote style="margin-top: var(--space-lg); font-size: 1.15rem;">
      ${o.quote.text}
      <cite>${o.quote.author}</cite>
    </blockquote>

    <div class="modal__section" style="margin-top: var(--space-lg);">
      <h3>${CO_T.keywords}</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
        ${o.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
      </div>
    </div>
  `;

  const modal = document.getElementById('order-modal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('order-modal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Close handlers
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

loadOrders();
