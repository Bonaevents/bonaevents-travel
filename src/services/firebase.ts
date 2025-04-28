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
  storageBucket: "bonaevents-pack.appspot.com",
  messagingSenderId: "825136605570",
  appId: "1:825136605570:web:e19320da42b8ad38fd479b"
};

// Initialize Firebase
console.log("Inizializzazione Firebase in ambiente cloud...");
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
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date;
  status: 'completed' | 'failed' | 'processing';
  referralCode?: string;
  quantity?: number;
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
  console.log('createReferral chiamata con:', referralData);
  
  // Verifica che il database sia inizializzato
  if (!db) {
    console.error('Firebase DB non inizializzato!');
    throw new Error('Errore di connessione al database');
  }
  
  try {
    // Controlla se il codice esiste già
    console.log('Verifico se il codice esiste già:', referralData.code);
    const q = query(
      collection(db, collections.REFERRALS),
      where('code', '==', referralData.code)
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Query completata, documenti trovati:', querySnapshot.size);
    
    if (!querySnapshot.empty) {
      console.warn(`Codice referral "${referralData.code}" già esistente`);
      throw new Error(`Il codice referral "${referralData.code}" esiste già`);
    }
    
    // Crea il nuovo referral
    console.log('Creo nuovo referral con data:', Timestamp.now());
    const referralWithDate = {
      ...referralData,
      createdAt: Timestamp.now()
    };
    
    console.log('Aggiungo documento a Firestore:', referralWithDate);
    const docRef = await addDoc(collection(db, collections.REFERRALS), referralWithDate);
    console.log('Documento aggiunto con ID:', docRef.id);
    
    return { id: docRef.id, ...referralWithDate };
  } catch (error) {
    console.error("Errore dettagliato durante la creazione del referral:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Errore sconosciuto durante la creazione del referral');
    }
  }
};

// Ottiene tutti i referral
export const getReferrals = async () => {
  console.log('getReferrals chiamata');
  try {
    console.log('Creo query per ottenere referrals');
    const q = query(
      collection(db, collections.REFERRALS),
      orderBy('createdAt', 'desc')
    );
    
    console.log('Eseguo query su Firestore');
    const querySnapshot = await getDocs(q);
    console.log('Query completata, documenti trovati:', querySnapshot.size);
    
    const referrals: Referral[] = [];
    
    querySnapshot.forEach((doc) => {
      console.log('Documento referral trovato:', doc.id, doc.data());
      referrals.push({ id: doc.id, ...doc.data() } as Referral);
    });
    
    console.log('Referrals ottenuti:', referrals);
    return referrals;
  } catch (error) {
    console.error("Errore dettagliato durante il recupero dei referral:", error);
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