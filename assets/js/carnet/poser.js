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

const mount = document.getElementById('poser-mount');
const dateEl = document.getElementById('adab-date');

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function dateLisible() {
  return new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

dateEl.textContent = dateLisible();
const date = todayKey();

(async () => {
  try {
    const [vigilancesRes, objectifsRes, hikamRes, jourSnap] = await Promise.all([
      fetch('/data/carnet/vigilances.json').then(r => r.json()),
      fetch('/data/carnet/objectifs.json').then(r => r.json()),
      fetch('/data/iskandari/hikam-complet.json').then(r => r.json()),
      getDoc(doc(db, 'carnets', anonId, 'jours', date)).catch(() => null)
    ]);

    const vigilances = vigilancesRes.vigilances || [];
    const objectifs = objectifsRes.objectifs || [];
    const hikamById = {};
    for (const r of (hikamRes.records || [])) hikamById[r.id] = r;

    const jourData = jourSnap?.exists() ? jourSnap.data() : {};
    const matin = jourData.matin || {};
    const dejaPose = !!matin.poseLe;

    // Etat de la page : 'accueil' / 'vigilance' / 'engage' / 'pose'
    let state = {
      etape: dejaPose ? 'pose' : 'accueil',
      ancrage: matin.ancrage || '',
      vigilanceId: matin.vigilanceId || '',
      objectifsIds: matin.objectifsIds || [],
      personnel: matin.personnel || '',
    };

    function render() {
      if (state.etape === 'accueil') return renderAccueil();
      if (state.etape === 'vigilance') return renderVigilance();
      if (state.etape === 'pose') return renderPose();
    }

    function renderAccueil() {
      const greeting = prenom ? `Bonjour <em>${esc(prenom)}</em>,` : `Bonjour,`;
      mount.innerHTML = `
        <section class="adab-step adab-step--accueil">
          <h1 class="adab-h1">${greeting}</h1>
          <p class="adab-intro">
            <em>Sur quoi voulez-vous veiller aujourd'hui ?</em>
          </p>

          <label class="adab-ancrage">
            <span class="adab-ancrage__label">Aujourd'hui se joue surtout…</span>
            <input type="text" id="ancrage-input" class="adab-ancrage__input"
                   maxlength="120" placeholder="un mot, une phrase, ce qui vous parle"
                   value="${esc(state.ancrage)}"/>
            <span class="adab-ancrage__hint"><em>facultatif — pour vous, comme une note</em></span>
          </label>

          <p class="adab-section-titre">Choisissez une vigilance pour la journée</p>

          <div class="vigilances-grille">
            ${vigilances.map(v => `
              <button type="button" class="vigilance-carte" data-id="${esc(v.id)}">
                <span class="vigilance-carte__ar" lang="ar" dir="rtl">${esc(v.ar)}</span>
                <span class="vigilance-carte__tr">${esc(v.tr)}</span>
                <span class="vigilance-carte__label">${esc(v.label)}</span>
              </button>
            `).join('')}
          </div>

          <p class="adab-footnote"><em>Une seule vigilance par jour. Petit, c'est suffisant.</em></p>
        </section>
      `;
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
          <button type="button" class="adab-back-link" id="back-accueil">← Changer de vigilance</button>

          <header class="vigilance-fiche">
            <p class="vigilance-fiche__ar" lang="ar" dir="rtl">${esc(v.ar)}</p>
            <h1 class="vigilance-fiche__titre">${esc(v.label)}</h1>
            <p class="vigilance-fiche__tr">${esc(v.tr)} · ${v.termes_soufis.slice(0, 3).map(esc).join(' · ')}</p>
          </header>

          <details class="vigilance-formation" open>
            <summary><em>Ce que c'est, chez les soufis</em></summary>
            <div class="vigilance-formation__body">
              <p class="vigilance-formation__def">${esc(v.definition_courte)}</p>
              <p class="vigilance-formation__ens">${esc(v.enseignement)}</p>
              <div class="vigilance-formation__parole">
                <span class="vigilance-formation__petit-label">Une parole d'un maître</span>
                <p>${esc(v.parole_maitre)}</p>
              </div>
              <div class="vigilance-formation__verset">
                <span class="vigilance-formation__petit-label">Coran · hadith</span>
                <p>${esc(v.verset)}</p>
              </div>
              <p class="vigilance-formation__nom">
                <span class="vigilance-formation__petit-label">Nom qui accompagne</span>
                ${v.nom_divin_ar ? `<span class="vigilance-formation__nom-ar" lang="ar" dir="rtl">${esc(v.nom_divin_ar)}</span>` : ''}
                <strong>${esc(v.nom_divin)}</strong>
              </p>
            </div>
          </details>

          <p class="adab-section-titre">Un objectif concret pour aujourd'hui</p>

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
              <span class="objectif-carte__libelle">Ou écrire le mien :</span>
              <input type="text" id="objectif-perso" class="objectif-carte__input"
                     maxlength="180" placeholder="un objectif personnel sur ${esc(v.label.toLowerCase())}"
                     value="${esc(state.personnel)}"/>
            </label>
          </div>

          <p class="adab-section-titre adab-section-titre--soft">Ce que vous prenez aujourd'hui</p>
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
          mountV.innerHTML = `<p class="visage-vide"><em>Cochez au moins un objectif ou écrivez le vôtre.</em></p>`;
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
              <p class="visage-matin__nom">
                <span class="visage-matin__nom-label">Le Nom qui accompagne</span>
                ${o.matin.nom_remede_ar ? `<span class="visage-matin__nom-ar" lang="ar" dir="rtl">${esc(o.matin.nom_remede_ar)}</span>` : ''}
                <strong>${esc(o.matin.nom_remede)}</strong>
              </p>
              <p class="visage-matin__chemin"><em>« ${esc(o.matin.phrase_chemin)} »</em></p>
            </article>`;
        }).filter(Boolean).join('');
        const visagePerso = personnel ? `
          <article class="visage-matin visage-matin--perso">
            <h3 class="visage-matin__titre">${esc(personnel)}</h3>
            <p class="visage-matin__ens"><em>Votre objectif personnel sur <strong>${esc(v.label)}</strong>.</em></p>
            <p class="visage-matin__nom">
              <span class="visage-matin__nom-label">Le Nom qui accompagne cette vigilance</span>
              ${v.nom_divin_ar ? `<span class="visage-matin__nom-ar" lang="ar" dir="rtl">${esc(v.nom_divin_ar)}</span>` : ''}
              <strong>${esc(v.nom_divin)}</strong>
            </p>
            <p class="visage-matin__chemin"><em>« Portez-le aujourd'hui. »</em></p>
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
          alert('Désolé, la sauvegarde n\'a pas pu se faire.');
          btn.disabled = false; btn.textContent = 'Je prends cela pour aujourd\'hui';
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
            <h1 class="adab-pose-message__titre">${prenom ? `${esc(prenom)},` : ''} votre journée est posée.</h1>
            <p class="adab-pose-message__sub">Vous portez aujourd'hui la vigilance de <strong>${esc(v?.label || '')}</strong>.</p>
          </div>

          ${state.ancrage ? `
            <div class="adab-pose-ancrage">
              <span class="adab-pose-ancrage__label">Ce qui se joue surtout</span>
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
            <em>Marchez maintenant. Le carnet vous attend ce soir.</em>
          </p>

          <div class="adab-pose-actions">
            <a href="/pages/carnet/aujourdhui/" class="adab-bouton adab-bouton--ghost">Sortir du carnet</a>
            <button type="button" class="adab-bouton-secondaire" id="modifier-pose">Modifier mon choix</button>
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
    mount.innerHTML = `<p style="text-align:center; color:#c44; padding:3rem;">Désolé, le carnet n'a pas pu être chargé.</p>`;
  }
})();
