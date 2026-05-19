/* ============================================================
   RÉCITER LES 99 NOMS — flashcards d'accueil
   Trois modes : Lecture · Défilement (auto) · Quiz
   Voix de synthèse en option (discrète, coupée par défaut).
   ============================================================ */
(function () {
  const root = document.getElementById('noms-flash');
  if (!root) return;

  function siteRoot() {
    const s = document.querySelector('script[src*="noms-flash"]');
    if (!s) return '';
    return s.src.replace(/assets\/js\/noms-flash\.js.*$/, '');
  }
  const EN = document.documentElement.lang === 'en';
  const DATA_ROOT = siteRoot() + (EN ? 'en/' : '');

  const T = EN ? {
    shuffle: '↻ Shuffle', order: '↻ In order',
    play: '▷ Play', pause: '❚❚ Pause',
    reveal: 'reveal ✦'
  } : {
    shuffle: '↻ Mélanger', order: '↻ Ordre 1–99',
    play: '▷ Lancer', pause: '❚❚ Pause',
    reveal: 'révéler ✦'
  };

  const card  = document.getElementById('nf-card');
  const elNum = document.getElementById('nf-n');
  const elAr  = document.getElementById('nf-ar');
  const elTr  = document.getElementById('nf-tr');
  const elFr  = document.getElementById('nf-fr');
  const elSens= document.getElementById('nf-sens');
  const elCue = document.getElementById('nf-cue');
  const prevBtn = document.getElementById('nf-prev');
  const shufBtn = document.getElementById('nf-shuffle');
  const playBtn = document.getElementById('nf-play');
  const audioBtn= document.getElementById('nf-audio');
  const modeBtns= root.querySelectorAll('.noms-flash__mode');

  let noms = [];
  let order = [];
  let pos = 0;
  let mode = 'lecture';      // lecture | defilement | quiz
  let shuffled = false;
  let revealed = true;       // quiz : la réponse est-elle montrée
  let audioOn = false;
  let playing = false;
  let timer = null;

  const STORE = 'nf-state-' + (EN ? 'en' : 'fr');

  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify({ pos: pos, mode: mode, shuffled: shuffled, order: order }));
    } catch (e) {}
  }
  function restore() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (s && Array.isArray(s.order) && s.order.length === noms.length) {
        order = s.order;
        pos = (s.pos | 0) % order.length;
        shuffled = !!s.shuffled;
        if (s.mode === 'defilement' || s.mode === 'quiz' || s.mode === 'lecture') mode = s.mode;
        return true;
      }
    } catch (e) {}
    return false;
  }

  /* ---- voix de synthèse ---- */
  function speak() {
    if (!audioOn || !window.speechSynthesis) return;
    const n = noms[order[pos]];
    if (!n) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(n.ar);
      u.lang = 'ar-SA';
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  /* ---- rendu ---- */
  function render() {
    const n = noms[order[pos]];
    if (!n) return;
    elNum.textContent  = n.n;
    elAr.textContent   = n.ar;
    elTr.textContent   = n.tr;
    elFr.textContent   = n.fr;
    elSens.textContent = n.sens_court || '';
    const hide = (mode === 'quiz' && !revealed);
    root.classList.toggle('is-hidden-answer', hide);
    elCue.textContent = hide ? T.reveal : '';
    save();
  }

  function turn(delta) {
    pos = (pos + delta + order.length) % order.length;
    revealed = (mode !== 'quiz');
    card.classList.add('is-turning');
    setTimeout(function () {
      render();
      card.classList.remove('is-turning');
      if (revealed) speak();
    }, 200);
  }

  /* ---- défilement automatique ---- */
  function stopPlay() {
    playing = false;
    if (timer) { clearInterval(timer); timer = null; }
    if (playBtn) playBtn.textContent = T.play;
  }
  function startPlay() {
    playing = true;
    if (playBtn) playBtn.textContent = T.pause;
    speak();
    timer = setInterval(function () { turn(1); }, 5000);
  }
  function togglePlay() { playing ? stopPlay() : startPlay(); }

  /* ---- toucher la carte : comportement selon le mode ---- */
  function tapCard() {
    if (mode === 'quiz') {
      if (!revealed) { revealed = true; render(); speak(); }
      else { turn(1); }
    } else if (mode === 'defilement') {
      togglePlay();
    } else {
      turn(1);
    }
  }

  /* ---- changement de mode ---- */
  function setMode(m) {
    stopPlay();
    mode = m;
    revealed = (mode !== 'quiz');
    modeBtns.forEach(function (b) {
      b.classList.toggle('is-active', b.dataset.mode === m);
    });
    if (playBtn) playBtn.hidden = (m !== 'defilement');
    render();
    save();
  }

  /* ---- ordre / mélange ---- */
  function applyShuffle() {
    if (shuffled) {
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = order[i]; order[i] = order[j]; order[j] = t;
      }
    } else {
      order = noms.map(function (_, i) { return i; });
    }
    pos = 0;
    revealed = (mode !== 'quiz');
    render();
  }
  function toggleShuffle() {
    shuffled = !shuffled;
    shufBtn.textContent = shuffled ? T.order : T.shuffle;
    applyShuffle();
  }

  /* ---- événements ---- */
  card.addEventListener('click', tapCard);
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tapCard(); }
    else if (e.key === 'ArrowRight') turn(1);
    else if (e.key === 'ArrowLeft')  turn(-1);
  });

  /* glisser du doigt : gauche = suivant, droite = précédent */
  let swipeX = null;
  card.addEventListener('touchstart', function (e) {
    swipeX = e.changedTouches[0].clientX;
  }, { passive: true });
  card.addEventListener('touchend', function (e) {
    if (swipeX === null) return;
    const dx = e.changedTouches[0].clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 45) {
      e.preventDefault();
      turn(dx < 0 ? 1 : -1);
    }
  });

  if (prevBtn) prevBtn.addEventListener('click', function () { turn(-1); });
  if (shufBtn) shufBtn.addEventListener('click', toggleShuffle);
  if (playBtn) playBtn.addEventListener('click', togglePlay);
  modeBtns.forEach(function (b) {
    b.addEventListener('click', function () { setMode(b.dataset.mode); });
  });
  if (audioBtn) audioBtn.addEventListener('click', function () {
    audioOn = !audioOn;
    audioBtn.classList.toggle('is-on', audioOn);
    audioBtn.setAttribute('aria-pressed', audioOn ? 'true' : 'false');
    if (!audioOn && window.speechSynthesis) window.speechSynthesis.cancel();
    else if (audioOn) speak();
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopPlay();
  });

  /* ---- chargement ---- */
  fetch(DATA_ROOT + 'data/noms-divins.json')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      noms = (d.noms || d).slice();
      order = noms.map(function (_, i) { return i; });
      const had = restore();
      if (shuffled) shufBtn.textContent = T.order;
      modeBtns.forEach(function (b) {
        b.classList.toggle('is-active', b.dataset.mode === mode);
      });
      if (playBtn) playBtn.hidden = (mode !== 'defilement');
      revealed = (mode !== 'quiz');
      render();
    })
    .catch(function () {});
})();
