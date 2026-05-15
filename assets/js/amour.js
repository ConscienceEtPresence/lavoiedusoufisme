/* ============================================================
   Les noms de l'amour — moteur de lexique méditatif
   ============================================================ */
(() => {
  const DATA_URL = '../../data/amour.json';
  let DATA = null;

  function load() {
    return fetch(DATA_URL).then(r => r.json()).then(d => { DATA = d; return d; });
  }

  function qs(name) {
    return new URLSearchParams(location.search).get(name);
  }
  function findMot(id) { return DATA.mots.find(m => m.id === id); }
  function findStation(id) { return DATA.stations.find(s => s.id === id); }
  function findTheme(id) { return DATA.themes.find(t => t.id === id); }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function renderProse(texte) {
    // Splits on \n\n into paragraphs. Leaves HTML (em tags) intact.
    return texte.split('\n\n').map(p => `<p>${p}</p>`).join('');
  }

  // ============ Vue : un mot ============
  function renderMot() {
    const id = qs('id');
    const mot = id ? findMot(id) : null;
    const el = document.getElementById('mot-view');
    if (!mot) {
      el.innerHTML = '<p class="mot-error">Mot introuvable. <a href="parcours.html">← Voir tous les mots</a></p>';
      return;
    }

    document.title = `${mot.translit} — ${mot.definition} — Les noms de l'amour — La voie du dedans`;

    const station = findStation(mot.station);
    const themesHtml = (mot.themes || []).map(tid => {
      const t = findTheme(tid);
      return t ? `<a class="mot-meta__tag" href="parcours.html?theme=${tid}">${t.label}</a>` : '';
    }).join('');

    const famille = (mot.famille || []).map(fid => {
      const f = findMot(fid);
      return f ? `<a href="mot.html?id=${fid}" class="mot-famille__lien">${f.translit}</a>` : '';
    }).filter(Boolean).join(' · ');

    // mots-frères : autres mots de la même station
    const freres = DATA.mots
      .filter(m => m.id !== mot.id && m.station === mot.station)
      .slice(0, 3);
    const freresHtml = freres.length ? freres.map(m =>
      `<a class="mot-frere" href="mot.html?id=${m.id}">
        <span class="mot-frere__ar">${m.ar}</span>
        <span class="mot-frere__translit">${m.translit}</span>
        <span class="mot-frere__def">${m.definition}</span>
      </a>`
    ).join('') : '';

    el.innerHTML = `
      <article class="mot-fiche">
        <div class="mot-fiche__station">
          ${station ? `Station ${station.num} · ${station.label}` : ''}
        </div>

        <h1 class="mot-fiche__ar" lang="ar" dir="rtl">${mot.ar}</h1>
        <div class="mot-fiche__translit">${mot.translit}</div>
        <div class="mot-fiche__rule"></div>
        <p class="mot-fiche__def">${escapeHtml(mot.definition)}</p>

        <div class="mot-meta">
          <div class="mot-meta__tags">${themesHtml}</div>
        </div>

        <div class="mot-description">
          ${renderProse(mot.description)}
        </div>

        ${mot.temoin ? `
        <section class="mot-temoin">
          <span class="mot-temoin__label">Témoin</span>
          ${mot.temoin.ar ? `<p class="mot-temoin__ar" lang="ar" dir="rtl">${mot.temoin.ar}</p>` : ''}
          ${mot.temoin.translit ? `<p class="mot-temoin__translit"><em>${mot.temoin.translit}</em></p>` : ''}
          ${mot.temoin.fr ? `<p class="mot-temoin__fr">« ${escapeHtml(mot.temoin.fr)} »</p>` : ''}
          ${mot.temoin.source ? `<p class="mot-temoin__source">— ${escapeHtml(mot.temoin.source)}</p>` : ''}
        </section>
        ` : ''}

        <div class="mot-divider" aria-hidden="true">✦ ✦ ✦</div>

        ${mot.meditation ? `
        <section class="mot-meditation">
          <span class="mot-meditation__label">Pour méditer</span>
          <p class="mot-meditation__text">${escapeHtml(mot.meditation)}</p>
        </section>
        ` : ''}

        ${mot.ouverture ? `
        <section class="mot-ouverture">
          <span class="mot-ouverture__label">Pour ouvrir encore</span>
          <p class="mot-ouverture__text">${mot.ouverture}</p>
        </section>
        ` : ''}

        ${mot.racine || famille ? `
        <section class="mot-racine">
          ${mot.racine ? `<div class="mot-racine__row"><span class="mot-racine__label">Racine</span><span class="mot-racine__value" lang="ar" dir="rtl">${mot.racine}</span></div>` : ''}
          ${famille ? `<div class="mot-racine__row"><span class="mot-racine__label">De la même famille</span><span class="mot-famille">${famille}</span></div>` : ''}
        </section>
        ` : ''}

        ${freresHtml ? `
        <section class="mot-freres">
          <h2 class="mot-freres__title">D'autres mots de cette station</h2>
          <div class="mot-freres__grille">${freresHtml}</div>
        </section>
        ` : ''}

        <nav class="mot-nav">
          <a href="parcours.html" class="mot-nav__link">← Tous les mots</a>
          <a href="hasard.html" class="mot-nav__link mot-nav__link--accent">Tirer un mot au hasard</a>
        </nav>
      </article>
    `;
  }

  // ============ Vue : parcours filtré ============
  function renderParcours() {
    const stationId = qs('station');
    const themeId = qs('theme');

    let filtered = DATA.mots.slice();
    let title = 'Les noms de l\'amour';
    let sub = `${DATA.mots.length} mots — la langue arabe comme cartographie du cœur`;
    let ar = DATA.module.ar;

    if (stationId) {
      const s = findStation(stationId);
      filtered = filtered.filter(m => m.station === stationId);
      if (s) {
        title = `${s.label}`;
        sub = `Station ${s.num} · ${s.desc}`;
        ar = s.ar;
      }
    } else if (themeId) {
      const t = findTheme(themeId);
      filtered = filtered.filter(m => (m.themes || []).includes(themeId));
      if (t) {
        title = t.label;
        sub = t.desc;
        ar = t.ar;
      }
    }

    document.title = `${title} — Les noms de l'amour — La voie du dedans`;

    const headerEl = document.getElementById('parcours-header');
    headerEl.innerHTML = `
      <div class="bi-header__ar">${ar}</div>
      <h1 class="bi-header__name">${escapeHtml(title)}</h1>
      <div class="bi-header__rule"></div>
      <p class="bi-header__tag">${escapeHtml(sub)}</p>
    `;

    const grilleEl = document.getElementById('parcours-grille');
    if (filtered.length === 0) {
      grilleEl.innerHTML = '<p class="parcours-empty">Aucun mot publié dans cette catégorie pour l\'instant — la moisson continue.</p>';
    } else {
      grilleEl.innerHTML = filtered.map(m => {
        const s = findStation(m.station);
        return `
          <a class="mot-carte" href="mot.html?id=${m.id}">
            <div class="mot-carte__station">${s ? `Station ${s.num}` : ''}</div>
            <div class="mot-carte__ar" lang="ar" dir="rtl">${m.ar}</div>
            <div class="mot-carte__translit">${m.translit}</div>
            <p class="mot-carte__def">${escapeHtml(m.definition)}</p>
          </a>
        `;
      }).join('');
    }

    const filtresEl = document.getElementById('parcours-filtres');
    if (filtresEl) {
      const stationsHtml = DATA.stations.map(s => {
        const active = stationId === s.id ? ' active' : '';
        return `<a class="parcours-pill${active}" href="parcours.html?station=${s.id}">${s.num} · ${s.label}</a>`;
      }).join('');
      const themesHtml = DATA.themes.map(t => {
        const active = themeId === t.id ? ' active' : '';
        return `<a class="parcours-pill parcours-pill--theme${active}" href="parcours.html?theme=${t.id}">${t.label}</a>`;
      }).join('');
      const tousActive = (!stationId && !themeId) ? ' active' : '';
      filtresEl.innerHTML = `
        <div class="parcours-filtre-groupe">
          <span class="parcours-filtre-label">Stations</span>
          <div class="parcours-filtre-pills">
            <a class="parcours-pill${tousActive}" href="parcours.html">Tous</a>
            ${stationsHtml}
          </div>
        </div>
        <div class="parcours-filtre-groupe">
          <span class="parcours-filtre-label">Thèmes</span>
          <div class="parcours-filtre-pills">${themesHtml}</div>
        </div>
      `;
    }
  }

  // ============ Vue : hasard ============
  function renderHasard() {
    const mot = DATA.mots[Math.floor(Math.random() * DATA.mots.length)];
    location.replace('mot.html?id=' + mot.id);
  }

  // ============ Init ============
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    load().then(() => {
      if (page === 'mot')         renderMot();
      else if (page === 'parcours') renderParcours();
      else if (page === 'hasard')   renderHasard();
    }).catch(err => {
      console.error('Erreur Amour:', err);
      const main = document.querySelector('main');
      if (main) main.insertAdjacentHTML('beforeend', '<p style="text-align:center;color:#a00;padding:2rem;">Erreur de chargement du lexique.</p>');
    });
  });
})();
