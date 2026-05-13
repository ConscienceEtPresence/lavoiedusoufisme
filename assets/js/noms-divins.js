// === 99 Noms Divins ===
(async function () {
  const DATA_URL = '../../data/noms-divins.json';
  const gridEl = document.getElementById('noms-grid');
  const filtersEl = document.getElementById('noms-filters');
  const randomBtn = document.getElementById('noms-random');
  const modal = document.getElementById('nom-modal');
  const modalContent = document.getElementById('nom-modal-content');

  let DATA = null;
  let currentFilter = 'all';
  let currentIndex = 0;

  try {
    const r = await fetch(DATA_URL);
    DATA = await r.json();
  } catch (e) {
    gridEl.innerHTML = '<p style="color:var(--ink-soft);text-align:center;">Impossible de charger les données.</p>';
    return;
  }

  // Render filters
  const themes = DATA.themes;
  filtersEl.innerHTML = `
    <button class="noms-filter active" data-theme="all">Tous (${DATA.noms.length})</button>
    ${Object.entries(themes).map(([key, t]) => {
      const count = DATA.noms.filter(n => n.theme === key).length;
      return `<button class="noms-filter" data-theme="${key}">${t.label} — ${t.fr} (${count})</button>`;
    }).join('')}
  `;

  filtersEl.addEventListener('click', e => {
    const btn = e.target.closest('.noms-filter');
    if (!btn) return;
    currentFilter = btn.dataset.theme;
    filtersEl.querySelectorAll('.noms-filter').forEach(b => b.classList.toggle('active', b === btn));
    applyFilter();
  });

  // Render grid
  function renderGrid() {
    gridEl.innerHTML = DATA.noms.map((n, i) => `
      <div class="nom-card" data-theme="${n.theme}" data-index="${i}" role="button" tabindex="0">
        <div class="nom-card__num">${String(n.n).padStart(2, '0')}</div>
        <div class="nom-card__ar">${n.ar}</div>
        <div class="nom-card__tr">${n.tr}</div>
        <div class="nom-card__fr">${n.fr}</div>
      </div>
    `).join('');
  }

  function applyFilter() {
    gridEl.querySelectorAll('.nom-card').forEach(c => {
      const ok = currentFilter === 'all' || c.dataset.theme === currentFilter;
      c.classList.toggle('dim', !ok);
    });
  }

  gridEl.addEventListener('click', e => {
    const card = e.target.closest('.nom-card');
    if (!card || card.classList.contains('dim')) return;
    openModal(parseInt(card.dataset.index));
  });

  gridEl.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.nom-card');
    if (!card || card.classList.contains('dim')) return;
    e.preventDefault();
    openModal(parseInt(card.dataset.index));
  });

  // Random
  randomBtn.addEventListener('click', () => {
    const pool = DATA.noms
      .map((n, i) => ({ n, i }))
      .filter(x => currentFilter === 'all' || x.n.theme === currentFilter);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    openModal(pick.i);
  });

  // Modal
  function openModal(index) {
    currentIndex = index;
    const n = DATA.noms[index];
    const theme = DATA.themes[n.theme];
    const sections = [];
    if (n.lugha) sections.push({ titre: 'Sens linguistique', ar: 'لُغَوِيّ', txt: n.lugha });
    if (n.aqli) sections.push({ titre: 'Sens rationnel', ar: 'عَقْلِيّ', txt: n.aqli });
    if (n.sufi) sections.push({ titre: 'Sens spirituel', ar: 'صُوفِيّ', txt: n.sufi });

    modalContent.innerHTML = `
      <button class="nom-modal__close" aria-label="Fermer">✕</button>
      <div class="nom-fiche__head">
        <div class="nom-fiche__num">Nom n°${n.n} · ${theme.label_ar}</div>
        <div class="nom-fiche__ar">${n.ar}</div>
        <div class="nom-fiche__tr">${n.tr}</div>
        <div class="nom-fiche__fr">${n.fr}</div>
        <span class="nom-fiche__badge" data-theme="${n.theme}">${theme.label} · ${theme.fr}</span>
      </div>
      <div class="nom-fiche__sens">« ${n.sens_court} »</div>
      ${sections.length ? sections.map(s => `
        <div class="nom-fiche__section">
          <h3>${s.titre} <span>${s.ar}</span></h3>
          <p>${s.txt}</p>
        </div>
      `).join('') : `<div class="nom-fiche__empty">Le commentaire détaillé d'al-Kāfījī sur ce Nom sera ajouté prochainement.</div>`}
      ${n.part ? `
        <div class="nom-fiche__section">
          <h3>La part du serviteur <span>حَظُّ العَبْد</span></h3>
          <div class="nom-fiche__part"><p>${n.part}</p></div>
        </div>` : ''}
      <div class="nom-fiche__meditate">
        <button class="nom-fiche__meditate-btn" data-action="meditate-nom">
          🕯️ Méditer ce Nom
        </button>
      </div>
      <div class="nom-fiche__like">
        <p>Ce Nom vous a touché ?</p>
        <button data-lyket-type="like-button"
                data-lyket-id="nom-${String(n.n).padStart(2,'0')}-${n.tr.toLowerCase().replace(/[^a-z]/g,'')}"
                data-lyket-namespace="lavoiedusoufisme-noms">
          ♥
        </button>
      </div>
      <div class="nom-fiche__nav">
        <button data-nav="prev">← Précédent</button>
        <button data-nav="random">⚘ Aléatoire</button>
        <button data-nav="next">Suivant →</button>
      </div>
    `;
    // Demander à Lyket de rescanner le DOM pour activer le nouveau bouton
    if (window.Lyket && typeof window.Lyket.mount === 'function') {
      setTimeout(() => window.Lyket.mount(), 50);
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalContent.scrollTop = 0;
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', e => {
    if (e.target.matches('.nom-modal__backdrop, .nom-modal__close')) return closeModal();
    if (e.target.closest('[data-action="meditate-nom"]')) {
      const n = DATA.noms[currentIndex];
      if (n) openNomMeditation(n);
      return;
    }
    const nav = e.target.closest('[data-nav]');
    if (!nav) return;
    if (nav.dataset.nav === 'prev') openModal((currentIndex - 1 + DATA.noms.length) % DATA.noms.length);
    else if (nav.dataset.nav === 'next') openModal((currentIndex + 1) % DATA.noms.length);
    else if (nav.dataset.nav === 'random') openModal(Math.floor(Math.random() * DATA.noms.length));
  });

  document.addEventListener('keydown', e => {
    if (medModeEl && medModeEl.classList.contains('open')) {
      if (e.key === 'Escape') closeNomMeditation();
      return;
    }
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeModal();
    else if (e.key === 'ArrowLeft') openModal((currentIndex - 1 + DATA.noms.length) % DATA.noms.length);
    else if (e.key === 'ArrowRight') openModal((currentIndex + 1) % DATA.noms.length);
  });

  // ====================================================
  // Mode méditation plein écran pour un Nom divin
  // ====================================================
  const medModeEl = document.getElementById('nom-med-mode');
  let medTimer = null;
  let medDuration = 300;
  let medRemaining = 0;

  function openNomMeditation(n) {
    if (!medModeEl) return;
    const theme = DATA.themes[n.theme];
    medModeEl.innerHTML = `
      <button class="nom-med-mode__close" aria-label="Quitter">✕</button>
      <div class="nom-med-mode__num">Nom n°${n.n} · ${theme.label_ar}</div>
      <div class="nom-med-mode__ar">${n.ar}</div>
      <div class="nom-med-mode__tr">${n.tr}</div>
      <div class="nom-med-mode__fr">${n.fr}</div>
      <div class="nom-med-mode__sens">« ${n.sens_court} »</div>
      <div class="nom-med-mode__timer" id="nom-med-timer">05:00</div>
      <div class="nom-med-mode__controls">
        <button class="nom-med-mode__btn" data-dur="180">3 min</button>
        <button class="nom-med-mode__btn active" data-dur="300">5 min</button>
        <button class="nom-med-mode__btn" data-dur="600">10 min</button>
        <button class="nom-med-mode__btn" data-dur="1200">20 min</button>
      </div>
      <button class="nom-med-mode__btn nom-med-mode__btn--start" id="nom-med-start">Commencer</button>
      <div class="nom-med-mode__notes-label">Une intuition née pendant cette méditation ? (privé, sur votre appareil)</div>
      <textarea class="nom-med-mode__notes" id="nom-med-notes" placeholder="Notez vos impressions…"></textarea>
    `;
    medModeEl.classList.add('open');
    document.body.style.overflow = 'hidden';
    medDuration = 300;
    medRemaining = medDuration;
    updateMedTimer();

    const noteKey = `nom-med-note-${n.n}`;
    const saved = localStorage.getItem(noteKey);
    const notes = medModeEl.querySelector('#nom-med-notes');
    if (saved) notes.value = saved;
    notes.addEventListener('input', () => localStorage.setItem(noteKey, notes.value));
  }

  function closeNomMeditation() {
    if (!medModeEl) return;
    medModeEl.classList.remove('open');
    document.body.style.overflow = '';
    if (medTimer) { clearInterval(medTimer); medTimer = null; }
  }

  function updateMedTimer() {
    const m = Math.floor(medRemaining / 60).toString().padStart(2, '0');
    const s = (medRemaining % 60).toString().padStart(2, '0');
    const el = document.getElementById('nom-med-timer');
    if (el) el.textContent = `${m}:${s}`;
  }

  if (medModeEl) {
    medModeEl.addEventListener('click', e => {
      if (e.target.matches('.nom-med-mode__close')) return closeNomMeditation();
      const durBtn = e.target.closest('[data-dur]');
      if (durBtn) {
        medModeEl.querySelectorAll('[data-dur]').forEach(b => b.classList.remove('active'));
        durBtn.classList.add('active');
        medDuration = parseInt(durBtn.dataset.dur);
        medRemaining = medDuration;
        updateMedTimer();
        return;
      }
      if (e.target.matches('#nom-med-start')) {
        const btn = e.target;
        if (medTimer) {
          clearInterval(medTimer); medTimer = null;
          btn.textContent = 'Commencer';
          return;
        }
        btn.textContent = 'Pause';
        medTimer = setInterval(() => {
          medRemaining--;
          updateMedTimer();
          if (medRemaining <= 0) {
            clearInterval(medTimer); medTimer = null;
            btn.textContent = 'Terminé ✓';
            medModeEl.querySelector('.nom-med-mode__notes-label').classList.add('visible');
            medModeEl.querySelector('.nom-med-mode__notes').classList.add('visible');
          }
        }, 1000);
      }
    });
  }

  // Inject source notice if placeholder present
  const srcEl = document.getElementById('noms-source');
  if (srcEl && DATA.source) {
    srcEl.innerHTML = `
      <div class="noms-source__title">
        D'après <em>${DATA.source.ouvrage}</em> de ${DATA.source.auteur} (${DATA.source.dates})
        <span class="noms-source__title-ar">${DATA.source.ouvrage_ar} — ${DATA.source.auteur_ar}</span>
      </div>
      <p>${DATA.source.notice}</p>
    `;
  }

  renderGrid();
})();
