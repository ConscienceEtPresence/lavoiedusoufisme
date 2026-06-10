/* ============================================================
   Le carnet d'adab — Tableau de bord principal
   Toujours visible : ce que j'ai posé + les 10 vigilances accessibles
   ============================================================ */
import { db } from './firebase-init.js';
import { doc, getDoc, serverTimestamp, setDoc }
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

const mount = document.getElementById('aiguilleur-mount');
const dateEl = document.getElementById('adab-date');

function keyOf(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function todayKey() {
  return keyOf(new Date());
}
function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return keyOf(d);
}
function veilleLisible() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
}
function dateLisible() {
  return new Date().toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
}
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function greetingByHour(heure) {
  if (heure < 5)  return t('Bonsoir','Good evening');
  if (heure < 18) return t('Bonjour','Hello');
  return t('Bonsoir','Good evening');
}

dateEl.textContent = dateLisible();

(async () => {
  try {
    const date = todayKey();
    const veille = yesterdayKey();
    const heure = new Date().getHours();
    const [vigilancesRes, objectifsRes, hikamRes, jourSnap, veilleSnap] = await Promise.all([
      fetch('/data/carnet/vigilances' + (EN ? '.en' : '') + '.json').then(r => r.json()),
      fetch('/data/carnet/objectifs' + (EN ? '.en' : '') + '.json').then(r => r.json()),
      fetch('/data/iskandari/hikam-complet.json').then(r => r.json()).catch(() => ({ records: [] })),
      getDoc(doc(db, 'carnets', anonId, 'jours', date)).catch(() => null),
      getDoc(doc(db, 'carnets', anonId, 'jours', veille)).catch(() => null)
    ]);
    const vigilances = vigilancesRes.vigilances || [];
    const objectifs = objectifsRes.objectifs || [];
    const jourData = jourSnap?.exists() ? jourSnap.data() : {};
    const matin = jourData.matin || {};
    const soir = jourData.soir || {};
    const aPose = !!matin.poseLe;
    const aDepose = !!soir.fermeLe;

    // Veille posée mais jamais déposée → on proposera de la relire
    const veilleData = veilleSnap?.exists() ? veilleSnap.data() : {};
    const veilleAPose = !!(veilleData.matin && veilleData.matin.poseLe);
    const veilleADepose = !!(veilleData.soir && veilleData.soir.fermeLe);
    const veilleAcompleter = veilleAPose && !veilleADepose;

    try {
      await setDoc(doc(db, 'carnets', anonId, '_meta', 'profil'), {
        prenom: prenom || null,
        lastSeen: serverTimestamp()
      }, { merge: true });
    } catch (e) {}

    const g = greetingByHour(heure);
    const greeting = prenom ? `${g} <em>${esc(prenom)}</em>,` : `${g},`;

    // === Rythme hebdomadaire : inviter au miroir tous les 7 jours ===
    // Commence après une semaine de présence, se réinitialise à chaque visite.
    const MS_DAY = 86400000;
    let carnetStart = +(localStorage.getItem('lvdd_carnet_start') || 0);
    if (!carnetStart) { carnetStart = Date.now(); try { localStorage.setItem('lvdd_carnet_start', String(carnetStart)); } catch (e) {} }
    const miroirVu = +(localStorage.getItem('lvdd_miroir_vu') || 0);
    const joursDepuisDebut = (Date.now() - carnetStart) / MS_DAY;
    const joursDepuisMiroir = miroirVu ? (Date.now() - miroirVu) / MS_DAY : Infinity;
    const inviteMiroir = joursDepuisDebut >= 7 && joursDepuisMiroir >= 7;

    // === LE SEUIL DU JOUR : une sagesse à méditer, avant toute demande ===
    // L'accueil donne avant de demander. Une Ḥikma d'Iskandari, stable sur
    // la journée (elle change chaque jour), comme une lumière à porter.
    function renderSeuilDuJour() {
      const recs = (hikamRes && hikamRes.records) || [];
      if (!recs.length) return '';
      // Index déterministe par jour (même sagesse toute la journée)
      const dayNum = Math.floor(new Date(date + 'T00:00:00').getTime() / 86400000);
      const r = recs[((dayNum % recs.length) + recs.length) % recs.length];
      if (!r) return '';
      const texte = EN
        ? (r.english_text_draft || r.french_translation || '')
        : (r.french_translation || r.english_text_draft || '');
      if (!texte) return '';
      const lien = EN ? '/pages/iskandari/hikma/' : '/pages/iskandari/hikma/';
      return `
        <section class="dash-seuil">
          <span class="dash-seuil__label">${t("Le seuil du jour","The day's threshold")}</span>
          <div class="dash-seuil__orn">✦</div>
          <p class="dash-seuil__texte">« ${esc(texte)} »</p>
          <p class="dash-seuil__source">${t("Ḥikma n°","Ḥikma no.")} ${esc(r.id)} · Ibn ʿAṭāʾ Allāh al-Iskandarī</p>
          <a href="${lien}?id=${esc(r.id)}" class="dash-seuil__lien">${t("Méditer cette sagesse","Meditate this wisdom")} →</a>
        </section>`;
    }

    // === SECTION 1 : « Aujourd'hui » ===
    function renderSection1() {
      // Cas 1 : journée déposée
      if (aDepose) {
        const v = vigilances.find(x => x.id === matin.vigilanceId);
        return `
          <section class="dash-aujourd-hui dash-aujourd-hui--depose">
            <p class="dash-aujourd-hui__label">${t("Aujourd'hui · journée déposée","Today · day kept")}</p>
            <p class="dash-aujourd-hui__msg"><em>${t("Le jour est gardé. Que la nuit soit douce.","The day is kept. May the night be gentle.")}</em></p>
            ${v ? `<p class="dash-aujourd-hui__resume"><span lang="ar" dir="rtl" style="font-family:'Amiri',serif; color:var(--adab-gold-deep);">${esc(v.ar)}</span> · ${esc(v.label)}</p>` : ''}
            <div class="dash-actions">
              <a href="${BASE}historique/?j=${date}" class="adab-bouton adab-bouton--ghost">${t("Voir ma journée","See my day")}</a>
            </div>
          </section>`;
      }
      // Cas 2 : matin posé, soir non
      if (aPose) {
        const v = vigilances.find(x => x.id === matin.vigilanceId);
        const objsChoisis = (matin.objectifsIds || []).map(id => objectifs.find(o => o.id === id)).filter(Boolean);
        const objsHTML = objsChoisis.map(o => `<li class="resume-obj">${esc(o.matin.libelle)}</li>`).join('');
        const persoHTML = matin.personnel ? `<li class="resume-obj resume-obj--perso">${esc(matin.personnel)}</li>` : '';
        const ctaSoir = heure >= 17
          ? `<a href="${BASE}relire/" class="adab-bouton adab-bouton--grand">${t("Relire ma journée","Look back on my day")}</a>`
          : `<a href="${BASE}relire/" class="adab-bouton adab-bouton--ghost">${t("Faire une halte","Pause on the path")}</a>`;
        return `
          <section class="dash-aujourd-hui dash-aujourd-hui--pose">
            <p class="dash-aujourd-hui__label">${t("Ce que j'ai posé ce matin","What I set this morning")}</p>
            ${v ? `
              <div class="dash-vigilance">
                <span class="dash-vigilance__ar" lang="ar" dir="rtl">${esc(v.ar)}</span>
                <h3 class="dash-vigilance__titre">${esc(v.label)}</h3>
              </div>` : ''}
            ${(objsHTML || persoHTML) ? `<ul class="dash-objs">${objsHTML}${persoHTML}</ul>` : ''}
            ${matin.ancrage ? `<p class="dash-ancrage"><em>« ${esc(matin.ancrage)} »</em></p>` : ''}
            <div class="dash-actions">
              ${ctaSoir}
              <a href="${BASE}poser/" class="adab-bouton-secondaire">${t("Modifier mon choix","Change my choice")}</a>
            </div>
          </section>`;
      }
      // Cas 3 : rien posé → les deux portes toujours offertes.
      // L'heure ne fait que suggérer laquelle est mise en avant.
      const soirVenu = heure >= 17;
      const porteMatinClass = soirVenu ? 'dash-porte--soft' : 'dash-porte--grand';
      const porteSoirClass  = soirVenu ? 'dash-porte--grand' : 'dash-porte--soft';
      return `
        <section class="dash-aujourd-hui dash-aujourd-hui--vide">
          <p class="dash-aujourd-hui__label">${t("Aujourd'hui","Today")}</p>
          <p class="dash-aujourd-hui__msg dash-aujourd-hui__msg--invite">
            <em>${t("Que voulez-vous faire ? À vous de choisir le moment.","What would you like to do? The moment is yours to choose.")}</em>
          </p>
          <div class="dash-portes">
            <a href="${BASE}poser/" class="dash-porte ${porteMatinClass}">
              <span class="dash-porte__moment">${t("Le matin","Morning")}</span>
              <span class="dash-porte__titre">${t("Poser ma journée","Set my day")}</span>
              <span class="dash-porte__sous"><em>${t("Un thème, un objectif. Petit, c'est suffisant.","One theme, one objective. Small is enough.")}</em></span>
            </a>
            <a href="${BASE}relire/" class="dash-porte ${porteSoirClass}">
              <span class="dash-porte__moment">${t("Le soir","Evening")}</span>
              <span class="dash-porte__titre">${t("Relire ma journée","Look back on my day")}</span>
              <span class="dash-porte__sous"><em>${t("Regarder doucement comment a été le jour.","Look gently at how the day has been.")}</em></span>
            </a>
          </div>
        </section>`;
    }

    // === Rappel de la veille à compléter (doux, déclinable) ===
    function renderRappelVeille() {
      if (!veilleAcompleter) return '';
      const v = vigilances.find(x => x.id === veilleData.matin.vigilanceId);
      return `
        <section class="dash-veille" id="dash-veille">
          <button type="button" class="dash-veille__fermer" id="dash-veille-fermer" aria-label="Plus tard">×</button>
          <p class="dash-veille__label">${t('Yesterday','Yesterday')} · ${esc(veilleLisible())}</p>
          <p class="dash-veille__msg">
            <em>${t('You had set','You had set')} ${v ? `${t('the vigilance of','the vigilance of')} <strong>${esc(v.label)}</strong>` : t('your day','your day')}, ${t("but did not lay it down.","but did not lay it down.")}</em>
          </p>
          <div class="dash-veille__actions">
            <a href="${BASE}relire/?j=${esc(veille)}" class="adab-bouton adab-bouton--ghost">${t("Relire hier","Look back on yesterday")}</a>
            <button type="button" class="dash-veille__plus-tard" id="dash-veille-plus-tard">${t('Later','Later')}</button>
          </div>
        </section>`;
    }

    // === SECTION 2 : Les 10 vigilances toujours visibles ===
    function renderSection2() {
      const cards = vigilances.map(v => {
        const isCurrente = aPose && matin.vigilanceId === v.id;
        return `
          <a href="${BASE}poser/?vigilance=${esc(v.id)}" class="dash-vig-carte ${isCurrente ? 'is-current' : ''}">
            ${isCurrente ? `<span class="dash-vig-carte__current-tag">${t("aujourd'hui","today")}</span>` : ''}
            <span class="dash-vig-carte__ar" lang="ar" dir="rtl">${esc(v.ar)}</span>
            <span class="dash-vig-carte__tr">${esc(v.tr)}</span>
            <span class="dash-vig-carte__label">${esc(v.label)}</span>
          </a>`;
      }).join('');
      const titre = aPose
        ? t("Explorer les vigilances et leurs enseignements","Explore the vigilances and their teachings")
        : t("Choisissez une vigilance pour aujourd'hui","Choose a vigilance for today");
      const sub = aPose
        ? t("Vous pouvez en lire une autre — ou changer pour celle-là.","You may read another — or switch to it.")
        : t("Cliquez pour découvrir l'enseignement, le verset, le Nom divin qui l'accompagne.","Tap to discover the teaching, the verse, and the divine Name that accompanies it.");
      return `
        <section class="dash-vigilances">
          <header class="dash-vigilances__head">
            <h2 class="dash-vigilances__titre">${esc(titre)}</h2>
            <p class="dash-vigilances__sub"><em>${esc(sub)}</em></p>
          </header>
          <div class="dash-vig-grille">${cards}</div>
        </section>`;
    }

    // === SECTION 3 : Liens du bas ===
    function renderSection3() {
      return `
        <section class="dash-bas">
          <button type="button" class="dash-souffle-cta" id="ouvrir-souffle">
            <span class="dash-souffle-cta__cercle"></span>
            <span class="dash-souffle-cta__txt">${t("Trois respirations","Three breaths")}</span>
            <span class="dash-souffle-cta__sous"><em>${t("un instant de présence","a moment of presence")}</em></span>
          </button>
          <div class="dash-ornement">✦</div>
          ${inviteMiroir ? `
            <a href="${BASE}miroir/" class="dash-invite-miroir">
              <span class="dash-invite-miroir__txt">${t("Sept jours ont passé.","Seven days have passed.")}</span>
              <span class="dash-invite-miroir__cta">${t("Veux-tu regarder le miroir ?","Would you like to look at the mirror?")} →</span>
            </a>` : `
            <p class="dash-liens">
              <a href="${BASE}miroir/">${t("Le miroir du chemin →","The mirror of the path →")}</a>
            </p>`}
          <p class="dash-liens">
            <a href="${BASE}historique/">${t("Mes journées passées →","My past days →")}</a>
          </p>
          <p class="dash-liens dash-liens--soft">
            <a href="/index.html">${t("Sortir du carnet","Leave the notebook")}</a>
          </p>
        </section>`;
    }

    mount.innerHTML = `
      <section class="dash">
        <h1 class="dash__hello">${greeting}</h1>
        ${renderSeuilDuJour()}
        ${renderRappelVeille()}
        ${renderSection1()}
        ${renderSection2()}
        ${renderSection3()}
      </section>
    `;

    // Listeners du rappel veille (déclinable)
    const veilleEl = document.getElementById('dash-veille');
    const fermerVeille = () => { if (veilleEl) veilleEl.style.display = 'none'; };
    document.getElementById('dash-veille-fermer')?.addEventListener('click', fermerVeille);
    document.getElementById('dash-veille-plus-tard')?.addEventListener('click', fermerVeille);

    // L'ancre du souffle — trois respirations guidées
    document.getElementById('ouvrir-souffle')?.addEventListener('click', ouvrirSouffle);

    function ouvrirSouffle() {
      const ov = document.createElement('div');
      ov.className = 'souffle-overlay';
      ov.innerHTML = `
        <button type="button" class="souffle-close" aria-label="${t('Fermer','Close')}">×</button>
        <div class="souffle-scene">
          <div class="souffle-cercle"><span class="souffle-compte"></span></div>
          <p class="souffle-phase"></p>
        </div>`;
      document.body.appendChild(ov);
      requestAnimationFrame(() => ov.classList.add('is-on'));

      const cercle = ov.querySelector('.souffle-cercle');
      const phaseEl = ov.querySelector('.souffle-phase');
      const compteEl = ov.querySelector('.souffle-compte');
      let timer;
      const close = () => { clearTimeout(timer); ov.classList.remove('is-on'); setTimeout(() => ov.remove(), 600); };
      ov.querySelector('.souffle-close').addEventListener('click', close);
      ov.addEventListener('click', e => { if (e.target === ov) close(); });

      const IN = 4000, OUT = 6000, BREATHS = 3;
      let i = 0;
      function inhale() {
        if (i >= BREATHS) return finish();
        i++;
        compteEl.textContent = `${i} / ${BREATHS}`;
        phaseEl.textContent = t('Inspirez…', 'Breathe in…');
        cercle.style.transitionDuration = IN + 'ms';
        cercle.classList.add('is-big');
        timer = setTimeout(exhale, IN);
      }
      function exhale() {
        phaseEl.textContent = t('Expirez…', 'Breathe out…');
        cercle.style.transitionDuration = OUT + 'ms';
        cercle.classList.remove('is-big');
        timer = setTimeout(inhale, OUT);
      }
      function finish() {
        cercle.classList.add('is-done');
        compteEl.textContent = '✦';
        phaseEl.textContent = t('Revenez doucement.', 'Return gently.');
        timer = setTimeout(close, 3500);
      }
      timer = setTimeout(inhale, 700);
    }
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<p style="text-align:center; color:#c44; padding:3rem;">${t("Désolé, le carnet n'a pas pu être chargé.","Sorry, the notebook could not be loaded.")}</p>`;
  }
})();
