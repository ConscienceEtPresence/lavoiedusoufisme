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
        <button data-lyket-type="like"
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
  let currentNom = null;
  let tasbihCount = 0;
  let tasbihTarget = 99;
  let audioCtx = null;
  const hasVibrationSupport = ('vibrate' in navigator);
  const storageGet = key => {
    try { return localStorage.getItem(key); }
    catch (e) { return null; }
  };
  const storageSet = (key, value) => {
    try { localStorage.setItem(key, value); }
    catch (e) {}
  };
  let soundOn = (storageGet('nom-med-sound') !== 'off');
  let vibrationOn = hasVibrationSupport && (storageGet('nom-med-vibration') !== 'off');
  let counterOn = (storageGet('nom-med-counter') !== 'off');

  function getAudioCtx() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { audioCtx = null; }
    }
    // Forcer la reprise si le contexte est suspendu (politique iOS/Safari)
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playSoftPartial(ctx, {
    freq,
    endFreq = freq,
    delay = 0,
    duration = 0.18,
    gainValue = 0.035,
    type = 'sine'
  }) {
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== freq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  // Petit son doux, plus bois que bip électronique.
  function playTick() {
    if (!soundOn) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    playSoftPartial(ctx, { freq: 540, endFreq: 410, duration: 0.12, gainValue: 0.028, type: 'triangle' });
    playSoftPartial(ctx, { freq: 810, endFreq: 720, delay: 0.012, duration: 0.11, gainValue: 0.012 });
  }

  // Carillon intermédiaire — pour les paliers (33, 66), discret et court.
  function playChime() {
    if (!soundOn) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    playSoftPartial(ctx, { freq: 660, duration: 0.62, gainValue: 0.045 });
    playSoftPartial(ctx, { freq: 990, delay: 0.035, duration: 0.58, gainValue: 0.025 });
    playSoftPartial(ctx, { freq: 1320, delay: 0.075, duration: 0.42, gainValue: 0.012 });
  }

  // Cloche pleine — fin de cycle (99, 100, 1000), ample mais peu agressive.
  function playBell() {
    if (!soundOn) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    playSoftPartial(ctx, { freq: 440, duration: 1.7, gainValue: 0.055 });
    playSoftPartial(ctx, { freq: 660, delay: 0.025, duration: 1.5, gainValue: 0.04 });
    playSoftPartial(ctx, { freq: 990, delay: 0.06, duration: 1.2, gainValue: 0.023 });
    playSoftPartial(ctx, { freq: 1320, delay: 0.11, duration: 0.9, gainValue: 0.012 });
  }

  function vibrate(ms) {
    if (!vibrationOn) return;
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  function speakArabic(text) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    u.rate = 0.7;
    u.pitch = 1.0;
    // Trouver une voix arabe si possible
    const voices = speechSynthesis.getVoices();
    const arVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arVoice) u.voice = arVoice;
    speechSynthesis.speak(u);
    return u;
  }

  function placeBeads(target) {
    const tasbih = medModeEl.querySelector('.nom-med-mode__tasbih');
    if (!tasbih) return;
    const beadsHTML = [];
    const showBeads = target <= 99;
    if (showBeads) {
      const radius = 130;
      for (let i = 0; i < target; i++) {
        const angle = (i / target) * 2 * Math.PI - Math.PI / 2;
        const x = 50 + (radius / 320) * 50 * Math.cos(angle);
        const y = 50 + (radius / 320) * 50 * Math.sin(angle);
        beadsHTML.push(`<div class="tasbih-bead" data-i="${i}" style="left:calc(${x}% - 4px); top:calc(${y}% - 4px);"></div>`);
      }
    }
    tasbih.innerHTML = beadsHTML.join('') + `
      <div class="tasbih-counter">
        <div class="tasbih-counter__num" id="tasbih-num">${tasbihCount}</div>
        <div class="tasbih-counter__target">${target === Infinity ? '∞' : '/ ' + target}</div>
      </div>
    `;
    tasbih.classList.toggle('hidden', !counterOn);
  }

  function updateTasbihVisual() {
    const num = medModeEl.querySelector('#tasbih-num');
    if (num) {
      num.textContent = tasbihCount;
      num.classList.add('beat');
      setTimeout(() => num.classList.remove('beat'), 200);
    }
    const beads = medModeEl.querySelectorAll('.tasbih-bead');
    beads.forEach((b, i) => {
      const filled = i < (tasbihCount % tasbihTarget || (tasbihCount > 0 && tasbihCount % tasbihTarget === 0 ? tasbihTarget : 0));
      b.classList.toggle('filled', filled);
      b.classList.toggle('last', filled && i === ((tasbihCount - 1) % tasbihTarget));
    });
  }

  function setTarget(t) {
    tasbihTarget = t;
    tasbihCount = 0;
    placeBeads(t);
    medModeEl.querySelectorAll('[data-target]').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.target) === t || (t === Infinity && b.dataset.target === 'inf'));
    });
  }

  function showTapFeedback(x, y) {
    const f = document.createElement('div');
    f.className = 'nom-med-mode__tap-feedback';
    f.style.left = (x - 40) + 'px';
    f.style.top = (y - 40) + 'px';
    medModeEl.appendChild(f);
    setTimeout(() => f.remove(), 700);
  }

  function tasbihTap(x, y) {
    if (!counterOn) return;
    tasbihCount++;
    const isMilestone = tasbihTarget !== Infinity && (tasbihCount % tasbihTarget === 0);
    const isThird = tasbihTarget === 99 && (tasbihCount % 33 === 0) && !isMilestone;
    if (isMilestone) { playBell(); vibrate([60, 80, 60]); }
    else if (isThird) { playChime(); vibrate([40, 50, 40]); }
    else { playTick(); vibrate(30); }
    updateTasbihVisual();
    if (x !== undefined && y !== undefined) showTapFeedback(x, y);
  }

  // === Mode automatique : décompte à un rythme choisi ===
  let autoTimer = null;
  let autoIntervalMs = 1500; // 1.5s par défaut

  function startAuto() {
    if (autoTimer) return;
    getAudioCtx(); // Prépare l'audio pendant le geste utilisateur, utile sur iOS/Safari.
    autoTimer = setInterval(() => tasbihTap(), autoIntervalMs);
    updateAutoUI(true);
  }
  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    updateAutoUI(false);
  }
  function setAutoSpeed(ms) {
    autoIntervalMs = ms;
    if (autoTimer) { stopAuto(); startAuto(); }
    const label = medModeEl && medModeEl.querySelector('.nom-med-mode__speed-value');
    if (label) label.textContent = (ms / 1000).toFixed(1) + 's';
  }
  function updateAutoUI(running) {
    const btn = medModeEl && medModeEl.querySelector('[data-action="toggle-auto"]');
    if (btn) {
      btn.classList.toggle('is-on', running);
      btn.classList.toggle('is-off', !running);
      btn.innerHTML = running ? '⏸ Auto' : '▶ Auto';
    }
  }

  function openNomMeditation(n) {
    if (!medModeEl) return;
    currentNom = n;
    tasbihCount = 0;
    const theme = DATA.themes[n.theme];

    // Composer le texte de méditation profond à partir des champs disponibles
    let meditationText = '';
    if (n.sufi) meditationText += n.sufi + ' ';
    if (n.part) meditationText += `<em>La part du serviteur :</em> ${n.part}`;
    if (!meditationText && n.aqli) meditationText = n.aqli;
    if (!meditationText) meditationText = n.sens_court;

    medModeEl.innerHTML = `
      <button class="nom-med-mode__close" aria-label="Quitter">✕</button>
      <div class="nom-med-mode__inner">
        <div class="nom-med-mode__num">Nom n°${n.n} · ${theme.label} · ${theme.label_ar}</div>
        <div class="nom-med-mode__ar">${n.ar}</div>
        <div class="nom-med-mode__tr">${n.tr} <button class="nom-med-mode__audio" data-action="speak" aria-label="Prononcer le nom">♪</button></div>
        <div class="nom-med-mode__fr">${n.fr}</div>

        <div class="nom-med-mode__sens">« ${n.sens_court} »</div>
        <div class="nom-med-mode__meditation">${meditationText}</div>

        <div class="nom-med-mode__targets" role="group" aria-label="Choisir le nombre de répétitions">
          <button class="nom-med-mode__target" data-target="33">33</button>
          <button class="nom-med-mode__target active" data-target="99">99</button>
          <button class="nom-med-mode__target" data-target="100">100</button>
          <button class="nom-med-mode__target" data-target="1000">1000</button>
          <button class="nom-med-mode__target" data-target="inf">∞</button>
        </div>

        <div class="nom-med-mode__tasbih"></div>
        <div class="nom-med-mode__echo" aria-hidden="true">
          <div class="nom-med-mode__echo-ar" lang="ar" dir="rtl">${n.ar}</div>
          <div class="nom-med-mode__echo-tr">${n.tr}</div>
        </div>
        <div class="nom-med-mode__tap-hint">Touchez n'importe où pour avancer le chapelet</div>

        <div class="nom-med-mode__auto-wrap">
          <button class="nom-med-mode__toggle is-off" data-action="toggle-auto" aria-label="Activer le mode automatique">
            ▶ Auto
          </button>
          <div class="nom-med-mode__speed">
            <span class="nom-med-mode__speed-label">Rythme</span>
            <input type="range" class="nom-med-mode__speed-range" min="500" max="4000" step="100" value="${autoIntervalMs}" data-action="speed-range" />
            <span class="nom-med-mode__speed-value">${(autoIntervalMs / 1000).toFixed(1)}s</span>
          </div>
        </div>

        <div class="nom-med-mode__toggles">
          <button class="nom-med-mode__toggle ${soundOn ? 'is-on' : 'is-off'}" data-action="toggle-sound">
            🔊 Son
          </button>
          <button class="nom-med-mode__toggle ${vibrationOn ? 'is-on' : 'is-off'}" data-action="toggle-vibration" title="${hasVibrationSupport ? 'Vibration' : 'Vibration non supportée sur ce téléphone ou navigateur'}"${hasVibrationSupport ? '' : ' disabled aria-disabled="true"'}>
            📳 ${hasVibrationSupport ? 'Vibration' : 'Vibration indisponible'}
          </button>
          <button class="nom-med-mode__toggle ${counterOn ? 'is-on' : 'is-off'}" data-action="toggle-counter">
            📿 Compteur
          </button>
        </div>
      </div>
    `;
    medModeEl.classList.add('open');
    medModeEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    placeBeads(99);
    updateTasbihVisual();
  }

  function closeNomMeditation() {
    if (!medModeEl) return;
    stopAuto();
    medModeEl.classList.remove('open');
    medModeEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    currentNom = null;
  }

  if (medModeEl) {
    // Slider de vitesse — événement input (séparé du click)
    medModeEl.addEventListener('input', e => {
      if (e.target.dataset.action === 'speed-range') {
        setAutoSpeed(parseInt(e.target.value));
      }
    });

    // Tap global sur la fenêtre méditation = compteur
    medModeEl.addEventListener('click', e => {
      // Le slider ne déclenche pas le tap
      if (e.target.matches('input[type="range"], .nom-med-mode__speed, .nom-med-mode__speed *')) return;
      // Si on clique sur un contrôle, on ne compte pas
      if (e.target.closest('button')) {
        const btn = e.target.closest('button');
        if (btn.matches('.nom-med-mode__close')) return closeNomMeditation();
        if (btn.dataset.action === 'speak') {
          if (currentNom) {
            speakArabic(currentNom.ar);
            btn.classList.add('is-playing');
            setTimeout(() => btn.classList.remove('is-playing'), 2500);
          }
          return;
        }
        if (btn.dataset.action === 'toggle-sound') {
          soundOn = !soundOn;
          storageSet('nom-med-sound', soundOn ? 'on' : 'off');
          btn.classList.toggle('is-on', soundOn);
          btn.classList.toggle('is-off', !soundOn);
          return;
        }
        if (btn.dataset.action === 'toggle-vibration') {
          if (!hasVibrationSupport) return;
          vibrationOn = !vibrationOn;
          storageSet('nom-med-vibration', vibrationOn ? 'on' : 'off');
          btn.classList.toggle('is-on', vibrationOn);
          btn.classList.toggle('is-off', !vibrationOn);
          if (vibrationOn) vibrate(50); // petit feedback à l'activation
          return;
        }
        if (btn.dataset.action === 'toggle-counter') {
          counterOn = !counterOn;
          storageSet('nom-med-counter', counterOn ? 'on' : 'off');
          btn.classList.toggle('is-on', counterOn);
          btn.classList.toggle('is-off', !counterOn);
          const tasbih = medModeEl.querySelector('.nom-med-mode__tasbih');
          const hint = medModeEl.querySelector('.nom-med-mode__tap-hint');
          const echo = medModeEl.querySelector('.nom-med-mode__echo');
          if (tasbih) tasbih.classList.toggle('hidden', !counterOn);
          if (hint) hint.style.display = counterOn ? '' : 'none';
          if (echo) echo.style.display = counterOn ? '' : 'none';
          return;
        }
        if (btn.dataset.action === 'toggle-auto') {
          if (autoTimer) stopAuto(); else startAuto();
          return;
        }
        if (btn.dataset.target) {
          const t = btn.dataset.target === 'inf' ? Infinity : parseInt(btn.dataset.target);
          setTarget(t);
          return;
        }
        return; // Tout autre bouton : pas de tap
      }
      // Sinon : c'est un tap pour le compteur
      tasbihTap(e.clientX, e.clientY);
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
