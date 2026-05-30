/* ============================================================
   Lire le Coran — liseuse en pages tournées (Apple Books-like)
   ============================================================ */
(function () {
  'use strict';

  var stage = document.getElementById('lecture-stage');
  var pages = document.getElementById('lecture-pages');
  if (!stage || !pages) return;

  var headSura = document.getElementById('lec-sura');
  var headVerse = document.getElementById('lec-verse');
  var btnPrev = document.getElementById('lec-prev');
  var btnNext = document.getElementById('lec-next');
  var loader = document.getElementById('lecture-loading');
  var tocOpen = document.getElementById('lec-toc-open');
  var tocClose = document.getElementById('lec-toc-close');
  var toc = document.getElementById('lecture-toc');
  var tocList = document.getElementById('lec-toc-list');
  var tocSearch = document.getElementById('lec-toc-search');
  var resumeBox = document.getElementById('lecture-resume');

  var SAVE_KEY = 'lvdd_coran_lecture_pos';
  var suraCache = {};   // n → data
  var allSuras = null;  // [{n, nom_tr, nom_ar, nom_fr, versets_count, intro?}]
  var state = { sura: 1, verset: 1 };
  var turning = false;

  function $(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // -------- chargement d'une sourate --------
  function loadSura(n) {
    if (suraCache[n]) return Promise.resolve(suraCache[n]);
    return fetch('/data/coran/' + n + '.json').then(function (r) { return r.json(); }).then(function (d) {
      suraCache[n] = d;
      return d;
    });
  }

  // catalogue des 114 (utile pour le sommaire + transitions de sourate)
  function loadCatalog() {
    if (allSuras) return Promise.resolve(allSuras);
    var promises = [];
    for (var i = 1; i <= 114; i++) {
      (function (n) {
        if (suraCache[n]) { promises.push(Promise.resolve({ n: n, d: suraCache[n] })); return; }
        promises.push(fetch('/data/coran/' + n + '.json').then(function (r) { return r.json(); }).then(function (d) { suraCache[n] = d; return { n: n, d: d }; }));
      })(i);
    }
    return Promise.all(promises).then(function (arr) {
      arr.sort(function (a, b) { return a.n - b.n; });
      allSuras = arr.map(function (x) { return { n: x.n, nom_tr: x.d.nom_tr, nom_ar: x.d.nom_ar, nom_fr: x.d.nom_fr, count: (x.d.versets || []).length }; });
      return allSuras;
    });
  }

  // -------- rendu d'une page --------
  function renderPage(suraN, versetN) {
    return loadSura(suraN).then(function (d) {
      var v = (d.versets || [])[versetN - 1];
      if (!v) return null;
      var basmala = (versetN === 1 && d.basmala && suraN !== 1 && suraN !== 9) ? d.basmala : '';
      var head =
        '<div class="lecture-page__head">' +
          '<div class="lecture-page__sura">' + esc(d.nom_tr || ('Sourate ' + suraN)) + '</div>' +
          '<div class="lecture-page__num">verset ' + versetN + ' / ' + (d.versets || []).length + '</div>' +
        '</div>';
      var basmalaHTML = basmala ? '<div class="lecture-page__basmala">' + esc(basmala) + '</div>' : '';
      var ar = v.ar ? '<div class="lecture-page__ar">' + esc(v.ar) + '</div>' : '';
      var tr = v.tr ? '<div class="lecture-page__tr">' + esc(v.tr) + '</div>' : '';
      var rule = '<div class="lecture-page__rule" aria-hidden="true"></div>';
      var trad = v.trad ? '<div class="lecture-page__trad">' + v.trad + '</div>' : '';
      var comment = v.commentaire ? '<button type="button" class="lecture-page__tool" data-act="comment">✦ Commentaire</button>' : '';
      var audio = '<button type="button" class="lecture-page__tool" data-act="audio">▷ Écouter</button>';
      var commentBlock = v.commentaire ? '<div class="lecture-page__comment" hidden>' + v.commentaire + '</div>' : '';
      var tools = '<div class="lecture-page__tools">' + audio + comment + '</div>';
      var page = $(
        '<article class="lecture-page" data-sura="' + suraN + '" data-verset="' + versetN + '">' +
          head + basmalaHTML + ar + tr + rule + trad + tools + commentBlock +
        '</article>'
      );
      var sayBtn = page.querySelector('[data-act="audio"]');
      if (sayBtn) sayBtn.addEventListener('click', function (e) { e.stopPropagation(); playVerseAudio(suraN, versetN); });
      var cBtn = page.querySelector('[data-act="comment"]');
      if (cBtn) cBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var box = page.querySelector('.lecture-page__comment');
        if (!box) return;
        box.hidden = !box.hidden;
        if (!box.hidden) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
      return page;
    });
  }

  function pad(n, w) { var s = String(n); while (s.length < w) s = '0' + s; return s; }
  var audioEl = null;
  function playVerseAudio(suraN, versetN) {
    var url = 'https://everyayah.com/data/Alafasy_128kbps/' + pad(suraN, 3) + pad(versetN, 3) + '.mp3';
    if (!audioEl) audioEl = new Audio();
    audioEl.src = url;
    audioEl.play().catch(function () {});
  }

  // -------- voisinage : verset suivant / précédent (saute de sourate) --------
  function nextPos(p) {
    return loadSura(p.sura).then(function (d) {
      var max = (d.versets || []).length;
      if (p.verset < max) return { sura: p.sura, verset: p.verset + 1 };
      if (p.sura < 114) return { sura: p.sura + 1, verset: 1 };
      return null;
    });
  }
  function prevPos(p) {
    if (p.verset > 1) return Promise.resolve({ sura: p.sura, verset: p.verset - 1 });
    if (p.sura > 1) return loadSura(p.sura - 1).then(function (d) { return { sura: p.sura - 1, verset: (d.versets || []).length }; });
    return Promise.resolve(null);
  }

  // -------- header & boutons --------
  function refreshHead() {
    var d = suraCache[state.sura];
    if (d) {
      headSura.textContent = 'Sourate ' + state.sura + ' · ' + (d.nom_tr || '');
      headVerse.textContent = 'verset ' + state.verset + ' / ' + (d.versets || []).length;
    }
  }
  function refreshButtons(nextOK, prevOK) {
    btnPrev.disabled = !prevOK;
    btnNext.disabled = !nextOK;
  }

  // -------- montage initial : 3 pages empilées --------
  var currentPageEl = null, nextPageEl = null, prevPageEl = null;

  function buildAround() {
    return Promise.all([
      renderPage(state.sura, state.verset),
      nextPos(state).then(function (p) { return p ? renderPage(p.sura, p.verset) : null; }),
      prevPos(state).then(function (p) { return p ? renderPage(p.sura, p.verset) : null; })
    ]).then(function (arr) {
      pages.innerHTML = '';
      currentPageEl = arr[0]; nextPageEl = arr[1]; prevPageEl = arr[2];
      if (prevPageEl) { prevPageEl.classList.add('lecture-page--prev'); pages.appendChild(prevPageEl); }
      if (nextPageEl) { nextPageEl.classList.add('lecture-page--next'); pages.appendChild(nextPageEl); }
      if (currentPageEl) { currentPageEl.classList.add('lecture-page--current'); pages.appendChild(currentPageEl); }
      loader.hidden = true;
      refreshHead();
      Promise.all([nextPos(state), prevPos(state)]).then(function (rs) { refreshButtons(!!rs[0], !!rs[1]); });
      savePos();
    });
  }

  function savePos() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ sura: state.sura, verset: state.verset, t: Date.now() })); } catch (e) {}
  }
  function loadPos() {
    try { var s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) : null; } catch (e) { return null; }
  }

  // -------- tourner la page : avancer --------
  function turnForward() {
    if (turning || !nextPageEl) return;
    turning = true;
    var page = currentPageEl;
    page.classList.add('lecture-page--turning');
    page.style.transform = 'rotateY(-180deg)';
    page.style.boxShadow = '-26px 0 40px rgba(40,30,15,0.4), 0 18px 40px -20px rgba(40,30,15,0.35)';
    setTimeout(function () { afterTurn('forward'); }, 620);
  }
  function turnBackward() {
    if (turning || !prevPageEl) return;
    turning = true;
    // animation symétrique : on bouge la PRÉCÉDENTE de -180° vers 0°
    var page = prevPageEl;
    page.classList.add('lecture-page--turning');
    // amener la prev en avant
    pages.appendChild(page);
    page.style.transform = 'rotateY(-180deg)';
    // forcer reflow
    void page.offsetWidth;
    page.style.transform = 'rotateY(0deg)';
    page.style.boxShadow = '0 18px 40px -20px rgba(40,30,15,0.35)';
    setTimeout(function () { afterTurn('backward'); }, 620);
  }
  function afterTurn(dir) {
    Promise.resolve()
      .then(function () { return dir === 'forward' ? nextPos(state) : prevPos(state); })
      .then(function (np) {
        if (!np) { turning = false; return; }
        state = np;
        return buildAround();
      })
      .then(function () { turning = false; })
      .catch(function () { turning = false; });
  }

  // -------- swipe gestures (suivi du doigt) --------
  var t0 = null, dx0 = 0, dragging = false, dragDirection = 0; // 1 forward, -1 backward
  function onStart(e) {
    if (turning) return;
    var pt = e.touches ? e.touches[0] : e;
    t0 = { x: pt.clientX, y: pt.clientY, t: Date.now() };
    dx0 = 0; dragging = false; dragDirection = 0;
  }
  function onMove(e) {
    if (!t0 || turning) return;
    var pt = e.touches ? e.touches[0] : e;
    var dx = pt.clientX - t0.x;
    var dy = pt.clientY - t0.y;
    if (!dragging) {
      if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        dragging = true;
        dragDirection = dx < 0 ? 1 : -1; // gauche = avancer
      } else {
        return;
      }
    }
    if (e.cancelable) e.preventDefault();
    var stageW = pages.clientWidth || 320;
    var progress = Math.max(-1, Math.min(1, dx / stageW));
    if (dragDirection === 1 && nextPageEl) {
      var p = Math.max(0, -progress);
      currentPageEl.classList.remove('lecture-page--snapping');
      currentPageEl.style.transform = 'rotateY(' + (-180 * p) + 'deg)';
      currentPageEl.style.boxShadow = (-26 * p) + 'px 0 ' + (40 * p) + 'px rgba(40,30,15,' + (0.4 * p) + ')';
    } else if (dragDirection === -1 && prevPageEl) {
      var p2 = Math.max(0, progress);
      // amener la prev en avant si pas déjà
      if (prevPageEl.parentNode !== pages || prevPageEl !== pages.lastChild) {
        pages.appendChild(prevPageEl);
        prevPageEl.style.transform = 'rotateY(-180deg)';
        void prevPageEl.offsetWidth;
      }
      prevPageEl.classList.remove('lecture-page--snapping');
      prevPageEl.style.transform = 'rotateY(' + (-180 + 180 * p2) + 'deg)';
      prevPageEl.style.boxShadow = (-26 * (1 - p2)) + 'px 0 ' + (40 * (1 - p2)) + 'px rgba(40,30,15,' + (0.4 * (1 - p2)) + ')';
    }
    dx0 = dx;
  }
  function onEnd() {
    if (!t0) return;
    if (!dragging) { t0 = null; return; }
    var stageW = pages.clientWidth || 320;
    var dt = Date.now() - t0.t;
    var velocity = Math.abs(dx0) / Math.max(1, dt);
    var threshold = stageW * 0.28;
    var goThrough = Math.abs(dx0) > threshold || velocity > 0.5;
    if (dragDirection === 1) {
      if (goThrough && nextPageEl) {
        turnForward();
      } else {
        currentPageEl.classList.add('lecture-page--snapping');
        currentPageEl.style.transform = 'rotateY(0deg)';
        currentPageEl.style.boxShadow = '';
        setTimeout(function () { currentPageEl.classList.remove('lecture-page--snapping'); }, 360);
      }
    } else if (dragDirection === -1) {
      if (goThrough && prevPageEl) {
        turnBackward();
      } else if (prevPageEl) {
        prevPageEl.classList.add('lecture-page--snapping');
        prevPageEl.style.transform = 'rotateY(-180deg)';
        prevPageEl.style.boxShadow = '';
        setTimeout(function () { prevPageEl.classList.remove('lecture-page--snapping'); }, 360);
      }
    }
    t0 = null; dragging = false; dragDirection = 0;
  }

  stage.addEventListener('touchstart', onStart, { passive: true });
  stage.addEventListener('touchmove', onMove, { passive: false });
  stage.addEventListener('touchend', onEnd);
  stage.addEventListener('touchcancel', onEnd);
  // souris (pour le test desktop)
  stage.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', function (e) { if (t0) onMove(e); });
  window.addEventListener('mouseup', onEnd);

  // boutons précédent/suivant
  btnNext.addEventListener('click', function () { turnForward(); });
  btnPrev.addEventListener('click', function () { turnBackward(); });

  // raccourcis clavier
  document.addEventListener('keydown', function (e) {
    if (toc && !toc.hidden) return;
    if (e.key === 'ArrowRight') turnForward();
    if (e.key === 'ArrowLeft') turnBackward();
  });

  // -------- sommaire --------
  function openTOC() {
    toc.hidden = false; toc.setAttribute('aria-hidden', 'false');
    if (!tocList.dataset.built) {
      loadCatalog().then(function (list) {
        list.forEach(function (s) {
          var item = $(
            '<a class="lecture-toc-item" data-sura="' + s.n + '">' +
              '<span class="lecture-toc-item__n">' + s.n + '</span>' +
              '<span class="lecture-toc-item__ar" lang="ar" dir="rtl">' + esc(s.nom_ar || '') + '</span>' +
              '<span class="lecture-toc-item__body">' +
                '<span class="lecture-toc-item__tr">' + esc(s.nom_tr || '') + '</span>' +
                '<span class="lecture-toc-item__count">' + s.count + ' versets · ' + esc(s.nom_fr || '') + '</span>' +
              '</span>' +
            '</a>'
          );
          item.addEventListener('click', function (ev) {
            ev.preventDefault();
            state = { sura: s.n, verset: 1 };
            closeTOC();
            loader.hidden = false;
            buildAround();
          });
          tocList.appendChild(item);
        });
        tocList.dataset.built = '1';
        highlightCurrentInTOC();
      });
    } else {
      highlightCurrentInTOC();
    }
  }
  function closeTOC() {
    toc.hidden = true; toc.setAttribute('aria-hidden', 'true');
  }
  function highlightCurrentInTOC() {
    tocList.querySelectorAll('.lecture-toc-item').forEach(function (el) {
      el.classList.toggle('is-current', parseInt(el.getAttribute('data-sura'), 10) === state.sura);
    });
    var cur = tocList.querySelector('.is-current');
    if (cur) cur.scrollIntoView({ block: 'center' });
  }
  tocOpen.addEventListener('click', openTOC);
  tocClose.addEventListener('click', closeTOC);
  toc.addEventListener('click', function (e) { if (e.target === toc) closeTOC(); });
  tocSearch.addEventListener('input', function () {
    var q = tocSearch.value.trim().toLowerCase();
    tocList.querySelectorAll('.lecture-toc-item').forEach(function (el) {
      var t = el.textContent.toLowerCase();
      el.style.display = !q || t.indexOf(q) !== -1 ? 'flex' : 'none';
    });
  });

  // -------- reprise --------
  (function init() {
    var saved = loadPos();
    if (saved && saved.sura && saved.verset && (saved.sura !== 1 || saved.verset !== 1)) {
      // proposer la reprise
      resumeBox.hidden = false;
      var d = suraCache[saved.sura];
      var label = (d ? d.nom_tr : 'Sourate ' + saved.sura);
      resumeBox.innerHTML =
        '<span class="lecture-resume__text">Reprendre <em>' + esc(label) + ' · verset ' + saved.verset + '</em> ?</span>' +
        '<button type="button" class="lecture-resume__yes">Oui</button>' +
        '<button type="button" class="lecture-resume__no" aria-label="Non">✕</button>';
      resumeBox.querySelector('.lecture-resume__yes').addEventListener('click', function () {
        resumeBox.hidden = true;
        state = { sura: saved.sura, verset: saved.verset };
        buildAround();
      });
      resumeBox.querySelector('.lecture-resume__no').addEventListener('click', function () {
        resumeBox.hidden = true;
        buildAround();
      });
      // pré-charge la sourate sauvegardée pour avoir le bon label
      loadSura(saved.sura).then(function (d2) {
        var t = resumeBox.querySelector('em');
        if (t) t.textContent = (d2.nom_tr || ('Sourate ' + saved.sura)) + ' · verset ' + saved.verset;
      });
    } else {
      buildAround();
    }
  })();
})();
