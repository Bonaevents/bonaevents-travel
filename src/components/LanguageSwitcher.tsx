import React, { useEffect } from 'react';
import { Globe } from 'lucide-react';

// Array delle lingue supportate
const languages = [
  { code: 'it', name: 'Italiano' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' }
];

// Definizione del tipo per Window con le proprietà di Google Translate
interface CustomWindow extends Window {
  googleTranslateElementInit?: () => void;
  google?: any;
}

const LanguageSwitcher: React.FC = () => {
  useEffect(() => {
    // Cast window all'interfaccia estesa
    const customWindow = window as CustomWindow;

    // Inizializza Google Translate
    const addScript = () => {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      
      // Funzione callback per inizializzare il widget
      customWindow.googleTranslateElementInit = () => {
        if (customWindow.google && customWindow.google.translate) {
          new customWindow.google.translate.TranslateElement(
            {
              pageLanguage: 'it',
              includedLanguages: languages.map(lang => lang.code).join(','),
              layout: customWindow.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            },
            'google_translate_element'
          );
        }
      };
    };

    // Aggiungi lo script solo se non è già stato aggiunto
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      addScript();
    }

    return () => {
      // Cleanup
      if (customWindow.googleTranslateElementInit) {
        delete customWindow.googleTranslateElementInit;
      }
    };
  }, []);

  // Aggiungi CSS per lo styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Nascondi alcuni elementi non necessari */
      .goog-te-banner-frame,
      .goog-te-menu-value span:nth-child(3),
      .goog-te-menu-value span:nth-child(4),
      .goog-te-menu-value span:nth-child(5) {
        display: none !important;
      }
      
      /* Stile del selettore */
      .goog-te-menu-value {
        color: #4B5563 !important;
        text-decoration: none !important;
        font-family: 'Inter', sans-serif !important;
        font-size: 0.9rem !important;
        display: flex !important;
        align-items: center !important;
      }
      
      /* Riduci la dimensione del contenitore */
      #google_translate_element {
        min-width: 120px;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="flex items-center">
      <Globe size={18} className="text-gray-600 mr-2" />
      <div id="google_translate_element"></div>
    </div>
  );
};

export default LanguageSwitcher; 