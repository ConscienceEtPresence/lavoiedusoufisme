/* ============================================================
   Le carnet d'adab — Tableau de bord principal
   Toujours visible : ce que j'ai posé + les 10 vigilances accessibles
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

    try {
      await setDoc(doc(db, 'carnets', anonId, '_meta', 'profil'), {
        prenom: prenom || null,
        lastSeen: serverTimestamp()
      }, { merge: true });
    } catch (e) {}

    const g = greetingByHour(heure);
    const greeting = prenom ? `${g} <em>${esc(prenom)}</em>,` : `${g},`;

    // === SECTION 1 : « Aujourd'hui » ===
    function renderSection1() {
      // Cas 1 : journée déposée
      if (aDepose) {
        const v = vigilances.find(x => x.id === matin.vigilanceId);
        return `
          <section class="dash-aujourd-hui dash-aujourd-hui--depose">
            <p class="dash-aujourd-hui__label">Aujourd'hui · journée déposée</p>
            <p class="dash-aujourd-hui__msg"><em>Le jour est gardé. Que la nuit soit douce.</em></p>
            ${v ? `<p class="dash-aujourd-hui__resume"><span lang="ar" dir="rtl" style="font-family:'Amiri',serif; color:var(--adab-gold-deep);">${esc(v.ar)}</span> · ${esc(v.label)}</p>` : ''}
            <div class="dash-actions">
              <a href="/pages/carnet/historique/?j=${date}" class="adab-bouton adab-bouton--ghost">Voir ma journée</a>
            </div>
          </section>`;
      }
      // Cas 2 : matin posé, soir non
      if (aPose) {
        const v = vigilances.find(x => x.id === matin.vigilanceId);
        const objsChoisis = (matin.objectifsIds || []).map(id => objectifs.find(o => o.id === id)).filter(Boolean);
        const objsHTML = objsChoisis.map(o => `<li class="resume-obj">${esc(o.matin.libelle)}</li>`).join('');
        const persoHTML = matin.personnel ? `<li class="resume-obj resume-obj--perso">${esc(matin.personnel)}</li>` : '';
        const ctaSoir = heure >= 17
          ? `<a href="/pages/carnet/relire/" class="adab-bouton adab-bouton--grand">Relire ma journée</a>`
          : `<a href="/pages/carnet/relire/" class="adab-bouton adab-bouton--ghost">Relire en avance</a>`;
        return `
          <section class="dash-aujourd-hui dash-aujourd-hui--pose">
            <p class="dash-aujourd-hui__label">Ce que j'ai posé ce matin</p>
            ${v ? `
              <div class="dash-vigilance">
                <span class="dash-vigilance__ar" lang="ar" dir="rtl">${esc(v.ar)}</span>
                <h3 class="dash-vigilance__titre">${esc(v.label)}</h3>
              </div>` : ''}
            ${(objsHTML || persoHTML) ? `<ul class="dash-objs">${objsHTML}${persoHTML}</ul>` : ''}
            ${matin.ancrage ? `<p class="dash-ancrage"><em>« ${esc(matin.ancrage)} »</em></p>` : ''}
            <div class="dash-actions">
              ${ctaSoir}
              <a href="/pages/carnet/poser/" class="adab-bouton-secondaire">Modifier mon choix</a>
            </div>
          </section>`;
      }
      // Cas 3 : rien posé, matin → invitation
      if (heure < 17) {
        return `
          <section class="dash-aujourd-hui dash-aujourd-hui--vide">
            <p class="dash-aujourd-hui__label">Aujourd'hui</p>
            <p class="dash-aujourd-hui__msg dash-aujourd-hui__msg--invite">
              <em>Un seul thème, un objectif. Petit, c'est suffisant.</em>
            </p>
            <div class="dash-actions">
              <a href="/pages/carnet/poser/" class="adab-bouton adab-bouton--grand">Poser ma journée</a>
            </div>
            <p class="dash-aujourd-hui__hint">
              <em>Ou explorez les vigilances ci-dessous et prenez-en une quand quelque chose vous appelle.</em>
            </p>
          </section>`;
      }
      // Cas 4 : rien posé, soir → relire libre
      return `
        <section class="dash-aujourd-hui dash-aujourd-hui--vide">
          <p class="dash-aujourd-hui__label">Aujourd'hui</p>
          <p class="dash-aujourd-hui__msg"><em>Vous n'avez rien posé ce matin. Vous pouvez quand même relire la journée.</em></p>
          <div class="dash-actions">
            <a href="/pages/carnet/relire/" class="adab-bouton adab-bouton--grand">Relire ma journée</a>
            <a href="/pages/carnet/poser/" class="adab-bouton-secondaire">Poser quand même</a>
          </div>
        </section>`;
    }

    // === SECTION 2 : Les 10 vigilances toujours visibles ===
    function renderSection2() {
      const cards = vigilances.map(v => {
        const isCurrente = aPose && matin.vigilanceId === v.id;
        return `
          <a href="/pages/carnet/poser/?vigilance=${esc(v.id)}" class="dash-vig-carte ${isCurrente ? 'is-current' : ''}">
            ${isCurrente ? '<span class="dash-vig-carte__current-tag">aujourd\'hui</span>' : ''}
            <span class="dash-vig-carte__ar" lang="ar" dir="rtl">${esc(v.ar)}</span>
            <span class="dash-vig-carte__tr">${esc(v.tr)}</span>
            <span class="dash-vig-carte__label">${esc(v.label)}</span>
          </a>`;
      }).join('');
      const titre = aPose
        ? 'Explorer les vigilances et leurs enseignements'
        : 'Choisissez une vigilance pour aujourd\'hui';
      const sub = aPose
        ? 'Vous pouvez en lire une autre — ou changer pour celle-là.'
        : 'Cliquez pour découvrir l\'enseignement, le verset, le Nom divin qui l\'accompagne.';
      return `
        <section class="dash-vigilances">
          <header class="dash-vigilances__head">
            <h2 class="dash-vigilances__titre">${esc(titre)}</h2>
            <p class="dash-vigilances__sub"><em>${esc(sub)}</em></p>
          </header>
          <div class="dash-vig-grille">${cards}</div>
        </section>`;
    }

    // === SECTION 3 : Liens du bas ===
    function renderSection3() {
      return `
        <section class="dash-bas">
          <div class="dash-ornement">✦</div>
          <p class="dash-liens">
            <a href="/pages/carnet/historique/">Mes journées passées →</a>
          </p>
          <p class="dash-liens dash-liens--soft">
            <a href="/index.html">Sortir du carnet</a>
          </p>
        </section>`;
    }

    mount.innerHTML = `
      <section class="dash">
        <h1 class="dash__hello">${greeting}</h1>
        ${renderSection1()}
        ${renderSection2()}
        ${renderSection3()}
      </section>
    `;
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<p style="text-align:center; color:#c44; padding:3rem;">Désolé, le carnet n'a pas pu être chargé.</p>`;
  }
})();
