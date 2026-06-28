const ECHEN = document.documentElement.lang === "en";
const _P = ECHEN ? "/en" : "";
/* ============================================================
   L'Échiquier des gnostiques — plateau interactif
   Charge data/echiquier/cases.json, dresse la grille 10x10
   (lecture droite→gauche, case 1 en bas, 100 en haut), ouvre
   une fiche au clic. Recherche + filtres par famille.
   ============================================================ */

const CAT_LABEL = ECHEN ? {
  chute: 'fall', maladie_de_l_ame: 'sickness of the soul', danger: 'danger',
  vertu: 'virtue', remede: 'remedy', station: 'station', voie: 'way', pratique: 'practice',
  connaissance: 'knowledge', realisation: 'realisation', monde: 'world', ange: 'angel',
  element: 'element', concept: 'concept', metaphysique: 'metaphysics', etat: 'state of the heart',
  illusion: 'illusion', naissance: 'birth'
} : {
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
  { id: 'chute', label: ECHEN?'Falls':'Chutes', cats: ['chute', 'maladie_de_l_ame', 'danger'], color: 'var(--c-chute)' },
  { id: 'vertu', label: ECHEN?'Virtues & remedies':'Vertus & remèdes', cats: ['vertu', 'remede'], color: 'var(--c-vertu)' },
  { id: 'station', label: ECHEN?'Stations & way':'Stations & voie', cats: ['station', 'voie', 'pratique'], color: 'var(--c-station)' },
  { id: 'connaissance', label: ECHEN?'Knowledge':'Connaissance', cats: ['connaissance', 'realisation'], color: 'var(--c-connaissance)' },
  { id: 'monde', label: ECHEN?'Worlds & angels':'Mondes & anges', cats: ['monde', 'ange'], color: 'var(--c-monde)' },
  { id: 'etat', label: ECHEN?'States & illusions':'États & illusions', cats: ['etat', 'illusion'], color: 'var(--c-etat)' },
  { id: 'concept', label: ECHEN?'Concepts & elements':'Concepts & éléments', cats: ['concept', 'metaphysique', 'element', 'naissance'], color: 'var(--c-concept)' },
];
const STATUT_TXT = ECHEN ? {
  a_confirmer: 'uncertain reading — to confirm on the scan',
  lecture_visuelle: 'read from the scanned board — commentary to deepen',
  verifie_scan: 'verified on the scan',
  verifie_arabe: 'verified in the Arabic text',
  pret_publication: 'ready'
} : {
  a_confirmer: 'lecture incertaine — à confirmer sur le scan',
  lecture_visuelle: 'lu sur le plateau scanné — explication à approfondir',
  verifie_scan: 'vérifié sur le scan',
  verifie_arabe: 'vérifié dans le texte arabe',
  pret_publication: 'prêt'
};

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const catColor = c => c ? `<span class="ech-legende__pastille" style="background:${c.color}"></span>` : '';
const TYPE_TXT = ECHEN ? { montee:'ascent', chute:'chain / grapnel', retour:'return', illusion:'illusion' } : {
  montee: 'montée',
  chute: 'chaîne / grappin',
  retour: 'retour',
  illusion: 'illusion'
};
const TYPE_SYM = { montee: '↑', chute: '⛓', retour: '↺', illusion: '✦' };
const TYPE_INTRO = ECHEN ? {
  montee: 'This movement indicates a progress or an elevation.',
  chute: 'This movement indicates a fall, a regression or a grapnel of the soul.',
  retour: 'This movement indicates a possible return.',
  illusion: 'This movement indicates an illusion to unmask.'
} : {
  montee: 'Ce mouvement indique une progression ou une élévation.',
  chute: 'Ce mouvement indique une chute, une régression ou un grappin de l’âme.',
  retour: 'Ce mouvement indique un retour possible.',
  illusion: 'Ce mouvement indique une illusion à démasquer.'
};
const questionGenerique = c => ECHEN ? `Where does this reality appear in me, even faintly, and what right return can it teach me?` : `Où cette réalité apparaît-elle en moi, même faiblement, et quel retour juste peut-elle m'apprendre ?`;

(async () => {
  const ECHROOT = (document.documentElement.lang === "en" ? "/en" : "") + "/data/echiquier/";
  const mount = document.getElementById('ech-plateau');
  const legende = document.getElementById('ech-legende');
  const filtersEl = document.getElementById('ech-filters');
  const searchEl = document.getElementById('ech-search-input');
  const labelsToggle = document.getElementById('ech-labels-toggle');
  const searchStatus = document.getElementById('ech-search-status') || (() => {
    const status = document.createElement('p');
    status.id = 'ech-search-status';
    status.className = 'ech-search-status';
    status.setAttribute('role', 'status');
    status.hidden = true;
    document.querySelector('.ech-tools')?.insertAdjacentElement('afterend', status);
    return status;
  })();
  try {
    const data = await fetch(ECHROOT + 'cases.json?v=20').then(r => r.json());
    const cases = (data.cases || []).slice().sort((a, b) => a.numero - b.numero);
    const byNum = {}; for (const c of cases) byNum[c.numero] = c;
    // Mouvements confirmés dans le texte : montées, chaînes et grappins.
    let liens = [];
    try { liens = ((await fetch(ECHROOT + 'liens.json?v=10').then(r => r.json())).liens) || []; } catch (e) {}
    const relations = {};
    for (const c of cases) relations[c.numero] = { entrants: [], sortants: [] };
    for (const l of liens) {
      const from = +l.from, to = +l.to;
      if (relations[from]) relations[from].sortants.push(l);
      if (relations[to]) relations[to].entrants.push(l);
    }

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
      let visible = 0;
      document.querySelectorAll('.ech-case').forEach(btn => {
        const c = byNum[+btn.dataset.num];
        let show = true;
        if (fam) show = (c.categories || []).some(cat => fam.cats.includes(cat));
        if (show && q) {
          const hay = (c.arabe + ' ' + c.translitteration + ' ' + c.traduction + ' ' + c.numero).toLowerCase();
          show = hay.includes(q);
        }
        if (show) visible++;
        btn.classList.toggle('is-dim', !show);
      });
      if (searchStatus) {
        const shouldSpeak = Boolean(q || fam);
        searchStatus.hidden = !shouldSpeak;
        if (!shouldSpeak) {
          searchStatus.textContent = '';
        } else if (!visible) {
          searchStatus.textContent = ECHEN?'No square visible: clear the search or change family.':'Aucune case visible : effacez la recherche ou changez de famille.';
        } else {
          const label = ECHEN ? (visible>1?'squares visible':'square visible') : (visible > 1 ? 'cases visibles' : 'case visible');
          const scope = fam ? `${ECHEN?' in ':' dans '}${fam.label.toLowerCase()}` : '';
          searchStatus.textContent = `${visible} ${label}${scope}.`;
        }
      }
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

    // --- Calque des mouvements vérifiés sur le diagramme ---
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
        btn.innerHTML = ECHEN ? '✦ verified movements' : '✦ mouvements vérifiés';
        tools.appendChild(btn);
        // Légende des mouvements confirmés, masquée tant que le calque est éteint.
        const cap = document.createElement('p');
        cap.className = 'ech-arrows-legend';
        cap.innerHTML = ECHEN ? '<span class="al al--montee">ascent</span><span class="al al--chute">chain / grapnel</span><span class="al al--retour">return</span><span class="al al--illusion">illusion</span><em>Ascents indicate a progress. Chains and grapnels indicate a fall or a regression. Only the movements confirmed in the text are shown.</em>' : '<span class="al al--montee">montée</span><span class="al al--chute">chaîne / grappin</span><span class="al al--retour">retour</span><span class="al al--illusion">illusion</span><em>Les montées indiquent une progression. Les chaînes et grappins indiquent une chute ou une régression. Seuls les mouvements confirmés dans le texte sont affichés.</em>';
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
      const relationBloc = (arr, label, sens) => (arr && arr.length) ? `
        <div class="ech-fiche__bloc">
          <p class="ech-fiche__label">${label}</p>
          <ul class="ech-mouvements">${arr.map(l => {
            const targetNum = sens === 'entrant' ? +l.from : +l.to;
            const t = byNum[targetNum];
            if (!t) return '';
            const type = l.type || 'montee';
            const sensTxt = sens === 'entrant' ? (ECHEN?'from':'depuis') : (ECHEN?'to':'vers');
            return `<li class="ech-mouvement ech-mouvement--${esc(type)}">
              <button type="button" class="ech-lien ech-lien-mvt" data-go="${t.numero}">
                <span class="ech-lien-mvt__type">${esc(TYPE_SYM[type] || '→')} ${esc(TYPE_TXT[type] || type)}</span>
                <span class="ech-lien-mvt__target">${sensTxt} ${ECHEN?'square':'la case'} ${t.numero} — ${esc(t.traduction)}</span>
              </button>
              <p class="ech-lien-mvt__lecture">${esc(l.lecture || TYPE_INTRO[type] || '')}</p>
              ${l.trajet_detaille ? `<p class="ech-lien-mvt__trajet">${ECHEN?'Symbolic path:':'Trajet symbolique :'} <b>${l.trajet_detaille.join(' → ')}</b></p>` : ''}
            </li>`;
          }).join('')}</ul>
        </div>` : '';
      const rel = relations[c.numero] || { entrants: [], sortants: [] };
      const question = c.question_introspection || questionGenerique(c);
      const prevBtn = c.numero > 1
        ? `<button type="button" class="ech-fiche__navbtn" id="ech-prev">← ${ECHEN?'square':'case'} ${c.numero - 1}</button>`
        : '<span aria-hidden="true"></span>';
      const nextBtn = c.numero < 100
        ? `<button type="button" class="ech-fiche__navbtn" id="ech-next">${ECHEN?'square':'case'} ${c.numero + 1} →</button>`
        : '<span aria-hidden="true"></span>';

      const remedeHint = (c.remede && c.remede[0]) || (ECHEN ? 'Hold on: do not feed the state, return to the breath, and wait a moment.' : 'Tiens bon : ne nourris pas l\'état, reviens au souffle, et patiente un instant.');
      const deepHtml = [
        c.explication_spirituelle ? champ(ECHEN?'Spiritual sense':'Sens spirituel', c.explication_spirituelle) : '',
        c.mecanisme ? champ(ECHEN?'Mechanism':'Mécanisme', c.mecanisme) : '',
        c.illusion_possible ? champ(ECHEN?'Possible illusion':'Illusion possible', c.illusion_possible) : '',
        c.ouverture ? champ(ECHEN?'What this can teach':'Ce que cela peut apprendre', c.ouverture) : '',
        c.pratique ? champ(ECHEN?'Inner practice':'Pratique intérieure', c.pratique) : '',
        (c.appui_scripturaire && c.appui_scripturaire.length) ? `<div class="ech-fiche__bloc ech-fiche__script"><p class="ech-fiche__label">${ECHEN?'Scriptural support':'Appui scripturaire'}</p><ul class="ech-fiche__refs">${c.appui_scripturaire.map(r => `<li>${esc(r)}</li>`).join('')}</ul><p class="ech-fiche__refs-note">${ECHEN?'Verses and hadiths cited by the commentary to ground this square.':'Versets et hadiths cités par le commentaire pour fonder cette case.'}</p></div>` : '',
        c.chemin_texte ? `<div class="ech-fiche__bloc ech-fiche__chemin"><p class="ech-fiche__label">${ECHEN?'The path, step by step':'Le chemin, pas à pas'}</p><p class="ech-fiche__txt">${esc(c.chemin_texte)}</p></div>` : '',
        `<div class="ech-fiche__bloc ech-fiche__source"><p class="ech-fiche__label">${ECHEN?'Source':'Source'}</p><p class="ech-fiche__txt">${esc((c.source && c.source.fichier) || 'Michon, ARChè 1998')}</p></div>`
      ].join('');
      scroll.innerHTML = `
        <span class="ech-fiche__cat" style="--case-color:${col}">${esc((c.categories || [])[0] ? (CAT_LABEL[c.categories[0]] || c.categories[0]) : (ECHEN?'square':'case'))}</span>
        <span class="ech-fiche__num">${ECHEN?'square':'case'} ${c.numero} / 100</span>
        <p class="ech-fiche__ar" lang="ar" dir="rtl">${esc(c.arabe)}</p>
        <p class="ech-fiche__tr">${esc(c.translitteration)}</p>
        <h2 class="ech-fiche__fr">${esc(c.traduction)}</h2>
        ${cats ? `<p class="ech-fiche__txt" style="font-size:.85rem;color:var(--ech-ink-mute);margin:-.4rem 0 .6rem;">${esc(cats)}</p>` : ''}
        <div class="ech-fiche__mode"><p class="ech-fiche__mode-t">${ECHEN?'You may be here':'Tu es peut-être ici'}</p><p>${ECHEN?'A square is not a label: it is a movement of the soul that everyone passes through. See whether it resonates, see the slope, then take a gesture.':'Une case n\'est pas une étiquette : c\'est un mouvement de l\'âme que tout le monde traverse. Regarde si cela résonne, vois la pente, puis pose un geste.'}</p></div>
        ${champ(ECHEN?'What it is':'Ce que c’est', c.explication_simple, ECHEN?'Commentary to come.':'Explication à venir.')}
        ${(c.symptomes && c.symptomes.length) ? `<div class="ech-fiche__bloc"><p class="ech-fiche__label">${ECHEN?'How I recognise this state':'Comment je reconnais cet état'}</p><ul class="ech-fiche__liste">${c.symptomes.map(sy => `<li>${esc(sy)}</li>`).join('')}</ul></div>` : ''}
        ${c.numero < 100 ? `<div class="ech-fiche__bloc ech-fiche__ordinaire"><p class="ech-fiche__label">${ECHEN?'Natural slope':'Pente naturelle'} <span aria-hidden="true">→</span></p><p class="ech-fiche__txt">${ECHEN?'With no particular leap, the path continues to square ':'Sans saut particulier, le chemin se poursuit vers la case '}${c.numero + 1}${byNum[c.numero + 1] ? ' — ' + esc(byNum[c.numero + 1].traduction) : ''}.</p></div>` : ''}
        ${relationBloc(rel.entrants, ECHEN?'What may have brought me here — a possible origin':'Ce qui a pu m\'amener ici — origine possible', 'entrant')}
        ${relationBloc(rel.sortants, ECHEN?'Where this can lead':'Où cela peut conduire', 'sortant')}
        ${(c.remede && c.remede.length) ? `<div class="ech-fiche__bloc"><p class="ech-fiche__label">${ECHEN?'Action, remedy':'Action, remède'}</p><ul class="ech-fiche__liste">${c.remede.map(r => `<li>${esc(r)}</li>`).join('')}</ul></div>` : ''}
        <div class="ech-fiche__bloc"><p class="ech-fiche__label">${ECHEN?'Question for oneself':'Question pour soi'}</p><p class="ech-fiche__q">${esc(question)}</p></div>
        <div class="ech-suite">
          <button type="button" class="ech-suite__btn" id="ech-continuer">${ECHEN?'Continue the path':'Continuer le chemin'} <span aria-hidden="true">→</span></button>
          <div class="ech-suite__menu" id="ech-suite-menu" hidden>
            <p class="ech-suite__q">${ECHEN?'Where are you, right now?':'Où en es-tu, là ?'}</p>
            <button type="button" class="ech-suite__opt" data-suite="encore">${ECHEN?'I am still in this state':'Je suis encore dans cet état'}</button>
            ${c.numero < 100 ? `<button type="button" class="ech-suite__opt" data-suite="bascule">${ECHEN?'I have moved on → square ':'J\'ai basculé vers la suite → case '}${c.numero + 1}</button>` : ''}
            ${rel.entrants.length ? `<button type="button" class="ech-suite__opt" data-suite="origine">${ECHEN?'I want to understand where it comes from':'Je veux comprendre d\'où ça vient'}</button>` : ''}
            <a class="ech-suite__opt ech-suite__opt--link" href="${_P}/pages/echiquier/journal/?case=${c.numero}">${ECHEN?'Note this moment in my journal':'Noter ce moment dans mon journal'}</a>
            <p class="ech-suite__note" id="ech-suite-note" hidden>${esc(remedeHint)}</p>
          </div>
        </div>
        <a class="ech-fiche__journal ech-fiche__recueil" href="${_P}/pages/carnet/?recueil=1&amp;source=echiquier-${c.numero}">${ECHEN?'❡ Gather a moment when this touched me':'❡ Recueillir un instant où cela m\'a touché'}</a>
        <button type="button" class="ech-fiche__deeptoggle" id="ech-deeptoggle" aria-expanded="false">${ECHEN?'Go further':'Aller plus loin'} <span aria-hidden="true">▾</span></button>
        <div class="ech-fiche__deep" id="ech-deep" hidden>${deepHtml}</div>
        <div class="ech-badge-valid">✦ ${esc(STATUT_TXT[c.statut] || c.statut)}</div>
        <div class="ech-fiche__nav">
          ${prevBtn}
          ${nextBtn}
        </div>`;

      scroll.querySelectorAll('.ech-lien').forEach(b => b.addEventListener('click', () => openCase(+b.dataset.go)));
      document.getElementById('ech-prev')?.addEventListener('click', () => openCase(c.numero - 1));
      document.getElementById('ech-next')?.addEventListener('click', () => openCase(c.numero + 1));
      // Glossaire en surimpression : rend les termes arabes cliquables dans la fiche.
      if (window.EchGloss) window.EchGloss.ready.then(() => window.EchGloss.annotate(scroll));
      const contMenu = document.getElementById('ech-suite-menu');
      document.getElementById('ech-continuer')?.addEventListener('click', () => { if (contMenu) contMenu.hidden = !contMenu.hidden; });
      scroll.querySelectorAll('.ech-suite__opt[data-suite]').forEach(b => b.addEventListener('click', () => {
        const act = b.dataset.suite;
        if (act === 'bascule') openCase(c.numero + 1);
        else if (act === 'origine') { const o = rel.entrants[0]; if (o) openCase(+o.from); }
        else if (act === 'encore') { const nt = document.getElementById('ech-suite-note'); if (nt) nt.hidden = false; }
      }));
      const deepBtn = document.getElementById('ech-deeptoggle');
      const deepEl = document.getElementById('ech-deep');
      deepBtn?.addEventListener('click', () => {
        const willOpen = deepEl.hidden;
        deepEl.hidden = !willOpen;
        deepBtn.setAttribute('aria-expanded', String(willOpen));
        deepBtn.innerHTML = willOpen ? (ECHEN?'Collapse':'Replier')+' <span aria-hidden="true">▴</span>' : (ECHEN?'Go further':'Aller plus loin')+' <span aria-hidden="true">▾</span>';
      });
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
    mount.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:2rem;color:#a85c43;">${ECHEN?'The board could not be loaded.':'Le plateau n\'a pas pu être chargé.'}</p>`;
  }
})();
