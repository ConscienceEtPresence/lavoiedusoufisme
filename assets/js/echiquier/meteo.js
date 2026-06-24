/* ============================================================
   « Comment je me sens aujourd'hui » — carte intérieure.
   Relie un état vécu (langage simple) à une ou plusieurs cases
   de l'Échiquier. Jamais un verdict : « tu sembles proche de… ».
   ============================================================ */
const TON_TXT = { chute: 'Pente possible', montee: 'Ce que cela peut ouvrir', neutre: 'Direction' };
const TON_ICON = { chute: '↓', montee: '↑', neutre: '→' };
// Petites enluminures par ciel
const ORN = {
  feu:  '<path d="M16 3c3 5-2 6 0 10 2-3 4-2 4 1 0 4-3 7-8 7s-8-3-8-8c0-4 3-6 5-9 1 2 2 3 4 3 1-2 2-4 3-5z"/>',
  hawa: '<path d="M16 3c4 6 7 9 7 13a7 7 0 1 1-14 0c0-4 3-7 7-13z"/>',
  nafs: '<circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="4"/>',
  huzn: '<path d="M7 14a9 9 0 1 0 13 8A11 11 0 0 1 7 14z"/>',
  khawf:'<path d="M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16z"/><circle cx="16" cy="16" r="3.5"/>',
  uzla: '<path d="M5 26h22M16 26V8M16 8l-9 12h18z" stroke-linecap="round"/>',
  nur:  '<circle cx="16" cy="16" r="6"/><g stroke-linecap="round"><path d="M16 2v4M16 26v4M2 16h4M26 16h4M6 6l3 3M23 23l3 3M26 6l-3 3M9 23l-3 3"/></g>'
};
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

(async () => {
  const mount = document.getElementById('meteo-ciels');
  if (!mount) return;
  let etatsData, cases = {};
  try {
    etatsData = await fetch('/data/echiquier/etats.json?v=2').then(r => r.json());
    const cj = await fetch('/data/echiquier/cases.json?v=20').then(r => r.json());
    for (const c of cj.cases) cases[c.numero] = c;
  } catch (e) { mount.innerHTML = '<p style="text-align:center;color:#a85c43;">La carte intérieure n\'a pas pu être chargée.</p>'; return; }

  const ciels = etatsData.ciels, etats = etatsData.etats;
  const byCiel = {};
  for (const e of etats) (byCiel[e.ciel] = byCiel[e.ciel] || []).push(e);

  mount.innerHTML = ciels.map(c => `
    <section class="meteo-ciel" style="--ciel:${c.couleur}">
      <header class="meteo-ciel__head">
        <span class="meteo-ciel__orn"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round">${ORN[c.id] || ''}</svg></span>
        <div>
          <p class="meteo-ciel__ar" lang="ar" dir="rtl">${esc(c.ar)}</p>
          <h2 class="meteo-ciel__t">${esc(c.titre)} <span class="meteo-ciel__tr">${esc(c.tr)}</span></h2>
          <p class="meteo-ciel__sous">${esc(c.sous)}</p>
        </div>
      </header>
      <div class="meteo-ciel__etats">
        ${(byCiel[c.id] || []).map(e => `<button type="button" class="meteo-etat" data-id="${esc(e.id)}">${esc(e.label)}</button>`).join('')}
      </div>
    </section>`).join('');

  // --- Panneau d'orientation ---
  const overlay = document.getElementById('meteo-overlay');
  const panel = document.getElementById('meteo-panel');
  const scroll = document.getElementById('meteo-panel-scroll');

  function openEtat(id) {
    const e = etats.find(x => x.id === id); if (!e) return;
    const ciel = ciels.find(c => c.id === e.ciel) || {};
    const ton = e.ton || 'neutre';
    const casesHtml = (e.cases || []).map(n => {
      const c = cases[n]; if (!c) return '';
      return `<a class="meteo-case" href="/pages/echiquier/plateau/#case-${n}">
          <span class="meteo-case__ar" lang="ar" dir="rtl">${esc(c.arabe)}</span>
          <span class="meteo-case__tr">${esc(c.translitteration)}</span>
          <span class="meteo-case__fr">case ${n} — ${esc(c.traduction)}</span>
          <span class="meteo-case__go">ouvrir la fiche complète →</span>
        </a>`;
    }).join('');
    scroll.innerHTML = `
      <span class="meteo-panel__ciel" style="--ciel:${ciel.couleur}">${esc(ciel.titre)} · <span lang="ar" dir="rtl">${esc(ciel.ar)}</span></span>
      <p class="meteo-panel__label">${esc(e.label)}</p>
      <div class="meteo-panel__bloc"><p class="meteo-panel__k">Ce que tu vis</p><p>${esc(e.vis)}</p></div>
      <div class="meteo-panel__bloc meteo-panel__bloc--${ton}"><p class="meteo-panel__k">${TON_TXT[ton]} <span aria-hidden="true">${TON_ICON[ton]}</span></p><p>${esc(e.pente)}</p></div>
      <div class="meteo-panel__bloc"><p class="meteo-panel__k">Un geste, maintenant</p><p>${esc(e.geste)}</p></div>
      <div class="meteo-panel__bloc meteo-panel__q"><p class="meteo-panel__k">Une question pour toi</p><p>${esc(e.question)}</p></div>
      ${e.verif ? `<div class="meteo-panel__bloc meteo-panel__verif"><p class="meteo-panel__k">Pour t'orienter</p><p>${esc(e.verif)}</p></div>` : ''}
      <p class="meteo-panel__suggest">Tu sembles proche de…</p>
      <div class="meteo-panel__cases">${casesHtml}</div>
      <p class="meteo-panel__warn">Une case n'est pas une étiquette ni un jugement : c'est un mouvement de l'âme, que tout le monde traverse. Le danger n'est pas de le ressentir, mais de s'y installer.</p>`;
    if (window.EchGloss) window.EchGloss.ready.then(() => window.EchGloss.annotate(scroll));
    scroll.scrollTop = 0;
    overlay.classList.add('is-open'); panel.classList.add('is-open');
  }
  function close() { overlay.classList.remove('is-open'); panel.classList.remove('is-open'); }

  mount.querySelectorAll('.meteo-etat').forEach(b => b.addEventListener('click', () => openEtat(b.dataset.id)));
  document.getElementById('meteo-panel-close')?.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
