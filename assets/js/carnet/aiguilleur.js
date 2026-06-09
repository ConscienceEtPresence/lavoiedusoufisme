/* ============================================================
   Le carnet d'adab — Aiguilleur (page Aujourd'hui)
   Lit l'heure et l'état du jour pour proposer poser ou relire.
   ============================================================ */
import { db } from './firebase-init.js';
import { doc, getDoc, serverTimestamp, setDoc }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const anonId = localStorage.getItem('lvdd_carnet_id');
const prenom = localStorage.getItem('lvdd_carnet_prenom') || '';

if (!anonId) {
  window.location.href = '/pages/carnet/';
}

const mount = document.getElementById('aiguilleur-mount');
const dateEl = document.getElementById('adab-date');

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function dateLisible() {
  return new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function greetingByHour(heure) {
  if (heure < 5)  return 'Bonsoir';
  if (heure < 12) return 'Bonjour';
  if (heure < 18) return 'Bonjour';
  return 'Bonsoir';
}

dateEl.textContent = dateLisible();

(async () => {
  try {
    const date = todayKey();
    const heure = new Date().getHours();
    const [vigilancesRes, objectifsRes, jourSnap] = await Promise.all([
      fetch('/data/carnet/vigilances.json').then(r => r.json()),
      fetch('/data/carnet/objectifs.json').then(r => r.json()),
      getDoc(doc(db, 'carnets', anonId, 'jours', date)).catch(() => null)
    ]);
    const vigilances = vigilancesRes.vigilances || [];
    const objectifs = objectifsRes.objectifs || [];
    const jourData = jourSnap?.exists() ? jourSnap.data() : {};
    const matin = jourData.matin || {};
    const soir = jourData.soir || {};
    const aPose = !!matin.poseLe;
    const aDepose = !!soir.fermeLe;

    // Met à jour le lastSeen
    try {
      await setDoc(doc(db, 'carnets', anonId, '_meta', 'profil'), {
        prenom: prenom || null,
        lastSeen: serverTimestamp()
      }, { merge: true });
    } catch (e) {}

    const g = greetingByHour(heure);
    const greeting = prenom ? `${g} <em>${esc(prenom)}</em>,` : `${g},`;

    // Rendre le résumé du matin (toujours utile)
    function renderResume() {
      const v = vigilances.find(x => x.id === matin.vigilanceId);
      const objsChoisis = (matin.objectifsIds || []).map(id => objectifs.find(o => o.id === id)).filter(Boolean);
      const aDuContenu = v || objsChoisis.length || matin.personnel;
      if (!aDuContenu) return '';

      const objsHTML = objsChoisis.map(o => `
        <li class="resume-obj">${esc(o.matin.libelle)}</li>
      `).join('');
      const persoHTML = matin.personnel ? `
        <li class="resume-obj resume-obj--perso">${esc(matin.personnel)}</li>` : '';

      return `
        <div class="aiguilleur-resume">
          <p class="aiguilleur-resume__label">Ce matin, vous avez posé</p>
          ${v ? `
            <div class="aiguilleur-resume__vigilance-bloc">
              <span class="aiguilleur-resume__vig-ar" lang="ar" dir="rtl">${esc(v.ar)}</span>
              <p class="aiguilleur-resume__vig-titre">${esc(v.label)}</p>
            </div>` : ''}
          ${objsHTML || persoHTML ? `
            <ul class="aiguilleur-resume__objs">
              ${objsHTML}${persoHTML}
            </ul>` : ''}
          ${matin.ancrage ? `<p class="aiguilleur-resume__ancrage"><em>« ${esc(matin.ancrage)} »</em></p>` : ''}
        </div>`;
    }

    let contenuHTML;

    if (aDepose) {
      // Tout fait
      contenuHTML = `
        <h1 class="aiguilleur__hello">${greeting}</h1>
        <p class="aiguilleur__sub"><em>Votre journée est déposée. Que la nuit soit douce.</em></p>
        ${renderResume()}
        <div class="aiguilleur__cta">
          <a href="/pages/carnet/historique/" class="adab-bouton adab-bouton--ghost">Voir mes journées</a>
        </div>
        <div class="aiguilleur__sortir">
          <a href="/index.html" class="adab-bouton-secondaire">Sortir du carnet</a>
        </div>
      `;
    } else if (aPose && heure >= 17) {
      // Posé + soir : c'est l'heure de relire
      contenuHTML = `
        <h1 class="aiguilleur__hello">${greeting}</h1>
        <p class="aiguilleur__sub"><em>Le soir est venu. Sans se juger, avec tendresse.</em></p>
        ${renderResume()}
        <div class="aiguilleur__cta">
          <a href="/pages/carnet/relire/" class="adab-bouton adab-bouton--grand">Relire ma journée</a>
        </div>
        <div class="aiguilleur__sortir">
          <a href="/pages/carnet/poser/" class="adab-bouton-secondaire">Modifier mon choix du matin</a>
          <a href="/index.html" class="adab-bouton-secondaire">Sortir du carnet</a>
        </div>
      `;
    } else if (aPose && heure < 17) {
      // Posé + journée en cours : on rappelle ce qui a été posé, on encourage à vivre la journée
      contenuHTML = `
        <h1 class="aiguilleur__hello">${greeting}</h1>
        <p class="aiguilleur__sub"><em>Vous avez déjà posé votre matin. La journée vous attend.</em></p>
        ${renderResume()}
        <div class="aiguilleur__cta">
          <a href="/index.html" class="adab-bouton adab-bouton--grand">Continuer ma journée</a>
        </div>
        <div class="aiguilleur__sortir">
          <a href="/pages/carnet/poser/" class="adab-bouton-secondaire">Modifier mon choix</a>
          <a href="/pages/carnet/relire/" class="adab-bouton-secondaire">Relire maintenant</a>
        </div>
      `;
    } else if (!aPose && heure < 17) {
      // Rien posé + matin/journée : poser
      contenuHTML = `
        <h1 class="aiguilleur__hello">${greeting}</h1>
        <p class="aiguilleur__sub"><em>Un seul thème, un objectif. Petit, c'est suffisant.</em></p>
        <div class="aiguilleur__cta">
          <a href="/pages/carnet/poser/" class="adab-bouton adab-bouton--grand">Poser ma journée</a>
        </div>
        <div class="aiguilleur__sortir">
          <a href="/index.html" class="adab-bouton-secondaire">Sortir du carnet</a>
        </div>
      `;
    } else {
      // Rien posé + soir : relire librement
      contenuHTML = `
        <h1 class="aiguilleur__hello">${greeting}</h1>
        <p class="aiguilleur__sub"><em>Vous n'avez rien posé ce matin. Vous pouvez quand même relire la journée.</em></p>
        <div class="aiguilleur__cta">
          <a href="/pages/carnet/relire/" class="adab-bouton adab-bouton--grand">Relire ma journée</a>
        </div>
        <div class="aiguilleur__sortir">
          <a href="/pages/carnet/poser/" class="adab-bouton-secondaire">Poser quand même</a>
          <a href="/index.html" class="adab-bouton-secondaire">Sortir du carnet</a>
        </div>
      `;
    }

    mount.innerHTML = `
      <section class="aiguilleur">
        ${contenuHTML}
        <div class="aiguilleur__ornement">✦</div>
        <p class="aiguilleur__hist">
          <a href="/pages/carnet/historique/">Mes journées passées →</a>
        </p>
      </section>
    `;
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<p style="text-align:center; color:#c44; padding:3rem;">Désolé, le carnet n'a pas pu être chargé.</p>`;
  }
})();
