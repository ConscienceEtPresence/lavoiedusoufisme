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

    cv.appendChild(num);
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
      share.textContent = '✦ ' + (EN ? 'Share' : 'Partager');
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

  function wrapLines(ctx, text, maxWidth) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = '';
    for (let i = 0; i < words.length; i++) {
      const test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = words[i];
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function goldGrad(ctx, y0, y1, dark) {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    if (dark) { g.addColorStop(0, '#F0D27A'); g.addColorStop(0.5, '#D4A93A'); g.addColorStop(1, '#A87E1E'); }
    else { g.addColorStop(0, '#D9B14C'); g.addColorStop(0.5, '#B8860B'); g.addColorStop(1, '#8A6307'); }
    return g;
  }

  function drawCard(canvas, v, theme) {
    const S = 1080, R = 2; // R = supersampling (rendu net)
    canvas.width = S * R; canvas.height = S * R;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(R, 0, 0, R, 0, 0);
    const dark = theme === 'dark';

    const col = dark
      ? { bg1:'#16202F', bg2:'#0C0F18', ink:'#F5EFE0', soft:'#CDC4AE' }
      : { bg1:'#FFFDF8', bg2:'#ECE0C8', ink:'#1B2A4E', soft:'#3A4D63' };

    // fond dégradé
    const g = ctx.createLinearGradient(0, 0, S, S);
    g.addColorStop(0, col.bg1); g.addColorStop(1, col.bg2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);

    // halo central (lumière derrière le verset)
    const halo = ctx.createRadialGradient(S / 2, S * 0.43, 30, S / 2, S * 0.43, 430);
    halo.addColorStop(0, dark ? 'rgba(212,169,58,0.16)' : 'rgba(255,251,240,0.95)');
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, S, S);

    // grain de parchemin
    for (let i = 0; i < 2400; i++) {
      const x = Math.random() * S, y = Math.random() * S;
      ctx.fillStyle = (Math.random() < 0.5 ? 'rgba(255,255,255,' : 'rgba(0,0,0,') + (Math.random() * (dark ? 0.04 : 0.05)) + ')';
      ctx.fillRect(x, y, 1.4, 1.4);
    }

    // vignette
    const vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.32, S / 2, S / 2, S * 0.74);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, dark ? 'rgba(0,0,0,0.38)' : 'rgba(70,48,12,0.13)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);

    // cadre + ornements de coin
    ctx.strokeStyle = goldGrad(ctx, 54, S - 54, dark); ctx.globalAlpha = 0.6; ctx.lineWidth = 2;
    roundRect(ctx, 54, 54, S - 108, S - 108, 26); ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // nom de la sourate en arabe (eyebrow)
    if (currentSura && currentSura.n) {
      ctx.fillStyle = goldGrad(ctx, 96, 130, dark);
      ctx.font = '40px "Amiri", serif';
      ctx.fillText((EN ? 'Sūra ' : 'Sourate ') + currentSura.n, S / 2, 116);
    }
    // ornement
    ctx.fillStyle = goldGrad(ctx, 150, 180, dark);
    ctx.font = '34px "Inter", sans-serif';
    ctx.fillText('✦', S / 2, 178);

    // arabe (centre) — taille adaptative
    ctx.direction = 'rtl';
    ctx.fillStyle = col.ink;
    let aSize = (v.ar && v.ar.length > 55) ? 58 : 80;
    ctx.font = '700 ' + aSize + 'px "Amiri", serif';
    let aLines = wrapLines(ctx, v.ar, S - 280);
    while (aLines.length > 4 && aSize > 40) {
      aSize -= 6; ctx.font = '700 ' + aSize + 'px "Amiri", serif';
      aLines = wrapLines(ctx, v.ar, S - 280);
    }
    const aLH = aSize * 1.62;
    let ay = S * 0.43 - (aLines.length - 1) * aLH / 2;
    aLines.forEach(function (ln) { ctx.fillText(ln, S / 2, ay); ay += aLH; });
    ctx.direction = 'ltr';

    // filet or
    ctx.strokeStyle = goldGrad(ctx, ay, ay + 4, dark); ctx.globalAlpha = 0.8; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(S / 2 - 46, ay + 2); ctx.lineTo(S / 2 + 46, ay + 2); ctx.stroke();
    ctx.globalAlpha = 1;

    // translittération (italique doré)
    let ty = ay + 56;
    if (v.tr) {
      ctx.fillStyle = goldGrad(ctx, ty - 24, ty + 4, dark);
      ctx.font = 'italic 30px "Cormorant Garamond", Georgia, serif';
      wrapLines(ctx, v.tr, S - 320).slice(0, 2).forEach(function (ln) { ctx.fillText(ln, S / 2, ty); ty += 38; });
      ty += 14;
    }

    // traduction
    ctx.fillStyle = col.soft;
    ctx.font = 'italic 38px "Cormorant Garamond", Georgia, serif';
    wrapLines(ctx, '« ' + (v.trad || '') + ' »', S - 290).slice(0, 6).forEach(function (ln) {
      ctx.fillText(ln, S / 2, ty); ty += 50;
    });

    // attribution
    ctx.fillStyle = goldGrad(ctx, S - 172, S - 146, dark);
    ctx.font = '500 25px "Inter", sans-serif';
    ctx.fillText(shareAttribution(v), S / 2, S - 150);

    // signature + logo concentrique
    ctx.strokeStyle = goldGrad(ctx, S - 105, S - 79, dark); ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(S / 2 - 96, S - 92, 12, 0, 6.2832); ctx.stroke();
    ctx.beginPath(); ctx.arc(S / 2 - 96, S - 92, 5.5, 0, 6.2832); ctx.stroke();
    ctx.fillStyle = goldGrad(ctx, S - 104, S - 80, dark);
    ctx.font = '500 23px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('lavoiedudedans.fr', S / 2 - 74, S - 84);
    ctx.textAlign = 'center';
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  let shareOverlay = null;
  async function openShareCard(v) {
    if (shareOverlay) shareOverlay.remove();
    const initialDark = document.documentElement.getAttribute('data-theme') === 'dark';

    const ov = document.createElement('div');
    ov.className = 'partage-overlay';
    ov.innerHTML =
      '<div class="partage-box">' +
        '<canvas class="partage-canvas"></canvas>' +
        '<div class="partage-actions">' +
          '<button type="button" class="partage-btn" data-act="theme">' + (EN ? 'Day / Night' : 'Jour / Nuit') + '</button>' +
          '<button type="button" class="partage-btn partage-btn--gold" data-act="share">' + (EN ? 'Share' : 'Partager') + '</button>' +
          '<button type="button" class="partage-btn" data-act="dl">' + (EN ? 'Download' : 'Télécharger') + '</button>' +
        '</div>' +
        '<button type="button" class="partage-close" aria-label="' + (EN ? 'Close' : 'Fermer') + '">✕</button>' +
      '</div>';
    document.body.appendChild(ov);
    shareOverlay = ov;

    const canvas = ov.querySelector('.partage-canvas');
    let theme = initialDark ? 'dark' : 'light';

    try {
      await Promise.all([
        document.fonts.load('700 76px "Amiri"'),
        document.fonts.load('italic 38px "Cormorant Garamond"'),
        document.fonts.load('500 26px "Inter"')
      ]);
    } catch (e) {}

    function paint() { drawCard(canvas, v, theme); }
    paint();

    ov.querySelector('[data-act="theme"]').addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark'; paint();
    });
    ov.querySelector('[data-act="dl"]').addEventListener('click', function () {
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'lavoiedudedans-' + (currentSura ? currentSura.n : '') + '-' + v.n + '.png';
      a.click();
    });
    ov.querySelector('[data-act="share"]').addEventListener('click', function () {
      canvas.toBlob(async function (blob) {
        const file = new File([blob], 'lavoiedudedans.png', { type: 'image/png' });
        const txt = '« ' + (v.trad || '') + ' » — ' + shareAttribution(v) + ' · lavoiedudedans.fr';
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try { await navigator.share({ files: [file], text: txt }); } catch (e) {}
        } else {
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = 'lavoiedudedans-' + v.n + '.png';
          a.click();
        }
      }, 'image/png');
    });
    function close() { ov.remove(); shareOverlay = null; }
    ov.querySelector('.partage-close').addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  }
})();
