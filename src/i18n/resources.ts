import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enDashboard from './locales/en/dashboard.json';
import enLayout from './locales/en/layout.json';
import enTasks from './locales/en/tasks.json';
import frAuth from './locales/fr/auth.json';
import frCommon from './locales/fr/common.json';
import frDashboard from './locales/fr/dashboard.json';
import frLayout from './locales/fr/layout.json';
import frTasks from './locales/fr/tasks.json';

// One namespace per domain (mirrors the epics) so parallel tickets edit
// different files. Adding a namespace: create fr/<ns>.json + en/<ns>.json
// and register both below — the types and the parity test follow.
export const resources = {
  fr: {
    common: frCommon,
    auth: frAuth,
    dashboard: frDashboard,
    layout: frLayout,
    tasks: frTasks,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    layout: enLayout,
    tasks: enTasks,
  },
};

export const DEFAULT_LANGUAGE = 'fr';
export const DEFAULT_NAMESPACE = 'common';
export const NAMESPACES = Object.keys(
  resources.fr,
) as (keyof (typeof resources)['fr'])[];
