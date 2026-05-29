/* ============================================================
   PARTAGE — générateur de carte image partageable (canvas)
   Module partagé. Usage :
     window.LVDDPartage.open({ ar, tr, text, attribution, eyebrow });
   - ar         : texte arabe (optionnel)
   - tr         : translittération (optionnel)
   - text       : sens / traduction / citation
   - attribution: source affichée en bas (ex. "Coran · al-Ikhlāṣ — 112 : 4")
   - eyebrow    : petite ligne dorée tout en haut (optionnel)
   ============================================================ */
(function () {
  if (window.LVDDPartage) return;
  var EN = document.documentElement.lang === 'en';

  function goldGrad(ctx, y0, y1, dark) {
    var g = ctx.createLinearGradient(0, y0, 0, y1);
    if (dark) { g.addColorStop(0, '#F0D27A'); g.addColorStop(0.5, '#D4A93A'); g.addColorStop(1, '#A87E1E'); }
    else { g.addColorStop(0, '#D9B14C'); g.addColorStop(0.5, '#B8860B'); g.addColorStop(1, '#8A6307'); }
    return g;
  }

  function wrapLines(ctx, text, maxWidth) {
    var words = String(text == null ? '' : text).split(/\s+/);
    var lines = [], line = '';
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = words[i]; }
      else { line = test; }
    }
    if (line) lines.push(line);
    return lines;
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

  /* étoile à 8 branches (khātam) = deux carrés superposés */
  function star8(ctx, cx, cy, r) {
    for (var k = 0; k < 2; k++) {
      ctx.beginPath();
      for (var i = 0; i < 4; i++) {
        var a = k * Math.PI / 4 + i * Math.PI / 2;
        var x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  function drawCard(canvas, p, theme) {
    var S = 1080, R = 2;
    canvas.width = S * R; canvas.height = S * R;
    var ctx = canvas.getContext('2d');
    ctx.setTransform(R, 0, 0, R, 0, 0);
    var dark = theme === 'dark';
    var hasAr = !!(p.ar && p.ar.trim());

    var col = dark
      ? { bg1: '#16202F', bg2: '#0C0F18', ink: '#F5EFE0', soft: '#CDC4AE' }
      : { bg1: '#FFFDF8', bg2: '#ECE0C8', ink: '#1B2A4E', soft: '#3A4D63' };

    // fond
    var g = ctx.createLinearGradient(0, 0, S, S);
    g.addColorStop(0, col.bg1); g.addColorStop(1, col.bg2);
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);

    // filigrane géométrique (grille d'étoiles à 8 branches, très pâle)
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.strokeStyle = dark ? '#D4A93A' : '#B8860B';
    ctx.lineWidth = 1;
    for (var wy = 120; wy < S - 100; wy += 150) {
      for (var wx = 120; wx < S - 100; wx += 150) { star8(ctx, wx, wy, 26); }
    }
    ctx.restore();

    // halo
    var halo = ctx.createRadialGradient(S / 2, S * 0.43, 30, S / 2, S * 0.43, 430);
    halo.addColorStop(0, dark ? 'rgba(212,169,58,0.16)' : 'rgba(255,251,240,0.95)');
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, S, S);

    // grain
    for (var i = 0; i < 2400; i++) {
      var gx = Math.random() * S, gy = Math.random() * S;
      ctx.fillStyle = (Math.random() < 0.5 ? 'rgba(255,255,255,' : 'rgba(0,0,0,') + (Math.random() * (dark ? 0.04 : 0.05)) + ')';
      ctx.fillRect(gx, gy, 1.4, 1.4);
    }

    // vignette
    var vg = ctx.createRadialGradient(S / 2, S / 2, S * 0.32, S / 2, S / 2, S * 0.74);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, dark ? 'rgba(0,0,0,0.38)' : 'rgba(70,48,12,0.13)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, S, S);

    // cadre
    ctx.strokeStyle = goldGrad(ctx, 54, S - 54, dark); ctx.globalAlpha = 0.6; ctx.lineWidth = 2;
    roundRect(ctx, 54, 54, S - 108, S - 108, 26); ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    // eyebrow
    if (p.eyebrow) {
      ctx.fillStyle = goldGrad(ctx, 96, 130, dark);
      ctx.font = '40px "Amiri", serif';
      ctx.fillText(p.eyebrow, S / 2, 116);
    }
    // ornement étoile
    ctx.strokeStyle = goldGrad(ctx, 150, 196, dark); ctx.lineWidth = 1.6;
    star8(ctx, S / 2, 176, 18);

    var ty;
    if (hasAr) {
      // arabe
      ctx.direction = 'rtl';
      ctx.fillStyle = col.ink;
      var aSize = (p.ar.length > 55) ? 58 : 80;
      ctx.font = '700 ' + aSize + 'px "Amiri", serif';
      var aLines = wrapLines(ctx, p.ar, S - 280);
      while (aLines.length > 4 && aSize > 40) {
        aSize -= 6; ctx.font = '700 ' + aSize + 'px "Amiri", serif';
        aLines = wrapLines(ctx, p.ar, S - 280);
      }
      var aLH = aSize * 1.62;
      var ay = S * 0.43 - (aLines.length - 1) * aLH / 2;
      aLines.forEach(function (ln) { ctx.fillText(ln, S / 2, ay); ay += aLH; });
      ctx.direction = 'ltr';

      // filet
      ctx.strokeStyle = goldGrad(ctx, ay, ay + 4, dark); ctx.globalAlpha = 0.8; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(S / 2 - 46, ay + 2); ctx.lineTo(S / 2 + 46, ay + 2); ctx.stroke();
      ctx.globalAlpha = 1;

      ty = ay + 56;
      if (p.tr) {
        ctx.fillStyle = goldGrad(ctx, ty - 24, ty + 4, dark);
        ctx.font = 'italic 30px "Cormorant Garamond", Georgia, serif';
        wrapLines(ctx, p.tr, S - 320).slice(0, 2).forEach(function (ln) { ctx.fillText(ln, S / 2, ty); ty += 38; });
        ty += 14;
      }
      ctx.fillStyle = col.soft;
      ctx.font = 'italic 38px "Cormorant Garamond", Georgia, serif';
      wrapLines(ctx, (p.text || ''), S - 290).slice(0, 6).forEach(function (ln) { ctx.fillText(ln, S / 2, ty); ty += 50; });
    } else {
      // carte centrée sur le texte (citations, poèmes)
      ctx.fillStyle = col.ink;
      ctx.font = 'italic 48px "Cormorant Garamond", Georgia, serif';
      var lines = wrapLines(ctx, (p.text || ''), S - 280).slice(0, 8);
      var lh = 64;
      var y0 = S * 0.46 - (lines.length - 1) * lh / 2;
      lines.forEach(function (ln) { ctx.fillText(ln, S / 2, y0); y0 += lh; });
    }

    // attribution
    ctx.fillStyle = goldGrad(ctx, S - 172, S - 146, dark);
    ctx.font = '500 25px "Inter", sans-serif';
    ctx.fillText(p.attribution || '', S / 2, S - 150);

    // signature : étoile + adresse
    ctx.strokeStyle = goldGrad(ctx, S - 104, S - 80, dark); ctx.lineWidth = 1.5;
    star8(ctx, S / 2 - 104, S - 91, 11);
    ctx.fillStyle = goldGrad(ctx, S - 104, S - 80, dark);
    ctx.font = '500 23px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('lavoiedudedans.fr', S / 2 - 82, S - 84);
    ctx.textAlign = 'center';
  }

  function ensureStyle() {
    if (document.getElementById('lvdd-partage-style')) return;
    var st = document.createElement('style');
    st.id = 'lvdd-partage-style';
    st.textContent =
      '.partage-overlay{position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;background:rgba(15,24,48,.7);backdrop-filter:blur(4px);padding:1.2rem;}' +
      '.partage-box{position:relative;width:min(92vw,30rem);text-align:center;}' +
      '.partage-canvas{width:100%;height:auto;border-radius:14px;box-shadow:0 30px 70px -20px rgba(0,0,0,.6);display:block;}' +
      '.partage-actions{display:flex;flex-wrap:wrap;gap:.6rem;justify-content:center;margin-top:1.1rem;}' +
      '.partage-btn{font-family:Inter,sans-serif;font-size:.78rem;letter-spacing:.08em;color:#F5EFE0;background:rgba(255,255,255,.08);border:1px solid rgba(212,169,58,.5);border-radius:999px;padding:.6rem 1.2rem;cursor:pointer;}' +
      '.partage-btn:hover{background:rgba(255,255,255,.16);}' +
      '.partage-btn--gold{background:#D4A93A;border-color:#D4A93A;color:#1B2A4E;font-weight:600;}' +
      '.partage-close{position:absolute;top:-2.6rem;right:0;width:2.2rem;height:2.2rem;font-size:1.1rem;color:#F5EFE0;background:rgba(255,255,255,.1);border:none;border-radius:999px;cursor:pointer;}';
    document.head.appendChild(st);
  }

  var overlay = null;
  async function open(p) {
    ensureStyle();
    if (overlay) overlay.remove();
    var initialDark = document.documentElement.getAttribute('data-theme') === 'dark';
    var ov = document.createElement('div');
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
    overlay = ov;

    var canvas = ov.querySelector('.partage-canvas');
    var theme = initialDark ? 'dark' : 'light';
    try {
      await Promise.all([
        document.fonts.load('700 76px "Amiri"'),
        document.fonts.load('italic 38px "Cormorant Garamond"'),
        document.fonts.load('500 25px "Inter"')
      ]);
    } catch (e) {}

    function paint() { drawCard(canvas, p, theme); }
    paint();

    ov.querySelector('[data-act="theme"]').addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark'; paint();
    });
    ov.querySelector('[data-act="dl"]').addEventListener('click', function () {
      var a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'lavoiedudedans.png';
      a.click();
    });
    ov.querySelector('[data-act="share"]').addEventListener('click', function () {
      canvas.toBlob(async function (blob) {
        var file = new File([blob], 'lavoiedudedans.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try { await navigator.share({ files: [file], text: 'lavoiedudedans.fr' }); } catch (e) {}
        } else {
          var a = document.createElement('a');
          a.href = canvas.toDataURL('image/png'); a.download = 'lavoiedudedans.png'; a.click();
        }
      }, 'image/png');
    });
    function close() { ov.remove(); overlay = null; }
    ov.querySelector('.partage-close').addEventListener('click', close);
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  }

  window.LVDDPartage = { open: open };
})();
