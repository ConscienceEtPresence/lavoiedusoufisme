/* ============================================================
   « Mes répétitions » — synthèse douce du journal local.
   Lit ech_journal_v1, agrège par case / moment / état, sur
   7 / 30 jours ou tout. Rien ne quitte l'appareil.
   ============================================================ */
const KEY = 'ech_journal_v1';
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const MOMENT_LABEL = { grappin_evite: 'grappin évité', grappin_rencontre: 'grappin rencontré', fleche_activee: 'flèche activée' };

function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }

(async () => {
  const ECHROOT = (document.documentElement.lang === "en" ? "/en" : "") + "/data/echiquier/";
  const content = document.getElementById('rep-content');
  if (!content) return;
  let byNum = {};
  try {
    const d = await fetch(ECHROOT + 'cases.json?v=20').then(r => r.json());
    for (const c of d.cases) byNum[c.numero] = c;
  } catch (e) {}

  const nom = n => byNum[n] ? `${n} — ${byNum[n].traduction}` : `case ${n}`;
  const tally = (arr, keyFn) => {
    const m = new Map();
    for (const e of arr) { const k = keyFn(e); if (k == null || k === '') continue; m.set(k, (m.get(k) || 0) + 1); }
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };

  function listCard(title, rows, asCase) {
    if (!rows.length) return '';
    const max = rows[0][1];
    const items = rows.slice(0, 8).map(([k, n]) => {
      const label = asCase ? `<a href="/pages/echiquier/plateau/#case-${k}">${esc(nom(+k))}</a>` : `<span>${esc(k)}</span>`;
      return `<li><span class="rep-list__lab">${label}<span class="rep-bar" style="width:${Math.round(n / max * 100)}%"></span></span><span class="rep-list__n">${n}</span></li>`;
    }).join('');
    return `<div class="rep-card"><p class="rep-card__t">${esc(title)}</p><ul class="rep-list">${items}</ul></div>`;
  }
  function countCard(title, pairs) {
    const items = pairs.filter(p => p[1] > 0).map(([lab, n, cls]) =>
      `<li><span>${esc(lab)}</span><span class="rep-list__n rep-list__n--${cls}">${n}</span></li>`).join('');
    if (!items) return '';
    return `<div class="rep-card"><p class="rep-card__t">${esc(title)}</p><ul class="rep-list">${items}</ul></div>`;
  }

  function render(days) {
    const all = load();
    const since = days ? Date.now() - days * 86400000 : 0;
    const arr = all.filter(e => (e.le || 0) >= since);
    if (!arr.length) {
      content.innerHTML = `<p class="rep-empty">${all.length
        ? 'Aucune note sur cette période. Essayez « tout », ou déposez une note dans le journal.'
        : 'Votre journal est encore vierge. Dès que vous y déposerez des notes (depuis une case ou la carte intérieure), vos boucles intérieures apparaîtront ici.'}</p>`;
      return;
    }
    const cases = tally(arr, e => e.case);
    const etats = tally(arr, e => (e.etat || '').trim().toLowerCase());
    const evite = arr.filter(e => e.moment === 'grappin_evite').length;
    const rencontre = arr.filter(e => e.moment === 'grappin_rencontre').length;
    const fleche = arr.filter(e => e.moment === 'fleche_activee').length;

    const phrase = cases.length
      ? `<p class="rep-note" style="margin:0 auto 1rem;">Sur cette période, votre âme est revenue le plus souvent vers&nbsp;: <strong>${cases.slice(0, 3).map(([k]) => esc(nom(+k))).join(' · ')}</strong>.</p>`
      : '';

    const cards = [
      listCard('Cases les plus fréquentes', cases, true),
      countCard('Vos mouvements', [
        ['✓ Grappins évités', evite, 'up'],
        ['↑ Flèches activées', fleche, 'up'],
        ['⛓ Grappins rencontrés', rencontre, 'down'],
      ]),
      listCard('États les plus fréquents', etats, false),
    ].filter(Boolean).join('');

    content.innerHTML = phrase + `<div class="rep-grid">${cards}</div>` +
      `<p class="rep-note" style="margin-top:1rem;">${arr.length} note${arr.length > 1 ? 's' : ''} sur la période.</p>`;
  }

  let days = 7;
  const periodEl = document.getElementById('rep-period');
  periodEl?.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    days = +b.dataset.days;
    periodEl.querySelectorAll('button').forEach(x => x.classList.toggle('is-on', x === b));
    render(days);
  }));
  render(days);
})();
