import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enDashboard from './locales/en/dashboard.json';
import frAuth from './locales/fr/auth.json';
import frCommon from './locales/fr/common.json';
import frDashboard from './locales/fr/dashboard.json';

// One namespace per domain (mirrors the epics) so parallel tickets edit
// different files. Adding a namespace: create fr/<ns>.json + en/<ns>.json
// and register both below — the types and the parity test follow.
export const resources = {
  fr: { common: frCommon, auth: frAuth, dashboard: frDashboard },
  en: { common: enCommon, auth: enAuth, dashboard: enDashboard },
};

export const DEFAULT_LANGUAGE = 'fr';
export const DEFAULT_NAMESPACE = 'common';
export const NAMESPACES = Object.keys(
  resources.fr,
) as (keyof (typeof resources)['fr'])[];
