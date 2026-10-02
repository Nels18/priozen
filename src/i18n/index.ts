import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_NAMESPACE,
  NAMESPACES,
  resources,
} from './resources';

// Device language when we have a translation for it, French otherwise.
const deviceLanguage = getLocales().at(0)?.languageCode ?? DEFAULT_LANGUAGE;
const language =
  deviceLanguage in resources ? deviceLanguage : DEFAULT_LANGUAGE;

const i18n = createInstance();

// Every namespace is bundled and loaded upfront: no lazy loading, so screens
// never have to handle a "translations loading" state.
void i18n.use(initReactI18next).init({
  resources,
  lng: language,
  fallbackLng: DEFAULT_LANGUAGE,
  ns: NAMESPACES,
  defaultNS: DEFAULT_NAMESPACE,
  interpolation: { escapeValue: false }, // React already escapes output
});

export default i18n;
