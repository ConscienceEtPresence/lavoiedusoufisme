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
    const [vigilancesRes, objectifsRes, jourSnap, veilleSnap] = await Promise.all([
      fetch('/data/carnet/vigilances' + (EN ? '.en' : '') + '.json').then(r => r.json()),
      fetch('/data/carnet/objectifs' + (EN ? '.en' : '') + '.json').then(r => r.json()),
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
          : `<a href="${BASE}relire/" class="adab-bouton adab-bouton--ghost">${t("Relire en avance","Look back early")}</a>`;
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
          <div class="dash-ornement">✦</div>
          <p class="dash-liens">
            <a href="${BASE}miroir/">${t("Le miroir du chemin →","The mirror of the path →")}</a>
          </p>
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
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<p style="text-align:center; color:#c44; padding:3rem;">${t("Désolé, le carnet n'a pas pu être chargé.","Sorry, the notebook could not be loaded.")}</p>`;
  }
})();
