/* ============================================================
   Le carnet d'adab — Le miroir du chemin (muḥāsaba)
   Un reflet contemplatif, jamais un tableau de scores.
   On regarde vers quelles vigilances le cœur est revenu —
   pas combien de fois on a « réussi ». Pas de série, pas de
   pourcentage, pas de rouge. Ce qui revient nous travaille ;
   ce qui manque, manque simplement.
   ============================================================ */
import { db } from './firebase-init.js';
import { collection, getDocs }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const anonId = localStorage.getItem('lvdd_carnet_id');
const prenom = localStorage.getItem('lvdd_carnet_prenom') || '';
const EN = document.documentElement.lang === 'en';
const BASE = EN ? '/en/pages/carnet/' : '/pages/carnet/';
const t = (fr, en) => (EN ? en : fr);
const LOCALE = EN ? 'en-US' : 'fr-FR';


if (!anonId) {
  window.location.href = BASE;
}

const mount = document.getElementById('miroir-mount');
const dateEl = document.getElementById('adab-date');

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function dateCourte(key) {
  const [y, m, d] = key.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
    .toLocaleDateString(LOCALE, { day: 'numeric', month: 'long' });
}
// Joint une liste en français : a, b et c
function joindreFr(arr) {
  if (arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  return arr.slice(0, -1).join(', ') + ' et ' + arr[arr.length - 1];
}

dateEl.textContent = 'le miroir';

(async () => {
  try {
    const [vigilancesRes, joursSnap] = await Promise.all([
      fetch('/data/carnet/vigilances' + (EN ? '.en' : '') + '.json').then(r => r.json()),
      getDocs(collection(db, 'carnets', anonId, 'jours'))
    ]);
    const vigilances = vigilancesRes.vigilances || [];
    const vigById = {};
    for (const v of vigilances) vigById[v.id] = v;

    // Rassemble les jours posés
    const jours = [];
    joursSnap.forEach(docSnap => {
      const data = docSnap.data() || {};
      if (data.matin && data.matin.poseLe) {
        jours.push({ key: docSnap.id, matin: data.matin, soir: data.soir || {} });
      }
    });
    // Tri chronologique
    jours.sort((a, b) => a.key.localeCompare(b.key));

    // === État vide ===
    if (jours.length === 0) {
      mount.innerHTML = `
        <section class="miroir">
          <header class="miroir__head">
            <p class="miroir__rubrique">Le miroir du chemin</p>
            <h1 class="miroir__titre">Encore vierge</h1>
            <div class="miroir__rule"></div>
          </header>
          <p class="miroir__vide"><em>Le miroir est encore vide. Il se remplira tout seul, un jour posé après l'autre — sans que vous ayez à compter quoi que ce soit.</em></p>
          <div class="miroir__actions">
            <a href="${BASE}poser/" class="adab-bouton adab-bouton--grand">Poser ma première journée</a>
          </div>
        </section>`;
      return;
    }

    const nbJours = jours.length;
    const nbDeposes = jours.filter(j => j.soir && j.soir.fermeLe).length;
    const premier = jours[0].key;
    const dernier = jours[jours.length - 1].key;

    // === Fréquence des vigilances (vers quoi le cœur est revenu) ===
    const compteVig = {};
    for (const j of jours) {
      const vid = j.matin.vigilanceId;
      if (vid) compteVig[vid] = (compteVig[vid] || 0) + 1;
    }
    // Ordonne les 10 vigilances par présence décroissante
    const vigOrdonnees = vigilances
      .map(v => ({ v, n: compteVig[v.id] || 0 }))
      .sort((a, b) => b.n - a.n);
    const maxN = vigOrdonnees[0]?.n || 1;
    const visitees = vigOrdonnees.filter(x => x.n > 0);
    const jamais = vigOrdonnees.filter(x => x.n === 0).map(x => x.v.label.toLowerCase());

    // === Narration douce ===
    const topNoms = visitees.slice(0, 2).map(x => `<strong>${esc(x.v.label.toLowerCase())}</strong>`);
    let recit = '';
    if (visitees.length === 1) {
      recit = `Pour l'instant, votre cœur s'est posé une seule fois — sur ${topNoms[0]}.`;
    } else {
      recit = `Sur ces jours, votre cœur est surtout revenu à ${joindreFr(topNoms)}.`;
      const peu = visitees.slice(-1)[0];
      if (peu && peu.n === 1 && visitees.length >= 3) {
        recit += ` Vous n'avez visité ${esc(peu.v.label.toLowerCase())} qu'une fois.`;
      }
    }
    let recitManque = '';
    if (jamais.length && jamais.length <= 6) {
      recitManque = `Certaines vigilances vous attendent encore : ${joindreFr(jamais.map(esc))}. Rien ne presse — elles viendront quand leur heure sera là.`;
    }

    // === Objectifs personnels récurrents (texte libre qui revient) ===
    const persoCompte = {};
    for (const j of jours) {
      const p = (j.matin.personnel || '').trim().toLowerCase();
      if (p) persoCompte[p] = (persoCompte[p] || 0) + 1;
    }
    const persoRecurrents = Object.entries(persoCompte)
      .filter(([, n]) => n >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // === Barres de présence (or, jamais rouge, libellées en « fois ») ===
    const barres = visitees.map(({ v, n }) => {
      const pct = Math.round((n / maxN) * 100);
      return `
        <div class="miroir-barre">
          <div class="miroir-barre__tete">
            <span class="miroir-barre__ar" lang="ar" dir="rtl">${esc(v.ar)}</span>
            <span class="miroir-barre__label">${esc(v.label)}</span>
            <span class="miroir-barre__n">${n} fois</span>
          </div>
          <div class="miroir-barre__piste">
            <div class="miroir-barre__remplie" style="width:${pct}%"></div>
          </div>
        </div>`;
    }).join('');

    // === Objectifs personnels récurrents (bloc optionnel) ===
    const persoHTML = persoRecurrents.length ? `
      <section class="miroir-bloc">
        <h2 class="miroir-bloc__titre">Ce que vous vous êtes redit</h2>
        <p class="miroir-bloc__sous"><em>Les mots que vous avez écrits plusieurs fois de vous-même.</em></p>
        <ul class="miroir-perso">
          ${persoRecurrents.map(([txt, n]) => `
            <li class="miroir-perso__item">
              <span class="miroir-perso__txt">« ${esc(txt)} »</span>
              <span class="miroir-perso__n">${n} fois</span>
            </li>`).join('')}
        </ul>
      </section>` : '';

    // === Rendu ===
    const intro = nbJours === 1
      ? `1 journée posée`
      : `${nbJours} journées posées`;
    const span = premier === dernier
      ? `le ${dateCourte(premier)}`
      : `du ${dateCourte(premier)} au ${dateCourte(dernier)}`;

    mount.innerHTML = `
      <section class="miroir">
        <header class="miroir__head">
          <p class="miroir__rubrique">Le miroir du chemin</p>
          <h1 class="miroir__titre">${prenom ? esc(prenom) + ', ' : ''}ce qui vous travaille</h1>
          <p class="miroir__compte">${intro} · ${span}</p>
          <div class="miroir__rule"></div>
        </header>

        <p class="miroir__recit">${recit}</p>
        ${recitManque ? `<p class="miroir__recit miroir__recit--soft"><em>${recitManque}</em></p>` : ''}

        <section class="miroir-bloc">
          <h2 class="miroir-bloc__titre">Vers quoi votre cœur est revenu</h2>
          <p class="miroir-bloc__sous"><em>Non pas ce que vous avez « réussi » — simplement là où vous vous êtes posé.</em></p>
          <div class="miroir-barres">${barres}</div>
        </section>

        ${persoHTML}

        <p class="miroir__sceau">
          <span class="miroir__sceau-orn">✦</span>
          <em>Pas de score, pas de note. Ce qui revient, c'est ce qui vous travaille.
          Ce qui manque, manque simplement.</em>
        </p>

        <div class="miroir__actions">
          <a href="${BASE}historique/" class="adab-bouton adab-bouton--ghost">Voir les journées une à une</a>
          <a href="${BASE}aujourdhui/" class="adab-bouton-secondaire">Revenir au carnet</a>
        </div>
      </section>`;
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<p style="text-align:center; color:#c44; padding:3rem;">Désolé, le miroir n'a pas pu être chargé.</p>`;
  }
})();
