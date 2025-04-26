// Definizioni di tipo per Google Translate
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: any;
      };
    };
  }
}

// Flag per prevenire cicli di ricaricamento
let isTranslating = false;

// Funzione per verificare quando Google Translate è caricato e pronto
export const waitForGoogleTranslate = (maxAttempts = 40): Promise<boolean> => {
  return new Promise((resolve) => {
    let attempts = 0;
    
    const checkGoogleTranslate = () => {
      attempts++;
      
      // Verifica se Google Translate è stato caricato in uno di questi modi
      const translateCombo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      const translateBanner = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
      const translateGadget = document.querySelector('.goog-te-gadget') as HTMLElement;
      
      if (translateCombo || translateBanner || translateGadget) {
        // Google Translate è pronto in qualche forma
        console.log('Google Translate trovato dopo', attempts, 'tentativi');
        resolve(true);
      } else if (attempts < maxAttempts) {
        // Riprova tra 500ms, aumentiamo l'intervallo per dare più tempo
        setTimeout(checkGoogleTranslate, 500);
      } else {
        // Ha raggiunto il numero massimo di tentativi
        console.warn('Google Translate non è stato caricato correttamente dopo', maxAttempts, 'tentativi');
        resolve(false);
      }
    };
    
    // Inizia il controllo
    checkGoogleTranslate();
  });
};

// Funzione per ottenere la lingua corrente
export const getCurrentLanguage = (): string => {
  try {
    // Primo tentativo: leggi dal localStorage
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
      return savedLang;
    }
    
    // Default: italiano
    return 'it';
  } catch (error) {
    console.error('Errore nel recupero della lingua corrente:', error);
    return 'it';
  }
};

// Funzione per tradurre la pagina in sicurezza senza causare ricaricamenti infiniti
export const translatePage = (langCode: string): void => {
  try {
    // Evita ricaricamenti inutili se la lingua è già quella selezionata
    if (langCode === getCurrentLanguage()) {
      console.log('Lingua già impostata a', langCode);
      return;
    }
    
    // Controlla il flag per prevenire cicli
    if (isTranslating) {
      console.warn('Traduzione già in corso, evito ciclo di ricaricamento');
      return;
    }
    
    // Attiva il flag di protezione
    isTranslating = true;
    
    // Salva la preferenza di lingua
    localStorage.setItem('preferredLanguage', langCode);
    
    // Usa metodo con cookie (funziona con o senza ricaricamento)
    if (langCode === 'it') {
      // Cancella i cookie di traduzione di Google per tornare alla lingua originale
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + document.domain;
    } else {
      // Imposta il cookie di traduzione (questo sarà usato da Google Translate)
      document.cookie = `googtrans=/it/${langCode}; path=/;`;
      document.cookie = `googtrans=/it/${langCode}; path=/; domain=.${document.domain};`;
    }
    
    // Controlla se Google Translate è già caricato
    if (window.google && window.google.translate) {
      // Se già caricato, aggiorna la traduzione
      const element = document.getElementById('google_translate_element');
      if (element) {
        try {
          element.innerHTML = '';
          // Correzione errore linter: verifica che window.google e window.google.translate siano definiti
          if (window.google && window.google.translate && window.google.translate.TranslateElement) {
            new window.google.translate.TranslateElement({
              pageLanguage: 'it',
              includedLanguages: 'it,en,sq,fr,de,es',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            }, 'google_translate_element');
          }
        } catch (e) {
          console.error('Errore nel reinizializzare il widget:', e);
        }
      }
    } else {
      // Carica Google Translate se non è già presente
      if (!document.querySelector('script[src*="translate.google.com"]')) {
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
        
        // Definisci la funzione di inizializzazione
        window.googleTranslateElementInit = function() {
          try {
            // Correzione errore linter: verifica che window.google e window.google.translate siano definiti
            if (window.google && window.google.translate && window.google.translate.TranslateElement) {
              new window.google.translate.TranslateElement({
                pageLanguage: 'it',
                includedLanguages: 'it,en,sq,fr,de,es',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          } catch (e) {
            console.error('Errore nell\'inizializzazione del widget:', e);
          }
        };
      }
    }
    
    // Rimuovi il flag dopo 5 secondi per consentire altre traduzioni
    setTimeout(() => {
      isTranslating = false;
    }, 5000);
  } catch (error) {
    console.error('Errore nella traduzione:', error);
    isTranslating = false;
  }
};

// Funzione per impostare manualmente la lingua, usata dal componente LanguageSwitcher
export const setLanguage = async (langCode: string): Promise<boolean> => {
  try {
    // Usa la funzione sicura per la traduzione
    translatePage(langCode);
    return true;
  } catch (error) {
    console.error('Errore nel cambio lingua:', error);
    return false;
  }
}; 