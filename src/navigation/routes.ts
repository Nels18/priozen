// Single source of truth for in-app URLs (the app/ screens), like
// src/api/routes.ts for the API. `as const` keeps the literal types so
// expo-router's typed routes still reject a path that doesn't exist.
// Route groups — app/(auth)/, app/(protected)/ — never appear in URLs.

export const ROUTES = {
  // app/(auth)/ — public, no app shell
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  // app/(protected)/ — signed-in, inside the app shell
  tasks: '/',
  folders: '/folders',
  focus: '/focus',
  analytics: '/analytics',
  profile: '/profile',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
