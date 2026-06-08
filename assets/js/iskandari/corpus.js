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

// Sous-navigation entre les 5 sections — injectée dans chaque page
export function renderSubnav(active) {
  const items = [
    { id: 'auteur',   href: '/pages/iskandari/auteur/',   label: 'L\'auteur' },
    { id: 'hikam',    href: '/pages/iskandari/hikam/',    label: 'Sagesses' },
    { id: 'mediter',  href: '/pages/iskandari/themes/',   label: 'Méditer par thème' },
    { id: 'traites',  href: '/pages/iskandari/traites/',  label: 'Les deux traités' },
    { id: 'munajat',  href: '/pages/iskandari/munajat/',  label: 'Munājāt' }
  ];
  return `
    <nav class="isk-subnav" aria-label="Sections d'Iskandarī">
      <ul class="isk-subnav__list">
        ${items.map(i => `
          <li><a href="${i.href}" ${active===i.id?'class="is-active"':''}>${i.label}</a></li>
        `).join('')}
      </ul>
    </nav>`;
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
