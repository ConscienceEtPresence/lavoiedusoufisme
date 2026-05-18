/* ============================================================
   RÉCITER LES 99 NOMS — flashcards d'accueil
   Touche la carte → Nom suivant. Pour apprendre, un à un.
   ============================================================ */
(function () {
  const card = document.getElementById('nf-card');
  if (!card) return;

  function siteRoot() {
    const s = document.querySelector('script[src*="noms-flash"]');
    if (!s) return '';
    return s.src.replace(/assets\/js\/noms-flash\.js.*$/, '');
  }
  const EN = document.documentElement.lang === 'en';
  const DATA_ROOT = siteRoot() + (EN ? 'en/' : '');

  const elNum  = document.getElementById('nf-n');
  const elAr   = document.getElementById('nf-ar');
  const elTr   = document.getElementById('nf-tr');
  const elFr   = document.getElementById('nf-fr');
  const elSens = document.getElementById('nf-sens');
  const body   = card.querySelector('.noms-flash__body');

  let noms = [];
  let order = [];
  let pos = 0;

  function render() {
    const n = noms[order[pos]];
    if (!n) return;
    elNum.textContent  = n.n;
    elAr.textContent   = n.ar;
    elTr.textContent   = n.tr;
    elFr.textContent   = n.fr;
    elSens.textContent = n.sens_court || '';
  }

  function turn(delta) {
    pos = (pos + delta + order.length) % order.length;
    card.classList.add('is-turning');
    setTimeout(() => {
      render();
      card.classList.remove('is-turning');
    }, 200);
  }

  const shuf = document.getElementById('nf-shuffle');
  const LABELS = EN
    ? { shuffle: '↻ Shuffle', order: '↻ Back in order' }
    : { shuffle: '↻ Mélanger', order: '↻ Ordre 1–99' };
  let shuffled = false;

  function applyOrder() {
    if (shuffled) {
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
    } else {
      order = noms.map((_, i) => i);
    }
    pos = 0;
    render();
  }

  function toggleShuffle() {
    shuffled = !shuffled;
    if (shuf) shuf.textContent = shuffled ? LABELS.order : LABELS.shuffle;
    applyOrder();
  }

  card.addEventListener('click', () => turn(1));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); turn(1); }
    else if (e.key === 'ArrowRight') turn(1);
    else if (e.key === 'ArrowLeft')  turn(-1);
  });

  const prev = document.getElementById('nf-prev');
  if (prev) prev.addEventListener('click', () => turn(-1));
  if (shuf) shuf.addEventListener('click', toggleShuffle);

  fetch(DATA_ROOT + 'data/noms-divins.json')
    .then((r) => r.json())
    .then((d) => {
      noms = (d.noms || d).slice();
      order = noms.map((_, i) => i);
      render();
    })
    .catch(() => {});
})();
