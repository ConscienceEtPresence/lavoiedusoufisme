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

  const ND_EN = document.documentElement.lang === 'en';
  const ND_T = ND_EN ? {
    loadError: 'Unable to load the data.',
    allFilter: n => `All (${n})`,
    close: 'Close',
    nomLabel: (n, themeAr) => `Name no.${n} · ${themeAr}`,
    senseLinguistic: 'Linguistic sense',
    senseRational: 'Rational sense',
    senseSpiritual: 'Spiritual sense',
    emptyCommentary: 'Al-Kāfījī’s detailed commentary on this Name will be added soon.',
    servantPart: 'The servant’s share',
    meditate: '🕯️ Meditate this Name',
    prev: '← Previous', random: '⚘ Random', next: 'Next →',
    servantPartInline: 'The servant’s share:',
    quit: 'Leave',
    pronounce: 'Pronounce the name',
    chooseReps: 'Choose the number of repetitions',
    tapHint: 'Tap anywhere to advance the prayer-beads',
    enableAuto: 'Enable automatic mode',
    rhythm: 'Rhythm',
    vibration: 'Vibration',
    vibrationUnsupported: 'Vibration not supported on this browser',
    unavailable: ' <span style="opacity:0.5;font-size:0.75em;">(unavail.)</span>',
    sound: '🔊 Sound',
    counter: '📿 Counter',
    sourceAfter: 'After', sourceBy: 'by',
    oq: '“', cq: '”'
  } : {
    loadError: 'Impossible de charger les données.',
    allFilter: n => `Tous (${n})`,
    close: 'Fermer',
    nomLabel: (n, themeAr) => `Nom n°${n} · ${themeAr}`,
    senseLinguistic: 'Sens linguistique',
    senseRational: 'Sens rationnel',
    senseSpiritual: 'Sens spirituel',
    emptyCommentary: 'Le commentaire détaillé d’al-Kāfījī sur ce Nom sera ajouté prochainement.',
    servantPart: 'La part du serviteur',
    meditate: '🕯️ Méditer ce Nom',
    prev: '← Précédent', random: '⚘ Aléatoire', next: 'Suivant →',
    servantPartInline: 'La part du serviteur :',
    quit: 'Quitter',
    pronounce: 'Prononcer le nom',
    chooseReps: 'Choisir le nombre de répétitions',
    tapHint: 'Touchez n’importe où pour avancer le chapelet',
    enableAuto: 'Activer le mode automatique',
    rhythm: 'Rythme',
    vibration: 'Vibration',
    vibrationUnsupported: 'Vibration non supportée sur ce navigateur',
    unavailable: ' <span style="opacity:0.5;font-size:0.75em;">(indispo.)</span>',
    sound: '🔊 Son',
    counter: '📿 Compteur',
    sourceAfter: 'D’après', sourceBy: 'de',
    oq: '« ', cq: ' »'
  };

  try {
    const r = await fetch(DATA_URL);
    DATA = await r.json();
  } catch (e) {
    gridEl.innerHTML = `<p style="color:var(--ink-soft);text-align:center;">${ND_T.loadError}</p>`;
    return;
  }

  // Render filters
  const themes = DATA.themes;
  filtersEl.innerHTML = `
    <button class="noms-filter active" data-theme="all">${ND_T.allFilter(DATA.noms.length)}</button>
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
    if (n.lugha) sections.push({ titre: ND_T.senseLinguistic, ar: 'لُغَوِيّ', txt: n.lugha });
    if (n.aqli) sections.push({ titre: ND_T.senseRational, ar: 'عَقْلِيّ', txt: n.aqli });
    if (n.sufi) sections.push({ titre: ND_T.senseSpiritual, ar: 'صُوفِيّ', txt: n.sufi });

    modalContent.innerHTML = `
      <button class="nom-modal__close" aria-label="${ND_T.close}">✕</button>
      <div class="nom-fiche__head">
        <div class="nom-fiche__num">${ND_T.nomLabel(n.n, theme.label_ar)}</div>
        <div class="nom-fiche__ar">${n.ar}</div>
        <div class="nom-fiche__tr">${n.tr}</div>
        <div class="nom-fiche__fr">${n.fr}</div>
        <span class="nom-fiche__badge" data-theme="${n.theme}">${theme.label} · ${theme.fr}</span>
      </div>
      <div class="nom-fiche__sens">${ND_T.oq}${n.sens_court}${ND_T.cq}</div>
      ${sections.length ? sections.map(s => `
        <div class="nom-fiche__section">
          <h3>${s.titre} <span>${s.ar}</span></h3>
          <p>${s.txt}</p>
        </div>
      `).join('') : `<div class="nom-fiche__empty">${ND_T.emptyCommentary}</div>`}
      ${n.part ? `
        <div class="nom-fiche__section">
          <h3>${ND_T.servantPart} <span>حَظُّ العَبْد</span></h3>
          <div class="nom-fiche__part"><p>${n.part}</p></div>
        </div>` : ''}
      <div class="nom-fiche__meditate">
        <button class="nom-fiche__meditate-btn" data-action="meditate-nom">
          ${ND_T.meditate}
        </button>
        <button class="nom-fiche__share-btn" data-action="share-nom">✦ ${ND_EN ? 'Share' : 'Partager'}</button>
      </div>
      <div class="nom-fiche__nav">
        <button data-nav="prev">${ND_T.prev}</button>
        <button data-nav="random">${ND_T.random}</button>
        <button data-nav="next">${ND_T.next}</button>
      </div>
    `;
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
    if (e.target.closest('[data-action="share-nom"]')) {
      const n = DATA.noms[currentIndex];
      if (n) ensurePartage(function () {
        window.LVDDPartage.open({
          ar: n.ar, tr: n.tr, text: n.sens_court,
          attribution: (ND_EN ? 'The 99 Names' : 'Les 99 Noms') + ' · ' + n.fr,
          eyebrow: (ND_EN ? 'Name ' : 'Nom ') + n.n
        });
      });
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
  let soundOn = (localStorage.getItem('nom-med-sound') !== 'off');
  let vibrationOn = (localStorage.getItem('nom-med-vibration') !== 'off');
  let counterOn = (localStorage.getItem('nom-med-counter') !== 'off');
  let audioCtx = null;
  const hasVibrationSupport = ('vibrate' in navigator);

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

  // Petit tic discret — bois clair
  function playTick() {
    if (!soundOn) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(330, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.15);
  }

  // Carillon intermédiaire — pour les paliers (33, 66)
  function playChime() {
    if (!soundOn) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    [1320, 1980].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.20 / (i + 1), ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 0.7);
    });
  }

  // Cloche pleine — fin de cycle (99, 100, 1000)
  function playBell() {
    if (!soundOn) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    [660, 990, 1320, 1980].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.22 / (i + 1), ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.2);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 2.2);
    });
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
    if (n.part) meditationText += `<em>${ND_T.servantPartInline}</em> ${n.part}`;
    if (!meditationText && n.aqli) meditationText = n.aqli;
    if (!meditationText) meditationText = n.sens_court;

    medModeEl.innerHTML = `
      <button class="nom-med-mode__close" aria-label="${ND_T.quit}">✕</button>
      <div class="nom-med-mode__inner">
        <div class="nom-med-mode__num">${ND_T.nomLabel(n.n, theme.label_ar)} · ${theme.label}</div>
        <div class="nom-med-mode__ar">${n.ar}</div>
        <div class="nom-med-mode__tr">${n.tr} <button class="nom-med-mode__audio" data-action="speak" aria-label="${ND_T.pronounce}">♪</button></div>
        <div class="nom-med-mode__fr">${n.fr}</div>

        <div class="nom-med-mode__sens">${ND_T.oq}${n.sens_court}${ND_T.cq}</div>
        <div class="nom-med-mode__meditation">${meditationText}</div>

        <div class="nom-med-mode__targets" role="group" aria-label="${ND_T.chooseReps}">
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
        <div class="nom-med-mode__tap-hint">${ND_T.tapHint}</div>

        <div class="nom-med-mode__auto-wrap">
          <button class="nom-med-mode__toggle is-off" data-action="toggle-auto" aria-label="${ND_T.enableAuto}">
            ▶ Auto
          </button>
          <div class="nom-med-mode__speed">
            <span class="nom-med-mode__speed-label">${ND_T.rhythm}</span>
            <input type="range" class="nom-med-mode__speed-range" min="500" max="4000" step="100" value="${autoIntervalMs}" data-action="speed-range" />
            <span class="nom-med-mode__speed-value">${(autoIntervalMs / 1000).toFixed(1)}s</span>
          </div>
        </div>

        <div class="nom-med-mode__toggles">
          <button class="nom-med-mode__toggle ${soundOn ? 'is-on' : 'is-off'}" data-action="toggle-sound">
            ${ND_T.sound}
          </button>
          <button class="nom-med-mode__toggle ${vibrationOn ? 'is-on' : 'is-off'}" data-action="toggle-vibration" title="${hasVibrationSupport ? ND_T.vibration : ND_T.vibrationUnsupported}">
            📳 ${ND_T.vibration}${!hasVibrationSupport ? ND_T.unavailable : ''}
          </button>
          <button class="nom-med-mode__toggle ${counterOn ? 'is-on' : 'is-off'}" data-action="toggle-counter">
            ${ND_T.counter}
          </button>
        </div>
      </div>
    `;
    medModeEl.classList.add('open');
    document.body.style.overflow = 'hidden';

    placeBeads(99);
    updateTasbihVisual();
  }

  function closeNomMeditation() {
    if (!medModeEl) return;
    stopAuto();
    medModeEl.classList.remove('open');
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
          localStorage.setItem('nom-med-sound', soundOn ? 'on' : 'off');
          btn.classList.toggle('is-on', soundOn);
          btn.classList.toggle('is-off', !soundOn);
          return;
        }
        if (btn.dataset.action === 'toggle-vibration') {
          vibrationOn = !vibrationOn;
          localStorage.setItem('nom-med-vibration', vibrationOn ? 'on' : 'off');
          btn.classList.toggle('is-on', vibrationOn);
          btn.classList.toggle('is-off', !vibrationOn);
          if (vibrationOn) vibrate(50); // petit feedback à l'activation
          return;
        }
        if (btn.dataset.action === 'toggle-counter') {
          counterOn = !counterOn;
          localStorage.setItem('nom-med-counter', counterOn ? 'on' : 'off');
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
        ${ND_T.sourceAfter} <em>${DATA.source.ouvrage}</em> ${ND_T.sourceBy} ${DATA.source.auteur} (${DATA.source.dates})
        <span class="noms-source__title-ar">${DATA.source.ouvrage_ar} — ${DATA.source.auteur_ar}</span>
      </div>
      <p>${DATA.source.notice}</p>
    `;
  }

  renderGrid();
})();
