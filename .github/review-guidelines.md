# Guidelines de relecture propres à Priozen

> 🗓️ Dernière relecture : 2026-11-07
> Complète le `CLAUDE.md` (palette, typographie, conventions i18n, contrat de données), que le relecteur lit aussi. Ne pas dupliquer ici ce qui y figure déjà.

## Écarts assumés par rapport aux modules partagés

- **Nommage des fichiers** : les fichiers non-composants sont en `camelCase.ts` (`loginForm.ts`, `screenSize.ts`), les composants en `PascalCase.tsx`. Ne pas proposer de `kebab-case`.
- **Organisation** : par domaine directement sous `src/` (`src/auth`, `src/tasks`, `src/navigation`…), sans dossier `features/`. Les composants partagés vivent dans `src/components/ui` et `src/components/layout`.
- **Props d'accessibilité** : `accessibilityRole` et `accessibilityLabel` pour le rôle et le nom. Pour le reste, les props `aria-*` quand l'équivalent `accessibility*` est ignoré par React Native Web : elles fonctionnent sur iOS, Android **et** web.
  - **États** : `aria-checked`, `aria-selected`, `aria-expanded`, `aria-disabled`, `aria-busy`, jamais `accessibilityState` (React Native Web 0.21 l'ignore en entier).
  - **Élément décoratif** : `aria-hidden` (ex. une icône à côté d'un texte) ; React Native Web ignore `accessibilityElementsHidden` et `importantForAccessibility`.
  - **Dialogue** : `role="dialog"` et `aria-modal`, car `accessibilityRole` n'a pas de valeur « dialog » (plus `accessibilityViewIsModal` pour iOS).
  - Signaler un `accessibilityState`, ou un `role` / `aria-*` hors de ces cas.
- **Tests** : Vitest, avec `react-native` aliasé vers `react-native-web` (voir `vitest.config.ts`). Les tests portent sur la logique (fonctions pures, hooks, handlers MSW). Les tests de composants ne sont pas encore outillés : ne pas les exiger, mais exiger le test de toute logique extraite.
- **Couleurs brutes** : autorisées uniquement dans `src/theme/fixedColors.js` et `src/theme/useIconColors.ts`, pour les props qui n'acceptent pas de classe NativeWind (couleur d'icône). Une nouvelle couleur brute ailleurs est 🔴.
- **Session** : la session vit en mémoire pour le POC (pas de persistance du token). Ne pas le signaler tant que le backend réel n'existe pas.

## Règles supplémentaires

- **Données serveur** : le projet adopte TanStack Query. Tout nouvel accès aux données passe par `useQuery` / `useMutation`, avec `apiRequest` (`src/api/client.ts`) comme `queryFn`. Un nouvel appel à `apiRequest` directement depuis un composant ou un `useEffect` est 🔴.
- **Mocks** : toute nouvelle route d'API a son handler MSW dans `src/mocks/apiHandlers/` et respecte le contrat de données décrit dans le `CLAUDE.md` (camelCase, `quadrant` en enum). Un écart entre le type dans `src/types/models.ts` et les fixtures est 🔴.
- **Quadrants Eisenhower** : les libellés et couleurs viennent de `src/tasks/quadrants.ts`, jamais redéfinis localement.
- **Cibles** : une PR qui touche l'interface précise dans sa description si elle a été testée sur iOS, Android et web, en clair et en sombre.

## Zones sensibles

- `src/auth/` et `src/api/client.ts` : relire en priorité sous l'angle sécurité et gestion d'erreurs.
- `app/_layout.tsx` : ordre des providers et démarrage des mocks.

## À ne pas relire

- `public/mockServiceWorker.js` (généré par MSW)
- `package-lock.json`
