/* ============================================================
   Le carnet d'adab — ${t("Le miroir du chemin","The mirror of the path")} (muḥāsaba)
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
  return arr.slice(0, -1).join(', ') + (EN ? ' and ' : ' et ') + arr[arr.length - 1];
}

dateEl.textContent = t('le miroir','the mirror');
// Marqueur : on a regardé le miroir aujourd'hui (réinitialise l'invitation hebdo)
try { localStorage.setItem('lvdd_miroir_vu', String(Date.now())); } catch (e) {}

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
            <h1 class="miroir__titre">${t("Encore vierge","Still blank")}</h1>
            <div class="miroir__rule"></div>
          </header>
          <p class="miroir__vide"><em>${t("Le miroir est encore vide. Il se remplira tout seul, un jour posé après l'autre — sans que vous ayez à compter quoi que ce soit.","The mirror is still empty. It will fill on its own, one set day after another — without you having to count anything.")}</em></p>
          <div class="miroir__actions">
            <a href="${BASE}poser/" class="adab-bouton adab-bouton--grand">${t("Poser ma première journée","Set my first day")}</a>
          </div>
        </section>`;
      return;
    }

    const nbJours = jours.length;
    const nbDeposes = jours.filter(j => j.soir && j.soir.fermeLe).length;
    const premier = jours[0].key;
    const dernier = jours[jours.length - 1].key;

    // === Fréquence des vigilances (vers quoi le cœur est revenu) ===
    // Une journée multi-thèmes compte chaque vigilance réellement portée.
    // Compat : anciennes journées = la seule vigilanceId.
    const compteVig = {};
    for (const j of jours) {
      const m = j.matin || {};
      const vigsJ = (m.objectifs && m.objectifs.length)
        ? [...new Set(m.objectifs.map(o => o.vigilance).filter(Boolean))]
        : (m.vigilanceId ? [m.vigilanceId] : []);
      for (const vid of vigsJ) compteVig[vid] = (compteVig[vid] || 0) + 1;
    }
    // Ordonne les 10 vigilances par présence décroissante
    const vigOrdonnees = vigilances
      .map(v => ({ v, n: compteVig[v.id] || 0 }))
      .sort((a, b) => b.n - a.n);
    const maxN = vigOrdonnees[0]?.n || 1;
    const visitees = vigOrdonnees.filter(x => x.n > 0);
    const jamais = vigOrdonnees.filter(x => x.n === 0).map(x => x.v.label.toLowerCase());

    // === La direction qui se dessine — nommer le mouvement intérieur ===
    // Non un verdict : un reflet doux de ce que l'âme travaille à travers
    // la vigilance vers laquelle on revient le plus.
    const DIRECTIONS = {
      parole:     { fr: "quelque chose en vous apprend à faire de la parole un acte juste — parler moins, et plus vrai.", en: "something in you is learning to make speech a just act — to speak less, and truer." },
      ecoute:     { fr: "quelque chose en vous s'ouvre à l'autre — vous apprenez à accueillir avant de répondre.", en: "something in you is opening to the other — you are learning to welcome before answering." },
      presence:   { fr: "quelque chose en vous revient au présent — vous apprenez à habiter l'instant plutôt qu'à le fuir.", en: "something in you is returning to the present — you are learning to inhabit the moment rather than flee it." },
      patience:   { fr: "quelque chose en vous travaille la maîtrise du temps — vous apprenez à endurer sans vous durcir.", en: "something in you is working on the mastery of time — you are learning to endure without hardening." },
      reparation: { fr: "quelque chose en vous apprend à revenir — à réparer plutôt qu'à se figer dans la chute.", en: "something in you is learning to return — to repair rather than freeze in the fall." },
      gratitude:  { fr: "quelque chose en vous apprend à voir le don — à recevoir avant de manquer.", en: "something in you is learning to see the gift — to receive before lacking." },
      coeur:      { fr: "quelque chose en vous polit le cœur — vous apprenez à ne pas nourrir ce qui le voile.", en: "something in you is polishing the heart — you are learning not to feed what veils it." },
      service:    { fr: "quelque chose en vous se penche vers l'autre — vous apprenez à donner sans bruit.", en: "something in you is bending toward the other — you are learning to give without noise." },
      pratique:   { fr: "quelque chose en vous cherche le silence — vous apprenez à irriguer le dedans.", en: "something in you is seeking silence — you are learning to water the within." },
      corps:      { fr: "quelque chose en vous écoute le corps — vous apprenez à l'honorer comme un dépôt.", en: "something in you is listening to the body — you are learning to honour it as a trust." },
    };
    const dom = visitees[0];
    const directionTexte = (dom && dom.n >= 2 && nbJours >= 3 && DIRECTIONS[dom.v.id])
      ? (EN ? DIRECTIONS[dom.v.id].en : DIRECTIONS[dom.v.id].fr)
      : '';

    // === Narration douce ===
    const topNoms = visitees.slice(0, 2).map(x => `<strong>${esc(x.v.label.toLowerCase())}</strong>`);
    let recit = '';
    if (visitees.length === 1) {
      recit = EN ? `For now, your heart has settled only once — on ${topNoms[0]}.` : `Pour l'instant, votre cœur s'est posé une seule fois — sur ${topNoms[0]}.`;
    } else {
      recit = EN ? `Over these days, your heart mostly returned to ${joindreFr(topNoms)}.` : `Sur ces jours, votre cœur est surtout revenu à ${joindreFr(topNoms)}.`;
      const peu = visitees.slice(-1)[0];
      if (peu && peu.n === 1 && visitees.length >= 3) {
        recit += EN ? ` You visited ${esc(peu.v.label.toLowerCase())} only once.` : ` Vous n'avez visité ${esc(peu.v.label.toLowerCase())} qu'une fois.`;
      }
    }
    let recitManque = '';
    if (jamais.length && jamais.length <= 6) {
      recitManque = EN ? `Some vigilances still await you: ${joindreFr(jamais.map(esc))}. No hurry — they will come when their hour is here.` : `Certaines vigilances vous attendent encore : ${joindreFr(jamais.map(esc))}. Rien ne presse — elles viendront quand leur heure sera là.`;
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
            <span class="miroir-barre__n">${n} ${t('fois','times')}</span>
          </div>
          <div class="miroir-barre__piste">
            <div class="miroir-barre__remplie" style="width:${pct}%"></div>
          </div>
        </div>`;
    }).join('');

    // === Objectifs personnels récurrents (bloc optionnel) ===
    const persoHTML = persoRecurrents.length ? `
      <section class="miroir-bloc">
        <h2 class="miroir-bloc__titre">${t("Ce que vous vous êtes redit","What you told yourself again")}</h2>
        <p class="miroir-bloc__sous"><em>${t("Les mots que vous avez écrits plusieurs fois de vous-même.","The words you wrote of your own accord more than once.")}</em></p>
        <ul class="miroir-perso">
          ${persoRecurrents.map(([txt, n]) => `
            <li class="miroir-perso__item">
              <span class="miroir-perso__txt">« ${esc(txt)} »</span>
              <span class="miroir-perso__n">${n} ${t('fois','times')}</span>
            </li>`).join('')}
        </ul>
      </section>` : '';

    // === Rendu ===
    const intro = nbJours === 1
      ? t('1 journée posée','1 day set')
      : `${nbJours} ` + t('journées posées','days set');
    const span = premier === dernier
      ? t('le ','on ') + dateCourte(premier)
      : EN ? `from ${dateCourte(premier)} to ${dateCourte(dernier)}` : `du ${dateCourte(premier)} au ${dateCourte(dernier)}`;

    mount.innerHTML = `
      <section class="miroir">
        <header class="miroir__head">
          <p class="miroir__rubrique">Le miroir du chemin</p>
          <h1 class="miroir__titre">${prenom ? esc(prenom) + ', ' : ''}${t('ce qui vous travaille','what is working you')}</h1>
          <p class="miroir__compte">${intro} · ${span}</p>
          <div class="miroir__rule"></div>
        </header>

        <p class="miroir__recit">${recit}</p>
        ${recitManque ? `<p class="miroir__recit miroir__recit--soft"><em>${recitManque}</em></p>` : ''}

        ${directionTexte ? `
          <section class="miroir-direction">
            <span class="miroir-direction__label">${t("La direction qui se dessine","The direction taking shape")}</span>
            <p class="miroir-direction__texte">${t("Au fil de ces jours,","Over these days,")} ${esc(directionTexte)}</p>
          </section>` : ''}

        <section class="miroir-bloc">
          <h2 class="miroir-bloc__titre">${t("Vers quoi votre cœur est revenu","Where your heart has returned")}</h2>
          <p class="miroir-bloc__sous"><em>${t("Non pas ce que vous avez « réussi » — simplement là où vous vous êtes posé.","Not what you “succeeded” at — simply where you settled.")}</em></p>
          <div class="miroir-barres">${barres}</div>
        </section>

        ${persoHTML}

        <p class="miroir__sceau">
          <span class="miroir__sceau-orn">✦</span>
          <em>Pas de score, pas de note. Ce qui revient, c'est ce qui vous travaille.
          Ce qui manque, manque simplement.</em>
        </p>

        <div class="miroir__actions">
          <a href="${BASE}historique/" class="adab-bouton adab-bouton--ghost">${t("Voir les journées une à une","See the days one by one")}</a>
          <a href="${BASE}aujourdhui/" class="adab-bouton-secondaire">${t("Revenir au carnet","Back to the notebook")}</a>
        </div>
      </section>`;
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<p style="text-align:center; color:#c44; padding:3rem;">${t("Désolé, le miroir n'a pas pu être chargé.","Sorry, the mirror could not be loaded.")}</p>`;
  }
})();
