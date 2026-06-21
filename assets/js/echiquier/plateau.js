/* ============================================================
   L'Échiquier des gnostiques — plateau interactif
   Charge data/echiquier/cases.json, dresse la grille 10x10
   (lecture droite→gauche, case 1 en bas, 100 en haut), ouvre
   une fiche au clic. Recherche + filtres par famille.
   ============================================================ */

const CAT_LABEL = {
  chute: 'chute', maladie_de_l_ame: 'maladie de l’âme', danger: 'danger',
  vertu: 'vertu', remede: 'remède', station: 'station', voie: 'voie', pratique: 'pratique',
  connaissance: 'connaissance', realisation: 'réalisation', monde: 'monde', ange: 'ange',
  element: 'élément', concept: 'concept', metaphysique: 'métaphysique', etat: 'état du cœur',
  illusion: 'illusion', naissance: 'naissance'
};
const CAT_COLOR = {
  chute: 'var(--c-chute)', maladie_de_l_ame: 'var(--c-chute)', danger: 'var(--c-danger)',
  vertu: 'var(--c-vertu)', remede: 'var(--c-vertu)', station: 'var(--c-station)', voie: 'var(--c-voie)',
  pratique: 'var(--c-voie)', connaissance: 'var(--c-connaissance)', realisation: 'var(--c-realisation)',
  monde: 'var(--c-monde)', ange: 'var(--c-ange)', element: 'var(--c-element)', concept: 'var(--c-concept)',
  metaphysique: 'var(--c-concept)', etat: 'var(--c-etat)', illusion: 'var(--c-illusion)', naissance: 'var(--c-naissance)'
};
// Familles regroupées pour les filtres
const FAMILLES = [
  { id: 'chute', label: 'Chutes', cats: ['chute', 'maladie_de_l_ame', 'danger'], color: 'var(--c-chute)' },
  { id: 'vertu', label: 'Vertus & remèdes', cats: ['vertu', 'remede'], color: 'var(--c-vertu)' },
  { id: 'station', label: 'Stations & voie', cats: ['station', 'voie', 'pratique'], color: 'var(--c-station)' },
  { id: 'connaissance', label: 'Connaissance', cats: ['connaissance', 'realisation'], color: 'var(--c-connaissance)' },
  { id: 'monde', label: 'Mondes & anges', cats: ['monde', 'ange'], color: 'var(--c-monde)' },
  { id: 'etat', label: 'États & illusions', cats: ['etat', 'illusion'], color: 'var(--c-etat)' },
  { id: 'concept', label: 'Concepts & éléments', cats: ['concept', 'metaphysique', 'element', 'naissance'], color: 'var(--c-concept)' },
];
const STATUT_TXT = {
  a_confirmer: 'lecture incertaine — à confirmer sur le scan',
  lecture_visuelle: 'lu sur le plateau scanné — explication à approfondir',
  verifie_scan: 'vérifié sur le scan',
  verifie_arabe: 'vérifié en arabe',
  pret_publication: 'prêt'
};

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const catColor = c => c ? `<span class="ech-legende__pastille" style="background:${c.color}"></span>` : '';

(async () => {
  const mount = document.getElementById('ech-plateau');
  const legende = document.getElementById('ech-legende');
  const filtersEl = document.getElementById('ech-filters');
  const searchEl = document.getElementById('ech-search-input');
  const labelsToggle = document.getElementById('ech-labels-toggle');
  try {
    const data = await fetch('/data/echiquier/cases.json?v=10').then(r => r.json());
    const cases = (data.cases || []).slice().sort((a, b) => a.numero - b.numero);
    const byNum = {}; for (const c of cases) byNum[c.numero] = c;
    // Flèches confirmées progressivement sur le diagramme imprimé.
    let liens = [];
    try { liens = ((await fetch('/data/echiquier/liens.json?v=3').then(r => r.json())).liens) || []; } catch (e) {}

    const primaryCat = c => (c.categories && c.categories[0]) || 'concept';
    const colorOf = c => CAT_COLOR[primaryCat(c)] || 'var(--ech-gold)';

    // Position : grille LTR, mais le plateau se lit droite→gauche, case 1 en bas.
    function place(n) {
      const row = 10 - Math.floor((n - 1) / 10);      // 1 (haut) .. 10 (bas)
      const col = 10 - ((n - 1) % 10);                // 1 (gauche) .. 10 (droite)
      return { row, col };
    }

    // --- Rendu du plateau ---
    mount.innerHTML = cases.map(c => {
      const { row, col } = place(c.numero);
      return `
        <button type="button" class="ech-case" role="gridcell"
          data-num="${c.numero}" data-cats="${(c.categories || []).join(' ')}"
          style="grid-row:${row}; grid-column:${col}; --case-color:${colorOf(c)};"
          aria-label="Case ${c.numero} : ${esc(c.traduction)}">
          <span class="ech-case__num">${c.numero}</span>
          <span class="ech-case__ar" lang="ar" dir="rtl">${esc(c.arabe)}</span>
          <span class="ech-case__fr">${esc(c.traduction)}</span>
          ${c.statut === 'a_confirmer' ? '<span class="ech-case__statut" title="à confirmer">?</span>' : ''}
        </button>`;
    }).join('');

    // --- Légende ---
    legende.innerHTML = FAMILLES.map(f =>
      `<span class="ech-legende__item"><span class="ech-legende__pastille" style="background:${f.color}"></span>${f.label}</span>`
    ).join('');

    // --- Filtres ---
    let activeFilter = null;
    filtersEl.innerHTML = FAMILLES.map(f =>
      `<button type="button" class="ech-filter" data-fam="${f.id}">${f.label}</button>`).join('');
    function applyFilter() {
      const q = (searchEl.value || '').trim().toLowerCase();
      const fam = activeFilter ? FAMILLES.find(f => f.id === activeFilter) : null;
      document.querySelectorAll('.ech-case').forEach(btn => {
        const c = byNum[+btn.dataset.num];
        let show = true;
        if (fam) show = (c.categories || []).some(cat => fam.cats.includes(cat));
        if (show && q) {
          const hay = (c.arabe + ' ' + c.translitteration + ' ' + c.traduction + ' ' + c.numero).toLowerCase();
          show = hay.includes(q);
        }
        btn.classList.toggle('is-dim', !show);
      });
    }
    filtersEl.querySelectorAll('.ech-filter').forEach(b => {
      b.addEventListener('click', () => {
        activeFilter = (activeFilter === b.dataset.fam) ? null : b.dataset.fam;
        filtersEl.querySelectorAll('.ech-filter').forEach(x => x.classList.toggle('is-on', x.dataset.fam === activeFilter));
        applyFilter();
      });
    });
    searchEl.addEventListener('input', applyFilter);
    labelsToggle?.addEventListener('change', () => mount.classList.toggle('ech-plateau--labels', labelsToggle.checked));

    // --- Calque des flèches vérifiées sur le diagramme ---
    if (liens.length) {
      const LIEN_COLOR = { chute: 'var(--c-chute)', montee: 'var(--c-vertu)', retour: 'var(--ech-gold)', illusion: 'var(--c-illusion)' };
      const cx = n => ((10 - ((n - 1) % 10)) - 0.5) * 10;   // colonne (gauche→droite)
      const cy = n => ((10 - Math.floor((n - 1) / 10)) - 0.5) * 10; // ligne (haut→bas)
      const svg = `
        <svg class="ech-arrows" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs><marker id="ech-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M2 2 L8 5 L2 8" fill="none" stroke="context-stroke" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
          ${liens.map(l => `<line x1="${cx(l.from)}" y1="${cy(l.from)}" x2="${cx(l.to)}" y2="${cy(l.to)}" stroke="${LIEN_COLOR[l.type] || 'var(--ech-gold)'}" stroke-width="0.55" marker-end="url(#ech-ah)" opacity=".82"><title>${esc(l.lecture || '')}</title></line>`).join('')}
        </svg>`;
      mount.insertAdjacentHTML('beforeend', svg);
      // bouton bascule, dans la barre d'outils
      const tools = document.querySelector('.ech-tools');
      if (tools) {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'ech-random'; btn.id = 'ech-arrows-toggle';
        btn.innerHTML = '✦ flèches vérifiées';
        tools.appendChild(btn);
        // Légende des flèches confirmées, masquée tant que le calque est éteint.
        const cap = document.createElement('p');
        cap.className = 'ech-arrows-legend';
        cap.innerHTML = '<span class="al al--montee">montée</span><span class="al al--chute">chute</span><span class="al al--retour">retour</span><span class="al al--illusion">illusion</span><em>Flèches lues sur le diagramme imprimé. Le tracé est en cours : seules les flèches confirmées sont affichées.</em>';
        const note = document.querySelector('.ech-legende-note');
        (note || tools).insertAdjacentElement('afterend', cap);
        btn.addEventListener('click', () => {
          const on = mount.querySelector('.ech-arrows').classList.toggle('is-on');
          btn.classList.toggle('is-on', on);
          cap.classList.toggle('is-on', on);
        });
      }
    }

    // « Une case au hasard » — pour entrer par la grâce, non par le choix.
    document.getElementById('ech-random')?.addEventListener('click', () => {
      openCase(1 + Math.floor(Math.random() * 100));
    });

    // --- Panneau fiche ---
    const overlay = document.getElementById('ech-panel-overlay');
    const panel = document.getElementById('ech-panel');
    const scroll = document.getElementById('ech-panel-scroll');
    let current = null;

    function openCase(n) {
      const c = byNum[n]; if (!c) return;
      current = n;
      const col = colorOf(c);
      const cats = (c.categories || []).map(k => CAT_LABEL[k] || k).join(' · ');
      const champ = (label, val, vide) => `
        <div class="ech-fiche__bloc">
          <p class="ech-fiche__label">${label}</p>
          ${val ? `<p class="ech-fiche__txt">${esc(val)}</p>` : `<p class="ech-fiche__txt ech-fiche__txt--vide">${vide}</p>`}
        </div>`;
      const liens = (arr, label) => (arr && arr.length) ? `
        <div class="ech-fiche__bloc">
          <p class="ech-fiche__label">${label}</p>
          <ul class="ech-fiche__liste">${arr.map(l => {
            const t = byNum[l.to || l.from];
            return t ? `<li><button type="button" class="ech-lien" data-go="${t.numero}">${esc(t.arabe)} — ${esc(t.traduction)}${l.type ? ` <em>(${esc(l.type)})</em>` : ''}</button></li>` : '';
          }).join('')}</ul>
        </div>` : '';

      scroll.innerHTML = `
        <span class="ech-fiche__cat" style="--case-color:${col}">${esc((c.categories || [])[0] ? (CAT_LABEL[c.categories[0]] || c.categories[0]) : 'case')}</span>
        <span class="ech-fiche__num">case ${c.numero} / 100</span>
        <p class="ech-fiche__ar" lang="ar" dir="rtl">${esc(c.arabe)}</p>
        <p class="ech-fiche__tr">${esc(c.translitteration)}</p>
        <h2 class="ech-fiche__fr">${esc(c.traduction)}</h2>
        ${cats ? `<p class="ech-fiche__txt" style="font-size:.85rem;color:var(--ech-ink-mute);margin:-.4rem 0 .6rem;">${esc(cats)}</p>` : ''}
        ${c.resume ? `<p class="ech-fiche__txt" style="font-style:italic;">${esc(c.resume)}</p>` : ''}
        ${champ('Ce que c’est', c.explication_simple, 'Explication à venir — lecture en cours du commentaire arabe.')}
        ${c.explication_spirituelle ? champ('Sens spirituel', c.explication_spirituelle) : ''}
        ${c.mecanisme ? champ('Mécanisme', c.mecanisme) : ''}
        ${(c.symptomes && c.symptomes.length) ? `<div class="ech-fiche__bloc"><p class="ech-fiche__label">Comment cela apparaît</p><ul class="ech-fiche__liste">${c.symptomes.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>` : ''}
        ${c.illusion_possible ? champ('Illusion possible', c.illusion_possible) : ''}
        ${c.ouverture ? champ('Ce que cela peut apprendre', c.ouverture) : ''}
        ${(c.remede && c.remede.length) ? `<div class="ech-fiche__bloc"><p class="ech-fiche__label">Remède, retour</p><ul class="ech-fiche__liste">${c.remede.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>` : ''}
        ${c.pratique ? champ('Pratique intérieure', c.pratique) : ''}
        ${c.question_introspection ? `<div class="ech-fiche__bloc"><p class="ech-fiche__label">Question pour soi</p><p class="ech-fiche__q">${esc(c.question_introspection)}</p></div>` : ''}
        ${liens(c.liens_entrants, 'Ce qui mène ici')}
        ${liens(c.liens_sortants, 'Où cela conduit')}
        <a class="ech-fiche__journal" href="/pages/echiquier/journal/?case=${c.numero}">✦ Noter cette case dans mon journal</a>
        <div class="ech-badge-valid">✦ ${esc(STATUT_TXT[c.statut] || c.statut)}</div>
        <div class="ech-fiche__nav">
          <button type="button" class="ech-fiche__navbtn" id="ech-prev" ${c.numero <= 1 ? 'disabled' : ''}>← case ${c.numero - 1}</button>
          <button type="button" class="ech-fiche__navbtn" id="ech-next" ${c.numero >= 100 ? 'disabled' : ''}>case ${c.numero + 1} →</button>
        </div>`;

      scroll.querySelectorAll('.ech-lien').forEach(b => b.addEventListener('click', () => openCase(+b.dataset.go)));
      document.getElementById('ech-prev')?.addEventListener('click', () => openCase(c.numero - 1));
      document.getElementById('ech-next')?.addEventListener('click', () => openCase(c.numero + 1));
      scroll.scrollTop = 0;

      document.querySelectorAll('.ech-case').forEach(b => b.classList.toggle('is-active', +b.dataset.num === n));
      overlay.classList.add('is-open'); panel.classList.add('is-open');
      if (history.replaceState) history.replaceState(null, '', '#case-' + n);
    }
    function closePanel() {
      overlay.classList.remove('is-open'); panel.classList.remove('is-open');
      document.querySelectorAll('.ech-case').forEach(b => b.classList.remove('is-active'));
      current = null;
      if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    }

    mount.querySelectorAll('.ech-case').forEach(b => b.addEventListener('click', () => openCase(+b.dataset.num)));
    document.getElementById('ech-panel-close')?.addEventListener('click', closePanel);
    overlay.addEventListener('click', closePanel);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePanel();
      if (current && e.key === 'ArrowLeft' && current > 1) openCase(current - 1);
      if (current && e.key === 'ArrowRight' && current < 100) openCase(current + 1);
    });

    // Ouverture directe via #case-N (au chargement et si le hash change ensuite)
    const openFromHash = () => {
      const m = location.hash.match(/^#case-(\d+)$/);
      if (m) openCase(+m[1]);
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:2rem;color:#a85c43;">Le plateau n'a pas pu être chargé.</p>`;
  }
})();
