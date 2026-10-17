import type { resources } from './resources';

// Makes t('…') keys and namespaces type-checked against the French
// (reference) locale.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: (typeof resources)['fr'];
  }
}
