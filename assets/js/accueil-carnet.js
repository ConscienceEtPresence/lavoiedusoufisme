/* ============================================================
   Accueil — Bandeau « Aujourd'hui »
   Liste discrète des objectifs posés ce matin, façon page de carnet
   ouverte. S'efface si rien n'est posé ou si l'utilisateur n'a pas
   encore de carnet. Aucune salutation, aucun titre — juste les choses.
   ============================================================ */
import { db } from './carnet/firebase-init.js';
import { doc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const mount = document.getElementById('accueil-carnet');
if (!mount) { /* page sans bandeau */ }
else {
  const anonId = localStorage.getItem('lvdd_carnet_id');
  if (!anonId) {
    // Pas de carnet ouvert → rien
  } else {
    (async () => {
      try {
        const d = new Date();
        const date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

        const [jourSnap, objectifsRes, vigilancesRes] = await Promise.all([
          getDoc(doc(db, 'carnets', anonId, 'jours', date)).catch(() => null),
          fetch('/data/carnet/objectifs.json').then(r => r.json()).catch(() => ({})),
          fetch('/data/carnet/vigilances.json').then(r => r.json()).catch(() => ({}))
        ]);

        if (!jourSnap?.exists()) return;
        const jour = jourSnap.data();
        const matin = jour.matin || {};
        const soir = jour.soir || {};
        const aPose = !!matin.poseLe;
        const aDepose = !!soir.fermeLe;

        if (!aPose) return; // Pas posé → rien à rappeler

        const objectifs = objectifsRes.objectifs || [];
        const vigilances = vigilancesRes.vigilances || [];
        const objById = {};
        for (const o of objectifs) objById[o.id] = o;
        const vig = vigilances.find(v => v.id === matin.vigilanceId);

        // === Cas 1 : journée déposée → ligne unique très douce
        if (aDepose) {
          mount.hidden = false;
          mount.innerHTML = `
            <a class="accueil-carnet__lien" href="/pages/carnet/aujourdhui/">
              <span class="accueil-carnet__depose"><em>Journée gardée.</em></span>
            </a>
          `;
          requestAnimationFrame(() => mount.classList.add('is-visible'));
          return;
        }

        // === Cas 2 : matin posé → liste des objectifs cochés + perso
        const items = [];
        for (const id of (matin.objectifsIds || [])) {
          const o = objById[id];
          if (o?.matin?.libelle) items.push(o.matin.libelle);
        }
        if (matin.personnel) items.push(matin.personnel);

        if (!items.length) return; // garde-fou

        const esc = s => String(s == null ? '' : s)
          .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

        const itemsHTML = items.map((t, i) =>
          `<li class="accueil-carnet__item" style="--i:${i}">${esc(t)}</li>`
        ).join('');

        const sig = vig
          ? `<span class="accueil-carnet__sig">
               <span class="accueil-carnet__sig-ar" lang="ar" dir="rtl">${esc(vig.ar || '')}</span>
               <span class="accueil-carnet__sig-tr">${esc(vig.tr || '')}</span>
             </span>`
          : '';

        mount.hidden = false;
        mount.innerHTML = `
          <a class="accueil-carnet__lien" href="/pages/carnet/aujourdhui/" aria-label="Reprendre mon carnet d'aujourd'hui">
            <span class="accueil-carnet__eyebrow">Mon carnet</span>
            <span class="accueil-carnet__date">Aujourd'hui</span>
            <ul class="accueil-carnet__liste">${itemsHTML}</ul>
            ${sig}
          </a>
        `;
        // Trigger entrance
        requestAnimationFrame(() => mount.classList.add('is-visible'));
      } catch (e) {
        // Silencieux — pas de carnet visible si quoi que ce soit échoue
        console.warn('[accueil-carnet]', e);
      }
    })();
  }
}
