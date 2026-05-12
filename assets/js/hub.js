/* ============================================================
   HUB — Charge le JSON correspondant et rend la grille
   La page définit window.HUB_DATA_FILE
   ============================================================ */

async function loadHub() {
  const file = window.HUB_DATA_FILE;
  if (!file) return;

  try {
    const res = await fetch(`../data/${file}`);
    const data = await res.json();

    const intro = document.getElementById('hub-intro-text');
    if (intro && data.intro) {
      intro.textContent = data.intro;
    }

    const grid = document.getElementById('hub-grid');
    if (!grid) return;

    grid.innerHTML = data.sections.map(s => {
      const cls = s.status === 'ready' ? 'is-ready' : 'is-soon';
      const tag = s.link ? 'a' : 'div';
      const hrefAttr = s.link ? `href="${s.link}"` : 'role="status"';
      const more = s.status === 'ready' ? 'Entrer ✦' : 'Bientôt ouvert';
      return `
        <${tag} class="hub-card ${cls}" ${hrefAttr}>
          <h2 class="hub-card__title">${s.title}</h2>
          <div class="hub-card__subtitle">${s.subtitle}</div>
          <p class="hub-card__preview">${s.preview}</p>
          <div class="hub-card__more">${more}</div>
        </${tag}>
      `;
    }).join('');

  } catch (err) {
    console.error('Erreur chargement hub', err);
    const grid = document.getElementById('hub-grid');
    if (grid) {
      grid.innerHTML = '<p class="center muted">Impossible de charger la section.</p>';
    }
  }
}

loadHub();
