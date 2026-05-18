/* ============================================================
   TIRAGE GLOBAL — pioche au hasard dans tout le site
   ============================================================ */
(function() {
  // Détecte le chemin racine selon la profondeur du script
  function siteRoot() {
    const scripts = document.querySelectorAll('script[src*="tirage-global"]');
    if (!scripts.length) return '';
    const src = scripts[scripts.length - 1].src;
    return src.replace(/assets\/js\/tirage-global\.js.*$/, '');
  }
  const ROOT = siteRoot();
  const TG_EN = document.documentElement.lang === 'en';
  const DATA_ROOT = ROOT + (TG_EN ? 'en/' : '');
  const TG_T = TG_EN ? {
    close: 'Close', goto: 'Go to this sign →', again: 'Draw again',
    hint: '“Open a page at random — what appears was meant for you.”',
    amour: 'The names of love', conte: 'Tale of Nasr Eddin Hodja',
    poesie: 'Sufi poetry', noms: 'The 99 divine Names', racines: 'Arabic roots of the Quran'
  } : {
    close: 'Fermer', goto: 'Aller vers ce signe →', again: 'Tirer encore',
    hint: '« Ouvre une page au hasard, ce qui apparaît t\'était destiné. »',
    amour: 'Les noms de l\'amour', conte: 'Conte de Nasr Eddin Hodja',
    poesie: 'Poésie soufie', noms: 'Les 99 Noms divins', racines: 'Racines arabes du Coran'
  };

  // Charge un JSON depuis /data/<file> (ou /en/data/ en anglais)
  function loadJSON(file) {
    return fetch(DATA_ROOT + 'data/' + file).then(r => r.json()).catch(() => null);
  }

  // Construit le pool unifié
  async function buildPool() {
    const [poesie, amour, hodja, racines, noms] = await Promise.all([
      loadJSON('poesie.json'),
      loadJSON('amour.json'),
      loadJSON('nasr-eddin.json'),
      loadJSON('racines.json'),
      loadJSON('noms-divins.json'),
    ]);

    const pool = [];

    // Amour (100 mots — chacun a une fiche individuelle)
    if (amour && amour.mots) {
      amour.mots.forEach(m => pool.push({
        type: 'amour',
        url: DATA_ROOT + 'pages/amour/mot.html?id=' + m.id,
        titre: m.translit,
        ar: m.ar,
        soustitre: m.definition,
        contexte: TG_T.amour
      }));
    }

    // Hodja (18 contes — fiche individuelle)
    if (hodja && hodja.contes) {
      hodja.contes.forEach(c => pool.push({
        type: 'conte',
        url: DATA_ROOT + 'pages/contes/nasr-eddin/conte.html?id=' + c.id,
        titre: c.titre,
        ar: '',
        soustitre: c.question || '',
        contexte: TG_T.conte
      }));
    }

    // Poésie (6 poèmes — pas de fiche individuelle, mais avec href par poème)
    if (poesie && poesie.poemes) {
      poesie.poemes.forEach(p => {
        if (p.status === 'soon') return;
        pool.push({
          type: 'poeme',
          url: DATA_ROOT + (p.href || 'pages/poesie/index.html'),
          titre: p.titre_fr,
          ar: p.titre_orig,
          soustitre: p.auteur_nom + ' — ' + p.tagline,
          contexte: TG_T.poesie
        });
      });
    }

    // Noms divins (100 — index page seulement)
    if (noms && noms.noms) {
      noms.noms.forEach(n => pool.push({
        type: 'nom',
        url: DATA_ROOT + 'pages/noms-divins/index.html#' + n.n,
        titre: n.fr,
        ar: n.ar,
        soustitre: n.tr,
        contexte: TG_T.noms
      }));
    }

    // Racines (64 — index page)
    if (racines && racines.racines) {
      racines.racines.forEach(r => pool.push({
        type: 'racine',
        url: DATA_ROOT + 'pages/racines/index.html#' + r.id,
        titre: r.core_fr || r.letters,
        ar: r.root_ar,
        soustitre: r.root_tr || r.letters,
        contexte: TG_T.racines
      }));
    }

    return pool;
  }

  // Vue modale du tirage
  function showModal(item) {
    // Nettoie un éventuel modal précédent
    const existing = document.querySelector('.tirage-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'tirage-modal';
    modal.innerHTML = `
      <div class="tirage-modal__backdrop"></div>
      <div class="tirage-modal__inner">
        <button class="tirage-modal__close" aria-label="${TG_T.close}">✕</button>
        <div class="tirage-modal__corpus">${item.contexte}</div>
        ${item.ar ? `<div class="tirage-modal__ar" lang="ar" dir="rtl">${item.ar}</div>` : ''}
        <h2 class="tirage-modal__titre">${item.titre}</h2>
        ${item.soustitre ? `<p class="tirage-modal__soustitre">${item.soustitre}</p>` : ''}
        <div class="tirage-modal__actions">
          <a href="${item.url}" class="tirage-modal__cta">${TG_T.goto}</a>
          <button class="tirage-modal__again">${TG_T.again}</button>
        </div>
        <p class="tirage-modal__hint"><em>${TG_T.hint}</em></p>
      </div>
    `;
    document.body.appendChild(modal);

    requestAnimationFrame(() => modal.classList.add('is-open'));

    function close() {
      modal.classList.remove('is-open');
      setTimeout(() => modal.remove(), 280);
    }
    modal.querySelector('.tirage-modal__backdrop').addEventListener('click', close);
    modal.querySelector('.tirage-modal__close').addEventListener('click', close);
    modal.querySelector('.tirage-modal__again').addEventListener('click', () => {
      close();
      setTimeout(triggerTirage, 300);
    });
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onEsc); }
    });
  }

  let POOL_CACHE = null;
  async function triggerTirage() {
    if (!POOL_CACHE) POOL_CACHE = await buildPool();
    if (!POOL_CACHE || !POOL_CACHE.length) return;
    const pick = POOL_CACHE[Math.floor(Math.random() * POOL_CACHE.length)];
    showModal(pick);
  }

  // Active les boutons avec data-tirage
  function attach() {
    document.querySelectorAll('[data-tirage-global]').forEach(btn => {
      if (btn.dataset.tirageBound) return;
      btn.dataset.tirageBound = '1';
      btn.addEventListener('click', e => {
        e.preventDefault();
        triggerTirage();
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attach);
  } else {
    attach();
  }

  // API publique
  window.tirageGlobal = triggerTirage;
})();
