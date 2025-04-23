import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash, Copy, Plus, FileText } from 'lucide-react';
import { 
  getReferrals, 
  createReferral, 
  getOrdersByReferral, 
  Referral,
  Order,
  getOrders
} from '../services/firebase';
import { ADMIN_PASSWORD, SITE_URL } from '../libs/config';

const ReferralManager: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<string | null>(null);
  const [referralOrders, setReferralOrders] = useState<Order[]>([]);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [newReferral, setNewReferral] = useState({
    name: '',
    code: '',
    commission: 10,
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [referralStats, setReferralStats] = useState<
    Record<string, { totalSales: number, totalCommission: number, ordersCount: number }>
  >({});

  // Calcola statistiche per ogni referral
  const calculateReferralStats = (orders: Order[], referrals: Referral[]) => {
    const stats: Record<string, { totalSales: number, totalCommission: number, ordersCount: number }> = {};
    
    // Inizializza stats per ogni referral
    referrals.forEach(ref => {
      stats[ref.code] = { totalSales: 0, totalCommission: 0, ordersCount: 0 };
    });
    
    // Calcola i totali
    orders.forEach(order => {
      if (order.referralCode && stats[order.referralCode]) {
        stats[order.referralCode].ordersCount += 1;
        
        if (order.status === 'completed') {
          stats[order.referralCode].totalSales += order.price;
          
          // Trova la commissione per questo referral
          const referral = referrals.find(r => r.code === order.referralCode);
          if (referral && referral.commission) {
            const commission = (order.price * referral.commission) / 100;
            stats[order.referralCode].totalCommission += commission;
          }
        }
      }
    });
    
    return stats;
  };

  // Carica i referral e gli ordini
  const loadData = async () => {
    try {
      setLoading(true);
      const [fetchedReferrals, fetchedOrders] = await Promise.all([
        getReferrals(),
        getOrders()
      ]);
      
      setReferrals(fetchedReferrals);
      setAllOrders(fetchedOrders);
      
      // Calcola le statistiche
      const stats = calculateReferralStats(fetchedOrders, fetchedReferrals);
      setReferralStats(stats);
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
      setError('Impossibile caricare i dati');
    } finally {
      setLoading(false);
    }
  };

  // Gestisce il login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      loadData();
    } else {
      setError('Password non corretta');
    }
  };

  // Crea un nuovo referral
  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!newReferral.name.trim() || !newReferral.code.trim()) {
      setError('Inserisci un nome e un codice per il referral');
      return;
    }

    try {
      setLoading(true);
      await createReferral({
        name: newReferral.name,
        code: newReferral.code,
        commission: newReferral.commission,
        active: true
      });
      
      setNewReferral({
        name: '',
        code: '',
        commission: 10,
      });
      
      setSuccessMessage('Referral creato con successo');
      loadData();
    } catch (error: any) {
      setError(error.message || 'Errore nella creazione del referral');
    } finally {
      setLoading(false);
    }
  };

  // Visualizza gli ordini di un referral
  const handleViewOrders = async (code: string) => {
    try {
      setLoading(true);
      setSelectedReferral(code);
      const orders = await getOrdersByReferral(code);
      setReferralOrders(orders);
      setShowOrdersModal(true);
    } catch (error) {
      console.error('Errore nel caricamento degli ordini:', error);
    } finally {
      setLoading(false);
    }
  };

  // Copia il link referral negli appunti
  const copyReferralLink = (code: string) => {
    const link = `${SITE_URL}?ref=${code}`;
    navigator.clipboard.writeText(link);
    setSuccessMessage('Link copiato negli appunti');
    
    // Nascondi il messaggio dopo 3 secondi
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  // Formatta la data
  const formatDate = (date: Date | any) => {
    if (!date) return '';
    
    // Se è un Timestamp di Firestore, convertiamolo in Date
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };

  // Formatta il valore monetario
  const formatCurrency = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };

  // Calcola il totale degli ordini per un referral
  const calculateTotalForReferral = (orders: Order[]) => {
    return orders.reduce((total, order) => {
      return order.status === 'completed' ? total + order.price : total;
    }, 0);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Gestione Referral</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors"
            >
              Accedi
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestione Referral</h1>
          <div className="flex space-x-4">
            <a 
              href="/ordini" 
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Visualizza Ordini
            </a>
            <a 
              href="/" 
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
            >
              Torna al sito
            </a>
          </div>
        </div>

        {/* Form per creare un nuovo referral */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Crea nuovo referral</h2>
          <form onSubmit={handleCreateReferral} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={newReferral.name}
                  onChange={(e) => setNewReferral({ ...newReferral, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Es. Mario Rossi"
                  required
                />
              </div>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Codice
                </label>
                <input
                  type="text"
                  id="code"
                  value={newReferral.code}
                  onChange={(e) => setNewReferral({ ...newReferral, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Es. MARIO23"
                  required
                />
              </div>
              <div>
                <label htmlFor="commission" className="block text-sm font-medium text-gray-700 mb-2">
                  Commissione (%)
                </label>
                <input
                  type="number"
                  id="commission"
                  min="0"
                  max="100"
                  value={newReferral.commission}
                  onChange={(e) => setNewReferral({ ...newReferral, commission: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-md focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            
            {successMessage && (
              <div className="text-green-500 text-sm">
                {successMessage}
              </div>
            )}
            
            <div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                disabled={loading}
              >
                <Plus className="mr-2 h-4 w-4" /> 
                {loading ? 'Creazione in corso...' : 'Crea Referral'}
              </button>
            </div>
          </form>
        </div>

        {/* Lista dei referral */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900">Referral attivi</h2>
          </div>
          
          {loading && referrals.length === 0 ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600 mb-2"></div>
              <p className="text-gray-500">Caricamento in corso...</p>
            </div>
          ) : referrals.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">Nessun referral creato.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Codice
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data creazione
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commissione
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordini
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Totale Vendite
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Commissioni
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stato
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{referral.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{referral.code}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{formatDate(referral.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{referral.commission || 0}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {referralStats[referral.code]?.ordersCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(referralStats[referral.code]?.totalSales || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          {formatCurrency(referralStats[referral.code]?.totalCommission || 0)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          referral.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {referral.active ? 'Attivo' : 'Disattivato'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => copyReferralLink(referral.code)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Copia link"
                          >
                            <Copy size={18} />
                          </button>
                          <button
                            onClick={() => handleViewOrders(referral.code)}
                            className="text-teal-600 hover:text-teal-900"
                            title="Visualizza ordini"
                          >
                            <FileText size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal per visualizzare gli ordini di un referral */}
      {showOrdersModal && selectedReferral && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Ordini per referral: <span className="font-bold">{selectedReferral}</span>
              </h2>
              <button
                onClick={() => setShowOrdersModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(80vh - 60px)' }}>
              {referralOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nessun ordine trovato per questo referral.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Riepilogo</h3>
                        <p className="text-sm text-gray-500">Numero ordini: {referralOrders.length}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-700">Totale vendite: <span className="font-bold">{formatCurrency(calculateTotalForReferral(referralOrders))}</span></p>
                        {referrals.find(r => r.code === selectedReferral)?.commission && (
                          <p className="text-sm text-gray-500">
                            Commissioni stimate: {formatCurrency(calculateTotalForReferral(referralOrders) * 
                              (referrals.find(r => r.code === selectedReferral)?.commission || 0) / 100)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pacchetto
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Prezzo
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stato
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {referralOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.date)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {order.customerEmail}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {order.packageName}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {formatCurrency(order.price)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                              order.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : order.status === 'processing' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {order.status === 'completed' 
                                ? 'Completato' 
                                : order.status === 'processing' 
                                  ? 'In elaborazione' 
                                  : 'Fallito'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralManager; 