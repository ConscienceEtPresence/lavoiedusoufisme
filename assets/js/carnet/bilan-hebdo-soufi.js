/* ============================================================
   LA VOIE DU DEDANS — Bilan hebdomadaire + Nom du jour + Ressources
   Lit Firebase, compose en voix soufie. Aucune citation d'auteur.
   ============================================================ */
import { db } from './firebase-init.js';
import { collection, getDocs, doc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ----- Liste des moteurs pour les libellés -----
const MOTEURS_FR = {
  fatigue: 'fatigue', peur: 'peur', controle: 'besoin de contrôle',
  orgueil: 'orgueil', attente: 'attente non comblée', honte: 'honte',
  tristesse: 'tristesse', oubli: 'oubli de soi'
};
const REMEDES_FR = {
  sabr: 'ṣabr', hilm: 'ḥilm', rifq: 'rifq', samt: 'ṣamt', adab: 'adab',
  tawba: 'tawba', istighfar: 'istighfār', shukr: 'shukr',
  hudur: 'ḥuḍūr', muraqaba: 'murāqaba'
};

// ----- Carte des correspondances "mouvement → ressource" -----
// Pour le bloc "Pour aller plus loin" dans la relecture du moment
export const MOUVEMENTS_RESSOURCES = {
  fatigue: {
    remede: 'rifq', nomDivin: { n: 84, slug: 'ar-rauf',  tr: 'ar-Raʾūf',  fr: 'la tendresse extrême' },
    racine: { ar: 'ر-ف-ق', tr: 'r-f-q', sens: 'douceur, ménagement' },
    invite: 'Soyez doux avec vous-même comme avec un enfant fatigué.'
  },
  peur: {
    remede: 'tawakkul', nomDivin: { n: 53, slug: 'al-wakil', tr: 'al-Wakīl', fr: 'celui à qui l\'on remet sa charge' },
    racine: { ar: 'و-ك-ل', tr: 'w-k-l', sens: 'remettre, confier' },
    invite: 'Confier ce qui pèse à plus grand que soi, ne serait-ce qu\'une minute.'
  },
  controle: {
    remede: 'tawakkul', nomDivin: { n: 64, slug: 'al-qayyum', tr: 'al-Qayyūm', fr: 'celui qui se tient par lui-même et tient tout' },
    racine: { ar: 'ق-و-م', tr: 'q-w-m', sens: 'tenir, se tenir' },
    invite: 'Si Lui tient tout, vous pouvez relâcher une chose.'
  },
  orgueil: {
    remede: 'faqr', nomDivin: { n: 89, slug: 'al-ghani', tr: 'al-Ghanī', fr: 'celui qui se suffit à lui-même' },
    racine: { ar: 'ف-ق-ر', tr: 'f-q-r', sens: 'pauvreté, dépendance' },
    invite: 'Reconnaître que tout ce qu\'on a vient d\'ailleurs — c\'est le faqr.'
  },
  attente: {
    remede: 'sabr', nomDivin: { n: 100, slug: 'as-sabur', tr: 'aṣ-Ṣabūr', fr: 'celui qui patiente sans fin' },
    racine: { ar: 'ص-ب-ر', tr: 'ṣ-b-r', sens: 'tenir, contenir' },
    invite: 'Tenir sans durcir. La patience n\'est pas la résignation.'
  },
  honte: {
    remede: 'tawba', nomDivin: { n: 81, slug: 'at-tawwab', tr: 'at-Tawwāb', fr: 'celui qui ne cesse de recevoir le retour' },
    racine: { ar: 'ت-و-ب', tr: 't-w-b', sens: 'revenir' },
    invite: 'La porte du retour n\'est jamais fermée. Toujours.'
  },
  tristesse: {
    remede: 'rifq', nomDivin: { n: 31, slug: 'al-latif', tr: 'al-Laṭīf', fr: 'le subtil, le délicat' },
    racine: { ar: 'ل-ط-ف', tr: 'l-ṭ-f', sens: 'délicatesse, finesse' },
    invite: 'Accueillir la tristesse comme une visiteuse, sans la chasser.'
  },
  oubli: {
    remede: 'muraqaba', nomDivin: { n: 44, slug: 'ar-raqib', tr: 'ar-Raqīb', fr: 'celui qui veille, l\'attentif' },
    racine: { ar: 'ر-ق-ب', tr: 'r-q-b', sens: 'veiller, observer' },
    invite: 'Revenir à la conscience d\'être vu — sans peur, comme un enfant aimé.'
  }
};

// ----- Nom du jour : rotation déterministe sur les 99 Noms -----
let _nomsCache = null;
async function loadNoms() {
  if (_nomsCache) return _nomsCache;
  try {
    const res = await fetch('/data/noms-divins.json');
    const data = await res.json();
    _nomsCache = data.noms || [];
  } catch { _nomsCache = []; }
  return _nomsCache;
}

// Slugs canoniques pour les liens (matchent les pages /pages/noms-divins/nom/{slug}/)
const SLUG_MAP = {
  1: '1-allah', 2: '2-ar-rahman', 3: '3-ar-rahim', 4: '4-al-malik', 5: '5-al-quddus',
  6: '6-as-salam', 7: '7-al-mumin', 8: '8-al-muhaymin', 9: '9-al-aziz', 10: '10-al-jabbar',
  11: '11-al-mutakabbir', 12: '12-al-khaliq', 13: '13-al-bari', 14: '14-al-musawwir',
  15: '15-al-ghaffar', 16: '16-al-qahhar', 17: '17-al-wahhab', 18: '18-ar-razzaq',
  19: '19-al-fattah', 20: '20-al-alim', 31: '31-al-latif', 33: '33-al-halim',
  35: '35-al-ghafur', 36: '36-ash-shakur', 44: '44-ar-raqib', 53: '53-al-wakil',
  64: '64-al-qayyum', 81: '81-at-tawwab', 84: '84-ar-rauf', 89: '89-al-ghani',
  100: '100-as-sabur'
};

export async function getNomDuJour() {
  const noms = await loadNoms();
  if (!noms.length) return null;
  // rotation déterministe : jour de l'année comme index
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const nom = noms[dayOfYear % noms.length];
  const slug = SLUG_MAP[nom.n] || null;
  return {
    n: nom.n, ar: nom.ar, tr: nom.tr, fr: nom.fr,
    sens: nom.sens_court || '',
    href: slug ? `/pages/noms-divins/nom/${slug}/` : null
  };
}

// ----- Bilan de la semaine -----
function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export async function loadLastDays(codeId, n = 7) {
  if (!codeId) return [];
  const out = [];
  try {
    const snap = await getDocs(collection(db, 'carnets', codeId, 'jours'));
    snap.forEach(s => out.push({ date: s.id, data: s.data() }));
  } catch { return []; }
  return out.sort((a, b) => b.date.localeCompare(a.date)).slice(0, n);
}

function countMoteurs(days) {
  const c = {};
  for (const d of days) {
    const arr = d.data?.soir?.moment?.moteurs;
    if (Array.isArray(arr)) for (const m of arr) c[m] = (c[m] || 0) + 1;
  }
  return c;
}

function countRemedes(days) {
  const c = {};
  for (const d of days) {
    const r = d.data?.soir?.moment?.remede;
    if (r) c[r] = (c[r] || 0) + 1;
  }
  return c;
}

function countReponses(days) {
  let oui = 0, partiel = 0, non = 0, sais_pas = 0;
  for (const d of days) {
    const reps = d.data?.soir?.reponses || {};
    for (const v of Object.values(reps)) {
      if (v === 'oui') oui++;
      else if (v === 'partial') partiel++;
      else if (v === 'non') non++;
      else if (v === 'sais_pas') sais_pas++;
    }
  }
  return { oui, partiel, non, sais_pas };
}

function vowStats(days) {
  let total = 0, tenu = 0;
  for (const d of days) {
    const s = d.data?.reprise?.statut;
    if (s) { total++; if (s === 'tenu') tenu++; }
  }
  return { total, tenu };
}

function topEntry(counts) {
  const e = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return e || null;
}

export function buildBilanHebdo(days) {
  const filled = days.filter(d => Object.keys(d.data).filter(x => !x.startsWith('_')).length);
  if (!filled.length) return null;

  const lines = [];

  // Présence
  lines.push(`<strong>${filled.length}</strong> jour${filled.length > 1 ? 's' : ''} habité${filled.length > 1 ? 's' : ''} cette semaine.`);

  // Réponses du soir
  const reps = countReponses(filled);
  const totalReps = reps.oui + reps.partiel + reps.non + reps.sais_pas;
  if (totalReps > 0) {
    if (reps.oui >= reps.non) {
      lines.push(`Plus de présence que d'oubli sur les pratiques du soir : <strong>${reps.oui}</strong> 'oui', ${reps.partiel} 'en partie', ${reps.non} 'non'${reps.sais_pas ? `, ${reps.sais_pas} 'je ne sais pas'` : ''}.`);
    } else {
      lines.push(`La semaine a porté son lot d'oubli : ${reps.oui} 'oui', ${reps.partiel} 'en partie', <strong>${reps.non}</strong> 'non'. Pas de jugement — juste un constat doux.`);
    }
  }

  // Mouvement intérieur dominant
  const topMot = topEntry(countMoteurs(filled));
  if (topMot && topMot[1] >= 2) {
    const label = MOTEURS_FR[topMot[0]] || topMot[0];
    lines.push(`Le mouvement qui est revenu le plus : <em>« ${label} »</em> (${topMot[1]} fois). Une visite à reconnaître, pas à combattre.`);
  }

  // Remède dominant
  const topRem = topEntry(countRemedes(filled));
  if (topRem) {
    const r = REMEDES_FR[topRem[0]] || topRem[0];
    lines.push(`Le remède que vous avez appelé le plus : <strong>${r}</strong>. C'est lui votre compagnon de la semaine.`);
  }

  // Vœux
  const v = vowStats(filled);
  if (v.total > 0) {
    if (v.tenu === v.total) {
      lines.push(`Tous les vœux repris ont été tenus (${v.tenu}/${v.total}). C'est ${v.tenu === 1 ? 'beau' : 'beau, vraiment'}.`);
    } else if (v.tenu === 0) {
      lines.push(`Aucun des ${v.total} vœux repris n'a tenu cette semaine. Peut-être trop ambitieux ? Plus petit la prochaine fois.`);
    } else {
      lines.push(`Sur ${v.total} vœux repris, <strong>${v.tenu}</strong> tenu${v.tenu > 1 ? 's' : ''}. Le retour est ce qui compte, pas la perfection.`);
    }
  }

  // Invitation pour la semaine à venir
  const invite = inviteForNextWeek(topMot, topRem);
  if (invite) lines.push(`<em style="color:var(--gold)">${invite}</em>`);

  return { days: filled.length, lines };
}

function inviteForNextWeek(topMot, topRem) {
  if (topMot && MOUVEMENTS_RESSOURCES[topMot[0]]) {
    const m = MOUVEMENTS_RESSOURCES[topMot[0]];
    return `Pour la semaine à venir : ${m.invite}`;
  }
  if (topRem) {
    const r = REMEDES_FR[topRem[0]] || topRem[0];
    return `Garder ${r} comme compagnon de chevet.`;
  }
  return `Un instant doux à se garder, chaque jour.`;
}

// ----- API publique combinée -----
export async function loadAndBuild(codeId) {
  const [days, nom] = await Promise.all([
    loadLastDays(codeId, 7),
    getNomDuJour()
  ]);
  return { bilan: buildBilanHebdo(days), nom };
}
