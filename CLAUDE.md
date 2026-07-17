# Priolist — Contexte projet

## Présentation

Application de gestion de tâches basée sur la méthode Eisenhower.
Nom du projet : **Priolist** (anciennement ZenTask Pro).

## Stack technique

- **Frontend** : Expo (React Native) + expo-router + TypeScript
- **Styling** : NativeWind (TailwindCSS pour React Native)
- **Routing** : expo-router (routes basées sur les fichiers, dossier `app/`)
- **Cibles** : iOS, Android, Web (`expo start --web`, bundler Metro, output static)
- **Backend** : Node.js ou Python (pas encore prêt)
- **Base de données** : PostgreSQL (Scaleway, pas encore prête)
- **Déploiement mobile** : EAS (Expo Application Services)
- **CI/CD** : GitHub Actions + workflows EAS

## Statut actuel

⚠️ Le backend et la base de données ne sont pas encore prêts.
Le frontend tourne seul avec des données mockées (MSW — `msw/node` pour iOS/Android via `src/mocks/native.ts`, service worker pour le web via `src/mocks/worker.ts`).

## Palette de couleurs

- `--primary` : #4F46E5 (indigo 600)
- `--primary-hover` : #4338CA
- `--success` : #10B981 (émeraude)
- `--bg-page` : #F9FAFB
- `--bg-card` : #FFFFFF
- `--bg-sidebar` : #1E1B4B (indigo nuit)
- `--text-primary` : #1E293B
- `--text-muted` : #64748B
- `--border` : #E2E8F0

Non encore déclarées comme thème NativeWind dans `tailwind.config.js` (thème vide pour l'instant) — à ajouter dans `theme.extend.colors` si besoin de classes utilitaires dédiées.

## Badges Eisenhower

| Quadrant    | is_urgent | is_important | Couleur        | Label       |
| ----------- | --------- | ------------ | -------------- | ----------- |
| Critique    | true      | true         | Rouge #EF4444  | Critique    |
| À planifier | false     | true         | Indigo #4F46E5 | À planifier |
| À déléguer  | true      | false        | Ambre #F59E0B  | À déléguer  |
| Secondaire  | false     | false        | Gris #94A3B8   | Secondaire  |

## Typographie

- Titres : DM Serif Display
- Interface : Inter ou DM Sans

## Architecture des vues (à construire avec expo-router)

- `/login` — Connexion
- `/register` — Inscription (stepper 3 étapes + RGPD)
- `/forgot-password` — Mot de passe oublié
- `/cgu` — CGU avec barre de progression lecture
- `/` (dashboard) — Liste tâches groupées par quadrant
- `/folders/:id` — Vue dossier avec stats
- `/trash` — Corbeille (soft delete, purge 30j)
- `/profile` — Profil utilisateur + zone danger RGPD
- `/focus` — Mode concentration (3 cartes minimalistes)
- `/analytics` — Indice de lucidité + radar Eisenhower

## Conventions de code

- Toujours utiliser les variables d'environnement Expo (`EXPO_PUBLIC_API_URL`) pour l'URL API
- Ne jamais hardcoder d'URL
- Données mockées via MSW (`src/mocks/`) : handlers par domaine (`apiHandlers/tasksHandler.ts`, `authHandler.ts`, `userHandler.ts`, `foldersHandler.ts`), fixtures dans `src/mocks/data/fixtures.ts`
- Composants en PascalCase, hooks en camelCase avec préfixe `use`
- Styles via classes NativeWind (`className`), pas de StyleSheet sauf cas non couvert par Tailwind
- Alias d'import `@/*` disponible (voir `tsconfig.json`)

## Structure des données (contrat mocké MSW — à confirmer avec le futur backend)

Contrat actuellement implémenté par les fixtures/handlers MSW (`src/mocks/data/fixtures.ts`) : camelCase, quadrant Eisenhower encodé en un seul enum `quadrant` plutôt qu'en deux booléens séparés.

```typescript
type EisenhowerQuadrant = 'critical' | 'schedule' | 'delegate' | 'secondary';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface Folder {
  id: string;
  name: string;
  color: string; // hex
  userId: string;
  taskCount: number;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  quadrant: EisenhowerQuadrant;
  folderId: string | null;
  userId: string;
  dueDate: string | null;
  isDone: boolean;
  deletedAt: string | null; // soft delete (corbeille)
  createdAt: string;
  updatedAt: string;
}

interface SubTask {
  id: string;
  taskId: string;
  title: string;
  isDone: boolean;
}
```

Le tableau des badges Eisenhower ci-dessus (Critique/À planifier/À déléguer/Secondaire) correspond respectivement à `quadrant: 'critical' | 'schedule' | 'delegate' | 'secondary'`.

## Commandes utiles

```bash
npm run start          # démarre Expo (choix iOS/Android/Web)
npm run ios            # lance sur simulateur iOS
npm run android        # lance sur émulateur Android
npm run web            # lance en mode web (Metro)
npm run lint           # ESLint (expo lint)
npm run test           # Vitest
npm run test:watch     # Vitest en mode watch
npm run test:coverage  # Vitest avec couverture
```
