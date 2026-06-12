/* ============================================================
   Le carnet d'adab — Recueillir un instant
   Un geste court, en pleine journée : quelque chose s'est
   présenté (une scène, une parole, une épreuve traversée) qui
   touche une vigilance — même non programmée le matin.
   On le recueille tel quel. Il rejoindra le bilan du soir
   et le miroir du chemin.
   ============================================================ */
import { db } from './firebase-init.js';
import { doc, setDoc, getDoc, serverTimestamp, arrayUnion }
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

const mount = document.getElementById('recueillir-mount');
const dateEl = document.getElementById('adab-date');

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function dateLisible() {
  return new Date().toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
}
function heureLisible(ms) {
  return new Date(ms).toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit' });
}
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const date = todayKey();
dateEl.textContent = dateLisible();

// Les trois manières d'avoir traversé l'instant — fidèle à l'esprit
// du carnet : on nomme, on ne note pas. Ni réussite ni échec : un état.
const STATUTS = [
  { id: 'vecu',      fr: 'Je l\'ai habité',      en: 'I inhabited it',     hint_fr: 'présent, à la hauteur de l\'instant', hint_en: 'present, equal to the moment' },
  { id: 'traverse',  fr: 'Cela m\'a traversé',   en: 'It moved through me', hint_fr: 'reçu, accueilli sans le choisir',     hint_en: 'received, welcomed unchosen' },
  { id: 'manque',    fr: 'Je l\'ai manqué',      en: 'I missed it',         hint_fr: 'laissé passer — sans reproche',       hint_en: 'let it slip — without reproach' },
];

(async () => {
  try {
    const [vigilancesRes, objectifsRes, jourSnap] = await Promise.all([
      fetch('/data/carnet/vigilances' + (EN ? '.en' : '') + '.json').then(r => r.json()),
      fetch('/data/carnet/objectifs' + (EN ? '.en' : '') + '.json').then(r => r.json()).catch(() => ({})),
      getDoc(doc(db, 'carnets', anonId, 'jours', date)).catch(() => null)
    ]);
    const vigilances = vigilancesRes.vigilances || [];
    const vigById = {};
    for (const v of vigilances) vigById[v.id] = v;
    // Déclinaisons : les objectifs concrets de chaque vigilance
    const objectifs = objectifsRes.objectifs || [];
    const objById = {};
    const objsByVig = {};
    for (const o of objectifs) {
      objById[o.id] = o;
      (objsByVig[o.vigilance] = objsByVig[o.vigilance] || []).push(o);
    }
    const objLibelle = id => objById[id]?.matin?.libelle || '';

    const jourData = jourSnap?.exists() ? jourSnap.data() : {};
    const matin = jourData.matin || {};
    // Les vigilances déjà posées ce matin (pour les mettre en avant)
    const vigsPosees = (matin.objectifs && matin.objectifs.length)
      ? [...new Set(matin.objectifs.map(o => o.vigilance).filter(Boolean))]
      : (matin.vigilanceId ? [matin.vigilanceId] : []);
    const recueilsExistants = Array.isArray(jourData.recueils) ? jourData.recueils.slice() : [];

    // État de la saisie en cours (une à plusieurs vigilances par instant)
    const state = { texte: '', vigilanceIds: [], objectifsIds: [], statut: '', apprentissage: '' };

    // Un instant peut avoir été enregistré avec une seule vigilance (ancien
    // modèle) ou plusieurs. On normalise toujours en tableau.
    function vigsDe(r) {
      if (Array.isArray(r.vigilanceIds) && r.vigilanceIds.length) return r.vigilanceIds;
      return r.vigilanceId ? [r.vigilanceId] : [];
    }

    function renderRecueilsDuJour() {
      if (!recueilsExistants.length) return '';
      const items = recueilsExistants
        .slice()
        .sort((a, b) => (a.le || 0) - (b.le || 0))
        .map(r => {
          const vs = vigsDe(r).map(id => vigById[id]).filter(Boolean);
          const st = STATUTS.find(s => s.id === r.statut);
          const precis = (r.objectifsIds || []).map(objLibelle).filter(Boolean);
          return `
            <li class="recueil-jour__item">
              ${vs.map(v => `<span class="recueil-jour__theme">${esc(v.label)}</span>`).join('')}
              <p class="recueil-jour__texte">${esc(r.texte)}</p>
              ${precis.length ? `<p class="recueil-jour__precis">${precis.map(p => `<span>↳ ${esc(p)}</span>`).join('')}</p>` : ''}
              <p class="recueil-jour__meta">
                ${st ? `<span class="recueil-jour__statut">${t(st.fr, st.en)}</span>` : ''}
                ${r.le ? `<span class="recueil-jour__heure">${esc(heureLisible(r.le))}</span>` : ''}
              </p>
              ${r.apprentissage ? `<p class="recueil-jour__appr"><em>« ${esc(r.apprentissage)} »</em></p>` : ''}
            </li>`;
        }).join('');
      return `
        <section class="recueil-jour">
          <p class="recueil-jour__label">${t("Déjà recueilli aujourd'hui","Already gathered today")}</p>
          <ul class="recueil-jour__liste">${items}</ul>
        </section>`;
    }

    function renderForm() {
      // Vigilances : les posées ce matin d'abord, en surbrillance douce
      const cartes = vigilances
        .slice()
        .sort((a, b) => (vigsPosees.includes(b.id) ? 1 : 0) - (vigsPosees.includes(a.id) ? 1 : 0))
        .map(v => {
          const posee = vigsPosees.includes(v.id);
          const sel = state.vigilanceIds.includes(v.id);
          return `
            <button type="button" class="recueil-vig ${sel ? 'is-selected' : ''} ${posee ? 'is-posee' : ''}" data-id="${esc(v.id)}">
              <span class="recueil-vig__ar" lang="ar" dir="rtl">${esc(v.ar)}</span>
              <span class="recueil-vig__label">${esc(v.label)}</span>
              ${posee ? `<span class="recueil-vig__tag">${t("posée","set")}</span>` : ''}
            </button>`;
        }).join('');

      const statutBtns = STATUTS.map(s => `
        <button type="button" class="recueil-statut ${state.statut === s.id ? 'is-active' : ''}" data-id="${esc(s.id)}">
          <span class="recueil-statut__nom">${t(s.fr, s.en)}</span>
          <span class="recueil-statut__hint"><em>${t(s.hint_fr, s.hint_en)}</em></span>
        </button>`).join('');

      mount.innerHTML = `
        <section class="adab-step recueil">
          <header class="recueil__head">
            <div class="recueil__orn"><img src="/assets/img/ornements/seuil.svg" alt="" class="orn-seuil" loading="lazy"/></div>
            <h1 class="recueil__titre">${t("Quelque chose s'est présenté","Something came up")}</h1>
            <p class="recueil__sous"><em>${t("Un instant que la journée vous a tendu — même sans l'avoir prévu. Recueillez-le tel quel.","A moment the day handed you — even unplanned. Gather it as it is.")}</em></p>
          </header>

          <label class="recueil-champ">
            <span class="recueil-champ__label">${t("Qu'est-ce qui vient de se passer ?","What just happened?")}</span>
            <textarea id="recueil-texte" rows="3" maxlength="700"
                      placeholder="${t("une scène, une parole, ce que vous avez fait ou ressenti…","a scene, a word, what you did or felt…")}">${esc(state.texte)}</textarea>
          </label>

          <div class="recueil-bloc">
            <p class="recueil-bloc__label">${t("Cela touchait quelle vigilance ?","Which vigilance did it touch?")}</p>
            <p class="recueil-bloc__hint"><em>${t("celle que vous portiez aujourd'hui, ou une autre — vous pouvez en choisir plusieurs, ou aucune.","the one you carried today, or another — you may choose several, or none.")}</em></p>
            <div class="recueil-vig-grille">${cartes}</div>
            <div class="recueil-precis" id="recueil-precis"></div>
          </div>

          <div class="recueil-bloc">
            <p class="recueil-bloc__label">${t("Comment l'avez-vous traversé ?","How did you move through it?")}</p>
            <div class="recueil-statuts">${statutBtns}</div>
          </div>

          <details class="adab-detail-bloc recueil-appr">
            <summary>
              <span class="adab-section-titre adab-section-titre--soft" style="margin:0; cursor:pointer;">${t("Ce que cela m'apprend","What it teaches me")} <em>${t("(facultatif)","(optional)")}</em></span>
            </summary>
            <label class="recueil-champ">
              <textarea id="recueil-appr" rows="2" maxlength="400"
                        placeholder="${t("une phrase, si elle vient — ou rien","a sentence, if it comes — or nothing")}">${esc(state.apprentissage)}</textarea>
            </label>
          </details>

          <div class="adab-commit">
            <button type="button" class="adab-bouton" id="recueil-commit" disabled>${t("Recueillir cet instant","Gather this moment")}</button>
            <a href="${BASE}aujourdhui/" class="adab-bouton-secondaire" style="margin-top:.6rem;">${t("Revenir au carnet","Back to the notebook")}</a>
          </div>
        </section>

        ${renderRecueilsDuJour()}
      `;

      const texteEl = document.getElementById('recueil-texte');
      const apprEl = document.getElementById('recueil-appr');
      const commitBtn = document.getElementById('recueil-commit');

      function majCommit() {
        commitBtn.disabled = !(state.texte.trim());
      }

      texteEl.addEventListener('input', () => { state.texte = texteEl.value; majCommit(); });
      apprEl.addEventListener('input', () => { state.apprentissage = apprEl.value; });

      // Déplie les déclinaisons concrètes des vigilances choisies (facultatif).
      // Quand on coche « patience », on peut préciser « accepter un délai… ».
      function renderPrecis() {
        const cont = document.getElementById('recueil-precis');
        if (!cont) return;
        if (!state.vigilanceIds.length) { cont.innerHTML = ''; return; }
        const blocs = state.vigilanceIds.map(vid => {
          const v = vigById[vid];
          const objs = objsByVig[vid] || [];
          if (!v || !objs.length) return '';
          const chips = objs.map(o => {
            const sel = state.objectifsIds.includes(o.id);
            return `<button type="button" class="recueil-precis__chip ${sel ? 'is-selected' : ''}" data-obj="${esc(o.id)}">${esc(o.matin.libelle)}</button>`;
          }).join('');
          return `
            <div class="recueil-precis__bloc">
              <p class="recueil-precis__titre">${t("Dans","Within")} <strong>${esc(v.label.toLowerCase())}</strong>, ${t("plus précisément ?","more precisely?")} <em>${t("(facultatif)","(optional)")}</em></p>
              <div class="recueil-precis__chips">${chips}</div>
            </div>`;
        }).join('');
        cont.innerHTML = blocs;
        cont.querySelectorAll('.recueil-precis__chip').forEach(chip => {
          chip.addEventListener('click', () => {
            const oid = chip.dataset.obj;
            if (state.objectifsIds.includes(oid)) {
              state.objectifsIds = state.objectifsIds.filter(x => x !== oid);
            } else {
              state.objectifsIds.push(oid);
            }
            chip.classList.toggle('is-selected', state.objectifsIds.includes(oid));
          });
        });
      }

      mount.querySelectorAll('.recueil-vig').forEach(btn => {
        btn.addEventListener('click', () => {
          // Sélection multiple : on bascule chaque vigilance (toutes facultatives)
          const id = btn.dataset.id;
          if (state.vigilanceIds.includes(id)) {
            state.vigilanceIds = state.vigilanceIds.filter(x => x !== id);
            // On retire les déclinaisons de cette vigilance déselectionnée
            const ids = (objsByVig[id] || []).map(o => o.id);
            state.objectifsIds = state.objectifsIds.filter(x => !ids.includes(x));
          } else {
            state.vigilanceIds.push(id);
          }
          btn.classList.toggle('is-selected', state.vigilanceIds.includes(id));
          renderPrecis();
        });
      });

      mount.querySelectorAll('.recueil-statut').forEach(btn => {
        btn.addEventListener('click', () => {
          state.statut = (state.statut === btn.dataset.id) ? '' : btn.dataset.id;
          mount.querySelectorAll('.recueil-statut').forEach(b =>
            b.classList.toggle('is-active', b.dataset.id === state.statut));
        });
      });

      commitBtn.addEventListener('click', async () => {
        const texte = state.texte.trim();
        if (!texte) return;
        commitBtn.disabled = true;
        commitBtn.textContent = t('Un instant…', 'One moment…');
        try {
          const recueil = {
            texte,
            vigilanceIds: state.vigilanceIds.slice(),
            vigilanceId: state.vigilanceIds[0] || null,   // compat lecteurs simples
            objectifsIds: state.objectifsIds.slice(),     // déclinaisons précisées
            statut: state.statut || null,
            apprentissage: (state.apprentissage || '').trim() || null,
            le: Date.now()   // horodatage client (serverTimestamp interdit dans un tableau)
          };
          await setDoc(doc(db, 'carnets', anonId, 'jours', date), {
            langue: EN ? 'en' : 'fr',
            recueils: arrayUnion(recueil)
          }, { merge: true });
          try {
            await setDoc(doc(db, 'carnets', anonId, '_meta', 'profil'), { prenom: prenom || null, lastSeen: serverTimestamp() }, { merge: true });
            await setDoc(doc(db, 'carnets', anonId), { prenom: prenom || null, lastSeen: serverTimestamp() }, { merge: true });
          } catch (e) {}
          renderMerci(recueil);
        } catch (e) {
          console.error(e);
          alert(t("Désolé, la sauvegarde n'a pas pu se faire.", "Sorry, saving failed."));
          commitBtn.disabled = false;
          commitBtn.textContent = t("Recueillir cet instant", "Gather this moment");
        }
      });
    }

    function renderMerci(recueil) {
      const vs = vigsDe(recueil).map(id => vigById[id]).filter(Boolean);
      const noms = vs.map(v => v.label.toLowerCase());
      const joint = noms.length === 0 ? '' :
        noms.length === 1 ? noms[0] :
        noms.slice(0, -1).join(', ') + (EN ? ' and ' : ' et ') + noms[noms.length - 1];
      recueilsExistants.push(recueil);
      mount.innerHTML = `
        <section class="adab-step recueil-merci">
          <div class="recueil-merci__orn">✦</div>
          <h1 class="recueil-merci__titre">${t("C'est recueilli.","It is gathered.")}</h1>
          <p class="recueil-merci__texte">${t("Cet instant ne se perdra pas.","This moment will not be lost.")}
            ${joint ? t("Il rejoint","It joins") + ` <strong>${esc(joint)}</strong> ` + t("dans votre miroir,","in your mirror,") : ''}
            ${t("et reviendra ce soir, quand vous déposerez le jour.","and will return this evening, when you lay the day down.")}</p>
          <blockquote class="recueil-merci__sagesse">
            <p>« ${t("Ce que la vie te présente sans que tu l'aies choisi est souvent l'exercice que ton âme attendait.","What life presents you, unchosen, is often the very exercise your soul awaited.")} »</p>
          </blockquote>
          <div class="adab-pose-actions" style="margin-top:1.4rem;">
            <button type="button" class="adab-bouton-secondaire" id="recueil-encore">${t("Recueillir un autre instant","Gather another moment")}</button>
            <a href="${BASE}aujourdhui/" class="adab-bouton">${t("Revenir au carnet","Back to the notebook")}</a>
          </div>
        </section>`;
      document.getElementById('recueil-encore')?.addEventListener('click', () => {
        state.texte = ''; state.vigilanceIds = []; state.objectifsIds = []; state.statut = ''; state.apprentissage = '';
        renderForm();
        window.scrollTo({ top: 0, behavior: 'instant' });
      });
    }

    renderForm();
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<p style="text-align:center; color:#c44; padding:3rem;">${t("Désolé, le carnet n'a pas pu être chargé.","Sorry, the notebook could not be loaded.")}</p>`;
  }
})();
