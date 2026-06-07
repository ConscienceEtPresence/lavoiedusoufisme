/* ============================================================
   Page « Mot-graine oublié »
   Écrit une demande de type 'rappel' dans Firestore.
   Brahms verra cela dans son cockpit avec un badge distinct.
   ============================================================ */
import { db } from './firebase-init.js';
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const TICKET_WORDS = [
  'nur', 'qalb', 'sirr', 'sakina', 'mira', 'hilm', 'rifq', 'sabr',
  'shukr', 'huda', 'salam', 'tariq', 'safar', 'wajd', 'uns', 'fajr',
  'najm', 'lail', 'badr', 'shams', 'qamar', 'mawj', 'jana', 'rahma'
];
function generateTicket() {
  const pick = () => TICKET_WORDS[Math.floor(Math.random() * TICKET_WORDS.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `rappel-${pick()}-${num}-${pick()}`;
}

const form = document.getElementById('oubli-form');
const errorEl = document.getElementById('form-error');
const btn = document.getElementById('submit-btn');
const stepForm = document.getElementById('step-form');
const stepSuccess = document.getElementById('step-success');

function showError(msg) { errorEl.textContent = msg; errorEl.hidden = false; }
function clearError() { errorEl.hidden = true; errorEl.textContent = ''; }

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearError();

  const prenom  = form.prenom.value.trim();
  const contact = form.contact.value.trim();
  const message = form.message.value.trim();

  if (!prenom)  { showError('Votre prénom est nécessaire pour vous retrouver.'); return; }
  if (!contact) { showError('Indiquez une adresse pour vous renvoyer votre mot-graine.'); return; }

  btn.disabled = true;
  btn.textContent = 'Envoi…';

  const ticketId = generateTicket();

  try {
    await setDoc(doc(db, 'demandes', ticketId), {
      ticketId,
      type: 'rappel',
      prenom,
      message: message || null,
      contact,
      langue: 'fr',
      statut: 'en-attente',
      creeLe: serverTimestamp()
    });
    stepForm.hidden = true;
    stepSuccess.hidden = false;
    stepSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    console.error(err);
    showError('La demande n\'a pas pu être envoyée. Réessayez, ou écrivez directement à lavoiedudedans@icloud.com.');
    btn.disabled = false;
    btn.textContent = 'Demander mon mot-graine →';
  }
});
