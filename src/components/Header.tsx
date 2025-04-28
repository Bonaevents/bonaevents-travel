import React, { Suspense, lazy, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import CartSummary from './CartSummary';
import CheckoutModal from './CheckoutModal';

// Import dinamico con Suspense per evitare che un errore nel componente LanguageSwitcher blocchi l'intera app
const LanguageSwitcher = lazy(() => import('./LanguageSwitcher'));

// Componente fallback semplice in caso di errore nel caricamento di LanguageSwitcher
const LanguageSwitcherFallback = () => (
  <div className="w-[120px] h-6"></div>
);

// Componente che cattura gli errori
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <LanguageSwitcherFallback />;
    }
    return this.props.children;
  }
}

const Header: React.FC = () => {
  const { getTotalItems, getDepositTotal, cartItems } = useCart();
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCartClick = () => {
    setShowCartModal(true);
  };

  const handleCloseCart = () => {
    setShowCartModal(false);
  };

  const handleCheckout = () => {
    setShowCartModal(false);
    setShowCheckoutModal(true);
  };

  const handleCloseCheckout = () => {
    setShowCheckoutModal(false);
  };

  return (
    <header className="w-full bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        {/* Su mobile: selettore lingua in alto, logo sotto */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Selettore lingua - centrato su mobile, a sinistra su desktop */}
          <div className="language-selector rounded-lg px-3 py-2 bg-gray-100 border border-gray-200 shadow-sm hover:bg-gray-200 transition-colors mb-3 sm:mb-0 w-auto mx-auto sm:mx-0">
            <ErrorBoundary>
              <Suspense fallback={<LanguageSwitcherFallback />}>
                <LanguageSwitcher />
              </Suspense>
            </ErrorBoundary>
          </div>
          
          {/* Logo - sempre centrato */}
          <div className="mx-auto order-first sm:order-none">
            <img 
              src="/logohero.png" 
              alt="BonaEvents Logo" 
              className="h-16 sm:h-20 md:h-24 max-w-full object-contain"
            />
          </div>
          
          {/* Icona carrello */}
          <div className="relative mb-3 sm:mb-0">
            <button 
              onClick={handleCartClick}
              className="relative p-2 text-teal-600 hover:text-teal-800 transition-colors focus:outline-none"
              aria-label="Carrello"
            >
              <ShoppingCart size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Modale del Carrello */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-md rounded-lg shadow-xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold text-xl text-gray-800">Carrello</h2>
              <button
                onClick={handleCloseCart}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <CartSummary onCheckout={handleCheckout} />
            </div>
          </div>
        </div>
      )}

      {/* Modal di pagamento con Stripe */}
      {showCheckoutModal && cartItems.length > 0 && (
        <CheckoutModal
          isOpen={showCheckoutModal}
          onClose={handleCloseCheckout}
          packageData={{ 
            name: `Prenotazione multipla (${getTotalItems()} pacchetti)`,
            price: getDepositTotal()
          }}
          isMultiPackage={true}
        />
      )}
    </header>
  );
};

export default Header;