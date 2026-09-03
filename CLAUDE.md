# Priozen — Contexte projet

## Statut actuel (mis à jour)

- ✅ Maquettes complètes (toutes les vues, light + dark)
- ✅ Palette définie — tokens light/dark documentés
- ✅ Icônes et favicons exportés (iOS light/dark/tinted, Android, Splash, Favicons)
- ✅ 33 tickets Trello (11 epics, 103 points) — CSV + DOCX générés
- ✅ Architecture déploiement : EAS (mobile) + Vercel (web) + Scaleway (backend)
- ✅ CLAUDE.md rédigé et intégré au projet Expo
- ✅ Nom **Priozen** vérifié et sécurisé :
  - Domaine `priozen.app` acheté (OVH — 10,19€ TTC/an), DNSSEC inclus
  - `contact@priozen.app` configuré dans Apple Mail
  - App Store — libre
  - Play Store — libre
  - EUIPO classe 42 — libre
  - Instagram/TikTok @priozen — libres
  - ⚠️ X (Twitter) @priozen — compte fantôme, squatté → enregistrer **@priozenapp** à la place
- ✅ MSW-00 — Setup infrastructure MSW terminé (handlers auth/tasks/folders/user, native.ts + worker.ts, `startMocks()` intégré dans `app/_layout.tsx`)
- ✅ MSW-01 — Génération de données mockées (factories Faker.js pour users/tasks/folders/subtasks) terminé
- ⏳ Backend : pas encore prêt

## Assets produits

- ✅ `ios-light.png` — 1024×1024, fond blanc
- ✅ `ios-dark.png` — 1024×1024, fond #0A0918
- ✅ `ios-tinted.png` — 1024×1024, fond noir + logo blanc (iOS 18)
- ✅ `adaptive-icon.png` — 1024×1024, fond transparent (Android foreground)
- ✅ `monochrome-icon.png` — 1024×1024, fond transparent, noir uniquement
- ✅ `splash-icon-light.png` / `splash-icon-dark.png` — 200×200, fond transparent
- ✅ `favicon.ico` — multi-size 16+32+48
- ✅ `favicon-32x32.png`, `favicon-180x180.png`, `favicon-dark-32x32.png`

## CI/CD — Architecture validée

```
Pull Request ouverte
        │
GitHub Actions (OPS-02)
  ├── lint + typecheck
  ├── tests Vitest
  └── expo export --platform web
        │
Merge sur main
        │
        ├── GitHub Actions → Vercel (web)
        ├── GitHub Actions → Scaleway (backend)
        └── EAS Build → App Store / Play Store
```

- GitHub Actions : lint + tests + build web (OPS-02)
- GitHub Actions → Vercel (web) + Scaleway (backend) sur merge main (OPS-03a)
- EAS Build + EAS Submit : compilation et soumission stores (OPS-03b)
- EAS Update : mises à jour OTA sans passer par les stores
- Ticket manquant à créer : EAS-01 (configuration eas.json, profils dev/preview/prod)

## Tickets Trello — détail par epic (33 tickets · 11 epics · 103 points)

| Epic                          | Tickets | Points |
| ----------------------------- | ------- | ------ |
| MSW — Infrastructure mocking  | 2       | 6 pts  |
| EPIC 1 — Authentification     | 4       | 13 pts |
| EPIC 2 — Dashboard principal  | 4       | 21 pts |
| EPIC 3 — Gestion des tâches   | 2       | 8 pts  |
| EPIC 4 — Gestion des dossiers | 2       | 6 pts  |
| EPIC 5 — Profil utilisateur   | 1       | 3 pts  |
| EPIC 6 — Mode Concentration   | 1       | 5 pts  |
| EPIC 7 — Analytics            | 1       | 8 pts  |
| EPIC 8 — Mobile               | 2       | 8 pts  |
| EPIC 9 — États vides & UX     | 3       | 7 pts  |
| DevOps + Déploiement          | 11      | 18 pts |

## Prochaine tâche

AUTH-01 — Page Connexion (prochain ticket du backlog). MSW-00 et MSW-01 sont terminés.

## Présentation

Application de gestion de tâches basée sur la méthode Eisenhower.
Nom du projet : **Priozen** (anciennement ZenTask Pro, puis Priolist).

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

| Token             | Light   | Dark    |
| ----------------- | ------- | ------- |
| `--primary`       | #4F46E5 | #818CF8 |
| `--primary-hover` | #4338CA | #6366F1 |
| `--success`       | #10B981 | #10B981 |
| `--bg-page`       | #F9FAFB | #0A0918 |
| `--bg-card`       | #FFFFFF | #13111F |
| `--bg-sidebar`    | #1E1B4B | #0A0918 |
| `--text-primary`  | #1E293B | #E0E7FF |
| `--text-muted`    | #64748B | #94A3B8 |
| `--border`        | #E2E8F0 | #312E81 |

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
