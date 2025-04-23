import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  Timestamp,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBQubyXE1gZNRFt7IZ2qSx7cI-xuKm49dU",
  authDomain: "bonaevents-pack.firebaseapp.com",
  projectId: "bonaevents-pack",
  storageBucket: "bonaevents-pack.firebasestorage.app",
  messagingSenderId: "825136605570",
  appId: "1:825136605570:web:e19320da42b8ad38fd479b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Struttura delle collezioni
export const collections = {
  ORDERS: 'orders',
  REFERRALS: 'referrals'
};

// Interfacce per i tipi di dati
export interface Order {
  id?: string;
  packageName: string;
  price: number;
  customerEmail: string;
  status: 'completed' | 'processing' | 'failed';
  date: Timestamp | Date;
  referralCode?: string;
}

export interface Referral {
  id?: string;
  code: string;
  name: string;
  createdAt: Timestamp | Date;
  active: boolean;
  commission?: number; // Percentuale di commissione (opzionale)
}

// ===== OPERAZIONI SUGLI ORDINI =====

// Aggiunge un nuovo ordine
export const addOrder = async (orderData: Omit<Order, 'date'>) => {
  try {
    // Aggiungi data automaticamente
    const orderWithDate = {
      ...orderData,
      date: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, collections.ORDERS), orderWithDate);
    return { id: docRef.id, ...orderWithDate };
  } catch (error) {
    console.error("Errore durante l'aggiunta dell'ordine:", error);
    throw error;
  }
};

// Ottiene tutti gli ordini
export const getOrders = async () => {
  try {
    const q = query(
      collection(db, collections.ORDERS),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error("Errore durante il recupero degli ordini:", error);
    throw error;
  }
};

// Cancella tutti gli ordini (solo per sviluppo/testing)
export const clearOrders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, collections.ORDERS));
    
    const deletePromises = querySnapshot.docs.map(async (doc) => {
      await setDoc(doc.ref, { deleted: true, deletedAt: Timestamp.now() }, { merge: true });
    });
    
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error("Errore durante la cancellazione degli ordini:", error);
    throw error;
  }
};

// ===== OPERAZIONI SUI REFERRAL =====

// Crea un nuovo codice referral
export const createReferral = async (referralData: Omit<Referral, 'createdAt'>) => {
  try {
    // Controlla se il codice esiste già
    const q = query(
      collection(db, collections.REFERRALS),
      where('code', '==', referralData.code)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error(`Il codice referral "${referralData.code}" esiste già`);
    }
    
    // Crea il nuovo referral
    const referralWithDate = {
      ...referralData,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, collections.REFERRALS), referralWithDate);
    return { id: docRef.id, ...referralWithDate };
  } catch (error) {
    console.error("Errore durante la creazione del referral:", error);
    throw error;
  }
};

// Ottiene tutti i referral
export const getReferrals = async () => {
  try {
    const q = query(
      collection(db, collections.REFERRALS),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const referrals: Referral[] = [];
    
    querySnapshot.forEach((doc) => {
      referrals.push({ id: doc.id, ...doc.data() } as Referral);
    });
    
    return referrals;
  } catch (error) {
    console.error("Errore durante il recupero dei referral:", error);
    throw error;
  }
};

// Verifica se un codice referral è valido
export const validateReferralCode = async (code: string) => {
  try {
    const q = query(
      collection(db, collections.REFERRALS),
      where('code', '==', code),
      where('active', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as Referral;
  } catch (error) {
    console.error("Errore durante la validazione del codice referral:", error);
    throw error;
  }
};

// Ottiene gli ordini per codice referral
export const getOrdersByReferral = async (referralCode: string) => {
  try {
    const q = query(
      collection(db, collections.ORDERS),
      where('referralCode', '==', referralCode),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error("Errore durante il recupero degli ordini per referral:", error);
    throw error;
  }
}; 