import i18n from 'i18n-js';
import { Localization } from 'expo-localization';
import en from './translations/en.json';
import es from './translations/es.json';

i18n.translations = {
  en,
  es,
};

i18n.locale = Localization.locale;
