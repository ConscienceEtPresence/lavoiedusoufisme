/* ============================================================
   Service Worker dédié à Firebase Cloud Messaging (notifications push)
   Affiche les rappels quand l'app est fermée / l'écran verrouillé.
   ============================================================ */
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBYlX1AcOP4Yg5rCy9T5tIcrV0WOTT3E24",
  authDomain: "la-voie-du-dedans.firebaseapp.com",
  projectId: "la-voie-du-dedans",
  storageBucket: "la-voie-du-dedans.firebasestorage.app",
  messagingSenderId: "531110328878",
  appId: "1:531110328878:web:322ac57d9504e750b83dbf"
});

const messaging = firebase.messaging();

// Affiche la notification à partir d'un message « data » (méthode fiable iOS).
function afficher(d) {
  d = d || {};
  return self.registration.showNotification(d.title || 'La voie du dedans', {
    body: d.body || '',
    icon: '/assets/img/icon-192.png',
    badge: '/assets/img/favicon-32.png',
    tag: 'lvdd-rappel',
    data: { url: d.url || '/pages/carnet/aujourdhui/' }
  });
}

// Message reçu pendant que l'app est en arrière-plan (message « data »)
messaging.onBackgroundMessage((payload) => {
  afficher(payload.data);
});

// Filet de sécurité : si l'événement push brut arrive, on affiche aussi.
self.addEventListener('push', (event) => {
  let d = {};
  try { const j = event.data ? event.data.json() : {}; d = j.data || j.notification || j; } catch (e) {}
  if (d && (d.title || d.body)) event.waitUntil(afficher(d));
});

// Clic sur la notification → ouvre / ramène le carnet
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/pages/carnet/aujourdhui/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ('focus' in c) { c.navigate && c.navigate(url); return c.focus(); } }
      return clients.openWindow(url);
    })
  );
});
