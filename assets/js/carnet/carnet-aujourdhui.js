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

// === Phase A : contextes, vigilances, adabs (carte d'orientation du jour) ===
const CONTEXTES_FR = [
  { id: 'travail',   label: 'travail' },
  { id: 'famille',   label: 'famille' },
  { id: 'enfant',    label: 'enfant' },
  { id: 'couple',    label: 'couple' },
  { id: 'solitude',  label: 'solitude' },
  { id: 'fatigue',   label: 'fatigue' },
  { id: 'decision',  label: 'décision' },
  { id: 'conflit',   label: 'conflit' },
  { id: 'soin',      label: 'soin de soi' },
  { id: 'service',   label: 'service' }
];
const VIGILANCES_FR = [
  { id: 'parole-vite',   label: 'parole trop vite' },
  { id: 'jugement',      label: 'jugement intérieur' },
  { id: 'controle',      label: 'besoin de contrôle' },
  { id: 'fatigue',       label: 'fatigue qui parle' },
  { id: 'etre-vu',       label: 'besoin d\'être vu' },
  { id: 'dispersion',    label: 'dispersion' },
  { id: 'avoir-raison',  label: 'besoin d\'avoir raison' }
];
const ADABS_FR = [
  { id: 'respirer-avant',  label: 'une respiration avant la réponse' },
  { id: 'pas-absent',      label: 'ne pas parler d\'un absent' },
  { id: 'baisser-voix',    label: 'baisser la voix avant d\'expliquer' },
  { id: 'finir-chose',     label: 'faire une chose avec soin, jusqu\'au bout' },
  { id: 'ecouter',         label: 'écouter sans préparer ma réponse' },
  { id: 'differer',        label: 'différer une réponse difficile' },
  { id: 'tenir-parole',    label: 'tenir une petite parole donnée' }
];

// Phase C — quel adab d'aujourd'hui suit naturellement le mouvement d'hier
const MOUVEMENT_TO_ADAB_HINT = {
  colere:    'baisser-voix',
  jugement:  'respirer-avant',
  ghiba:     'pas-absent',
  controle:  'ecouter',
  orgueil:   'ecouter',
  honte:     'tenir-parole',
  fatigue:   'differer',
  desir:     'differer',
  oubli:     'respirer-avant',
  fermeture: 'tenir-parole'
};
// Axes du jour — chaque jour de semaine colore l'expérience d'un accent
// (suit la priorité 3 du rapport : variation quotidienne sans changer le cadre)
const AXES_DU_JOUR = [
  { id: 'silence',    jour: 0, label: 'Jour du silence',     phrase: 'aujourd\'hui, garder le silence sur une chose suffit.' },        // dimanche
  { id: 'parole',     jour: 1, label: 'Jour de la parole',   phrase: 'aujourd\'hui, veiller à une seule parole.' },                    // lundi
  { id: 'corps',      jour: 2, label: 'Jour du corps',       phrase: 'aujourd\'hui, écouter le corps une fois dans la journée.' },     // mardi
  { id: 'lien',       jour: 3, label: 'Jour du lien',        phrase: 'aujourd\'hui, un geste vers quelqu\'un — sans annoncer.' },      // mercredi
  { id: 'coeur',      jour: 4, label: 'Jour du cœur',        phrase: 'aujourd\'hui, recevoir un don sans détourner le regard.' },      // jeudi
  { id: 'reparation', jour: 5, label: 'Jour de la réparation', phrase: 'aujourd\'hui, reprendre une chose en plus petit.' },           // vendredi
  { id: 'acte',       jour: 6, label: 'Jour de l\'acte juste', phrase: 'aujourd\'hui, finir une chose avec soin, jusqu\'au bout.' }    // samedi
];
function axeDuJour() {
  const d = new Date();
  return AXES_DU_JOUR.find(a => a.jour === d.getDay()) || AXES_DU_JOUR[0];
}

// Libellé lisible pour la phrase d'hier
const MOUVEMENT_LABEL_FR = {
  colere: 'la colère', jugement: 'le jugement', ghiba: 'la parole d\'un absent',
  controle: 'le besoin de contrôle', orgueil: 'l\'orgueil', honte: 'la honte',
  fatigue: 'la fatigue', desir: 'le désir', oubli: 'l\'oubli', fermeture: 'la fermeture du cœur',
  // moteurs anciens vocabulaires
  peur: 'la peur', attente: 'une attente non comblée', tristesse: 'la tristesse'
};

const T_fr = {
  hello: 'Bonjour',
  // Phase A — orientation du matin
  matinContexte:   'Ma journée ressemble surtout à',
  matinVigilance:  'Ce que je surveille doucement',
  matinAdab:       'Un adab concret pour la journée',
  matinPhraseTpl:  'Aujourd\'hui, dans ma journée de {contexte}, je cultive {intention}. Je surveille {vigilance}. Mon adab : {adab}.',
  soirBilanComplet:'Bilan complet (12 pratiques)',
  soirBilanReplier:'Replier le bilan',
  soirCoeur:       'Le cœur du soir',
  soirCoeurSub:    'Une seule scène à relire — le reste est en option',
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
  const [pratiquesJson, motsJson, axesJson, ctxJson, appJson, encJson, jourSnap, hierSnap] = await Promise.all([
    fetch('/data/carnet/pratiques.json').then(r => r.json()),
    fetch('/data/carnet/mots-graines.json').then(r => r.json()),
    fetch('/data/carnet/axes-spirituels.json').then(r => r.json()),
    fetch('/data/carnet/contextes-spirituels.json').then(r => r.json()),
    fetch('/data/carnet/apprentissages-profonds.json').then(r => r.json()),
    fetch('/data/carnet/encouragements.json').then(r => r.json()),
    getDoc(doc(db, 'carnets', codeId, 'jours', date)).catch(() => null),
    getDoc(doc(db, 'carnets', codeId, 'jours', dateHier)).catch(() => null)
  ]);
  const motCompagnon = motsJson.mots.find(m => m.id === session.motGraine);
  const jourData = jourSnap?.exists() ? jourSnap.data() : {};
  const hierData = hierSnap?.exists() ? hierSnap.data() : null;
  render({
    pratiques: pratiquesJson, motCompagnon, jourData, hierData,
    axesLib: axesJson, ctxLib: ctxJson, appLib: appJson, encLib: encJson
  });
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

function render({ pratiques, motCompagnon, jourData, hierData, axesLib, ctxLib, appLib, encLib }) {
  // Schéma v2 — la page Aujourd'hui n'a plus de "mode" comme structure principale
  // (Refonte structurelle spirituelle — rapport du 7 juin 2026)
  // Les deux blocs centraux : "Je pose ma journée" + "Ce soir, je relis ma journée"

  // Mention discrète du mot-graine (le gros bloc quotidien est supprimé)
  const motGraineMention = motCompagnon ? `
    <p class="jour-graine-discret">
      <span lang="ar" dir="rtl">${esc(motCompagnon.ar)}</span>
      <em>${esc(motCompagnon.tr)}</em> — ${esc(motCompagnon[LANG].nom)}
      <a href="/pages/carnet/miroir/" class="jour-graine-discret__link">votre mot-graine →</a>
    </p>` : '';

  const headerBlock = `
    <header class="jour-head">
      <p class="jour-whisper"><em>${whisperForTime()}</em></p>
      <p class="jour-hello">${TXT.hello}, <em>${esc(prenom)}</em>.</p>
      <p class="jour-date">${dateLisible()}</p>
    </header>
  `;

  const contentBlock = renderJournee(jourData, hierData, { axesLib, ctxLib, appLib, encLib });

  // Reprise du vœu d'hier — seulement si un vow existe dans le jour précédent
  const repriseBlock = renderRepriseVow(hierData, jourData);

  // Boussole : rendu initial (avec hier + axe), Nom du jour sera injecté en async
  const boussoleInitiale = renderBoussole(null, hierData);

  mount.innerHTML = `
    ${headerBlock}
    ${repriseBlock}
    <div id="boussole-mount">${boussoleInitiale}</div>
    <div id="nom-du-jour"></div>
    ${motGraineMention}
    ${ornament()}
    <div id="journee-content">${contentBlock}</div>
    <div id="bilan-hebdo-mount"></div>
    ${ornament()}
    ${renderSuggestion()}
  `;

  bindJournee({ axesLib, ctxLib, appLib, encLib });
  bindReprise();
  bindSuggestion();

  // === Nom du jour + Bilan hebdo soufi (async, ne bloque pas l'affichage) ===
  import('./bilan-hebdo-soufi.js').then(async (m) => {
    const { bilan, nom, names } = await m.loadAndBuild(codeId);
    // Une fois le Nom du jour résolu, on re-render la boussole pour l'inclure
    const bEl = document.getElementById('boussole-mount');
    if (bEl) bEl.innerHTML = renderBoussole(nom, hierData);

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

// ============================================================
//  REFONTE STRUCTURELLE SPIRITUELLE — v2 du carnet
//  Deux blocs : "Je pose ma journée" + "Ce soir, je relis ma journée"
// ============================================================

// Render un groupe de chips classées par famille — réutilisable
function renderChipsParFamille(items, familles, inputName, type, currentValues) {
  const cur = new Set(currentValues || []);
  const blocks = Object.entries(familles).map(([fid, fam]) => {
    const inFam = items.filter(i => i.famille === fid);
    if (!inFam.length) return '';
    const chips = inFam.map(it => {
      const checked = cur.has(it.id);
      return `
        <label class="jour-chip ${checked?'is-active':''}">
          <input type="${type}" name="${inputName}" value="${esc(it.id)}" ${checked?'checked':''}/>
          <span>${esc(it.label)}</span>
        </label>`;
    }).join('');
    return `
      <div class="jour-famille">
        <p class="jour-famille__label">${esc(fam.label)}</p>
        <div class="jour-chips">${chips}</div>
      </div>`;
  }).join('');
  return blocks;
}

function renderJournee(jourData, hierData, libs) {
  return `
    ${renderPoseJournee(jourData, hierData, libs)}
    ${ornament()}
    ${renderReluJournee(jourData, hierData, libs)}
  `;
}

function renderPoseJournee(jourData, hierData, libs) {
  const matin = jourData.matin || {};
  const hintMatin = renderHintMatin(hierData);

  const chipsContextes = renderChipsParFamille(
    libs.ctxLib.contextes, libs.ctxLib.familles, 'pose-contexte', 'checkbox', matin.contextes || []);
  const chipsAxes = renderChipsParFamille(
    libs.axesLib.axes, libs.axesLib.familles, 'pose-axe', 'checkbox', matin.axes || []);

  const curApp = new Set(matin.apprentissages || []);
  const chipsApprentissages = libs.appLib.apprentissages.map(a => `
    <label class="jour-chip ${curApp.has(a.id)?'is-active':''}" title="${esc(a.sens)}">
      <input type="checkbox" name="pose-apprentissage" value="${esc(a.id)}" ${curApp.has(a.id)?'checked':''}/>
      <span>${esc(a.label)}</span>
    </label>`).join('');

  const curAdab = matin.adab || '';
  const chipsAdabs = ADABS_FR.map(a => `
    <label class="jour-chip ${curAdab===a.id?'is-active':''}">
      <input type="radio" name="pose-adab" value="${esc(a.id)}" ${curAdab===a.id?'checked':''}/>
      <span>${esc(a.label)}</span>
    </label>`).join('');

  const geste = matin.geste || '';
  const synthese = matin.poseLe ? renderSynthesePoseMatin(matin, libs) : '';

  return `
    <section class="jour-section" id="section-pose">
      <h2 class="jour-section__titre">Je pose ma journée</h2>
      <p class="jour-section__sub"><em>Une orientation pour marcher aujourd'hui avec plus de vérité.</em></p>

      ${hintMatin}

      <div class="jour-etape">
        <p class="jour-etape__num">1.</p>
        <p class="jour-etape__titre">Où ma vigilance sera sollicitée aujourd'hui ?</p>
        ${chipsContextes}
      </div>

      <div class="jour-etape">
        <p class="jour-etape__num">2.</p>
        <p class="jour-etape__titre">Ce que je veux travailler aujourd'hui</p>
        ${chipsAxes}
      </div>

      <details class="jour-etape jour-etape--option">
        <summary class="jour-etape__summary"><span class="jour-etape__num">3.</span> Apprendre plus profondément <span class="jour-etape__optionel">(facultatif)</span></summary>
        <div class="jour-chips jour-chips--apprentissages">${chipsApprentissages}</div>
      </details>

      <div class="jour-etape">
        <p class="jour-etape__num">4.</p>
        <p class="jour-etape__titre">Un adab pour la journée</p>
        <div class="jour-chips">${chipsAdabs}</div>
      </div>

      <div class="jour-etape">
        <p class="jour-etape__num">5.</p>
        <p class="jour-etape__titre">Mon geste concret <span class="jour-etape__optionel">(petit, observable)</span></p>
        <input type="text" id="pose-geste" class="jour-input" maxlength="200" placeholder="ex. : respirer une fois avant de répondre" value="${esc(geste)}"/>
      </div>

      <button type="button" class="carnet-btn carnet-btn--gold" id="save-pose">Poser ma journée</button>
      <span class="jour-save-ok" id="save-pose-ok" hidden>✓ posée</span>
      <div id="synthese-pose">${synthese}</div>
    </section>
  `;
}

function renderSynthesePoseMatin(matin, libs) {
  if (!matin) return '';
  const axesLabels = (matin.axes || []).map(id => {
    const a = libs.axesLib.axes.find(x => x.id === id);
    return a ? a.label : null;
  }).filter(Boolean);
  const adab = ADABS_FR.find(a => a.id === matin.adab);
  const geste = matin.geste;
  if (!axesLabels.length && !adab && !geste) return '';
  return `
    <div class="jour-synthese">
      <p class="jour-synthese__label">Pour aujourd'hui</p>
      ${axesLabels.length ? `<p>Je veille à : <strong>${axesLabels.slice(0,3).map(esc).join(', ')}</strong>.</p>` : ''}
      ${adab ? `<p>Mon adab : <em>${esc(adab.label)}</em>.</p>` : ''}
      ${geste ? `<p>Mon geste : « ${esc(geste)} ».</p>` : ''}
    </div>
  `;
}

function renderReluJournee(jourData, hierData, libs) {
  const matin = jourData.matin || {};
  const soir = jourData.soir || {};
  const aPose = !!matin.poseLe;

  // Étape 1 : Rappel de ce qui a été posé
  const rappelBlock = aPose ? `
    <div class="relu-rappel">
      <p class="relu-rappel__label">Ce que vous aviez posé aujourd'hui</p>
      ${renderSynthesePoseMatin(matin, libs)}
    </div>` : `
    <div class="relu-rappel relu-rappel--vide">
      <p><em>Vous n'avez rien posé ce matin — c'est très bien aussi. Vous pouvez relire votre journée librement.</em></p>
    </div>`;

  // Étape 2 : Bilan des axes choisis (seulement si axes posés)
  const axesBilan = soir.axesBilan || {};
  const STATUTS = [
    ['present', 'présent'],
    ['parfois', 'parfois'],
    ['oublie',  'oublié'],
    ['pas-clair','pas clair']
  ];
  const bilanAxes = (matin.axes || []).map(axeId => {
    const axe = libs.axesLib.axes.find(a => a.id === axeId);
    if (!axe) return '';
    const cur = axesBilan[axeId] || '';
    const opts = STATUTS.map(([id, label]) => `
      <label class="jour-statut ${cur===id?'is-active':''}">
        <input type="radio" name="bilan-${esc(axeId)}" value="${id}" ${cur===id?'checked':''}/>
        <span>${label}</span>
      </label>`).join('');
    return `
      <div class="relu-axe">
        <p class="relu-axe__label">${esc(axe.label)}</p>
        <div class="jour-statuts">${opts}</div>
      </div>`;
  }).join('');

  // Étape 3 : Ce qui a été difficile (10 mouvements)
  const MOUVEMENTS_10 = [
    ['colere','colère'],['jugement','jugement'],['ghiba','parole sur un absent'],
    ['controle','contrôle'],['orgueil','besoin d\'avoir raison'],['honte','honte'],
    ['fatigue','fatigue'],['desir','désir / impulsion'],['oubli','oubli / dispersion'],
    ['fermeture','fermeture du cœur']
  ];
  const curMvt = new Set(soir.mouvements || []);
  const chipsMvt = MOUVEMENTS_10.map(([id, label]) => `
    <label class="jour-chip ${curMvt.has(id)?'is-active':''}">
      <input type="checkbox" name="relu-mouvement" value="${esc(id)}" ${curMvt.has(id)?'checked':''}/>
      <span>${esc(label)}</span>
    </label>`).join('');

  // Étape 4 : Ce qui a poussé aujourd'hui
  const curPousse = new Set(soir.ceQuiAPousse || []);
  const chipsPousse = libs.encLib.encouragements.map(e => `
    <label class="jour-chip jour-chip--soft ${curPousse.has(e.id)?'is-active':''}" title="${esc(e.phrase)}">
      <input type="checkbox" name="relu-pousse" value="${esc(e.id)}" ${curPousse.has(e.id)?'checked':''}/>
      <span>${esc(e.label)}</span>
    </label>`).join('');

  // Étape 5 : Gratitude
  const GRATITUDES = [
    ['chose','une chose reçue'],['personne','une personne'],['protection','une protection'],
    ['patience','une patience'],['lumiere','une lumière'],['repas','un repas'],
    ['silence-g','un silence'],['rien-clair','rien de clair, mais je reste ouvert·e']
  ];
  const curGra = new Set(soir.gratitude || []);
  const chipsGra = GRATITUDES.map(([id, label]) => `
    <label class="jour-chip jour-chip--soft ${curGra.has(id)?'is-active':''}">
      <input type="checkbox" name="relu-gratitude" value="${esc(id)}" ${curGra.has(id)?'checked':''}/>
      <span>${esc(label)}</span>
    </label>`).join('');
  const gratitudeNote = soir.gratitudeNote || '';

  // Étape 6 : Reprise pour demain
  const REPRISES = [
    ['meme-axe',       'le même axe'],
    ['meme-geste-plus-petit','le même geste, plus petit'],
    ['reparation',     'une réparation'],
    ['vigilance-nouvelle','une vigilance nouvelle'],
    ['reposer',        'je laisse reposer']
  ];
  const curRep = (soir.repriseDemain && soir.repriseDemain.type) || '';
  const reprisesChips = REPRISES.map(([id, label]) => `
    <label class="jour-chip ${curRep===id?'is-active':''}">
      <input type="radio" name="relu-reprise" value="${esc(id)}" ${curRep===id?'checked':''}/>
      <span>${esc(label)}</span>
    </label>`).join('');
  const repriseTexte = (soir.repriseDemain && soir.repriseDemain.texte) || '';

  return `
    <section class="jour-section" id="section-relu">
      <h2 class="jour-section__titre">Ce soir, je relis ma journée</h2>
      <p class="jour-section__sub"><em>Regarder sans se condamner, revenir sans se durcir, remercier ce qui a poussé.</em></p>

      ${rappelBlock}

      ${(matin.axes || []).length ? `
        <div class="jour-etape">
          <p class="jour-etape__num">·</p>
          <p class="jour-etape__titre">Comment chaque axe a-t-il été vécu ?</p>
          ${bilanAxes}
        </div>` : ''}

      <div class="jour-etape">
        <p class="jour-etape__num">·</p>
        <p class="jour-etape__titre">Ce qui a été difficile aujourd'hui</p>
        <div class="jour-chips">${chipsMvt}</div>
      </div>

      <div class="jour-etape jour-etape--soft">
        <p class="jour-etape__num">·</p>
        <p class="jour-etape__titre">Ce qui a poussé aujourd'hui</p>
        <p class="jour-etape__hint"><em>Même petit, cela compte. Dieu voit ce qui est caché.</em></p>
        <div class="jour-chips">${chipsPousse}</div>
      </div>

      <div class="jour-etape jour-etape--soft">
        <p class="jour-etape__num">·</p>
        <p class="jour-etape__titre">Une gratitude</p>
        <div class="jour-chips">${chipsGra}</div>
        <label class="jour-field">
          <span>Une gratitude en une phrase, si elle vient</span>
          <textarea id="relu-gratitude-note" rows="2" maxlength="400">${esc(gratitudeNote)}</textarea>
        </label>
      </div>

      <div class="jour-etape">
        <p class="jour-etape__num">·</p>
        <p class="jour-etape__titre">Qu'est-ce que je reprends demain, plus petit ?</p>
        <div class="jour-chips">${reprisesChips}</div>
        <label class="jour-field">
          <span>En un mot, si cela vient</span>
          <input type="text" id="relu-reprise-texte" class="jour-input" maxlength="200" placeholder="ex. : respirer une fois avant de répondre" value="${esc(repriseTexte)}"/>
        </label>
      </div>

      <button type="button" class="carnet-btn carnet-btn--gold" id="save-relu">Déposer le jour</button>
      <span class="jour-save-ok" id="save-relu-ok" hidden>✓ jour déposé</span>
    </section>
  `;
}

function bindJournee(libs) {
  // Toggle visuel des chips (toutes)
  document.querySelectorAll('#journee-content .jour-chip input').forEach(inp => {
    inp.addEventListener('change', () => {
      const label = inp.closest('.jour-chip');
      if (inp.type === 'radio') {
        const name = inp.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(i =>
          i.closest('.jour-chip')?.classList.toggle('is-active', i.checked));
      } else {
        label.classList.toggle('is-active', inp.checked);
      }
    });
  });
  // Toggle visuel des statuts (bilan des axes)
  document.querySelectorAll('#journee-content .jour-statut input').forEach(inp => {
    inp.addEventListener('change', () => {
      const name = inp.name;
      document.querySelectorAll(`input[name="${name}"]`).forEach(i =>
        i.closest('.jour-statut')?.classList.toggle('is-active', i.checked));
    });
  });

  // --- Sauvegarde du matin ---
  const btnPose = document.getElementById('save-pose');
  if (btnPose) {
    btnPose.addEventListener('click', async () => {
      btnPose.disabled = true; btnPose.textContent = 'Enregistrement…';
      try {
        const contextes      = Array.from(document.querySelectorAll('input[name="pose-contexte"]:checked')).map(i=>i.value);
        const axes           = Array.from(document.querySelectorAll('input[name="pose-axe"]:checked')).map(i=>i.value);
        const apprentissages = Array.from(document.querySelectorAll('input[name="pose-apprentissage"]:checked')).map(i=>i.value);
        const adab           = document.querySelector('input[name="pose-adab"]:checked')?.value || null;
        const geste          = document.getElementById('pose-geste')?.value.trim() || null;
        await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
          langue: LANG, schemaVersion: 2,
          matin: { contextes, axes, apprentissages, adab, geste, poseLe: serverTimestamp() }
        }, { merge: true });
        const ok = document.getElementById('save-pose-ok');
        if (ok) { ok.hidden = false; setTimeout(() => ok.hidden = true, 2500); }
        // Re-render la synthèse
        const synthEl = document.getElementById('synthese-pose');
        if (synthEl) synthEl.innerHTML = renderSynthesePoseMatin({ axes, adab, geste, poseLe: true }, libs);
      } catch (e) { console.error(e); alert('Désolé, la sauvegarde n\'a pas pu se faire.'); }
      finally { btnPose.disabled = false; btnPose.textContent = 'Poser ma journée'; }
    });
  }

  // --- Sauvegarde du soir ---
  const btnRelu = document.getElementById('save-relu');
  if (btnRelu) {
    btnRelu.addEventListener('click', async () => {
      btnRelu.disabled = true; btnRelu.textContent = 'Enregistrement…';
      try {
        const axesBilan = {};
        document.querySelectorAll('.relu-axe').forEach(el => {
          const inp = el.querySelector('input[type="radio"]:checked');
          if (inp) {
            const axeId = inp.name.replace(/^bilan-/, '');
            axesBilan[axeId] = inp.value;
          }
        });
        const mouvements   = Array.from(document.querySelectorAll('input[name="relu-mouvement"]:checked')).map(i=>i.value);
        const ceQuiAPousse = Array.from(document.querySelectorAll('input[name="relu-pousse"]:checked')).map(i=>i.value);
        const gratitude    = Array.from(document.querySelectorAll('input[name="relu-gratitude"]:checked')).map(i=>i.value);
        const gratitudeNote= document.getElementById('relu-gratitude-note')?.value.trim() || null;
        const repriseType  = document.querySelector('input[name="relu-reprise"]:checked')?.value || null;
        const repriseTexte = document.getElementById('relu-reprise-texte')?.value.trim() || null;
        await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
          langue: LANG, schemaVersion: 2,
          soir: {
            axesBilan, mouvements, ceQuiAPousse,
            gratitude, gratitudeNote,
            repriseDemain: { type: repriseType, texte: repriseTexte },
            fermeLe: serverTimestamp()
          }
        }, { merge: true });
        const ok = document.getElementById('save-relu-ok');
        if (ok) { ok.hidden = false; setTimeout(() => ok.hidden = true, 2500); }
      } catch (e) { console.error(e); alert('Désolé, la sauvegarde n\'a pas pu se faire.'); }
      finally { btnRelu.disabled = false; btnRelu.textContent = 'Déposer le jour'; }
    });
  }
}

// ============================================================
//  Ancien moteur (modes Léger / Posé / Lourd) — conservé dormant
//  pour ne pas casser les anciens jours déjà enregistrés en mode v1
// ============================================================
function renderModeContent(mode, pratiques, jourData, hierData) {
  if (mode === 'light')  return renderLight(jourData);
  if (mode === 'heavy')  return renderHeavy(jourData);
  return renderPose(pratiques, jourData, hierData);
}

// Boussole du jour — synthèse en haut de page (Priorité 1 du rapport)
// Assemble : axe du jour + Nom du jour (si dispo) + mouvement d'hier (si dispo)
function renderBoussole(nom, hierData) {
  const axe = axeDuJour();

  // continuité douce avec hier
  let suite = '';
  if (hierData?.soir?.moment?.moteurs?.length) {
    const m = hierData.soir.moment.moteurs[0];
    const MAP = { peur:'controle', attente:'desir', tristesse:'fermeture' };
    const mvtId = MAP[m] || m;
    const adabId = MOUVEMENT_TO_ADAB_HINT[mvtId];
    const adab = ADABS_FR.find(a => a.id === adabId);
    const label = MOUVEMENT_LABEL_FR[m];
    if (label && adab) {
      suite = ` Et puisqu'hier ${label} est venue, peut-être : <strong>${esc(adab.label)}</strong>.`;
    }
  }

  // Nom du jour en compagnon (optionnel)
  const nomLigne = nom
    ? `<p class="boussole__nom"><span class="boussole__nom-label">avec</span> <em>${esc(nom.tr)}</em> — ${esc(nom.fr)}</p>`
    : '';

  return `
    <section class="boussole">
      <div class="boussole__head">
        <span class="boussole__axe">${esc(axe.label)}</span>
      </div>
      <p class="boussole__phrase">${esc(axe.phrase)}${suite}</p>
      ${nomLigne}
      <p class="boussole__note"><em>Une seule chose suffit. Ouvrir la suite si l'élan vient.</em></p>
    </section>
  `;
}

// Phase C — hint matin tiré du mouvement dominant d'hier
function renderHintMatin(hierData) {
  if (!hierData?.soir?.moment?.moteurs?.length) return '';
  const m = hierData.soir.moment.moteurs[0];
  const label = MOUVEMENT_LABEL_FR[m];
  // Le moteur du carnet est mappé vers un mouvement de la nafs
  const MAP = { peur:'controle', attente:'desir', tristesse:'fermeture' };
  const mvtId = MAP[m] || m;
  const adabId = MOUVEMENT_TO_ADAB_HINT[mvtId];
  const adab = ADABS_FR.find(a => a.id === adabId);
  if (!label || !adab) return '';
  return `
    <div class="jour-hint-matin">
      <span class="jour-hint-matin__label">Hier</span>
      <p class="jour-hint-matin__text">
        ${esc(label)} est venue. Un adab possible pour aujourd'hui : <strong>${esc(adab.label)}</strong>.
      </p>
      <p class="jour-hint-matin__note"><em>Suggestion — libre à vous de choisir autrement.</em></p>
    </div>
  `;
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

function renderPose(pratiques, jourData, hierData) {
  const hintMatin = renderHintMatin(hierData);
  const cercles = pratiques.cercles;
  const items = pratiques.pratiques;
  const groupes = ['parole', 'acte', 'coeur', 'lien'];
  const intentionActuelle = jourData.matin?.intentionId || '';
  const noteMatin = jourData.matin?.note || '';
  const ctxActuel  = jourData.matin?.contexte  || '';
  const vigActuel  = jourData.matin?.vigilance || '';
  const adabActuel = jourData.matin?.adab      || '';

  const chipsContexte  = CONTEXTES_FR.map(c => `
    <label class="jour-chip ${ctxActuel===c.id?'is-active':''}">
      <input type="radio" name="matin-contexte" value="${esc(c.id)}" ${ctxActuel===c.id?'checked':''}/>
      <span>${esc(c.label)}</span>
    </label>`).join('');
  const chipsVigilance = VIGILANCES_FR.map(v => `
    <label class="jour-chip ${vigActuel===v.id?'is-active':''}">
      <input type="radio" name="matin-vigilance" value="${esc(v.id)}" ${vigActuel===v.id?'checked':''}/>
      <span>${esc(v.label)}</span>
    </label>`).join('');
  const chipsAdab      = ADABS_FR.map(a => `
    <label class="jour-chip ${adabActuel===a.id?'is-active':''}">
      <input type="radio" name="matin-adab" value="${esc(a.id)}" ${adabActuel===a.id?'checked':''}/>
      <span>${esc(a.label)}</span>
    </label>`).join('');
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

      ${hintMatin}

      <label class="jour-field">
        <span>${TXT.intentionLabel}</span>
        <select id="intention-select">
          <option value="">${TXT.choose}</option>
          ${intentionsOptions}
        </select>
      </label>

      <div class="jour-field">
        <span class="jour-field__label">${TXT.matinContexte}</span>
        <div class="jour-chips">${chipsContexte}</div>
      </div>

      <div class="jour-field">
        <span class="jour-field__label">${TXT.matinVigilance}</span>
        <div class="jour-chips">${chipsVigilance}</div>
      </div>

      <div class="jour-field">
        <span class="jour-field__label">${TXT.matinAdab}</span>
        <div class="jour-chips">${chipsAdab}</div>
      </div>

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

      <div class="jour-soir-coeur">
        <h3 class="jour-soir-coeur__titre">${TXT.soirCoeur}</h3>
        <p class="jour-section__sub"><em>${TXT.soirCoeurSub}</em></p>
        ${renderMoment(moment)}
      </div>

      <label class="jour-field">
        <span>${TXT.noteEvening}</span>
        <textarea id="note-soir" rows="4">${esc(noteSoir)}</textarea>
      </label>

      <details class="jour-bilan-complet">
        <summary class="jour-bilan-complet__summary">${TXT.soirBilanComplet}</summary>
        <div class="jour-bilan-complet__body">
          ${blocCercles}
        </div>
      </details>

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

function bindModeChooser(pratiques, jourData, hierData) {
  document.querySelectorAll('.jour-mode-card').forEach(btn => {
    btn.addEventListener('click', async () => {
      const newMode = btn.dataset.mode;
      // refresh visuel immédiat
      document.querySelectorAll('.jour-mode-card').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      // re-render contenu
      document.getElementById('mode-content').innerHTML = renderModeContent(newMode, pratiques, jourData, hierData);
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
    // Le moteur du carnet est mappé vers un mouvement de la nafs
    const mvtId = m.MOTEUR_TO_MOUVEMENT?.[moteurs[0]] || moteurs[0];
    const [noms, reparations, mouvement] = await Promise.all([
      m.nomsForMouvement(mvtId),
      m.reparationsForMoteur(moteurs[0]),
      m.mouvementForMoteur(moteurs[0])
    ]);
    if (!noms.length && !reparations.length) { mount.innerHTML = ''; return; }

    // Bloc « jour lourd » — le minimum si le cœur ne peut pas plus
    const jourLourdHtml = mouvement?.jour_lourd ? `
      <div class="moteur-jour-lourd">
        <span class="moteur-jour-lourd__label">${EN ? 'If today is heavy' : 'Si aujourd\'hui est lourd'}</span>
        <p class="moteur-jour-lourd__text">${esc(mouvement.jour_lourd)}</p>
      </div>` : '';

    // Bloc réparations dynamiques selon le mouvement
    const reparationsHtml = reparations.length ? `
      <div class="moteur-reparations">
        <span class="moteur-reparations__label">${EN ? 'Repairs that match this movement' : 'Des réparations pour ce mouvement'}</span>
        <p class="moteur-reparations__intro"><em>${EN
          ? 'Tiny and concrete. None is required — just one is enough.'
          : 'Toutes petites, concrètes. Aucune n\'est obligatoire — une seule suffit.'}</em></p>
        <ul class="moteur-reparations__list">
          ${reparations.map(r => `
            <li class="moteur-reparation">
              <div class="moteur-reparation__head">
                <strong>${esc(r.label)}</strong>
                ${r.discretion === 'rien-a-envoyer' ? `<span class="moteur-reparation__tag">${EN ? 'inside only' : 'rien à envoyer'}</span>` : ''}
                ${r.discretion === 'silencieuse' ? `<span class="moteur-reparation__tag moteur-reparation__tag--silent">${EN ? 'silent' : 'silencieuse'}</span>` : ''}
              </div>
              <p class="moteur-reparation__intro">${esc(r.intro)}</p>
              ${r.phrase ? `<p class="moteur-reparation__phrase">${esc(r.phrase)}</p>` : ''}
            </li>
          `).join('')}
        </ul>
      </div>` : '';

    mount.innerHTML = `
      ${jourLourdHtml}
      ${reparationsHtml}
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
      const contexte    = document.querySelector('input[name="matin-contexte"]:checked')?.value || null;
      const vigilance   = document.querySelector('input[name="matin-vigilance"]:checked')?.value || null;
      const adab        = document.querySelector('input[name="matin-adab"]:checked')?.value || null;
      await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
        langue: LANG, mode: 'pose',
        matin: {
          intentionId: intentionId || null,
          note: note || null,
          contexte, vigilance, adab,
          noteLe: serverTimestamp()
        }
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

/* === Auto-resize des textareas (hauteur ajustée au contenu) === */
function autoResizeTextareas() {
  const grow = (ta) => {
    ta.style.height = 'auto';
    ta.style.height = (ta.scrollHeight + 4) + 'px';
  };
  document.querySelectorAll('.jour-field textarea, .jour-moment textarea').forEach(ta => {
    if (ta.dataset.autoResize) return;
    ta.dataset.autoResize = '1';
    ta.style.overflow = 'hidden';
    // Hauteur initiale = contenu actuel (placeholder non compté, mais min-height CSS s'applique)
    grow(ta);
    ta.addEventListener('input', () => grow(ta));
  });
}
// Observe le DOM pour binder les nouveaux textareas créés dynamiquement
new MutationObserver(() => autoResizeTextareas()).observe(document.body, { childList: true, subtree: true });
autoResizeTextareas();
