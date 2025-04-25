import React from 'react';
import { Check } from 'lucide-react';

interface EstateFolleCardProps {
  className?: string;
  onAcquistaClick?: () => void;
}

const EstateFolleCard: React.FC<EstateFolleCardProps> = ({ className, onAcquistaClick }) => {
  return (
    <div className={`relative w-full h-full overflow-hidden rounded-xl bg-white ${className || ''}`} lang="it">
      {/* Sfondo con effetto ondulato */}
      <div className="absolute -right-16 top-0 bottom-0 w-3/4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-20"></div>
      
      {/* Contenuto principale */}
      <div className="relative z-10 p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="mt-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">A SARANDA</h2>
            </div>
          </div>
          
          {/* Spazio vuoto dove c'era il logo */}
          <div className="w-16 h-16"></div> 
        </div>
        
        {/* Titolo principale */}
        <div className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-sky-500 font-script tracking-wide transform -rotate-2">Estate Folle</h1>
          <p className="text-base sm:text-lg font-bold uppercase tracking-widest mt-1">FESTA E MARE NO STOP!</p>
        </div>
        
        {/* Pulsante prenota */}
        <div className="mb-6 text-center">
          <button 
            className="bg-sky-500 text-white text-base sm:text-lg font-bold py-2 px-6 rounded-full inline-block shadow-lg hover:bg-sky-600 transition-colors"
            onClick={onAcquistaClick}
          >
            PRENOTA ORA
          </button>
        </div>
        
        {/* Offerta valida testo */}
        <div className="text-center mb-3">
          <p className="font-bold text-base">Offerta valida per le prime 50 persone!</p>
        </div>
        
        {/* Lista caratteristiche */}
        <div className="space-y-2 mb-4">
          <FeatureItem text="5 giorni di Agosto di pura emozione e follia" />
          <FeatureItem text="Hotel sul mare con festa in piscina da paura" />
          <FeatureItem text="Feste tutte le sere; incluso boat party con alcohol illimitato" />
          <FeatureItem text="Accesso VIP a tutti i nostri eventi" />
          <FeatureItem text="Sconti esclusivi su escursioni, beach club, ristoranti e attività" />
        </div>
        
        {/* Opzione bus - in grassetto e senza spunta */}
        <div className="mb-4 text-center">
          <p className="font-bold text-sm">OPZIONE BUS DALLA TUA CITTA E TRAGHETTO ANDATA E RITORNO AGGIUNGENDO 200€</p>
        </div>
        
        {/* Footer con prezzo e social */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="inline-flex gap-1 items-center">
              {/* Instagram Icon */}
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 rounded-full flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" strokeWidth="2" />
                  <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="2" />
                  <circle cx="18" cy="6" r="1.5" fill="white" />
                </svg>
              </div>
              {/* TikTok Icon */}
              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-black rounded-full flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.3 7c-.8-.8-1.3-1.9-1.3-3H15v10.7c0 1.3-1 2.3-2.3 2.3-1.3 0-2.3-1-2.3-2.3 0-1.3 1-2.3 2.3-2.3.3 0 .5 0 .8.1V9.5c-.3 0-.5-.1-.8-.1-3 0-5.5 2.5-5.5 5.5S9.7 20.4 12.7 20.4s5.5-2.5 5.5-5.5V9.2c1.1.7 2.4 1 3.7 1V7.3c-.9 0-1.8-.1-2.6-.3z" fill="white" />
                </svg>
              </div>
            </div>
            <span className="ml-1 text-xs sm:text-sm font-medium">@BONAEVENTS_</span>
          </div>
          
          <div className="bg-sky-500 text-white rounded-full p-3 sm:p-4 shadow-lg transform rotate-3">
            <div className="text-center">
              <div className="text-xs font-semibold">A SOLI</div>
              <div className="text-xl sm:text-3xl font-bold">329€</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente per gli elementi della lista con icona check
const FeatureItem: React.FC<{ text: string; smallText?: boolean }> = ({ text, smallText }) => {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-sky-500 rounded-full flex items-center justify-center mr-2 mt-0.5">
        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
      </div>
      <span className={`${smallText ? 'text-xs' : 'text-xs sm:text-sm'} leading-tight`}>{text}</span>
    </div>
  );
};

export default EstateFolleCard; 