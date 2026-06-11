# Rapport - Carnet de bord : limitation actuelle sur les objectifs multi-thèmes

Dernière mise à jour : 2026-06-11

## Objet du rapport

Ce document décrit un problème d'usage rencontré dans le carnet de bord de *La voie du dedans*, plus précisément dans le parcours "Poser ma journée".

Le besoin exprimé est le suivant : pouvoir choisir, pour une même journée, plusieurs objectifs issus de plusieurs thèmes ou vigilances différentes. Par exemple :

- Présence : "Manger lentement, un repas en présence"
- Parole : "Ne pas couper la parole"
- Gratitude : "Remercier intérieurement quelqu'un"

Actuellement, le carnet ne permet pas naturellement ce fonctionnement.

## Comportement actuel observé

Aujourd'hui, le carnet fonctionne selon ce modèle :

```text
1 journée = 1 vigilance principale + plusieurs objectifs appartenant à cette vigilance
```

Exemple :

1. L'utilisateur entre dans le carnet.
2. Il pose sa journée.
3. Il choisit la vigilance "Présence".
4. Il sélectionne l'objectif "Manger lentement, un repas en présence".
5. Plus tard, il clique sur "Modifier mon choix".
6. Le carnet lui repropose les objectifs de "Présence", mais ne lui propose pas directement les objectifs des autres vigilances comme "Parole", "Gratitude", "Écoute", etc.

Le résultat est que l'utilisateur ne peut pas simplement ajouter un objectif d'un autre thème à la journée déjà posée.

## Comportement attendu

Le comportement souhaité serait plutôt :

```text
1 journée = plusieurs objectifs, éventuellement issus de plusieurs vigilances
```

L'utilisateur devrait pouvoir composer sa journée comme une petite liste d'engagements, par exemple :

```text
Aujourd'hui, je porte :
- Présence : manger lentement un repas
- Parole : ne pas couper la parole
- Gratitude : remercier intérieurement quelqu'un
```

Il ne s'agit donc pas seulement de "changer de vigilance", mais d'ajouter ou retirer librement des objectifs dans plusieurs familles.

## Cause technique principale

Le fichier principal concerné est :

```text
assets/js/carnet/poser.js
```

Dans ce fichier, les objectifs affichés sont filtrés selon une seule vigilance active :

```js
const objs = objectifs.filter(o => o.vigilance === v.id);
```

Cela signifie que si la vigilance active est "presence", seuls les objectifs rattachés à "presence" sont affichés.

Le modèle sauvegardé dans Firestore repose aussi sur une seule vigilance principale :

```js
matin: {
  ancrage: state.ancrage || null,
  vigilanceId: state.vigilanceId,
  objectifsIds: state.objectifsIds,
  personnel: personnel || null,
  poseLe: serverTimestamp()
}
```

Les champs importants sont :

- `matin.vigilanceId` : une seule vigilance principale.
- `matin.objectifsIds` : liste d'objectifs, mais pensée comme appartenant à cette vigilance.
- `matin.personnel` : un seul objectif libre personnel.

## Zones impactées

La modification ne concerne pas uniquement l'écran du matin. Plusieurs écrans supposent actuellement qu'une journée possède une seule vigilance principale.

### 1. Tableau de bord du carnet

Fichier :

```text
assets/js/carnet/aiguilleur.js
```

Le tableau de bord affiche la vigilance du jour et les objectifs associés. Il marque une seule vigilance comme "aujourd'hui".

Impact possible : si plusieurs vigilances sont choisies, il faudra afficher une liste groupée par vigilance au lieu d'une seule vigilance principale.

### 2. Écran "Poser ma journée"

Fichier :

```text
assets/js/carnet/poser.js
```

C'est l'écran central du problème. Il faut revoir l'interface pour permettre :

- soit des onglets par vigilance ;
- soit une liste de toutes les vigilances avec leurs objectifs ;
- soit un bouton "Ajouter un objectif d'un autre thème".

### 3. Écran du soir "Relire ma journée"

Fichier :

```text
assets/js/carnet/relire.js
```

Le bilan du soir affiche :

```text
Vous portiez la vigilance de ...
Comment vos objectifs ont-ils été vécus ?
```

Impact possible : si plusieurs vigilances sont choisies, le bilan devrait grouper les objectifs par vigilance, ou parler plus largement des "engagements du jour".

### 4. Historique

Fichier :

```text
assets/js/carnet/historique.js
```

L'historique compte et affiche actuellement une seule vigilance par journée via `matin.vigilanceId`.

Impact possible : une journée multi-thèmes devra apparaître avec plusieurs vigilances, ou bien avec une vigilance principale plus des objectifs secondaires.

### 5. Miroir du chemin

Fichier :

```text
assets/js/carnet/miroir.js
```

Le miroir calcule "vers quoi le cœur est revenu" en comptant `matin.vigilanceId`.

Impact possible : si une journée contient plusieurs vigilances, le miroir devra compter toutes les vigilances réellement travaillées, pas seulement une vigilance principale.

## Autre point de vigilance repéré

Il existe deux chemins différents :

1. Passer par une carte d'une autre vigilance depuis le tableau de bord.
2. Cliquer sur "Modifier mon choix", puis "Changer de vigilance".

Ces deux chemins ne se comportent pas exactement de la même manière.

Dans certains cas, les anciens objectifs sont vidés quand on change de vigilance. Dans d'autres cas, ils peuvent rester en mémoire interne tant que la page n'est pas rechargée. Cela peut créer une incohérence : la vigilance principale affichée peut être "Parole", alors que la liste d'objectifs contient encore des objectifs de "Présence".

Ce point devra être clarifié lors de la correction.

## Deux options de correction possibles

### Option A - Garder le modèle "une vigilance par jour"

Dans cette option, le carnet conserve sa logique actuelle :

```text
1 journée = 1 vigilance
```

Il faut alors clarifier l'interface :

- remplacer "Modifier mon choix" par "Modifier cette vigilance" ;
- expliquer que choisir une autre vigilance remplace la précédente ;
- vider systématiquement les anciens objectifs quand on change de vigilance ;
- éviter toute ambiguïté entre "changer" et "ajouter".

Avantage : correction plus simple.

Inconvénient : ne répond pas au besoin exprimé de combiner plusieurs thèmes.

### Option B - Passer au modèle multi-thèmes

Dans cette option, le carnet évolue vers :

```text
1 journée = plusieurs objectifs issus de plusieurs vigilances
```

Il faudrait alors modifier le modèle de données. Par exemple :

```js
matin: {
  ancrage: "...",
  objectifs: [
    { id: "manger-lentement", vigilance: "presence" },
    { id: "ne-pas-couper-parole", vigilance: "parole" },
    { id: "remercier-interieurement", vigilance: "gratitude" }
  ],
  personnels: [
    { texte: "...", vigilance: "presence" }
  ],
  poseLe: serverTimestamp()
}
```

Ou conserver l'ancien champ pour compatibilité, mais ajouter un nouveau champ :

```js
matin: {
  vigilanceId: "presence",
  objectifsIds: ["manger-lentement"],
  objectifsMulti: [
    { id: "manger-lentement", vigilance: "presence" },
    { id: "ne-pas-couper-parole", vigilance: "parole" }
  ]
}
```

Avantage : répond au besoin réel.

Inconvénient : demande une adaptation de plusieurs écrans.

## Recommandation

La recommandation est de choisir l'option B, car elle correspond mieux à l'usage exprimé.

Le carnet ne devrait plus enfermer la journée dans une seule vigilance. La vigilance peut rester une porte d'entrée contemplative, mais l'utilisateur devrait pouvoir ajouter ensuite d'autres objectifs depuis d'autres thèmes.

Formulation fonctionnelle proposée :

```text
Aujourd'hui, je choisis une première vigilance, puis je peux ajouter d'autres objectifs si nécessaire.
```

Il faudrait donc distinguer :

- la vigilance d'entrée, ou vigilance principale ;
- les objectifs réellement portés dans la journée ;
- les vigilances secondaires associées à ces objectifs.

## Résumé pour intervention technique

Travail à prévoir :

1. Modifier `poser.js` pour permettre l'ajout d'objectifs depuis plusieurs vigilances.
2. Adapter la sauvegarde Firestore pour stocker les objectifs avec leur vigilance.
3. Adapter `aiguilleur.js` pour afficher les objectifs groupés par thème.
4. Adapter `relire.js` pour faire le bilan objectif par objectif, même s'ils viennent de plusieurs vigilances.
5. Adapter `historique.js` pour afficher toutes les vigilances travaillées dans une journée.
6. Adapter `miroir.js` pour compter les vigilances réellement présentes dans les objectifs du jour.
7. Prévoir une compatibilité avec les anciennes journées qui n'ont que `vigilanceId` et `objectifsIds`.

## Conclusion

Le problème rencontré n'est pas une simple erreur d'affichage. C'est une limite de conception du carnet actuel.

Le carnet a été pensé comme une pratique quotidienne centrée sur une seule vigilance. L'usage souhaité est plus souple : composer une journée avec plusieurs objectifs concrets issus de plusieurs thèmes.

Une évolution du modèle et de l'interface est donc nécessaire pour que le carnet corresponde à cet usage.
