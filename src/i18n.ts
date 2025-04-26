import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Carica le traduzioni usando http (considera anche impostare il backend statico)
  .use(Backend)
  // Rileva la lingua del browser
  .use(LanguageDetector)
  // Passa i18n all'istanza di react-i18next
  .use(initReactI18next)
  // Inizializza i18next
  .init({
    fallbackLng: 'it', // Lingua di fallback se una traduzione non è disponibile
    debug: false, // Disabilita i log di debug in produzione
    
    interpolation: {
      escapeValue: false, // Non necessario per React poiché evita già gli attacchi XSS
    },
    
    // Opzioni di backend per il caricamento delle traduzioni
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Opzioni per il rilevamento della lingua
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      lookupLocalStorage: 'preferredLanguage',
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n; 