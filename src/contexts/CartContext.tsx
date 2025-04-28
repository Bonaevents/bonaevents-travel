import React, { createContext, useState, useContext, useEffect } from 'react';
import { TravelPackage } from '../types';

// Definiamo un tipo per gli elementi del carrello
export interface CartItem {
  packageData: TravelPackage;
  quantity: number;
}

// Definizione del contesto del carrello
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (packageData: TravelPackage, quantity?: number) => void;
  removeFromCart: (packageId: string) => void;
  updateQuantity: (packageId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getDepositTotal: () => number;
}

// Creazione del contesto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Carica il carrello dal localStorage all'avvio
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Errore nel caricamento del carrello:', error);
      }
    }
  }, []);

  // Salva il carrello nel localStorage quando cambia
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Aggiungi un pacchetto al carrello
  const addToCart = (packageData: TravelPackage, quantity = 1) => {
    setCartItems(prevItems => {
      // Verifica se il pacchetto è già nel carrello
      const existingItemIndex = prevItems.findIndex(item => item.packageData.id === packageData.id);
      
      if (existingItemIndex >= 0) {
        // Se esiste, aggiorna la quantità
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return updatedItems;
      } else {
        // Altrimenti aggiunge il nuovo elemento
        return [...prevItems, { packageData, quantity }];
      }
    });
  };

  // Rimuovi un pacchetto dal carrello
  const removeFromCart = (packageId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.packageData.id !== packageId));
  };

  // Aggiorna la quantità di un pacchetto
  const updateQuantity = (packageId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(packageId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.packageData.id === packageId ? { ...item, quantity } : item
      )
    );
  };

  // Svuota il carrello
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcola il prezzo totale
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.packageData.price * item.quantity), 0);
  };

  // Calcola il numero totale di elementi
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calcola il totale delle caparre (100€ per ogni pacchetto)
  const getDepositTotal = () => {
    return cartItems.reduce((total, item) => total + (100 * item.quantity), 0);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getTotalPrice, 
        getTotalItems,
        getDepositTotal 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizzato per utilizzare il contesto
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve essere usato all\'interno di un CartProvider');
  }
  return context;
}; 