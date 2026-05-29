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
    ? { eyebrow: 'The word offered', invite: 'A word is offered to you today.', tap: 'Touch to reveal it',
        meditate: 'To meditate', share: 'Offer', deeper: 'Go further →' }
    : { eyebrow: 'Le mot offert', invite: 'Un mot vous est offert aujourd’hui.', tap: 'Touchez pour le découvrir',
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

    var sendIcon = '<svg class="mdj-send-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M23 3.4c-6.5.5-11.4 3.4-14.8 8.8 1.7-1.1 3.6-1.8 5.8-2-2.8 1.9-4.8 4.6-6.1 8-.5 1.2-.9 2.5-1.1 3.9 1.9-3.2 4.3-5.3 7.1-6.4-.7 1.3-1.2 2.8-1.4 4.3 3.1-3 5.3-6.5 6.6-10.8.5-1.6 1.2-3.6 3.9-5.8z"/></svg>';

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
      // On envoie le LIEN (avec le mot choisi) pour garder la surprise de l'ouverture
      var url = location.origin + location.pathname + '?id=' + encodeURIComponent(mot.id);
      var teaser = EN ? 'A word awaits you — open it 🕊' : 'Un mot t’attend — ouvre-le 🕊';
      var title = EN ? 'A word offered to you' : 'Un mot t’est offert';
      if (navigator.share) {
        navigator.share({ title: title, text: teaser, url: url }).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(teaser + ' ' + url).then(function () {
          var b = mount.querySelector('[data-mdj-share]');
          var old = b.innerHTML;
          b.innerHTML = (EN ? 'Link copied ✓' : 'Lien copié ✓');
          setTimeout(function () { b.innerHTML = old; }, 1800);
        });
      } else {
        window.prompt(EN ? 'Copy this link:' : 'Copiez ce lien :', url);
      }
    });
  }
})();
