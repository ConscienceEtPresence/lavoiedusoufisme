/* ============================================================
   Configuration Firebase — Le carnet du dedans
   Cette clé publique est OK côté client : la vraie sécurité
   passe par les Firestore Rules.
   ============================================================ */
export const firebaseConfig = {
  apiKey: "AIzaSyBYlX1AcOP4Yg5rCy9T5tIcrV0WOTT3E24",
  authDomain: "la-voie-du-dedans.firebaseapp.com",
  projectId: "la-voie-du-dedans",
  storageBucket: "la-voie-du-dedans.firebasestorage.app",
  messagingSenderId: "531110328878",
  appId: "1:531110328878:web:322ac57d9504e750b83dbf"
};

/* Modèle des données dans Firestore :

   carnets/{codeId}/
     ├── profil                  { prenom, motGraine, creeLe, langue }
     ├── jours/{2026-06-08}/     { matin, soir, notes... }
     └── ...

   codes/{codeId}                 { prenom, motGraine, actif, creeLe, dernierLogin, note }
   demandes/{ticketId}            { prenom, message, contact, creeLe, statut }
   suggestions/{id}               { message, creeLe, codeId (facultatif), statut }
*/
