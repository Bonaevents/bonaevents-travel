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

// Funzione per tradurre la pagina in sicurezza - Semplificata
export const translatePage = (langCode: string): void => {
  try {
    const currentLang = getCurrentLanguage();
    
    // Evita ricaricamenti inutili se la lingua è già quella selezionata
    if (langCode === currentLang) {
      console.log('Lingua già impostata a', langCode);
      return;
    }

    // Salva la preferenza di lingua (utile se l'utente torna)
    localStorage.setItem('preferredLanguage', langCode);

    // Imposta o cancella il cookie di traduzione
    if (langCode === 'it') {
      // Cancella i cookie per tornare all'italiano
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + document.domain;
    } else {
      // Imposta il cookie per la nuova lingua
      document.cookie = `googtrans=/it/${langCode}; path=/;`;
      document.cookie = `googtrans=/it/${langCode}; path=/; domain=.${document.domain};`;
    }

    // Forza il ricaricamento della pagina per applicare la traduzione tramite cookie
    // Questo è il metodo più affidabile in produzione con Google Translate
    window.location.reload();

  } catch (error) {
    console.error('Errore nella traduzione:', error);
    // Non è più necessario gestire isTranslating qui
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