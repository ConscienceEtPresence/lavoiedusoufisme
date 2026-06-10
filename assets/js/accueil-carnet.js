/* ============================================================
   Accueil — Bandeau « Aujourd'hui » / "Today"
   Liste discrète des objectifs posés ce matin, façon page de carnet
   ouverte. S'efface si rien n'est posé ou si l'utilisateur n'a pas
   encore de carnet. Aucune salutation, aucun titre — juste les choses.
   Bilingue (FR/EN selon document.documentElement.lang).
   ============================================================ */
import { db } from './carnet/firebase-init.js';
import { doc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const EN = document.documentElement.lang === 'en';
const t = (fr, en) => (EN ? en : fr);
const BASE = EN ? '/en/pages/carnet/' : '/pages/carnet/';

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
          fetch('/data/carnet/objectifs' + (EN ? '.en' : '') + '.json').then(r => r.json()).catch(() => ({})),
          fetch('/data/carnet/vigilances' + (EN ? '.en' : '') + '.json').then(r => r.json()).catch(() => ({}))
        ]);

        const esc = s => String(s == null ? '' : s)
          .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        const heure = d.getHours();

        const jour = jourSnap?.exists() ? jourSnap.data() : {};
        const matin = jour.matin || {};
        const soir = jour.soir || {};
        const aPose = !!matin.poseLe;
        const aDepose = !!soir.fermeLe;

        // === Cas 0 : rien posé aujourd'hui → invitation animée à poser
        if (!aPose) {
          const tard = heure >= 17;
          const phrase = tard
            ? t("La journée s'avance, et rien n'a encore été posé.", "The day is drawing on, and nothing has been set yet.")
            : t("Vous n'avez rien posé pour aujourd'hui.", "You have not set anything for today.");
          const ctaLabel = tard ? t('Poser, même tard', 'Set it, even late') : t('Poser ma journée', 'Set my day');
          mount.hidden = false;
          mount.innerHTML = `
            <a class="accueil-carnet__lien" href="${BASE}poser/" aria-label="${t('Poser ma journée dans le carnet','Set my day in the notebook')}">
              <span class="accueil-carnet__eyebrow">${t('Mon carnet','My notebook')}</span>
              <span class="accueil-carnet__souffle" aria-hidden="true">
                <span class="accueil-carnet__souffle-dot"></span>
              </span>
              <p class="accueil-carnet__invite">${esc(phrase)}</p>
              <span class="accueil-carnet__cta">${esc(ctaLabel)}<span class="accueil-carnet__cta-arrow"> →</span></span>
            </a>
          `;
          mount.classList.add('accueil-carnet--invite');
          requestAnimationFrame(() => mount.classList.add('is-visible'));
          return;
        }

        const objectifs = objectifsRes.objectifs || [];
        const vigilances = vigilancesRes.vigilances || [];
        const objById = {};
        for (const o of objectifs) objById[o.id] = o;
        const vig = vigilances.find(v => v.id === matin.vigilanceId);

        // === Cas 1 : journée déposée → ligne unique très douce
        if (aDepose) {
          mount.hidden = false;
          mount.innerHTML = `
            <a class="accueil-carnet__lien" href="${BASE}aujourdhui/">
              <span class="accueil-carnet__depose"><em>${t('Journée gardée.','Day kept.')}</em></span>
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

        const itemsHTML = items.map((txt, i) =>
          `<li class="accueil-carnet__item" style="--i:${i}">${esc(txt)}</li>`
        ).join('');

        const sig = vig
          ? `<span class="accueil-carnet__sig">
               <span class="accueil-carnet__sig-ar" lang="ar" dir="rtl">${esc(vig.ar || '')}</span>
               <span class="accueil-carnet__sig-tr">${esc(vig.tr || '')}</span>
             </span>`
          : '';

        mount.hidden = false;
        mount.innerHTML = `
          <a class="accueil-carnet__lien" href="${BASE}aujourdhui/" aria-label="${t("Reprendre mon carnet d'aujourd'hui","Resume my notebook for today")}">
            <span class="accueil-carnet__eyebrow">${t('Mon carnet','My notebook')}</span>
            <span class="accueil-carnet__date">${t("Aujourd'hui",'Today')}</span>
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
