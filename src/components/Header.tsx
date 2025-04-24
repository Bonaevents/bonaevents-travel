import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
        <div className="flex justify-center">
          <img 
            src="/logohero.png" 
            alt="BonaEvents Logo" 
            className="h-20 sm:h-24 md:h-28 max-w-full object-contain"
          />
        </div>
      </div>
    </header>
  );
};

export default Header; 