/* ============================================================
   Page « Entrer dans son carnet » — vérification de la clé
   Cherche un document dans codes/ avec prenom + motGraine.
   Si trouvé et actif : ouvre la session locale + redirige.
   ============================================================ */
import { db } from './firebase-init.js';
import { collection, query, where, getDocs, doc, updateDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const SESSION_KEY = 'lvdd_carnet_session';

const form = document.getElementById('entrer-form');
const errorEl = document.getElementById('form-error');
const btn = document.getElementById('submit-btn');

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
}
function clearError() {
  errorEl.hidden = true;
  errorEl.textContent = '';
}

// si une session existe déjà, on redirige directement vers aujourd'hui
const existing = localStorage.getItem(SESSION_KEY);
if (existing) {
  try {
    const s = JSON.parse(existing);
    if (s.codeId && s.prenom) {
      window.location.href = '../aujourdhui/';
    }
  } catch {}
}

function normalize(s) {
  return String(s || '').trim().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, ''); // enlève les accents
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const prenomRaw = form.prenom.value.trim();
  const motRaw    = form.motGraine.value.trim();

  if (!prenomRaw || !motRaw) {
    showError('Renseignez votre prénom et votre mot-graine.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Vérification…';

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
      showError('Ce duo prénom + mot-graine ne correspond à aucun carnet. Vérifiez la saisie, ou demandez votre clé.');
      btn.disabled = false;
      btn.textContent = 'Entrer →';
      return;
    }

    // on prend la première (en théorie unique)
    const docRef = snap.docs[0];
    const data   = docRef.data();

    if (data.actif === false) {
      showError('Cette clé n\'est plus active. Écrivez à lavoiedudedans@icloud.com.');
      btn.disabled = false;
      btn.textContent = 'Entrer →';
      return;
    }

    // ouverture de session locale
    const session = {
      codeId:    docRef.id,
      prenom:    data.prenom || prenomRaw,
      motGraine: data.motGraine,
      langue:    data.langue || 'fr',
      ouvertLe:  Date.now()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

    // mise à jour douce : dernier login
    try {
      await updateDoc(doc(db, 'codes', docRef.id), {
        dernierLogin: serverTimestamp()
      });
    } catch {}

    window.location.href = '../aujourdhui/';

  } catch (err) {
    console.error(err);
    showError('Une erreur est survenue. Réessayez dans un instant.');
    btn.disabled = false;
    btn.textContent = 'Entrer →';
  }
});
