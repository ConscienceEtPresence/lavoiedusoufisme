/* ============================================================
   « Demander une clé » — formulaire bilingue
   ============================================================ */
import { db } from './firebase-init.js';
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const EN = document.documentElement.lang === 'en';
const T = EN ? {
  errorPrenom: 'A first name is needed so we can respond to you.',
  errorContact: 'Please provide a way for us to reach you.',
  sending: 'Sending…',
  errorSubmit: "Your request couldn't be sent. Try again, or write directly to lavoiedudedans@icloud.com.",
  buttonText: 'Send the request →'
} : {
  errorPrenom: 'Pour vous répondre, votre prénom est nécessaire.',
  errorContact: "Pour vous envoyer votre clé, indiquez une adresse de réponse.",
  sending: 'Envoi…',
  errorSubmit: "La demande n'a pas pu être envoyée. Réessayez dans un instant, ou écrivez directement à lavoiedudedans@icloud.com.",
  buttonText: 'Envoyer la demande →'
};

const TICKET_WORDS = [
  'nur', 'qalb', 'sirr', 'sakina', 'mira', 'hilm', 'rifq', 'sabr',
  'shukr', 'huda', 'salam', 'tariq', 'safar', 'wajd', 'uns', 'fajr',
  'najm', 'lail', 'badr', 'shams', 'qamar', 'mawj', 'jana', 'rahma',
  'baraka', 'aman', 'shawq', 'fitra', 'fadl', 'noor'
];
function generateTicket() {
  const pick = () => TICKET_WORDS[Math.floor(Math.random() * TICKET_WORDS.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${pick()}-${num}-${pick()}`;
}

const form = document.getElementById('demande-form');
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
  const message = form.message.value.trim();
  const contact = form.contact.value.trim();

  if (!prenom)  { showError(T.errorPrenom); return; }
  if (!contact) { showError(T.errorContact); return; }

  btn.disabled = true;
  btn.textContent = T.sending;

  const ticketId = generateTicket();

  try {
    await setDoc(doc(db, 'demandes', ticketId), {
      ticketId,
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
