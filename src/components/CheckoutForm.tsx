import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from './Button';
import { useOrders } from '../contexts/OrderContext';
import { API_BASE_URL } from '../libs/config';

interface CheckoutFormProps {
  amount: number;
  packageName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, packageName, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [cardName, setCardName] = useState('');
  const { addOrder } = useOrders();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js non è ancora caricato
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Impossibile trovare l\'elemento della carta.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // 1. Crea un PaymentIntent tramite la funzione Netlify
      console.log('Invio richiesta a:', `${API_BASE_URL}/create`);
      
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          description: packageName,
          email,
        }),
      });

      console.log('Risposta ricevuta, status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Errore API:', response.status, errorText);
        throw new Error(`Errore nella creazione del pagamento (${response.status}): ${errorText || 'Nessun dettaglio'}`);
      }

      const { clientSecret, id } = await response.json();

      // 2. Conferma il pagamento con Stripe.js
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardName,
            email,
          },
        },
      });

      // 3. Gestisci il risultato
      if (confirmError) {
        setError(confirmError.message || 'Si è verificato un errore durante il pagamento');
        
        // Salviamo l'ordine fallito
        addOrder({
          packageName,
          price: amount,
          customerEmail: email,
          status: 'failed'
        });
      } else {
        // Controlla lo stato del pagamento
        const checkStatus = await fetch(`${API_BASE_URL}/status/${id}`);
        const { status } = await checkStatus.json();

        if (status === 'succeeded' || paymentIntent?.status === 'succeeded') {
          // Salviamo l'ordine completato
          addOrder({
            packageName,
            price: amount,
            customerEmail: email,
            status: 'completed'
          });
          onSuccess();
        } else {
          // Pagamento in sospeso
          addOrder({
            packageName,
            price: amount,
            customerEmail: email,
            status: 'processing'
          });
          setError('Il pagamento è in elaborazione. Riceverai una conferma via email.');
        }
      }
    } catch (err: any) {
      console.error('Errore di pagamento:', err);
      
      // Messaggi di errore più chiari per l'utente
      let errorMessage = err.message || 'Si è verificato un errore durante il pagamento.';
      
      // Controllo se è un errore di connessione
      if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Impossibile connettersi al server di pagamento. Controlla la tua connessione internet e riprova.';
      }
      
      setError(errorMessage);
      
      // Salviamo l'ordine fallito
      addOrder({
        packageName,
        price: amount,
        customerEmail: email,
        status: 'failed'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Checkout - {packageName}</h2>
      <p className="text-center text-gray-600 mb-6">Totale: €{amount.toFixed(2)}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            placeholder="La tua email"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">
            Nome sulla carta
          </label>
          <input
            type="text"
            id="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            placeholder="Nome e cognome"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dettagli carta
          </label>
          <div className="p-4 border border-gray-300 rounded-md">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    iconColor: '#c4f0ff',
                    ':-webkit-autofill': {
                      color: '#fce883',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                    iconColor: '#ff7784',
                  },
                },
                hidePostalCode: true
              }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Inserisci i dati della tua carta. I pagamenti sono elaborati in modo sicuro tramite Stripe.
          </p>
        </div>
        
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={onCancel}
            disabled={processing}
          >
            Annulla
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={!stripe || processing}
          >
            {processing ? 'Elaborazione...' : 'Paga ora'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm; 