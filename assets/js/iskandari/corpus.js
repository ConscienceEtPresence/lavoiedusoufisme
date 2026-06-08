/* ============================================================
   Iskandarī — chargement partagé du corpus + helpers
   ============================================================ */

let _corpus = null;
const CORPUS_URL = '/data/iskandari/corpus.json';

export async function loadCorpus() {
  if (_corpus) return _corpus;
  const res = await fetch(CORPUS_URL);
  _corpus = await res.json();
  return _corpus;
}

export function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Familles + libellés humains (ordre de lecture spirituel)
export const FAMILLES_FR = {
  abandon_confiance:        'Abandon et confiance',
  temps_presence:           'Le temps, la présence',
  vie_concrete:             'Vie concrète',
  coeur_action:             'Cœur et action',
  epreuves:                 'Épreuves et patience',
  coeur_relation:           'Cœur et relation',
  retour:                   'Retour, réparation',
  etats_interieurs:         'États intérieurs',
  servitude:                'Servitude et besoin',
  detachement:              'Détachement, sobriété',
  transformation_interieure:'Transformation intérieure',
  relation:                 'Relations humaines',
  science_contemplation:    'Connaissance et contemplation',
  pratique:                 'Pratique vivante',
  voie_transmission:        'Voie et transmission',
  amour_attachement:        'Amour et attachement',
  priere_intime:            'Prière intime',
  module_complementaire:    'Pour aller plus loin'
};

export const FAMILLES_ORDER = [
  'abandon_confiance', 'temps_presence', 'vie_concrete', 'coeur_action',
  'epreuves', 'coeur_relation', 'retour', 'etats_interieurs', 'servitude',
  'detachement', 'transformation_interieure', 'relation',
  'science_contemplation', 'pratique', 'voie_transmission',
  'amour_attachement', 'priere_intime', 'module_complementaire'
];

// Retourne un index : moduleId -> module
export function indexModules(corpus) {
  const m = {};
  for (const mod of corpus.thematic_modules) m[mod.id] = mod;
  return m;
}

// Retourne un index : hikma id -> entrée hikam
export function indexHikam(corpus) {
  const h = {};
  for (const e of corpus.hikam_entry_index) h[e.id] = e;
  return h;
}

// Sagesse Iskandarī du jour — rotation déterministe sur les modules
// avec contenu pédagogique disponible. Retourne { module, hikmaId? }.
export function moduleDuJour(corpus) {
  const modules = corpus.thematic_modules || [];
  if (!modules.length) return null;
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((d - start) / 86400000);
  return modules[dayOfYear % modules.length];
}

// Quel module proposer selon un état / contexte (matching simple)
const ETAT_TO_MODULES = {
  'agité':         ['isqat_al_tadbir', 'sabr', 'tawakkul'],
  'fatigué':       ['fatigue', 'qabd_bast', 'faqr'],
  'inquiet':       ['tawakkul', 'rizq', 'sabr'],
  'fermé':         ['qabd_bast', 'mahabba', 'humilite'],
  'en colère':     ['ghadab', 'adab_al_kalam', 'humilite'],
  'reconnaissant': ['shukr', 'munajat'],
  'perdu':         ['waqt', 'tawba', 'raja_khawf'],
  'disponible':    ['ikhlas', 'muraqaba_mushahada', 'dhikr_wird'],
  'posé':          ['muraqaba_mushahada', 'waqt', 'dhikr_wird'],
  'ouvert':        ['mahabba', 'hubb_allah', 'munajat']
};
const CONTEXTE_TO_MODULES = {
  'famille':       ['famille_travail', 'adab_al_kalam', 'relations_epreuves'],
  'travail':       ['famille_travail', 'rizq', 'amal_et_appui'],
  'relation':      ['relations_epreuves', 'adab_al_kalam', 'jugement'],
  'argent/rizq':   ['rizq', 'tawakkul', 'asbab'],
  'santé/fatigue': ['fatigue', 'sabr', 'faqr'],
  'parole':        ['adab_al_kalam', 'madih_dhamm', 'ghadab'],
  'prière/dhikr':  ['dhikr_wird', 'salat_service', 'muraqaba_mushahada'],
  'étude':         ['ilm_nafii', 'lecture_mediter', 'humilite'],
  'solitude':      ['uzla_jalwa', 'munajat', 'qabd_bast'],
  'imprévu':       ['waqt', 'isqat_al_tadbir', 'sabr']
};
export function suggestModules(corpus, { etats = [], contexts = [] } = {}, limit = 3) {
  const score = {};
  for (const e of etats) {
    for (const mid of (ETAT_TO_MODULES[e] || [])) score[mid] = (score[mid] || 0) + 2;
  }
  for (const c of contexts) {
    for (const mid of (CONTEXTE_TO_MODULES[c] || [])) score[mid] = (score[mid] || 0) + 1;
  }
  const all = corpus.thematic_modules.filter(m => score[m.id]);
  all.sort((a, b) => (score[b.id] || 0) - (score[a.id] || 0));
  return all.slice(0, limit);
}

// Sous-navigation entre les 4 sections — injectée dans chaque page
export function renderSubnav(active) {
  const items = [
    { id: 'auteur',   href: '/pages/iskandari/auteur/',   label: 'L\'auteur' },
    { id: 'hikam',    href: '/pages/iskandari/hikam/',    label: 'Les Sagesses' },
    { id: 'munajat',  href: '/pages/iskandari/munajat/',  label: 'Munājāt' },
    { id: 'traites',  href: '/pages/iskandari/traites/',  label: 'Les deux traités' }
  ];
  return `
    <nav class="isk-subnav" aria-label="Sections de La voie des sagesses">
      <ul class="isk-subnav__list">
        ${items.map(i => `
          <li><a href="${i.href}" ${active===i.id?'class="is-active"':''}>${i.label}</a></li>
        `).join('')}
      </ul>
    </nav>`;
}

// === Chargement du Kitāb al-Ḥikam complet (texte + commentaire) ===
let _hikam = null;
export async function loadHikam() {
  if (_hikam) return _hikam;
  const res = await fetch('/data/iskandari/hikam-complet.json');
  _hikam = await res.json();
  return _hikam;
}

// Index par chapitre (section_id → liste de records)
export function indexByChapter(hikam) {
  const idx = {};
  for (const r of hikam.records || []) {
    const sec = r.section_id || 'autre';
    (idx[sec] = idx[sec] || []).push(r);
  }
  // sort each by sequence_in_section
  for (const k of Object.keys(idx)) {
    idx[k].sort((a, b) => (a.sequence_in_section || a.id) - (b.sequence_in_section || b.id));
  }
  return idx;
}

// Liste ordonnée des sections (chapitres) telles qu'elles apparaissent
export const CHAPTERS_ORDER = [
  'chapter_01','chapter_02','chapter_03','chapter_04','chapter_05','chapter_06',
  'chapter_07','chapter_08','chapter_09','chapter_10','chapter_11','chapter_12',
  'chapter_13','chapter_14','chapter_15','chapter_16','chapter_17','chapter_18',
  'chapter_19','chapter_20','chapter_21','chapter_22','chapter_22_suite',
  'chapter_23','chapter_24','chapter_24_fin','letters','intimate_prayers_complete'
];
export const CHAPTER_TITRES_COURTS = {
  'chapter_01': 'Ch. 1 — Confiance en Dieu et nature de l\'action',
  'chapter_02': 'Ch. 2 — Le temps, la prédestination, la voie',
  'chapter_03': 'Ch. 3 — Connaissance de soi et attributs divins',
  'chapter_04': 'Ch. 4 — Se centrer sur Dieu',
  'chapter_05': 'Ch. 5 — L\'amitié, l\'esprit et le dhikr',
  'chapter_06': 'Ch. 6 — La mort du cœur et l\'espérance',
  'chapter_07': 'Ch. 7 — Ambitions, déceptions et épreuves',
  'chapter_08': 'Ch. 8 — L\'inspiration, la sagesse, la récompense',
  'chapter_09': 'Ch. 9 — Repentir, espérance, contraction/expansion',
  'chapter_10': 'Ch. 10 — La récompense, la privation comme bénédiction',
  'chapter_11': 'Ch. 11 — Tout vient de Dieu, passions et dualité',
  'chapter_12': 'Ch. 12 — Les litanies et les prières obligatoires',
  'chapter_13': 'Ch. 13 — Attributs humains et divins',
  'chapter_14': 'Ch. 14 — Le voile de la protection divine',
  'chapter_15': 'Ch. 15 — Se méfier des éloges des gens',
  'chapter_16': 'Ch. 16 — Être optimiste envers Dieu',
  'chapter_17': 'Ch. 17 — Les secrets des saints',
  'chapter_18': 'Ch. 18 — La prière humaine et les bienfaits divins',
  'chapter_19': 'Ch. 19 — L\'importance d\'être dans le besoin',
  'chapter_20': 'Ch. 20 — Les miracles ne sont pas un critère',
  'chapter_21': 'Ch. 21 — Choisir le difficile, et les actes obligatoires',
  'chapter_22': 'Ch. 22 — Deux types de lumière divine',
  'chapter_22_suite': 'Ch. 22 (suite) — Deux types de lumière divine',
  'chapter_23': 'Ch. 23 — Atteindre Dieu par la contemplation',
  'chapter_24': 'Ch. 24 — La présence divine est primordiale',
  'chapter_24_fin': 'Ch. 24 (fin) — La présence divine est primordiale',
  'letters': 'Les quatre lettres (appendices)',
  'intimate_prayers_complete': 'Munājāt — Prières intimes'
};

// Index par thème (utilise les recommended_modules du corpus pour mapper)
export async function indexByTheme(hikam, corpus) {
  const out = {};
  // Map id sagesse → modules recommandés (depuis corpus.hikam_entry_index)
  const idToMods = {};
  for (const e of (corpus.hikam_entry_index || [])) {
    idToMods[e.id] = e.recommended_modules || [];
  }
  for (const r of hikam.records || []) {
    const mods = idToMods[r.id] || [];
    for (const m of mods) (out[m] = out[m] || []).push(r);
  }
  return out;
}

export function injectSubnav(active) {
  const slot = document.getElementById('isk-subnav-slot');
  if (slot) slot.outerHTML = renderSubnav(active);
}

// Petit helper de rendu : nom transcription affichable
export function modCardHTML(mod) {
  return `
    <a class="isk-module-card" href="/pages/iskandari/theme/?id=${esc(mod.id)}">
      <p class="isk-module-card__ar" lang="ar" dir="rtl">${esc(mod.title_ar || '')}</p>
      <p class="isk-module-card__tr">${esc(mod.transliteration || '')}</p>
      <h3 class="isk-module-card__title">${esc(mod.title_fr || '')}</h3>
    </a>`;
}
