/* Tirage au hasard d'un Nom — 99 Noms */
(function () {
  var mount = document.getElementById('nd-tirage-card');
  var again = document.getElementById('nd-tirage-again');
  if (!mount) return;
  var EN = document.documentElement.lang === 'en';
  var URL = EN ? '/en/data/noms-divins.json' : '/data/noms-divins.json';
  var HAS_TTS = ('speechSynthesis' in window);
  var noms = null;

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function slug(s) { return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  function speak(text) {
    if (!HAS_TTS) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = 'ar-SA'; u.rate = 0.8;
      var vs = window.speechSynthesis.getVoices() || [];
      for (var i = 0; i < vs.length; i++) if ((vs[i].lang || '').toLowerCase().indexOf('ar') === 0) { u.voice = vs[i]; break; }
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function pickAndShow() {
    if (!noms) return;
    var n = noms[Math.floor(Math.random() * noms.length)];
    var step = (EN ? 'Name ' : 'Nom ') + n.n + ' / ' + noms.length;
    var open_lab = EN ? 'Open this Name →' : 'Ouvrir ce Nom →';
    var listen_lab = EN ? 'Listen' : 'Écouter';
    mount.innerHTML =
      '<div class="nd-tirage__step">' + step + '</div>' +
      '<div class="nd-tirage__ar" lang="ar" dir="rtl">' + esc(n.ar) + '</div>' +
      '<div class="nd-tirage__tr">' + esc(n.tr) + '</div>' +
      '<div class="nd-tirage__fr">' + esc(n.fr) + '</div>' +
      '<div class="nd-tirage__short">' + (n.sens_court || '') + '</div>' +
      (HAS_TTS ? '<button type="button" class="nd-nom__listen" id="nd-tirage-listen" style="margin-top:1rem;">🔊 ' + listen_lab + '</button>' : '') +
      '<a class="nd-tirage__link" href="../nom/' + n.n + '-' + slug(n.tr) + '/">' + open_lab + '</a>';
    var b = document.getElementById('nd-tirage-listen');
    if (b) b.addEventListener('click', function () { speak(n.ar); });
  }

  fetch(URL).then(function (r) { return r.json(); }).then(function (d) {
    noms = d.noms;
    pickAndShow();
  });
  if (again) again.addEventListener('click', pickAndShow);
})();
