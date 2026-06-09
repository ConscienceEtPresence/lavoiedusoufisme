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

dateEl.textContent = dateLisible();

(async () => {
  try {
    const date = todayKey();
    const heure = new Date().getHours();
    const [vigilancesRes, jourSnap] = await Promise.all([
      fetch('/data/carnet/vigilances.json').then(r => r.json()),
      getDoc(doc(db, 'carnets', anonId, 'jours', date)).catch(() => null)
    ]);
    const vigilances = vigilancesRes.vigilances || [];
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

    const greeting = heure < 12
      ? (prenom ? `Bonjour <em>${esc(prenom)}</em>,` : 'Bonjour,')
      : heure < 18
        ? (prenom ? `Bonjour <em>${esc(prenom)}</em>,` : 'Bonjour,')
        : (prenom ? `Bonsoir <em>${esc(prenom)}</em>,` : 'Bonsoir,');

    // Logique d'aiguillage
    let ctaPrincipal, ctaSecondaire, sub;

    if (!aPose && !aDepose) {
      // Rien fait → matin
      ctaPrincipal = `<a href="/pages/carnet/poser/" class="adab-bouton adab-bouton--grand">Poser ma journée</a>`;
      sub = `<em>Un seul thème, un objectif. Petit, c'est suffisant.</em>`;
    } else if (aPose && !aDepose && heure < 17) {
      // Posé, journée en cours
      const v = vigilances.find(x => x.id === matin.vigilanceId);
      ctaPrincipal = `
        <div class="aiguilleur-resume">
          <p class="aiguilleur-resume__label">Vous portez aujourd'hui</p>
          <p class="aiguilleur-resume__vigilance">
            <span lang="ar" dir="rtl" style="font-family:'Amiri',serif;">${esc(v?.ar || '')}</span>
            ${esc(v?.label || '')}
          </p>
          ${matin.ancrage ? `<p class="aiguilleur-resume__ancrage"><em>« ${esc(matin.ancrage)} »</em></p>` : ''}
        </div>
        <a href="/pages/carnet/relire/" class="adab-bouton adab-bouton--ghost">Relire en avance</a>
      `;
      ctaSecondaire = `<a href="/pages/carnet/poser/" class="adab-bouton-secondaire">Modifier ce que j'ai posé</a>`;
      sub = `<em>La journée se déploie. Le carnet vous attend ce soir.</em>`;
    } else if (aPose && !aDepose) {
      // Posé, soir
      ctaPrincipal = `<a href="/pages/carnet/relire/" class="adab-bouton adab-bouton--grand">Relire ma journée</a>`;
      sub = `<em>Sans se juger. Avec tendresse.</em>`;
    } else if (aDepose) {
      // Tout fait
      const v = vigilances.find(x => x.id === matin.vigilanceId);
      ctaPrincipal = `
        <div class="aiguilleur-resume aiguilleur-resume--fait">
          <p class="aiguilleur-resume__label">Votre journée est déposée.</p>
          ${v ? `<p class="aiguilleur-resume__vigilance"><span lang="ar" dir="rtl" style="font-family:'Amiri',serif;">${esc(v.ar)}</span> ${esc(v.label)}</p>` : ''}
        </div>
        <a href="/pages/carnet/historique/" class="adab-bouton adab-bouton--ghost">Voir mon historique</a>
      `;
      sub = `<em>Le jour est gardé. Que la nuit soit douce.</em>`;
    } else if (!aPose && heure >= 17) {
      // Soir mais pas posé → relire libre
      ctaPrincipal = `<a href="/pages/carnet/relire/" class="adab-bouton adab-bouton--grand">Relire ma journée</a>`;
      ctaSecondaire = `<a href="/pages/carnet/poser/" class="adab-bouton-secondaire">Poser quand même</a>`;
      sub = `<em>Vous n'avez rien posé ce matin. Vous pouvez quand même relire.</em>`;
    }

    mount.innerHTML = `
      <section class="aiguilleur">
        <h1 class="aiguilleur__hello">${greeting}</h1>
        <p class="aiguilleur__sub">${sub}</p>
        <div class="aiguilleur__cta">${ctaPrincipal}</div>
        ${ctaSecondaire ? `<div class="aiguilleur__cta-secondaire">${ctaSecondaire}</div>` : ''}

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
