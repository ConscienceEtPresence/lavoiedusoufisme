/* ============================================================
   SERVICE WORKER — La voie du dedans
   Cache stratégique : network-first pour HTML/JSON, cache-first pour assets
   ============================================================ */

const VERSION = 'lvdd-v27';
const STATIC_CACHE = `${VERSION}-static`;
const RUNTIME_CACHE = `${VERSION}-runtime`;

// Ressources critiques à précacher (l'accueil + assets essentiels)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/assets/css/base.css',
  '/assets/css/layout.css',
  '/assets/css/components.css',
  '/assets/css/accueil.css?v=9',
  '/assets/css/dark-mode.css?v=3',
  '/assets/js/main.js?v=14',
  '/assets/js/search.js?v=5',
  '/assets/js/tirage-global.js?v=3',
  '/manifest.webmanifest',
];

// Install — précache les ressources de base
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS).catch(err => console.warn('Precache miss:', err)))
      .then(() => self.skipWaiting())
  );
});

// Activate — nettoie les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !k.startsWith(VERSION))
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch — stratégies adaptées
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Ne gère que les requêtes GET sur la même origine
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // Stratégie 1 : Network-first pour HTML et JSON (toujours le frais si réseau, fallback cache si offline)
  if (req.destination === 'document' || req.headers.get('accept')?.includes('text/html') || url.pathname.endsWith('.json')) {
    event.respondWith(
      fetch(req)
        .then(res => {
          // Cache la réponse pour usage offline ultérieur
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(RUNTIME_CACHE).then(cache => cache.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req).then(res => res || caches.match('/index.html')))
    );
    return;
  }

  // Stratégie 2 : Cache-first pour les assets (CSS, JS, images, fonts)
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        // Cache si la réponse est valide
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(req, clone));
        }
        return res;
      });
    })
  );
});

// Message — permet de forcer la mise à jour
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
