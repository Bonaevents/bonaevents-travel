import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  addOrder as addOrderToDb, 
  getOrders as getOrdersFromDb, 
  clearOrders as clearOrdersFromDb, 
  Order as FirebaseOrder 
} from '../services/firebase';

// Utilizziamo il tipo Order da Firebase
export type Order = FirebaseOrder;

// Definizione del contesto
interface OrderContextType {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'date'>) => Promise<Order | undefined>;
  clearOrders: () => Promise<boolean>;
  loading: boolean;
}

// Creazione del contesto
const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Provider component
export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Carica gli ordini dal database all'avvio
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await getOrdersFromDb();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Errore nel caricamento degli ordini:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Aggiunge un nuovo ordine
  const addOrder = async (orderData: Omit<Order, 'date'>) => {
    try {
      setLoading(true);
      
      // Verifica se c'è un codice referral nel localStorage
      const referralCode = localStorage.getItem('referralCode');
      const orderWithReferral = referralCode 
        ? { ...orderData, referralCode } 
        : orderData;
      
      // Salva l'ordine nel database
      const newOrder = await addOrderToDb(orderWithReferral);
      
      // Aggiorna lo stato locale
      setOrders(prevOrders => [newOrder, ...prevOrders]);
      
      return newOrder;
    } catch (error) {
      console.error('Errore nell\'aggiunta dell\'ordine:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancella tutti gli ordini
  const clearOrders = async () => {
    try {
      setLoading(true);
      await clearOrdersFromDb();
      setOrders([]);
      return true;
    } catch (error) {
      console.error('Errore nella cancellazione degli ordini:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, clearOrders, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

// Hook personalizzato per utilizzare il contesto
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders deve essere usato all\'interno di un OrderProvider');
  }
  return context;
}; 