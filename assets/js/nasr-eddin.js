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

  // ============ Carnet (localStorage) ============
  const CARNET_KEY = 'lvdd-hodja-carnet-v1';
  function getCarnet() {
    try { return JSON.parse(localStorage.getItem(CARNET_KEY) || '{}'); }
    catch (e) { return {}; }
  }
  function setCarnetEntry(conteId, texte) {
    const c = getCarnet();
    if (texte && texte.trim()) {
      c[conteId] = { texte: texte.trim(), date: new Date().toISOString() };
    } else {
      delete c[conteId];
    }
    localStorage.setItem(CARNET_KEY, JSON.stringify(c));
  }
  function getCarnetEntry(conteId) {
    const c = getCarnet();
    return c[conteId] || null;
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
      return e ? `<a class="conte-meta__tag conte-meta__tag--esprit" href="parcours.html?esprit=${eid}">${e.symbol} ${e.label}</a>` : '';
    }).join('');

    const saved = getCarnetEntry(conte.id);
    const carnetText = saved ? escapeHtml(saved.texte) : '';

    // contes-soeurs : autres contes partageant au moins un esprit
    const soeurs = DATA.contes
      .filter(c => c.id !== conte.id && c.esprits.some(e => conte.esprits.includes(e)))
      .slice(0, 3);
    const soeursHtml = soeurs.map(c =>
      `<a class="conte-soeur" href="conte.html?id=${c.id}"><span class="conte-soeur__titre">${c.titre}</span><span class="conte-soeur__esprits">${c.esprits.map(e => findEsprit(e)?.symbol || '').join(' ')}</span></a>`
    ).join('');

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

        <section class="conte-carnet">
          <h2 class="conte-carnet__title">✎ Et toi, à quel moment de ta vie Hodja te raconte-t-il ?</h2>
          <p class="conte-carnet__hint">Tu peux écrire ici. Ce que tu écris reste sur ton appareil, dans ton navigateur. Personne d'autre ne le voit, jamais. Tu le retrouveras la prochaine fois.</p>
          <textarea id="conte-carnet-text" class="conte-carnet__textarea" placeholder="Écris librement…">${carnetText}</textarea>
          <div class="conte-carnet__actions">
            <button id="conte-carnet-save" class="conte-carnet__btn">Enregistrer</button>
            <button id="conte-carnet-clear" class="conte-carnet__btn conte-carnet__btn--ghost">Effacer</button>
            <span id="conte-carnet-status" class="conte-carnet__status"></span>
          </div>
        </section>

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
          <a href="hasard.html" class="conte-nav__link conte-nav__link--accent">✦ Tirer un autre au hasard</a>
        </nav>
      </article>
    `;

    // Hook up carnet buttons
    const ta = document.getElementById('conte-carnet-text');
    const saveBtn = document.getElementById('conte-carnet-save');
    const clearBtn = document.getElementById('conte-carnet-clear');
    const status = document.getElementById('conte-carnet-status');

    saveBtn.addEventListener('click', () => {
      setCarnetEntry(conte.id, ta.value);
      status.textContent = '✓ Enregistré';
      setTimeout(() => { status.textContent = ''; }, 2500);
    });
    clearBtn.addEventListener('click', () => {
      if (confirm("Effacer ce que tu as écrit pour ce conte ?")) {
        ta.value = '';
        setCarnetEntry(conte.id, '');
        status.textContent = '✓ Effacé';
        setTimeout(() => { status.textContent = ''; }, 2500);
      }
    });
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
      const espritsSymbols = c.esprits.map(eid => findEsprit(eid)?.symbol || '').join(' ');
      const extrait = c.texte.replace(/\n+/g, ' ').slice(0, 140) + '…';
      return `
        <a class="conte-carte-mini" href="conte.html?id=${c.id}">
          <div class="conte-carte-mini__esprits">${espritsSymbols}</div>
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
      return `<a class="parcours-pill parcours-pill--esprit${active}" href="parcours.html?esprit=${e.id}">${e.symbol} ${e.label}</a>`;
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

  // ============ Vue : carnet ============
  function renderCarnet() {
    const carnet = getCarnet();
    const ids = Object.keys(carnet);
    const el = document.getElementById('carnet-view');

    if (ids.length === 0) {
      el.innerHTML = `
        <div class="carnet-empty">
          <p>Ton carnet est encore vide.</p>
          <p class="carnet-empty__hint">
            Quand tu lis un conte de Hodja, en bas de la page tu peux écrire à quel moment de ta vie il te raconte.
            Ce que tu écris reste chez toi — et apparaîtra ici.
          </p>
          <p><a href="parcours.html" class="carnet-empty__cta">→ Aller lire un conte</a></p>
        </div>
      `;
      return;
    }

    const entries = ids.map(id => {
      const c = findConte(id);
      if (!c) return '';
      const entry = carnet[id];
      const date = new Date(entry.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
      return `
        <article class="carnet-entree">
          <header class="carnet-entree__header">
            <a href="conte.html?id=${id}" class="carnet-entree__titre">${escapeHtml(c.titre)}</a>
            <span class="carnet-entree__date">${date}</span>
          </header>
          <p class="carnet-entree__question"><em>${escapeHtml(c.question)}</em></p>
          <p class="carnet-entree__texte">${escapeHtml(entry.texte).replace(/\n/g, '<br>')}</p>
        </article>
      `;
    }).join('');

    el.innerHTML = `
      <div class="carnet-intro">
        <p>Voici les contes sur lesquels tu as posé tes propres mots —
        <strong>${ids.length}</strong> ${ids.length === 1 ? 'entrée' : 'entrées'}.
        Tout reste ici, sur ton appareil. Personne d'autre n'y a accès.</p>
      </div>
      ${entries}
    `;
  }

  // ============ Init ============
  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    load().then(() => {
      if (page === 'conte')    renderConte();
      else if (page === 'parcours') renderParcours();
      else if (page === 'hasard')   renderHasard();
      else if (page === 'carnet')   renderCarnet();
    }).catch(err => {
      console.error('Erreur Hodja:', err);
      const main = document.querySelector('main');
      if (main) main.insertAdjacentHTML('beforeend', '<p style="text-align:center;color:#a00;padding:2rem;">Erreur de chargement des contes.</p>');
    });
  });
})();
