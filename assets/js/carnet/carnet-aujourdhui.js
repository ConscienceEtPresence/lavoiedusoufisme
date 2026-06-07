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
  whisperReturn: 'Here you are. The journal was waiting without counting.',
  whisperEvening: 'The day is fading. You can simply come, without saying anything.',
  whisperMorning: 'Morning begins. One intention is enough.',
  whisperNight: 'Night keeps watch. One sentence, if it comes — then sleep.',
  sortir: 'Sign out',
};
const TXT = EN ? T_en : T_fr;

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

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
const date = todayKey();

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
  const [pratiquesJson, motsJson, jourSnap] = await Promise.all([
    fetch('/data/carnet/pratiques.json').then(r => r.json()),
    fetch('/data/carnet/mots-graines.json').then(r => r.json()),
    getDoc(doc(db, 'carnets', codeId, 'jours', date)).catch(() => null)
  ]);
  const motCompagnon = motsJson.mots.find(m => m.id === session.motGraine);
  const jourData = jourSnap?.exists() ? jourSnap.data() : {};
  render({ pratiques: pratiquesJson, motCompagnon, jourData });
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

function render({ pratiques, motCompagnon, jourData }) {
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

  mount.innerHTML = `
    ${headerBlock}
    ${compagnonBlock}
    ${ornament()}
    ${modeChooserBlock}
    <div id="mode-content">${contentBlock}</div>
    ${ornament()}
    ${renderSuggestion()}
  `;

  bindModeChooser(pratiques, jourData);
  bindContent(mode, pratiques);
  bindSuggestion();
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

      <button type="button" class="carnet-btn carnet-btn--gold" id="save-soir">${TXT.closeDay}</button>
      <span class="jour-save-ok" id="save-soir-ok" hidden>${TXT.closeDaySaved}</span>
    </section>
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
  else { bindMatin(); bindSoir(pratiques.pratiques); bindAvalDynamique(pratiques.pratiques); bindChoixVisuel(); }
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
      await setDoc(doc(db, 'carnets', codeId, 'jours', date), {
        langue: LANG, mode: 'pose',
        soir: { reponses, note: note || null, fermeLe: serverTimestamp() }
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
