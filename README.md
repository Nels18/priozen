# Priolist — Your priority list, simplified.

<img src="assets/images/ios-icon-light.png" alt="Priolist logo" align="right" width="80"/>

Priolist is a hybrid app (iOS, Android, Web) built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev), using [Expo Router](https://expo.github.io/router) for file-based navigation and [NativeWind](https://www.nativewind.dev) for styling.

[Contributing Guidelines](CONTRIBUTING.md) · [Changelog](CHANGELOG.md) · [Submit an Issue](#)

[![CI](https://github.com/Nels18/priolist/actions/workflows/ci.yml/badge.svg)](https://github.com/Nels18/priolist/actions/workflows/ci.yml)

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
