/* ============================================================
   « Mot-graine oublié » — demande de rappel, bilingue
   ============================================================ */
import { db } from './firebase-init.js';
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const EN = document.documentElement.lang === 'en';
const T = EN ? {
  errorPrenom: 'Your first name is needed so we can find you.',
  errorContact: 'Please provide a way to send your seed-word back to you.',
  sending: 'Sending…',
  errorSubmit: "The request couldn't be sent. Try again, or write directly to lavoiedudedans@icloud.com.",
  buttonText: 'Ask for my seed-word →'
} : {
  errorPrenom: 'Votre prénom est nécessaire pour vous retrouver.',
  errorContact: "Indiquez une adresse pour vous renvoyer votre mot-graine.",
  sending: 'Envoi…',
  errorSubmit: "La demande n'a pas pu être envoyée. Réessayez, ou écrivez directement à lavoiedudedans@icloud.com.",
  buttonText: 'Demander mon mot-graine →'
};

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

  if (!prenom)  { showError(T.errorPrenom); return; }
  if (!contact) { showError(T.errorContact); return; }

  btn.disabled = true;
  btn.textContent = T.sending;

  const ticketId = generateTicket();

  try {
    await setDoc(doc(db, 'demandes', ticketId), {
      ticketId,
      type: 'rappel',
      prenom,
      message: message || null,
      contact,
      langue: EN ? 'en' : 'fr',
      statut: 'en-attente',
      creeLe: serverTimestamp()
    });
    stepForm.hidden = true;
    stepSuccess.hidden = false;
    stepSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (err) {
    console.error(err);
    showError(T.errorSubmit);
    btn.disabled = false;
    btn.textContent = T.buttonText;
  }
});
