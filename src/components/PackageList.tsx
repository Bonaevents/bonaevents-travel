import React from 'react';
import PackageCard from './PackageCard';
import { TravelPackage } from '../types';

interface PackageListProps {
  packages: TravelPackage[];
}

const PackageList: React.FC<PackageListProps> = ({ packages }) => {
  if (!packages || packages.length === 0) {
    return <div className="text-center my-10">Nessun pacchetto disponibile al momento.</div>;
  }

  return (
    <section id="packages" className="py-16 bg-gray-50">
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto max-w-screen-xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pacchetti Vacanza a Saranda
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
            Esplora la nostra selezione di pacchetti esclusivi per vivere una vacanza 
            indimenticabile a Saranda, la perla della Riviera Albanese.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className="flex justify-center"
            >
              <PackageCard 
                packageData={pkg} 
                className="h-full w-full max-w-md"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackageList;