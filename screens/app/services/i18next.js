import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import sv from '../locales/sv.json';
import fr from '../locales/fr.json';
import sw from '../locales/sw.json';
import pt from '../locales/pt.json';
import ar from '../locales/ar.json';
import rw from '../locales/rw.json';
import es from '../locales/es.json';
import hi from '../locales/hi.json';

import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const languageResources = {
  en: { translation: en },
  sv: { translation: sv },
  fr: { translation: fr },
  sw: { translation: sw },
  pt: { translation: pt },
  ar: { translation: ar },
  rw: { translation: rw},
  es: { translation: es},
  hi: { translation: hi},
};

async function initI18n() {
  try {
    // Retrieve the user's selected language from AsyncStorage
    const lang = await AsyncStorage.getItem('language');

    i18next.use(initReactI18next).init({
      compatibilityJSON: 'v3',
      lng: lang || 'en', // Use the selected language or default to 'en'
      fallbackLng: lang || 'en', // Set a fallback language
      resources: languageResources,
    });
  } catch (error) {
    console.error('Error initializing i18next:', error);
  }
}

// Call the initialization function when your app starts (e.g., in App.js or the entry point)
initI18n();

export default i18next;
