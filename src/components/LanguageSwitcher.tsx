import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Array delle lingue supportate
const languages = [
  { code: 'it', name: 'Italiano' },
  { code: 'en', name: 'English' },
  { code: 'sq', name: 'Shqip' },   // Albanese
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' }
];

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [hasError, setHasError] = useState(false);
  
  // Funzione per cambiare la lingua
  const changeLanguage = (langCode: string) => {
    try {
      // Salviamo la lingua nelle preferenze locali
      localStorage.setItem('preferredLanguage', langCode);
      
      // Cambiamo la lingua dell'applicazione
      i18n.changeLanguage(langCode)
        .catch((error) => {
          console.error('Errore nel cambio lingua:', error);
          setHasError(true);
        });
    } catch (error) {
      console.error('Errore nel cambio lingua:', error);
      setHasError(true);
    }
  };
  
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
      
      {/* Selettore lingua */}
      <select 
        className="bg-transparent border-none text-gray-600 text-sm pr-4 focus:outline-none cursor-pointer"
        value={i18n.language}
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