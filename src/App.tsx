import React, { useEffect, useState } from 'react';
import PackageList from './components/PackageList';
import Footer from './components/Footer';
import Header from './components/Header';
import { travelPackages } from './constants/data';
import Orders from './pages/Orders';
import ReferralManager from './pages/ReferralManager';
import PromoterDashboard from './pages/PromoterDashboard';
import { OrderProvider } from './contexts/OrderContext';
import { CartProvider } from './contexts/CartContext';
import { validateReferralCode } from './services/firebase';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Aggiorna il percorso quando cambia
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    // Monitora i cambiamenti di percorso
    window.addEventListener('popstate', handlePathChange);

    // Controlla i referral nell'URL
    const checkReferralCode = async () => {
      try {
        // Prendi il parametro ref dall'URL
        const urlParams = new URLSearchParams(window.location.search);
        const refCode = urlParams.get('ref');
        
        if (refCode) {
          // Verifica se il codice referral è valido
          const referral = await validateReferralCode(refCode);
          
          if (referral) {
            // Salva il codice nel localStorage per usarlo quando l'utente fa un acquisto
            localStorage.setItem('referralCode', refCode);
            console.log(`Referral valido: ${refCode}`);
          }
        }
      } catch (error) {
        console.error('Errore nella verifica del referral:', error);
      }
    };

    // Controlla il referral code all'avvio
    checkReferralCode();

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handlePathChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  return (
    <OrderProvider>
      <CartProvider>
        {currentPath === '/ordini' ? (
          <Orders />
        ) : currentPath === '/referral' ? (
          <ReferralManager />
        ) : currentPath === '/mistake-dashboard' ? (
          <PromoterDashboard />
        ) : (
          <div className="font-['Inter',sans-serif] antialiased">
            <Header />
            <main>
              <PackageList packages={travelPackages} />
            </main>
            <Footer />
          </div>
        )}
      </CartProvider>
    </OrderProvider>
  );
}

export default App;