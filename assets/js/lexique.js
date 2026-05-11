/* ============================================================
   LEXIQUE — Filtre par catégorie
   ============================================================ */

const filters = document.getElementById('lexique-filters');
const items = document.querySelectorAll('.lex');

if (filters) {
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.region-btn');
    if (!btn) return;
    filters.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    items.forEach(item => {
      if (cat === 'all' || item.dataset.cat === cat) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  });
}
