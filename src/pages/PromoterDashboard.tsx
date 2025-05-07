import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getReferrals, getOrdersByReferral, Referral, Order } from '../services/firebase';

const PROMOTER_EMAIL = 'mistake1712@gmail.com';
const PROMOTER_PASSWORD = 'mistake2025';

const PromoterDashboard: React.FC = () => {
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoterOrders, setPromoterOrders] = useState<Order[]>([]);
  const [promoterReferralCode, setPromoterReferralCode] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (email === PROMOTER_EMAIL && password === PROMOTER_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setError('Credenziali non valide.');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchPromoterData = async () => {
      setLoading(true);
      setError(null);
      setPromoterOrders([]);
      setPromoterReferralCode(null);

      try {
        const allReferrals = await getReferrals();
        const promoterReferral = allReferrals.find(ref => ref.name === PROMOTER_EMAIL);

        if (!promoterReferral || !promoterReferral.code) {
          setError(`Referral non trovato per ${PROMOTER_EMAIL}. Assicurati che esista un referral con questa email nel campo "Nome" e che abbia un codice associato.`);
          setLoading(false);
          return;
        }
        
        setPromoterReferralCode(promoterReferral.code);
        const orders = await getOrdersByReferral(promoterReferral.code);
        setPromoterOrders(orders);

      } catch (err: any) {
        console.error("Errore nel caricamento dei dati del promoter:", err);
        setError(err.message || 'Si è verificato un errore nel caricamento dei dati.');
      } finally {
        setLoading(false);
      }
    };

    fetchPromoterData();
  }, [isAuthenticated]);

  const formatDate = (date: any) => {
    if (!date) return '';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(dateObj);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-teal-400 mb-8">Accesso Promoter</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-700 bg-gray-700 text-white rounded-md focus:ring-teal-500 focus:border-teal-500 placeholder-gray-500"
                placeholder="iltuonome@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPasswordInput ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-700 bg-gray-700 text-white rounded-md focus:ring-teal-500 focus:border-teal-500 placeholder-gray-500"
                  placeholder="La tua password"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-teal-400"
                  onClick={() => setShowPasswordInput(!showPasswordInput)}
                >
                  {showPasswordInput ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-red-400 text-sm bg-red-900 bg-opacity-50 p-3 rounded-md">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2.5 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-colors font-semibold"
            >
              Accedi
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gray-800 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-teal-400">Dashboard Promoter</h1>
              <div className="mt-3 sm:mt-0">
                <p className="text-sm text-gray-400">Email: <span className="font-medium text-gray-300">{PROMOTER_EMAIL}</span></p>
                {promoterReferralCode && (
                  <p className="text-sm text-gray-400">Codice Referral: <span className="font-medium text-gray-300">{promoterReferralCode}</span></p>
                )}
              </div>
            </div>
          </div>

          {loading && (
            <div className="p-8 text-center text-gray-600">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600 mb-4"></div>
              <p className="text-xl">Caricamento ordini...</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-8 text-center">
              <p className="text-red-600 bg-red-100 p-4 rounded-md text-lg">{error}</p>
            </div>
          )}

          {!loading && !error && promoterOrders.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">Nessun ordine trovato per il tuo codice referral.</p>
            </div>
          )}

          {!loading && !error && promoterOrders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['ID Ordine', 'Pacchetto', 'Prezzo', 'Cliente', 'Data', 'Stato'].map(header => (
                      <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {promoterOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id ? order.id.substring(0, 8) + '...': 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.packageName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{order.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customerEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status === 'completed' ? 'Completato' : order.status === 'processing' ? 'In Elaborazione' : 'Fallito'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
           <div className="bg-gray-50 px-6 py-4 text-right">
             <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setEmail('');
                  setPassword('');
                  setPromoterOrders([]);
                  setError(null);
                  setPromoterReferralCode(null);
                }}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PromoterDashboard; 