/* ============================================================
   GÉOGRAPHIE — Charge les régions, rend la pile de fiches
   ============================================================ */

// Symboles arabes par région pour les illustrations
const REGION_SYMBOLS = {
  "irak": "بغداد",
  "khorassan": "بخارا",
  "andalousie-maghreb": "الأندلس",
  "egypte-syrie": "القاهرة",
  "anatolie": "قونية",
  "iran": "شيراز",
  "inde": "أجمير",
  "afrique": "توبا",
  "occident": "هو"
};

async function loadGeography() {
  try {
    const res = await fetch('../data/geographie.json');
    const data = await res.json();

    document.getElementById('geo-intro').textContent = data.intro;

    // Navigation map
    const mapEl = document.getElementById('region-map');
    mapEl.innerHTML = data.regions.map(r =>
      `<a href="#${r.slug}">${r.name.split('—')[0].split('&')[0].trim()}</a>`
    ).join('');

    // Fiches régionales
    const stackEl = document.getElementById('regions-stack');
    stackEl.innerHTML = data.regions.map(r => `
      <article class="region-card" id="${r.slug}">
        <div class="region-card__side">
          <div class="region-card__illus" aria-hidden="true">
            <span lang="ar" dir="rtl">${REGION_SYMBOLS[r.slug] || 'هو'}</span>
          </div>
          <div class="region-card__apogee">${r.apogee}</div>
          <h2 class="region-card__name">${r.name}</h2>
          <div class="region-card__alt">${r.nameAlt}</div>
        </div>

        <div class="region-card__body">
          <p class="region-card__intro">${r.intro}</p>
          <p>${r.body}</p>

          <div class="region-card__section">
            <h4>Villes-clés</h4>
            <div class="pills">
              ${r.cities.map(c => `<span class="pill pill--city">${c}</span>`).join('')}
            </div>
          </div>

          <div class="region-card__section">
            <h4>Grandes figures</h4>
            <div class="pills">
              ${r.majorFigures.map(f => `<span class="pill pill--figure">${f}</span>`).join('')}
            </div>
          </div>

          <div class="region-card__section">
            <h4>Ordres dominants</h4>
            <div class="pills">
              ${r.orders.map(o => `<span class="pill pill--order">${o}</span>`).join('')}
            </div>
          </div>

          <div class="region-card__spirit">${r.spirit}</div>

          <blockquote class="region-card__quote">
            ${r.quote.text}
            <cite>${r.quote.author}</cite>
          </blockquote>

          <div class="region-card__keywords">
            ${r.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');

  } catch (err) {
    console.error('Erreur de chargement de la géographie', err);
    document.getElementById('regions-stack').innerHTML =
      '<p class="center muted">Impossible de charger les régions. Vérifie que le site est servi par un serveur local.</p>';
  }
}

loadGeography();
