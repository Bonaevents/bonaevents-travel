import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../libs/stripe';
import CheckoutForm from './CheckoutForm';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: {
    name: string;
    price: number;
  };
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, packageData }) => {
  const { t } = useTranslation();
  const [paymentComplete, setPaymentComplete] = React.useState(false);

  const handlePaymentSuccess = () => {
    setPaymentComplete(true);
    setTimeout(() => {
      onClose();
      // Resettiamo lo stato per la prossima apertura
      setTimeout(() => setPaymentComplete(false), 300);
    }, 3000);
  };

  // Formatta il prezzo come € X.XXX,XX
  const formattedPrice = packageData.price.toLocaleString('it-IT', {
    style: 'currency',
    currency: 'EUR',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white w-full max-w-md rounded-lg shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={paymentComplete}
        >
          <X size={24} />
        </button>

        {paymentComplete ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('checkout.success')}</h2>
            <p className="text-gray-600">
              {t('checkout.confirmationEmail', 'Grazie per il tuo acquisto. Riceverai una email di conferma a breve.')}
            </p>
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm
              amount={packageData.price}
              packageName={packageData.name}
              onSuccess={handlePaymentSuccess}
              onCancel={onClose}
            />
          </Elements>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal; 