/* ============================================================
   Page « Aujourd'hui » — matin + soir, v1
   - Charge les pratiques.json et mots-graines.json
   - Affiche l'intention du matin et l'examen du soir
   - Enregistre dans carnets/{codeId}/jours/{date}
   ============================================================ */
import { db } from './firebase-init.js';
import { doc, setDoc, getDoc, addDoc, collection, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const SESSION_KEY = 'lvdd_carnet_session';
const mount = document.getElementById('jour-mount');
const sortirLink = document.getElementById('sortir-link');

// — sortie de session
sortirLink?.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Sortir de votre carnet ? (vos données sont gardées)')) {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '../';
  }
});

// — récupération de la session
const sessionRaw = localStorage.getItem(SESSION_KEY);
if (!sessionRaw) {
  window.location.href = '../entrer/';
  throw new Error('no session');
}
const session = JSON.parse(sessionRaw);
const { codeId, prenom } = session;

// — date du jour ISO (YYYY-MM-DD), basé sur l'heure locale
function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
const date = todayKey();

// — chargement parallèle des sources et de l'état du jour
async function load() {
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
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

// — rendu de la page
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
      <span class="jour-compagnon__tr">${esc(motCompagnon.tr)} — ${esc(motCompagnon.fr.nom)}</span>
    </div>
  ` : '';

  const intentionsOptions = items.map(p => `
    <option value="${esc(p.id)}" ${p.id === intentionActuelle ? 'selected' : ''}>
      ${esc(p.fr.nom)}
    </option>
  `).join('');

  const blocCercles = groupes.map(g => {
    const inCercle = items.filter(p => p.cercle === g);
    if (!inCercle.length) return '';
    const lignes = inCercle.map(p => {
      const rep = reponses[p.id] || '';
      const aval = (rep && rep !== 'yes') ? `<div class="jour-aval">${esc(p.fr.aval)}</div>` : '';
      return `
        <div class="jour-pratique" data-id="${esc(p.id)}">
          <div class="jour-pratique__nom">${esc(p.fr.nom)}</div>
          <div class="jour-pratique__amont">${esc(p.fr.amont)}</div>
          <div class="jour-pratique__q">${esc(p.fr.question)}</div>
          <div class="jour-choix">
            <label><input type="radio" name="rep-${esc(p.id)}" value="yes"     ${rep==='yes'?'checked':''}/> <span>oui</span></label>
            <label><input type="radio" name="rep-${esc(p.id)}" value="partial" ${rep==='partial'?'checked':''}/> <span>en partie</span></label>
            <label><input type="radio" name="rep-${esc(p.id)}" value="no"      ${rep==='no'?'checked':''}/> <span>non</span></label>
          </div>
          ${aval}
        </div>
      `;
    }).join('');
    return `
      <div class="jour-cercle">
        <h3 class="jour-cercle__titre">${esc(cercles[g].fr)}</h3>
        ${lignes}
      </div>
    `;
  }).join('');

  mount.innerHTML = `
    <header class="jour-head">
      <p class="jour-hello">Bonjour, <em>${esc(prenom)}</em>.</p>
      <p class="jour-date">${dateLisible()}</p>
      ${compagnonHtml}
    </header>

    <section class="jour-section" id="section-matin">
      <h2 class="jour-section__titre">Le matin</h2>
      <p class="jour-section__sub"><em>une intention pour la journée</em></p>

      <label class="jour-field">
        <span>Aujourd'hui, je voudrais cultiver</span>
        <select id="intention-select">
          <option value="">— choisir —</option>
          ${intentionsOptions}
        </select>
      </label>

      <label class="jour-field">
        <span>Une note pour ce matin (facultatif)</span>
        <textarea id="note-matin" rows="3">${esc(noteMatin)}</textarea>
      </label>

      <button type="button" class="carnet-btn carnet-btn--ghost" id="save-matin">Noter ce matin</button>
      <span class="jour-save-ok" id="save-matin-ok" hidden>✓ noté</span>
    </section>

    <section class="jour-section" id="section-soir">
      <h2 class="jour-section__titre">Le soir</h2>
      <p class="jour-section__sub"><em>un regard tranquille sur la journée — sans se juger</em></p>

      ${blocCercles}

      <label class="jour-field">
        <span>Une chose qui m'a marqué·e aujourd'hui (facultatif)</span>
        <textarea id="note-soir" rows="4">${esc(noteSoir)}</textarea>
      </label>

      <button type="button" class="carnet-btn carnet-btn--gold" id="save-soir">Fermer le jour</button>
      <span class="jour-save-ok" id="save-soir-ok" hidden>✓ jour fermé</span>
    </section>

    <section class="jour-section jour-section--suggestion">
      <h2 class="jour-section__titre" style="font-size:1.05rem; color:var(--gold);">Glisser un mot à Brahms</h2>
      <p class="jour-section__sub"><em>une suggestion, une idée, un mot — pour faire évoluer le carnet</em></p>

      <label class="jour-field">
        <span>Votre message (anonyme par défaut)</span>
        <textarea id="suggestion-msg" rows="3" placeholder="ex. : « pourrait-on ajouter une pratique sur l'écoute ? »"></textarea>
      </label>

      <label class="jour-field" style="display:flex; align-items:center; gap:0.5rem;">
        <input type="checkbox" id="suggestion-signed" />
        <span style="text-transform:none; letter-spacing:0; color:var(--ink-soft); font-family: var(--font-display); font-style: italic;">
          Brahms saura que c'est moi
        </span>
      </label>

      <button type="button" class="carnet-btn carnet-btn--ghost" id="save-suggestion">Envoyer la suggestion</button>
      <span class="jour-save-ok" id="save-suggestion-ok" hidden>✓ merci, votre mot a été glissé</span>
    </section>
  `;

  bindMatin();
  bindSoir(items);
  bindAvalDynamique(items);
  bindSuggestion();
}

function bindSuggestion() {
  const btn = document.getElementById('save-suggestion');
  const ok  = document.getElementById('save-suggestion-ok');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const msg = document.getElementById('suggestion-msg').value.trim();
    if (!msg) { alert('Écrivez quelque chose avant d\'envoyer.'); return; }
    const signed = document.getElementById('suggestion-signed').checked;
    btn.disabled = true;
    btn.textContent = 'Envoi…';
    try {
      await addDoc(collection(db, 'suggestions'), {
        message: msg,
        prenom: signed ? prenom : null,
        codeId: signed ? codeId : null,
        langue: 'fr',
        statut: 'neuve',
        creeLe: serverTimestamp()
      });
      document.getElementById('suggestion-msg').value = '';
      document.getElementById('suggestion-signed').checked = false;
      ok.hidden = false;
      setTimeout(() => ok.hidden = true, 4000);
    } catch (e) {
      console.error(e);
      alert('Une difficulté à envoyer. Réessayez.');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Envoyer la suggestion';
    }
  });
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function bindMatin() {
  const btn = document.getElementById('save-matin');
  const ok  = document.getElementById('save-matin-ok');
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Enregistrement…';
    try {
      const intentionId = document.getElementById('intention-select').value;
      const note        = document.getElementById('note-matin').value.trim();
      await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
        matin: { intentionId: intentionId || null, note: note || null, noteLe: serverTimestamp() }
      }, { merge: true });
      ok.hidden = false;
      setTimeout(() => ok.hidden = true, 2500);
    } catch (e) {
      alert('Une erreur est survenue. Réessayez.');
      console.error(e);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Noter ce matin';
    }
  });
}

function bindSoir(items) {
  const btn = document.getElementById('save-soir');
  const ok  = document.getElementById('save-soir-ok');
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    btn.textContent = 'Enregistrement…';
    try {
      const reponses = {};
      items.forEach(p => {
        const sel = document.querySelector(`input[name="rep-${p.id}"]:checked`);
        if (sel) reponses[p.id] = sel.value;
      });
      const note = document.getElementById('note-soir').value.trim();
      await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
        soir: { reponses, note: note || null, ferméLe: serverTimestamp() }
      }, { merge: true });
      ok.hidden = false;
      setTimeout(() => ok.hidden = true, 3000);
    } catch (e) {
      alert('Une erreur est survenue. Réessayez.');
      console.error(e);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Fermer le jour';
    }
  });
}

// — dynamiquement : si on coche "en partie" ou "non", on affiche l'aval
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
            div.textContent = p.fr.aval;
            card.appendChild(div);
          }
        }
      });
    });
  });
}

load().catch(err => {
  console.error(err);
  mount.innerHTML = '<p style="text-align:center;color:var(--ink-mute);">Une difficulté à charger votre carnet. Réessayez dans un instant.</p>';
});
