import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import Button from './Button';
import { TravelPackage } from '../types';
import { useOrders } from '../contexts/OrderContext';
import EstateFolleCard from './EstateFolleCard';
import EstatePremiumCard from './EstatePremiumCard';
import EstateBaseCard from './EstateBaseCard';
import CheckoutModal from './CheckoutModal';

interface PackageCardProps {
  packageData: TravelPackage;
  className?: string;
}

const PackageCard: React.FC<PackageCardProps> = ({ packageData, className }) => {
  const { id, name, location, image, price } = packageData;
  const [showThankYou, setShowThankYou] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Verifica quale tipo di pacchetto è
  const isEstateFollePackage = id === 'estate-folle';
  const isEstatePremiumPackage = id === '2'; // Pacchetto Premium a 280€
  const isEstateBasePackage = id === '3'; // Pacchetto Base a 189€

  const handleOpenCheckout = () => {
    setShowCheckoutModal(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckoutModal(false);
  };

  const handlePaymentSuccess = () => {
    setShowCheckoutModal(false);
    setShowThankYou(true);
    
    // Nascondi il messaggio dopo 3 secondi
    setTimeout(() => {
      setShowThankYou(false);
    }, 3000);
  };

  return (
    <>
      <div className={`group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${className || ''}`}>
        {isEstateFollePackage ? (
          // Renderizza il design "Estate Folle" a 330€
          <div className="h-full">
            <EstateFolleCard onAcquistaClick={handleOpenCheckout} />
          </div>
        ) : isEstatePremiumPackage ? (
          // Renderizza il design "Estate Premium" a 280€
          <div className="h-full">
            <EstatePremiumCard onAcquistaClick={handleOpenCheckout} />
          </div>
        ) : isEstateBasePackage ? (
          // Renderizza il design "Estate Base" a 189€
          <div className="h-full">
            <EstateBaseCard onAcquistaClick={handleOpenCheckout} />
          </div>
        ) : (
          // Renderizza il design standard per gli altri pacchetti
          <>
      {/* Card Image */}
            <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
                className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-80"></div>
              {/* Location Tag - Moved to right */}
              <div className="absolute bottom-4 right-4 flex items-center text-white">
          <span className="text-sm font-medium">{location}</span>
                <MapPin className="w-4 h-4 ml-1" />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors duration-300 mb-4 text-center">
            {name}
          </h3>
              
              {/* CTA Button */}
              <div className="mt-6 flex justify-center">
                <Button variant="primary" onClick={handleOpenCheckout}>
                  Acquista ora
                </Button>
              </div>
            </div>
          </>
        )}
        </div>
        
      {/* Modal di pagamento con Stripe */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={handleCloseCheckout}
        packageData={{ name, price }}
      />
        
      {/* Message di conferma */}
      {showThankYou && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
        </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Grazie per il tuo acquisto!</h2>
            <p className="text-gray-600 mb-4">
              Ti abbiamo inviato un'email con i dettagli del tuo pacchetto.
            </p>
            <button 
              onClick={() => setShowThankYou(false)}
              className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageCard;