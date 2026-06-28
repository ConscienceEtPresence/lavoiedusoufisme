const ECHEN = document.documentElement.lang === "en";
const _P = ECHEN ? "/en" : "";
/* ============================================================
   L'Échiquier — pages de liste (chutes, remèdes, glossaire)
   Lit data/echiquier/cases.json et dresse des cartes reliées au
   plateau (#case-N). La vue est donnée par window.ECH_VUE.
   ============================================================ */
const ECH_CAT_COLOR = {
  chute: 'var(--c-chute)', maladie_de_l_ame: 'var(--c-chute)', danger: 'var(--c-danger)',
  vertu: 'var(--c-vertu)', remede: 'var(--c-vertu)', station: 'var(--c-station)', voie: 'var(--c-voie)',
  pratique: 'var(--c-voie)', connaissance: 'var(--c-connaissance)', realisation: 'var(--c-realisation)',
  monde: 'var(--c-monde)', ange: 'var(--c-ange)', element: 'var(--c-element)', concept: 'var(--c-concept)',
  metaphysique: 'var(--c-concept)', etat: 'var(--c-etat)', illusion: 'var(--c-illusion)', naissance: 'var(--c-naissance)'
};
const VUES = {
  chutes: { cats: ['chute', 'maladie_de_l_ame', 'danger', 'illusion'], tri: 'numero' },
  remedes: { cats: ['vertu', 'remede'], tri: 'numero' },
  glossaire: { cats: null, tri: 'alpha' },
};
const _esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const _caseLabel = c => c ? `<span class="ar" lang="ar" dir="rtl">${_esc(c.arabe)}</span><span class="fr">${_esc(c.traduction)}</span>` : (ECHEN?'square to verify':'case à vérifier');
const _movementTitle = type => ECHEN ? (type==='chute'?'The 9 confirmed grapnels':'The 8 confirmed ascents') : (type === 'chute' ? 'Les 9 grappins confirmés' : 'Les 8 montées confirmées');
const _movementIntro = type => ECHEN ? (type === 'chute'
  ? 'These movements are not mere setbacks: they show how an inner deformation hooks the traveller and brings him back toward a lower square.'
  : 'These movements show the elevations confirmed in the commentary: a right disposition opens a progress toward a higher square.') : (type === 'chute'
  ? 'Ces mouvements ne sont pas de simples reculs : ils montrent comment une déformation intérieure accroche le voyageur et le ramène vers une case plus basse.'
  : 'Ces mouvements montrent les élévations confirmées dans le commentaire : une disposition juste ouvre une progression vers une case plus haute.');
const _movementVerb = type => ECHEN ? (type==='chute'?'falls toward':'rises toward') : (type === 'chute' ? 'tombe vers' : 's’élève vers');

function movementGuide(vueId, liens, byNum) {
  const type = vueId === 'chutes' ? 'chute' : (vueId === 'remedes' ? 'montee' : null);
  if (!type) return '';
  const rels = (liens || []).filter(l => l.type === type).sort((a, b) => (+a.from) - (+b.from));
  if (!rels.length) return '';
  return `
    <section class="ech-mvt-guide ech-mvt-guide--${type}" id="ech-mouvements-guide" aria-label="${_movementTitle(type)}">
      <div class="ech-mvt-guide__head">
        <p class="ech-mode-emploi__eyebrow">${ECHEN?'Movements of the board':'Mouvements du plateau'}</p>
        <h2>${_movementTitle(type)}</h2>
        <p>${_movementIntro(type)}</p>
      </div>
      <div class="ech-mvt-guide__grid">
        ${rels.map(l => {
          const from = byNum[+l.from];
          const to = byNum[+l.to];
          return `<article class="ech-mvt-card ech-mvt-card--${type}">
            <p class="ech-mvt-card__nums">${ECHEN?'square':'case'} ${+l.from} <span>${_movementVerb(type)}</span> ${ECHEN?'square':'case'} ${+l.to}</p>
            <p class="ech-mvt-card__cases">
              <a href="${_P}/pages/echiquier/plateau/#case-${+l.from}">${_caseLabel(from)}</a>
              <span aria-hidden="true">→</span>
              <a href="${_P}/pages/echiquier/plateau/#case-${+l.to}">${_caseLabel(to)}</a>
            </p>
            <p class="ech-mvt-card__lecture">${_esc(l.lecture || '')}</p>
          </article>`;
        }).join('')}
      </div>
    </section>`;
}

(async () => {
  const ECHROOT = (document.documentElement.lang === "en" ? "/en" : "") + "/data/echiquier/";
  const mount = document.getElementById('ech-liste');
  if (!mount) return;
  const vueId = window.ECH_VUE || 'glossaire';
  const vue = VUES[window.ECH_VUE] || VUES.glossaire;
  try {
    const [data, liensData] = await Promise.all([
      fetch(ECHROOT + 'cases.json?v=20').then(r => r.json()),
      fetch(ECHROOT + 'liens.json?v=9').then(r => r.json()).catch(() => ({ liens: [] }))
    ]);
    let cases = (data.cases || []).slice();
    const byNum = {};
    for (const c of cases) byNum[c.numero] = c;
    if (vue.cats) cases = cases.filter(c => (c.categories || []).some(cat => vue.cats.includes(cat)));
    // Tri alphabétique sur le mot signifiant : on retire l'article « al- »
    // et les signes ʿ/ʾ, sinon tout se range sous « a ».
    const sortKey = s => (s || '')
      .replace(/^al-?\s*/i, '')
      .replace(/^[ʿʾ'’]/, '')
      .normalize('NFD').replace(/[̀-ͯʿʾ]/g, '')
      .toLowerCase().trim();
    if (vue.tri === 'alpha') cases.sort((a, b) => sortKey(a.translitteration).localeCompare(sortKey(b.translitteration), 'fr'));
    else cases.sort((a, b) => a.numero - b.numero);

    document.getElementById('ech-mouvements-guide')?.remove();
    const guideHtml = movementGuide(vueId, liensData.liens || [], byNum);
    if (guideHtml) mount.insertAdjacentHTML('beforebegin', guideHtml);

    mount.innerHTML = cases.map(c => {
      const col = ECH_CAT_COLOR[(c.categories || [])[0]] || 'var(--ech-gold)';
      return `
        <a class="ech-cardlink" href="${_P}/pages/echiquier/plateau/#case-${c.numero}" style="--case-color:${col}">
          <div class="ech-cardlink__top">
            <span class="ech-cardlink__ar" lang="ar" dir="rtl">${_esc(c.arabe)}</span>
            <span class="ech-cardlink__num">${c.numero}</span>
          </div>
          <span class="ech-cardlink__tr">${_esc(c.translitteration)}</span>
          <span class="ech-cardlink__fr">${_esc(c.traduction)}</span>
          ${c.explication_simple ? `<span class="ech-cardlink__d">${_esc(c.explication_simple)}</span>` : ''}
          ${c.statut === 'a_confirmer' ? (ECHEN?'<span class="ech-cardlink__warn">to confirm</span>':'<span class="ech-cardlink__warn">à confirmer</span>') : ''}
        </a>`;
    }).join('');

    const countEl = document.getElementById('ech-liste-count');
    if (countEl) countEl.textContent = cases.length + (ECHEN ? (vue.tri==='alpha'?' terms':' squares') : (vue.tri === 'alpha' ? ' termes' : ' cases'));
  } catch (e) {
    console.error(e);
    mount.innerHTML = '<p style="text-align:center;color:#a85c43;padding:2rem;">'+(ECHEN?'The list could not be loaded.':'La liste n\'a pas pu être chargée.')+'</p>';
  }
})();
