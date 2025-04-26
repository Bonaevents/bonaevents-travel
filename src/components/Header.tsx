import React, { Suspense, lazy } from 'react';

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
          
          {/* Elemento vuoto per bilanciare il layout su desktop */}
          <div className="hidden sm:block w-[120px]"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;