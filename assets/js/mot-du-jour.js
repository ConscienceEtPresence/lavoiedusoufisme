/* ============================================================
   Un mot de la voie — recevoir (pour soi) ou offrir (à un ami)
   États (via l'URL) :
     ?id=xxx     → RÉCEPTION : un ami vous offre ce mot (à découvrir)
     ?mode=offrir→ OFFRIR : tirer un mot et l'envoyer
     ?mode=jour  → POUR SOI : le mot du jour
     (rien)      → ACCUEIL : deux portes
   ============================================================ */
(function () {
  var mount = document.getElementById('mdj-mount');
  if (!mount) return;
  var EN = document.documentElement.lang === 'en';

  var T = EN ? {
    landingTitle: 'A word from the path', landingSub: 'For you, or to offer.',
    doorReceive: 'Receive my word of the day', doorReceiveSub: 'A word to meditate, today.',
    doorOffer: 'Offer a word to someone', doorOfferSub: 'A little gift to send.',
    selfEyebrow: 'Your word of the day', selfInvite: 'A word is offered to you today.',
    recvEyebrow: 'A word is offered to you', recvInvite: 'Someone offers you a word.',
    tap: 'Touch to reveal it', meditate: 'To meditate',
    offerTitle: 'Offer a word', offerSub: 'Draw a word, then send it. The person will discover it on opening.',
    draw: 'Draw a word', redraw: 'Draw another', sendGift: 'Send this gift',
    deeper: 'Go further →', yourTurn: 'In turn, offer a word →', teaser: 'A word awaits you — open it', giftTitle: 'A word for you', copied: 'Link copied ✓'
  } : {
    landingTitle: 'Un mot de la voie', landingSub: 'Pour vous, ou à offrir.',
    doorReceive: 'Recevoir mon mot du jour', doorReceiveSub: 'Un mot à méditer, aujourd’hui.',
    doorOffer: 'Offrir un mot à quelqu’un', doorOfferSub: 'Un petit cadeau à envoyer.',
    selfEyebrow: 'Votre mot du jour', selfInvite: 'Un mot vous est offert aujourd’hui.',
    recvEyebrow: 'Un mot vous est offert', recvInvite: 'Quelqu’un vous offre un mot.',
    tap: 'Touchez pour le découvrir', meditate: 'À méditer',
    offerTitle: 'Offrir un mot', offerSub: 'Tirez un mot, puis envoyez-le. La personne le découvrira en l’ouvrant.',
    draw: 'Tirer un mot', redraw: 'Tirer un autre', sendGift: 'Envoyer ce cadeau',
    deeper: 'Aller plus loin →', yourTurn: 'À votre tour, offrir un mot →', teaser: 'Un mot t’attend — ouvre-le', giftTitle: 'Un mot t’est offert', copied: 'Lien copié ✓'
  };

  var STAR = '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">' +
    '<rect x="22" y="22" width="56" height="56" /><rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" /><circle cx="50" cy="50" r="10" /></svg>';

  var DOVE = '<svg class="mdj-dove" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 16.5c4.6 1.1 8.8-.3 12.4-4.1.9-1 1.8-2.3 3.2-2.3.8 0 1.4.6 1.4 1.4 0 .9-.7 1.5-1.6 1.7 1.7.4 3.4-.2 4.9-1.5-.4 2.1-1.8 3.8-3.8 4.6 1.1.3 2.2.2 3.3-.3-1.3 1.7-3.2 2.8-5.4 3 .2 1.2.6 2.3 1.4 3.2-2.2-.5-3.8-2-4.6-4.1-3 .7-6 .3-8.8-1.1.9-.2 1.8-.6 2.5-1.2-1.6-.4-2.9-1.5-3.4-3z"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function meditationOf(mot) {
    var prose = mot.description || mot.ouverture || '';
    prose = String(prose).split(/\n\n/).slice(0, 2).join(' ');
    var q = mot.meditation || '';
    if (!prose && !q) return '';
    return '<div class="mdj-section"><span class="mdj-label">' + T.meditate + '</span>' +
      (prose ? '<p>' + prose + '</p>' : '') +
      (q ? '<p class="mdj-question">' + esc(q) + '</p>' : '') + '</div>';
  }

  function cardHTML(mot, eyebrow, footer) {
    return '<article class="mdj-card" id="mdj-card" hidden>' +
      '<div class="mdj-eyebrow">' + eyebrow + '</div>' +
      '<div class="mdj-ar" lang="ar" dir="rtl">' + esc(mot.ar) + '</div>' +
      '<div class="mdj-tr">' + esc(mot.translit) + '</div>' +
      '<div class="mdj-rule"></div>' +
      '<p class="mdj-def">' + esc(mot.definition) + '</p>' +
      meditationOf(mot) +
      '<div class="mdj-actions">' + footer + '</div>' +
    '</article>';
  }

  function revealView(mot, eyebrow, invite, footer) {
    mount.innerHTML =
      '<div class="mdj-veil" id="mdj-veil"><div class="mdj-star">' + STAR + '</div>' +
        '<p class="mdj-invite">' + invite + '</p><p class="mdj-tap">' + T.tap + '</p></div>' +
      cardHTML(mot, eyebrow, footer);
    var veil = document.getElementById('mdj-veil'), card = document.getElementById('mdj-card');
    veil.addEventListener('click', function () {
      veil.classList.add('is-gone');
      setTimeout(function () { veil.style.display = 'none'; card.hidden = false; }, 900);
    });
  }

  function shareLink(url, btn) {
    if (navigator.share) {
      navigator.share({ title: T.giftTitle, text: T.teaser + ' 🕊', url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(T.teaser + ' ' + url).then(function () {
        if (btn) { var o = btn.innerHTML; btn.innerHTML = T.copied; setTimeout(function () { btn.innerHTML = o; }, 1800); }
      });
    } else {
      window.prompt(EN ? 'Copy this link:' : 'Copiez ce lien :', url);
    }
  }

  function deeperLink(mot) { return '<a class="mdj-btn" href="../amour/mot.html?id=' + encodeURIComponent(mot.id) + '">' + T.deeper + '</a>'; }
  function offerLink() { return '<a class="mdj-btn" href="?mode=offrir">' + T.yourTurn + '</a>'; }

  // ----- ACCUEIL : deux portes -----
  function landingView() {
    mount.innerHTML =
      '<div class="mdj-landing">' +
        '<h1 class="mdj-landing__title">' + T.landingTitle + '</h1>' +
        '<p class="mdj-landing__sub">' + T.landingSub + '</p>' +
        '<div class="mdj-doors">' +
          '<a class="mdj-door" href="?mode=jour"><div class="mdj-door__icon">' + STAR + '</div>' +
            '<span class="mdj-door__title">' + T.doorReceive + '</span>' +
            '<span class="mdj-door__sub">' + T.doorReceiveSub + '</span></a>' +
          '<a class="mdj-door" href="?mode=offrir"><div class="mdj-door__icon">' + DOVE + '</div>' +
            '<span class="mdj-door__title">' + T.doorOffer + '</span>' +
            '<span class="mdj-door__sub">' + T.doorOfferSub + '</span></a>' +
        '</div>' +
      '</div>';
  }

  // ----- OFFRIR : tirer puis envoyer -----
  function offerView(mots) {
    mount.innerHTML =
      '<div class="mdj-offer">' +
        '<div class="mdj-eyebrow">' + T.offerTitle + '</div>' +
        '<p class="mdj-offer-sub">' + T.offerSub + '</p>' +
        '<div class="mdj-dove-big">' + DOVE + '</div>' +
        '<button type="button" class="mdj-btn mdj-btn--gold" id="mdj-draw">' + T.draw + '</button>' +
        '<div id="mdj-drawn"></div>' +
      '</div>';
    document.getElementById('mdj-draw').addEventListener('click', function () { drawAndShow(mots); });
  }

  function drawAndShow(mots) {
    var mot = mots[Math.floor(Math.random() * mots.length)];
    var url = location.origin + location.pathname + '?id=' + encodeURIComponent(mot.id);
    var box = document.getElementById('mdj-drawn');
    box.innerHTML =
      '<article class="mdj-card mdj-card--offer">' +
        '<div class="mdj-ar" lang="ar" dir="rtl">' + esc(mot.ar) + '</div>' +
        '<div class="mdj-tr">' + esc(mot.translit) + '</div>' +
        '<p class="mdj-def">' + esc(mot.definition) + '</p>' +
        '<div class="mdj-actions">' +
          '<button type="button" class="mdj-btn mdj-btn--gold" id="mdj-send">' + DOVE + ' ' + T.sendGift + '</button>' +
          '<button type="button" class="mdj-btn" id="mdj-redraw">' + T.redraw + '</button>' +
        '</div>' +
      '</article>';
    var sendBtn = document.getElementById('mdj-send');
    sendBtn.addEventListener('click', function () { shareLink(url, sendBtn); });
    document.getElementById('mdj-redraw').addEventListener('click', function () { drawAndShow(mots); });
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function ensureReady(cb) { cb(); }

  fetch('../../data/amour.json')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var mots = (d && d.mots) || [];
      if (!mots.length) { mount.innerHTML = '<p style="text-align:center;color:#888">—</p>'; return; }
      var params = new URLSearchParams(location.search);
      var id = params.get('id');
      var mode = params.get('mode');

      if (id) {
        var gift = mots.filter(function (m) { return m.id === id; })[0];
        if (!gift) gift = mots[0];
        revealView(gift, T.recvEyebrow, T.recvInvite, deeperLink(gift) + offerLink());
      } else if (mode === 'offrir') {
        offerView(mots);
      } else if (mode === 'jour') {
        var day = Math.floor(Date.now() / 86400000);
        var mot = mots[day % mots.length];
        revealView(mot, T.selfEyebrow, T.selfInvite, deeperLink(mot) + '<a class="mdj-btn" href="?mode=offrir">' + T.doorOffer + ' →</a>');
      } else {
        landingView();
      }
    })
    .catch(function () { mount.innerHTML = '<p style="text-align:center;color:#888">—</p>'; });
})();
