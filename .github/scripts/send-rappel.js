/* ============================================================
   Envoi des rappels push (Firebase Cloud Messaging, API v1)
   - Avec TOKEN défini  → envoie à ce seul appareil (test).
   - Sans TOKEN         → envoie à TOUS les jetons stockés (rappel réel).
   Tourne sur un runner GitHub Actions (gratuit). Le compte de service
   est lu depuis le secret FIREBASE_SA (jamais dans le code).
   ============================================================ */
const admin = require('firebase-admin');

const sa = JSON.parse(process.env.FIREBASE_SA);
admin.initializeApp({ credential: admin.credential.cert(sa) });

const TITLE = process.env.TITLE && process.env.TITLE.trim() ? process.env.TITLE : 'Le soir vient';
const BODY  = process.env.BODY  && process.env.BODY.trim()  ? process.env.BODY  : 'Veux-tu déposer ta journée ?';
const LINK  = process.env.LINK  && process.env.LINK.trim()  ? process.env.LINK  : 'https://lavoiedudedans.fr/pages/carnet/aujourdhui/';
const TOKEN = (process.env.TOKEN || '').trim();

function message(token) {
  return {
    token,
    notification: { title: TITLE, body: BODY },
    webpush: {
      notification: { icon: 'https://lavoiedudedans.fr/assets/img/icon-192.png', badge: 'https://lavoiedudedans.fr/assets/img/favicon-32.png' },
      fcmOptions: { link: LINK }
    }
  };
}

(async () => {
  const messaging = admin.messaging();

  // --- Mode TEST : un seul appareil ---
  if (TOKEN) {
    const id = await messaging.send(message(TOKEN));
    console.log('✓ Rappel de test envoyé →', id);
    return;
  }

  // --- Mode RÉEL : tous les appareils enregistrés ---
  const db = admin.firestore();
  const snap = await db.collection('push_tokens').get();
  const tokens = snap.docs.map(d => d.id);
  console.log(tokens.length + ' jeton(s) à notifier.');

  let ok = 0; const morts = [];
  for (const t of tokens) {
    try { await messaging.send(message(t)); ok++; }
    catch (e) {
      console.warn('  échec (' + (e.code || e.message) + ')');
      if (e.code === 'messaging/registration-token-not-registered' || e.code === 'messaging/invalid-registration-token') morts.push(t);
    }
  }
  // Nettoyage des jetons morts (appareils désinscrits)
  for (const t of morts) { try { await db.collection('push_tokens').doc(t).delete(); } catch (e) {} }
  console.log('✓ Envoyés :', ok, '· jetons morts supprimés :', morts.length);
})().catch((e) => { console.error('ERREUR', e); process.exit(1); });
