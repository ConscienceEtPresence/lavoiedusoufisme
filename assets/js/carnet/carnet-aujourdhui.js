/* ============================================================
   « Aujourd'hui » — compagnon de présence, pas formulaire
   Trois manières d'entrer : trace légère / posé / jour difficile
   Le mot-graine vivant en haut. Une 4e réponse possible : « je ne sais pas ».
   ============================================================ */
import { db } from './firebase-init.js';
import { doc, setDoc, getDoc, addDoc, collection, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

async function ensureValidSession(session) {
  const snap = await getDoc(doc(db, 'codes', session.codeId));
  if (!snap.exists() || snap.data().actif === false) {
    localStorage.removeItem('lvdd_carnet_session');
    window.location.href = '../entrer/';
    throw new Error('session-invalid');
  }
  const d = snap.data();
  if (d.motGraine && d.motGraine !== session.motGraine) {
    session.motGraine = d.motGraine;
    localStorage.setItem('lvdd_carnet_session', JSON.stringify(session));
  }
}

const EN = document.documentElement.lang === 'en';
const LANG = EN ? 'en' : 'fr';
const LOCALE = EN ? 'en-US' : 'fr-FR';

const T_fr = {
  hello: 'Bonjour',
  noSession: 'Sortir de votre carnet ? (vos données sont gardées)',
  // Comment je viens
  modeTitle: 'Comment je viens aujourd\'hui',
  modeSub: 'choisir une voie — aucune n\'est meilleure qu\'une autre',
  modeLight: 'Léger',
  modeLightDesc: 'une trace rapide, un mot, un état',
  modePose: 'Posé',
  modePoseDesc: 'une intention le matin, un regard le soir',
  modeHeavy: 'Aujourd\'hui était lourd',
  modeHeavyDesc: 'une version douce, sans questions',
  // Mot-graine vivant
  motGraineHeader: 'Votre mot-compagnon aujourd\'hui',
  motGraineQuestion: 'Pour aujourd\'hui',
  motGrainePratique: 'Une micro-pratique',
  motGraineRappel: 'À se rappeler',
  // Trace légère
  lightTitle: 'Une trace pour aujourd\'hui',
  lightSub: 'un mot, un état, une couleur — c\'est suffisant',
  lightWhat: 'Ce qui m\'habite, là, maintenant',
  lightStateLabel: 'D\'où ça vient ?',
  lightStateBody: 'du corps',
  lightStateHeart: 'du cœur',
  lightStateMind: 'de la pensée',
  lightStateUnknown: 'je ne sais pas',
  lightNote: 'Une phrase, si elle veut venir',
  lightSave: 'Poser cette trace',
  lightSaved: '✓ posée',
  // Matin (posé)
  morning: 'Le matin',
  morningSub: 'une intention pour la journée',
  intentionLabel: 'Aujourd\'hui, je voudrais cultiver',
  choose: '— choisir —',
  noteMorning: 'Une note pour ce matin (facultatif)',
  saveMorning: 'Noter ce matin',
  morningSaved: '✓ noté',
  // Soir (posé)
  evening: 'Le soir',
  eveningSub: 'un regard tranquille — sans se juger, sans tout évaluer',
  noteEvening: 'Une chose qui m\'a marqué·e aujourd\'hui (facultatif)',
  closeDay: 'Déposer le jour',
  closeDaySaved: '✓ jour déposé',
  // Relecture d'un moment
  momentTitle: 'Relire un moment du jour',
  momentSub: 'un événement concret — une parole, une colère, une tenue, une réparation',
  momentType: 'Ce moment était plutôt',
  momentTypes: {
    emporte: 'je me suis emporté·e',
    parole: 'j\'ai blessé par une parole',
    absence: 'j\'ai été absent·e',
    tenu: 'j\'ai tenu bon',
    repare: 'j\'ai réparé',
    grace: 'j\'ai reçu une grâce',
    obscur: 'je ne comprends pas encore'
  },
  momentScene: 'Ce qui s\'est passé, simplement',
  momentScenePlaceholder: 'ex. : avec ma fille, je me suis agacé·e trop vite…',
  momentMoteurs: 'Ce qui parlait peut-être en moi',
  momentMoteursList: {
    fatigue: 'fatigue',
    peur: 'peur',
    controle: 'besoin de contrôle',
    orgueil: 'orgueil',
    attente: 'attente non comblée',
    honte: 'honte',
    tristesse: 'tristesse',
    oubli: 'oubli de soi'
  },
  momentRemede: 'Le mot-remède que je veux appeler',
  momentRepair: 'Un petit retour possible',
  momentRepairPlaceholder: 'ex. : lui reparler doucement, demander pardon, respirer avant de répondre demain…',
  momentVow: 'Le vœu que je reprends demain',
  momentVowPlaceholder: 'ex. : quand je sens la colère monter, je garde une respiration avant de parler.',
  // Jour difficile
  heavyTitle: 'Aujourd\'hui était lourd',
  heavyBreathe: 'Respirer une fois, lentement. Sentir le poids du corps.',
  heavyPhrase: 'Une phrase, si elle veut venir — pas plus',
  heavyStill: 'Je suis encore là.',
  heavyStillSub: 'cocher si c\'est vrai aujourd\'hui — c\'est déjà beaucoup',
  heavySave: 'Garder ce qui peut être gardé',
  heavySaved: '✓ gardé',
  // Réponses
  yes: 'oui', partial: 'en partie', no: 'non', unknown: 'je ne sais pas',
  // Cercles
  cercleParole: 'La parole', cercleActe: 'Les actes', cercleCoeur: 'Le cœur', cercleLien: 'Le lien',
  // Suggestion
  suggestionTitle: 'Glisser un mot à Brahms',
  suggestionSub: 'une suggestion, une idée, un mot — pour faire évoluer le carnet',
  suggestionPlaceholder: 'ex. : « pourrait-on ajouter une pratique sur l\'écoute ? »',
  suggestionSigned: 'Brahms saura que c\'est moi',
  yourMessage: 'Votre message (anonyme par défaut)',
  sendSuggestion: 'Envoyer la suggestion',
  suggestionSent: '✓ merci, votre mot a été glissé',
  // Divers
  saveError: 'Une difficulté est survenue. Réessayez.',
  loading: 'Un instant…',
  emptyMessage: 'Écrivez quelque chose avant d\'envoyer.',
  // Reprise du vœu d'hier
  repriseLabel: 'Hier vous vous étiez dit',
  repriseQuestion: 'Comment ça s\'est passé aujourd\'hui ?',
  repriseTenu: 'tenu',
  reprisePartiel: 'en partie',
  reprisePasPu: 'pas pu',
  reprisePasSu: 'je n\'ai pas su',
  repriseNoteThanks: 'Merci de revenir vers ce vœu. C\'est ainsi qu\'on apprend de soi.',
  // Ressources
  resourcesLabel: 'Pour aller plus loin, si vous le souhaitez',
  // Mémoire douce
  whisperReturn: 'Vous voilà. Le carnet vous attendait sans vous compter.',
  whisperEvening: 'Le jour décline. Vous pouvez juste venir sans rien dire.',
  whisperMorning: 'Le matin commence. Une seule intention suffit.',
  whisperNight: 'La nuit veille. Une phrase, si elle vient — et puis dormir.',
  // Sortir
  sortir: 'Sortir',
};

const T_en = {
  hello: 'Hello',
  noSession: 'Sign out of your journal? (your data is kept)',
  modeTitle: 'How I come today',
  modeSub: 'choose a way — none is better than another',
  modeLight: 'Light',
  modeLightDesc: 'a quick trace, a word, a state',
  modePose: 'Settled',
  modePoseDesc: 'an intention in the morning, a look at evening',
  modeHeavy: 'Today was heavy',
  modeHeavyDesc: 'a gentle version, no questions',
  motGraineHeader: 'Your companion-word today',
  motGraineQuestion: 'For today',
  motGrainePratique: 'A micro-practice',
  motGraineRappel: 'To remember',
  lightTitle: 'A trace for today',
  lightSub: 'a word, a state, a colour — it is enough',
  lightWhat: 'What inhabits me, right now',
  lightStateLabel: 'Where is it coming from?',
  lightStateBody: 'from the body',
  lightStateHeart: 'from the heart',
  lightStateMind: 'from thought',
  lightStateUnknown: 'I do not know',
  lightNote: 'A sentence, if it wants to come',
  lightSave: 'Lay down this trace',
  lightSaved: '✓ laid down',
  morning: 'Morning',
  morningSub: 'an intention for the day',
  intentionLabel: 'Today, I would like to cultivate',
  choose: '— choose —',
  noteMorning: 'A note for this morning (optional)',
  saveMorning: 'Note this morning',
  morningSaved: '✓ noted',
  evening: 'Evening',
  eveningSub: 'a calm look — without judging, without measuring everything',
  noteEvening: 'One thing that marked me today (optional)',
  closeDay: 'Lay down the day',
  closeDaySaved: '✓ day laid down',
  momentTitle: 'Reread a moment of the day',
  momentSub: 'one concrete event — a word, anger, restraint, a repair',
  momentType: 'This moment was mostly',
  momentTypes: {
    emporte: 'I lost my temper',
    parole: 'I wounded with a word',
    absence: 'I was absent',
    tenu: 'I held steady',
    repare: 'I repaired',
    grace: 'I received a grace',
    obscur: 'I do not understand yet'
  },
  momentScene: 'What happened, simply',
  momentScenePlaceholder: 'e.g.: with my daughter, I got irritated too quickly…',
  momentMoteurs: 'What may have been speaking in me',
  momentMoteursList: {
    fatigue: 'tiredness',
    peur: 'fear',
    controle: 'need for control',
    orgueil: 'pride',
    attente: 'unmet expectation',
    honte: 'shame',
    tristesse: 'sadness',
    oubli: 'forgetfulness'
  },
  momentRemede: 'The remedy-word I want to call',
  momentRepair: 'A small possible return',
  momentRepairPlaceholder: 'e.g.: speak gently again, ask forgiveness, breathe before answering tomorrow…',
  momentVow: 'The vow I take up again tomorrow',
  momentVowPlaceholder: 'e.g.: when I feel anger rising, I keep one breath before speaking.',
  heavyTitle: 'Today was heavy',
  heavyBreathe: 'Breathe once, slowly. Feel the weight of the body.',
  heavyPhrase: 'A sentence, if it wants to come — no more',
  heavyStill: 'I am still here.',
  heavyStillSub: 'tick if this is true today — it is already much',
  heavySave: 'Keep what can be kept',
  heavySaved: '✓ kept',
  yes: 'yes', partial: 'partly', no: 'no', unknown: 'I don\'t know',
  cercleParole: 'Speech', cercleActe: 'Action', cercleCoeur: 'The heart', cercleLien: 'The bond',
  suggestionTitle: 'Pass a word to Brahms',
  suggestionSub: 'a suggestion, an idea, a word — to help the journal grow',
  suggestionPlaceholder: 'e.g.: \"could we add a practice on listening?\"',
  suggestionSigned: 'Brahms will know it\'s me',
  yourMessage: 'Your message (anonymous by default)',
  sendSuggestion: 'Send the suggestion',
  suggestionSent: '✓ thank you, your word has been passed',
  saveError: 'A difficulty occurred. Try again.',
  loading: 'A moment…',
  emptyMessage: 'Write something before sending.',
  repriseLabel: 'Yesterday you told yourself',
  repriseQuestion: 'How did it go today?',
  repriseTenu: 'kept',
  reprisePartiel: 'in part',
  reprisePasPu: 'could not',
  reprisePasSu: 'I did not know',
  repriseNoteThanks: 'Thank you for coming back to this vow. This is how we learn from ourselves.',
  resourcesLabel: 'To go further, if you wish',
  whisperReturn: 'Here you are. The journal was waiting without counting.',
  whisperEvening: 'The day is fading. You can simply come, without saying anything.',
  whisperMorning: 'Morning begins. One intention is enough.',
  whisperNight: 'Night keeps watch. One sentence, if it comes — then sleep.',
  sortir: 'Sign out',
};
const TXT = EN ? T_en : T_fr;

const REMEDES = [
  { id: '', fr: '— choisir —', en: '— choose —' },
  { id: 'sabr', fr: 'ṣabr — tenir sans se durcir', en: 'ṣabr — hold without hardening' },
  { id: 'hilm', fr: 'ḥilm — ne pas répondre du tac au tac', en: 'ḥilm — not snapping back' },
  { id: 'rifq', fr: 'rifq — toucher plus doucement', en: 'rifq — touch more gently' },
  { id: 'samt', fr: 'ṣamt — garder une parole', en: 'ṣamt — keep a word back' },
  { id: 'adab', fr: 'adab — ajuster le geste', en: 'adab — adjust the gesture' },
  { id: 'tawba', fr: 'tawba — revenir sans drame', en: 'tawba — return without drama' },
  { id: 'istighfar', fr: 'istighfār — demander pardon', en: 'istighfār — ask forgiveness' },
  { id: 'shukr', fr: 'shukr — reconnaître le don', en: 'shukr — recognize the gift' },
  { id: 'hudur', fr: 'ḥuḍūr — revenir à la présence', en: 'ḥuḍūr — return to presence' },
  { id: 'muraqaba', fr: 'murāqaba — regarder ce qui passe', en: 'murāqaba — watch what passes' }
];

const SESSION_KEY = 'lvdd_carnet_session';
const mount = document.getElementById('jour-mount');
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

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function todayKey() { return dateKey(new Date()); }
function yesterdayKey() {
  const d = new Date(); d.setDate(d.getDate() - 1);
  return dateKey(d);
}
const date = todayKey();
const dateHier = yesterdayKey();

// Ressources du site selon ce qui s'est joué dans le moment
// Liens doux, jamais imposés. Reliés au type d'événement ou aux moteurs.
const RESOURCES = {
  emporte:  { fr: ['ḥilm (mansuétude)', 'al-Ḥalīm', 'un conte de Nasr Eddin'], en: ['ḥilm (forbearance)', 'al-Ḥalīm', 'a Nasr Eddin tale'],
              links: ['/pages/dictionnaire/?q=hilm', '/pages/noms-divins/nom/?id=al-halim', '/pages/contes/nasr-eddin/'] },
  parole:   { fr: ['ṣamt (silence)', 'la parole juste', 'al-Laṭīf'], en: ['ṣamt (silence)', 'right speech', 'al-Laṭīf'],
              links: ['/pages/dictionnaire/?q=samt', '/pages/decouvrir.html', '/pages/noms-divins/nom/?id=al-latif'] },
  absence:  { fr: ['ḥuḍūr (présence)', 'murāqaba'], en: ['ḥuḍūr (presence)', 'murāqaba'],
              links: ['/pages/dictionnaire/?q=hudur', '/pages/dictionnaire/?q=muraqaba'] },
  tenu:     { fr: ['ṣabr (patience)', 'aṣ-Ṣabūr'], en: ['ṣabr (patience)', 'aṣ-Ṣabūr'],
              links: ['/pages/dictionnaire/?q=sabr', '/pages/noms-divins/nom/?id=as-sabur'] },
  repare:   { fr: ['tawba (retour)', 'al-Tawwāb', 'istighfār'], en: ['tawba (turning back)', 'al-Tawwāb', 'istighfār'],
              links: ['/pages/dictionnaire/?q=tawba', '/pages/noms-divins/nom/?id=at-tawwab', '/pages/dictionnaire/?q=istighfar'] },
  grace:    { fr: ['shukr (gratitude)', 'al-Wahhāb', 'la poésie soufie'], en: ['shukr (gratitude)', 'al-Wahhāb', 'sufi poetry'],
              links: ['/pages/dictionnaire/?q=shukr', '/pages/noms-divins/nom/?id=al-wahhab', '/pages/poesie/'] },
  obscur:   { fr: ['l\'hadith de Gabriel', 'fitra', 'la voie du voyageur'], en: ['the hadith of Gabriel', 'fitra', 'the seeker\'s path'],
              links: ['/pages/hadith-gabriel.html', '/pages/dictionnaire/?q=fitra', '/pages/voyage/'] }
};

function whisperForTime() {
  const h = new Date().getHours();
  if (h < 6) return TXT.whisperNight;
  if (h < 11) return TXT.whisperMorning;
  if (h < 18) return TXT.whisperReturn;
  if (h < 22) return TXT.whisperEvening;
  return TXT.whisperNight;
}

async function load() {
  await ensureValidSession(session);
  const [pratiquesJson, motsJson, jourSnap, hierSnap] = await Promise.all([
    fetch('/data/carnet/pratiques.json').then(r => r.json()),
    fetch('/data/carnet/mots-graines.json').then(r => r.json()),
    getDoc(doc(db, 'carnets', codeId, 'jours', date)).catch(() => null),
    getDoc(doc(db, 'carnets', codeId, 'jours', dateHier)).catch(() => null)
  ]);
  const motCompagnon = motsJson.mots.find(m => m.id === session.motGraine);
  const jourData = jourSnap?.exists() ? jourSnap.data() : {};
  const hierData = hierSnap?.exists() ? hierSnap.data() : null;
  render({ pratiques: pratiquesJson, motCompagnon, jourData, hierData });
}

function dateLisible() {
  const d = new Date();
  return d.toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function ornament() { return '<div class="jour-ornament">✦</div>'; }

function render({ pratiques, motCompagnon, jourData, hierData }) {
  // mode déjà choisi pour ce jour ? sinon 'pose' par défaut
  const mode = jourData.mode || 'pose';

  const compagnonBlock = motCompagnon ? `
    <section class="jour-compagnon-vivant">
      <p class="jour-compagnon-vivant__label">${TXT.motGraineHeader}</p>
      <div class="jour-compagnon-vivant__ar" lang="ar" dir="rtl">${esc(motCompagnon.ar)}</div>
      <p class="jour-compagnon-vivant__tr"><em>${esc(motCompagnon.tr)}</em> — ${esc(motCompagnon[LANG].nom)}</p>
      <p class="jour-compagnon-vivant__note">${esc(motCompagnon[LANG].note)}</p>
      ${motCompagnon[LANG].question ? `
        <div class="jour-graine-block">
          <span class="jour-graine-block__label">${TXT.motGraineQuestion}</span>
          <p class="jour-graine-block__text">${esc(motCompagnon[LANG].question)}</p>
        </div>` : ''}
      ${motCompagnon[LANG].pratique ? `
        <div class="jour-graine-block jour-graine-block--alt">
          <span class="jour-graine-block__label">${TXT.motGrainePratique}</span>
          <p class="jour-graine-block__text">${esc(motCompagnon[LANG].pratique)}</p>
        </div>` : ''}
      ${motCompagnon[LANG].rappel ? `
        <p class="jour-graine-rappel"><em>${esc(motCompagnon[LANG].rappel)}</em></p>` : ''}
    </section>
  ` : '';

  const modeChooserBlock = `
    <section class="jour-mode-chooser">
      <h2 class="jour-section__titre jour-section__titre--soft">${TXT.modeTitle}</h2>
      <p class="jour-section__sub"><em>${TXT.modeSub}</em></p>
      <div class="jour-mode-grid">
        <button type="button" class="jour-mode-card ${mode==='light'?'is-active':''}" data-mode="light">
          <span class="jour-mode-card__nom">${TXT.modeLight}</span>
          <span class="jour-mode-card__desc">${TXT.modeLightDesc}</span>
        </button>
        <button type="button" class="jour-mode-card ${mode==='pose'?'is-active':''}" data-mode="pose">
          <span class="jour-mode-card__nom">${TXT.modePose}</span>
          <span class="jour-mode-card__desc">${TXT.modePoseDesc}</span>
        </button>
        <button type="button" class="jour-mode-card ${mode==='heavy'?'is-active':''}" data-mode="heavy">
          <span class="jour-mode-card__nom">${TXT.modeHeavy}</span>
          <span class="jour-mode-card__desc">${TXT.modeHeavyDesc}</span>
        </button>
      </div>
    </section>
  `;

  const headerBlock = `
    <header class="jour-head">
      <p class="jour-whisper"><em>${whisperForTime()}</em></p>
      <p class="jour-hello">${TXT.hello}, <em>${esc(prenom)}</em>.</p>
      <p class="jour-date">${dateLisible()}</p>
    </header>
  `;

  const contentBlock = renderModeContent(mode, pratiques, jourData);

  // Reprise du vœu d'hier — seulement si un vow existe dans le jour précédent
  const repriseBlock = renderRepriseVow(arguments[0].hierData, jourData);

  mount.innerHTML = `
    ${headerBlock}
    ${repriseBlock}
    <div id="nom-du-jour"></div>
    ${compagnonBlock}
    ${ornament()}
    ${modeChooserBlock}
    <div id="mode-content">${contentBlock}</div>
    <div id="bilan-hebdo-mount"></div>
    ${ornament()}
    ${renderSuggestion()}
  `;

  bindModeChooser(pratiques, jourData);
  bindContent(mode, pratiques);
  bindReprise();
  bindSuggestion();

  // === Nom du jour + Bilan hebdo soufi (async, ne bloque pas l'affichage) ===
  import('./bilan-hebdo-soufi.js').then(async (m) => {
    const { bilan, nom, names } = await m.loadAndBuild(codeId);
    const nomEl = document.getElementById('nom-du-jour');
    if (nomEl && nom) {
      nomEl.innerHTML = `
        <section class="nom-du-jour fade-in-up">
          <span class="nom-du-jour__label">Le Nom qui vous accompagne aujourd'hui</span>
          <div class="nom-du-jour__ar" lang="ar" dir="rtl">${esc(nom.ar)}</div>
          <p class="nom-du-jour__tr"><em>${esc(nom.tr)}</em> — ${esc(nom.fr)}</p>
          ${nom.sens ? `<p class="nom-du-jour__sens">${esc(nom.sens)}</p>` : ''}
          ${nom.href ? `<a class="nom-du-jour__link" href="${esc(nom.href)}">Découvrir ce Nom →</a>` : ''}
        </section>
      `;
    }
    const hebdoEl = document.getElementById('bilan-hebdo-mount');
    if (hebdoEl && bilan?.lines?.length && bilan.days >= 3) {
      const namesBlock = (names && names.length) ? `
        <div class="bilan-hebdo__names">
          <p class="bilan-hebdo__names-label">Les Noms qui vous ont accompagné cette semaine :</p>
          <div class="bilan-hebdo__names-list">
            ${names.map(n => `
              <a class="bilan-hebdo__name" href="/pages/noms-divins/nom/${esc(n.slug)}/" target="_blank" rel="noopener">
                <span lang="ar" dir="rtl">${esc(n.ar)}</span>
                <strong>${esc(n.tr)}</strong>
                <em>${esc(n.fr)}</em>
              </a>
            `).join('')}
          </div>
        </div>
      ` : '';
      hebdoEl.innerHTML = `
        <section class="bilan-hebdo fade-in-up">
          <h2 class="bilan-hebdo__title">📿 <em>Le bilan de la semaine</em></h2>
          <p class="bilan-hebdo__sub">Un regard tranquille sur les sept jours — sans jugement, sans verdict.</p>
          ${bilan.lines.map(l => `<p class="bilan-hebdo__line">${l}</p>`).join('')}
          ${namesBlock}
        </section>
      `;
    }
  }).catch(e => console.warn('hebdo failed', e));
}

function renderRepriseVow(hierData, jourData) {
  const vow = hierData?.soir?.moment?.vow;
  if (!vow || !vow.trim()) return '';
  const alreadyAnswered = jourData?.reprise?.statut;
  return `
    <section class="jour-reprise">
      <span class="jour-reprise__label">${TXT.repriseLabel}</span>
      <blockquote class="jour-reprise__vow">« ${esc(vow)} »</blockquote>
      <p class="jour-reprise__q">${TXT.repriseQuestion}</p>
      <div class="jour-reprise__choices">
        ${[['tenu',TXT.repriseTenu],['partiel',TXT.reprisePartiel],['paspu',TXT.reprisePasPu],['passu',TXT.reprisePasSu]].map(([id,label]) => `
          <label class="jour-reprise__opt ${alreadyAnswered===id?'is-checked':''}">
            <input type="radio" name="reprise-statut" value="${id}" ${alreadyAnswered===id?'checked':''}/>
            <span>${label}</span>
          </label>
        `).join('')}
      </div>
      ${alreadyAnswered ? `<p class="jour-reprise__note">${TXT.repriseNoteThanks}</p>` : ''}
    </section>
  `;
}

function bindReprise() {
  document.querySelectorAll('.jour-reprise__opt input').forEach(input => {
    input.addEventListener('change', async () => {
      document.querySelectorAll('.jour-reprise__opt').forEach(o => o.classList.remove('is-checked'));
      input.closest('.jour-reprise__opt').classList.add('is-checked');
      try {
        await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
          langue: LANG,
          reprise: { statut: input.value, repriseLe: serverTimestamp() }
        }, { merge: true });
        // afficher le message de remerciement
        const sect = input.closest('.jour-reprise');
        if (sect && !sect.querySelector('.jour-reprise__note')) {
          const p = document.createElement('p');
          p.className = 'jour-reprise__note';
          p.textContent = TXT.repriseNoteThanks;
          sect.appendChild(p);
        }
      } catch (e) { console.warn('reprise save failed', e); }
    });
  });
}

function renderModeContent(mode, pratiques, jourData) {
  if (mode === 'light')  return renderLight(jourData);
  if (mode === 'heavy')  return renderHeavy(jourData);
  return renderPose(pratiques, jourData);
}

function renderLight(jourData) {
  const trace = jourData.trace || {};
  return `
    <section class="jour-section jour-section--light">
      <h2 class="jour-section__titre">${TXT.lightTitle}</h2>
      <p class="jour-section__sub"><em>${TXT.lightSub}</em></p>

      <label class="jour-field">
        <span>${TXT.lightWhat}</span>
        <input type="text" id="light-mot" maxlength="80" value="${esc(trace.mot || '')}" placeholder="…">
      </label>

      <div class="jour-state-chooser">
        <p class="jour-field__label">${TXT.lightStateLabel}</p>
        <div class="jour-state-grid">
          ${['body','heart','mind','unknown'].map(k => {
            const txt = TXT['lightState' + k.charAt(0).toUpperCase() + k.slice(1)];
            return `<label class="jour-state-card ${trace.etat===k?'is-active':''}">
              <input type="radio" name="light-etat" value="${k}" ${trace.etat===k?'checked':''}/>
              <span>${txt}</span>
            </label>`;
          }).join('')}
        </div>
      </div>

      <label class="jour-field">
        <span>${TXT.lightNote}</span>
        <textarea id="light-note" rows="3" maxlength="500" placeholder="…">${esc(trace.note || '')}</textarea>
      </label>

      <button type="button" class="carnet-btn carnet-btn--gold" id="save-light">${TXT.lightSave}</button>
      <span class="jour-save-ok" id="save-light-ok" hidden>${TXT.lightSaved}</span>
    </section>
  `;
}

function renderHeavy(jourData) {
  const heavy = jourData.heavy || {};
  return `
    <section class="jour-section jour-section--heavy">
      <h2 class="jour-section__titre">${TXT.heavyTitle}</h2>

      <div class="jour-heavy-breathe">
        <span class="jour-heavy-breathe__dot"></span>
        <p>${TXT.heavyBreathe}</p>
      </div>

      <label class="jour-field">
        <span>${TXT.heavyPhrase}</span>
        <textarea id="heavy-phrase" rows="3" maxlength="500" placeholder="…">${esc(heavy.phrase || '')}</textarea>
      </label>

      <label class="jour-still-toggle">
        <input type="checkbox" id="heavy-still" ${heavy.still ? 'checked' : ''}/>
        <span class="jour-still-toggle__text">
          <strong>${TXT.heavyStill}</strong>
          <em>${TXT.heavyStillSub}</em>
        </span>
      </label>

      <button type="button" class="carnet-btn carnet-btn--gold" id="save-heavy">${TXT.heavySave}</button>
      <span class="jour-save-ok" id="save-heavy-ok" hidden>${TXT.heavySaved}</span>
    </section>
  `;
}

function renderPose(pratiques, jourData) {
  const cercles = pratiques.cercles;
  const items = pratiques.pratiques;
  const groupes = ['parole', 'acte', 'coeur', 'lien'];
  const intentionActuelle = jourData.matin?.intentionId || '';
  const noteMatin = jourData.matin?.note || '';
  const reponses = jourData.soir?.reponses || {};
  const noteSoir = jourData.soir?.note || '';
  const moment = jourData.soir?.moment || {};

  const intentionsOptions = items.map(p => `
    <option value="${esc(p.id)}" ${p.id === intentionActuelle ? 'selected' : ''}>${esc(p[LANG].nom)}</option>
  `).join('');

  const blocCercles = groupes.map(g => {
    const inCercle = items.filter(p => p.cercle === g);
    if (!inCercle.length) return '';
    const lignes = inCercle.map(p => {
      const rep = reponses[p.id] || '';
      const aval = (rep && rep !== 'yes' && rep !== 'unknown') ? `<div class="jour-aval">${esc(p[LANG].aval)}</div>` : '';
      return `
        <div class="jour-pratique" data-id="${esc(p.id)}">
          <div class="jour-pratique__nom">${esc(p[LANG].nom)}</div>
          <div class="jour-pratique__amont">${esc(p[LANG].amont)}</div>
          <div class="jour-pratique__q">${esc(p[LANG].question)}</div>
          <div class="jour-choix">
            <label class="jour-choix__opt ${rep==='yes'?'is-checked':''}"><input type="radio" name="rep-${esc(p.id)}" value="yes" ${rep==='yes'?'checked':''}/><span>${TXT.yes}</span></label>
            <label class="jour-choix__opt ${rep==='partial'?'is-checked':''}"><input type="radio" name="rep-${esc(p.id)}" value="partial" ${rep==='partial'?'checked':''}/><span>${TXT.partial}</span></label>
            <label class="jour-choix__opt ${rep==='no'?'is-checked':''}"><input type="radio" name="rep-${esc(p.id)}" value="no" ${rep==='no'?'checked':''}/><span>${TXT.no}</span></label>
            <label class="jour-choix__opt jour-choix__opt--unknown ${rep==='unknown'?'is-checked':''}"><input type="radio" name="rep-${esc(p.id)}" value="unknown" ${rep==='unknown'?'checked':''}/><span>${TXT.unknown}</span></label>
          </div>
          ${aval}
        </div>
      `;
    }).join('');
    return `
      <div class="jour-cercle">
        <h3 class="jour-cercle__titre">${esc(cercles[g][LANG])}</h3>
        ${lignes}
      </div>
    `;
  }).join('');

  return `
    <section class="jour-section" id="section-matin">
      <h2 class="jour-section__titre">${TXT.morning}</h2>
      <p class="jour-section__sub"><em>${TXT.morningSub}</em></p>

      <label class="jour-field">
        <span>${TXT.intentionLabel}</span>
        <select id="intention-select">
          <option value="">${TXT.choose}</option>
          ${intentionsOptions}
        </select>
      </label>

      <label class="jour-field">
        <span>${TXT.noteMorning}</span>
        <textarea id="note-matin" rows="3">${esc(noteMatin)}</textarea>
      </label>

      <button type="button" class="carnet-btn carnet-btn--ghost" id="save-matin">${TXT.saveMorning}</button>
      <span class="jour-save-ok" id="save-matin-ok" hidden>${TXT.morningSaved}</span>
    </section>

    ${ornament()}

    <section class="jour-section" id="section-soir">
      <h2 class="jour-section__titre">${TXT.evening}</h2>
      <p class="jour-section__sub"><em>${TXT.eveningSub}</em></p>

      ${blocCercles}

      <label class="jour-field">
        <span>${TXT.noteEvening}</span>
        <textarea id="note-soir" rows="4">${esc(noteSoir)}</textarea>
      </label>

      ${renderMoment(moment)}

      <button type="button" class="carnet-btn carnet-btn--gold" id="save-soir">${TXT.closeDay}</button>
      <span class="jour-save-ok" id="save-soir-ok" hidden>${TXT.closeDaySaved}</span>
    </section>
  `;
}

function renderMoment(moment) {
  const types = Object.entries(TXT.momentTypes).map(([id, label]) => `
    <label class="jour-moment-chip ${moment.type === id ? 'is-active' : ''}">
      <input type="radio" name="moment-type" value="${esc(id)}" ${moment.type === id ? 'checked' : ''}/>
      <span>${esc(label)}</span>
    </label>
  `).join('');

  const moteurs = Object.entries(TXT.momentMoteursList).map(([id, label]) => {
    const checked = Array.isArray(moment.moteurs) && moment.moteurs.includes(id);
    return `
      <label class="jour-moment-chip jour-moment-chip--small ${checked ? 'is-active' : ''}">
        <input type="checkbox" name="moment-moteur" value="${esc(id)}" ${checked ? 'checked' : ''}/>
        <span>${esc(label)}</span>
      </label>
    `;
  }).join('');

  const remedes = REMEDES.map(r => `
    <option value="${esc(r.id)}" ${moment.remede === r.id ? 'selected' : ''}>${esc(r[LANG])}</option>
  `).join('');

  return `
    <div class="jour-moment">
      <div class="jour-moment__head">
        <h3 class="jour-moment__title">${TXT.momentTitle}</h3>
        <p>${TXT.momentSub}</p>
      </div>

      <div class="jour-moment__block">
        <p class="jour-field__label">${TXT.momentType}</p>
        <div class="jour-moment-grid">${types}</div>
      </div>

      <label class="jour-field">
        <span>${TXT.momentScene}</span>
        <textarea id="moment-scene" rows="3" maxlength="700" placeholder="${esc(TXT.momentScenePlaceholder)}">${esc(moment.scene || '')}</textarea>
      </label>

      <div class="jour-moment__block">
        <p class="jour-field__label">${TXT.momentMoteurs}</p>
        <div class="jour-moment-grid jour-moment-grid--moteurs">${moteurs}</div>
      </div>

      <div class="jour-moment__block">
        <p class="jour-field__label">${EN ? 'Where did you feel it in the body?' : 'Où l\'avez-vous senti dans le corps ?'}</p>
        <div class="jour-moment-grid jour-moment-grid--small">
          ${[
            ['gorge', EN ? 'throat' : 'gorge'],
            ['poitrine', EN ? 'chest' : 'poitrine'],
            ['ventre', EN ? 'belly' : 'ventre'],
            ['tete', EN ? 'head' : 'tête'],
            ['mains', EN ? 'hands' : 'mains'],
            ['souffle', EN ? 'the breath stopped' : 'le souffle s\'est arrêté']
          ].map(([id, label]) => {
            const checked = Array.isArray(moment.corps) && moment.corps.includes(id);
            return `
              <label class="jour-moment-chip jour-moment-chip--small ${checked ? 'is-active' : ''}">
                <input type="checkbox" name="moment-corps" value="${id}" ${checked ? 'checked' : ''}/>
                <span>${label}</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Bloc dynamique "Pour aller plus loin" selon le moteur dominant -->
      <div id="moment-ressource-mount"></div>

      <label class="jour-field">
        <span>${TXT.momentRemede}</span>
        <select id="moment-remede">${remedes}</select>
      </label>

      <label class="jour-field">
        <span>${TXT.momentRepair}</span>
        <textarea id="moment-repair" rows="2" maxlength="500" placeholder="${esc(TXT.momentRepairPlaceholder)}">${esc(moment.repair || '')}</textarea>
      </label>

      <!-- Mini-rituel de réparation -->
      <details class="reparation-block">
        <summary class="reparation-block__summary">↩ ${EN ? 'A tender repair' : 'Une réparation tendre'}</summary>
        <div class="reparation-block__body">
          <p class="reparation-block__intro">${EN
            ? 'A small inner gesture — for you alone. Nothing is sent. Choose what feels right.'
            : 'Un petit geste intérieur — pour vous seul·e. Rien n\'est envoyé. Choisissez ce qui vous parle.'}</p>
          <div class="jour-moment-grid jour-moment-grid--small">
            ${[
              ['pardon', EN ? 'I ask forgiveness in silence' : 'Je demande pardon en silence'],
              ['reparler', EN ? 'I will speak gently again' : 'Je reparlerai doucement'],
              ['benir', EN ? 'I bless this person inwardly' : 'Je bénis cette personne intérieurement'],
              ['taire', EN ? 'I commit to silence' : 'Je m\'engage au silence'],
              ['ecrire', EN ? 'I will write a word' : 'J\'écrirai un mot'],
              ['geste', EN ? 'A concrete act' : 'Un geste concret']
            ].map(([id, label]) => {
              const checked = Array.isArray(moment.reparation) && moment.reparation.includes(id);
              return `
                <label class="jour-moment-chip jour-moment-chip--small ${checked ? 'is-active' : ''}">
                  <input type="checkbox" name="moment-reparation" value="${id}" ${checked ? 'checked' : ''}/>
                  <span>${label}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      </details>

      <label class="jour-field">
        <span>${TXT.momentVow}</span>
        <textarea id="moment-vow" rows="2" maxlength="500" placeholder="${esc(TXT.momentVowPlaceholder)}">${esc(moment.vow || '')}</textarea>
      </label>

      <div id="moment-resources">${renderResources(moment.type)}</div>
    </div>
  `;
}

function renderResources(type) {
  const r = RESOURCES[type];
  if (!r) return '';
  const items = r[LANG].map((label, i) => {
    const href = r.links[i] || '#';
    return `<li><a href="${esc(href)}" target="_blank" rel="noopener">${esc(label)}</a></li>`;
  }).join('');
  return `
    <div class="jour-resources">
      <span class="jour-resources__label">${TXT.resourcesLabel}</span>
      <ul class="jour-resources__list">${items}</ul>
    </div>
  `;
}

function renderSuggestion() {
  return `
    <section class="jour-section jour-section--suggestion">
      <h2 class="jour-section__titre" style="font-size:1.05rem; color:var(--gold);">${TXT.suggestionTitle}</h2>
      <p class="jour-section__sub"><em>${TXT.suggestionSub}</em></p>

      <label class="jour-field">
        <span>${TXT.yourMessage}</span>
        <textarea id="suggestion-msg" rows="3" placeholder="${TXT.suggestionPlaceholder}"></textarea>
      </label>

      <label class="jour-field" style="display:flex; align-items:center; gap:0.5rem;">
        <input type="checkbox" id="suggestion-signed" />
        <span style="text-transform:none; letter-spacing:0; color:var(--ink-soft); font-family: var(--font-display); font-style: italic;">
          ${TXT.suggestionSigned}
        </span>
      </label>

      <button type="button" class="carnet-btn carnet-btn--ghost" id="save-suggestion">${TXT.sendSuggestion}</button>
      <span class="jour-save-ok" id="save-suggestion-ok" hidden>${TXT.suggestionSent}</span>
    </section>
  `;
}

function bindModeChooser(pratiques, jourData) {
  document.querySelectorAll('.jour-mode-card').forEach(btn => {
    btn.addEventListener('click', async () => {
      const newMode = btn.dataset.mode;
      // refresh visuel immédiat
      document.querySelectorAll('.jour-mode-card').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      // re-render contenu
      document.getElementById('mode-content').innerHTML = renderModeContent(newMode, pratiques, jourData);
      bindContent(newMode, pratiques);
      // persister discrètement le mode
      try {
        await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
          langue: LANG, mode: newMode
        }, { merge: true });
      } catch (e) { console.warn('mode save failed', e); }
    });
  });
}

function bindContent(mode, pratiques) {
  if (mode === 'light') bindLight();
  else if (mode === 'heavy') bindHeavy();
  else { bindMatin(); bindSoir(pratiques.pratiques); bindAvalDynamique(pratiques.pratiques); bindChoixVisuel(); bindMomentVisuel(); }
}

function bindChoixVisuel() {
  document.querySelectorAll('.jour-choix__opt input[type="radio"]').forEach(r => {
    r.addEventListener('change', () => {
      const group = document.getElementsByName(r.name);
      group.forEach(rr => rr.closest('.jour-choix__opt')?.classList.remove('is-checked'));
      if (r.checked) r.closest('.jour-choix__opt')?.classList.add('is-checked');
    });
  });
}

function bindMomentVisuel() {
  document.querySelectorAll('.jour-moment-chip input').forEach(input => {
    input.addEventListener('change', () => {
      if (input.type === 'radio') {
        document.getElementsByName(input.name).forEach(i => i.closest('.jour-moment-chip')?.classList.remove('is-active'));
      }
      input.closest('.jour-moment-chip')?.classList.toggle('is-active', input.checked);
      // si on change le type d'événement → mettre à jour les ressources liées
      if (input.name === 'moment-type' && input.checked) {
        const res = document.getElementById('moment-resources');
        if (res) res.innerHTML = renderResources(input.value);
      }
      // si on coche un moteur → afficher la ressource correspondante
      if (input.name === 'moment-moteur') {
        const checked = Array.from(document.querySelectorAll('input[name="moment-moteur"]:checked')).map(i => i.value);
        renderMoteurRessource(checked);
      }
    });
  });
  // initialise les ressources si déjà cochés
  const initialMoteurs = Array.from(document.querySelectorAll('input[name="moment-moteur"]:checked')).map(i => i.value);
  if (initialMoteurs.length) renderMoteurRessource(initialMoteurs);
}

// Affiche le bloc "Pour aller plus loin" selon le 1er moteur coché
// Propose 2-3 Noms-remèdes au lieu d'un seul (logique "Physicians of the Heart")
async function renderMoteurRessource(moteurs) {
  const mount = document.getElementById('moment-ressource-mount');
  if (!mount) return;
  if (!moteurs.length) { mount.innerHTML = ''; return; }
  try {
    const m = await import('./bilan-hebdo-soufi.js');
    const noms = await m.nomsForMouvement(moteurs[0]);
    if (!noms.length) { mount.innerHTML = ''; return; }
    mount.innerHTML = `
      <div class="moteur-ressource">
        <span class="moteur-ressource__label">${EN ? 'Names that may accompany' : 'Des Noms qui peuvent accompagner'}</span>
        <p class="moteur-ressource__invite"><em>${EN
          ? 'Choose the one that speaks to you. None of them is "the answer" — they are companions for the inner movement.'
          : 'Choisissez celui qui vous parle. Aucun n\'est « la solution » — ce sont des compagnons pour le mouvement intérieur.'}</em></p>
        <div class="moteur-ressource__noms">
          ${noms.map(n => `
            <a class="moteur-nom" href="/pages/noms-divins/nom/${esc(n.slug)}/" target="_blank" rel="noopener">
              <div class="moteur-nom__head">
                <span class="moteur-nom__ar" lang="ar" dir="rtl">${esc(n.ar)}</span>
                <span class="moteur-nom__appel">${esc(n.appel)}</span>
              </div>
              <div class="moteur-nom__name"><strong>${esc(n.tr)}</strong> — <em>${esc(n.fr)}</em></div>
              <p class="moteur-nom__sens">${esc(n.sens_psy)}</p>
              <p class="moteur-nom__question"><strong>${EN ? 'Question' : 'Question'} :</strong> ${esc(n.question)}</p>
              <p class="moteur-nom__pratique"><strong>${EN ? 'Practice' : 'Pratique'} :</strong> ${esc(n.pratique)}</p>
              ${n.paire ? `<p class="moteur-nom__paire">${EN ? 'Balancing pair' : 'Paire équilibrante'} : <em>${esc(n.paire)}</em></p>` : ''}
              <span class="moteur-nom__more">${EN ? 'Open this Name →' : 'Découvrir ce Nom →'}</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  } catch (e) { console.warn('ressource failed', e); }
}

function bindLight() {
  const btn = document.getElementById('save-light');
  if (!btn) return;
  const ok = document.getElementById('save-light-ok');
  // state visuel
  document.querySelectorAll('.jour-state-card input').forEach(r => {
    r.addEventListener('change', () => {
      document.querySelectorAll('.jour-state-card').forEach(c => c.classList.remove('is-active'));
      if (r.checked) r.closest('.jour-state-card').classList.add('is-active');
    });
  });
  btn.addEventListener('click', async () => {
    btn.disabled = true; btn.textContent = TXT.loading;
    try {
      const mot   = document.getElementById('light-mot').value.trim();
      const etatI = document.querySelector('input[name="light-etat"]:checked');
      const etat  = etatI ? etatI.value : null;
      const note  = document.getElementById('light-note').value.trim();
      await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
        langue: LANG, mode: 'light',
        trace: { mot: mot || null, etat: etat || null, note: note || null, poseLe: serverTimestamp() }
      }, { merge: true });
      ok.hidden = false;
      setTimeout(() => ok.hidden = true, 2500);
    } catch (e) { console.error(e); alert(TXT.saveError); }
    finally { btn.disabled = false; btn.textContent = TXT.lightSave; }
  });
}

function bindHeavy() {
  const btn = document.getElementById('save-heavy');
  if (!btn) return;
  const ok = document.getElementById('save-heavy-ok');
  btn.addEventListener('click', async () => {
    btn.disabled = true; btn.textContent = TXT.loading;
    try {
      const phrase = document.getElementById('heavy-phrase').value.trim();
      const still  = document.getElementById('heavy-still').checked;
      await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
        langue: LANG, mode: 'heavy',
        heavy: { phrase: phrase || null, still, garderLe: serverTimestamp() }
      }, { merge: true });
      ok.hidden = false;
      setTimeout(() => ok.hidden = true, 2500);
    } catch (e) { console.error(e); alert(TXT.saveError); }
    finally { btn.disabled = false; btn.textContent = TXT.heavySave; }
  });
}

function bindMatin() {
  const btn = document.getElementById('save-matin');
  if (!btn) return;
  const ok = document.getElementById('save-matin-ok');
  btn.addEventListener('click', async () => {
    btn.disabled = true; btn.textContent = TXT.loading;
    try {
      const intentionId = document.getElementById('intention-select').value;
      const note        = document.getElementById('note-matin').value.trim();
      await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
        langue: LANG, mode: 'pose',
        matin: { intentionId: intentionId || null, note: note || null, noteLe: serverTimestamp() }
      }, { merge: true });
      ok.hidden = false;
      setTimeout(() => ok.hidden = true, 2500);
    } catch (e) { console.error(e); alert(TXT.saveError); }
    finally { btn.disabled = false; btn.textContent = TXT.saveMorning; }
  });
}

function bindSoir(items) {
  const btn = document.getElementById('save-soir');
  if (!btn) return;
  const ok = document.getElementById('save-soir-ok');
  btn.addEventListener('click', async () => {
    btn.disabled = true; btn.textContent = TXT.loading;
    try {
      const reponses = {};
      items.forEach(p => {
        const sel = document.querySelector(`input[name="rep-${p.id}"]:checked`);
        if (sel) reponses[p.id] = sel.value;
      });
      const note = document.getElementById('note-soir').value.trim();
      const momentType = document.querySelector('input[name="moment-type"]:checked')?.value || null;
      const momentMoteurs = Array.from(document.querySelectorAll('input[name="moment-moteur"]:checked')).map(i => i.value);
      const momentCorps = Array.from(document.querySelectorAll('input[name="moment-corps"]:checked')).map(i => i.value);
      const momentReparation = Array.from(document.querySelectorAll('input[name="moment-reparation"]:checked')).map(i => i.value);
      const moment = {
        type: momentType,
        scene: document.getElementById('moment-scene')?.value.trim() || null,
        moteurs: momentMoteurs,
        corps: momentCorps,
        reparation: momentReparation,
        remede: document.getElementById('moment-remede')?.value || null,
        repair: document.getElementById('moment-repair')?.value.trim() || null,
        vow: document.getElementById('moment-vow')?.value.trim() || null
      };
      await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
        langue: LANG, mode: 'pose',
        soir: { reponses, note: note || null, moment, fermeLe: serverTimestamp() }
      }, { merge: true });
      ok.hidden = false;
      setTimeout(() => ok.hidden = true, 3000);
    } catch (e) { console.error(e); alert(TXT.saveError); }
    finally { btn.disabled = false; btn.textContent = TXT.closeDay; }
  });
}

function bindAvalDynamique(items) {
  items.forEach(p => {
    document.querySelectorAll(`input[name="rep-${p.id}"]`).forEach(radio => {
      radio.addEventListener('change', () => {
        const card = document.querySelector(`.jour-pratique[data-id="${p.id}"]`);
        const existing = card.querySelector('.jour-aval');
        // l'aval n'apparaît que pour partial / no — pas pour yes ni unknown
        if (radio.value === 'partial' || radio.value === 'no') {
          if (!existing) {
            const div = document.createElement('div');
            div.className = 'jour-aval';
            div.textContent = p[LANG].aval;
            card.appendChild(div);
          }
        } else if (existing) existing.remove();
      });
    });
  });
}

function bindSuggestion() {
  const btn = document.getElementById('save-suggestion');
  if (!btn) return;
  const ok = document.getElementById('save-suggestion-ok');
  btn.addEventListener('click', async () => {
    const msg = document.getElementById('suggestion-msg').value.trim();
    if (!msg) { alert(TXT.emptyMessage); return; }
    const signed = document.getElementById('suggestion-signed').checked;
    btn.disabled = true; btn.textContent = TXT.loading;
    try {
      await addDoc(collection(db, 'suggestions'), {
        message: msg, prenom: signed ? prenom : null, codeId: signed ? codeId : null,
        langue: LANG, statut: 'neuve', creeLe: serverTimestamp()
      });
      document.getElementById('suggestion-msg').value = '';
      document.getElementById('suggestion-signed').checked = false;
      ok.hidden = false;
      setTimeout(() => ok.hidden = true, 4000);
    } catch (e) { console.error(e); alert(TXT.saveError); }
    finally { btn.disabled = false; btn.textContent = TXT.sendSuggestion; }
  });
}

load().catch(err => {
  console.error(err);
  mount.innerHTML = '<p style="text-align:center;color:#888">—</p>';
});
