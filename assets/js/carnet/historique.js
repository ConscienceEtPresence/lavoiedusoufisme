/* ============================================================
   Le carnet d'adab — Historique des journées déposées
   ============================================================ */
import { db } from './firebase-init.js';
import { collection, getDocs, doc, getDoc }
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

const mount = document.getElementById('hist-mount');
const dateEl = document.getElementById('adab-date');

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function dateLisible(s) {
  const [y, m, d] = s.split('-');
  const dt = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
  return dt.toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
}
function dateCourte(s) {
  const [y, m, d] = s.split('-');
  const dt = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
  return dt.toLocaleDateString(LOCALE, { day: 'numeric', month: 'short' });
}

dateEl.textContent = t('historique','history');

const params = new URLSearchParams(location.search);
const dateOuvert = params.get('j');

(async () => {
  try {
    const [vigilancesRes, objectifsRes, joursSnap] = await Promise.all([
      fetch('/data/carnet/vigilances' + (EN ? '.en' : '') + '.json').then(r => r.json()),
      fetch('/data/carnet/objectifs' + (EN ? '.en' : '') + '.json').then(r => r.json()),
      getDocs(collection(db, 'carnets', anonId, 'jours'))
    ]);
    const vigilances = vigilancesRes.vigilances || [];
    const objectifs = objectifsRes.objectifs || [];
    const STATUTS_LABEL = EN
      ? { tenu: 'kept', parfois: 'sometimes', oublie: 'forgotten', repris: 'to take up again' }
      : { tenu: 'tenu', parfois: 'parfois', oublie: 'oublié', repris: 'à reprendre' };

    const jours = [];
    joursSnap.forEach(d => jours.push({ date: d.id, data: d.data() }));
    jours.sort((a, b) => b.date.localeCompare(a.date));

    if (dateOuvert) {
      // Vue détail d'un jour
      const j = jours.find(x => x.date === dateOuvert);
      if (!j) {
        mount.innerHTML = `<p style="text-align:center; padding:3rem;">${t("Jour introuvable.","Day not found.")}</p>`;
        return;
      }
      renderJour(j);
      return;
    }

    if (!jours.length) {
      mount.innerHTML = `
        <section class="hist-vide">
          <h1 class="adab-h1">${prenom ? `${t('Hello','Hello')} <em>${esc(prenom)}</em>,` : t('Bonjour,','Hello,')}</h1>
          <p class="adab-intro"><em>${t("Aucune journée n'est encore déposée.","No day has been laid down yet.")}</em></p>
          <p style="text-align:center; max-width:30rem; margin: 1rem auto;">
            ${t("Posez votre première journée — l'historique se construira au fil des jours.","Set your first day — the history will build over the days.")}
          </p>
          <div class="adab-commit"><a href="${BASE}poser/" class="adab-bouton">${t("Poser ma première journée","Set my first day")}</a></div>
        </section>`;
      return;
    }

    // Les vigilances réellement portées dans une journée (multi-thèmes + compat)
    // Fonction (hoistée) car renderJour peut l'appeler dès la vue détail.
    function vigsDuJour(m) {
      return (m && m.objectifs && m.objectifs.length)
        ? [...new Set(m.objectifs.map(o => o.vigilance).filter(Boolean))]
        : (m && m.vigilanceId ? [m.vigilanceId] : []);
    }

    // Vue liste
    const compterVigilances = {};
    let totalDeposes = 0;
    for (const j of jours) {
      for (const vid of vigsDuJour(j.data.matin)) {
        compterVigilances[vid] = (compterVigilances[vid] || 0) + 1;
      }
      if (j.data.soir?.fermeLe) totalDeposes++;
    }
    const topVig = Object.entries(compterVigilances)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const histHTML = jours.map(j => {
      const m = j.data.matin || {};
      const s = j.data.soir || {};
      const vigsJ = vigsDuJour(m).map(id => vigilances.find(x => x.id === id)).filter(Boolean);
      const aDepose = !!s.fermeLe;
      const aPose = !!m.poseLe;
      const vigHTML = vigsJ.length === 0
        ? '<p class="hist-jour__vigilance hist-jour__vigilance--vide"><em>—</em></p>'
        : vigsJ.length === 1
          ? `<p class="hist-jour__vigilance"><span lang="ar" dir="rtl" style="font-family:'Amiri',serif; color:#8a7028;">${esc(vigsJ[0].ar)}</span> ${esc(vigsJ[0].label)}</p>`
          : `<p class="hist-jour__vigilance">${vigsJ.map(v => esc(v.label)).join(' · ')}</p>`;
      return `
        <a class="hist-jour" href="?j=${esc(j.date)}">
          <div class="hist-jour__date">
            <span class="hist-jour__jour">${dateCourte(j.date)}</span>
            <span class="hist-jour__semaine">${dateLisible(j.date).split(' ')[0]}</span>
          </div>
          <div class="hist-jour__contenu">
            ${vigHTML}
            ${m.ancrage ? `<p class="hist-jour__ancrage"><em>« ${esc(m.ancrage)} »</em></p>` : ''}
          </div>
          <div class="hist-jour__statut">
            ${aDepose ? '<span class="hist-jour__check">✓</span>' : (aPose ? '<span class="hist-jour__pose">○</span>' : '<span class="hist-jour__rien">·</span>')}
          </div>
        </a>`;
    }).join('');

    mount.innerHTML = `
      <section class="hist-stats">
        <h1 class="adab-h1">${prenom ? `${t('Your days','Your days')}, ${esc(prenom)}` : t('Vos journées','My days')}</h1>
        <p class="adab-intro"><em>${totalDeposes} ${EN ? (totalDeposes>1?'days laid down':'day laid down') : ('journée'+(totalDeposes>1?'s':'')+' déposée'+(totalDeposes>1?'s':''))}.</em></p>
        ${topVig.length ? `
          <div class="hist-top-vig">
            <p class="hist-top-vig__label">${t("Ce qui revient le plus","What returns most")}</p>
            <ul>
              ${topVig.map(([id, n]) => {
                const v = vigilances.find(x => x.id === id);
                return v ? `<li><strong>${esc(v.label)}</strong> · ${n} ${t('fois','times')}</li>` : '';
              }).join('')}
            </ul>
          </div>` : ''}
      </section>

      <section class="hist-liste">${histHTML}</section>
    `;

    function renderJour(j) {
      const m = j.data.matin || {};
      const s = j.data.soir || {};
      const objById = {}; for (const o of objectifs) objById[o.id] = o;
      const objLib = id => objById[id]?.matin?.libelle || '';
      // Toutes les vigilances réellement portées ce jour (multi-thèmes)
      const vigsJ = vigsDuJour(m).map(id => vigilances.find(x => x.id === id)).filter(Boolean);
      const multiVig = vigsJ.length > 1;
      const objsChoisis = (m.objectifsIds || []).map(id => objById[id]).filter(Boolean);
      const bilansObjs = s.bilansObjectifs || {};
      // Instants recueillis en cours de journée
      const recueils = Array.isArray(j.data.recueils)
        ? j.data.recueils.slice().sort((a, b) => (a.le || 0) - (b.le || 0)) : [];
      const RSTAT = EN
        ? { vecu: 'inhabited', traverse: 'moved through', manque: 'missed' }
        : { vecu: 'habité', traverse: 'traversé', manque: 'manqué' };
      const vigsDeR = r => (Array.isArray(r.vigilanceIds) && r.vigilanceIds.length)
        ? r.vigilanceIds : (r.vigilanceId ? [r.vigilanceId] : []);

      const headVig = vigsJ.length === 0 ? '' : (vigsJ.length === 1
        ? `<h1 class="hist-detail__vigilance">
             <span lang="ar" dir="rtl" style="font-family:'Amiri',serif; display:block; font-size:1.5rem; color:#8a7028; margin-bottom:.3rem;">${esc(vigsJ[0].ar)}</span>
             ${esc(vigsJ[0].label)}
           </h1>`
        : `<h1 class="hist-detail__vigilance hist-detail__vigilance--multi">${vigsJ.map(v => esc(v.label)).join(' · ')}</h1>`);

      mount.innerHTML = `
        <a href="${BASE}historique/" class="adab-back-link">← ${t("Toutes mes journées","All my days")}</a>

        <article class="hist-detail">
          <header class="hist-detail__head">
            <p class="hist-detail__date">${dateLisible(j.date)}</p>
            ${headVig}
          </header>

          ${m.ancrage ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">${t("Ce matin, ce qui se jouait","This morning, what was at play")}</span>
              <p><em>« ${esc(m.ancrage)} »</em></p>
            </div>` : ''}

          ${objsChoisis.length ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">${t("Mes objectifs","My objectives")}</span>
              ${objsChoisis.map(o => {
                const b = bilansObjs[o.id] || {};
                const vObj = multiVig ? vigilances.find(x => x.id === o.vigilance) : null;
                return `
                  <div class="hist-detail__obj">
                    ${vObj ? `<span class="hist-detail__obj-theme">${esc(vObj.label)}</span>` : ''}
                    <p class="hist-detail__obj-lib">${esc(o.matin.libelle)}</p>
                    ${b.statut ? `<p class="hist-detail__obj-statut">→ ${esc(STATUTS_LABEL[b.statut] || b.statut)}</p>` : `<p class="hist-detail__obj-statut hist-detail__obj-statut--vide">${t("— pas de bilan —","— no review —")}</p>`}
                    ${b.note ? `<p class="hist-detail__obj-note">${esc(b.note)}</p>` : ''}
                  </div>`;
              }).join('')}
            </div>` : ''}

          ${recueils.length ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">${t("Ce que la journée a fait vivre","What the day brought to life")}</span>
              ${recueils.map(r => {
                const vs = vigsDeR(r).map(id => vigilances.find(x => x.id === id)).filter(Boolean);
                const precis = (r.objectifsIds || []).map(objLib).filter(Boolean);
                return `
                  <div class="hist-detail__obj hist-detail__recueil ${r.statut === 'vecu' ? 'is-habite' : ''}">
                    ${vs.map(v => `<span class="hist-detail__obj-theme">${esc(v.label)}</span>`).join('')}
                    ${r.texte ? `<p class="hist-detail__obj-lib">${esc(r.texte)}</p>` : ''}
                    ${precis.length ? `<p class="hist-detail__obj-note">${precis.map(p => `↳ ${esc(p)}`).join('<br>')}</p>` : ''}
                    ${r.statut && RSTAT[r.statut] ? `<p class="hist-detail__obj-statut">${esc(RSTAT[r.statut])}${r.statut === 'vecu' ? ' ✦' : ''}</p>` : ''}
                    ${r.apprentissage ? `<p class="hist-detail__obj-note"><em>« ${esc(r.apprentissage)} »</em></p>` : ''}
                  </div>`;
              }).join('')}
            </div>` : ''}

          ${m.personnel ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">${t("Mon objectif personnel","My personal objective")}</span>
              <p>${esc(m.personnel)}</p>
              ${s.bilanPersonnel?.statut ? `<p class="hist-detail__obj-statut">→ ${esc(STATUTS_LABEL[s.bilanPersonnel.statut] || s.bilanPersonnel.statut)}</p>` : ''}
              ${s.bilanPersonnel?.note ? `<p class="hist-detail__obj-note">${esc(s.bilanPersonnel.note)}</p>` : ''}
            </div>` : ''}

          ${s.presente ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">${t("Ce qui s'est présenté à moi","What came to me")}</span>
              <p>${esc(s.presente)}</p>
            </div>` : ''}

          ${s.gratitudeNote ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">${t("Une gratitude","A gratitude")}</span>
              <p>${esc(s.gratitudeNote)}</p>
            </div>` : ''}

          ${s.repriseTexte ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">${t("Pour demain","For tomorrow")}</span>
              <p>${esc(s.repriseTexte)}</p>
            </div>` : ''}
        </article>
      `;
    }
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<p style="text-align:center; color:#c44; padding:3rem;">${t("Désolé, l'historique n'a pas pu être chargé.","Sorry, the history could not be loaded.")}</p>`;
  }
})();
