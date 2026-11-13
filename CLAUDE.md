# Priozen — Contexte projet

## Présentation

Application de gestion de tâches basée sur la méthode Eisenhower.
Nom du projet : **Priozen** (anciennement ZenTask Pro, puis Priolist).

L'état d'avancement vit dans Jira (projet PRIO). L'historique des débuts du projet est dans `HISTORIQUE.md`.

Le backend et la base de données ne sont pas encore prêts : le frontend tourne sur des données mockées par MSW (service worker sur le web via `src/mocks/worker.ts` ; sur iOS/Android, `fetch` résolu directement par les handlers via `getResponse()`, voir `src/mocks/native.ts`).

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

## CI/CD

GitHub Actions (`.github/workflows/`) :

- `ci.yml` — push et PR vers `main` / `develop` : scan de secrets (gitleaks), puis lint, typecheck, tests Vitest (fichiers modifiés sur une PR, suite complète avec couverture sur un push) et build web de production (`expo export --platform web`, rendu statique compris)
- `branch-guard.yml` — PR vers `main` : seule `develop` peut y être mergée
- `branch-name.yml` — toute PR : le nom de branche respecte `.validate-branch-namerc.js` (même règle que le hook `pre-push`)
- `claude-review.yml` — PR vers `develop` : relecture par Claude des PR qui portent le label `ai-review`, à l'ajout du label, au passage en « prête » et à chaque nouveau push (workflow réutilisable de `Nels18/dev-agents`, guidelines dans `.github/review-guidelines.md`) ; PR de doc ignorées
- `release.yml` — lancement manuel : tests, génération de la doc, `npm version` (patch / minor / major) et push du tag `v*`

Workflows EAS (`.eas/workflows/`) :

- `preview-builds.yml` — PR vers `main` : builds preview Android et iOS
- `release-production.yml` — tag `v*` : builds production, approbation manuelle, puis soumission aux stores
- `deploy-web-demo.yml` — push sur `develop` : démo web du POC sur l'alias EAS Hosting `demo`, données mockées (variables de l'environnement EAS `preview` : `EXPO_PUBLIC_USE_MOCKS=true` et une `EXPO_PUBLIC_API_URL` factice, obligatoire car les handlers ne matchent que l'hôte de l'API). Démo = build de production sur les mocks (`isDemo`, `src/config/demo.ts`) : bandeau « Démo — données fictives » (`DemoBanner`, web seulement) et `noindex` dans `app/+html.tsx` (la production reste indexable ; pas de `robots.txt`, qui empêcherait les moteurs de lire ce `noindex`)
- `deploy-web.yml` — tag `v*` : déploiement web de production (EAS Hosting, environnement EAS `production`)

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

## Maquette

Maquette de référence (responsive mobile / tablette / bureau) : **`design/maquettes/index.html`**, à lire avant de coder un écran (onglets Mobile / Tablette / Bureau, clair et sombre). C'est une copie de l'artefact https://claude.ai/artifact/UWBMeXCP5cPEhwteH7VoCV, où se fait la conception : à recopier après chaque mise à jour de la maquette, en remplaçant le vrai nom par l'utilisateur fictif. Fichier exclu de Prettier et d'ESLint, pour que le diff d'une nouvelle copie reste lisible.

Décisions de design (maquette ; livrées par MOB-01 et DASH-06) :

- **Vue d'ensemble** en haut de la liste : 4 pastilles, une par quadrant, qui comptent les tâches de l'onglet actif et servent de filtre (2e tap sur la même pastille = tout afficher, rappel « Filtre : X · N — Tout afficher ») ; sur bureau, elle remplace le panneau de droite de l'écran Tâches
- **Onglets de statut** sous la bande : À faire / En retard / Terminées, avec compteur (« En retard » en rouge s'il est non nul)
- Une tâche en retard figure **dans deux onglets** : « À faire » (elle n'est pas terminée) et « En retard » (vue filtrée, pas un statut exclusif)
- Toute cible tactile fait **au moins 44 px** (pastilles, onglets, liens « Tout afficher »)
- **Pas d'émoji dans l'UI** : tout pictogramme est une icône Ionicons (`@expo/vector-icons`), décorative = masquée aux lecteurs d'écran ; via le composant `Icon` dès qu'il existe (UX-04)

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
- Taille `text-tiny` (11px) pour les métadonnées d'une tâche (dossier, échéance, badges) — pas de `text-[11px]`
- Tailles `text-greeting` (26px, salutation du tableau de bord) et `text-stat` (28px, chiffre clé) ; toute nouvelle taille de la maquette se nomme dans `tailwind.config.js` plutôt qu'en valeur arbitraire

## Architecture des vues (expo-router)

Deux groupes de routes (les parenthèses n'apparaissent pas dans l'URL), chacun avec un `_layout.tsx` qui sert de garde :

- `app/(auth)/` — écrans publics sans sidebar (`login`, `register`, `forgot-password`, `cgu`) ; un utilisateur connecté est renvoyé vers `/`
- `app/(protected)/` — écrans connectés ; sans session → `/login`. Son `_layout.tsx` est une Stack :
  - `(main)/` — les écrans, rendus dans l'`AppShell` (`src/components/layout/`) ;
  - `tasks/new`, `tasks/[id]` — modales (`presentation: 'transparentModal'`) empilées au-dessus, qui dessinent elles-mêmes leur bottom sheet ou dialogue (`TaskModal`) ; fermeture via `useCloseModal()`
- URL centralisées dans `ROUTES` (`src/navigation/routes.ts`, URL paramétrées comme `editTaskRoute(id)`) — jamais de chemin en dur ; les 5 entrées de navigation (sidebar + onglets mobiles) dans `NAV_ITEMS` (`src/navigation/navItems.ts`)
- Mise en page responsive selon `useScreenSize()` (`src/layout/screenSize.ts`) : `small` < 768px (en-tête + onglets en bas + bouton « + »), `medium` 768–1279px (sidebar 240px + en-tête), `large` ≥ 1280px (sidebar 260px + en-tête + panneau droit 280px) — c'est la largeur disponible, pas le type d'appareil
- Contenu d'un écran connecté dans `<Screen>` (défilement + marges par taille) ; écran pas encore livré → `<ScreenPlaceholder ticket="…">`

Vues :

- `/login` — Connexion
- `/register` — Inscription (stepper 3 étapes + RGPD)
- `/forgot-password` — Mot de passe oublié
- `/cgu` — CGU avec barre de progression lecture
- `/` (dashboard) — Liste tâches groupées par quadrant
- `/tasks/new`, `/tasks/:id` — Modale création / édition de tâche (raccourci N sur le web)
- `/folders/:id` — Vue dossier avec stats
- `/trash` — Corbeille (soft delete, purge 30j)
- `/profile` — Profil utilisateur + zone danger RGPD
- `/focus` — Mode concentration (3 cartes minimalistes)
- `/analytics` — Indice de lucidité + radar Eisenhower

## Conventions de code

- Toujours utiliser les variables d'environnement Expo (`EXPO_PUBLIC_API_URL`) pour l'URL API
- Ne jamais hardcoder d'URL
- Données mockées via MSW (`src/mocks/`) : handlers par domaine (`apiHandlers/tasksHandler.ts`, `authHandler.ts`, `userHandler.ts`, `foldersHandler.ts`), fixtures dans `src/mocks/data/fixtures.ts` (avec `MOCK_USER_ID`, `MOCK_PASSWORD`, `MOCK_TOKEN`) ; en dev, données aléatoires générées par les factories Faker. Un handler matche toujours `apiPattern(route)` (hôte de l'API seulement), jamais `*${route}` : le joker attrape aussi les fichiers de l'app (bundle d'une route chargée à la demande)
- Les mocks importent les types depuis `src/types/models.ts` ; le code de l'app n'importe **jamais** depuis `src/mocks/`
- Tests : URL d'API `TEST_API_URL` (`src/test/constants.ts`) ; les valeurs attendues des assertions restent écrites en dur
- Composants en PascalCase, hooks en camelCase avec préfixe `use`
- ESLint (`eslint.config.js`) fait respecter trois de ces règles :
  - pas de couleur hexadécimale ni de variante `dark:` dans une prop `*ClassName` (sauf `src/theme/**`) ;
  - pas de texte brut affiché dans le JSX (`i18next/no-literal-string`, sauf tests et `src/mocks/**`) : tout texte passe par `t()`, un nom de marque passe par une constante nommée (cf. `Logo`) ;
  - pas d'URL `http(s)://` écrite en dur (sauf tests, `src/test/**` et `src/mocks/**`)
- Styles via classes NativeWind (`className`), pas de StyleSheet sauf cas non couvert par Tailwind
- Alias d'import `@/*` disponible (voir `tsconfig.json`)
- **Aucun texte affiché en dur** : tout passe par i18next (`src/i18n/`). Un namespace par domaine (`common`, `auth`, `dashboard`…), un fichier JSON par langue et par namespace dans `src/i18n/locales/{fr,en}/`. Le français est la langue de référence (les types des clés en dérivent) ; chaque clé doit exister en `fr` et en `en` (test de parité). Nouveau namespace → créer les deux JSON puis l'enregistrer dans `src/i18n/resources.ts`.
- Les fonctions pures (validation, mapping d'erreurs) retournent des **clés** de traduction, jamais du texte ; l'écran traduit au rendu
- Appels API via `apiRequest` (`src/api/client.ts`), base URL = `EXPO_PUBLIC_API_URL` (définie dans `.env.development` pour le dev mocké)
- **Données serveur : TanStack Query**, jamais d'appel API dans un `useEffect`. Un composant lit via `useQuery` / modifie via `useMutation`, avec les fabriques `queryOptions` du domaine (ex. `taskQueries.list()` dans `src/tasks/taskQueries.ts`) ; les clés viennent du même fichier (`taskKeys`) et une mutation invalide `taskKeys.all`. Les mutations suivent le même modèle : fabriques `mutationOptions` du domaine (ex. `taskMutations.setDone()` dans `src/tasks/taskMutations.ts`, mise à jour optimiste du cache puis annulation en cas d'échec). Les fonctions d'API (`src/api/*.ts`, basées sur `apiRequest`) servent de `queryFn`.
- `QueryClient` unique créé par `createQueryClient()` (`src/query/queryClient.ts`) : `QUERY_STALE_TIME_MS` (30 s), `QUERY_RETRY_COUNT` (2 nouvelles tentatives), erreurs remontées une seule fois par le `QueryCache`. `QueryProvider` (dans `app/_layout.tsx`, à l'intérieur de `MocksProvider` pour qu'aucune requête ne parte avant MSW) branche `focusManager` sur `AppState` et `onlineManager` sur `expo-network` (iOS/Android ; le web est géré nativement par TanStack Query)
- Tests de requêtes : `createTestQueryClient()` (sans retries) et `createQueryWrapper()` (`src/test/queryClient.tsx`) ; utiliser `queryClient.query(options)` (`fetchQuery` est déprécié)
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
npm run typecheck      # TypeScript (tsc --noEmit)
npm run test           # Vitest
npm run test:watch     # Vitest en mode watch
npm run test:coverage  # Vitest avec couverture
```

## Pull requests

Conventions lues par le skill `/pr-message` (skill personnel, générique) :

- **Langue** : description des PR en **français** ; titre en anglais au format Conventional Commits, avec le code ticket **et la clé Jira** (`feat(dashboard): add global layout (DASH-01, PRIO-18)`) : il devient le message du squash merge, et la clé permet à Jira de relier la PR au ticket
- **Branche de base** : `develop` (seul `develop` est mergé dans `main`, garde CI)
- **Nom de branche** : `<type>/PRIO-<numéro>[-description]`, clé Jira en majuscules, description en minuscules et tirets (`feat/PRIO-19-dash-02-liste-quadrants`) ; `PRIO-XX` pour un travail sans ticket. Règle unique dans `.validate-branch-namerc.js`, vérifiée au push (hook Husky) et sur chaque PR (workflow `branch-name.yml`)
- **Ticket** : Jira `https://priozen.atlassian.net/browse/PRIO-XX`, clé dans le footer `Refs: PRIO-XX` des commits ; le code ticket (`AUTH-01`, `DASH-02`…) figure dans le nom de branche et le résumé du ticket
- **Sections** (titres en français, avec emoji) : 💡 Contexte · 🏗️ Ce qui a été fait · 🛠️ Détails techniques · 🧪 Comment tester · 📸 Rendu Visuel (tableau Desktop / Mobile) · 💬 Notes pour le relecteur
- **Comment tester** : données mockées MSW, utilisateur `martin@priozen.app` / `password123` ; préciser light/dark et mobile/desktop pour toute PR qui touche l'UI
- **Maquette** à citer dans le contexte pour une PR UI : https://claude.ai/artifact/UWBMeXCP5cPEhwteH7VoCV
- Après ouverture de la PR : passer le ticket Jira en « En cours de revue »
