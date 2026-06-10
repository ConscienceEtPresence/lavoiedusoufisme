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
    const STATUTS_LABEL = {
      tenu: 'tenu', parfois: 'parfois', oublie: 'oublié', repris: 'à reprendre'
    };

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

    // Vue liste
    const compterVigilances = {};
    let totalDeposes = 0;
    for (const j of jours) {
      if (j.data.matin?.vigilanceId) {
        compterVigilances[j.data.matin.vigilanceId] = (compterVigilances[j.data.matin.vigilanceId] || 0) + 1;
      }
      if (j.data.soir?.fermeLe) totalDeposes++;
    }
    const topVig = Object.entries(compterVigilances)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const histHTML = jours.map(j => {
      const m = j.data.matin || {};
      const s = j.data.soir || {};
      const v = vigilances.find(x => x.id === m.vigilanceId);
      const aDepose = !!s.fermeLe;
      const aPose = !!m.poseLe;
      return `
        <a class="hist-jour" href="?j=${esc(j.date)}">
          <div class="hist-jour__date">
            <span class="hist-jour__jour">${dateCourte(j.date)}</span>
            <span class="hist-jour__semaine">${dateLisible(j.date).split(' ')[0]}</span>
          </div>
          <div class="hist-jour__contenu">
            ${v ? `
              <p class="hist-jour__vigilance">
                <span lang="ar" dir="rtl" style="font-family:'Amiri',serif; color:#8a7028;">${esc(v.ar)}</span>
                ${esc(v.label)}
              </p>` : '<p class="hist-jour__vigilance hist-jour__vigilance--vide"><em>—</em></p>'}
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
      const v = vigilances.find(x => x.id === m.vigilanceId);
      const objsChoisis = (m.objectifsIds || []).map(id => objectifs.find(o => o.id === id)).filter(Boolean);
      const bilansObjs = s.bilansObjectifs || {};

      mount.innerHTML = `
        <a href="${BASE}historique/" class="adab-back-link">← ${t("Toutes mes journées","All my days")}</a>

        <article class="hist-detail">
          <header class="hist-detail__head">
            <p class="hist-detail__date">${dateLisible(j.date)}</p>
            ${v ? `
              <h1 class="hist-detail__vigilance">
                <span lang="ar" dir="rtl" style="font-family:'Amiri',serif; display:block; font-size:1.5rem; color:#8a7028; margin-bottom:.3rem;">${esc(v.ar)}</span>
                ${esc(v.label)}
              </h1>` : ''}
          </header>

          ${m.ancrage ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">${t("Ce matin, ce qui se jouait","This morning, what was at play")}</span>
              <p><em>« ${esc(m.ancrage)} »</em></p>
            </div>` : ''}

          ${objsChoisis.length ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">Mes objectifs</span>
              ${objsChoisis.map(o => {
                const b = bilansObjs[o.id] || {};
                return `
                  <div class="hist-detail__obj">
                    <p class="hist-detail__obj-lib">${esc(o.matin.libelle)}</p>
                    ${b.statut ? `<p class="hist-detail__obj-statut">→ ${esc(STATUTS_LABEL[b.statut] || b.statut)}</p>` : '<p class="hist-detail__obj-statut hist-detail__obj-statut--vide">— pas de bilan —</p>'}
                    ${b.note ? `<p class="hist-detail__obj-note">${esc(b.note)}</p>` : ''}
                  </div>`;
              }).join('')}
            </div>` : ''}

          ${m.personnel ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">Mon objectif personnel</span>
              <p>${esc(m.personnel)}</p>
              ${s.bilanPersonnel?.statut ? `<p class="hist-detail__obj-statut">→ ${esc(STATUTS_LABEL[s.bilanPersonnel.statut] || s.bilanPersonnel.statut)}</p>` : ''}
              ${s.bilanPersonnel?.note ? `<p class="hist-detail__obj-note">${esc(s.bilanPersonnel.note)}</p>` : ''}
            </div>` : ''}

          ${s.presente ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">Ce qui s'est présenté à moi</span>
              <p>${esc(s.presente)}</p>
            </div>` : ''}

          ${s.gratitudeNote ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">Une gratitude</span>
              <p>${esc(s.gratitudeNote)}</p>
            </div>` : ''}

          ${s.repriseTexte ? `
            <div class="hist-detail__bloc">
              <span class="hist-detail__label">Pour demain</span>
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
