# Guide de Démarrage Rapide - Detective Chronicles

## Installation et Lancement

### Prérequis
- Node.js 22.x ou supérieur
- pnpm (gestionnaire de paquets)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/wodakim/detective-chronicles.git
cd detective-chronicles

# Installer les dépendances
pnpm install
```

### Lancement en Mode Développement

```bash
# Démarrer le serveur de développement
pnpm dev
```

Le jeu sera accessible à l'adresse : **http://localhost:3000**

### Build de Production

```bash
# Créer un build optimisé
pnpm build

# Prévisualiser le build de production
pnpm preview
```

---

## Structure du Projet

```
detective-chronicles/
├── client/                 # Code source du client
│   ├── src/
│   │   ├── components/    # Composants React réutilisables
│   │   ├── lib/          # Bibliothèques et utilitaires
│   │   │   ├── store.ts  # Gestion d'état du jeu (Zustand)
│   │   │   └── translations.ts  # Système de traduction
│   │   ├── pages/        # Pages principales du jeu
│   │   │   └── Game.tsx  # Page principale du jeu
│   │   └── main.tsx      # Point d'entrée de l'application
│   └── index.html        # Template HTML
├── vite.config.ts        # Configuration Vite
└── package.json          # Dépendances et scripts
```

---

## Fonctionnalités du Jeu

### Navigation
- **Accueil** : Exploration des différents lieux de l'enquête
- **Interrogatoires** : Questionnement des suspects
- **Carnet de Notes** : Consultation des indices collectés
- **Tableau de Déduction** : Connexion des indices pour résoudre l'enquête
- **Paramètres** : Configuration du jeu (langue, etc.)

### Lieux d'Enquête
1. **La Loge d'Elias** : Scène de crime principale
2. **Bureau de l'Agent Marcus Vane** : Bureau de l'agent artistique
3. **Appartement d'Elias** : Domicile de la victime
4. **Coulisses du Club** : Arrière-scène du club de jazz
5. **Bureau du Directeur** : Bureau du directeur du club
6. **Appartement de Sarah Jenkins** : Domicile de l'ex-compagne
7. **Clinique du Dr. Aris Thorne** : Clinique du frère d'Elias

### Système d'Indices
- **Types d'indices** : VISUAL, DOCUMENT, OBJECT, MEDICAL
- **Collecte** : Cliquer sur un indice pour l'examiner
- **Dialogue** : Chaque indice affiche un titre, une description et parfois un contenu détaillé

---

## Système de Traduction

Le jeu utilise un système de traduction basé sur des clés. Les langues supportées sont :
- **Français (fr)** : Langue par défaut
- **Anglais (en)** : En cours de développement
- **Polonais (pl)** : En cours de développement

### Structure des Clés de Traduction

```typescript
// Navigation
'nav.home': 'Accueil'
'nav.tools': 'Outils'

// Lieux
'loc.loc1': 'La Loge d\'Elias'
'loc.loc1.name': 'La Loge d\'Elias'
'loc.loc1.desc': 'Description du lieu'

// Indices
'clue.c1': 'Seringue trouvée près du corps'
'clue.c1.title': 'Seringue trouvée près du corps'
'clue.c1.desc': 'Description de l\'indice'
'clue.c1.content': 'Contenu détaillé (optionnel)'
```

### Ajouter une Nouvelle Traduction

1. Ouvrir `client/src/lib/translations.ts`
2. Ajouter la clé dans l'objet `fr` (et dans les autres langues si nécessaire)
3. Utiliser la fonction `t()` dans les composants pour accéder à la traduction

```typescript
const t = useTranslation(language);
const titre = t('clue.c1.title');
```

---

## Gestion d'État

Le jeu utilise **Zustand** pour la gestion d'état globale. Le store principal se trouve dans `client/src/lib/store.ts`.

### État Principal

```typescript
{
  language: 'fr' | 'en' | 'pl',
  currentLocationId: string,
  locations: Record<string, Location>,
  clues: Record<string, Clue>,
  discoveredClues: string[],
  connections: Connection[],
  // ... autres propriétés
}
```

### Actions Disponibles

- `setLanguage(lang)` : Changer la langue
- `setCurrentLocation(id)` : Changer de lieu
- `discoverClue(id)` : Découvrir un nouvel indice
- `addConnection(from, to)` : Créer une connexion entre indices
- `resetGame()` : Réinitialiser le jeu

---

## Développement

### Plugins Vite Utilisés

- **@vitejs/plugin-react** : Support de React avec Fast Refresh
- **@tailwindcss/vite** : Intégration de Tailwind CSS

### Plugins de Debug (Désactivés en Production)

Les plugins suivants ont été **retirés** pour éviter les overlays de développement :
- ~~vite-plugin-manus-runtime~~ : Ajoutait des overlays de sélection DOM
- ~~@builder.io/vite-plugin-jsx-loc~~ : Ajoutait des attributs `data-loc`

Si vous avez besoin de réactiver ces plugins pour le développement, modifiez `vite.config.ts` :

```typescript
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";

const plugins = [
  react(), 
  tailwindcss(), 
  jsxLocPlugin(),
  vitePluginManusRuntime()
];
```

---

## Déploiement

### Déploiement sur Vercel

1. Connecter votre dépôt GitHub à Vercel
2. Configurer le projet :
   - **Framework Preset** : Vite
   - **Build Command** : `pnpm build`
   - **Output Directory** : `dist`
3. Déployer

### Déploiement sur Netlify

1. Connecter votre dépôt GitHub à Netlify
2. Configurer le projet :
   - **Build Command** : `pnpm build`
   - **Publish Directory** : `dist`
3. Déployer

---

## Résolution de Problèmes

### Les traductions ne s'affichent pas

**Vérifier** :
1. La clé de traduction existe dans `translations.ts`
2. La fonction `t()` est correctement utilisée
3. La langue est correctement définie dans le store

### Les overlays de debug apparaissent

**Solution** :
1. Vérifier que les plugins de debug sont désactivés dans `vite.config.ts`
2. Nettoyer le cache : `rm -rf node_modules/.vite dist`
3. Relancer le serveur : `pnpm dev`

### Le serveur ne démarre pas

**Vérifier** :
1. Node.js est installé (version 22.x ou supérieure)
2. Les dépendances sont installées : `pnpm install`
3. Le port 3000 n'est pas déjà utilisé

---

## Support et Contribution

Pour toute question ou contribution, veuillez ouvrir une issue sur le dépôt GitHub :
https://github.com/wodakim/detective-chronicles

---

## Licence

Ce projet est sous licence MIT.
