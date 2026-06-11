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
    const g = heure < 18 ? t('Bonjour','Hello') : t('Bonsoir','Good evening');
    // Pour un jour passé, on n'accueille pas — on nomme le jour qu'on revient déposer.
    const greetingPersonnel = estPasse
      ? `<span style="text-transform:capitalize;">${esc(dateLisibleFromKey(date))}</span>`
      : (prenom ? `${g} <em>${esc(prenom)}</em>,` : `${g},`);

    if (!aPose && !matin.vigilanceId) {
      mount.innerHTML = `
        <section class="adab-step adab-step--accueil">
          <h1 class="adab-h1">${greetingPersonnel}</h1>
          <p class="adab-intro"><em>${t("Vous n'avez pas posé votre matin aujourd'hui.","You did not set your morning today.")}</em></p>
          <p style="text-align:center; max-width: 30rem; margin: 1rem auto; color:#5a4a20;">
            ${t("Vous pouvez quand même déposer ce jour, librement, sans rappel du matin.","You may still lay down this day, freely, without the morning's prompt.")}
          </p>
          <div class="adab-commit" style="margin-top: 1.5rem;">
            <a href="${BASE}poser/" class="adab-bouton">${t("Poser ma journée d'abord","Set my day first")}</a>
            <button type="button" id="relire-libre" class="adab-bouton-secondaire" style="margin-top:.6rem;">${t("Relire librement","Look back freely")}</button>
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
      // Vigilances réellement portées (multi-thèmes + compat ancien modèle)
      const vigsJ = ((matin.objectifs && matin.objectifs.length)
        ? [...new Set(matin.objectifs.map(o => o.vigilance).filter(Boolean))]
        : (matin.vigilanceId ? [matin.vigilanceId] : []))
        .map(id => vigilances.find(x => x.id === id)).filter(Boolean);
      const multiVig = vigsJ.length > 1;
      const bilansObjs = soir.bilansObjectifs || {};
      const bilanPersonnel = soir.bilanPersonnel || { statut: '', note: '' };
      const presente = soir.presente || '';
      const gratitudeNote = soir.gratitudeNote || '';
      const repriseTexte = soir.repriseTexte || '';

      const renderObjBilan = (obj, isPerso) => {
        const id = isPerso ? '__perso' : obj.id;
        const cur = isPerso ? bilanPersonnel : (bilansObjs[obj.id] || { statut: '', note: '' });
        const libelle = isPerso ? matin.personnel : obj.matin.libelle;
        const question = isPerso ? `${t("Comment cela s'est-il passé aujourd'hui ?","How did it go today?")}` : obj.soir.question;
        const vObj = (!isPerso && obj) ? vigilances.find(x => x.id === obj.vigilance) : null;
        const themeTag = (multiVig && vObj) ? `<span class="bilan-objectif__theme">${esc(vObj.label)}</span>` : '';

        const statusBtns = STATUTS.map(s => `
          <label class="statut-btn ${cur.statut === s.id ? 'is-active' : ''}">
            <input type="radio" name="statut-${esc(id)}" value="${esc(s.id)}" ${cur.statut === s.id ? 'checked' : ''}/>
            <span>${esc(s.label)}</span>
          </label>
        `).join('');

        return `
          <article class="bilan-objectif" data-obj-id="${esc(id)}">
            ${themeTag}
            <h3 class="bilan-objectif__libelle">${esc(libelle)}</h3>
            <p class="bilan-objectif__question"><em>${esc(question)}</em></p>
            <div class="bilan-objectif__statuts">${statusBtns}</div>
            <label class="bilan-objectif__note">
              <span>${t("Une note, si elle vient","A note, if it comes")}</span>
              <textarea rows="2" maxlength="500" placeholder="${t("ce que vous avez remarqué, traversé, ressenti…","what you noticed, went through, felt…")}">${esc(cur.note)}</textarea>
            </label>
            <div class="bilan-objectif__parole" id="parole-${esc(id)}"></div>
          </article>
        `;
      };

      mount.innerHTML = `
        <section class="adab-step adab-step--bilan">
          <header class="adab-soir-head">
            <h1 class="adab-h1">${greetingPersonnel}</h1>
            <p class="adab-soir-intro"><em>${estPasse ? t("Vous revenez déposer cette journée. Regardons-la doucement, sans rattrapage ni reproche.","You return to lay down this day. Let us look at it gently, without catching up or reproach.") : t("Regardons doucement comment a été cette journée.","Let us look gently at how this day has been.")}</em></p>
            <p class="adab-soir-intro" style="font-size:.95rem; color:var(--adab-ink-mute);">
              <em>${t("Aucun champ n'est obligatoire. Vous pouvez tout laisser vide et juste déposer le jour.","No field is required. You may leave it all empty and simply lay down the day.")}</em>
            </p>
          </header>

          ${(!estPasse && heure < 17) ? `
            <p class="adab-halte-note">
              <em>${t("La journée n'est pas encore finie — vous pouvez jeter un œil, ou revenir ce soir pour la déposer vraiment.","The day is not over yet — you can take a look, or come back this evening to truly lay it down.")}</em>
            </p>` : ''}

          ${libre ? '' : `
            <div class="adab-soir-rappel">
              ${matin.ancrage ? `<p class="adab-soir-rappel__ancrage">${t("Ce matin vous avez écrit : ","This morning you wrote: ")}<em>« ${esc(matin.ancrage)} »</em></p>` : ''}
              <p class="adab-soir-rappel__vigilance">
                ${multiVig
                  ? `${t("Vous portiez aujourd'hui : ","Today you were carrying: ")}<strong>${vigsJ.map(x => esc(x.label)).join(' · ')}</strong>`
                  : `${t("Vous portiez la vigilance de ","You were carrying the vigilance of ")}<strong>${esc((vigsJ[0] || v)?.label || '')}</strong>
                     <span lang="ar" dir="rtl" style="font-family:'Amiri',serif; color:#8a7028;">· ${esc((vigsJ[0] || v)?.ar || '')}</span>`}
              </p>
            </div>

            <p class="adab-section-titre">${t("Comment vos objectifs ont-ils été vécus ?","How were your objectives lived?")}</p>

            <div class="bilan-objectifs">
              ${objsChoisis.map(o => renderObjBilan(o, false)).join('')}
              ${matin.personnel ? renderObjBilan(null, true) : ''}
            </div>
          `}

          <details class="adab-detail-bloc">
            <summary>
              <span class="adab-section-titre adab-section-titre--soft" style="margin:0; cursor:pointer;">${t("Ce qui s'est présenté à moi","What came to me")} <em>${t("(facultatif)","(optional)")}</em></span>
            </summary>
            <p class="adab-soir-hint">
              <em>${t("Les choses que la journée a apportées sans que vous les choisissiez —","Things the day brought without your choosing them —")}
              ${t("une rencontre, une parole, une grâce, une épreuve, un don.","an encounter, a word, a grace, a trial, a gift.")}</em>
            </p>
            <label class="adab-presente">
              <textarea id="presente-input" rows="3" maxlength="700"
                        placeholder="${t("rien d'obligé — laissez vide si rien ne vient","nothing required — leave empty if nothing comes")}">${esc(presente)}</textarea>
            </label>
          </details>

          <details class="adab-detail-bloc">
            <summary>
              <span class="adab-section-titre adab-section-titre--soft" style="margin:0; cursor:pointer;">${t("Une gratitude","A gratitude")} <em>(facultatif)</em></span>
            </summary>
            <label class="adab-gratitude">
              <textarea id="gratitude-input" rows="2" maxlength="400"
                        placeholder="${t("une chose, une personne, une protection — ou rien","a thing, a person, a protection — or nothing")}">${esc(gratitudeNote)}</textarea>
            </label>
          </details>

          <details class="adab-detail-bloc">
            <summary>
              <span class="adab-section-titre adab-section-titre--soft" style="margin:0; cursor:pointer;">${t("Pour demain","For tomorrow")} <em>(facultatif)</em></span>
            </summary>
            <label class="adab-reprise">
              <textarea id="reprise-input" rows="2" maxlength="300"
                        placeholder="${t("ce que je reprends, plus petit — ou rien","what I take up again, smaller — or nothing")}">${esc(repriseTexte)}</textarea>
            </label>
          </details>

          <div class="adab-commit">
            <button type="button" class="adab-bouton" id="commit-relire">${t("Déposer ce jour","Lay down this day")}</button>
            <span class="adab-ok" id="relire-ok" hidden>${t("✓ déposé","✓ laid down")}</span>
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
        btn.disabled = true; btn.textContent = t("Un instant…","One moment…");
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
            await setDoc(doc(db, 'carnets', anonId, '_meta', 'profil'), { prenom: prenom || null, lastSeen: serverTimestamp() }, { merge: true });
            await setDoc(doc(db, 'carnets', anonId), { prenom: prenom || null, lastSeen: serverTimestamp() }, { merge: true });
          } catch {}
          const ok = document.getElementById('relire-ok');
          if (ok) { ok.hidden = false; setTimeout(() => ok.hidden = true, 2500); }
          // Petit message de clôture
          mount.innerHTML += `
            <div class="adab-soir-cloture">
              <p>${estPasse
                  ? t("Cette journée est gardée.","This day is now kept.")
                  : t("Le jour est déposé.","The day is laid down.")}</p>
              <p><em>« ${estPasse
                  ? t("Ce qui a été vécu est recueilli. Reviens au présent.","What was lived is gathered in. Return to the present.")
                  : t("Que la nuit soit douce et le souffle paisible.","May the night be gentle and the breath at peace.")} »</em></p>
              <div class="adab-pose-actions" style="margin-top:1.3rem;">
                <a href="${BASE}aujourdhui/" class="adab-bouton">${t("Revenir au carnet","Back to the notebook")}</a>
                <a href="${BASE}historique/" class="adab-bouton-secondaire">${t("Mes journées passées","My past days")}</a>
              </div>
            </div>`;
          document.querySelector('.adab-soir-cloture').scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {
          console.error(e);
          alert(t("Désolé, la sauvegarde n'a pas pu se faire.","Sorry, saving failed."));
          btn.disabled = false; btn.textContent = t("Déposer ce jour","Lay down this day");
        }
      });
    }
  } catch (e) {
    console.error(e);
    mount.innerHTML = `<p style="text-align:center; color:#c44; padding:3rem;">${t("Désolé, le carnet n'a pas pu être chargé.","Sorry, the notebook could not be loaded.")}</p>`;
  }
})();
