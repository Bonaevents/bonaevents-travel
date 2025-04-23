import React from 'react';
import PackageCard from './PackageCard';
import { TravelPackage } from '../types';

interface PackageListProps {
  packages: TravelPackage[];
}

const PackageList: React.FC<PackageListProps> = ({ packages }) => {
  return (
    <section id="packages" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sezione foto panoramica */}
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-xl mb-20">
          <img
            src="/hero.png"
            alt="Panoramic travel destination"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 text-white">
              <h3 className="text-3xl font-bold mb-4">Scopri la magia di Saranda</h3>
              <p className="text-lg max-w-2xl">
                La perla nascosta della Riviera Albanese ti aspetta con le sue acque cristalline, spiagge incontaminate e un'accoglienza calorosa.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pacchetti Vacanza a Saranda
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Scopri le nostre offerte esclusive per vivere un'esperienza indimenticabile nella gemma del Mar Ionio. Relax, cultura e avventura ti aspettano.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} packageData={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackageList;