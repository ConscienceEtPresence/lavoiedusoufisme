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

(async () => {
  const mount = document.getElementById('ech-liste');
  const vue = VUES[window.ECH_VUE] || VUES.glossaire;
  try {
    const data = await fetch('/data/echiquier/cases.json?v=18').then(r => r.json());
    let cases = (data.cases || []).slice();
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

    mount.innerHTML = cases.map(c => {
      const col = ECH_CAT_COLOR[(c.categories || [])[0]] || 'var(--ech-gold)';
      return `
        <a class="ech-cardlink" href="/pages/echiquier/plateau/#case-${c.numero}" style="--case-color:${col}">
          <div class="ech-cardlink__top">
            <span class="ech-cardlink__ar" lang="ar" dir="rtl">${_esc(c.arabe)}</span>
            <span class="ech-cardlink__num">${c.numero}</span>
          </div>
          <span class="ech-cardlink__tr">${_esc(c.translitteration)}</span>
          <span class="ech-cardlink__fr">${_esc(c.traduction)}</span>
          ${c.explication_simple ? `<span class="ech-cardlink__d">${_esc(c.explication_simple)}</span>` : ''}
          ${c.statut === 'a_confirmer' ? '<span class="ech-cardlink__warn">à confirmer</span>' : ''}
        </a>`;
    }).join('');

    const countEl = document.getElementById('ech-liste-count');
    if (countEl) countEl.textContent = cases.length + (vue.tri === 'alpha' ? ' termes' : ' cases');
  } catch (e) {
    console.error(e);
    mount.innerHTML = '<p style="text-align:center;color:#a85c43;padding:2rem;">La liste n\'a pas pu être chargée.</p>';
  }
})();
