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

  var T = EN ? {
    sound: 'Sound', example: 'A word that holds it', sun: 'Sun letter', moon: 'Moon letter',
    links: 'Links to the next', nolink: 'Never links forward'
  } : {
    sound: 'Le son', example: 'Un mot qui la porte', sun: 'Lettre solaire', moon: 'Lettre lunaire',
    links: 'Se lie à la suivante', nolink: 'Ne se lie jamais à gauche'
  };

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
      '<div class="alpha-ex">' +
        '<div class="alpha-ex__label">' + T.example + '</div>' +
        '<div class="alpha-ex__mot" lang="ar" dir="rtl">' + esc(L.exemple.mot) + '</div>' +
        '<div class="alpha-ex__tr">' + esc(L.exemple.tr) + '</div>' +
        '<div class="alpha-ex__sens">' + esc(L.exemple.sens) + '</div>' +
      '</div>';
  }
})();
