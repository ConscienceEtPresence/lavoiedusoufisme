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

  // ----- l'heure du jour colore le fond -----
  (function setTimeOfDay() {
    var h = new Date().getHours();
    var cls = 'mdj-time-day';
    if (h >= 5 && h < 8)       cls = 'mdj-time-dawn';
    else if (h >= 8 && h < 17) cls = 'mdj-time-day';
    else if (h >= 17 && h < 21) cls = 'mdj-time-dusk';
    else                        cls = 'mdj-time-night';
    document.body.classList.add(cls);
    // ciel d'étoiles
    if (!document.querySelector('.mdj-sky')) {
      var sky = document.createElement('div');
      sky.className = 'mdj-sky';
      sky.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(sky, document.body.firstChild);
    }
  })();

  var T = EN ? {
    landingTitle: 'A word from the path', landingSub: 'For you, or to offer.',
    doorReceive: 'Receive my word of the day', doorReceiveSub: 'A word to meditate, today.',
    doorOffer: 'Offer a word to someone', doorOfferSub: 'A little gift to send.',
    selfEyebrow: 'Your word of the day', selfInvite: 'A word is offered to you today.',
    recvEyebrow: 'A word offered', recvInvite: 'Someone offers you a few words.',
    tap: 'Touch to open', meditate: 'To meditate',
    offerTitle: 'Offer a word', offerSub: 'Draw a word, then send it. The person will discover it on opening.',
    draw: 'Draw', redraw: 'Draw another', sendGift: 'Send this gift',
    deeper: 'Go further →', yourTurn: 'In turn, offer a word →',
    anotherWord: 'Another word ✦', anotherEyebrow: 'Another word for you', anotherInvite: 'Another word comes to you.',
    teaser: 'A word awaits you — open it', giftTitle: 'A word for you', copied: 'Link copied ✓',
    intentionTitle: 'For whom — for what?', intentionAll: 'At random', intentionSouffre: 'Someone in pain', intentionPaix: 'Seeking peace', intentionDoute: 'In doubt', intentionEveil: 'Awakening', intentionJoie: 'In joy',
    breathe: 'Breathe. Think of the person. Touch when ready.',
    sent: 'The word has taken flight.',
    offerBack: 'Offer a word in return',
    goFurther: 'Continue along the way →',
    teasers: ['A word awaits you — open it', 'A lamp for your evening', 'For you, in the hollow of this hour', 'A word that passes through me to you', 'A faint light from afar', 'To inhabit this moment', 'A gentle sign', 'A light door to push', 'Open it when the moment comes'],
    saveImage: 'Keep as an image ✦', exit: 'Exit'
  } : {
    landingTitle: 'Un mot de la voie', landingSub: 'Pour vous, ou à offrir.',
    doorReceive: 'Recevoir mon mot du jour', doorReceiveSub: 'Un mot à méditer, aujourd’hui.',
    doorOffer: 'Offrir un mot à quelqu’un', doorOfferSub: 'Un petit cadeau à envoyer.',
    selfEyebrow: 'Votre mot du jour', selfInvite: 'Une parole vous est offerte aujourd’hui.',
    recvEyebrow: 'Une parole offerte', recvInvite: 'Quelqu’un vous offre une parole.',
    tap: 'Touchez pour ouvrir', meditate: 'À méditer',
    offerTitle: 'Offrir un mot', offerSub: 'Tirez, puis envoyez. La personne le découvrira en l’ouvrant.',
    draw: 'Tirer', redraw: 'Tirer un autre', sendGift: 'Envoyer ce cadeau',
    deeper: 'Aller plus loin →', yourTurn: 'À votre tour, offrir un mot →',
    anotherWord: 'Un autre mot ✦', anotherEyebrow: 'Un autre mot pour vous', anotherInvite: 'Un autre mot vient à vous.',
    teaser: 'Un mot t’attend — ouvre-le', giftTitle: 'Un mot t’est offert', copied: 'Lien copié ✓',
    intentionTitle: 'Pour qui — pour quoi ?', intentionAll: 'Au hasard', intentionSouffre: 'Quelqu’un qui souffre', intentionPaix: 'En quête de paix', intentionDoute: 'Dans le doute', intentionEveil: 'En éveil', intentionJoie: 'Dans la joie',
    breathe: 'Respirez. Pensez à la personne. Touchez quand vous êtes prêt(e).',
    sent: 'Le mot a pris son envol.',
    offerBack: 'Offrir un mot en retour',
    goFurther: 'Continuer le chemin →',
    teasers: ['Un mot t’attend — ouvre-le', 'Une lampe pour ton soir', 'Pour toi, dans le creux de cette heure', 'Une parole qui passe par moi pour toi', 'Un éclat venu de loin', 'Pour habiter l’instant', 'Un signe doux', 'Une porte légère, à pousser', 'À ouvrir quand le moment vient'],
    saveImage: 'Garder en image ✦', exit: 'Sortir'
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
          (prose ? '<p>' + prose + '</p>' : '') +
          (it.question ? '<p class="mdj-question">' + it.question + '</p>' : '') + '</div>';
      }
      return '<div class="mdj-ar" lang="ar" dir="rtl">' + esc(it.ar) + '</div>' +
        '<div class="mdj-tr">' + esc(it.tr) + '</div>' +
        '<div class="mdj-rule"></div>' +
        '<p class="mdj-def">' + esc(it.def) + '</p>' + med;
    }
    // sagesse / parabole / conte (texte & commentaire peuvent contenir <em>)
    return (it.titre ? '<div class="mdj-sagesse-titre">' + esc(it.titre) + '</div>' : '') +
      '<p class="mdj-sagesse-texte">' + it.texte + '</p>' +
      '<div class="mdj-source">— ' + esc(it.source) + '</div>' +
      '<div class="mdj-rule"></div>' +
      '<div class="mdj-section"><span class="mdj-label">' + T.meditate + '</span><p>' + it.commentaire + '</p></div>';
  }

  function footerHTML(it, mode) {
    var f = '';
    if (it.type === 'mot' && it.deeper) f += '<a class="mdj-btn" href="' + it.deeper + '">' + T.deeper + '</a>';
    if (mode === 'jour' || mode === 'encore') {
      f += '<a class="mdj-btn mdj-btn--gold" href="?mode=encore">' + T.anotherWord + '</a>';
      f += '<a class="mdj-btn" href="?mode=offrir">' + T.doorOffer + ' →</a>';
    } else if (mode === 'recv') {
      // Côté destinataire : un seul geste possible, la réciprocité douce.
      // Pas de lien vers le site, pas de « venez voir le reste ».
      f += '<a class="mdj-btn mdj-btn--gold" href="?mode=offrir">' + DOVE + ' ' + T.offerBack + '</a>';
    }
    return f;
  }

  // ----- intentions : filtrage doux par mots-clés -----
  var INTENTION_KEYWORDS = {
    souffre: ['souffr','peine','douleur','épreuve','perd','perte','deuil','larme','consol','triste','suffer','grief','consol','sorrow','tear'],
    paix:    ['paix','calme','silence','tranquill','quiétude','repos','sérénit','salam','sakīna','apais','peace','quiet','calm','still'],
    doute:   ['doute','interrog','question','perplex','sens','sentier','chemin','cherch','doubt','wonder','ask','seek'],
    eveil:   ['éveil','éclair','lumière','vrai','réalité','révèl','dévoil','nūr','tajall','présence','awak','light','real','presen','reveal'],
    joie:    ['joie','gratitude','remerc','beauté','émerveill','danse','chant','jamāl','allègr','joy','grat','beauty','dance','wonder']
  };
  function filterByIntention(pool, intention) {
    if (!intention || intention === 'all') return pool;
    var kws = INTENTION_KEYWORDS[intention] || [];
    var scored = [];
    pool.forEach(function (it) {
      var content = ((it.texte || '') + ' ' + (it.commentaire || '') + ' ' + (it.titre || '')).toLowerCase();
      var s = 0;
      for (var i = 0; i < kws.length; i++) { if (content.indexOf(kws[i]) !== -1) s++; }
      if (s > 0) scored.push({ it: it, s: s });
    });
    if (!scored.length) return pool; // repli silencieux
    // pondéré : on tire dans le pool des mieux notés (top 30%)
    scored.sort(function (a, b) { return b.s - a.s; });
    var top = scored.slice(0, Math.max(5, Math.ceil(scored.length * 0.3)));
    return top.map(function (x) { return x.it; });
  }

  // ----- pause respiration -----
  function breatheThen(callback) {
    var box = document.createElement('div');
    box.className = 'mdj-breath';
    box.innerHTML = '<div class="mdj-breath__inner"><div class="mdj-breath__circle"></div><p class="mdj-breath__text">' + T.breathe + '</p></div>';
    document.body.appendChild(box);
    var done = false;
    function finish() {
      if (done) return; done = true;
      box.classList.add('is-gone');
      setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); callback(); }, 500);
    }
    box.addEventListener('click', finish);
    setTimeout(finish, 3500);
  }

  // ----- colombe qui arrive (au destinataire) -----
  function doveArriveAndThen(callback) {
    var d = document.createElement('div');
    d.className = 'mdj-dove-arrive';
    d.innerHTML = DOVE;
    document.body.appendChild(d);
    // pendant la traversée, on prépare déjà le voile (caché)
    mount.innerHTML = '<div style="text-align:center;color:transparent;">·</div>';
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 2400);
    // le callback (qui pose le voile) est joué légèrement avant la fin
    setTimeout(function () { callback(); }, 1800);
  }

  // ----- colombe qui s'envole -----
  function doveFly() {
    var d = document.createElement('div');
    d.className = 'mdj-dove-fly';
    d.innerHTML = DOVE;
    document.body.appendChild(d);
    setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 2400);
    var msg = document.createElement('div');
    msg.className = 'mdj-sent-msg';
    msg.textContent = T.sent;
    document.body.appendChild(msg);
    setTimeout(function () {
      msg.classList.add('is-fade');
      setTimeout(function () { if (msg.parentNode) msg.parentNode.removeChild(msg); }, 700);
    }, 2200);
  }

  function pickTeaser() {
    var arr = T.teasers || [T.teaser];
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function revealView(it, eyebrow, invite, mode) {
    var toolsHTML = '<div class="mdj-tools">' +
      '<button type="button" class="mdj-tool" id="mdj-keep">' + T.saveImage + '</button>' +
    '</div>';
    mount.innerHTML =
      '<div class="mdj-veil" id="mdj-veil">' +
        '<div class="mdj-greet">' +
          '<div class="mdj-halo"></div>' +
          '<div class="mdj-greet__dove">' + DOVE + '</div>' +
        '</div>' +
        '<p class="mdj-invite">' + invite + '</p>' +
        '<p class="mdj-tap">' + T.tap + '</p>' +
      '</div>' +
      '<article class="mdj-card" id="mdj-card" hidden><div class="mdj-eyebrow">' + eyebrow + '</div>' +
        bodyHTML(it) +
        toolsHTML +
        '<div class="mdj-actions">' + footerHTML(it, mode) + '</div></article>';
    var veil = document.getElementById('mdj-veil'), card = document.getElementById('mdj-card');
    veil.addEventListener('click', function () {
      veil.classList.add('is-gone');
      setTimeout(function () { veil.style.display = 'none'; card.hidden = false; bindTools(it); }, 900);
    });
  }

  function bindTools(it) {
    var keep = document.getElementById('mdj-keep');
    if (keep) keep.addEventListener('click', function () { saveAsImage(it); });
  }

  function saveAsImage(it) {
    if (!window.LVDDPartage) return;
    var ar = '', tr = '', text = '', attribution = '';
    if (it.type === 'mot') {
      ar = it.ar || ''; tr = it.tr || ''; text = it.def || ''; attribution = '';
    } else {
      ar = ''; tr = it.titre || ''; text = String(it.texte || '').replace(/<[^>]+>/g, ''); attribution = it.source || '';
    }
    var eyebrow = EN ? 'A word offered' : 'Un mot offert';
    window.LVDDPartage.open({ ar: ar, tr: tr, text: text, attribution: attribution, eyebrow: eyebrow });
  }

  function enterImmersion() {
    document.body.classList.add('mdj-immersion');
    var exit = document.createElement('button');
    exit.type = 'button';
    exit.className = 'mdj-immersion-exit';
    exit.setAttribute('aria-label', T.exit);
    exit.textContent = '✕';
    exit.addEventListener('click', function () {
      document.body.classList.remove('mdj-immersion');
      if (exit.parentNode) exit.parentNode.removeChild(exit);
    });
    document.body.appendChild(exit);
  }

  function shareLink(url, btn) {
    var teaser = pickTeaser();
    function whenSent() { doveFly(); }
    if (navigator.share) {
      navigator.share({ title: T.giftTitle, text: teaser + ' 🕊', url: url }).then(whenSent).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(teaser + ' ' + url).then(function () {
        if (btn) { var o = btn.innerHTML; btn.innerHTML = T.copied; setTimeout(function () { btn.innerHTML = o; }, 1800); }
        whenSent();
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
    var intents = [
      ['all', T.intentionAll, '✦'],
      ['paix', T.intentionPaix, '☮'],
      ['souffre', T.intentionSouffre, '☾'],
      ['doute', T.intentionDoute, '?'],
      ['eveil', T.intentionEveil, '☀'],
      ['joie', T.intentionJoie, '❀']
    ];
    var chips = intents.map(function (x) {
      var cls = x[0] === 'all' ? 'mdj-chip is-active' : 'mdj-chip';
      return '<button type="button" class="' + cls + '" data-intent="' + x[0] + '"><span class="mdj-chip__ico">' + x[2] + '</span> ' + esc(x[1]) + '</button>';
    }).join('');
    mount.innerHTML =
      '<div class="mdj-offer"><div class="mdj-eyebrow">' + T.offerTitle + '</div>' +
        '<p class="mdj-offer-sub">' + T.offerSub + '</p>' +
        '<div class="mdj-intention"><div class="mdj-intention__label">' + T.intentionTitle + '</div>' +
          '<div class="mdj-chips">' + chips + '</div>' +
        '</div>' +
        '<div class="mdj-dove-big">' + DOVE + '</div>' +
        '<button type="button" class="mdj-btn mdj-btn--gold" id="mdj-draw">' + T.draw + '</button>' +
        '<div id="mdj-drawn"></div></div>';
    var current = 'all';
    document.querySelectorAll('.mdj-chip').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.mdj-chip').forEach(function (x) { x.classList.remove('is-active'); });
        b.classList.add('is-active');
        current = b.getAttribute('data-intent');
      });
    });
    document.getElementById('mdj-draw').addEventListener('click', function () {
      drawAndShow(pool, current);
    });
  }

  function drawAndShow(pool, intention) {
    var filtered = filterByIntention(pool, intention);
    var it = filtered[Math.floor(Math.random() * filtered.length)];
    var url = location.origin + location.pathname + '?id=' + encodeURIComponent(it.id);
    var box = document.getElementById('mdj-drawn');
    box.innerHTML =
      '<article class="mdj-card mdj-card--offer">' + bodyHTML(it) +
        '<div class="mdj-actions">' +
          '<button type="button" class="mdj-btn mdj-btn--gold" id="mdj-send">' + DOVE + ' ' + T.sendGift + '</button>' +
          '<button type="button" class="mdj-btn" id="mdj-redraw">' + T.redraw + '</button>' +
        '</div></article>';
    var sendBtn = document.getElementById('mdj-send');
    sendBtn.addEventListener('click', function () { shareLink(url, sendBtn); });
    document.getElementById('mdj-redraw').addEventListener('click', function () { drawAndShow(pool, intention); });
    box.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function buildPool(sg) {
    var pool = [];
    ((sg && sg.sagesses) || []).forEach(function (s) {
      pool.push({ id: 'sag-' + s.id, type: 'sagesse', titre: s.titre, texte: s.texte, source: s.source, commentaire: s.commentaire });
    });
    return pool;
  }

  Promise.all([
    fetch((EN ? '/en' : '') + '/data/sagesses.json').then(function (r) { return r.json(); }).catch(function () { return null; })
  ]).then(function (res) {
    var pool = buildPool(res[0]);
    if (!pool.length) { mount.innerHTML = '<p style="text-align:center;color:#888">—</p>'; return; }
    var params = new URLSearchParams(location.search);
    var id = params.get('id');
    var mode = params.get('mode');

    if (id) {
      var gift = pool.filter(function (x) { return x.id === id; })[0] || pool[0];
      doveArriveAndThen(function () {
        revealView(gift, T.recvEyebrow, T.recvInvite, 'recv');
      });
    } else if (mode === 'offrir') {
      offerView(pool);
    } else if (mode === 'jour') {
      var day = Math.floor(Date.now() / 86400000);
      revealView(pool[day % pool.length], T.selfEyebrow, T.selfInvite, 'jour');
    } else if (mode === 'encore') {
      revealView(pool[Math.floor(Math.random() * pool.length)], T.anotherEyebrow, T.anotherInvite, 'encore');
    } else {
      landingView();
    }
  });
})();
