/* ============================================================
   Un mot de la voie — recevoir (pour soi) ou offrir (à un ami)
   Pool mélangé : mots de l'amour + sagesses (paraboles, contes, sagesses).
   États (via l'URL) :
     ?id=xxx     → RÉCEPTION : un ami vous offre cet item (à découvrir)
     ?mode=offrir→ OFFRIR : tirer puis envoyer le lien
     ?mode=jour  → POUR SOI : l'item du jour
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
    draw: 'Draw', redraw: 'Draw another', sendGift: 'Send this gift',
    deeper: 'Go further →', yourTurn: 'In turn, offer a word →',
    teaser: 'A word awaits you — open it', giftTitle: 'A word for you', copied: 'Link copied ✓'
  } : {
    landingTitle: 'Un mot de la voie', landingSub: 'Pour vous, ou à offrir.',
    doorReceive: 'Recevoir mon mot du jour', doorReceiveSub: 'Un mot à méditer, aujourd’hui.',
    doorOffer: 'Offrir un mot à quelqu’un', doorOfferSub: 'Un petit cadeau à envoyer.',
    selfEyebrow: 'Votre mot du jour', selfInvite: 'Un mot vous est offert aujourd’hui.',
    recvEyebrow: 'Un mot vous est offert', recvInvite: 'Quelqu’un vous offre un mot.',
    tap: 'Touchez pour le découvrir', meditate: 'À méditer',
    offerTitle: 'Offrir un mot', offerSub: 'Tirez, puis envoyez. La personne le découvrira en l’ouvrant.',
    draw: 'Tirer', redraw: 'Tirer un autre', sendGift: 'Envoyer ce cadeau',
    deeper: 'Aller plus loin →', yourTurn: 'À votre tour, offrir un mot →',
    teaser: 'Un mot t’attend — ouvre-le', giftTitle: 'Un mot t’est offert', copied: 'Lien copié ✓'
  };

  var STAR = '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">' +
    '<rect x="22" y="22" width="56" height="56" /><rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" /><circle cx="50" cy="50" r="10" /></svg>';
  var DOVE = '<svg class="mdj-dove" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 16.5c4.6 1.1 8.8-.3 12.4-4.1.9-1 1.8-2.3 3.2-2.3.8 0 1.4.6 1.4 1.4 0 .9-.7 1.5-1.6 1.7 1.7.4 3.4-.2 4.9-1.5-.4 2.1-1.8 3.8-3.8 4.6 1.1.3 2.2.2 3.3-.3-1.3 1.7-3.2 2.8-5.4 3 .2 1.2.6 2.3 1.4 3.2-2.2-.5-3.8-2-4.6-4.1-3 .7-6 .3-8.8-1.1.9-.2 1.8-.6 2.5-1.2-1.6-.4-2.9-1.5-3.4-3z"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // ----- corps de carte selon le type -----
  function bodyHTML(it) {
    if (it.type === 'mot') {
      var med = '';
      var prose = String(it.prose || '').split(/\n\n/).slice(0, 2).join(' ');
      if (prose || it.question) {
        med = '<div class="mdj-section"><span class="mdj-label">' + T.meditate + '</span>' +
          (prose ? '<p>' + esc(prose) + '</p>' : '') +
          (it.question ? '<p class="mdj-question">' + esc(it.question) + '</p>' : '') + '</div>';
      }
      return '<div class="mdj-ar" lang="ar" dir="rtl">' + esc(it.ar) + '</div>' +
        '<div class="mdj-tr">' + esc(it.tr) + '</div>' +
        '<div class="mdj-rule"></div>' +
        '<p class="mdj-def">' + esc(it.def) + '</p>' + med;
    }
    // sagesse / parabole / conte
    return (it.titre ? '<div class="mdj-sagesse-titre">' + esc(it.titre) + '</div>' : '') +
      '<p class="mdj-sagesse-texte">' + esc(it.texte) + '</p>' +
      '<div class="mdj-source">— ' + esc(it.source) + '</div>' +
      '<div class="mdj-rule"></div>' +
      '<div class="mdj-section"><span class="mdj-label">' + T.meditate + '</span><p>' + esc(it.commentaire) + '</p></div>';
  }

  function footerHTML(it, mode) {
    var f = '';
    if (it.type === 'mot' && it.deeper) f += '<a class="mdj-btn" href="' + it.deeper + '">' + T.deeper + '</a>';
    if (mode === 'jour') f += '<a class="mdj-btn" href="?mode=offrir">' + T.doorOffer + ' →</a>';
    else if (mode === 'recv') f += '<a class="mdj-btn" href="?mode=offrir">' + T.yourTurn + '</a>';
    return f;
  }

  function revealView(it, eyebrow, invite, mode) {
    mount.innerHTML =
      '<div class="mdj-veil" id="mdj-veil"><div class="mdj-star">' + STAR + '</div>' +
        '<p class="mdj-invite">' + invite + '</p><p class="mdj-tap">' + T.tap + '</p></div>' +
      '<article class="mdj-card" id="mdj-card" hidden><div class="mdj-eyebrow">' + eyebrow + '</div>' +
        bodyHTML(it) + '<div class="mdj-actions">' + footerHTML(it, mode) + '</div></article>';
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
    } else { window.prompt(EN ? 'Copy this link:' : 'Copiez ce lien :', url); }
  }

  function landingView() {
    mount.innerHTML =
      '<div class="mdj-landing"><h1 class="mdj-landing__title">' + T.landingTitle + '</h1>' +
        '<p class="mdj-landing__sub">' + T.landingSub + '</p>' +
        '<div class="mdj-doors">' +
          '<a class="mdj-door" href="?mode=jour"><div class="mdj-door__icon">' + STAR + '</div>' +
            '<span class="mdj-door__title">' + T.doorReceive + '</span><span class="mdj-door__sub">' + T.doorReceiveSub + '</span></a>' +
          '<a class="mdj-door" href="?mode=offrir"><div class="mdj-door__icon">' + DOVE + '</div>' +
            '<span class="mdj-door__title">' + T.doorOffer + '</span><span class="mdj-door__sub">' + T.doorOfferSub + '</span></a>' +
        '</div></div>';
  }

  function offerBodyShort(it) {
    if (it.type === 'mot') {
      return '<div class="mdj-ar" lang="ar" dir="rtl">' + esc(it.ar) + '</div>' +
        '<div class="mdj-tr">' + esc(it.tr) + '</div>' +
        '<p class="mdj-def">' + esc(it.def) + '</p>';
    }
    return (it.titre ? '<div class="mdj-sagesse-titre">' + esc(it.titre) + '</div>' : '') +
      '<p class="mdj-sagesse-texte">' + esc(it.texte) + '</p>' +
      '<div class="mdj-source">— ' + esc(it.source) + '</div>';
  }

  function offerView(pool) {
    mount.innerHTML =
      '<div class="mdj-offer"><div class="mdj-eyebrow">' + T.offerTitle + '</div>' +
        '<p class="mdj-offer-sub">' + T.offerSub + '</p>' +
        '<div class="mdj-dove-big">' + DOVE + '</div>' +
        '<button type="button" class="mdj-btn mdj-btn--gold" id="mdj-draw">' + T.draw + '</button>' +
        '<div id="mdj-drawn"></div></div>';
    document.getElementById('mdj-draw').addEventListener('click', function () { drawAndShow(pool); });
  }

  function drawAndShow(pool) {
    var it = pool[Math.floor(Math.random() * pool.length)];
    var url = location.origin + location.pathname + '?id=' + encodeURIComponent(it.id);
    var box = document.getElementById('mdj-drawn');
    box.innerHTML =
      '<article class="mdj-card mdj-card--offer">' + offerBodyShort(it) +
        '<div class="mdj-actions">' +
          '<button type="button" class="mdj-btn mdj-btn--gold" id="mdj-send">' + DOVE + ' ' + T.sendGift + '</button>' +
          '<button type="button" class="mdj-btn" id="mdj-redraw">' + T.redraw + '</button>' +
        '</div></article>';
    var sendBtn = document.getElementById('mdj-send');
    sendBtn.addEventListener('click', function () { shareLink(url, sendBtn); });
    document.getElementById('mdj-redraw').addEventListener('click', function () { drawAndShow(pool); });
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function buildPool(amour, sg) {
    var pool = [];
    ((amour && amour.mots) || []).forEach(function (m) {
      pool.push({ id: m.id, type: 'mot', ar: m.ar, tr: m.translit, def: m.definition,
        prose: (m.description || m.ouverture || ''), question: (m.meditation || ''),
        deeper: '../amour/mot.html?id=' + encodeURIComponent(m.id) });
    });
    ((sg && sg.sagesses) || []).forEach(function (s) {
      pool.push({ id: 'sag-' + s.id, type: 'sagesse', titre: s.titre, texte: s.texte, source: s.source, commentaire: s.commentaire });
    });
    return pool;
  }

  Promise.all([
    fetch('../../data/amour.json').then(function (r) { return r.json(); }).catch(function () { return null; }),
    fetch('../../data/sagesses.json').then(function (r) { return r.json(); }).catch(function () { return null; })
  ]).then(function (res) {
    var pool = buildPool(res[0], res[1]);
    if (!pool.length) { mount.innerHTML = '<p style="text-align:center;color:#888">—</p>'; return; }
    var params = new URLSearchParams(location.search);
    var id = params.get('id');
    var mode = params.get('mode');

    if (id) {
      var gift = pool.filter(function (x) { return x.id === id; })[0] || pool[0];
      revealView(gift, T.recvEyebrow, T.recvInvite, 'recv');
    } else if (mode === 'offrir') {
      offerView(pool);
    } else if (mode === 'jour') {
      var day = Math.floor(Date.now() / 86400000);
      revealView(pool[day % pool.length], T.selfEyebrow, T.selfInvite, 'jour');
    } else {
      landingView();
    }
  });
})();
