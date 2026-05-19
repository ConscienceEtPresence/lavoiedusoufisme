/* ============================================================
   MODULE CORAN — lecteur de sourate (piloté par JSON)
   Partie 1 : la lecture (le Coran ouvert comme un livre)
   Partie 2 : l'étude (introduction + exégèse verset par verset)
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
    commentaire: 'Commentary', themes: 'Themes',
    sens: 'Sense here', def: 'Definition',
    racine: 'Root', gram: 'Grammar',
    hint: 'Touch a verse number to show its translation. Touch a word to study it.',
    studyTitle: 'Study', studySub: 'Introduction, then verse by verse.',
    revel: { 'Meccan': 'Meccan', 'Medinan': 'Medinan' }
  } : {
    sura: 'Sourate', verses: 'versets',
    commentaire: 'Commentaire', themes: 'Thèmes',
    sens: 'Sens ici', def: 'Définition',
    racine: 'Racine', gram: 'Grammaire',
    hint: 'Touchez le numéro d’un verset pour afficher sa traduction. Touchez un mot pour l’étudier.',
    studyTitle: 'Étude', studySub: 'L’introduction, puis verset par verset.',
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

    /* ---- couverture sobre : numéro + nom arabe (cliquable) ---- */
    const cover = document.createElement('header');
    cover.className = 'coran-cover';

    const eyebrow = document.createElement('div');
    eyebrow.className = 'coran-cover__eyebrow';
    eyebrow.textContent = T.sura + ' ' + d.n;
    cover.appendChild(eyebrow);

    const nameAr = document.createElement('button');
    nameAr.type = 'button';
    nameAr.className = 'coran-cover__ar';
    nameAr.lang = 'ar';
    nameAr.dir = 'rtl';
    nameAr.textContent = d.nom_ar;
    cover.appendChild(nameAr);

    const nameFr = document.createElement('div');
    nameFr.className = 'coran-cover__name';
    nameFr.textContent = d.nom_fr + ' · ' + d.nom_tr;
    nameFr.hidden = true;
    cover.appendChild(nameFr);

    nameAr.addEventListener('click', function () {
      nameFr.hidden = !nameFr.hidden;
      nameAr.classList.toggle('is-open', !nameFr.hidden);
    });

    const meta = document.createElement('div');
    meta.className = 'coran-cover__meta';
    meta.textContent = (T.revel[d.revelation] || d.revelation) +
      ' · ' + d.versets_count + ' ' + T.verses;
    cover.appendChild(meta);

    const rule = document.createElement('div');
    rule.className = 'coran-cover__rule';
    cover.appendChild(rule);

    root.appendChild(cover);

    /* ============ PARTIE 1 — LA LECTURE ============ */
    const reading = document.createElement('section');
    reading.className = 'coran-reading';

    const hint = document.createElement('p');
    hint.className = 'coran-hint';
    hint.textContent = T.hint;
    reading.appendChild(hint);

    if (d.basmala) reading.appendChild(buildBasmala(d.basmala));

    d.versets.forEach(function (v) {
      reading.appendChild(buildReadingVerse(v));
    });
    root.appendChild(reading);

    /* ============ PARTIE 2 — L'ÉTUDE ============ */
    const study = document.createElement('section');
    study.className = 'coran-study';

    const head = document.createElement('header');
    head.className = 'coran-study__head';
    head.innerHTML =
      '<div class="coran-study__rule"></div>' +
      '<h2 class="coran-study__title">' + T.studyTitle + ' — ' + T.sura.toLowerCase() +
      ' ' + esc(d.nom_tr) + '</h2>' +
      '<p class="coran-study__sub">' + T.studySub + '</p>';
    study.appendChild(head);

    if (d.intro) {
      const intro = document.createElement('p');
      intro.className = 'coran-study__intro';
      intro.innerHTML = d.intro;
      study.appendChild(intro);
    }

    d.versets.forEach(function (v) {
      study.appendChild(buildStudyVerse(v));
    });
    root.appendChild(study);

    /* pied */
    const foot = document.createElement('div');
    foot.className = 'coran-foot';
    foot.innerHTML = '<a href="../../index.html">' +
      (EN ? '← Back to home' : '← Retour à l\'accueil') + '</a>';
    root.appendChild(foot);

    mount.appendChild(root);
  }

  function buildBasmala(text) {
    const bm = document.createElement('div');
    bm.className = 'coran-basmala';
    bm.innerHTML =
      '<div class="coran-basmala__ar" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>' +
      '<div class="coran-basmala__fr">' + esc(text) + '</div>';
    return bm;
  }

  /* mots arabes cliquables */
  function buildArabic(v) {
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
    return ar;
  }

  /* ---- PARTIE 1 : verset de lecture ----
     petit numéro cliquable → affiche / masque la traduction ;
     chaque mot cliquable → popover sens/définition/racine/grammaire */
  function buildReadingVerse(v) {
    const cv = document.createElement('article');
    cv.className = 'cv cv--read';

    const tr = document.createElement('p');
    tr.className = 'cv__trad';
    tr.textContent = v.trad || '';
    tr.hidden = true;

    const num = document.createElement('button');
    num.type = 'button';
    num.className = 'cv__num';
    num.textContent = v.n;
    num.setAttribute('aria-label', (EN ? 'Verse ' : 'Verset ') + v.n);
    num.addEventListener('click', function () {
      tr.hidden = !tr.hidden;
      num.classList.toggle('is-open', !tr.hidden);
    });

    cv.appendChild(num);
    cv.appendChild(buildArabic(v));
    cv.appendChild(tr);
    return cv;
  }

  /* ---- PARTIE 2 : verset d'étude (traduction + thèmes + commentaire) ---- */
  function buildStudyVerse(v) {
    const cv = document.createElement('article');
    cv.className = 'cv cv--study';

    const num = document.createElement('div');
    num.className = 'cv__num';
    num.textContent = v.n;
    cv.appendChild(num);

    const ar = document.createElement('div');
    ar.className = 'cv__ar';
    ar.lang = 'ar';
    ar.dir = 'rtl';
    ar.textContent = v.ar;
    cv.appendChild(ar);

    const tr = document.createElement('p');
    tr.className = 'cv__trad';
    tr.textContent = v.trad || '';
    cv.appendChild(tr);

    if (v.commentaire || (v.themes && v.themes.length)) {
      const panel = document.createElement('div');
      panel.className = 'cv__study';
      let html = '';
      if (v.themes && v.themes.length) {
        html += '<div class="cv__themes">' +
          v.themes.map(function (t) { return '<span class="cv__theme">' + esc(t) + '</span>'; }).join('') +
          '</div>';
      }
      if (v.commentaire) html += '<p>' + v.commentaire + '</p>';
      panel.innerHTML = html;
      cv.appendChild(panel);
    }

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
      '<div class="cw-pop__tr">' + esc(m.tr) + '</div>';
    if (m.sens) {
      html += '<div class="cw-pop__sens"><b>' + T.sens + '</b> · ' + esc(m.sens) + '</div>';
    }

    /* définition propre du mot — une ou plusieurs au choix */
    const defs = m.def == null ? [] : (Array.isArray(m.def) ? m.def : [m.def]);
    if (defs.length) {
      html += '<div class="cw-pop__def">' +
        '<div class="cw-pop__deflabel"><b>' + T.def + '</b>';
      if (defs.length > 1) {
        html += '<span class="cw-pop__defpick">';
        for (let i = 0; i < defs.length; i++) {
          html += '<button type="button" class="cw-pop__defbtn' +
            (i === 0 ? ' is-active' : '') + '" data-i="' + i + '">' + (i + 1) + '</button>';
        }
        html += '</span>';
      }
      html += '</div><div class="cw-pop__deftext">' + esc(defs[0]) + '</div></div>';
    }

    if (m.racine && m.racine !== '—') {
      html += '<div class="cw-pop__row"><b>' + T.racine + '</b> · ' +
        '<span class="cw-pop__racine" lang="ar" dir="rtl">' + esc(m.racine) + '</span></div>';
    }
    if (m.gram) html += '<div class="cw-pop__row"><b>' + T.gram + '</b> · ' + esc(m.gram) + '</div>';
    pop.innerHTML = html;

    /* sélecteur de définition (quand il y en a plusieurs) */
    if (defs.length > 1) {
      const txt = pop.querySelector('.cw-pop__deftext');
      pop.querySelectorAll('.cw-pop__defbtn').forEach(function (b) {
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          txt.textContent = defs[+b.dataset.i];
          pop.querySelectorAll('.cw-pop__defbtn').forEach(function (x) {
            x.classList.toggle('is-active', x === b);
          });
        });
      });
    }

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
