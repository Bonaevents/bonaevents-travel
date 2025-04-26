import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { setLanguage, getCurrentLanguage } from '../utils/translateHelper';

// Array delle lingue supportate
const languages = [
  { code: 'it', name: 'Italiano' },
  { code: 'en', name: 'English' },
  { code: 'sq', name: 'Shqip' },   // Albanese
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
  // Recupera la lingua preferita
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const [hasError, setHasError] = useState(false);
  
  // Funzione per cambiare la lingua
  const changeLanguage = (langCode: string) => {
    try {
      setCurrentLang(langCode);
      
      // Usa la funzione di traduzione sicura che non causa ricaricamenti infiniti
      setLanguage(langCode);
    } catch (error) {
      console.error('Errore nel cambio lingua:', error);
      setHasError(true);
    }
  };
  
  // Inizializza la traduzione quando il componente viene montato
  useEffect(() => {
    try {
      // Verifica se dobbiamo applicare una traduzione all'avvio
      const savedLang = getCurrentLanguage();
      if (savedLang !== 'it') {
        // Applica la traduzione salvata solo all'avvio, con un leggero ritardo
        const timer = setTimeout(() => {
          setLanguage(savedLang);
        }, 1500);
        
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Errore durante l\'inizializzazione della traduzione:', error);
    }
  }, []);
  
  // Se c'è un errore, mostra un selettore finto che non fa nulla
  if (hasError) {
    return (
      <div className="flex items-center">
        <Globe size={18} className="text-gray-600 mr-2" />
        <select className="bg-transparent border-none text-gray-600 text-sm pr-4 focus:outline-none cursor-pointer">
          <option>Italiano</option>
        </select>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Globe size={18} className="text-gray-600 mr-2" />
      
      {/* Nostro selettore personalizzato */}
      <select 
        className="bg-transparent border-none text-gray-600 text-sm pr-4 focus:outline-none cursor-pointer"
        value={currentLang}
        onChange={(e) => changeLanguage(e.target.value)}
        title="Seleziona lingua"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher; 