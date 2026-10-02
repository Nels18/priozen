---
name: pr-message
description: Rédige (ou met à jour) la description d'une pull request Priozen selon le modèle de l'équipe, en français — contexte et ticket Jira, ce qui a été fait, détails techniques, comment tester, rendu visuel, notes pour le relecteur. À utiliser quand on demande /pr-message, un message ou une description de PR, ou de créer / mettre à jour une PR.
---

# /pr-message — description de PR Priozen

Produit la description d'une PR à partir du diff réel de la branche, puis crée ou met à jour la PR sur GitHub. **Toujours en français**, comme toutes les PR du repo.

Argument optionnel : un numéro de PR (`/pr-message 7`). Sans argument, on travaille sur la branche courante.

## 1. Rassembler les faits

Ne rien inventer : chaque ligne de la description doit venir du diff, des commits ou du ticket.

1. **Branche et base** : branche courante (`git rev-parse --abbrev-ref HEAD`) ou celle de la PR (`gh pr view <n> --json headRefName,baseRefName,body`). La base est **`develop`** (seul `develop` est mergé dans `main`).
2. **Commits et diff** : `git fetch origin`, puis `git log --oneline origin/develop..HEAD` et `git diff --stat origin/develop...HEAD`, puis le diff complet des fichiers significatifs. Si la branche contient des commits sans rapport avec le ticket, le signaler à l'utilisateur au lieu de les décrire comme faisant partie de la PR.
3. **Ticket Jira** : clé `PRIO-XX` trouvée dans les footers `Refs:` des commits ou le nom de la branche (code ticket type `AUTH-01` → chercher le ticket dont le résumé commence par ce code). Si le connecteur Atlassian est disponible, lire le ticket (objectif, critères d'acceptance, hors périmètre) sur `priozen.atlassian.net`. Lien : `https://priozen.atlassian.net/browse/PRIO-XX`.
4. **Vérifications** : relever ce qui a réellement été lancé (`npm run lint`, `npx tsc --noEmit`, `npm run test`, `npx expo export --platform web`) et leur résultat. Ne jamais déclarer « testé » ce qui ne l'a pas été — en particulier le rendu visuel sur appareil.

## 2. Rédiger avec ce modèle

```markdown
# 🚀 <branche> - <titre court, en français>

## 💡 Contexte

<Pourquoi cette PR existe : besoin, ticket, maquette éventuelle. 2–4 phrases.>
_Ticket :_ [PRIO-XX — <résumé du ticket>](https://priozen.atlassian.net/browse/PRIO-XX)

---

## 🏗️ Ce qui a été fait

- **<Domaine> :** <changement, avec les fichiers clés en `code`>
- …

---

## 🛠️ Détails techniques

- **Techno utilisée :** <librairie / approche choisie et pourquoi>
- **Point d'attention :** <compromis, limite connue, changement de contrat d'API, hors périmètre>

---

## 🧪 Comment tester

1. <commande de lancement : `npm run web` / `npm run ios` / `npm run test`…>
2. <parcours à suivre, avec les données mockées à utiliser>
3. <résultat attendu pour chaque cas, y compris les cas d'erreur>
4. <light / dark, mobile / desktop si la PR touche l'UI>

_Vérifications déjà passées :_ lint ✅ · types ✅ · tests ✅ (<n>) · build web ✅ — <ce qui n'a pas été vérifié>

---

## 📸 Rendu Visuel

| Vue Desktop              | Vue Mobile               |
| :----------------------- | :----------------------- |
| <capture ou _À ajouter_> | <capture ou _À ajouter_> |

---

💬 **Notes pour le relecteur :** <fichiers générés à ignorer, points à vérifier en priorité, décisions à valider>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Règles de rédaction :

- **Ce qui a été fait** : regrouper par domaine (UI, API, thème, i18n, tests, CI…), pas par commit. Une ligne = un changement visible pour le relecteur.
- **Comment tester** : étapes concrètes et reproductibles par quelqu'un qui découvre la branche. Données mockées : utilisateur **`martin@priozen.app` / `password123`** (MSW). Pour une PR sans UI, donner les commandes de test et ce qu'elles prouvent.
- **Rendu Visuel** : pour une PR sans UI, écrire `_Non applicable_` dans les deux cellules et une phrase d'explication. Sinon laisser `_À ajouter_` si aucune capture n'a été faite — ne jamais prétendre qu'une capture existe.
- Supprimer une sous-partie de **Détails techniques** si elle n'a rien à dire, mais garder toutes les sections principales.
- Ne jamais écrire le nom réel d'une personne (utilisateur, relecteur) ; pas de secrets ni d'URL internes autres que Jira / GitHub / la maquette.

## 3. Publier

1. Montrer le titre et la description à l'utilisateur.
2. **PR existante** : `gh pr edit <n> --title "<titre>" --body-file <fichier>` (fichier temporaire dans le scratchpad, pour éviter les problèmes d'échappement).
   **Pas encore de PR** : pousser la branche si besoin, puis `gh pr create --base develop --title "<titre>" --body-file <fichier>`.
3. Le titre de PR reste au format Conventional Commits (`feat(auth): add login page (AUTH-01)`), car il devient le message du squash merge ; seul le corps est en français.
4. Donner le lien de la PR à l'utilisateur.
