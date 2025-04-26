import React from 'react';
import { Mail, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          {/* Contact Info */}
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Contattaci</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center">
                <Mail size={18} className="text-teal-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400">bonaevents.workspace@gmail.com</span>
              </li>
              <li className="flex items-center justify-center mt-2">
                <Instagram size={18} className="text-teal-500 mr-3 flex-shrink-0" />
                <a href="https://www.instagram.com/bonaevents_/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-teal-500 transition-colors">
                  Seguici su Instagram: @bonaevents_
                </a>
              </li>
            </ul>
            <p className="text-gray-400 mt-4 max-w-md mx-auto">
              Saranda: un piccolo paradiso sulla costa ionica dell'Albania, famosa per le sue acque cristalline, 
              spiagge dorate e la vicinanza a siti storici come Butrinto, patrimonio UNESCO.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} BonaEvents. Tutti i diritti riservati.
          </p>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-teal-500 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-teal-500 transition-colors">
                  Termini di Servizio
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-teal-500 transition-colors">
                  Cookie
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;