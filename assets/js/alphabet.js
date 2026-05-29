/* ============================================================
   Apprendre l'arabe — rendu interactif depuis alphabet.json
   ============================================================ */
(function () {
  var EN = document.documentElement.lang === 'en';
  var grid = document.getElementById('alpha-grid');
  if (!grid) return;
  var detail = document.getElementById('alpha-detail');
  var voy = document.getElementById('voy-grid');
  var lng = document.getElementById('long-grid');
  var sol = document.getElementById('lune-solaires');
  var lun = document.getElementById('lune-lunaires');
  var dechif = document.getElementById('dechif');
  var motsEl = document.getElementById('beaux-mots');

  var T = EN ? {
    sound: 'Sound', example: 'A word that holds it', sun: 'Sun letter', moon: 'Moon letter',
    links: 'Links to the next', nolink: 'Never links forward',
    forms: 'Its four shapes', fIso: 'isolated', fIni: 'initial', fMed: 'medial', fFin: 'final',
    quizTitle: 'Recognise the letter', quizSub: 'Which letter is it?', quizScore: 'Score', quizNext: 'Next letter →', quizGood: 'Yes —', quizBad: 'It was',
    listen: 'Hear the word', listenLetter: 'Hear the letter'
  } : {
    sound: 'Le son', example: 'Un mot qui la porte', sun: 'Lettre solaire', moon: 'Lettre lunaire',
    links: 'Se lie à la suivante', nolink: 'Ne se lie jamais à gauche',
    forms: 'Ses quatre formes', fIso: 'isolée', fIni: 'initiale', fMed: 'médiane', fFin: 'finale',
    quizTitle: 'Reconnais la lettre', quizSub: 'Quelle est cette lettre ?', quizScore: 'Score', quizNext: 'Lettre suivante →', quizGood: 'Oui —', quizBad: 'C’était',
    listen: 'Écouter le mot', listenLetter: 'Écouter la lettre'
  };
  var ZWJ = '‍';
  var HAS_TTS = (typeof window !== 'undefined') && ('speechSynthesis' in window);

  function speak(text) {
    if (!HAS_TTS) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA'; u.rate = 0.8;
      var voices = window.speechSynthesis.getVoices() || [];
      for (var i = 0; i < voices.length; i++) {
        if ((voices[i].lang || '').toLowerCase().indexOf('ar') === 0) { u.voice = voices[i]; break; }
      }
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  fetch('../../data/alphabet.json').then(function (r) { return r.json(); }).then(function (d) {
    // grille
    d.lettres.forEach(function (L, i) {
      var c = document.createElement('button');
      c.type = 'button';
      c.className = 'alpha-cell';
      c.innerHTML = '<span class="alpha-cell__ar" lang="ar" dir="rtl">' + esc(L.ar) + '</span>' +
        '<span class="alpha-cell__tr">' + esc(L.nom) + '</span>';
      c.addEventListener('click', function () {
        grid.querySelectorAll('.alpha-cell').forEach(function (x) { x.classList.remove('is-active'); });
        c.classList.add('is-active');
        showDetail(L);
        detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
      grid.appendChild(c);
      if (i === 0) c.classList.add('is-active');
    });
    if (d.lettres[0]) showDetail(d.lettres[0]);
    setupQuiz(d.lettres);

    // voyelles brèves
    if (voy) d.voyelles.forEach(function (v) {
      var el = document.createElement('div'); el.className = 'voy-cell';
      el.innerHTML = '<div class="voy-cell__ar" lang="ar" dir="rtl">' + esc(v.ar) + '</div>' +
        '<div class="voy-cell__nom">' + esc(v.nom) + ' · <em>' + esc(v.tr) + '</em></div>' +
        '<div class="voy-cell__son">' + esc(v.son) + '</div>';
      voy.appendChild(el);
    });
    // voyelles longues
    if (lng) d.longues.forEach(function (v) {
      var el = document.createElement('div'); el.className = 'voy-cell';
      el.innerHTML = '<div class="voy-cell__ar" lang="ar" dir="rtl">' + esc(v.ar) + '</div>' +
        '<div class="voy-cell__nom"><em>' + esc(v.tr) + '</em></div>' +
        '<div class="voy-cell__son">' + esc(v.son) + '</div>';
      lng.appendChild(el);
    });

    // solaires / lunaires
    if (sol && lun) {
      sol.textContent = d.lettres.filter(function (L) { return L.solaire; }).map(function (L) { return L.ar; }).join(' ');
      lun.textContent = d.lettres.filter(function (L) { return !L.solaire; }).map(function (L) { return L.ar; }).join(' ');
    }

    // déchiffrage
    if (dechif) d.dechiffrage.forEach(function (w) {
      var el = document.createElement('div'); el.className = 'dechif-word';
      var letters = w.lettres.map(function (l) {
        return '<span class="dechif-letter"><span class="dechif-letter__ar" lang="ar" dir="rtl">' + esc(l.ar) + '</span><span class="dechif-letter__tr">' + esc(l.tr) + '</span></span>';
      }).join('');
      el.innerHTML = '<div class="dechif-word__full" lang="ar" dir="rtl">' + esc(w.mot) + '</div>' +
        '<div class="dechif-word__sens"><em>' + esc(w.tr) + '</em> — ' + esc(w.sens) + '</div>' +
        '<div class="dechif-letters">' + letters + '</div>';
      dechif.appendChild(el);
    });

    // jardin de beaux mots — groupés par familles
    if (motsEl && d.mots) {
      var FAM_ORDER = ['lumiere', 'amour', 'coeur', 'voie', 'vertus', 'connaissance', 'pratique', 'reel'];
      var FAM_LABELS = EN ? {
        lumiere: 'Light', amour: 'Love', coeur: 'The heart', voie: 'The way',
        vertus: 'Virtues', connaissance: 'Knowing', pratique: 'Practice', reel: 'The Real',
        autres: 'Others'
      } : {
        lumiere: 'Lumière', amour: 'Amour', coeur: 'Le cœur', voie: 'La voie',
        vertus: 'Vertus', connaissance: 'Connaissance', pratique: 'Pratique', reel: 'Le Réel',
        autres: 'Autres'
      };
      var groups = {};
      d.mots.forEach(function (m) { var k = m.famille || 'autres'; (groups[k] = groups[k] || []).push(m); });
      var order = FAM_ORDER.filter(function (k) { return groups[k]; });
      Object.keys(groups).forEach(function (k) { if (order.indexOf(k) === -1) order.push(k); });
      order.forEach(function (fam) {
        var h = document.createElement('h3'); h.className = 'mots-famille'; h.textContent = FAM_LABELS[fam] || fam;
        motsEl.appendChild(h);
        var g = document.createElement('div'); g.className = 'mots-grid__inner';
        groups[fam].forEach(function (m) {
          var el = document.createElement('div'); el.className = 'mot-card';
          el.innerHTML =
            '<div class="mot-card__ar" lang="ar" dir="rtl">' + esc(m.ar) + '</div>' +
            '<div class="mot-card__tr">' + esc(m.tr) + '</div>' +
            '<div class="mot-card__sens">' + esc(m.sens) + '</div>' +
            '<div class="mot-card__note">' + esc(m.note) + '</div>' +
            (HAS_TTS ? '<button type="button" class="mot-card__say" aria-label="' + esc(T.listen) + '" data-say="' + esc(m.ar) + '">🔊</button>' : '');
          var b = el.querySelector('.mot-card__say');
          if (b) b.addEventListener('click', function () { speak(b.getAttribute('data-say')); });
          var ar = el.querySelector('.mot-card__ar');
          if (ar && HAS_TTS) { ar.style.cursor = 'pointer'; ar.addEventListener('click', function () { speak(m.ar); }); }
          g.appendChild(el);
        });
        motsEl.appendChild(g);
      });
    }
  });

  function showDetail(L) {
    if (!detail) return;
    var badges = '<span class="alpha-badge">' + (L.solaire ? T.sun : T.moon) + '</span>' +
      '<span class="alpha-badge">' + (L.connecte ? T.links : T.nolink) + '</span>';
    detail.hidden = false;
    detail.innerHTML =
      '<div class="alpha-detail__ar" lang="ar" dir="rtl">' + esc(L.ar) + '</div>' +
      '<div class="alpha-detail__nom">' + esc(L.nom) + '</div>' +
      '<div class="alpha-detail__tr">' + esc(L.tr) + '</div>' +
      '<div class="alpha-badges">' + badges + '</div>' +
      '<div class="alpha-detail__son">' + esc(L.son) + '</div>' +
      '<div class="alpha-forms">' +
        '<div class="alpha-forms__label">' + T.forms + '</div>' +
        '<div class="alpha-forms__row" lang="ar" dir="rtl">' +
          formCell(T.fIso, L.ar) +
          formCell(T.fIni, L.ar + ZWJ) +
          formCell(T.fMed, ZWJ + L.ar + ZWJ) +
          formCell(T.fFin, ZWJ + L.ar) +
        '</div>' +
      '</div>' +
      '<div class="alpha-ex">' +
        '<div class="alpha-ex__label">' + T.example + '</div>' +
        '<div class="alpha-ex__mot" lang="ar" dir="rtl">' + esc(L.exemple.mot) + '</div>' +
        '<div class="alpha-ex__tr">' + esc(L.exemple.tr) + '</div>' +
        '<div class="alpha-ex__sens">' + esc(L.exemple.sens) + '</div>' +
        (HAS_TTS ? '<button type="button" class="alpha-listen" data-say="' + esc(L.exemple.mot) + '">🔊 ' + T.listen + '</button>' : '') +
      '</div>';
    var btn = detail.querySelector('.alpha-listen');
    if (btn) btn.addEventListener('click', function () { speak(btn.getAttribute('data-say')); });
    var big = detail.querySelector('.alpha-detail__ar');
    if (big && HAS_TTS) { big.classList.add('is-sayable'); big.addEventListener('click', function () { speak(L.exemple.mot); }); }
  }

  function formCell(label, glyph) {
    return '<span class="alpha-form"><span class="alpha-form__ar">' + esc(glyph) + '</span>' +
      '<span class="alpha-form__lab">' + esc(label) + '</span></span>';
  }

  // ---- petit jeu : reconnais la lettre ----
  function setupQuiz(lettres) {
    var mount = document.getElementById('alpha-quiz');
    if (!mount) return;
    var score = 0, asked = 0, seed = 7;
    function rnd(n) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; }
    function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
    function round() {
      var target = lettres[rnd(lettres.length)];
      var opts = [target];
      while (opts.length < 4) { var c = lettres[rnd(lettres.length)]; if (opts.indexOf(c) === -1) opts.push(c); }
      shuffle(opts);
      mount.innerHTML =
        '<div class="quiz-score">' + T.quizScore + ' : ' + score + ' / ' + asked + '</div>' +
        '<div class="quiz-prompt">' + T.quizSub + '</div>' +
        '<div class="quiz-glyph" lang="ar" dir="rtl">' + esc(target.ar) + '</div>' +
        '<div class="quiz-opts"></div>' +
        '<div class="quiz-feedback" aria-live="polite"></div>';
      var optsEl = mount.querySelector('.quiz-opts');
      var fb = mount.querySelector('.quiz-feedback');
      opts.forEach(function (o) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'quiz-opt'; b.textContent = o.nom;
        b.addEventListener('click', function () {
          if (mount.dataset.done) return;
          mount.dataset.done = '1';
          asked++;
          optsEl.querySelectorAll('.quiz-opt').forEach(function (x) { x.disabled = true; });
          if (o === target) { score++; b.classList.add('is-good'); fb.textContent = T.quizGood + ' ' + target.nom; }
          else {
            b.classList.add('is-bad'); fb.textContent = T.quizBad + ' ' + target.nom;
            optsEl.querySelectorAll('.quiz-opt').forEach(function (x) { if (x.textContent === target.nom) x.classList.add('is-good'); });
          }
          var nx = document.createElement('button');
          nx.type = 'button'; nx.className = 'quiz-next'; nx.textContent = T.quizNext;
          nx.addEventListener('click', function () { delete mount.dataset.done; round(); });
          fb.appendChild(document.createElement('br'));
          fb.appendChild(nx);
        });
        optsEl.appendChild(b);
      });
    }
    round();
  }
})();
