/* ============================================================
   « Mon miroir » — historique de l'utilisateur, bilingue
   ============================================================ */
import { db } from './firebase-init.js';
import { collection, getDocs }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const EN = document.documentElement.lang === 'en';
const LANG = EN ? 'en' : 'fr';
const LOCALE = EN ? 'en-US' : 'fr-FR';

const TXT = EN ? {
  hello: 'Hello',
  mirrorSub: 'My mirror · the days that have been noted',
  whatGrows: 'What is growing',
  last30days: 'the last 30 days',
  daysNoted: 'days noted',
  dayNoted: 'day noted',
  intentionRecurring: 'recurring intention',
  noteFooter: 'No score, no grade. What recurs is what is working you. What is missing, is just missing.',
  nothingYet: 'No day noted yet. ',
  todayLink: 'Today is waiting for you →',
  oneByOne: 'The days, one by one',
  mostRecent: 'from the most recent to the oldest',
  today: 'today',
  morning: 'Morning',
  evening: 'Evening',
  intention: 'Intention:',
  examen: 'Examination:',
  note: 'Note:',
  yes: 'yes',
  partial: 'partly',
  no: 'no',
  startedDay: 'Day started, no entry.',
  noSession: 'Sign out? (your data is kept)',
  loadingError: 'A difficulty loading your mirror. Try again shortly.'
} : {
  hello: 'Bonjour',
  mirrorSub: 'Mon miroir · les jours qui ont été notés',
  whatGrows: 'Ce qui pousse',
  last30days: 'les 30 derniers jours',
  daysNoted: 'jours notés',
  dayNoted: 'jour noté',
  intentionRecurring: 'intention qui revient',
  noteFooter: "Pas de score, pas de note. Ce qui revient est ce qui vous travaille. Ce qui manque, c'est juste ce qui manque.",
  nothingYet: 'Pas encore de jour noté. ',
  todayLink: "Aujourd'hui vous attend →",
  oneByOne: 'Les jours, un à un',
  mostRecent: 'du plus récent au plus ancien',
  today: "aujourd'hui",
  morning: 'Matin',
  evening: 'Soir',
  intention: 'Intention :',
  examen: 'Examen :',
  note: 'Note :',
  yes: 'oui',
  partial: 'en partie',
  no: 'non',
  startedDay: 'Journée commencée, sans entrée.',
  noSession: 'Sortir de votre carnet ? (vos données sont gardées)',
  loadingError: 'Une difficulté à charger votre miroir. Réessayez dans un instant.'
};

const SESSION_KEY = 'lvdd_carnet_session';
const mount = document.getElementById('miroir-mount');
const sortirLink = document.getElementById('sortir-link');

sortirLink?.addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm(TXT.noSession)) {
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
    return new Date(y, m - 1, d).toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
  } catch { return key; }
}
function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
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
      if (a && b) { cls += ' miroir-cell--full'; }
      else if (a)  { cls += ' miroir-cell--matin'; }
      else if (b)  { cls += ' miroir-cell--soir'; }
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
  const intentionLabel = intentionId ? pratiquesById[intentionId]?.[LANG]?.nom : null;
  const c = compterReponses(j);
  const noteMatin = j.matin?.note || '';
  const noteSoir  = j.soir?.note  || '';

  let detailHTML = '';
  if (intentionId || noteMatin) {
    detailHTML += `<div class="miroir-detail-section"><div class="miroir-detail-label">${TXT.morning}</div>`;
    if (intentionLabel) detailHTML += `<div class="miroir-detail-line"><em>${TXT.intention}</em> ${esc(intentionLabel)}</div>`;
    if (noteMatin) detailHTML += `<div class="miroir-detail-line"><em>${TXT.note}</em> ${esc(noteMatin)}</div>`;
    detailHTML += `</div>`;
  }
  if (c.total > 0 || noteSoir) {
    detailHTML += `<div class="miroir-detail-section"><div class="miroir-detail-label">${TXT.evening}</div>`;
    if (c.total > 0) {
      detailHTML += `<div class="miroir-detail-line"><em>${TXT.examen}</em> ${c.oui} ${TXT.yes} · ${c.partie} ${TXT.partial} · ${c.non} ${TXT.no}</div>`;
      const reps = j.soir?.reponses || {};
      const items = Object.entries(reps).map(([pid, val]) => {
        const p = pratiquesById[pid];
        if (!p) return '';
        const valLabel = val === 'yes' ? TXT.yes : (val === 'partial' ? TXT.partial : TXT.no);
        const cls = val === 'yes' ? 'miroir-rep--oui' : (val === 'partial' ? 'miroir-rep--partie' : 'miroir-rep--non');
        return `<span class="miroir-rep ${cls}" title="${esc(p[LANG].nom)}">${esc(p[LANG].nom)} · <strong>${valLabel}</strong></span>`;
      }).filter(Boolean);
      if (items.length) detailHTML += `<div class="miroir-reps">${items.join('')}</div>`;
    }
    if (noteSoir) detailHTML += `<div class="miroir-detail-line"><em>${TXT.note}</em> ${esc(noteSoir)}</div>`;
    detailHTML += `</div>`;
  }

  const isToday = j.key === dateKey();
  return `
    <article class="miroir-jour" data-key="${j.key}">
      <header class="miroir-jour__head">
        <h3 class="miroir-jour__date">${esc(dateLisible(j.key))}${isToday ? ` <em style="color:var(--gold)">· ${TXT.today}</em>` : ''}</h3>
        <div class="miroir-jour__sum">
          ${intentionLabel ? `<span>✦ <strong>${esc(intentionLabel)}</strong></span>` : ''}
          ${c.total > 0 ? `<span>${c.oui}/${c.total} ${TXT.yes}</span>` : ''}
        </div>
      </header>
      <div class="miroir-jour__detail">${detailHTML || `<p style="color:var(--ink-mute); font-style:italic;">${TXT.startedDay}</p>`}</div>
    </article>
  `;
}

function render({ jours, pratiquesById, motCompagnon }) {
  const today = new Date();
  const last30 = jours.filter(j => {
    const [y,m,d] = j.key.split('-').map(n=>parseInt(n,10));
    return joursEntre(new Date(y, m-1, d), today) < 30;
  });
  const totalNotes = last30.length;
  const intentionsParId = {};
  last30.forEach(j => {
    const i = j.matin?.intentionId;
    if (i) intentionsParId[i] = (intentionsParId[i] || 0) + 1;
  });
  const topIntention = Object.entries(intentionsParId).sort((a,b) => b[1] - a[1])[0];
  const noteWord = totalNotes > 1 ? TXT.daysNoted : TXT.dayNoted;

  mount.innerHTML = `
    <header class="jour-head">
      <p class="jour-hello">${TXT.hello}, <em>${esc(prenom)}</em>.</p>
      <p class="jour-date">${TXT.mirrorSub}</p>
      ${motCompagnon ? `
        <div class="jour-compagnon">
          <span class="jour-compagnon__ar" lang="ar" dir="rtl">${esc(motCompagnon.ar)}</span>
          <span class="jour-compagnon__tr">${esc(motCompagnon.tr)} — ${esc(motCompagnon[LANG].nom)}</span>
        </div>
      ` : ''}
    </header>

    <section class="jour-section">
      <h2 class="jour-section__titre">${TXT.whatGrows}</h2>
      <p class="jour-section__sub"><em>${TXT.last30days}</em></p>
      ${tableauHM({ jours: last30 })}
      <div class="miroir-stats">
        <div class="miroir-stat"><span class="miroir-stat__n">${totalNotes}</span><span class="miroir-stat__l">${noteWord}</span></div>
        ${topIntention ? `<div class="miroir-stat"><span class="miroir-stat__n">${esc(pratiquesById[topIntention[0]]?.[LANG]?.nom || topIntention[0])}</span><span class="miroir-stat__l">${TXT.intentionRecurring}</span></div>` : ''}
      </div>
      <p style="margin-top: var(--space-md); text-align:center; font-family: var(--font-display); font-style: italic; color: var(--ink-mute); font-size: 0.92rem;">
        ${TXT.noteFooter}
      </p>
    </section>

    ${jours.length === 0 ? `
      <section class="jour-section" style="text-align:center;">
        <p style="font-family: var(--font-display); font-style: italic; color: var(--ink-mute); padding: var(--space-xl) 0;">
          ${TXT.nothingYet}<a href="../aujourdhui/" style="color:var(--gold);">${TXT.todayLink}</a>
        </p>
      </section>
    ` : `
      <section class="jour-section">
        <h2 class="jour-section__titre">${TXT.oneByOne}</h2>
        <p class="jour-section__sub"><em>${TXT.mostRecent}</em></p>
        <div class="miroir-jours">
          ${jours.map(j => renderJour(j, pratiquesById)).join('')}
        </div>
      </section>
    `}
  `;
}

load().catch(err => {
  console.error(err);
  mount.innerHTML = `<p style="text-align:center; color: var(--ink-mute);">${TXT.loadingError}</p>`;
});
