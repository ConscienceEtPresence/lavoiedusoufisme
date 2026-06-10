/* ============================================================
   Le carnet d'adab — Relire ma journée (soir)
   ============================================================ */
import { db } from './firebase-init.js';
import { doc, setDoc, getDoc, serverTimestamp }
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

const mount = document.getElementById('relire-mount');
const dateEl = document.getElementById('adab-date');

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function dateLisibleFromKey(key) {
  const [y, m, d] = key.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
    .toLocaleDateString(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' });
}
function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Un jour précis peut être demandé via ?j=YYYY-MM-DD (relire la veille oubliée).
// Sinon, c'est aujourd'hui.
const params = new URLSearchParams(location.search);
const askedDate = params.get('j');
const isValidKey = k => /^\d{4}-\d{2}-\d{2}$/.test(k || '');
const date = isValidKey(askedDate) ? askedDate : todayKey();
const estPasse = date !== todayKey();

dateEl.textContent = dateLisibleFromKey(date);

(async () => {
  try {
    const [vigilancesRes, objectifsRes, jourSnap] = await Promise.all([
      fetch('/data/carnet/vigilances' + (EN ? '.en' : '') + '.json').then(r => r.json()),
      fetch('/data/carnet/objectifs' + (EN ? '.en' : '') + '.json').then(r => r.json()),
      getDoc(doc(db, 'carnets', anonId, 'jours', date)).catch(() => null)
    ]);

    const vigilances = vigilancesRes.vigilances || [];
    const objectifs = objectifsRes.objectifs || [];
    const paroles_gen = objectifsRes.paroles_generiques || {};
    const STATUTS = objectifsRes.statuts || [
      { id: 'tenu', label: 'tenu' },
      { id: 'parfois', label: 'parfois' },
      { id: 'oublie', label: 'oublié' },
      { id: 'repris', label: 'à reprendre' }
    ];

    const jourData = jourSnap?.exists() ? jourSnap.data() : {};
    const matin = jourData.matin || {};
    const soir = jourData.soir || {};
    const aPose = !!matin.poseLe;

    const heure = new Date().getHours();
    const g = heure < 12 ? 'Bonjour' : (heure < 18 ? 'Bonjour' : 'Bonsoir');
    // Pour un jour passé, on n'accueille pas — on nomme le jour qu'on revient déposer.
    const greetingPersonnel = estPasse
      ? `<span style="text-transform:capitalize;">${esc(dateLisibleFromKey(date))}</span>`
      : (prenom ? `${g} <em>${esc(prenom)}</em>,` : `${g},`);

    if (!aPose && !matin.vigilanceId) {
      mount.innerHTML = `
        <section class="adab-step adab-step--accueil">
          <h1 class="adab-h1">${greetingPersonnel}</h1>
          <p class="adab-intro"><em>Vous n'avez pas posé votre matin aujourd'hui.</em></p>
          <p style="text-align:center; max-width: 30rem; margin: 1rem auto; color:#5a4a20;">
            Vous pouvez quand même déposer ce jour, librement, sans rappel du matin.
          </p>
          <div class="adab-commit" style="margin-top: 1.5rem;">
            <a href="${BASE}poser/" class="adab-bouton">Poser ma journée d'abord</a>
            <button type="button" id="relire-libre" class="adab-bouton-secondaire" style="margin-top:.6rem;">Relire librement</button>
          </div>
        </section>
      `;
      document.getElementById('relire-libre').addEventListener('click', () => renderBilan(true));
      return;
    }

    renderBilan(false);

    function renderBilan(libre) {
      const v = vigilances.find(x => x.id === matin.vigilanceId);
      const objsChoisis = (matin.objectifsIds || []).map(id => objectifs.find(o => o.id === id)).filter(Boolean);
      const bilansObjs = soir.bilansObjectifs || {};
      const bilanPersonnel = soir.bilanPersonnel || { statut: '', note: '' };
      const presente = soir.presente || '';
      const gratitudeNote = soir.gratitudeNote || '';
      const repriseTexte = soir.repriseTexte || '';

      const renderObjBilan = (obj, isPerso) => {
        const id = isPerso ? '__perso' : obj.id;
        const cur = isPerso ? bilanPersonnel : (bilansObjs[obj.id] || { statut: '', note: '' });
        const libelle = isPerso ? matin.personnel : obj.matin.libelle;
        const question = isPerso ? `Comment cela s'est-il passé aujourd'hui ?` : obj.soir.question;

        const statusBtns = STATUTS.map(s => `
          <label class="statut-btn ${cur.statut === s.id ? 'is-active' : ''}">
            <input type="radio" name="statut-${esc(id)}" value="${esc(s.id)}" ${cur.statut === s.id ? 'checked' : ''}/>
            <span>${esc(s.label)}</span>
          </label>
        `).join('');

        return `
          <article class="bilan-objectif" data-obj-id="${esc(id)}">
            <h3 class="bilan-objectif__libelle">${esc(libelle)}</h3>
            <p class="bilan-objectif__question"><em>${esc(question)}</em></p>
            <div class="bilan-objectif__statuts">${statusBtns}</div>
            <label class="bilan-objectif__note">
              <span>Une note, si elle vient</span>
              <textarea rows="2" maxlength="500" placeholder="ce que vous avez remarqué, traversé, ressenti…">${esc(cur.note)}</textarea>
            </label>
            <div class="bilan-objectif__parole" id="parole-${esc(id)}"></div>
          </article>
        `;
      };

      mount.innerHTML = `
        <section class="adab-step adab-step--bilan">
          <header class="adab-soir-head">
            <h1 class="adab-h1">${greetingPersonnel}</h1>
            <p class="adab-soir-intro"><em>${estPasse ? 'Vous revenez déposer cette journée. Regardons-la doucement, sans rattrapage ni reproche.' : 'Regardons doucement comment a été cette journée.'}</em></p>
            <p class="adab-soir-intro" style="font-size:.95rem; color:var(--adab-ink-mute);">
              <em>Aucun champ n'est obligatoire. Vous pouvez tout laisser vide et juste déposer le jour.</em>
            </p>
          </header>

          ${libre ? '' : `
            <div class="adab-soir-rappel">
              ${matin.ancrage ? `<p class="adab-soir-rappel__ancrage">Ce matin vous avez écrit : <em>« ${esc(matin.ancrage)} »</em></p>` : ''}
              <p class="adab-soir-rappel__vigilance">
                Vous portiez la vigilance de <strong>${esc(v?.label || '')}</strong>
                <span lang="ar" dir="rtl" style="font-family:'Amiri',serif; color:#8a7028;">· ${esc(v?.ar || '')}</span>
              </p>
            </div>

            <p class="adab-section-titre">Comment vos objectifs ont-ils été vécus ?</p>

            <div class="bilan-objectifs">
              ${objsChoisis.map(o => renderObjBilan(o, false)).join('')}
              ${matin.personnel ? renderObjBilan(null, true) : ''}
            </div>
          `}

          <details class="adab-detail-bloc">
            <summary>
              <span class="adab-section-titre adab-section-titre--soft" style="margin:0; cursor:pointer;">Ce qui s'est présenté à moi <em>(facultatif)</em></span>
            </summary>
            <p class="adab-soir-hint">
              <em>Les choses que la journée a apportées sans que vous les choisissiez —
              une rencontre, une parole, une grâce, une épreuve, un don.</em>
            </p>
            <label class="adab-presente">
              <textarea id="presente-input" rows="3" maxlength="700"
                        placeholder="rien d'obligé — laissez vide si rien ne vient">${esc(presente)}</textarea>
            </label>
          </details>

          <details class="adab-detail-bloc">
            <summary>
              <span class="adab-section-titre adab-section-titre--soft" style="margin:0; cursor:pointer;">Une gratitude <em>(facultatif)</em></span>
            </summary>
            <label class="adab-gratitude">
              <textarea id="gratitude-input" rows="2" maxlength="400"
                        placeholder="une chose, une personne, une protection — ou rien">${esc(gratitudeNote)}</textarea>
            </label>
          </details>

          <details class="adab-detail-bloc">
            <summary>
              <span class="adab-section-titre adab-section-titre--soft" style="margin:0; cursor:pointer;">Pour demain <em>(facultatif)</em></span>
            </summary>
            <label class="adab-reprise">
              <textarea id="reprise-input" rows="2" maxlength="300"
                        placeholder="ce que je reprends, plus petit — ou rien">${esc(repriseTexte)}</textarea>
            </label>
          </details>

          <div class="adab-commit">
            <button type="button" class="adab-bouton" id="commit-relire">Déposer ce jour</button>
            <span class="adab-ok" id="relire-ok" hidden>✓ déposé</span>
          </div>
        </section>
      `;

      // === Statut radio listeners → reveal parole ===
      document.querySelectorAll('.bilan-objectif').forEach(card => {
        const objId = card.dataset.objId;
        const isPerso = objId === '__perso';
        const obj = isPerso ? null : objsChoisis.find(o => o.id === objId);
        const paroleEl = document.getElementById(`parole-${objId}`);

        const showParole = (statutId) => {
          const parole = isPerso
            ? (paroles_gen[statutId] || '')
            : (obj?.soir?.paroles?.[statutId] || paroles_gen[statutId] || '');
          if (!parole) { paroleEl.innerHTML = ''; return; }
          paroleEl.innerHTML = `
            <div class="parole-soufie">
              <p>« ${esc(parole)} »</p>
            </div>`;
        };

        card.querySelectorAll('input[type="radio"]').forEach(inp => {
          if (inp.checked) showParole(inp.value);
          inp.addEventListener('change', () => {
            card.querySelectorAll('.statut-btn').forEach(b => b.classList.remove('is-active'));
            inp.closest('.statut-btn')?.classList.add('is-active');
            showParole(inp.value);
          });
        });
      });

      // === Commit bilan ===
      document.getElementById('commit-relire').addEventListener('click', async () => {
        const btn = document.getElementById('commit-relire');
        btn.disabled = true; btn.textContent = 'Un instant…';
        try {
          const bilansObjectifs = {};
          let bilanPersonnel = { statut: '', note: '' };
          document.querySelectorAll('.bilan-objectif').forEach(card => {
            const id = card.dataset.objId;
            const statut = card.querySelector('input[type="radio"]:checked')?.value || '';
            const note = card.querySelector('textarea')?.value.trim() || '';
            if (id === '__perso') {
              bilanPersonnel = { statut, note };
            } else {
              bilansObjectifs[id] = { statut, note };
            }
          });
          const presente = (document.getElementById('presente-input')?.value || '').trim();
          const gratitudeNote = (document.getElementById('gratitude-input')?.value || '').trim();
          const repriseTexte = (document.getElementById('reprise-input')?.value || '').trim();

          await setDoc(doc(db, 'carnets', anonId, 'jours', date), {
            langue: 'fr', schemaVersion: 4,
            soir: {
              bilansObjectifs,
              bilanPersonnel,
              presente,
              gratitudeNote,
              repriseTexte,
              fermeLe: serverTimestamp()
            }
          }, { merge: true });
          // Update lastSeen
          try {
            await setDoc(doc(db, 'carnets', anonId, '_meta', 'profil'), {
              prenom: prenom || null,
              lastSeen: serverTimestamp()
            }, { merge: true });
          } catch {}
          const ok = document.getElementById('relire-ok');
          if (ok) { ok.hidden = false; setTimeout(() => ok.hidden = true, 2500); }
          // Petit message de clôture
          mount.innerHTML += `
            <div class="adab-soir-cloture">
              <p>Le jour est déposé.</p>
              <p><em>« Que la nuit soit douce et le souffle paisible. »</em></p>
              <a href="${BASE}aujourdhui/" class="adab-bouton adab-bouton--ghost" style="margin-top:1rem;">Sortir du carnet</a>
            </div>`;
          document.querySelector('.adab-soir-cloture').scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {
          console.error(e);
          alert('Désolé, la sauvegarde n\'a pas pu se faire.');
          btn.disabled = false; btn.textContent = 'Déposer ce jour';
        }
      });
    }
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<p style="text-align:center; color:#c44; padding:3rem;">Désolé, le carnet n'a pas pu être chargé.</p>`;
  }
})();
