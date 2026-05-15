/* ============================================================
   Métaphysique — Charge les 10 sections thématiques
   ============================================================ */
(() => {
  const grilleEl = document.getElementById('meta-grille');
  if (!grilleEl) return;

  fetch('../../data/metaphysique.json')
    .then(r => r.json())
    .then(data => {
      grilleEl.innerHTML = data.sections.map(s => {
        const readyClass = s.status === 'ready' ? 'is-ready' : 'is-soon';
        const readyBadge = s.status === 'soon' ? '<span class="meta-badge">à venir</span>' : '';
        const themesHTML = s.themes.map(t => `<li>${t}</li>`).join('');
        return `
          <a class="meta-carte ${readyClass}" href="themes/${s.id}.html">
            ${readyBadge}
            <div class="meta-carte__num">${String(s.numero).padStart(2, '0')}</div>
            <div class="meta-carte__ar" lang="ar" dir="rtl">${s.ar}</div>
            <h2 class="meta-carte__titre">${s.titre}</h2>
            <p class="meta-carte__tagline"><em>${s.tagline}</em></p>
            <ul class="meta-carte__themes">${themesHTML}</ul>
          </a>
        `;
      }).join('');
    })
    .catch(err => {
      console.error('Erreur chargement métaphysique', err);
      grilleEl.innerHTML = '<p class="center muted">Impossible de charger les chapitres.</p>';
    });
})();
