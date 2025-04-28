import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Minus, Plus, X, ShoppingCart } from 'lucide-react';
import Button from './Button';
import { useTranslation } from 'react-i18next';

interface CartSummaryProps {
  onCheckout: () => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout }) => {
  const { t } = useTranslation();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice, 
    getTotalItems,
    getDepositTotal
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="p-4 text-center rounded-lg border border-gray-200 bg-white shadow">
        <ShoppingCart className="mx-auto mb-2 text-gray-400" size={32} />
        <p className="text-gray-500">{t('cart.empty', 'Il tuo carrello è vuoto')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold text-lg text-gray-800">
          {t('cart.summary', 'Riepilogo Carrello')} ({getTotalItems()})
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {cartItems.map((item) => (
          <div key={item.packageData.id} className="p-4 flex items-start">
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">
                {item.packageData.name}
              </h4>
              <p className="text-sm text-gray-500">
                {item.packageData.location}
              </p>
              <div className="mt-2 text-teal-600 font-medium">
                €{item.packageData.price.toLocaleString('it-IT')}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <button 
                onClick={() => removeFromCart(item.packageData.id)}
                className="text-gray-400 hover:text-red-500 mb-2"
                aria-label="Rimuovi"
              >
                <X size={18} />
              </button>
              
              <div className="flex items-center border border-gray-200 rounded">
                <button
                  onClick={() => updateQuantity(item.packageData.id, item.quantity - 1)}
                  className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                  aria-label="Diminuisci quantità"
                >
                  <Minus size={16} />
                </button>
                <span className="px-3 py-1">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.packageData.id, item.quantity + 1)}
                  className="px-2 py-1 text-gray-500 hover:bg-gray-100"
                  aria-label="Aumenta quantità"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-gray-50 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>{t('cart.totalPackages', 'Totale pacchetti')}:</span>
          <span>€{getTotalPrice().toLocaleString('it-IT')}</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>{t('cart.depositTotal', 'Totale caparre')}:</span>
          <span className="text-teal-600">€{getDepositTotal().toLocaleString('it-IT')}</span>
        </div>
        <div className="pt-3">
          <Button 
            variant="primary" 
            onClick={onCheckout}
            className="w-full"
          >
            {t('cart.proceedToCheckout', 'Procedi al Pagamento')}
          </Button>
        </div>
        <p className="text-sm text-gray-500 text-center">
          {t('cart.depositNote', 'Verrà addebitata solo la caparra di €100 per ciascun pacchetto')}
        </p>
      </div>
    </div>
  );
};

export default CartSummary; 