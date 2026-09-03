# Contributing to Priolist

Please read these guidelines before submitting any contribution.

## Table of Contents

- [Submission Guidelines](#submission-guidelines)
- [Branch Naming](#branch-naming)
- [Coding Rules](#coding-rules)
- [Commit Message Guidelines](#commit-message-guidelines)

---

## Submission Guidelines

### Submitting a Pull Request

1. Create a branch from `develop` following the [branch naming conventions](#branch-naming).
2. Make your changes with appropriate tests.
3. Follow the [coding rules](#coding-rules).
4. Run the full test suite and make sure it passes:
   ```bash
   npm run lint
   npm run test
   ```
5. Commit your changes following the [commit message guidelines](#commit-message-guidelines):
   ```bash
   npm run commit
   ```
6. Push your branch and open a Pull Request targeting `develop`.

### After your PR is merged

```bash
git push origin --delete <your-branch>   # delete remote branch
git checkout develop
git pull
git branch -D <your-branch>              # delete local branch
```

---

## Branch Naming

Branches must follow this pattern (enforced by `validate-branch-name`):

```
<type>/<short-description>
```

Use lowercase and hyphens, no spaces.

| Type           | When to use             | Example                     |
| -------------- | ----------------------- | --------------------------- |
| `feat`         | New feature             | `feat/login-screen`         |
| `feature`      | New feature (long form) | `feature/onboarding-flow`   |
| `fix`          | Bug fix                 | `fix/crash-on-startup`      |
| `hotfix`       | Urgent production fix   | `hotfix/payment-crash`      |
| `refactor`     | Code refactoring        | `refactor/navigation-stack` |
| `docs`         | Documentation           | `docs/update-readme`        |
| `test`         | Tests                   | `test/add-auth-tests`       |
| `chore`        | Maintenance             | `chore/upgrade-deps`        |
| `perf`         | Performance             | `perf/optimize-list`        |
| `ci`           | CI/CD                   | `ci/add-eas-workflow`       |
| `build`        | Build config            | `build/update-metro`        |
| `style`        | Formatting              | `style/fix-spacing`         |
| `release`      | Release preparation     | `release/v1.2.0`            |
| `wip`          | Work in progress        | `wip/new-dashboard`         |
| `experimental` | Experimental feature    | `experimental/ai-feature`   |

> `main` and `develop` are protected branches and do not require a prefix.

---

## Coding Rules

- All features and bug fixes must be covered by unit tests.
- Run `npm run lint` before committing — ESLint + Prettier are enforced.
- Follow the existing code style (TypeScript strict mode, NativeWind for styling).
- Do not commit commented-out code.

---

## Commit Message Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by `commitlint`.
The interactive CLI (`czg`) can help you format commits correctly:

```bash
npm run commit
```

### Format

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

- **type** — mandatory, see table below
- **scope** — optional, area of the codebase (e.g. `auth`, `navigation`, `ui`)
- **summary** — short description in the present tense, not capitalized, no period at the end
- **body** — optional, preceded by a blank line, explains the _what_ and _why_
- **footer** — optional, preceded by a blank line, used for breaking changes or issue references

### Types

| Type       | Description                                     |
| ---------- | ----------------------------------------------- |
| `feat`     | A new feature                                   |
| `fix`      | A bug fix                                       |
| `docs`     | Documentation changes only                      |
| `style`    | Formatting, no logic change                     |
| `refactor` | Code change that is neither a fix nor a feature |
| `perf`     | Performance improvement                         |
| `test`     | Adding or updating tests                        |
| `build`    | Build system or dependency changes              |
| `ci`       | CI/CD configuration changes                     |
| `chore`    | Maintenance tasks                               |
| `revert`   | Revert a previous commit                        |

### Examples

```
feat(auth): add login screen with email and password

fix(navigation): fix back button not working on Android

docs(readme): update CI/CD pipeline section

refactor(home): extract task list into separate component

chore(deps): upgrade expo to v55

feat(api)!: change task endpoint response format

BREAKING CHANGE: the `tasks` field is now `items` in the API response
```
