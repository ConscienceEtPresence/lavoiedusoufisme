(() => {
  let DATA = null;
  let selected = [];           // lettres choisies, ex. ["ر","ح"]
  let currentRoot = null;

  const $ = id => document.getElementById(id);
  const keyboardEl = $('rac-keyboard');
  const gridEl     = $('rac-grid');
  const emptyEl    = $('rac-empty');
  const modal      = $('rac-modal');
  const modalEl    = $('rac-modal-content');
  const frInput    = $('rac-fr');

  // ---------- Audio (Web Speech) ----------
  function speakArabic(text) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ar-SA';
    u.rate = 0.65;
    const voices = speechSynthesis.getVoices();
    const v = voices.find(v => v.lang.startsWith('ar'));
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  if ('speechSynthesis' in window) speechSynthesis.getVoices();

  // ---------- Init ----------
  fetch('../../data/racines.json')
    .then(r => r.json())
    .then(data => {
      DATA = data;
      buildKeyboard();
      renderGrid(DATA.racines);
    });

  // ---------- Clavier ----------
  function buildKeyboard() {
    keyboardEl.innerHTML = DATA.meta.alphabet
      .map(l => `<button class="rac-key" data-letter="${l}">${l}</button>`)
      .join('');
    keyboardEl.addEventListener('click', e => {
      const k = e.target.closest('.rac-key');
      if (!k) return;
      const l = k.dataset.letter;
      if (selected.length < 3) {
        selected.push(l);
        applyFilter();
      }
    });
    $('rac-back').addEventListener('click', () => {
      selected.pop();
      applyFilter();
    });
    $('rac-clear').addEventListener('click', () => {
      selected = [];
      frInput.value = '';
      applyFilter();
    });
    frInput.addEventListener('input', () => {
      selected = [];
      applyFilter();
    });
  }

  function updateDisplay() {
    document.querySelectorAll('.rac-search__slot').forEach((s, i) => {
      if (selected[i]) {
        s.textContent = selected[i];
        s.removeAttribute('data-empty');
      } else {
        s.textContent = '·';
        s.setAttribute('data-empty', '');
      }
    });
    // hint
    const h = $('rac-hint');
    if (selected.length === 0)
      h.textContent = 'Touchez les lettres pour composer une racine';
    else if (selected.length < 3)
      h.textContent = `${selected.length} lettre${selected.length>1?'s':''} — encore ${3 - selected.length} possible${3-selected.length>1?'s':''}…`;
    else
      h.textContent = 'Racine complète';
  }

  function updateKeyboardState() {
    // grise les lettres non disponibles selon le filtre courant
    const matched = filtered();
    const possibleLetters = new Set();
    matched.forEach(r => {
      const next = r.letters[selected.length];
      if (next) possibleLetters.add(next);
    });
    document.querySelectorAll('.rac-key').forEach(k => {
      const l = k.dataset.letter;
      k.classList.toggle('is-pressed', selected.includes(l));
      if (selected.length === 0) {
        k.classList.remove('is-disabled', 'is-available');
      } else {
        const ok = possibleLetters.has(l) || selected.includes(l);
        k.classList.toggle('is-disabled', !ok);
        k.classList.toggle('is-available', ok && !selected.includes(l));
      }
    });
  }

  // ---------- Filtre ----------
  function filtered() {
    if (!DATA) return [];
    let res = DATA.racines.slice();
    if (selected.length) {
      res = res.filter(r =>
        selected.every((l, i) => r.letters[i] === l)
      );
    }
    const q = frInput.value.trim().toLowerCase();
    if (q) {
      res = res.filter(r => {
        const hay = [
          r.core_fr, r.field, r.glose_gloton,
          r.root_tr, r.meditation,
          ...(r.forms || []).map(f => `${f.tr} ${f.fr}`)
        ].join(' ').toLowerCase();
        return hay.includes(q);
      });
    }
    return res;
  }

  function applyFilter() {
    updateDisplay();
    updateKeyboardState();
    const res = filtered();
    renderGrid(res);
    // si exact match (3 lettres + 1 résultat) → ouvre direct
    if (selected.length === 3 && res.length === 1) {
      setTimeout(() => openRoot(res[0]), 250);
    }
  }

  // ---------- Grille ----------
  function renderGrid(racines) {
    if (!racines.length) {
      gridEl.innerHTML = '';
      emptyEl.classList.add('show');
      return;
    }
    emptyEl.classList.remove('show');
    gridEl.innerHTML = racines.map(r => {
      const nForms = (r.forms || []).length;
      const nDict  = (r.dict_links || []).length;
      const nNoms  = (r.nom_links || []).length;
      const parts = [];
      if (nForms) parts.push(`${nForms} dérivés`);
      if (nDict)  parts.push(`${nDict} entrée${nDict>1?'s':''} du dictionnaire`);
      if (nNoms)  parts.push(`${nNoms} Nom${nNoms>1?'s':''} divin${nNoms>1?'s':''}`);
      return `
        <div class="rac-card" data-id="${r.id}">
          <div class="rac-card__ar">${r.root_ar}</div>
          <div class="rac-card__tr">${r.root_tr}</div>
          <div class="rac-card__fr">${r.core_fr}</div>
          <div class="rac-card__meta">${parts.join(' · ')}</div>
        </div>`;
    }).join('');
  }

  gridEl.addEventListener('click', e => {
    const card = e.target.closest('.rac-card');
    if (!card) return;
    const r = DATA.racines.find(x => x.id === card.dataset.id);
    if (r) openRoot(r);
  });

  // ---------- Fiche ----------
  function openRoot(r) {
    currentRoot = r;
    const formsHTML = (r.forms || []).map(f => `
      <div class="rac-form-row">
        <div class="rac-form-row__ar">${f.ar}</div>
        <div class="rac-form-row__mid">
          <div class="rac-form-row__tr">${f.tr}</div>
          <div class="rac-form-row__fr">${f.fr}</div>
        </div>
        <div class="rac-form-row__tag">${f.form ? 'Forme ' + f.form + ' · ' : ''}${f.type || ''}</div>
        <button class="rac-form-row__audio" data-speak="${f.ar.replace(/"/g, '&quot;')}" aria-label="Prononcer">♪</button>
      </div>`).join('');

    const quranHTML = (r.quran || []).map(q => `
      <div class="rac-quran-row">
        <div class="rac-quran-row__ref">Coran ${q.ref}</div>
        <div class="rac-quran-row__ar">${q.ar}
          <button class="rac-form-row__audio" data-speak="${q.ar.replace(/"/g, '&quot;')}" aria-label="Prononcer" style="margin-right:0.5rem;">♪</button>
        </div>
        <div class="rac-quran-row__fr">« ${q.fr} »</div>
      </div>`).join('');

    const dictLinks = (r.dict_links || []).map(id =>
      `<a class="rac-link-pill" href="../dictionnaire/index.html#${id}">${id}</a>`
    ).join('');
    const nomLinks = (r.nom_links || []).map(n =>
      `<a class="rac-link-pill" href="../noms-divins/index.html#nom-${n}">Nom n°${n}</a>`
    ).join('');
    const linksHTML = (dictLinks || nomLinks) ? `
      <div class="rac-fiche__section">
        <h3>Résonances</h3>
        <div class="rac-fiche__links">${dictLinks}${nomLinks}</div>
      </div>` : '';

    modalEl.innerHTML = `
      <button class="rac-modal__close" aria-label="Fermer">✕</button>

      <div class="rac-fiche__head">
        <div class="rac-fiche__letters">${r.root_ar}</div>
        <div class="rac-fiche__tr">${r.root_tr}</div>
        <div class="rac-fiche__fr">${r.core_fr}</div>
        <button class="rac-fiche__audio" data-speak="${r.core_ar}">♪ ${r.core_ar}</button>
      </div>

      <div class="rac-fiche__section">
        <h3>Champ sémantique</h3>
        <p>${r.field}</p>
      </div>

      ${r.glose_gloton ? `
      <div class="rac-fiche__section">
        <h3>Glose de Gloton</h3>
        <p>${r.glose_gloton}</p>
      </div>` : ''}

      ${formsHTML ? `
      <div class="rac-fiche__section">
        <h3>Formes dérivées</h3>
        <div class="rac-fiche__forms">${formsHTML}</div>
      </div>` : ''}

      ${quranHTML ? `
      <div class="rac-fiche__section">
        <h3>Occurrences coraniques</h3>
        <div class="rac-fiche__quran">${quranHTML}</div>
      </div>` : ''}

      ${linksHTML}

      ${r.meditation ? `
      <div class="rac-fiche__meditation">
        <div class="rac-fiche__meditation-label">✦ Pour méditer ✦</div>
        <div class="rac-fiche__meditation-text">« ${r.meditation} »</div>
      </div>` : ''}
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
    if (e.target.matches('.rac-modal__backdrop, .rac-modal__close')) return closeModal();
    const speak = e.target.closest('[data-speak]');
    if (speak) speakArabic(speak.dataset.speak);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();
