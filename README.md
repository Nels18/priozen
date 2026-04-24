# Priolist

Hybrid app (iOS, Android, Web) built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev).

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

## Prerequisites

- Node.js 22+
- [EAS CLI](https://docs.expo.dev/eas/): `npm install -g eas-cli`

## Installation

```bash
npm install
```

## Development

```bash
npm start           # Start the Expo dev server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run in the browser
```

## Code Quality

```bash
npm run lint            # ESLint + Prettier
npm run test            # Unit tests (Vitest)
npm run test:watch      # Tests in watch mode
npm run test:coverage   # Code coverage
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming conventions, commit message guidelines, and the pull request process.

```bash
npm run commit   # Interactive conventional commit interface
```

## Documentation

Documentation is generated with [TypeDoc](https://typedoc.org) from TypeScript source files.

```bash
npm run docs   # Generate docs into the docs/ folder
```

## Release

Releases are managed via GitHub Actions. Go to **GitHub → Actions → Release → Run workflow** and choose the version type:

| Type    | When to use     | Example           |
| ------- | --------------- | ----------------- |
| `patch` | Bug fix         | `1.0.0` → `1.0.1` |
| `minor` | New feature     | `1.0.0` → `1.1.0` |
| `major` | Breaking change | `1.0.0` → `2.0.0` |

The workflow automatically:

1. Runs tests
2. Generates documentation
3. Bumps the version + creates a Git tag
4. Pushes the tag → triggers EAS Workflows

## CI/CD

### GitHub Actions

| Workflow      | Trigger                        | Action                  |
| ------------- | ------------------------------ | ----------------------- |
| `ci.yml`      | Push / PR on `main`, `develop` | Lint + tests + coverage |
| `release.yml` | Manual                         | Versioning + docs + tag |

### EAS Workflows

| Workflow                 | Trigger      | Action                                         |
| ------------------------ | ------------ | ---------------------------------------------- |
| `preview-builds.yml`     | PR to `main` | Build iOS + Android (internal preview)         |
| `release-production.yml` | Tag `v*`     | Build iOS + Android → approval → Submit stores |
| `deploy-web.yml`         | Tag `v*`     | Web deployment via EAS Hosting                 |

### Full Pipeline

```
PR → CI (lint + tests)
       ↓
merge main
       ↓
GitHub Actions Release (versioning + tag)
       ↓
       ├─ EAS deploy-web          → Web in production
       └─ EAS release-production  → iOS + Android → Stores
```

## Project Structure

```
app/                  # Screens and navigation (Expo Router)
assets/               # Images, fonts
.eas/workflows/       # EAS Workflows (mobile + web CI/CD)
.github/workflows/    # GitHub Actions (CI + release)
```
