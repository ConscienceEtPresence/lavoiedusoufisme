/* ============================================================
   Nasr Eddin Hodja — moteur d'anthologie méditative
   ============================================================ */
(() => {
  const DATA_URL = '../../../data/nasr-eddin.json';
  // Chemin relatif depuis /pages/contes/nasr-eddin/*.html → /data/nasr-eddin.json

  let DATA = null;

  // ============ Chargement ============
  function load() {
    return fetch(DATA_URL).then(r => r.json()).then(d => { DATA = d; return d; });
  }

  // ============ Utilitaires ============
  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }
  function findConte(id) { return DATA.contes.find(c => c.id === id); }
  function findTheme(id) { return DATA.themes.find(t => t.id === id); }
  function findEsprit(id) { return DATA.esprits.find(e => e.id === id); }
  function findHumeur(id) { return DATA.humeurs.find(h => h.id === id); }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function renderTexte(texte) {
    // Convert \n\n into <p> blocks, \n into <br>
    return texte.split('\n\n').map(para =>
      '<p>' + escapeHtml(para).replace(/\n/g, '<br>') + '</p>'
    ).join('');
  }

  // ============ Vue : un conte ============
  function renderConte() {
    const id = qs('id');
    const conte = id ? findConte(id) : null;
    const el = document.getElementById('conte-view');
    if (!conte) {
      el.innerHTML = '<p class="conte-error">Conte introuvable. <a href="parcours.html">← Voir tous les contes</a></p>';
      return;
    }

    document.title = `${conte.titre} — Nasr Eddin Hodja — La voie du dedans`;

    const themesHtml = conte.themes.map(tid => {
      const t = findTheme(tid);
      return t ? `<a class="conte-meta__tag" href="parcours.html?theme=${tid}">${t.label}</a>` : '';
    }).join('');
    const espritsHtml = conte.esprits.map(eid => {
      const e = findEsprit(eid);
      return e ? `<a class="conte-meta__tag conte-meta__tag--esprit" href="parcours.html?esprit=${eid}">${e.label}</a>` : '';
    }).join('');

    // contes-soeurs : autres contes partageant au moins un esprit
    const soeurs = DATA.contes
      .filter(c => c.id !== conte.id && c.esprits.some(e => conte.esprits.includes(e)))
      .slice(0, 3);
    const soeursHtml = soeurs.map(c => {
      const espritLabels = c.esprits.map(e => findEsprit(e)?.label).filter(Boolean).join(' · ');
      return `<a class="conte-soeur" href="conte.html?id=${c.id}"><span class="conte-soeur__titre">${c.titre}</span><span class="conte-soeur__esprits">${escapeHtml(espritLabels)}</span></a>`;
    }).join('');

    el.innerHTML = `
      <article class="conte-fiche">
        <div class="conte-fiche__corpus">حِكَايَة · Hodja</div>
        <h1 class="conte-fiche__titre">${escapeHtml(conte.titre)}</h1>

        <div class="conte-meta">
          <div class="conte-meta__row">
            <span class="conte-meta__label">Thème</span>
            <div class="conte-meta__tags">${themesHtml}</div>
          </div>
          <div class="conte-meta__row">
            <span class="conte-meta__label">Esprit</span>
            <div class="conte-meta__tags">${espritsHtml}</div>
          </div>
        </div>

        <div class="conte-texte">
          ${renderTexte(conte.texte)}
        </div>

        <div class="conte-divider" aria-hidden="true">✦ ✦ ✦</div>

        <div class="conte-question">
          <span class="conte-question__label">Pour méditer</span>
          <p class="conte-question__text">${escapeHtml(conte.question)}</p>
        </div>

        ${conte.meditation ? `
        <section class="conte-suggestion">
          <span class="conte-suggestion__label">Pour ouvrir encore</span>
          <p class="conte-suggestion__text">${conte.meditation}</p>
        </section>
        ` : ''}

        ${soeursHtml ? `
        <section class="conte-resonances">
          <h2 class="conte-resonances__title">Contes-frères</h2>
          <p class="conte-resonances__hint">D'autres miroirs sur le même esprit :</p>
          <div class="conte-soeurs">${soeursHtml}</div>
        </section>
        ` : ''}

        <div class="conte-source">
          <em>${escapeHtml(conte.source || 'Tradition orale')}</em>
        </div>

        <nav class="conte-nav">
          <a href="parcours.html" class="conte-nav__link">← Tous les contes</a>
          <a href="hasard.html" class="conte-nav__link conte-nav__link--accent">Tirer un autre au hasard</a>
        </nav>
      </article>
    `;
  }

  // ============ Vue : liste filtrée ============
  function renderParcours() {
    const theme = qs('theme');
    const esprit = qs('esprit');
    const humeur = qs('humeur');

    let filtered = DATA.contes.slice();
    let title = 'Tous les contes';
    let sub = `${DATA.contes.length} récits — ce qui s'ouvre quand l'idiot parle`;
    let ar = 'حِكَايَات';

    if (theme) {
      const t = findTheme(theme);
      filtered = filtered.filter(c => c.themes.includes(theme));
      title = t ? t.label : 'Thème inconnu';
      sub = t ? t.desc : '';
      ar = t ? t.ar : ar;
    } else if (esprit) {
      const e = findEsprit(esprit);
      filtered = filtered.filter(c => c.esprits.includes(esprit));
      title = e ? `${e.symbol} ${e.label}` : 'Esprit inconnu';
      sub = e ? e.desc : '';
    } else if (humeur) {
      const h = findHumeur(humeur);
      filtered = filtered.filter(c => c.humeurs.includes(humeur));
      title = h ? h.label : 'Humeur inconnue';
      sub = h ? h.desc : '';
    }

    document.title = `${title.replace(/^[⌀-￿]\s*/, '')} — Nasr Eddin Hodja — La voie du dedans`;

    const headerEl = document.getElementById('parcours-header');
    headerEl.innerHTML = `
      <div class="bi-header__ar">${ar}</div>
      <h1 class="bi-header__name">${escapeHtml(title)}</h1>
      <div class="bi-header__rule"></div>
      <p class="bi-header__tag">${escapeHtml(sub)}</p>
    `;

    const grilleEl = document.getElementById('parcours-grille');
    if (filtered.length === 0) {
      grilleEl.innerHTML = '<p class="parcours-empty">Aucun conte ne correspond — encore. Reviens plus tard, la moisson s\'étoffe.</p>';
      return;
    }

    grilleEl.innerHTML = filtered.map(c => {
      const espritLabels = c.esprits.map(eid => findEsprit(eid)?.label).filter(Boolean).join(' · ');
      const extrait = c.texte.replace(/\n+/g, ' ').slice(0, 140) + '…';
      return `
        <a class="conte-carte-mini" href="conte.html?id=${c.id}">
          <div class="conte-carte-mini__esprits">${escapeHtml(espritLabels)}</div>
          <h3 class="conte-carte-mini__titre">${escapeHtml(c.titre)}</h3>
          <p class="conte-carte-mini__extrait">${escapeHtml(extrait)}</p>
          <p class="conte-carte-mini__question">${escapeHtml(c.question)}</p>
        </a>
      `;
    }).join('');

    // Rendre la barre de filtres si elle existe
    const filtresEl = document.getElementById('parcours-filtres');
    if (filtresEl) {
      renderFiltres(filtresEl, { theme, esprit, humeur });
    }
  }

  function renderFiltres(el, current) {
    const themesHtml = DATA.themes.map(t => {
      const active = current.theme === t.id ? ' active' : '';
      return `<a class="parcours-pill${active}" href="parcours.html?theme=${t.id}">${t.label}</a>`;
    }).join('');
    const espritsHtml = DATA.esprits.map(e => {
      const active = current.esprit === e.id ? ' active' : '';
      return `<a class="parcours-pill parcours-pill--esprit${active}" href="parcours.html?esprit=${e.id}">${e.label}</a>`;
    }).join('');
    const humeursHtml = DATA.humeurs.map(h => {
      const active = current.humeur === h.id ? ' active' : '';
      return `<a class="parcours-pill parcours-pill--humeur${active}" href="parcours.html?humeur=${h.id}">${h.label}</a>`;
    }).join('');
    const tousActive = (!current.theme && !current.esprit && !current.humeur) ? ' active' : '';

    el.innerHTML = `
      <div class="parcours-filtre-groupe">
        <span class="parcours-filtre-label">Par thème</span>
        <div class="parcours-filtre-pills">
          <a class="parcours-pill${tousActive}" href="parcours.html">Tous</a>
          ${themesHtml}
        </div>
      </div>
      <div class="parcours-filtre-groupe">
        <span class="parcours-filtre-label">Par esprit</span>
        <div class="parcours-filtre-pills">${espritsHtml}</div>
      </div>
      <div class="parcours-filtre-groupe">
        <span class="parcours-filtre-label">Par humeur</span>
        <div class="parcours-filtre-pills">${humeursHtml}</div>
      </div>
    `;
  }

  // ============ Vue : hasard ============
  function renderHasard() {
    const conte = DATA.contes[Math.floor(Math.random() * DATA.contes.length)];
    location.replace('conte.html?id=' + conte.id);
  }

  // ============ Init ============
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    load().then(() => {
      if (page === 'conte')    renderConte();
      else if (page === 'parcours') renderParcours();
      else if (page === 'hasard')   renderHasard();
    }).catch(err => {
      console.error('Erreur Hodja:', err);
      const main = document.querySelector('main');
      if (main) main.insertAdjacentHTML('beforeend', '<p style="text-align:center;color:#a00;padding:2rem;">Erreur de chargement des contes.</p>');
    });
  });
})();
