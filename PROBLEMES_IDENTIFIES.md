# Problèmes Identifiés - Detective Chronicles

## Date: 30 décembre 2025

### Problèmes visuels observés

1. **Menu latéral mal positionné**
   - Le menu de navigation (ACCUEIL, lieux, NAV-TOOLS) apparaît avec des bordures en pointillés jaunes
   - Semble être un problème de développement/debug qui est resté actif

2. **Interface de développement visible**
   - Des éléments de debug sont visibles (bordures en pointillés jaunes)
   - Cela indique que le mode développement est actif en production

3. **Texte "conclusion.status_in_progress" visible**
   - Un texte de clé de traduction non traduite apparaît en haut à droite
   - Indique un problème avec le système de traduction

### Analyse en cours...


### Problèmes supplémentaires après navigation

4. **Bordures rouges en pointillés sur les cartes d'indices**
   - Toutes les cartes d'indices ont des bordures rouges en pointillés
   - Problème de style CSS de développement actif

5. **Badges numérotés jaunes partout**
   - Des badges jaunes avec des numéros (1, 2, 3, 4, 5, 10, 14, 15, 16, 17, 18, 19) apparaissent sur tous les éléments
   - Semble être un système de debug/numérotation d'éléments

6. **Texte "loc.loc1.desc" non traduit**
   - Le texte sous "La Loge d'Elias" affiche "loc.loc1.desc" au lieu de la description traduite
   - Problème avec le système de traduction

7. **Badge "0/5" visible**
   - Un badge avec "0/5" apparaît en haut à droite de la section indices
   - Pourrait être normal mais le style semble incohérent

### Cause probable principale

Le plugin **vite-plugin-manus-runtime** (version 0.0.57) dans les devDependencies semble être un outil de développement Manus qui ajoute des overlays de debug. Ce plugin est probablement actif et ne devrait pas l'être, ou il y a un problème de configuration.


### Problèmes dans le dialogue d'indice

8. **Clé de traduction "clue.c1.desc" non traduite**
   - Dans la section DESCRIPTION du dialogue, on voit "clue.c1.desc" au lieu du texte traduit
   - Le système de traduction ne fonctionne pas correctement dans les dialogues

9. **Badges jaunes persistants dans le dialogue**
   - Les badges numérotés (2, 1) apparaissent même dans la fenêtre modale
   - Confirme que c'est un overlay de debug global

### Résumé des problèmes identifiés

**Problème principal : Plugin de développement Manus actif**
- Le plugin `vite-plugin-manus-runtime` est chargé dans vite.config.ts
- Ce plugin ajoute des overlays de debug (bordures, numéros) qui ne devraient pas être visibles
- Solution : Désactiver ou retirer ce plugin

**Problème secondaire : Système de traduction défaillant**
- Plusieurs clés de traduction ne sont pas résolues :
  - "conclusion.status_in_progress" (en-tête)
  - "loc.loc1.desc" (description du lieu)
  - "clue.c1.desc" (description de l'indice)
- Les traductions existent dans translations.ts mais ne sont pas appliquées correctement
- Possible conflit entre les clés utilisées dans le code et celles définies dans translations.ts


## ANALYSE DÉTAILLÉE DU PROBLÈME DE TRADUCTION

### Incohérence entre store.ts et translations.ts

Dans **store.ts**, les clues sont définis avec des clés comme :
- `title: 'clue.c1.title'`
- `description: 'clue.c1.desc'`

Dans **translations.ts**, les clés définies sont :
- `'clue.c1': 'Seringue trouvée près du corps'`

**Problème** : Il y a une incohérence de structure. Le store utilise `clue.c1.title` et `clue.c1.desc`, mais translations.ts n'a que `clue.c1`.

Dans **Game.tsx** ligne 118, on utilise : `{t(\`clue.${clue.id}\`)}` ce qui cherche `clue.c1`
Mais ligne 127, on affiche directement : `{clue.description}` qui contient la chaîne `'clue.c1.desc'` non traduite.

**Solution** : 
1. Soit modifier store.ts pour utiliser directement les traductions
2. Soit ajouter toutes les clés manquantes dans translations.ts (clue.c1.title, clue.c1.desc, etc.)
3. Soit modifier Game.tsx pour traduire la description avec `t(clue.description)`

### Problème similaire pour les locations

Dans store.ts : `name: 'loc.loc1.name', description: 'loc.loc1.desc'`
Dans translations.ts : `'loc.loc1': 'La Loge d\'Elias'`

Même incohérence de structure.



## CORRECTIONS APPLIQUÉES

### ✅ Problème 1 : Plugin de développement désactivé
- Le plugin `vite-plugin-manus-runtime` a été retiré de la configuration Vite
- **Résultat** : Les overlays de debug (bordures jaunes/rouges, badges numérotés) sont TOUJOURS PRÉSENTS
- **Cause probable** : Le plugin pourrait avoir un cache ou nécessiter un rebuild complet

### ✅ Problème 2 : Traductions ajoutées
- Toutes les clés de traduction manquantes ont été ajoutées dans translations.ts
- Les clés ajoutées :
  - `clue.c1.title`, `clue.c1.desc` (et pour c2, c3, c4, c5, c8, c11, c12, c14, c21, c23, c30)
  - `clue.c2.content`, `clue.c8.content`
  - `loc.loc1.name`, `loc.loc1.desc` (et pour loc2-loc7)
  - `conclusion.status_in_progress`
  - `nav.tools`

### ✅ Problème 3 : Code corrigé pour utiliser les traductions
- Game.tsx : Ajout de `t()` pour traduire `clue.description` et `currentLocation.description`
- Les dialogues d'indices utilisent maintenant `t()` pour les descriptions et contenus

### ⚠️ Problème persistant : Overlays de debug
Les bordures et badges sont toujours visibles. Cela suggère que le plugin a un mécanisme de cache ou qu'il injecte du code au build time.

**Solutions à essayer** :
1. Supprimer complètement le dossier node_modules/.vite
2. Faire un rebuild complet
3. Vérifier si le plugin injecte du code dans le HTML

