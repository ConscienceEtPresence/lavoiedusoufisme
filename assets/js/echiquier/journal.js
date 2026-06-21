/* ============================================================
   L'Échiquier — Journal personnel (local au navigateur)
   Choisir une case, répondre à sa question, dater l'entrée.
   Tout reste en localStorage : rien n'est envoyé nulle part.
   Export JSON et effacement local possibles.
   ============================================================ */
const KEY = 'ech_journal_v1';
const _esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function save(arr) { try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {} }
function dateLisible(ms) {
  try { return new Date(ms).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return ''; }
}

(async () => {
  const selEl = document.getElementById('ech-j-case');
  const qEl = document.getElementById('ech-j-question');
  const txtEl = document.getElementById('ech-j-texte');
  const saveBtn = document.getElementById('ech-j-save');
  const listEl = document.getElementById('ech-j-entries');
  const exportBtn = document.getElementById('ech-j-export');
  const clearBtn = document.getElementById('ech-j-clear');

  let byNum = {};
  try {
    const data = await fetch('/data/echiquier/cases.json?v=7').then(r => r.json());
    const cases = (data.cases || []).slice().sort((a, b) => a.numero - b.numero);
    for (const c of cases) byNum[c.numero] = c;
    selEl.innerHTML = '<option value="">— choisir une case —</option>' +
      cases.map(c => `<option value="${c.numero}">${c.numero}. ${_esc(c.traduction)} — ${_esc(c.arabe)}</option>`).join('');
  } catch (e) {
    selEl.innerHTML = '<option value="">(cases indisponibles)</option>';
  }

  // Ouverture pré-remplie via ?case=N
  const pre = new URLSearchParams(location.search).get('case');
  if (pre && byNum[+pre]) selEl.value = pre;

  function majQuestion() {
    const c = byNum[+selEl.value];
    qEl.textContent = c && c.question_introspection ? '« ' + c.question_introspection + ' »' : '';
  }
  selEl.addEventListener('change', majQuestion);
  majQuestion();

  function render() {
    const arr = load().sort((a, b) => b.le - a.le);
    if (!arr.length) { listEl.innerHTML = '<p class="ech-journal__empty">Votre journal est encore vierge. Choisissez une case, et déposez une première note.</p>'; return; }
    listEl.innerHTML = arr.map(e => {
      const c = byNum[e.case];
      const titre = c ? `${c.traduction} <span class="ar" lang="ar" dir="rtl">${_esc(c.arabe)}</span>` : `case ${e.case}`;
      return `
        <div class="ech-entry">
          <div class="ech-entry__head">
            <a class="ech-entry__case" href="/pages/echiquier/plateau/#case-${e.case}" style="text-decoration:none;color:inherit;">${titre}</a>
            <span class="ech-entry__date">${dateLisible(e.le)}</span>
          </div>
          <p class="ech-entry__txt">${_esc(e.texte)}</p>
          <button type="button" class="ech-entry__del" data-id="${e.le}">effacer cette note</button>
        </div>`;
    }).join('');
    listEl.querySelectorAll('.ech-entry__del').forEach(b => b.addEventListener('click', () => {
      save(load().filter(x => String(x.le) !== b.dataset.id)); render();
    }));
  }

  saveBtn.addEventListener('click', () => {
    const num = +selEl.value;
    const texte = (txtEl.value || '').trim();
    if (!num || !texte) { saveBtn.textContent = 'Choisissez une case et écrivez…'; setTimeout(() => saveBtn.textContent = 'Déposer cette note', 1800); return; }
    const arr = load();
    arr.push({ case: num, texte, le: Date.now() });
    save(arr);
    txtEl.value = '';
    render();
    saveBtn.textContent = '✦ déposé';
    setTimeout(() => saveBtn.textContent = 'Déposer cette note', 1600);
  });

  exportBtn.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(load(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mon-journal-echiquier.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('Effacer toutes vos notes de ce navigateur ? Cette action est définitive.')) { save([]); render(); }
  });

  render();
})();
