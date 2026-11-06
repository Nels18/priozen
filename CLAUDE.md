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
- ✅ AUTH-01 — Page Connexion (thème NativeWind, polices, i18n fr/en, client API)
- 🔄 DASH-01 — Layout global responsive (sidebar, en-tête, panneau droit, nav mobile) — en revue
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

Objectif POC (label Jira `POC`) : AUTH-01 → DASH-01 → DASH-02 → TASK-01, puis DEVOPS-12 (build web en CI) et DEVOPS-04 (Vercel). AUTH-01 terminé, DASH-01 (layout global) en revue ; prochaine tâche : DASH-02 — Liste de tâches groupées par quadrant.

## Présentation

Application de gestion de tâches basée sur la méthode Eisenhower.
Nom du projet : **Priozen** (anciennement ZenTask Pro, puis Priolist).

⚠️ **Exception EAS** : le projet EAS existant (`projectId: 0cb7e9a8-7547-4f3e-be66-ed5a78ee8ed0`, avec un historique de builds iOS/Android réels) garde le **slug `Priolist`** dans `app.json` — aucune commande `eas` ne permet de renommer le slug d'un projet existant (`eas init --force` écrase le slug local pour matcher le serveur, pas l'inverse). Le `name` (Priozen) et les bundle identifiers (`com.priozen.app`) sont bien à jour ; seul le slug technique (URL `expo.dev/.../Priolist`, invisible aux utilisateurs finaux) reste sur l'ancien nom, en attendant un éventuel renommage via le support Expo.

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

Déclarées comme variables CSS dans `global.css` (bascule light/dark automatique via `prefers-color-scheme`) et exposées en classes NativeWind dans `tailwind.config.js` : `bg-page`, `bg-card`, `bg-input`, `bg-sidebar`, `text-text`, `text-muted`, `border-border`, `bg-primary` / `primary-hover` / `primary-light`, et par quadrant `critical`, `schedule`, `delegate`, `secondary` (+ variante `-bg`). Toujours utiliser ces classes sémantiques, jamais de couleur en dur ni de variante `dark:`.

- Couleurs identiques dans les deux thèmes (blanc, premier plan de la sidebar) : `src/theme/fixedColors.js`, utilisé par `tailwind.config.js` (`text-sidebar-text`, `bg-sidebar-active`…) et par les composants qui attendent une couleur brute
- Props de couleur brute qui suivent le thème (icônes, `placeholderTextColor`) : `useIconColors()` (`src/theme/useIconColors.ts`), à garder synchronisé avec `global.css`
- Couleurs par quadrant : `QUADRANT_CLASSES` (`src/tasks/quadrants.ts`) — pastille, badge, texte ; ne jamais réécrire les classes `bg-critical`… à la main

Maquette de référence (responsive mobile / tablette / bureau) : https://claude.ai/artifact/UWBMeXCP5cPEhwteH7VoCV

## Badges Eisenhower

| Quadrant    | is_urgent | is_important | Couleur        | Label       |
| ----------- | --------- | ------------ | -------------- | ----------- |
| Critique    | true      | true         | Rouge #EF4444  | Critique    |
| À planifier | false     | true         | Indigo #4F46E5 | À planifier |
| À déléguer  | true      | false        | Ambre #F59E0B  | À déléguer  |
| Secondaire  | false     | false        | Gris #94A3B8   | Secondaire  |

## Typographie

- Titres : DM Serif Display → classe `font-serif`
- Interface : Inter → `font-sans`, `font-sans-medium`, `font-sans-semibold`, `font-sans-bold` (une famille par graisse : le natif ne synthétise pas les graisses des polices custom ; chargées dans `app/_layout.tsx`)
- Taille `text-caption` (13px) pour le texte secondaire de la maquette (libellés, liens, légendes) — pas de `text-[13px]`

## Architecture des vues (expo-router)

Deux groupes de routes (les parenthèses n'apparaissent pas dans l'URL), chacun avec un `_layout.tsx` qui sert de garde :

- `app/(auth)/` — écrans publics sans sidebar (`login`, `register`, `forgot-password`, `cgu`) ; un utilisateur connecté est renvoyé vers `/`
- `app/(protected)/` — écrans connectés, rendus dans l'`AppShell` (`src/components/layout/`) ; sans session → `/login`
- URL centralisées dans `ROUTES` (`src/navigation/routes.ts`) — jamais de chemin en dur ; les 5 entrées de navigation (sidebar + onglets mobiles) dans `NAV_ITEMS` (`src/navigation/navItems.ts`)
- Mise en page responsive selon `useScreenSize()` (`src/layout/screenSize.ts`) : `small` < 768px (en-tête + onglets en bas + bouton « + »), `medium` 768–1279px (sidebar 240px + en-tête), `large` ≥ 1280px (sidebar 260px + en-tête + panneau droit 280px) — c'est la largeur disponible, pas le type d'appareil
- Contenu d'un écran connecté dans `<Screen>` (défilement + marges par taille) ; écran pas encore livré → `<ScreenPlaceholder ticket="…">`

Vues :

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
- Données mockées via MSW (`src/mocks/`) : handlers par domaine (`apiHandlers/tasksHandler.ts`, `authHandler.ts`, `userHandler.ts`, `foldersHandler.ts`), fixtures dans `src/mocks/data/fixtures.ts` (avec `MOCK_USER_ID`, `MOCK_PASSWORD`, `MOCK_TOKEN`) ; en dev, données aléatoires générées par les factories Faker
- Les mocks importent les types depuis `src/types/models.ts` ; le code de l'app n'importe **jamais** depuis `src/mocks/`
- Tests : URL d'API `TEST_API_URL` (`src/test/constants.ts`) ; les valeurs attendues des assertions restent écrites en dur
- Composants en PascalCase, hooks en camelCase avec préfixe `use`
- Styles via classes NativeWind (`className`), pas de StyleSheet sauf cas non couvert par Tailwind
- Alias d'import `@/*` disponible (voir `tsconfig.json`)
- **Aucun texte affiché en dur** : tout passe par i18next (`src/i18n/`). Un namespace par domaine (`common`, `auth`, `dashboard`…), un fichier JSON par langue et par namespace dans `src/i18n/locales/{fr,en}/`. Le français est la langue de référence (les types des clés en dérivent) ; chaque clé doit exister en `fr` et en `en` (test de parité). Nouveau namespace → créer les deux JSON puis l'enregistrer dans `src/i18n/resources.ts`.
- Les fonctions pures (validation, mapping d'erreurs) retournent des **clés** de traduction, jamais du texte ; l'écran traduit au rendu
- Appels API via `apiRequest` (`src/api/client.ts`), base URL = `EXPO_PUBLIC_API_URL` (définie dans `.env.development` pour le dev mocké)
- Données de test : utilisateur fictif **Martin Dupont / martin@priozen.app** (mot de passe mock `password123`, constante `MOCK_PASSWORD`) — ne jamais utiliser de vrai nom

## Structure des données (contrat d'API — à confirmer avec le futur backend)

Défini dans `src/types/models.ts`, partagé par l'app, le client API et les mocks MSW : camelCase, quadrant Eisenhower encodé en un seul enum `quadrant` plutôt qu'en deux booléens séparés. `EISENHOWER_QUADRANTS` donne les quadrants dans l'ordre de priorité.

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

## Pull requests

Conventions lues par le skill `/pr-message` (skill personnel, générique) :

- **Langue** : description des PR en **français** ; titre en anglais au format Conventional Commits (`feat(auth): add login page (AUTH-01)`), car il devient le message du squash merge
- **Branche de base** : `develop` (seul `develop` est mergé dans `main`, garde CI)
- **Ticket** : Jira `https://priozen.atlassian.net/browse/PRIO-XX`, clé dans le footer `Refs: PRIO-XX` des commits ; le code ticket (`AUTH-01`, `DASH-02`…) figure dans le nom de branche et le résumé du ticket
- **Sections** (titres en français, avec emoji) : 💡 Contexte · 🏗️ Ce qui a été fait · 🛠️ Détails techniques · 🧪 Comment tester · 📸 Rendu Visuel (tableau Desktop / Mobile) · 💬 Notes pour le relecteur
- **Comment tester** : données mockées MSW, utilisateur `martin@priozen.app` / `password123` ; préciser light/dark et mobile/desktop pour toute PR qui touche l'UI
- **Maquette** à citer dans le contexte pour une PR UI : https://claude.ai/artifact/UWBMeXCP5cPEhwteH7VoCV
- Après ouverture de la PR : passer le ticket Jira en « En cours de revue »
