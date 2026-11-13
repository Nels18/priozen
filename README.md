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

### On a phone (Expo Go)

No build needed: the app runs in [Expo Go](https://expo.dev/go), on the mocked API (sign in with `martin@priozen.app` / `password123`).

1. Install **Expo Go** from the App Store or the Play Store. The phone must be on the same Wi-Fi as the computer.
2. Run `npm start`: a QR code shows in the terminal.
3. **iPhone**: scan it with the Camera app. **Android**: scan it from Expo Go.

If it fails:

- **"The request timed out"** (iPhone): allow Expo Go in **Settings → Privacy & Security → Local Network**, then quit Expo Go and scan again. Otherwise check that the phone isn't on mobile data, a guest Wi-Fi or a VPN.
- **Network that isolates devices** (office, some routers): `npx expo start --tunnel` goes through the internet instead (installs `@expo/ngrok` the first time; slower).
- **Android emulator "unauthorized" / "offline"**: Expo tried before Android finished booting. Start the emulator first, wait for the home screen and for `adb devices` to list it as `device`, then press `a` in the Expo terminal.

### Code quality

```bash
npm run lint            # ESLint + Prettier
npm run test            # Unit tests (Vitest)
npm run test:watch      # Tests in watch mode
npm run test:coverage   # Coverage report
```

## Mock API (MSW)

The backend and PostgreSQL database aren't ready yet. The app runs standalone against a mocked API powered by [Mock Service Worker](https://mswjs.io), so every screen can be built and tested end-to-end without a real server.

- **Native (iOS/Android)** — [`src/mocks/native.ts`](src/mocks/native.ts) replaces `fetch` with a function that resolves each request against the handlers through MSW's `getResponse()`. Not `msw/native`: its interceptors rebuild the mocked response from `response.body`, a stream React Native doesn't expose, so every body arrived empty. Polyfills in [`src/mocks/msw.polyfills.native.ts`](src/mocks/msw.polyfills.native.ts) (`fast-text-encoding`, `react-native-url-polyfill`, and stubs for `MessageEvent`/`Event`/`EventTarget`/`BroadcastChannel`, which Hermes lacks). Verified in Expo Go on an iPhone and on the Android emulator (sign in, dashboard, task creation).
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
PR → CI (lint + types + tests on changed files + web build)
       ↓
merge develop → EAS deploy-web-demo → Web demo on mocked data (EAS Hosting)
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
| `ci.yml`                 | Push / PR on `main`, `develop` | Lint + types + tests + coverage + web build    |
| `release.yml`            | Manual                         | Version bump + docs + Git tag                  |
| `preview-builds.yml`     | PR to `main`                   | Build iOS + Android preview (internal)         |
| `release-production.yml` | Tag `v*`                       | Build iOS + Android → approval → submit stores |
| `deploy-web-demo.yml`    | Push on `develop`              | Web demo (mocked data) via EAS Hosting         |
| `deploy-web.yml`         | Tag `v*`                       | Web deployment via EAS Hosting                 |

## Web demo

**https://priozen--demo.expo.app**

Until the backend is ready, every push on `develop` deploys the web app to the
`demo` alias of EAS Hosting, with the API mocked by MSW (sign in with
`martin@priozen.app` / `password123`). The data is fictitious and resets when
the page reloads, which also signs you out.

The build reads the variables of the EAS **preview** environment
(expo.dev → project → Environment variables), not a file in the repository:

| Variable                | Value                              |
| ----------------------- | ---------------------------------- |
| `EXPO_PUBLIC_USE_MOCKS` | `true`                             |
| `EXPO_PUBLIC_API_URL`   | `https://api.demo.priozen.invalid` |

The API URL is a placeholder that is never reached: MSW only intercepts requests
to the API host, so it must be set. To deploy by hand: **expo.dev → Workflows →
Deploy Web (demo) → Run**, or `npx eas-cli workflow:run deploy-web-demo.yml`.

The demo is kept out of search results (a `noindex` meta in every page) and
shows a « Démo — données fictives » banner. Both depend on the build, not on the
host: a production build without mocks has neither.

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
