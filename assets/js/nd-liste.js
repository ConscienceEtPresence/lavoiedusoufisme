/* Liste complète des 99 Noms avec filtre par famille */
(function () {
  var grid = document.getElementById('nd-liste-grid');
  if (!grid) return;
  var EN = document.documentElement.lang === 'en';
  var URL = EN ? '/en/data/noms-divins.json' : '/data/noms-divins.json';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function slug(s) { return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

  fetch(URL).then(function (r) { return r.json(); }).then(function (d) {
    d.noms.forEach(function (n) {
      var a = document.createElement('a');
      a.className = 'nd-liste-card';
      a.setAttribute('data-fam', n.theme);
      a.href = '../nom/' + n.n + '-' + slug(n.tr) + '/';
      a.innerHTML =
        '<span class="nd-liste-card__n">' + n.n + '</span>' +
        '<span class="nd-liste-card__ar" lang="ar" dir="rtl">' + esc(n.ar) + '</span>' +
        '<span class="nd-liste-card__tr">' + esc(n.tr) + '</span>' +
        '<span class="nd-liste-card__fr">' + esc(n.fr) + '</span>';
      grid.appendChild(a);
    });

    var buttons = document.querySelectorAll('.nd-fam-btn');
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        buttons.forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        var fam = b.getAttribute('data-fam');
        grid.querySelectorAll('.nd-liste-card').forEach(function (card) {
          if (fam === 'all' || card.getAttribute('data-fam') === fam) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  });
})();
