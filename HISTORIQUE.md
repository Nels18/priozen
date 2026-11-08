# Priozen — Historique

> Sections retirées du `CLAUDE.md` le 2026-11-08 (DEVOPS-16, PRIO-53) : le `CLAUDE.md` ne garde que des règles stables, et l'état d'avancement vit désormais dans Jira (projet PRIO).
> Ce fichier est une photo de cette date ; il n'est plus mis à jour.

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

## CI/CD — Architecture cible initiale

> Architecture prévue au démarrage du projet. Les workflows réellement en place sont décrits dans le `CLAUDE.md` (section CI/CD).

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
