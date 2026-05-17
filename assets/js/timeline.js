/* ============================================================
   TIMELINE — Grille cliquable de périodes + modal détail
   ============================================================ */

let PERIODS_DATA = null;
const TL_EN = document.documentElement.lang === 'en';
const TL_T = TL_EN
  ? { more: 'Read the entry ✦', figures: 'Major figures', keywords: 'Keywords', close: 'Close', err: 'Unable to load the periods.' }
  : { more: 'Lire la fiche ✦', figures: 'Grandes figures', keywords: 'Mots-clés', close: 'Fermer', err: 'Impossible de charger les périodes.' };

async function loadPeriods() {
  try {
    const res = await fetch('../data/chronologie.json');
    PERIODS_DATA = await res.json();
    renderGrid();
  } catch (err) {
    console.error('Erreur de chargement de la chronologie', err);
    document.getElementById('periods-grid').innerHTML =
      `<p class="center muted">${TL_T.err}</p>`;
  }
}

function renderGrid() {
  const root = document.getElementById('periods-grid');
  root.innerHTML = PERIODS_DATA.periods.map((p, i) => `
    <article class="period-card" data-slug="${p.slug}" role="button" tabindex="0">
      <div>
        <div class="period-card__num">${String(i + 1).padStart(2, '0')}</div>
        <div class="period-card__date">${p.date}</div>
        <h2 class="period-card__title">${p.title}</h2>
        <div class="period-card__subtitle">${p.subtitle}</div>
      </div>
      <div class="period-card__more">${TL_T.more}</div>
    </article>
  `).join('');

  root.querySelectorAll('.period-card').forEach(c => {
    c.addEventListener('click', () => openPeriod(c.dataset.slug));
    c.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPeriod(c.dataset.slug);
      }
    });
  });
}

function openPeriod(slug) {
  const p = PERIODS_DATA.periods.find(x => x.slug === slug);
  if (!p) return;

  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <button class="modal__close" data-close aria-label="${TL_T.close}">✕</button>
    <div class="modal__sub">${p.date}</div>
    <h2 class="modal__name">${p.title}</h2>
    <div style="text-align:center;color:var(--ink-mute);font-style:italic;margin-bottom:var(--space-lg);">${p.subtitle}</div>

    <div class="modal__section">
      <p style="font-size:1.05rem;color:var(--ink);"><strong>${p.intro}</strong></p>
      <p>${p.body}</p>
    </div>

    <div class="modal__section">
      <h3>${TL_T.figures}</h3>
      <ul>${p.figures.map(f => `<li>${f}</li>`).join('')}</ul>
    </div>

    <blockquote style="margin-top: var(--space-lg); font-size: 1.1rem;">
      ${p.quote.text}
      <cite>${p.quote.author}</cite>
    </blockquote>

    <div class="modal__section" style="margin-top: var(--space-lg);">
      <h3>${TL_T.keywords}</h3>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
        ${p.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
      </div>
    </div>
  `;

  const modal = document.getElementById('period-modal');
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

loadPeriods();
