/* ============================================================
   « Aujourd'hui » — matin + soir + suggestion, bilingue
   ============================================================ */
import { db } from './firebase-init.js';
import { doc, setDoc, getDoc, addDoc, collection, serverTimestamp, updateDoc }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ---- Revérification de session (clé toujours active ? mot-graine inchangé ?)
async function ensureValidSession(session) {
  try {
    const snap = await getDoc(doc(db, 'codes', session.codeId));
    if (!snap.exists()) {
      localStorage.removeItem('lvdd_carnet_session');
      window.location.href = '../entrer/';
      throw new Error('session-invalid');
    }
    const d = snap.data();
    if (d.actif === false) {
      localStorage.removeItem('lvdd_carnet_session');
      window.location.href = '../entrer/';
      throw new Error('inactive');
    }
    // si le mot-graine a changé, on resync la session
    if (d.motGraine && d.motGraine !== session.motGraine) {
      session.motGraine = d.motGraine;
      localStorage.setItem('lvdd_carnet_session', JSON.stringify(session));
    }
  } catch (e) { throw e; }
}

const EN = document.documentElement.lang === 'en';
const LANG = EN ? 'en' : 'fr';
const LOCALE = EN ? 'en-US' : 'fr-FR';

const T_en = {
  hello: 'Hello',
  noSession: 'Sign-out requested? (your data is kept)',
  morning: 'Morning',
  morningSub: 'an intention for the day',
  intentionLabel: 'Today, I would like to cultivate',
  choose: '— choose —',
  noteMorning: 'A note for this morning (optional)',
  saveMorning: 'Note this morning',
  morningSaved: '✓ noted',
  evening: 'Evening',
  eveningSub: 'a calm look at the day — without judging yourself',
  noteEvening: 'One thing that marked me today (optional)',
  closeDay: 'Close the day',
  closeDaySaved: '✓ day closed',
  suggestionTitle: 'Pass a word to Brahms',
  suggestionSub: 'a suggestion, an idea, a word — to help the journal grow',
  suggestionPlaceholder: "e.g.: « could we add a practice on listening? »",
  suggestionSigned: 'Brahms will know it\'s me',
  yourMessage: 'Your message (anonymous by default)',
  sendSuggestion: 'Send the suggestion',
  suggestionSent: '✓ thank you, your word has been passed',
  yes: 'yes', partial: 'partly', no: 'no',
  cercleParole: 'Speech', cercleActe: 'Action', cercleCoeur: 'The heart', cercleLien: 'The bond',
  saveError: 'A difficulty occurred. Try again.',
  showCommentButton: 'Show commentary',
  loading: 'Loading…',
  emptyMessage: 'Write something before sending.',
};

const T_fr = {
  hello: 'Bonjour',
  noSession: 'Sortir de votre carnet ? (vos données sont gardées)',
  morning: 'Le matin',
  morningSub: 'une intention pour la journée',
  intentionLabel: "Aujourd'hui, je voudrais cultiver",
  choose: '— choisir —',
  noteMorning: 'Une note pour ce matin (facultatif)',
  saveMorning: 'Noter ce matin',
  morningSaved: '✓ noté',
  evening: 'Le soir',
  eveningSub: 'un regard tranquille sur la journée — sans se juger',
  noteEvening: "Une chose qui m'a marqué·e aujourd'hui (facultatif)",
  closeDay: 'Fermer le jour',
  closeDaySaved: '✓ jour fermé',
  suggestionTitle: 'Glisser un mot à Brahms',
  suggestionSub: 'une suggestion, une idée, un mot — pour faire évoluer le carnet',
  suggestionPlaceholder: "ex. : « pourrait-on ajouter une pratique sur l'écoute ? »",
  suggestionSigned: 'Brahms saura que c\'est moi',
  yourMessage: 'Votre message (anonyme par défaut)',
  sendSuggestion: 'Envoyer la suggestion',
  suggestionSent: '✓ merci, votre mot a été glissé',
  yes: 'oui', partial: 'en partie', no: 'non',
  cercleParole: 'La parole', cercleActe: 'Les actes', cercleCoeur: 'Le cœur', cercleLien: 'Le lien',
  saveError: 'Une erreur est survenue. Réessayez.',
  showCommentButton: 'Voir le commentaire',
  loading: 'Chargement…',
  emptyMessage: 'Écrivez quelque chose avant d\'envoyer.',
};
const TXT = EN ? T_en : T_fr;

const SESSION_KEY = 'lvdd_carnet_session';
const mount = document.getElementById('jour-mount');
const sortirLink = document.getElementById('sortir-link');

sortirLink?.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm(TXT.noSession)) {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '../';
  }
});

const sessionRaw = localStorage.getItem(SESSION_KEY);
if (!sessionRaw) { window.location.href = '../entrer/'; throw new Error('no session'); }
const session = JSON.parse(sessionRaw);
const { codeId, prenom } = session;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
const date = todayKey();

async function load() {
  await ensureValidSession(session);
  const [pratiquesJson, motsJson, jourSnap] = await Promise.all([
    fetch('/data/carnet/pratiques.json').then(r => r.json()),
    fetch('/data/carnet/mots-graines.json').then(r => r.json()),
    getDoc(doc(db, 'carnets', codeId, 'jours', date)).catch(() => null)
  ]);
  const motCompagnon = motsJson.mots.find(m => m.id === session.motGraine);
  const jourData = jourSnap?.exists() ? jourSnap.data() : {};
  render({ pratiques: pratiquesJson, motCompagnon, jourData });
}

function dateLisible() {
  const d = new Date();
  return d.toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function render({ pratiques, motCompagnon, jourData }) {
  const cercles = pratiques.cercles;
  const items = pratiques.pratiques;
  const groupes = ['parole', 'acte', 'coeur', 'lien'];

  const intentionActuelle = jourData.matin?.intentionId || '';
  const noteMatin = jourData.matin?.note || '';
  const reponses = jourData.soir?.reponses || {};
  const noteSoir = jourData.soir?.note || '';

  const compagnonHtml = motCompagnon ? `
    <div class="jour-compagnon">
      <span class="jour-compagnon__ar" lang="ar" dir="rtl">${esc(motCompagnon.ar)}</span>
      <span class="jour-compagnon__tr">${esc(motCompagnon.tr)} — ${esc(motCompagnon[LANG].nom)}</span>
    </div>
  ` : '';

  const intentionsOptions = items.map(p => `
    <option value="${esc(p.id)}" ${p.id === intentionActuelle ? 'selected' : ''}>
      ${esc(p[LANG].nom)}
    </option>
  `).join('');

  const blocCercles = groupes.map(g => {
    const inCercle = items.filter(p => p.cercle === g);
    if (!inCercle.length) return '';
    const lignes = inCercle.map(p => {
      const rep = reponses[p.id] || '';
      const aval = (rep && rep !== 'yes') ? `<div class="jour-aval">${esc(p[LANG].aval)}</div>` : '';
      return `
        <div class="jour-pratique" data-id="${esc(p.id)}">
          <div class="jour-pratique__nom">${esc(p[LANG].nom)}</div>
          <div class="jour-pratique__amont">${esc(p[LANG].amont)}</div>
          <div class="jour-pratique__q">${esc(p[LANG].question)}</div>
          <div class="jour-choix">
            <label><input type="radio" name="rep-${esc(p.id)}" value="yes"     ${rep==='yes'?'checked':''}/> <span>${TXT.yes}</span></label>
            <label><input type="radio" name="rep-${esc(p.id)}" value="partial" ${rep==='partial'?'checked':''}/> <span>${TXT.partial}</span></label>
            <label><input type="radio" name="rep-${esc(p.id)}" value="no"      ${rep==='no'?'checked':''}/> <span>${TXT.no}</span></label>
          </div>
          ${aval}
        </div>
      `;
    }).join('');
    return `
      <div class="jour-cercle">
        <h3 class="jour-cercle__titre">${esc(cercles[g][LANG])}</h3>
        ${lignes}
      </div>
    `;
  }).join('');

  mount.innerHTML = `
    <header class="jour-head">
      <p class="jour-hello">${TXT.hello}, <em>${esc(prenom)}</em>.</p>
      <p class="jour-date">${dateLisible()}</p>
      ${compagnonHtml}
    </header>

    <section class="jour-section" id="section-matin">
      <h2 class="jour-section__titre">${TXT.morning}</h2>
      <p class="jour-section__sub"><em>${TXT.morningSub}</em></p>

      <label class="jour-field">
        <span>${TXT.intentionLabel}</span>
        <select id="intention-select">
          <option value="">${TXT.choose}</option>
          ${intentionsOptions}
        </select>
      </label>

      <label class="jour-field">
        <span>${TXT.noteMorning}</span>
        <textarea id="note-matin" rows="3">${esc(noteMatin)}</textarea>
      </label>

      <button type="button" class="carnet-btn carnet-btn--ghost" id="save-matin">${TXT.saveMorning}</button>
      <span class="jour-save-ok" id="save-matin-ok" hidden>${TXT.morningSaved}</span>
    </section>

    <section class="jour-section" id="section-soir">
      <h2 class="jour-section__titre">${TXT.evening}</h2>
      <p class="jour-section__sub"><em>${TXT.eveningSub}</em></p>

      ${blocCercles}

      <label class="jour-field">
        <span>${TXT.noteEvening}</span>
        <textarea id="note-soir" rows="4">${esc(noteSoir)}</textarea>
      </label>

      <button type="button" class="carnet-btn carnet-btn--gold" id="save-soir">${TXT.closeDay}</button>
      <span class="jour-save-ok" id="save-soir-ok" hidden>${TXT.closeDaySaved}</span>
    </section>

    <section class="jour-section jour-section--suggestion">
      <h2 class="jour-section__titre" style="font-size:1.05rem; color:var(--gold);">${TXT.suggestionTitle}</h2>
      <p class="jour-section__sub"><em>${TXT.suggestionSub}</em></p>

      <label class="jour-field">
        <span>${TXT.yourMessage}</span>
        <textarea id="suggestion-msg" rows="3" placeholder="${TXT.suggestionPlaceholder}"></textarea>
      </label>

      <label class="jour-field" style="display:flex; align-items:center; gap:0.5rem;">
        <input type="checkbox" id="suggestion-signed" />
        <span style="text-transform:none; letter-spacing:0; color:var(--ink-soft); font-family: var(--font-display); font-style: italic;">
          ${TXT.suggestionSigned}
        </span>
      </label>

      <button type="button" class="carnet-btn carnet-btn--ghost" id="save-suggestion">${TXT.sendSuggestion}</button>
      <span class="jour-save-ok" id="save-suggestion-ok" hidden>${TXT.suggestionSent}</span>
    </section>
  `;

  bindMatin();
  bindSoir(items);
  bindAvalDynamique(items);
  bindSuggestion();
}

function bindMatin() {
  const btn = document.getElementById('save-matin');
  const ok  = document.getElementById('save-matin-ok');
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = TXT.loading;
    try {
      const intentionId = document.getElementById('intention-select').value;
      const note        = document.getElementById('note-matin').value.trim();
      await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
        langue: LANG,
        matin: { intentionId: intentionId || null, note: note || null, noteLe: serverTimestamp() }
      }, { merge: true });
      ok.hidden = false;
      setTimeout(() => ok.hidden = true, 2500);
    } catch (e) {
      alert(TXT.saveError); console.error(e);
    } finally {
      btn.disabled = false;
      btn.textContent = TXT.saveMorning;
    }
  });
}

function bindSoir(items) {
  const btn = document.getElementById('save-soir');
  const ok  = document.getElementById('save-soir-ok');
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = TXT.loading;
    try {
      const reponses = {};
      items.forEach(p => {
        const sel = document.querySelector(`input[name="rep-${p.id}"]:checked`);
        if (sel) reponses[p.id] = sel.value;
      });
      const note = document.getElementById('note-soir').value.trim();
      await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
        langue: LANG,
        soir: { reponses, note: note || null, fermeLe: serverTimestamp() }
      }, { merge: true });
      ok.hidden = false;
      setTimeout(() => ok.hidden = true, 3000);
    } catch (e) {
      alert(TXT.saveError); console.error(e);
    } finally {
      btn.disabled = false;
      btn.textContent = TXT.closeDay;
    }
  });
}

function bindAvalDynamique(items) {
  items.forEach(p => {
    document.querySelectorAll(`input[name="rep-${p.id}"]`).forEach(radio => {
      radio.addEventListener('change', () => {
        const card = document.querySelector(`.jour-pratique[data-id="${p.id}"]`);
        const existing = card.querySelector('.jour-aval');
        if (radio.value === 'yes') {
          if (existing) existing.remove();
        } else {
          if (!existing) {
            const div = document.createElement('div');
            div.className = 'jour-aval';
            div.textContent = p[LANG].aval;
            card.appendChild(div);
          }
        }
      });
    });
  });
}

function bindSuggestion() {
  const btn = document.getElementById('save-suggestion');
  const ok  = document.getElementById('save-suggestion-ok');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const msg = document.getElementById('suggestion-msg').value.trim();
    if (!msg) { alert(TXT.emptyMessage); return; }
    const signed = document.getElementById('suggestion-signed').checked;
    btn.disabled = true;
    btn.textContent = TXT.loading;
    try {
      await addDoc(collection(db, 'suggestions'), {
        message: msg,
        prenom: signed ? prenom : null,
        codeId: signed ? codeId : null,
        langue: LANG,
        statut: 'neuve',
        creeLe: serverTimestamp()
      });
      document.getElementById('suggestion-msg').value = '';
      document.getElementById('suggestion-signed').checked = false;
      ok.hidden = false;
      setTimeout(() => ok.hidden = true, 4000);
    } catch (e) {
      console.error(e); alert(TXT.saveError);
    } finally {
      btn.disabled = false;
      btn.textContent = TXT.sendSuggestion;
    }
  });
}

load().catch(err => {
  console.error(err);
  mount.innerHTML = '<p style="text-align:center;color:#888">—</p>';
});
