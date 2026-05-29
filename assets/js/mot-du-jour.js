/* ============================================================
   Le mot du jour — révélation au toucher (puise dans les mots de l'amour)
   ?id=xxx  → mode cadeau (un mot précis)
   sinon    → le mot du jour (même pour tous, calé sur la date)
   ============================================================ */
(function () {
  var mount = document.getElementById('mdj-mount');
  if (!mount) return;
  var EN = document.documentElement.lang === 'en';
  var T = EN
    ? { eyebrow: 'Word of the day', invite: 'A word is offered to you today.', tap: 'Touch to reveal it',
        meditate: 'To meditate', share: 'Offer', deeper: 'Go further →' }
    : { eyebrow: 'Le mot du jour', invite: 'Un mot vous est offert aujourd’hui.', tap: 'Touchez pour le découvrir',
        meditate: 'À méditer', share: 'Offrir', deeper: 'Aller plus loin →' };

  var STAR = '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">' +
    '<rect x="22" y="22" width="56" height="56" />' +
    '<rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" />' +
    '<circle cx="50" cy="50" r="10" /></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function ensurePartage(cb) {
    if (window.LVDDPartage) { cb(); return; }
    var s = document.querySelector('script[data-partage-js]');
    if (!s) {
      s = document.createElement('script');
      s.src = '../../assets/js/partage.js?v=1';
      s.dataset.partageJs = '1';
      document.head.appendChild(s);
    }
    s.addEventListener('load', function () { if (window.LVDDPartage) cb(); });
  }

  fetch('../../data/amour.json')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var mots = (d && d.mots) || [];
      if (!mots.length) { mount.innerHTML = '<p style="text-align:center;color:#888">—</p>'; return; }
      var id = new URLSearchParams(location.search).get('id');
      var mot = id ? mots.filter(function (m) { return m.id === id; })[0] : null;
      if (!mot) {
        var day = Math.floor(Date.now() / 86400000);
        mot = mots[day % mots.length];
      }
      render(mot);
    })
    .catch(function () { mount.innerHTML = '<p style="text-align:center;color:#888">—</p>'; });

  function render(mot) {
    // texte d'accompagnement nourri : la prose du mot (description/ouverture) ...
    var prose = mot.description || mot.ouverture || '';
    prose = String(prose).split(/\n\n/).slice(0, 2).join(' ');
    // ... et la question à méditer, mise en valeur à part
    var question = mot.meditation || '';

    var section = '';
    if (prose || question) {
      section = '<div class="mdj-section"><span class="mdj-label">' + T.meditate + '</span>' +
        (prose ? '<p>' + prose + '</p>' : '') +
        (question ? '<p class="mdj-question">' + esc(question) + '</p>' : '') +
        '</div>';
    }

    var sendIcon = '<svg class="mdj-send-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">' +
      '<path d="M21.5 2.5 L11 13" /><path d="M21.5 2.5 L15 21 L11 13 L3 9 z" /></svg>';

    mount.innerHTML =
      '<div class="mdj-veil" id="mdj-veil">' +
        '<div class="mdj-star">' + STAR + '</div>' +
        '<p class="mdj-invite">' + T.invite + '</p>' +
        '<p class="mdj-tap">' + T.tap + '</p>' +
      '</div>' +
      '<article class="mdj-card" id="mdj-card" hidden>' +
        '<div class="mdj-eyebrow">' + T.eyebrow + '</div>' +
        '<div class="mdj-ar" lang="ar" dir="rtl">' + esc(mot.ar) + '</div>' +
        '<div class="mdj-tr">' + esc(mot.translit) + '</div>' +
        '<div class="mdj-rule"></div>' +
        '<p class="mdj-def">' + esc(mot.definition) + '</p>' +
        section +
        '<div class="mdj-actions">' +
          '<button type="button" class="mdj-btn mdj-btn--gold" data-mdj-share>' + sendIcon + ' ' + T.share + '</button>' +
          '<a class="mdj-btn" href="../amour/mot.html?id=' + encodeURIComponent(mot.id) + '">' + T.deeper + '</a>' +
        '</div>' +
      '</article>';

    var veil = document.getElementById('mdj-veil');
    var card = document.getElementById('mdj-card');
    veil.addEventListener('click', function () {
      veil.classList.add('is-gone');
      setTimeout(function () { veil.style.display = 'none'; card.hidden = false; }, 900);
    });

    mount.querySelector('[data-mdj-share]').addEventListener('click', function () {
      ensurePartage(function () {
        window.LVDDPartage.open({
          ar: mot.ar, tr: mot.translit, text: mot.definition,
          attribution: (EN ? 'Word of the day · lavoiedudedans.fr' : 'Le mot du jour · lavoiedudedans.fr')
        });
      });
    });
  }
})();
