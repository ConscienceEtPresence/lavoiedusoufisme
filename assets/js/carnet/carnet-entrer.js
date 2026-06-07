/* ============================================================
   « Entrer dans son carnet » — vérification de la clé, bilingue
   ============================================================ */
import { db } from './firebase-init.js';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const EN = document.documentElement.lang === 'en';
const T = EN ? {
  errorEmpty: 'Please enter both your first name and seed-word.',
  checking: 'Checking…',
  errorNoMatch: "This first-name + seed-word doesn't match any journal. Check the spelling, or ask for your key.",
  errorInactive: "This key is no longer active. Write to lavoiedudedans@icloud.com.",
  errorGeneric: 'A difficulty occurred. Try again shortly.',
  buttonText: 'Enter →'
} : {
  errorEmpty: 'Renseignez votre prénom et votre mot-graine.',
  checking: 'Vérification…',
  errorNoMatch: 'Ce duo prénom + mot-graine ne correspond à aucun carnet. Vérifiez la saisie, ou demandez votre clé.',
  errorInactive: "Cette clé n'est plus active. Écrivez à lavoiedudedans@icloud.com.",
  errorGeneric: 'Une erreur est survenue. Réessayez dans un instant.',
  buttonText: 'Entrer →'
};

const SESSION_KEY = 'lvdd_carnet_session';

const form = document.getElementById('entrer-form');
const errorEl = document.getElementById('form-error');
const btn = document.getElementById('submit-btn');

function showError(msg) { errorEl.textContent = msg; errorEl.hidden = false; }
function clearError() { errorEl.hidden = true; errorEl.textContent = ''; }

// session déjà active → on file directement à aujourd'hui
const existing = localStorage.getItem(SESSION_KEY);
if (existing) {
  try {
    const s = JSON.parse(existing);
    if (s.codeId && s.prenom) window.location.href = '../aujourdhui/';
  } catch {}
}

function normalize(s) {
  return String(s || '').trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const prenomRaw = form.prenom.value.trim();
  const motRaw    = form.motGraine.value.trim();

  if (!prenomRaw || !motRaw) { showError(T.errorEmpty); return; }

  btn.disabled = true;
  btn.textContent = T.checking;

  const prenom    = normalize(prenomRaw);
  const motGraine = normalize(motRaw);

  try {
    const q = query(
      collection(db, 'codes'),
      where('prenomNorm', '==', prenom),
      where('motGraine',  '==', motGraine)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      showError(T.errorNoMatch);
      btn.disabled = false;
      btn.textContent = T.buttonText;
      return;
    }

    const docRef = snap.docs[0];
    const data   = docRef.data();

    if (data.actif === false) {
      showError(T.errorInactive);
      btn.disabled = false;
      btn.textContent = T.buttonText;
      return;
    }

    const session = {
      codeId:    docRef.id,
      prenom:    data.prenom || prenomRaw,
      motGraine: data.motGraine,
      langue:    data.langue || (EN ? 'en' : 'fr'),
      ouvertLe:  Date.now()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    try {
      await updateDoc(doc(db, 'codes', docRef.id), { dernierLogin: serverTimestamp() });
    } catch {}

    window.location.href = '../aujourdhui/';

  } catch (err) {
    console.error(err);
    showError(T.errorGeneric);
    btn.disabled = false;
    btn.textContent = T.buttonText;
  }
});
