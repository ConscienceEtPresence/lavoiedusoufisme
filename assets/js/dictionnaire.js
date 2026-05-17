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

  const DC_EN = document.documentElement.lang === 'en';
  const DC_T = DC_EN ? {
    loadError: 'Error loading the dictionary.',
    allFilter: n => `All (${n})`,
    close: 'Close',
    speakWord: 'Pronounce the word in Arabic',
    defConcise: 'Concise definition',
    deepSense: 'Deeper meaning',
    voicesOfMasters: 'Voices of the masters',
    toMeditate: '✦ To meditate ✦',
    enterMeditation: '🕯️ Enter meditation',
    termsInResonance: 'Terms in resonance',
    readingsOnSite: 'Readings on the site',
    source: 'After',
    quit: 'Leave',
    free: '⋯ free',
    customMin: m => `⋯ ${m} min`,
    begin: 'Begin', resume: 'Resume', pause: 'Pause', done: 'Done ✓',
    intuitionLabel: 'An intuition born during this meditation? (private, on your device)',
    notesPlaceholder: 'Note your impressions…',
    customPrompt: 'Free duration — how many minutes? (a whole number between 1 and 120)',
    customAlert: 'Enter a number between 1 and 120.',
    wordOfDay: '✦ Word of the day ✦',
    discover: 'Discover →',
    oq: '“', cq: '”'
  } : {
    loadError: 'Erreur de chargement du dictionnaire.',
    allFilter: n => `Toutes (${n})`,
    close: 'Fermer',
    speakWord: 'Prononcer le mot en arabe',
    defConcise: 'Définition concise',
    deepSense: 'Sens profond',
    voicesOfMasters: 'Voix des maîtres',
    toMeditate: '✦ Pour méditer ✦',
    enterMeditation: '🕯️ Entrer en méditation',
    termsInResonance: 'Termes en résonance',
    readingsOnSite: 'Lectures sur le site',
    source: 'D’après',
    quit: 'Quitter',
    free: '⋯ libre',
    customMin: m => `⋯ ${m} min`,
    begin: 'Commencer', resume: 'Reprendre', pause: 'Pause', done: 'Terminé ✓',
    intuitionLabel: 'Une intuition née pendant cette méditation ? (privé, sur ton appareil)',
    notesPlaceholder: 'Note tes impressions…',
    customPrompt: 'Durée libre — combien de minutes ? (entier entre 1 et 120)',
    customAlert: 'Saisis un nombre entre 1 et 120.',
    wordOfDay: '✦ Mot du jour ✦',
    discover: 'Découvrir →',
    oq: '« ', cq: ' »'
  };

  // === Chargement
  try {
    const res = await fetch(DATA_URL);
    DATA = await res.json();
  } catch (e) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--dict-soft);">${DC_T.loadError}</p>`;
    return;
  }

  // === Filtres
  filtersEl.innerHTML = `<button class="dict-filter active" data-cat="all">${DC_T.allFilter(DATA.entries.length)}</button>` +
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
  function speakArabic(text) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    u.rate = 0.7;
    u.pitch = 1.0;
    const voices = speechSynthesis.getVoices();
    const arVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arVoice) u.voice = arVoice;
    speechSynthesis.speak(u);
  }
  // Précharger les voix (Safari les charge en différé)
  if ('speechSynthesis' in window) { speechSynthesis.getVoices(); }

  function openModal(entry) {
    currentEntry = entry;
    const cat = DATA.categories[entry.category];
    modalEl.innerHTML = `
      <button class="dict-modal__close" aria-label="${DC_T.close}">✕</button>

      <div class="entry-head">
        <div class="entry-head__ar">${entry.ar}</div>
        <div class="entry-head__tr">${entry.tr} <button class="entry-head__audio" data-action="speak" aria-label="${DC_T.speakWord}">♪</button></div>
        <div class="entry-head__fr">${entry.fr}</div>
        <div class="entry-head__meta">${cat ? cat.label : ''}</div>
        ${entry.racine ? `<div class="entry-head__racine">${entry.racine}${entry.racine_sens ? ` — <span style="font-family:'Source Serif 4',serif;font-style:italic;font-size:.85rem;color:var(--dict-soft);">${entry.racine_sens}</span>` : ''}</div>` : ''}
      </div>

      ${entry.definition_concise ? `
        <div class="entry-section">
          <h3>${DC_T.defConcise}</h3>
          <div class="entry-concise">${entry.definition_concise}</div>
        </div>` : ''}

      ${entry.sens_profond ? `
        <div class="entry-section">
          <h3>${DC_T.deepSense}</h3>
          <div class="entry-profond">${entry.sens_profond}</div>
        </div>` : ''}

      ${entry.voix_des_maitres && entry.voix_des_maitres.length ? `
        <div class="entry-section">
          <h3>${DC_T.voicesOfMasters}</h3>
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
          <div class="entry-meditation__label">${DC_T.toMeditate}</div>
          <div class="entry-meditation__question">${DC_T.oq}${entry.meditation}${DC_T.cq}</div>
          <button class="entry-meditation__btn" data-action="meditate">${DC_T.enterMeditation}</button>
        </div>` : ''}

      ${entry.resonance && entry.resonance.length ? `
        <div class="entry-section">
          <h3>${DC_T.termsInResonance}</h3>
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
          <h3>${DC_T.readingsOnSite}</h3>
          <ul class="entry-lectures">
            ${entry.lectures_site.map(l => `<li><a href="${l.url}">${l.titre}</a></li>`).join('')}
          </ul>
        </div>` : ''}

      <div class="entry-source">
        ${DC_T.source} <em>${DATA.meta.source_principale}</em>${entry.source_page ? ' — ' + entry.source_page : ''}.
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
    if (e.target.closest('[data-action="speak"]') && currentEntry) {
      speakArabic(currentEntry.ar);
      return;
    }
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
  let medEntry = null;

  function openMeditation(entry) {
    medEntry = entry;
    medMode.innerHTML = `
      <button class="med-mode__close" aria-label="${DC_T.quit}">✕</button>
      <div class="med-mode__ar">${entry.ar}</div>
      <div class="med-mode__tr">${entry.tr} <button class="med-mode__audio" data-action="speak" aria-label="${DC_T.speakWord}">♪</button> — ${entry.fr}</div>
      <div class="med-mode__question">${entry.meditation || ''}</div>

      <div class="med-mode__circle" id="med-circle">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <circle class="med-mode__circle-bg" cx="100" cy="100" r="92"></circle>
          <circle class="med-mode__circle-progress" id="med-circle-progress"
                  cx="100" cy="100" r="92"
                  stroke-dasharray="578"
                  stroke-dashoffset="0"></circle>
        </svg>
        <div class="med-mode__circle-glyph" aria-hidden="true">✦</div>
      </div>

      <div class="med-mode__controls">
        <button class="med-mode__btn" data-dur="180">3 min</button>
        <button class="med-mode__btn active" data-dur="300">5 min</button>
        <button class="med-mode__btn" data-dur="600">10 min</button>
        <button class="med-mode__btn" data-dur="1200">20 min</button>
        <button class="med-mode__btn" data-action="custom-duration">${DC_T.free}</button>
      </div>
      <button class="med-mode__btn med-mode__btn--start" id="med-start">${DC_T.begin}</button>
      <div class="med-mode__notes-label">${DC_T.intuitionLabel}</div>
      <textarea class="med-mode__notes" id="med-notes" placeholder="${DC_T.notesPlaceholder}"></textarea>
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

  // Circonférence du cercle SVG (r=92) : 2 * π * 92 ≈ 578
  const CIRCLE_CIRCUMFERENCE = 578;

  function updateTimer() {
    // Cercle de progression : se vide doucement
    const progress = medDuration > 0 ? medRemaining / medDuration : 0;
    const offset = CIRCLE_CIRCUMFERENCE * (1 - progress);
    const circle = document.getElementById('med-circle-progress');
    if (circle) circle.style.strokeDashoffset = offset;
  }

  function askCustomDuration() {
    const raw = prompt(DC_T.customPrompt, '15');
    if (!raw) return null;
    const n = parseInt(raw.replace(',', '.'));
    if (isNaN(n) || n < 1 || n > 120) {
      alert(DC_T.customAlert);
      return null;
    }
    return n * 60;
  }

  medMode.addEventListener('click', e => {
    if (e.target.matches('.med-mode__close')) return closeMeditation();

    if (e.target.closest('[data-action="speak"]') && medEntry) {
      speakArabic(medEntry.ar);
      return;
    }

    if (e.target.matches('[data-action="custom-duration"]')) {
      const sec = askCustomDuration();
      if (sec === null) return;
      medMode.querySelectorAll('[data-dur]').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const mins = Math.round(sec / 60);
      e.target.textContent = DC_T.customMin(mins);
      medDuration = sec;
      medRemaining = medDuration;
      if (medTimer) { clearInterval(medTimer); medTimer = null; }
      const circle = medMode.querySelector('.med-mode__circle');
      if (circle) { circle.classList.remove('running', 'done'); }
      const startBtn = medMode.querySelector('#med-start');
      if (startBtn) startBtn.textContent = DC_T.begin;
      updateTimer();
      return;
    }

    const durBtn = e.target.closest('[data-dur]');
    if (durBtn) {
      medMode.querySelectorAll('[data-dur], [data-action="custom-duration"]').forEach(b => b.classList.remove('active'));
      durBtn.classList.add('active');
      medDuration = parseInt(durBtn.dataset.dur);
      medRemaining = medDuration;
      if (medTimer) { clearInterval(medTimer); medTimer = null; }
      const circle = medMode.querySelector('.med-mode__circle');
      if (circle) { circle.classList.remove('running', 'done'); }
      const startBtn = medMode.querySelector('#med-start');
      if (startBtn) startBtn.textContent = DC_T.begin;
      updateTimer();
      return;
    }

    if (e.target.matches('#med-start')) {
      const startBtn = e.target;
      const circle = medMode.querySelector('.med-mode__circle');
      if (medTimer) {
        clearInterval(medTimer);
        medTimer = null;
        startBtn.textContent = DC_T.resume;
        if (circle) circle.classList.remove('running');
        return;
      }
      startBtn.textContent = DC_T.pause;
      if (circle) { circle.classList.add('running'); circle.classList.remove('done'); }
      medTimer = setInterval(() => {
        medRemaining--;
        updateTimer();
        if (medRemaining <= 0) {
          clearInterval(medTimer); medTimer = null;
          startBtn.textContent = DC_T.done;
          if (circle) { circle.classList.remove('running'); circle.classList.add('done'); }
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
      <div class="mot-du-jour__label">${DC_T.wordOfDay}</div>
      <div class="mot-du-jour__ar">${entry.ar}</div>
      <div class="mot-du-jour__tr">${entry.tr}</div>
      <div class="mot-du-jour__fr">${entry.fr}</div>
      <div class="mot-du-jour__quote">${DC_T.oq}${entry.definition_concise || ''}${DC_T.cq}</div>
      <button class="mot-du-jour__btn" data-id="${entry.id}">${DC_T.discover}</button>
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
