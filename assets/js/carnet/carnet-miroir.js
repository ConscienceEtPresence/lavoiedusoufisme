/* ============================================================
   Page « Mon miroir » — l'historique de l'utilisateur
   ============================================================ */
import { db } from './firebase-init.js';
import { collection, getDocs }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const SESSION_KEY = 'lvdd_carnet_session';
const mount = document.getElementById('miroir-mount');
const sortirLink = document.getElementById('sortir-link');

sortirLink?.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Sortir de votre carnet ? (vos données sont gardées)')) {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '../';
  }
});

const sessionRaw = localStorage.getItem(SESSION_KEY);
if (!sessionRaw) { window.location.href = '../entrer/'; throw new Error('no session'); }
const session = JSON.parse(sessionRaw);
const { codeId, prenom } = session;

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function dateLisible(key) {
  try {
    const [y, m, d] = key.split('-').map(n => parseInt(n, 10));
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  } catch { return key; }
}
function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2, '0');
  const j = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${j}`;
}
function joursEntre(a, b) {
  return Math.floor((b - a) / (1000*60*60*24));
}

async function load() {
  const [pratiquesJson, motsJson, joursSnap] = await Promise.all([
    fetch('/data/carnet/pratiques.json').then(r => r.json()),
    fetch('/data/carnet/mots-graines.json').then(r => r.json()),
    getDocs(collection(db, 'carnets', codeId, 'jours'))
  ]);

  const jours = [];
  joursSnap.forEach(d => jours.push({ key: d.id, ...d.data() }));
  jours.sort((a, b) => b.key.localeCompare(a.key));

  const motCompagnon = motsJson.mots.find(m => m.id === session.motGraine);
  const pratiquesById = {};
  pratiquesJson.pratiques.forEach(p => { pratiquesById[p.id] = p; });

  render({ jours, pratiquesById, motCompagnon });
}

function tableauHM({ jours }) {
  // calendrier des 30 derniers jours
  const today = new Date();
  const map = {};
  jours.forEach(j => { map[j.key] = j; });
  const cells = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const k = dateKey(d);
    const j = map[k];
    let cls = 'miroir-cell';
    let title = dateLisible(k);
    if (j) {
      const a = !!j.matin, b = !!j.soir;
      if (a && b) { cls += ' miroir-cell--full';    title += ' · matin + soir'; }
      else if (a)  { cls += ' miroir-cell--matin';  title += ' · matin seulement'; }
      else if (b)  { cls += ' miroir-cell--soir';   title += ' · soir seulement'; }
    }
    cells.push(`<div class="${cls}" title="${esc(title)}" data-key="${k}"></div>`);
  }
  return `<div class="miroir-calendar">${cells.join('')}</div>`;
}

function compterReponses(j) {
  const reps = j.soir?.reponses || {};
  let oui = 0, partie = 0, non = 0;
  Object.values(reps).forEach(v => {
    if (v === 'yes') oui++;
    else if (v === 'partial') partie++;
    else if (v === 'no') non++;
  });
  return { oui, partie, non, total: oui + partie + non };
}

function renderJour(j, pratiquesById) {
  const intentionId = j.matin?.intentionId;
  const intentionLabel = intentionId ? pratiquesById[intentionId]?.fr?.nom : null;
  const c = compterReponses(j);
  const noteMatin = j.matin?.note || '';
  const noteSoir  = j.soir?.note  || '';

  let detailHTML = '';
  if (intentionId || noteMatin) {
    detailHTML += `<div class="miroir-detail-section"><div class="miroir-detail-label">Matin</div>`;
    if (intentionLabel) detailHTML += `<div class="miroir-detail-line"><em>Intention :</em> ${esc(intentionLabel)}</div>`;
    if (noteMatin) detailHTML += `<div class="miroir-detail-line"><em>Note :</em> ${esc(noteMatin)}</div>`;
    detailHTML += `</div>`;
  }
  if (c.total > 0 || noteSoir) {
    detailHTML += `<div class="miroir-detail-section"><div class="miroir-detail-label">Soir</div>`;
    if (c.total > 0) {
      detailHTML += `<div class="miroir-detail-line"><em>Examen :</em> ${c.oui} oui · ${c.partie} en partie · ${c.non} non</div>`;
      // lister les pratiques cochées avec leur réponse
      const reps = j.soir?.reponses || {};
      const items = Object.entries(reps).map(([pid, val]) => {
        const p = pratiquesById[pid];
        if (!p) return '';
        const valLabel = val === 'yes' ? 'oui' : (val === 'partial' ? 'en partie' : 'non');
        const cls = val === 'yes' ? 'miroir-rep--oui' : (val === 'partial' ? 'miroir-rep--partie' : 'miroir-rep--non');
        return `<span class="miroir-rep ${cls}" title="${esc(p.fr.nom)}">${esc(p.fr.nom)} · <strong>${valLabel}</strong></span>`;
      }).filter(Boolean);
      if (items.length) detailHTML += `<div class="miroir-reps">${items.join('')}</div>`;
    }
    if (noteSoir) detailHTML += `<div class="miroir-detail-line"><em>Note :</em> ${esc(noteSoir)}</div>`;
    detailHTML += `</div>`;
  }

  const today = dateKey();
  const isToday = j.key === today;
  return `
    <article class="miroir-jour" data-key="${j.key}">
      <header class="miroir-jour__head">
        <h3 class="miroir-jour__date">${esc(dateLisible(j.key))}${isToday ? ' <em style="color:var(--gold)">· aujourd\'hui</em>' : ''}</h3>
        <div class="miroir-jour__sum">
          ${intentionLabel ? `<span>✦ <strong>${esc(intentionLabel)}</strong></span>` : ''}
          ${c.total > 0 ? `<span>${c.oui}/${c.total} oui</span>` : ''}
        </div>
      </header>
      <div class="miroir-jour__detail">${detailHTML || '<p style="color:var(--ink-mute); font-style:italic;">Journée commencée, sans entrée.</p>'}</div>
    </article>
  `;
}

function render({ jours, pratiquesById, motCompagnon }) {
  // statistiques rapides
  const today = new Date();
  const last30 = jours.filter(j => {
    const [y,m,d] = j.key.split('-').map(n=>parseInt(n,10));
    const date = new Date(y, m-1, d);
    return joursEntre(date, today) < 30;
  });
  const totalNotes = last30.length;
  const intentionsParId = {};
  last30.forEach(j => {
    const i = j.matin?.intentionId;
    if (i) intentionsParId[i] = (intentionsParId[i] || 0) + 1;
  });
  const topIntention = Object.entries(intentionsParId).sort((a,b) => b[1] - a[1])[0];

  mount.innerHTML = `
    <header class="jour-head">
      <p class="jour-hello">Bonjour, <em>${esc(prenom)}</em>.</p>
      <p class="jour-date">Mon miroir · les jours qui ont été notés</p>
      ${motCompagnon ? `
        <div class="jour-compagnon">
          <span class="jour-compagnon__ar" lang="ar" dir="rtl">${esc(motCompagnon.ar)}</span>
          <span class="jour-compagnon__tr">${esc(motCompagnon.tr)} — ${esc(motCompagnon.fr.nom)}</span>
        </div>
      ` : ''}
    </header>

    <section class="jour-section">
      <h2 class="jour-section__titre">Ce qui pousse</h2>
      <p class="jour-section__sub"><em>les 30 derniers jours</em></p>
      ${tableauHM({ jours: last30 })}
      <div class="miroir-stats">
        <div class="miroir-stat"><span class="miroir-stat__n">${totalNotes}</span><span class="miroir-stat__l">jour${totalNotes>1?'s':''} noté${totalNotes>1?'s':''}</span></div>
        ${topIntention ? `<div class="miroir-stat"><span class="miroir-stat__n">${esc(pratiquesById[topIntention[0]]?.fr?.nom || topIntention[0])}</span><span class="miroir-stat__l">intention qui revient</span></div>` : ''}
      </div>
      <p style="margin-top: var(--space-md); text-align:center; font-family: var(--font-display); font-style: italic; color: var(--ink-mute); font-size: 0.92rem;">
        Pas de score, pas de note. Ce qui revient est ce qui vous travaille. Ce qui manque, c'est juste ce qui manque.
      </p>
    </section>

    ${jours.length === 0 ? `
      <section class="jour-section" style="text-align:center;">
        <p style="font-family: var(--font-display); font-style: italic; color: var(--ink-mute); padding: var(--space-xl) 0;">
          Pas encore de jour noté. <a href="../aujourdhui/" style="color:var(--gold);">Aujourd'hui vous attend →</a>
        </p>
      </section>
    ` : `
      <section class="jour-section">
        <h2 class="jour-section__titre">Les jours, un à un</h2>
        <p class="jour-section__sub"><em>du plus récent au plus ancien</em></p>
        <div class="miroir-jours">
          ${jours.map(j => renderJour(j, pratiquesById)).join('')}
        </div>
      </section>
    `}
  `;
}

load().catch(err => {
  console.error(err);
  mount.innerHTML = '<p style="text-align:center; color: var(--ink-mute);">Une difficulté à charger votre miroir. Réessayez dans un instant.</p>';
});
