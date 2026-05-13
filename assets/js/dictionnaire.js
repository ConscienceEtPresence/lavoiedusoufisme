// === Dictionnaire du soufisme ===
(async function () {
  const DATA_URL = '../../data/dictionnaire.json';

  const grid       = document.getElementById('dict-grid');
  const searchEl   = document.getElementById('dict-search');
  const filtersEl  = document.getElementById('dict-filters');
  const emptyEl    = document.getElementById('dict-empty');
  const modal      = document.getElementById('dict-modal');
  const modalEl    = document.getElementById('dict-modal-content');
  const medMode    = document.getElementById('med-mode');
  const motJourEl  = document.getElementById('mot-du-jour');

  let DATA = null;
  let currentEntry = null;
  let currentCat = 'all';

  // === Chargement
  try {
    const res = await fetch(DATA_URL);
    DATA = await res.json();
  } catch (e) {
    grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:var(--dict-soft);">Erreur de chargement du dictionnaire.</p>';
    return;
  }

  // === Filtres
  filtersEl.innerHTML = `<button class="dict-filter active" data-cat="all">Toutes (${DATA.entries.length})</button>` +
    Object.entries(DATA.categories).map(([key, cat]) => {
      const count = DATA.entries.filter(e => e.category === key).length;
      return `<button class="dict-filter" data-cat="${key}">${cat.label} (${count})</button>`;
    }).join('');

  filtersEl.addEventListener('click', e => {
    const btn = e.target.closest('.dict-filter');
    if (!btn) return;
    currentCat = btn.dataset.cat;
    filtersEl.querySelectorAll('.dict-filter').forEach(b => b.classList.toggle('active', b === btn));
    applyFilters();
  });

  // === Grille
  function renderGrid() {
    grid.innerHTML = DATA.entries.map(e => `
      <div class="dict-card" data-id="${e.id}" data-cat="${e.category}" role="button" tabindex="0">
        <div class="dict-card__ar">${e.ar}</div>
        <div class="dict-card__tr">${e.tr}</div>
        <div class="dict-card__fr">${e.fr}</div>
      </div>
    `).join('');
  }

  function applyFilters() {
    const q = (searchEl.value || '').trim().toLowerCase();
    const normalize = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const qn = normalize(q);
    let visibleCount = 0;

    grid.querySelectorAll('.dict-card').forEach(card => {
      const entry = DATA.entries.find(e => e.id === card.dataset.id);
      if (!entry) return;

      const matchCat = currentCat === 'all' || entry.category === currentCat;
      const haystack = [entry.ar, entry.tr, entry.tr_simple, entry.fr, entry.id].join(' ').toLowerCase();
      const haystackN = normalize(haystack);
      const matchSearch = !q || haystack.includes(q) || haystackN.includes(qn) || entry.ar.includes(q);

      const visible = matchCat && matchSearch;
      card.classList.toggle('hidden', !visible);
      if (visible) visibleCount++;
    });
    emptyEl.classList.toggle('is-visible', visibleCount === 0);
  }

  searchEl.addEventListener('input', applyFilters);

  // === Clic sur une carte → modale
  grid.addEventListener('click', e => {
    const card = e.target.closest('.dict-card');
    if (!card) return;
    const entry = DATA.entries.find(en => en.id === card.dataset.id);
    if (entry) openModal(entry);
  });
  grid.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.dict-card');
    if (!card) return;
    e.preventDefault();
    const entry = DATA.entries.find(en => en.id === card.dataset.id);
    if (entry) openModal(entry);
  });

  // === Modale
  function openModal(entry) {
    currentEntry = entry;
    const cat = DATA.categories[entry.category];
    modalEl.innerHTML = `
      <button class="dict-modal__close" aria-label="Fermer">✕</button>

      <div class="entry-head">
        <div class="entry-head__ar">${entry.ar}</div>
        <div class="entry-head__tr">${entry.tr}</div>
        <div class="entry-head__fr">${entry.fr}</div>
        <div class="entry-head__meta">${cat ? cat.label : ''}</div>
        ${entry.racine ? `<div class="entry-head__racine">${entry.racine}${entry.racine_sens ? ` — <span style="font-family:'Source Serif 4',serif;font-style:italic;font-size:.85rem;color:var(--dict-soft);">${entry.racine_sens}</span>` : ''}</div>` : ''}
      </div>

      ${entry.definition_concise ? `
        <div class="entry-section">
          <h3>Définition concise</h3>
          <div class="entry-concise">${entry.definition_concise}</div>
        </div>` : ''}

      ${entry.sens_profond ? `
        <div class="entry-section">
          <h3>Sens profond</h3>
          <div class="entry-profond">${entry.sens_profond}</div>
        </div>` : ''}

      ${entry.voix_des_maitres && entry.voix_des_maitres.length ? `
        <div class="entry-section">
          <h3>Voix des maîtres</h3>
          <div class="entry-voix">
            ${entry.voix_des_maitres.map(v => `
              <div class="entry-voix__item">
                <div class="entry-voix__text">${v.texte}</div>
                <div class="entry-voix__auteur">— ${v.auteur}</div>
              </div>
            `).join('')}
          </div>
        </div>` : ''}

      ${entry.meditation ? `
        <div class="entry-meditation">
          <div class="entry-meditation__label">✦ Pour méditer ✦</div>
          <div class="entry-meditation__question">« ${entry.meditation} »</div>
          <button class="entry-meditation__btn" data-action="meditate">🕯️ Entrer en méditation</button>
        </div>` : ''}

      ${entry.resonance && entry.resonance.length ? `
        <div class="entry-section">
          <h3>Termes en résonance</h3>
          <div class="entry-pastilles">
            ${entry.resonance.map(rid => {
              const r = DATA.entries.find(e => e.id === rid);
              if (!r) return '';
              return `<a class="pastille" data-goto="${r.id}"><span class="pastille__ar">${r.ar}</span> ${r.tr}</a>`;
            }).join('')}
          </div>
        </div>` : ''}

      ${entry.lectures_site && entry.lectures_site.length ? `
        <div class="entry-section">
          <h3>Lectures sur le site</h3>
          <ul class="entry-lectures">
            ${entry.lectures_site.map(l => `<li><a href="${l.url}">${l.titre}</a></li>`).join('')}
          </ul>
        </div>` : ''}

      <div class="entry-source">
        D'après <em>${DATA.meta.source_principale}</em>${entry.source_page ? ' — ' + entry.source_page : ''}.
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    modalEl.scrollTop = 0;
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  modal.addEventListener('click', e => {
    if (e.target.matches('.dict-modal__backdrop, .dict-modal__close')) return closeModal();
    const pastille = e.target.closest('.pastille');
    if (pastille && pastille.dataset.goto) {
      const next = DATA.entries.find(en => en.id === pastille.dataset.goto);
      if (next) openModal(next);
      return;
    }
    if (e.target.closest('[data-action="meditate"]') && currentEntry) {
      openMeditation(currentEntry);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (medMode.classList.contains('open')) closeMeditation();
      else if (modal.classList.contains('open')) closeModal();
    }
  });

  // === Mode méditation
  let medTimer = null;
  let medDuration = 300; // 5 min par défaut
  let medRemaining = 0;

  function openMeditation(entry) {
    medMode.innerHTML = `
      <button class="med-mode__close" aria-label="Quitter">✕</button>
      <div class="med-mode__ar">${entry.ar}</div>
      <div class="med-mode__tr">${entry.tr} — ${entry.fr}</div>
      <div class="med-mode__question">${entry.meditation || ''}</div>
      <div class="med-mode__timer" id="med-timer">05:00</div>
      <div class="med-mode__controls">
        <button class="med-mode__btn" data-dur="180">3 min</button>
        <button class="med-mode__btn active" data-dur="300">5 min</button>
        <button class="med-mode__btn" data-dur="600">10 min</button>
        <button class="med-mode__btn" data-dur="1200">20 min</button>
      </div>
      <button class="med-mode__btn med-mode__btn--start" id="med-start">Commencer</button>
      <div class="med-mode__notes-label">Une intuition née pendant cette méditation ? (privé, sur ton appareil)</div>
      <textarea class="med-mode__notes" id="med-notes" placeholder="Note tes impressions…"></textarea>
    `;
    medMode.classList.add('open');
    document.body.style.overflow = 'hidden';
    medDuration = 300;
    medRemaining = medDuration;
    updateTimer();

    // Restaurer une note précédente
    const noteKey = `med-note-${entry.id}`;
    const savedNote = localStorage.getItem(noteKey);
    const notesEl = medMode.querySelector('#med-notes');
    if (savedNote) notesEl.value = savedNote;
    notesEl.addEventListener('input', () => localStorage.setItem(noteKey, notesEl.value));
  }

  function closeMeditation() {
    medMode.classList.remove('open');
    document.body.style.overflow = '';
    if (medTimer) { clearInterval(medTimer); medTimer = null; }
  }

  function updateTimer() {
    const m = Math.floor(medRemaining / 60).toString().padStart(2, '0');
    const s = (medRemaining % 60).toString().padStart(2, '0');
    const el = document.getElementById('med-timer');
    if (el) el.textContent = `${m}:${s}`;
  }

  medMode.addEventListener('click', e => {
    if (e.target.matches('.med-mode__close')) return closeMeditation();
    const durBtn = e.target.closest('[data-dur]');
    if (durBtn) {
      medMode.querySelectorAll('[data-dur]').forEach(b => b.classList.remove('active'));
      durBtn.classList.add('active');
      medDuration = parseInt(durBtn.dataset.dur);
      medRemaining = medDuration;
      updateTimer();
      return;
    }
    if (e.target.matches('#med-start')) {
      const startBtn = e.target;
      if (medTimer) {
        clearInterval(medTimer);
        medTimer = null;
        startBtn.textContent = 'Commencer';
        return;
      }
      startBtn.textContent = 'Pause';
      medTimer = setInterval(() => {
        medRemaining--;
        updateTimer();
        if (medRemaining <= 0) {
          clearInterval(medTimer); medTimer = null;
          startBtn.textContent = 'Terminé ✓';
          medMode.querySelector('.med-mode__notes-label').classList.add('visible');
          medMode.querySelector('.med-mode__notes').classList.add('visible');
        }
      }, 1000);
    }
  });

  // === Mot du jour
  function setMotDuJour() {
    if (!motJourEl) return;
    // Choix déterministe par jour de l'année
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const entry = DATA.entries[dayOfYear % DATA.entries.length];
    motJourEl.innerHTML = `
      <div class="mot-du-jour__label">✦ Mot du jour ✦</div>
      <div class="mot-du-jour__ar">${entry.ar}</div>
      <div class="mot-du-jour__tr">${entry.tr}</div>
      <div class="mot-du-jour__fr">${entry.fr}</div>
      <div class="mot-du-jour__quote">« ${entry.definition_concise || ''} »</div>
      <button class="mot-du-jour__btn" data-id="${entry.id}">Découvrir →</button>
    `;
    motJourEl.querySelector('button').addEventListener('click', () => openModal(entry));
  }

  // === Init
  renderGrid();
  setMotDuJour();
  applyFilters();

  // === API publique pour ouvrir depuis l'extérieur (futur)
  window.openDictEntry = function(id) {
    const entry = DATA.entries.find(e => e.id === id);
    if (entry) openModal(entry);
  };
})();
