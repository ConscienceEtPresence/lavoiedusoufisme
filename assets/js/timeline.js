/* ============================================================
   TIMELINE — Charge la chronologie depuis JSON et la rend
   ============================================================ */

async function renderTimeline() {
  const root = document.getElementById('timeline');
  if (!root) return;

  try {
    const res = await fetch('../data/chronologie.json');
    const data = await res.json();

    root.innerHTML = data.periods.map(p => `
      <article class="period" data-slug="${p.slug}">
        <div class="period__marker"></div>
        <div class="period__content">
          <div class="period__date">${p.date}</div>
          <h2 class="period__title">${p.title}</h2>
          <h3 style="color: var(--ink-mute); font-style: italic; font-weight: 400; font-size: 1.05rem; margin-bottom: var(--space-md);">${p.subtitle}</h3>

          <p class="period__text"><strong>${p.intro}</strong></p>
          <p class="period__text">${p.body}</p>

          <ul class="period__figures">
            ${p.figures.map(f => `<li>${f}</li>`).join('')}
          </ul>

          <blockquote style="margin-top: var(--space-md); font-size: 1.05rem;">
            ${p.quote.text}
            <cite>${p.quote.author}</cite>
          </blockquote>

          <div class="keywords">
            ${p.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');

    // Active l'observer pour les nouvelles périodes
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          document.querySelectorAll('.period').forEach(p => p.classList.remove('active'));
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.15, rootMargin: '-80px 0px -80px 0px' });

    document.querySelectorAll('.period').forEach(el => observer.observe(el));

  } catch (err) {
    console.error('Erreur de chargement de la chronologie', err);
    root.innerHTML = '<p class="center muted">Impossible de charger la frise. Vérifie que le site est servi par un serveur local.</p>';
  }
}

renderTimeline();
