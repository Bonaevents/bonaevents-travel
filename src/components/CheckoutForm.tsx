import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from './Button';
import { useOrders } from '../contexts/OrderContext';
import { API_BASE_URL } from '../libs/config';
import { sendOrderConfirmationEmail } from '../libs/emailService';
import { useCart } from '../contexts/CartContext';

interface CheckoutFormProps {
  amount: number;
  packageName: string;
  onSuccess: () => void;
  onCancel: () => void;
  isMultiPackage?: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  amount, 
  packageName, 
  onSuccess, 
  onCancel,
  isMultiPackage = false
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [cardName, setCardName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const { addOrder } = useOrders();
  const { cartItems } = useCart();

  // Per acquisti multipli, utilizziamo l'importo che ci è stato passato
  // Per acquisti singoli, usiamo la caparra fissa
  const depositAmount = isMultiPackage ? amount : 100;

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
          amount: depositAmount,
          description: isMultiPackage 
            ? `${packageName} (Caparra multipla)` 
            : `${packageName} (Caparra)`,
          email,
        }),
      });

      console.log('Risposta ricevuta, status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Errore API:', response.status, errorText);
        throw new Error(`Errore nella creazione del pagamento (${response.status}): ${errorText || 'Nessun dettaglio'}`);
      }

      const { clientSecret, id, isFreeTransaction, status } = await response.json();

      // Gestione speciale per transazioni gratuite (amount = 0)
      if (amount === 0 && isFreeTransaction && status === 'succeeded') {
        console.log('Transazione gratuita rilevata, salto la conferma del pagamento');
        
        if (isMultiPackage) {
          // Per acquisti multipli, registra ogni pacchetto
          cartItems.forEach(item => {
            addOrder({
              packageName: item.packageData.name,
              price: 0, // Registra 0 per pacchetti gratuiti
              customerEmail: email,
              customerPhone,
              customerName,
              status: 'completed',
              quantity: item.quantity
            });
          });
        } else {
          // Per acquisti singoli
          addOrder({
            packageName,
            price: 0,
            customerEmail: email,
            customerPhone,
            customerName,
            status: 'completed'
          });
        }
        
        // Invia email di conferma per pacchetto gratuito
        try {
          await sendOrderConfirmationEmail(email, packageName, 0, customerPhone, customerName);
          console.log('Email di conferma inviata con successo');
        } catch (emailError) {
          console.error('Errore nell\'invio dell\'email di conferma:', emailError);
        }
        
        onSuccess();
        return;
      } else if (amount > 0 && isFreeTransaction) {
        // Se l'importo originale era > 0 ma il backend ha restituito isFreeTransaction, c'è un problema
         console.error('Errore: Ricevuto isFreeTransaction per un pacchetto non gratuito');
         throw new Error('Errore nella configurazione del pagamento.');
      }

      // 2. Conferma il pagamento con Stripe.js (solo per transazioni non gratuite)
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
        
        if (isMultiPackage) {
          // Per acquisti multipli falliti
          addOrder({
            packageName,
            price: depositAmount,
            customerEmail: email,
            customerPhone,
            customerName,
            status: 'failed'
          });
        } else {
          // Per acquisti singoli falliti
          addOrder({
            packageName,
            price: depositAmount,
            customerEmail: email,
            customerPhone,
            customerName,
            status: 'failed'
          });
        }
      } else {
        // Controlla lo stato del pagamento (se necessario, a volte confirmCardPayment basta)
        let finalStatus = paymentIntent?.status;
        if (finalStatus !== 'succeeded') {
            // Ricontrolla lo stato tramite l'API se non è già 'succeeded'
            const checkStatus = await fetch(`${API_BASE_URL}/status/${id}`);
            const statusResponse = await checkStatus.json();
            finalStatus = statusResponse.status;
        }

        if (finalStatus === 'succeeded') {
          if (isMultiPackage) {
            // Per acquisti multipli completati
            cartItems.forEach(item => {
              addOrder({
                packageName: item.packageData.name,
                price: 100, // Registra 100€ di caparra per ogni pacchetto
                customerEmail: email,
                customerPhone,
                customerName,
                status: 'completed',
                quantity: item.quantity
              });
            });
          } else {
            // Per acquisti singoli completati
            addOrder({
              packageName,
              price: depositAmount,
              customerEmail: email,
              customerPhone,
              customerName,
              status: 'completed'
            });
          }
          
          // Invia email di conferma
          try {
            await sendOrderConfirmationEmail(
              email, 
              isMultiPackage ? packageName : `${packageName} (Caparra)`, 
              depositAmount,
              customerPhone, 
              customerName
            );
            console.log('Email di conferma inviata con successo');
          } catch (emailError) {
            console.error('Errore nell\'invio dell\'email di conferma:', emailError);
          }
          
          onSuccess();
        } else {
          // Pagamento in sospeso o fallito dopo controllo API
          if (isMultiPackage) {
            // Per acquisti multipli non completati
            addOrder({
              packageName,
              price: depositAmount,
              customerEmail: email,
              customerPhone,
              customerName,
              status: finalStatus === 'processing' ? 'processing' : 'failed'
            });
          } else {
            // Per acquisti singoli non completati
            addOrder({
              packageName,
              price: depositAmount,
              customerEmail: email,
              customerPhone,
              customerName,
              status: finalStatus === 'processing' ? 'processing' : 'failed'
            });
          }
          
          setError(finalStatus === 'processing' 
            ? 'Il pagamento è in elaborazione. Riceverai una conferma via email.'
            : 'Il pagamento non è andato a buon fine dopo la verifica.'
          );
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
        price: depositAmount,
        customerEmail: email,
        customerPhone,
        customerName,
        status: 'failed'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isMultiPackage ? 'Prenota i tuoi pacchetti' : 'Prenota il tuo pacchetto'}
      </h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            {isMultiPackage 
              ? `Caparra per prenotazione multipla (${depositAmount / 100} pacchetti)` 
              : 'Caparra'
            }:
          </span>
          <span className="font-bold text-xl text-teal-600">{amount.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Nome e Cognome</label>
          <input
            type="text"
            id="customerName"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
          <input
            type="tel"
            id="customerPhone"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">Nome sulla carta</label>
          <input
            type="text"
            id="cardName"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="card" className="block text-sm font-medium text-gray-700 mb-1">Dati carta</label>
          <div className="p-3 border border-gray-300 rounded-md focus-within:ring-teal-500 focus-within:border-teal-500">
            <CardElement
              id="card"
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={processing}
        >
          Annulla
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={!stripe || processing}
          className={processing ? "opacity-70 cursor-not-allowed" : ""}
        >
          {processing ? "Elaborazione..." : "Paga Caparra"}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm; 