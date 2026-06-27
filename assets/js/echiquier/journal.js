/* ============================================================
   L'Échiquier — Journal personnel (local au navigateur)
   Choisir une case, répondre à sa question, dater l'entrée.
   Tout reste en localStorage : rien n'est envoyé nulle part.
   Export JSON et effacement local possibles.
   ============================================================ */
const KEY = 'ech_journal_v1';
const MOMENT_TXT = { passage: '→ simple passage', grappin_evite: '✓ grappin évité', grappin_rencontre: '⛓ grappin rencontré', fleche_activee: '↑ flèche activée' };
const _esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const questionPour = c => c && (c.question_introspection || `Où cette réalité apparaît-elle en moi, même faiblement, et quel retour juste peut-elle m'apprendre ?`);

function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function save(arr) { try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {} }
function dateLisible(ms) {
  try { return new Date(ms).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }); }
  catch { return ''; }
}

(async () => {
  const ECHROOT = (document.documentElement.lang === "en" ? "/en" : "") + "/data/echiquier/";
  const selEl = document.getElementById('ech-j-case');
  const qEl = document.getElementById('ech-j-question');
  const txtEl = document.getElementById('ech-j-texte');
  const saveBtn = document.getElementById('ech-j-save');
  const listEl = document.getElementById('ech-j-entries');
  const exportBtn = document.getElementById('ech-j-export');
  const clearBtn = document.getElementById('ech-j-clear');
  const etatEl = document.getElementById('ech-j-etat');
  const actionEl = document.getElementById('ech-j-action');
  const momentVal = () => (document.querySelector('input[name=\"ech-j-moment\"]:checked') || {}).value || 'passage';

  let byNum = {};
  try {
    const data = await fetch(ECHROOT + 'cases.json?v=20').then(r => r.json());
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
  const preEtat = new URLSearchParams(location.search).get('etat');
  if (preEtat && etatEl) etatEl.value = preEtat;

  function majQuestion() {
    const c = byNum[+selEl.value];
    qEl.textContent = c ? '« ' + questionPour(c) + ' »' : '';
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
          ${(e.etat || (e.moment && e.moment !== 'passage') || e.action) ? `<p class="ech-entry__meta">${e.etat ? `<span class="ech-entry__tag">${_esc(e.etat)}</span>` : ''}${e.moment ? `<span class="ech-entry__tag ech-entry__tag--${_esc(e.moment)}">${MOMENT_TXT[e.moment] || ''}</span>` : ''}${e.action ? `<span class="ech-entry__action">${_esc(e.action)}</span>` : ''}</p>` : ''}
          ${e.texte ? `<p class="ech-entry__txt">${_esc(e.texte)}</p>` : ''}
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
    const etat = (etatEl && etatEl.value || '').trim();
    const action = (actionEl && actionEl.value || '').trim();
    const moment = momentVal();
    const hasSomething = texte || etat || action || moment !== 'passage';
    if (!num || !hasSomething) { saveBtn.textContent = 'Choisissez une case, et notez quelque chose…'; setTimeout(() => saveBtn.textContent = 'Déposer cette note', 2000); return; }
    const arr = load();
    arr.push({ case: num, texte, etat, action, moment, le: Date.now() });
    save(arr);
    txtEl.value = ''; if (etatEl) etatEl.value = ''; if (actionEl) actionEl.value = '';
    const def = document.querySelector('input[name="ech-j-moment"][value="passage"]'); if (def) def.checked = true;
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
