/* ============================================================
   Les noms de l'amour — moteur de lexique méditatif
   ============================================================ */
(() => {
  const DATA_URL = '../../data/amour.json';
  let DATA = null;

  const AM_EN = document.documentElement.lang === 'en';
  const AM_T = AM_EN ? {
    motNotFound: 'Word not found. <a href="parcours.html">← See all the words</a>',
    siteName: "The names of love — The Inner Path",
    defaultTitle: "The names of love",
    stationLabel: (num, label) => `Station ${num} · ${label}`,
    stationNum: n => `Station ${n}`,
    witness: 'Witness',
    toMeditate: 'To meditate',
    toOpenFurther: 'To open further',
    root: 'Root',
    sameFamily: 'Of the same family',
    otherWords: 'Other words from this station',
    allWords: '← All the words',
    drawRandom: 'Draw a word at random',
    subAll: n => `${n} words — the Arabic language as a cartography of the heart`,
    emptyCat: 'No word published in this category for now — the harvest continues.',
    stations: 'Stations',
    all: 'All',
    themes: 'Themes',
    loadError: 'Error loading the lexicon.',
    oq: '“', cq: '”'
  } : {
    motNotFound: 'Mot introuvable. <a href="parcours.html">← Voir tous les mots</a>',
    siteName: "Les noms de l'amour — La voie du dedans",
    defaultTitle: "Les noms de l'amour",
    stationLabel: (num, label) => `Station ${num} · ${label}`,
    stationNum: n => `Station ${n}`,
    witness: 'Témoin',
    toMeditate: 'Pour méditer',
    toOpenFurther: 'Pour ouvrir encore',
    root: 'Racine',
    sameFamily: 'De la même famille',
    otherWords: "D'autres mots de cette station",
    allWords: '← Tous les mots',
    drawRandom: 'Tirer un mot au hasard',
    subAll: n => `${n} mots — la langue arabe comme cartographie du cœur`,
    emptyCat: "Aucun mot publié dans cette catégorie pour l'instant — la moisson continue.",
    stations: 'Stations',
    all: 'Tous',
    themes: 'Thèmes',
    loadError: 'Erreur de chargement du lexique.',
    oq: '« ', cq: ' »'
  };

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
      el.innerHTML = `<p class="mot-error">${AM_T.motNotFound}</p>`;
      return;
    }

    document.title = `${mot.translit} — ${mot.definition} — ${AM_T.siteName}`;

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
          ${station ? AM_T.stationLabel(station.num, station.label) : ''}
        </div>

        <h1 class="mot-fiche__ar" lang="ar" dir="rtl">${mot.ar}</h1>
        <div class="mot-fiche__translit">${mot.translit}</div>
        <div class="mot-fiche__rule"></div>
        <p class="mot-fiche__def">${escapeHtml(mot.definition)}</p>
        <button type="button" class="mot-share" data-share-mot title="${document.documentElement.lang === 'en' ? 'Offer' : 'Offrir'}" aria-label="${document.documentElement.lang === 'en' ? 'Offer this word' : 'Offrir ce mot'}"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 16.5c4.6 1.1 8.8-.3 12.4-4.1.9-1 1.8-2.3 3.2-2.3.8 0 1.4.6 1.4 1.4 0 .9-.7 1.5-1.6 1.7 1.7.4 3.4-.2 4.9-1.5-.4 2.1-1.8 3.8-3.8 4.6 1.1.3 2.2.2 3.3-.3-1.3 1.7-3.2 2.8-5.4 3 .2 1.2.6 2.3 1.4 3.2-2.2-.5-3.8-2-4.6-4.1-3 .7-6 .3-8.8-1.1.9-.2 1.8-.6 2.5-1.2-1.6-.4-2.9-1.5-3.4-3z"/></svg></button>

        <div class="mot-meta">
          <div class="mot-meta__tags">${themesHtml}</div>
        </div>

        <div class="mot-description">
          ${renderProse(mot.description)}
        </div>

        ${mot.temoin ? `
        <section class="mot-temoin">
          <span class="mot-temoin__label">${AM_T.witness}</span>
          ${mot.temoin.ar ? `<p class="mot-temoin__ar" lang="ar" dir="rtl">${mot.temoin.ar}</p>` : ''}
          ${mot.temoin.translit ? `<p class="mot-temoin__translit"><em>${mot.temoin.translit}</em></p>` : ''}
          ${mot.temoin.fr ? `<p class="mot-temoin__fr">${AM_T.oq}${escapeHtml(mot.temoin.fr)}${AM_T.cq}</p>` : ''}
          ${mot.temoin.source ? `<p class="mot-temoin__source">— ${escapeHtml(mot.temoin.source)}</p>` : ''}
        </section>
        ` : ''}

        <div class="mot-divider" aria-hidden="true">✦ ✦ ✦</div>

        ${mot.meditation ? `
        <section class="mot-meditation">
          <span class="mot-meditation__label">${AM_T.toMeditate}</span>
          <p class="mot-meditation__text">${mot.meditation}</p>
        </section>
        ` : ''}

        ${mot.ouverture ? `
        <section class="mot-ouverture">
          <span class="mot-ouverture__label">${AM_T.toOpenFurther}</span>
          <p class="mot-ouverture__text">${mot.ouverture}</p>
        </section>
        ` : ''}

        ${mot.racine || famille ? `
        <section class="mot-racine">
          ${mot.racine ? `<div class="mot-racine__row"><span class="mot-racine__label">${AM_T.root}</span><span class="mot-racine__value" lang="ar" dir="rtl">${mot.racine}</span></div>` : ''}
          ${famille ? `<div class="mot-racine__row"><span class="mot-racine__label">${AM_T.sameFamily}</span><span class="mot-famille">${famille}</span></div>` : ''}
        </section>
        ` : ''}

        ${freresHtml ? `
        <section class="mot-freres">
          <h2 class="mot-freres__title">${AM_T.otherWords}</h2>
          <div class="mot-freres__grille">${freresHtml}</div>
        </section>
        ` : ''}

        <nav class="mot-nav">
          <a href="parcours.html" class="mot-nav__link">${AM_T.allWords}</a>
          <a href="hasard.html" class="mot-nav__link mot-nav__link--accent">${AM_T.drawRandom}</a>
        </nav>
      </article>
    `;

    const sb = el.querySelector('[data-share-mot]');
    if (sb) sb.addEventListener('click', function () {
      ensurePartage(function () {
        window.LVDDPartage.open({
          ar: mot.ar, tr: mot.translit, text: mot.definition,
          attribution: (document.documentElement.lang === 'en' ? 'Words of Love' : "Les mots de l'amour")
        });
      });
    });
  }

  function ensurePartage(cb) {
    if (window.LVDDPartage) { cb(); return; }
    let s = document.querySelector('script[data-partage-js]');
    if (!s) {
      s = document.createElement('script');
      s.src = '../../assets/js/partage.js?v=1';
      s.dataset.partageJs = '1';
      document.head.appendChild(s);
    }
    s.addEventListener('load', function () { if (window.LVDDPartage) cb(); });
  }

  // ============ Vue : parcours filtré ============
  function renderParcours() {
    const stationId = qs('station');
    const themeId = qs('theme');

    let filtered = DATA.mots.slice();
    let title = AM_T.defaultTitle;
    let sub = AM_T.subAll(DATA.mots.length);
    let ar = DATA.module.ar;

    if (stationId) {
      const s = findStation(stationId);
      filtered = filtered.filter(m => m.station === stationId);
      if (s) {
        title = `${s.label}`;
        sub = `${AM_T.stationNum(s.num)} · ${s.desc}`;
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

    document.title = `${title} — ${AM_T.siteName}`;

    const headerEl = document.getElementById('parcours-header');
    headerEl.innerHTML = `
      <div class="bi-header__ar">${ar}</div>
      <h1 class="bi-header__name">${escapeHtml(title)}</h1>
      <div class="bi-header__rule"></div>
      <p class="bi-header__tag">${escapeHtml(sub)}</p>
    `;

    const grilleEl = document.getElementById('parcours-grille');
    if (filtered.length === 0) {
      grilleEl.innerHTML = `<p class="parcours-empty">${AM_T.emptyCat}</p>`;
    } else {
      grilleEl.innerHTML = filtered.map(m => {
        const s = findStation(m.station);
        return `
          <a class="mot-carte" href="mot.html?id=${m.id}">
            <div class="mot-carte__station">${s ? AM_T.stationNum(s.num) : ''}</div>
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
          <span class="parcours-filtre-label">${AM_T.stations}</span>
          <div class="parcours-filtre-pills">
            <a class="parcours-pill${tousActive}" href="parcours.html">${AM_T.all}</a>
            ${stationsHtml}
          </div>
        </div>
        <div class="parcours-filtre-groupe">
          <span class="parcours-filtre-label">${AM_T.themes}</span>
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
      if (main) main.insertAdjacentHTML('beforeend', `<p style="text-align:center;color:#a00;padding:2rem;">${AM_T.loadError}</p>`);
    });
  });
})();
