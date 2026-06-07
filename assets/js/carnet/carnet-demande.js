/* ============================================================
   Page « Demander une clé » — logique du formulaire
   - Génère un ticket lisible (3 mots)
   - Écrit la demande dans Firestore : demandes/{ticketId}
   ============================================================ */
import { db } from './firebase-init.js';
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const TICKET_WORDS = [
  'nur', 'qalb', 'sirr', 'sakina', 'mira', 'hilm', 'rifq', 'sabr',
  'shukr', 'huda', 'salam', 'tariq', 'safar', 'wajd', 'uns', 'fajr',
  'najm', 'lail', 'badr', 'shams', 'qamar', 'mawj', 'jana', 'rahma',
  'baraka', 'aman', 'shawq', 'fitra', 'fadl', 'noor'
];

function generateTicket() {
  const pick = () => TICKET_WORDS[Math.floor(Math.random() * TICKET_WORDS.length)];
  const num = Math.floor(100 + Math.random() * 900); // 3 chiffres
  return `${pick()}-${num}-${pick()}`;
}

const form = document.getElementById('demande-form');
const errorEl = document.getElementById('form-error');
const btn = document.getElementById('submit-btn');
const stepForm = document.getElementById('step-form');
const stepSuccess = document.getElementById('step-success');
const ticketCode = document.getElementById('ticket-code');
const copyBtn = document.getElementById('copy-ticket');

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
}
function clearError() {
  errorEl.hidden = true;
  errorEl.textContent = '';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const prenom  = form.prenom.value.trim();
  const message = form.message.value.trim();
  const contact = form.contact.value.trim();

  if (!prenom)  { showError('Pour vous répondre, votre prénom est nécessaire.'); return; }
  if (!contact) { showError('Pour vous envoyer votre clé, indiquez une adresse de réponse.'); return; }

  btn.disabled = true;
  btn.textContent = 'Envoi…';

  // génère un ticket unique (suffisamment, vu le volume)
  const ticketId = generateTicket();

  try {
    await setDoc(doc(db, 'demandes', ticketId), {
      ticketId,
      prenom,
      message: message || null,
      contact,
      langue: 'fr',
      statut: 'en-attente',
      creeLe: serverTimestamp()
    });

    // succès
    stepForm.hidden = true;
    stepSuccess.hidden = false;
    stepSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (err) {
    console.error(err);
    showError('La demande n\'a pas pu être envoyée. Réessayez dans un instant, ou écrivez directement à lavoiedudedans@icloud.com.');
    btn.disabled = false;
    btn.textContent = 'Envoyer la demande →';
  }
});

copyBtn?.addEventListener('click', async () => {
  const code = ticketCode.textContent;
  try {
    await navigator.clipboard.writeText(code);
    const original = copyBtn.textContent;
    copyBtn.textContent = 'copié ✓';
    setTimeout(() => copyBtn.textContent = original, 1800);
  } catch {
    // fallback
    window.prompt('Copiez ce ticket :', code);
  }
});
