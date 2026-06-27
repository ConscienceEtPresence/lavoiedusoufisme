/* ============================================================
   Glossaire en surimpression (popovers) pour l'Échiquier.
   Repère les termes techniques arabes dans un texte rendu et
   les rend cliquables : un clic ouvre une définition courte
   avec graphie arabe + translittération diacritée.
   Réutilisable : window.EchGloss.ready puis EchGloss.annotate(el).
   ============================================================ */
(function () {
  const ECHROOT = (document.documentElement.lang === "en" ? "/en" : "") + "/data/echiquier/";
  // Normalise pour comparer : minuscules, sans signes diacritiques ni ʿ/ʾ.
  const norm = s => s.toLowerCase()
    .normalize('NFD').replace(/\p{M}/gu, '')
    .replace(/[ʿʾ'`]/g, '');

  let termes = [];
  let index = [];           // [{key(normalisé), term}], triés du plus long au plus court
  let pop = null;

  const ready = fetch(ECHROOT + 'glossaire.json?v=1')
    .then(r => r.json())
    .then(d => {
      termes = d.termes || [];
      const seen = new Set();
      for (const t of termes) {
        for (const m of (t.match || [t.tr])) {
          const k = norm(m);
          if (k && !seen.has(k)) { seen.add(k); index.push({ key: k, term: t }); }
        }
      }
      index.sort((a, b) => b.key.length - a.key.length);
    })
    .catch(() => {});

  function ensurePop() {
    if (pop) return pop;
    pop = document.createElement('div');
    pop.className = 'ech-gloss-pop';
    pop.hidden = true;
    pop.innerHTML = '<button type="button" class="ech-gloss-pop__close" aria-label="Fermer">✕</button>' +
      '<p class="ech-gloss-pop__ar" lang="ar" dir="rtl"></p>' +
      '<p class="ech-gloss-pop__tr"></p>' +
      '<p class="ech-gloss-pop__def"></p>' +
      '<a class="ech-gloss-pop__more" href="/pages/echiquier/glossaire/">Voir le glossaire complet →</a>';
    document.body.appendChild(pop);
    pop.querySelector('.ech-gloss-pop__close').addEventListener('click', hide);
    document.addEventListener('click', e => {
      if (pop.hidden) return;
      if (pop.contains(e.target) || (e.target.classList && e.target.classList.contains('ech-term'))) return;
      hide();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
    return pop;
  }
  function hide() { if (pop) pop.hidden = true; }

  function show(btn, t) {
    ensurePop();
    pop.querySelector('.ech-gloss-pop__ar').textContent = t.ar || '';
    pop.querySelector('.ech-gloss-pop__tr').textContent = t.tr || '';
    pop.querySelector('.ech-gloss-pop__def').textContent = t.def || '';
    pop.hidden = false;
    // positionnement sous le terme, contraint à la fenêtre
    const r = btn.getBoundingClientRect();
    pop.style.visibility = 'hidden'; pop.style.left = '0'; pop.style.top = '0';
    const pw = pop.offsetWidth, ph = pop.offsetHeight;
    let left = r.left + window.scrollX + r.width / 2 - pw / 2;
    left = Math.max(10 + window.scrollX, Math.min(left, window.scrollX + document.documentElement.clientWidth - pw - 10));
    let top = r.bottom + window.scrollY + 8;
    if (r.bottom + ph + 16 > window.innerHeight) top = r.top + window.scrollY - ph - 8;
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
    pop.style.visibility = 'visible';
  }

  // Parcourt les nœuds texte d'un élément et enrobe les termes connus.
  function annotate(root) {
    if (!root || !index.length) return;
    const skip = new Set(['A', 'BUTTON', 'SCRIPT', 'STYLE']);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        let p = node.parentElement;
        while (p && p !== root) {
          if (skip.has(p.tagName) || p.classList.contains('ech-term') ||
              p.getAttribute('lang') === 'ar' || p.dataset.noGloss != null)
            return NodeFilter.FILTER_REJECT;
          p = p.parentElement;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const targets = [];
    let n; while ((n = walker.nextNode())) targets.push(n);
    const seenTerms = new Set();   // un terme n'est enrobé qu'une fois par appel (évite la surcharge)

    for (const node of targets) {
      const text = node.nodeValue;
      // construit la chaîne normalisée + la carte position_normalisée -> index original
      let normStr = '', map = [];
      for (let oi = 0; oi < text.length; oi++) {
        const nc = norm(text[oi]);
        for (let k = 0; k < nc.length; k++) { normStr += nc[k]; map.push(oi); }
      }
      // collecte toutes les occurrences (terme le plus long d'abord), une fois chacun
      let matches = [];
      for (const { key, term } of index) {
        if (seenTerms.has(term.tr)) continue;
        const i = findWord(normStr, key);
        if (i >= 0) matches.push({ i, len: key.length, term });
      }
      if (!matches.length) continue;
      matches.sort((a, b) => a.i - b.i || b.len - a.len);
      // retient des occurrences non chevauchantes, chaque terme une seule fois
      const picks = []; let lastEnd = -1; const used = new Set();
      for (const m of matches) {
        if (m.i <= lastEnd || used.has(m.term.tr) || seenTerms.has(m.term.tr)) continue;
        picks.push(m); used.add(m.term.tr); lastEnd = m.i + m.len - 1;
      }
      if (!picks.length) continue;
      const frag = document.createDocumentFragment();
      let cursor = 0;
      for (const m of picks) {
        let oStart = map[m.i];
        let oEnd = map[m.i + m.len - 1] + 1;
        while (oEnd < text.length && norm(text[oEnd]) === '') oEnd++; // garde hamza/diacritiques finales
        if (oStart > cursor) frag.appendChild(document.createTextNode(text.slice(cursor, oStart)));
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'ech-term';
        btn.textContent = text.slice(oStart, oEnd);
        const term = m.term;
        btn.addEventListener('click', ev => { ev.stopPropagation(); show(btn, term); });
        frag.appendChild(btn);
        cursor = oEnd;
        seenTerms.add(m.term.tr);
      }
      if (cursor < text.length) frag.appendChild(document.createTextNode(text.slice(cursor)));
      node.parentNode.replaceChild(frag, node);
    }
  }

  // index d'un mot entier (bornes non alphabétiques) dans une chaîne normalisée
  function findWord(hay, needle) {
    let from = 0;
    while (true) {
      const i = hay.indexOf(needle, from);
      if (i < 0) return -1;
      const a = hay[i - 1], b = hay[i + needle.length];
      const boundary = c => c === undefined || /[^a-z]/.test(c);
      if (boundary(a) && boundary(b)) return i;
      from = i + 1;
    }
  }

  window.EchGloss = { ready, annotate, hide };
})();
