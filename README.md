<h1 align="center">Priozen — Your priority list, simplified.</h1>

<p align="center">
  <img src="assets/images/ios-icon-light.png" alt="priozen-logo" width="120px" height="120px"/>
  <br>
  <em>Priozen is a hybrid app (iOS, Android, Web) built with Expo and React Native,
    <br> using Expo Router for file-based navigation and NativeWind for styling.</em>
  <br>
</p>

<p align="center">
  <a href="CONTRIBUTING.md">Contributing Guidelines</a>
  ·
  <a href="CHANGELOG.md">Changelog</a>
  ·
  <a href="https://github.com/Nels18/priozen/issues">Submit an Issue</a>
  <br>
  <br>
</p>

<p align="center">
  <a href="https://github.com/Nels18/priozen/actions/workflows/ci.yml">
    <img src="https://github.com/Nels18/priozen/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <a href="https://github.com/Nels18/priozen/releases">
    <img src="https://img.shields.io/github/v/release/Nels18/priozen?label=version" alt="Latest release" />
  </a>
  <img src="https://img.shields.io/badge/Expo-55-000020?logo=expo&logoColor=white" alt="Expo SDK" />
  <img src="https://img.shields.io/badge/React_Native-0.81-61DAFB?logo=react&logoColor=white" alt="React Native" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-22+-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
</p>

<hr>

## Quickstart

```bash
npm install && npm start
```

Open the Expo Go app on your device, or press `i` for iOS simulator, `a` for Android emulator, `w` for web.

## Documentation

API documentation is generated with [TypeDoc](https://typedoc.org) from TypeScript source files.

```bash
npm run docs   # Generate docs into the docs/ folder
```

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [EAS CLI](https://docs.expo.dev/eas/): `npm install -g eas-cli`

### Installation

```bash
npm install
```

### Running the app

```bash
npm start           # Start the Expo dev server
npm run ios         # iOS simulator
npm run android     # Android emulator
npm run web         # Browser
```

### Code quality

```bash
npm run lint            # ESLint + Prettier
npm run test            # Unit tests (Vitest)
npm run test:watch      # Tests in watch mode
npm run test:coverage   # Coverage report
```

## Mock API (MSW)

The backend and PostgreSQL database aren't ready yet. The app runs standalone against a mocked API powered by [Mock Service Worker](https://mswjs.io), so every screen can be built and tested end-to-end without a real server.

- **Native (iOS/Android)** — [`src/mocks/native.ts`](src/mocks/native.ts) uses `msw/native` (not `msw/node`, which depends on Node internals unavailable on Hermes) plus polyfills in [`src/mocks/msw.polyfills.ts`](src/mocks/msw.polyfills.ts) (`fast-text-encoding`, `react-native-url-polyfill`, and stubs for `MessageEvent`/`Event`/`EventTarget`/`BroadcastChannel`).
- **Web** — [`src/mocks/worker.ts`](src/mocks/worker.ts) uses `msw/browser` with the generated `public/mockServiceWorker.js`.
- Both start from [`app/_layout.tsx`](app/_layout.tsx) via `startMocks()` ([`src/mocks/utils.ts`](src/mocks/utils.ts)).
- **Handlers** are split by domain in [`src/mocks/apiHandlers/`](src/mocks/apiHandlers/) (`authHandler`, `tasksHandler`, `foldersHandler`, `userHandler`), backed by an in-memory store ([`src/mocks/database.ts`](src/mocks/database.ts)) seeded from [`src/mocks/data/fixtures.ts`](src/mocks/data/fixtures.ts).
- A random network delay simulates latency so loading states are visible in dev; it's skipped automatically under `NODE_ENV=test`.

### Toggling mocks

Mocks are active by default in development (`NODE_ENV=development`). Override explicitly with the `EXPO_PUBLIC_USE_MOCKS` env var:

```bash
EXPO_PUBLIC_USE_MOCKS=false npm start   # disable mocks (e.g. to hit a real/staging API)
EXPO_PUBLIC_USE_MOCKS=true npm run web  # force mocks even outside development
```

## Tech Stack

| Category       | Technology                                                                                                            |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| Framework      | [Expo](https://expo.dev) + [React Native](https://reactnative.dev)                                                    |
| Navigation     | [Expo Router](https://expo.github.io/router) (file-based)                                                             |
| Styling        | [NativeWind](https://www.nativewind.dev) (Tailwind CSS)                                                               |
| Language       | [TypeScript](https://www.typescriptlang.org) (strict)                                                                 |
| Testing        | [Vitest](https://vitest.dev)                                                                                          |
| Linting        | [ESLint](https://eslint.org) + [Prettier](https://prettier.io)                                                        |
| Build & Deploy | [EAS Build](https://docs.expo.dev/build/introduction) + [EAS Hosting](https://docs.expo.dev/eas/hosting/introduction) |

## CI/CD Pipeline

```
PR → CI (lint + tests on changed files)
       ↓
merge main
       ↓
GitHub Actions Release (versioning + tag)
       ↓
       ├─ EAS deploy-web          → Web (EAS Hosting)
       └─ EAS release-production  → iOS + Android → Stores
```

| Workflow                 | Trigger                        | Action                                         |
| ------------------------ | ------------------------------ | ---------------------------------------------- |
| `ci.yml`                 | Push / PR on `main`, `develop` | Lint + tests + coverage                        |
| `release.yml`            | Manual                         | Version bump + docs + Git tag                  |
| `preview-builds.yml`     | PR to `main`                   | Build iOS + Android preview (internal)         |
| `release-production.yml` | Tag `v*`                       | Build iOS + Android → approval → submit stores |
| `deploy-web.yml`         | Tag `v*`                       | Web deployment via EAS Hosting                 |

## Changelog

[Learn about the latest improvements](CHANGELOG.md).

## Release

Releases are managed via **GitHub → Actions → Release → Run workflow**. Choose the version type:

| Type    | When to use     | Example           |
| ------- | --------------- | ----------------- |
| `patch` | Bug fix         | `1.0.0` → `1.0.1` |
| `minor` | New feature     | `1.0.0` → `1.1.0` |
| `major` | Breaking change | `1.0.0` → `2.0.0` |

## Contributing

Read the [contributing guidelines](CONTRIBUTING.md) before opening a pull request.

```bash
npm run commit   # Interactive conventional commit interface
```
