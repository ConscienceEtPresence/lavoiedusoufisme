/* ============================================================
   MODULE CORAN — lecteur de sourate (piloté par JSON)
   ============================================================ */
(function () {
  const mount = document.getElementById('coran-reader');
  if (!mount) return;

  function siteRoot() {
    const s = document.querySelector('script[src*="coran.js"]');
    if (!s) return '';
    return s.src.replace(/assets\/js\/coran\.js.*$/, '');
  }
  const EN = document.documentElement.lang === 'en';
  const DATA_ROOT = siteRoot() + (EN ? 'en/' : '');

  const T = EN ? {
    sura: 'Sūra', verses: 'verses',
    lecture: 'Reading', bilingue: 'Bilingual',
    study: 'Study this verse', close: 'Close',
    commentaire: 'Commentary', themes: 'Themes', mots: 'Word by word',
    racine: 'Root', gram: 'Grammar',
    revel: { 'Meccan': 'Meccan', 'Medinan': 'Medinan' }
  } : {
    sura: 'Sourate', verses: 'versets',
    lecture: 'Lecture', bilingue: 'Bilingue',
    study: 'Étudier ce verset', close: 'Fermer',
    commentaire: 'Commentaire', themes: 'Thèmes', mots: 'Mot à mot',
    racine: 'Racine', gram: 'Grammaire',
    revel: { 'mecquoise': 'mecquoise', 'médinoise': 'médinoise' }
  };

  const sn = mount.dataset.sourate;
  fetch(DATA_ROOT + 'data/coran/' + sn + '.json')
    .then(function (r) { return r.json(); })
    .then(render)
    .catch(function () {
      mount.innerHTML = '<p style="text-align:center;color:#888">—</p>';
    });

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function render(d) {
    const root = document.createElement('div');
    root.className = 'coran';
    root.setAttribute('data-mode', 'bilingue');

    /* couverture */
    const cover = document.createElement('header');
    cover.className = 'coran-cover';
    cover.innerHTML =
      '<div class="coran-cover__eyebrow">' + T.sura + ' ' + d.n + '</div>' +
      '<div class="coran-cover__ar" lang="ar" dir="rtl">' + esc(d.nom_ar) + '</div>' +
      '<h1 class="coran-cover__name">' + esc(d.nom_fr) + ' · ' + esc(d.nom_tr) + '</h1>' +
      '<div class="coran-cover__meta">' + (T.revel[d.revelation] || esc(d.revelation)) +
      ' · ' + d.versets_count + ' ' + T.verses + '</div>' +
      '<div class="coran-cover__rule"></div>' +
      '<p class="coran-cover__intro">' + (d.intro || '') + '</p>';
    root.appendChild(cover);

    /* modes */
    const modes = document.createElement('div');
    modes.className = 'coran-modes';
    modes.innerHTML =
      '<button type="button" data-m="lecture">' + T.lecture + '</button>' +
      '<button type="button" class="is-active" data-m="bilingue">' + T.bilingue + '</button>';
    modes.addEventListener('click', function (e) {
      const b = e.target.closest('button');
      if (!b) return;
      root.setAttribute('data-mode', b.dataset.m);
      modes.querySelectorAll('button').forEach(function (x) {
        x.classList.toggle('is-active', x === b);
      });
    });
    root.appendChild(modes);

    /* basmala */
    if (d.basmala) {
      const bm = document.createElement('div');
      bm.className = 'coran-basmala';
      bm.innerHTML =
        '<div class="coran-basmala__ar" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>' +
        '<div class="coran-basmala__fr">' + esc(d.basmala) + '</div>';
      root.appendChild(bm);
    }

    /* versets */
    d.versets.forEach(function (v) {
      root.appendChild(buildVerse(v));
    });

    /* pied */
    const foot = document.createElement('div');
    foot.className = 'coran-foot';
    foot.innerHTML = '<a href="../../index.html">' +
      (EN ? '← Back to home' : '← Retour à l\'accueil') + '</a>';
    root.appendChild(foot);

    mount.appendChild(root);
  }

  function buildVerse(v) {
    const cv = document.createElement('article');
    cv.className = 'cv';

    const num = document.createElement('div');
    num.className = 'cv__num';
    num.textContent = v.n;
    cv.appendChild(num);

    /* texte arabe : chaque mot cliquable */
    const ar = document.createElement('div');
    ar.className = 'cv__ar';
    ar.lang = 'ar';
    ar.dir = 'rtl';
    if (v.mots && v.mots.length) {
      v.mots.forEach(function (m, i) {
        const sp = document.createElement('span');
        sp.className = 'cw';
        sp.textContent = m.ar;
        sp.addEventListener('click', function (e) {
          e.stopPropagation();
          showWord(sp, m);
        });
        ar.appendChild(sp);
        if (i < v.mots.length - 1) ar.appendChild(document.createTextNode(' '));
      });
    } else {
      ar.textContent = v.ar;
    }
    cv.appendChild(ar);

    const tr = document.createElement('p');
    tr.className = 'cv__trad';
    tr.textContent = v.trad || '';
    cv.appendChild(tr);

    /* bouton étude */
    const study = document.createElement('div');
    study.className = 'cv__study';
    study.hidden = true;
    let html = '';
    if (v.commentaire) html += '<h3>' + T.commentaire + '</h3><p>' + v.commentaire + '</p>';
    if (v.themes && v.themes.length) {
      html += '<h3>' + T.themes + '</h3><div class="cv__themes">' +
        v.themes.map(function (t) { return '<span class="cv__theme">' + esc(t) + '</span>'; }).join('') +
        '</div>';
    }
    study.innerHTML = html;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cv__open';
    btn.textContent = '✦ ' + T.study;
    btn.addEventListener('click', function () {
      study.hidden = !study.hidden;
      btn.textContent = (study.hidden ? '✦ ' + T.study : '✦ ' + T.close);
    });
    cv.appendChild(btn);
    cv.appendChild(study);

    return cv;
  }

  /* ---- popover du mot ---- */
  let pop = null;
  function showWord(span, m) {
    closeWord();
    document.querySelectorAll('.cw.is-active').forEach(function (x) {
      x.classList.remove('is-active');
    });
    span.classList.add('is-active');

    pop = document.createElement('div');
    pop.className = 'cw-pop';
    let html =
      '<div class="cw-pop__ar" lang="ar" dir="rtl">' + esc(m.ar) + '</div>' +
      '<div class="cw-pop__tr">' + esc(m.tr) + '</div>' +
      '<div class="cw-pop__sens">' + esc(m.sens) + '</div>';
    if (m.racine && m.racine !== '—') {
      html += '<div class="cw-pop__row"><b>' + T.racine + '</b> · ' +
        '<span class="cw-pop__racine" lang="ar" dir="rtl">' + esc(m.racine) + '</span></div>';
    }
    if (m.gram) html += '<div class="cw-pop__row"><b>' + T.gram + '</b> · ' + esc(m.gram) + '</div>';
    pop.innerHTML = html;
    document.body.appendChild(pop);

    const r = span.getBoundingClientRect();
    const pw = pop.offsetWidth;
    let left = r.left + window.scrollX + r.width / 2 - pw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
    pop.style.left = left + 'px';
    pop.style.top = (r.bottom + window.scrollY + 8) + 'px';
  }
  function closeWord() {
    if (pop) { pop.remove(); pop = null; }
    document.querySelectorAll('.cw.is-active').forEach(function (x) {
      x.classList.remove('is-active');
    });
  }
  document.addEventListener('click', function (e) {
    if (pop && !e.target.closest('.cw-pop') && !e.target.closest('.cw')) closeWord();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeWord();
  });
})();
