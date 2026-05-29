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

  const shareEnabled = mount.dataset.partage === 'on';
  let currentSura = null;
  const SHARE_BIRD = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 16.5c4.6 1.1 8.8-.3 12.4-4.1.9-1 1.8-2.3 3.2-2.3.8 0 1.4.6 1.4 1.4 0 .9-.7 1.5-1.6 1.7 1.7.4 3.4-.2 4.9-1.5-.4 2.1-1.8 3.8-3.8 4.6 1.1.3 2.2.2 3.3-.3-1.3 1.7-3.2 2.8-5.4 3 .2 1.2.6 2.3 1.4 3.2-2.2-.5-3.8-2-4.6-4.1-3 .7-6 .3-8.8-1.1.9-.2 1.8-.6 2.5-1.2-1.6-.4-2.9-1.5-3.4-3z"/></svg>';

  /* ---- audio : récitation verset par verset (everyayah, Mishary al-ʿAfāsy) ---- */
  const ICON_PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
  let sharedAudio = null, playingBtn = null;
  function pad3(x) { x = String(x); return '000'.slice(x.length) + x; }
  function playVerse(n, btn) {
    if (sharedAudio && playingBtn === btn && !sharedAudio.paused) {
      sharedAudio.pause(); btn.innerHTML = ICON_PLAY; btn.classList.remove('is-playing'); playingBtn = null; return;
    }
    if (sharedAudio) { sharedAudio.pause(); if (playingBtn) { playingBtn.innerHTML = ICON_PLAY; playingBtn.classList.remove('is-playing'); } }
    const url = 'https://everyayah.com/data/Alafasy_128kbps/' + pad3(currentSura ? currentSura.n : 0) + pad3(n) + '.mp3';
    sharedAudio = new Audio(url);
    playingBtn = btn; btn.innerHTML = ICON_PAUSE; btn.classList.add('is-playing');
    sharedAudio.play().catch(function () { btn.innerHTML = ICON_PLAY; btn.classList.remove('is-playing'); playingBtn = null; });
    sharedAudio.onended = function () { btn.innerHTML = ICON_PLAY; btn.classList.remove('is-playing'); playingBtn = null; };
  }

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
    currentSura = { n: d.n, nom_tr: d.nom_tr, nom_fr: d.nom_fr };
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

    /* Mode « commentaire dépliable » verset par verset (activé via data-commentaire="inline") */
    const inlineMode = mount.dataset.commentaire === 'inline';

    /* ============ PARTIE 1 — LA LECTURE ============ */
    const reading = document.createElement('section');
    reading.className = 'coran-reading';

    const hint = document.createElement('p');
    hint.className = 'coran-hint';
    hint.textContent = inlineMode
      ? (EN ? 'Touch a verse number for its translation, a word to study it, or “commentary” to unfold it.'
            : 'Touchez un numéro de verset pour sa traduction, un mot pour l’étudier, ou « commentaire » pour le déplier.')
      : T.hint;
    reading.appendChild(hint);

    if (inlineMode && d.intro) {
      const intro = document.createElement('p');
      intro.className = 'coran-study__intro';
      intro.innerHTML = d.intro;
      reading.appendChild(intro);
    }

    /* contrôles du mode inline : tout déplier + saut au verset (longues sourates) */
    if (inlineMode) {
      const controls = document.createElement('div');
      controls.className = 'coran-controls';

      const expandLbl = function (open) {
        return (open ? '▴ ' : '▾ ') + (EN ? (open ? 'Collapse all' : 'Expand all') : (open ? 'Tout replier' : 'Tout déplier'));
      };
      let allOpen = false;
      const exp = document.createElement('button');
      exp.type = 'button';
      exp.className = 'coran-controls__btn';
      exp.textContent = expandLbl(false);
      exp.addEventListener('click', function () {
        allOpen = !allOpen;
        const cLbl = EN ? 'Commentary' : 'Commentaire';
        reading.querySelectorAll('.cv__study').forEach(function (p) { p.hidden = !allOpen; });
        reading.querySelectorAll('.cv__comment-toggle').forEach(function (t) {
          t.classList.toggle('is-open', allOpen);
          t.textContent = (allOpen ? '▴ ' : '▾ ') + cLbl;
        });
        exp.textContent = expandLbl(allOpen);
      });
      controls.appendChild(exp);

      if (d.versets_count > 40) {
        const form = document.createElement('form');
        form.className = 'coran-jumpverse';
        const input = document.createElement('input');
        input.type = 'number'; input.min = 1; input.max = d.versets_count;
        input.placeholder = (EN ? 'verse' : 'verset');
        input.setAttribute('aria-label', EN ? 'Go to verse' : 'Aller au verset');
        const go = document.createElement('button');
        go.type = 'submit';
        go.textContent = EN ? 'Go' : 'Aller';
        form.appendChild(input); form.appendChild(go);
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          const num = parseInt(input.value, 10);
          const el = document.getElementById('v-' + num);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        controls.appendChild(form);
      }
      reading.appendChild(controls);
    }

    if (d.basmala) reading.appendChild(buildBasmala(d.basmala));

    d.versets.forEach(function (v) {
      reading.appendChild(inlineMode ? buildInlineVerse(v) : buildReadingVerse(v));
    });
    root.appendChild(reading);

    /* ============ PARTIE 2 — L'ÉTUDE (mode classique uniquement) ============ */
    if (!inlineMode) {
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
    }

    /* pied */
    const foot = document.createElement('div');
    foot.className = 'coran-foot';
    if (inlineMode) {
      const n = d.n;
      const sura = EN ? 'Sūra ' : 'Sourate ';
      const prevN = n < 114 ? n + 1 : null; // ordre de lecture du site : descendant (114 → 1)
      const nextN = n > 1 ? n - 1 : null;
      const home = EN ? 'Home' : 'Accueil';
      foot.classList.add('coran-nav');
      foot.innerHTML =
        '<div class="coran-nav__side coran-nav__side--prev">' +
          (prevN ? '<a href="sourate-' + prevN + '.html">← ' + sura + prevN + '</a>' : '') +
        '</div>' +
        '<div class="coran-nav__home"><a href="../../index.html">' + home + '</a></div>' +
        '<div class="coran-nav__side coran-nav__side--next">' +
          (nextN ? '<a href="sourate-' + nextN + '.html">' + sura + nextN + ' →</a>' : '') +
        '</div>';
    } else {
      foot.innerHTML = '<a href="../../index.html">' +
        (EN ? '← Back to home' : '← Retour à l\'accueil') + '</a>';
    }
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

  /* ---- verset « inline » : lecture + commentaire dépliable sur place ---- */
  function buildInlineVerse(v) {
    const cv = document.createElement('article');
    cv.className = 'cv cv--read cv--inline';
    cv.id = 'v-' + v.n;

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

    const audio = document.createElement('button');
    audio.type = 'button';
    audio.className = 'cv__audio';
    audio.innerHTML = ICON_PLAY;
    audio.setAttribute('aria-label', EN ? 'Listen to the recitation' : 'Écouter la récitation');
    audio.addEventListener('click', function () { playVerse(v.n, audio); });

    cv.appendChild(num);
    cv.appendChild(audio);
    cv.appendChild(buildArabic(v));
    cv.appendChild(tr);

    if (v.commentaire || (v.themes && v.themes.length)) {
      const label = EN ? 'Commentary' : 'Commentaire';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'cv__comment-toggle';
      toggle.textContent = '▾ ' + label;

      const panel = document.createElement('div');
      panel.className = 'cv__study';
      panel.hidden = true;
      let html = '';
      if (v.themes && v.themes.length) {
        html += '<div class="cv__themes">' +
          v.themes.map(function (t) { return '<span class="cv__theme">' + esc(t) + '</span>'; }).join('') +
          '</div>';
      }
      if (v.commentaire) html += '<p>' + v.commentaire + '</p>';
      panel.innerHTML = html;

      toggle.addEventListener('click', function () {
        panel.hidden = !panel.hidden;
        toggle.classList.toggle('is-open', !panel.hidden);
        toggle.textContent = (panel.hidden ? '▾ ' : '▴ ') + label;
      });

      cv.appendChild(toggle);
      cv.appendChild(panel);
    }

    if (shareEnabled) {
      const share = document.createElement('button');
      share.type = 'button';
      share.className = 'cv__share';
      share.innerHTML = SHARE_BIRD;
      share.setAttribute('aria-label', EN ? 'Offer this verse' : 'Offrir ce verset');
      share.title = EN ? 'Offer' : 'Offrir';
      share.addEventListener('click', function () { openShareCard(v); });
      cv.appendChild(share);
    }

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

  /* ============================================================
     PARTAGE — génère une carte image (canvas) depuis un verset
     ============================================================ */
  function shareAttribution(v) {
    const s = currentSura || {};
    const base = (EN ? 'Quran' : 'Coran') + ' · ' + (s.nom_tr || '') ;
    return base + ' — ' + (s.n || '') + ' : ' + v.n;
  }

  /* délégation au module partagé partage.js */
  function ensurePartage(cb) {
    if (window.LVDDPartage) { cb(); return; }
    var s = document.querySelector('script[data-partage-js]');
    if (!s) {
      s = document.createElement('script');
      s.src = siteRoot() + 'assets/js/partage.js?v=1';
      s.dataset.partageJs = '1';
      document.head.appendChild(s);
    }
    s.addEventListener('load', function () { if (window.LVDDPartage) cb(); });
  }
  function openShareCard(v) {
    ensurePartage(function () {
      window.LVDDPartage.open({
        ar: v.ar, tr: v.tr, text: v.trad,
        attribution: shareAttribution(v),
        eyebrow: (EN ? 'Sūra ' : 'Sourate ') + (currentSura ? currentSura.n : '')
      });
    });
  }
})();
