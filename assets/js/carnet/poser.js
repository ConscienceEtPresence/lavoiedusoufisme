/* ============================================================
   Le carnet d'adab — Poser ma journée (matin)
   Multi-étapes : 1) ancrage libre  2) choix de la vigilance
                  3) choix d'objectif  4) engagement
   ============================================================ */
import { db } from './firebase-init.js';
import { doc, setDoc, getDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const anonId = localStorage.getItem('lvdd_carnet_id') || (() => {
  const id = 'anon-' + Math.random().toString(36).slice(2, 10);
  localStorage.setItem('lvdd_carnet_id', id);
  return id;
})();
const prenom = localStorage.getItem('lvdd_carnet_prenom') || '';
const EN = document.documentElement.lang === 'en';
const BASE = EN ? '/en/pages/carnet/' : '/pages/carnet/';
const t = (fr, en) => (EN ? en : fr);
const LOCALE = EN ? 'en-US' : 'fr-FR';


const mount = document.getElementById('poser-mount');
const dateEl = document.getElementById('adab-date');

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function dateLisible() {
  return new Date().toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
}
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

dateEl.textContent = dateLisible();
const date = todayKey();

(async () => {
  try {
    const veille = yesterdayKey();
    const [vigilancesRes, objectifsRes, hikamRes, nomsLookup, jourSnap, veilleSnap] = await Promise.all([
      fetch('/data/carnet/vigilances' + (EN ? '.en' : '') + '.json').then(r => r.json()),
      fetch('/data/carnet/objectifs' + (EN ? '.en' : '') + '.json').then(r => r.json()),
      fetch('/data/iskandari/hikam-complet.json').then(r => r.json()),
      fetch('/data/carnet/noms-lookup.json').then(r => r.json()).catch(() => ({})),
      getDoc(doc(db, 'carnets', anonId, 'jours', date)).catch(() => null),
      getDoc(doc(db, 'carnets', anonId, 'jours', veille)).catch(() => null)
    ]);

    // Helper : trouve la glose d'un Nom divin à partir de son libellé "as-Salām (Celui...)"
    function nomGloss(label) {
      if (!label) return null;
      const key = String(label).split('(')[0].trim();
      return nomsLookup[key] || null;
    }

    const vigilances = vigilancesRes.vigilances || [];
    const objectifs = objectifsRes.objectifs || [];
    const hikamById = {};
    for (const r of (hikamRes.records || [])) hikamById[r.id] = r;

    const jourData = jourSnap?.exists() ? jourSnap.data() : {};
    const matin = jourData.matin || {};
    const dejaPose = !!matin.poseLe;

    // === Le pont soir → matin : ce qu'on voulait reprendre hier ===
    // (le « pour demain » écrit le soir + les objectifs marqués oublié / à reprendre)
    const veilleData = veilleSnap?.exists() ? veilleSnap.data() : {};
    const veilleMatin = veilleData.matin || {};
    const veilleSoir = veilleData.soir || {};
    const repriseTexte = (veilleSoir.repriseTexte || '').trim();
    const bilansHier = veilleSoir.bilansObjectifs || {};
    const objAreprendreIds = Object.keys(bilansHier)
      .filter(id => ['oublie', 'repris'].includes((bilansHier[id] || {}).statut));
    const objAreprendre = objAreprendreIds.map(id => objectifs.find(o => o.id === id)).filter(Boolean);
    // On ne propose la reprise que si la veille a été déposée, qu'on n'a pas
    // encore posé aujourd'hui, et qu'il y a vraiment quelque chose à reprendre.
    const aReprise = !!veilleSoir.fermeLe && !dejaPose && (repriseTexte || objAreprendre.length);

    // Etat de la page : 'accueil' / 'vigilance' / 'engage' / 'pose'
    // Si ?vigilance=ID dans l'URL, on saute direct à l'étape vigilance.
    const params = new URLSearchParams(location.search);
    const askedVigilance = params.get('vigilance');
    let initialEtape = dejaPose ? 'pose' : 'accueil';
    let initialVigId = matin.vigilanceId || '';
    if (askedVigilance && vigilances.find(v => v.id === askedVigilance)) {
      initialEtape = 'vigilance';
      initialVigId = askedVigilance;
      // Si l'utilisateur veut découvrir une AUTRE vigilance, on ne précoche pas
      // les objectifs de l'ancienne pour ne pas le perturber.
      const changeVigilance = matin.vigilanceId && matin.vigilanceId !== askedVigilance;
      // (note: state.objectifsIds reste vide dans ce cas, voir ci-dessous)
    }
    let state = {
      etape: initialEtape,
      ancrage: matin.ancrage || '',
      vigilanceId: initialVigId,
      objectifsIds: (askedVigilance && matin.vigilanceId !== askedVigilance) ? [] : (matin.objectifsIds || []),
      personnel: (askedVigilance && matin.vigilanceId !== askedVigilance) ? '' : (matin.personnel || ''),
    };

    function render() {
      if (state.etape === 'accueil') return renderAccueil();
      if (state.etape === 'vigilance') return renderVigilance();
      if (state.etape === 'pose') return renderPose();
    }

    function renderAccueil() {
      const greeting = prenom ? `${t("Bonjour","Hello")} <em>${esc(prenom)}</em>,` : `${t("Bonjour,","Hello,")}`;
      mount.innerHTML = `
        <section class="adab-step adab-step--accueil">
          <h1 class="adab-h1">${greeting}</h1>
          <p class="adab-intro">
            <em>${t("Sur quoi voulez-vous veiller aujourd'hui ?","What would you like to watch over today?")}</em>
          </p>

          ${aReprise ? `
            <div class="adab-reprise-hier">
              <span class="adab-reprise-hier__label">${t("Hier soir, vous vouliez reprendre","Yesterday evening, you wanted to take up again")}</span>
              ${repriseTexte ? `<p class="adab-reprise-hier__texte"><em>« ${esc(repriseTexte)} »</em></p>` : ''}
              ${objAreprendre.length ? `<ul class="adab-reprise-hier__objs">${objAreprendre.map(o => `<li>${esc(o.matin.libelle)}</li>`).join('')}</ul>` : ''}
              <button type="button" class="adab-bouton-secondaire adab-reprise-hier__cta" id="reprendre-hier">${t("Reprendre ce chemin aujourd'hui","Take up this path again today")}</button>
              <p class="adab-reprise-hier__hint"><em>${t("ou commencez librement ci-dessous","or begin freely below")}</em></p>
            </div>` : ''}

          <label class="adab-ancrage">
            <span class="adab-ancrage__label">${t("Aujourd'hui se joue surtout…","Today, what is mostly at play…")}</span>
            <input type="text" id="ancrage-input" class="adab-ancrage__input"
                   maxlength="120" placeholder="${t("un mot, une phrase, ce qui vous parle","a word, a phrase, whatever speaks to you")}"
                   value="${esc(state.ancrage)}"/>
            <span class="adab-ancrage__hint"><em>${t("facultatif — pour vous, comme une note","optional — for you, like a note")}</em></span>
          </label>

          <p class="adab-section-titre">${t("Choisissez une vigilance pour la journée","Choose a vigilance for the day")}</p>

          <div class="vigilances-grille">
            ${vigilances.map(v => `
              <button type="button" class="vigilance-carte" data-id="${esc(v.id)}">
                <span class="vigilance-carte__ar" lang="ar" dir="rtl">${esc(v.ar)}</span>
                <span class="vigilance-carte__tr">${esc(v.tr)}</span>
                <span class="vigilance-carte__label">${esc(v.label)}</span>
              </button>
            `).join('')}
          </div>

          <p class="adab-footnote"><em>${t("Une seule vigilance par jour. Petit, c'est suffisant.","One vigilance per day. Small is enough.")}</em></p>
        </section>
      `;
      // Reprise d'hier : pré-remplit la vigilance + les objectifs à reprendre
      document.getElementById('reprendre-hier')?.addEventListener('click', () => {
        state.ancrage = (document.getElementById('ancrage-input')?.value || '').trim();
        const vid = veilleMatin.vigilanceId
          || (objAreprendre[0] && objAreprendre[0].vigilance)
          || '';
        if (vid) {
          state.vigilanceId = vid;
          // ne garde que les objectifs à reprendre qui appartiennent à cette vigilance
          state.objectifsIds = objAreprendre.filter(o => o.vigilance === vid).map(o => o.id);
          state.etape = 'vigilance';
          render();
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      });

      // Listeners
      document.querySelectorAll('.vigilance-carte').forEach(btn => {
        btn.addEventListener('click', () => {
          state.ancrage = (document.getElementById('ancrage-input')?.value || '').trim();
          state.vigilanceId = btn.dataset.id;
          state.etape = 'vigilance';
          render();
          window.scrollTo({ top: 0, behavior: 'instant' });
        });
      });
    }

    function renderVigilance() {
      const v = vigilances.find(x => x.id === state.vigilanceId);
      if (!v) { state.etape = 'accueil'; render(); return; }
      const objs = objectifs.filter(o => o.vigilance === v.id);

      mount.innerHTML = `
        <section class="adab-step adab-step--vigilance">
          <button type="button" class="adab-back-link" id="back-accueil">${t("← Changer de vigilance","← Change vigilance")}</button>

          <header class="vigilance-fiche">
            <p class="vigilance-fiche__ar" lang="ar" dir="rtl">${esc(v.ar)}</p>
            <h1 class="vigilance-fiche__titre">${esc(v.label)}</h1>
            <p class="vigilance-fiche__tr">${esc(v.tr)} · ${v.termes_soufis.slice(0, 3).map(esc).join(' · ')}</p>
          </header>

          <details class="vigilance-formation" open>
            <summary><em>${t("Ce que c'est, chez les soufis","What it is, for the sufis")}</em></summary>
            <div class="vigilance-formation__body">
              <p class="vigilance-formation__def">${esc(v.definition_courte)}</p>
              <p class="vigilance-formation__ens">${esc(v.enseignement)}</p>
              <div class="vigilance-formation__parole">
                <span class="vigilance-formation__petit-label">${t("Une parole d'un maître","A word from a master")}</span>
                <p>${esc(v.parole_maitre)}</p>
              </div>
              <div class="vigilance-formation__verset">
                <span class="vigilance-formation__petit-label">${t("Coran · hadith","Qurʾān · hadith")}</span>
                <p>${esc(v.verset)}</p>
              </div>
              <div class="vigilance-formation__nom">
                <span class="vigilance-formation__petit-label">${t("Nom qui accompagne","Accompanying Name")}</span>
                ${v.nom_divin_ar ? `<span class="vigilance-formation__nom-ar" lang="ar" dir="rtl">${esc(v.nom_divin_ar)}</span>` : ''}
                <strong>${esc(v.nom_divin)}</strong>
                ${v.nom_divin_sens ? `<p class="nom-glose nom-glose--sens"><em>${esc(v.nom_divin_sens)}</em></p>` : ''}
                ${v.nom_divin_incarnation ? `<p class="nom-glose nom-glose--incarn">${esc(v.nom_divin_incarnation)}</p>` : ''}
              </div>
            </div>
          </details>

          <p class="adab-section-titre">${t("Un objectif concret pour aujourd'hui","A concrete objective for today")}</p>

          <div class="objectifs-liste">
            ${objs.map(o => {
              const isSel = state.objectifsIds.includes(o.id);
              return `
                <label class="objectif-carte ${isSel ? 'is-selected' : ''}" data-id="${esc(o.id)}">
                  <input type="checkbox" name="objectif" value="${esc(o.id)}" ${isSel ? 'checked' : ''}/>
                  <span class="objectif-carte__libelle">${esc(o.matin.libelle)}</span>
                </label>`;
            }).join('')}

            <label class="objectif-carte objectif-carte--libre">
              <span class="objectif-carte__libelle">${t("Ou écrire le mien :","Or write my own:")}</span>
              <input type="text" id="objectif-perso" class="objectif-carte__input"
                     maxlength="180" placeholder="${t('a personal objective on','a personal objective on')} ${esc(v.label.toLowerCase())}"
                     value="${esc(state.personnel)}"/>
            </label>
          </div>

          <p class="adab-section-titre adab-section-titre--soft">${t("Ce que vous prenez aujourd'hui","What you take on today")}</p>
          <div id="visage-matin-mount" class="visage-matin-mount"></div>

          <div class="adab-commit">
            <button type="button" class="adab-bouton" id="commit-pose" disabled>
              Je prends cela pour aujourd'hui
            </button>
          </div>
        </section>
      `;

      // Render visage matin des objectifs sélectionnés
      function renderVisages() {
        const mountV = document.getElementById('visage-matin-mount');
        const personnel = (document.getElementById('objectif-perso')?.value || '').trim();
        const ids = state.objectifsIds;
        const hasContent = ids.length || personnel;
        document.getElementById('commit-pose').disabled = !hasContent;
        if (!hasContent) {
          mountV.innerHTML = `<p class="visage-vide"><em>${t("Cochez au moins un objectif ou écrivez le vôtre.","Tick at least one objective or write your own.")}</em></p>`;
          return;
        }
        const visages = ids.map(id => {
          const o = objs.find(x => x.id === id);
          if (!o) return '';
          const sagesse = hikamById[o.matin.sagesse_hikam_id];
          return `
            <article class="visage-matin">
              <h3 class="visage-matin__titre">${esc(o.matin.libelle)}</h3>
              <p class="visage-matin__ens">${esc(o.matin.enseignement_court)}</p>
              ${sagesse?.french_translation ? `
                <blockquote class="visage-matin__sagesse">
                  <p>« ${esc(sagesse.french_translation)} »</p>
                  <footer>— Ibn ʿAṭāʾ Allāh al-Iskandarī, <em>Ḥikam</em> n°${sagesse.id}</footer>
                </blockquote>` : ''}
              <div class="visage-matin__nom">
                <span class="visage-matin__nom-label">${t("Le Nom qui accompagne","The accompanying Name")}</span>
                ${o.matin.nom_remede_ar ? `<span class="visage-matin__nom-ar" lang="ar" dir="rtl">${esc(o.matin.nom_remede_ar)}</span>` : ''}
                <strong>${esc(o.matin.nom_remede)}</strong>
                ${(() => {
                  const g = nomGloss(o.matin.nom_remede);
                  return g?.sens ? `<p class="nom-glose nom-glose--sens"><em>${esc(g.sens)}</em></p>` : '';
                })()}
                <p class="nom-glose nom-glose--incarn">${t("Porter ce Nom aujourd'hui, c'est laisser cette qualité passer à travers le mot, le geste, le regard — sans la nommer, en l'incarnant.","To carry this Name today is to let this quality pass through the word, the gesture, the gaze — without naming it, by embodying it.")}</p>
              </div>
              <p class="visage-matin__chemin"><em>« ${esc(o.matin.phrase_chemin)} »</em></p>
            </article>`;
        }).filter(Boolean).join('');
        const visagePerso = personnel ? `
          <article class="visage-matin visage-matin--perso">
            <h3 class="visage-matin__titre">${esc(personnel)}</h3>
            <p class="visage-matin__ens"><em>${t("Votre objectif personnel sur ","Your personal objective on ")}<strong>${esc(v.label)}</strong>.</em></p>
            <div class="visage-matin__nom">
              <span class="visage-matin__nom-label">${t("Le Nom qui accompagne cette vigilance","The Name that accompanies this vigilance")}</span>
              ${v.nom_divin_ar ? `<span class="visage-matin__nom-ar" lang="ar" dir="rtl">${esc(v.nom_divin_ar)}</span>` : ''}
              <strong>${esc(v.nom_divin)}</strong>
              ${v.nom_divin_sens ? `<p class="nom-glose nom-glose--sens"><em>${esc(v.nom_divin_sens)}</em></p>` : ''}
              ${v.nom_divin_incarnation ? `<p class="nom-glose nom-glose--incarn">${esc(v.nom_divin_incarnation)}</p>` : ''}
            </div>
            <p class="visage-matin__chemin"><em>« ${t("Portez-le aujourd'hui.","Carry it today.")} »</em></p>
          </article>` : '';
        mountV.innerHTML = visages + visagePerso;
      }
      renderVisages();

      // Listeners
      document.getElementById('back-accueil').addEventListener('click', () => {
        state.etape = 'accueil'; render();
      });
      document.querySelectorAll('input[name="objectif"]').forEach(inp => {
        inp.addEventListener('change', () => {
          const card = inp.closest('.objectif-carte');
          if (inp.checked) {
            if (!state.objectifsIds.includes(inp.value)) state.objectifsIds.push(inp.value);
            card?.classList.add('is-selected');
          } else {
            state.objectifsIds = state.objectifsIds.filter(x => x !== inp.value);
            card?.classList.remove('is-selected');
          }
          renderVisages();
        });
      });
      document.getElementById('objectif-perso').addEventListener('input', renderVisages);

      document.getElementById('commit-pose').addEventListener('click', async () => {
        const btn = document.getElementById('commit-pose');
        btn.disabled = true; btn.textContent = 'Un instant…';
        try {
          const personnel = (document.getElementById('objectif-perso')?.value || '').trim();
          state.personnel = personnel;
          await setDoc(doc(db, 'carnets', anonId, 'jours', date), {
            langue: 'fr', schemaVersion: 4,
            matin: {
              ancrage: state.ancrage || null,
              vigilanceId: state.vigilanceId,
              objectifsIds: state.objectifsIds,
              personnel: personnel || null,
              poseLe: serverTimestamp()
            }
          }, { merge: true });
          // Mettre à jour le meta lastSeen
          try {
            await setDoc(doc(db, 'carnets', anonId, '_meta', 'profil'), {
              prenom: prenom || null,
              lastSeen: serverTimestamp()
            }, { merge: true });
          } catch (e) {}
          state.etape = 'pose';
          render();
          window.scrollTo({ top: 0, behavior: 'instant' });
        } catch (e) {
          console.error(e);
          alert(t("Désolé, la sauvegarde n'a pas pu se faire.","Sorry, saving failed."));
          btn.disabled = false; btn.textContent = t("Je prends cela pour aujourd'hui","I take this for today");
        }
      });
    }

    function renderPose() {
      const v = vigilances.find(x => x.id === state.vigilanceId);
      const objsChoisis = state.objectifsIds.map(id => objectifs.find(o => o.id === id)).filter(Boolean);

      mount.innerHTML = `
        <section class="adab-step adab-step--pose">
          <div class="adab-pose-message">
            <p class="adab-pose-message__ar" lang="ar" dir="rtl">${esc(v?.ar || '')}</p>
            <h1 class="adab-pose-message__titre">${prenom ? `${esc(prenom)},` : ''} ${t("votre journée est posée.","your day is set.")}</h1>
            <p class="adab-pose-message__sub">${t("Vous portez aujourd'hui la vigilance de ","Today you carry the vigilance of ")}<strong>${esc(v?.label || '')}</strong>.</p>
          </div>

          ${state.ancrage ? `
            <div class="adab-pose-ancrage">
              <span class="adab-pose-ancrage__label">${t("Ce qui se joue surtout","What is mostly at play")}</span>
              <p>${esc(state.ancrage)}</p>
            </div>` : ''}

          <div class="adab-pose-objectifs">
            ${objsChoisis.map(o => `
              <article class="adab-pose-objectif">
                <p class="adab-pose-objectif__libelle">${esc(o.matin.libelle)}</p>
                <p class="adab-pose-objectif__chemin"><em>${esc(o.matin.phrase_chemin)}</em></p>
              </article>`).join('')}
            ${state.personnel ? `
              <article class="adab-pose-objectif">
                <p class="adab-pose-objectif__libelle">${esc(state.personnel)}</p>
                <p class="adab-pose-objectif__chemin"><em>Portez-le aujourd'hui.</em></p>
              </article>` : ''}
          </div>

          <p class="adab-pose-footer">
            <em>${t("Marchez maintenant. Le carnet vous attend ce soir.","Walk now. The notebook awaits you this evening.")}</em>
          </p>

          <div class="adab-pose-actions">
            <a href="${BASE}aujourdhui/" class="adab-bouton adab-bouton--ghost">${t("Sortir du carnet","Leave the notebook")}</a>
            <button type="button" class="adab-bouton-secondaire" id="modifier-pose">${t("Modifier mon choix","Change my choice")}</button>
          </div>
        </section>
      `;

      document.getElementById('modifier-pose')?.addEventListener('click', () => {
        state.etape = 'vigilance';
        render();
      });
    }

    render();
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<p style="text-align:center; color:#c44; padding:3rem;">${t("Désolé, le carnet n'a pas pu être chargé.","Sorry, the notebook could not be loaded.")}</p>`;
  }
})();
