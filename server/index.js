const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Creare un PaymentIntent
app.post('/api/create-payment', async (req, res) => {
  try {
    const { amount, currency = 'eur', description, email } = req.body;
    
    // Crea un PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa i centesimi
      currency,
      description,
      receipt_email: email,
      metadata: {
        packageName: description
      }
    });
    
    // Ritorna il client_secret al frontend
    res.json({ 
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (error) {
    console.error('Errore creazione payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Conferma stato pagamento
app.get('/api/payment-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(id);
    
    res.json({ status: paymentIntent.status });
  } catch (error) {
    console.error('Errore verifica stato pagamento:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook per gestire eventi Stripe
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  // Verifica la firma dell'evento (in produzione dovresti usare un endpoint_secret)
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Errore webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gestisci l'evento
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent completato con successo:', paymentIntent.id);
      // Qui puoi aggiornare il tuo database o inviare email di conferma
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Pagamento fallito:', failedPayment.id);
      // Qui puoi gestire i pagamenti falliti
      break;
    default:
      console.log(`Evento non gestito: ${event.type}`);
  }

  // Restituisci una risposta di successo
  res.json({ received: true });
});

// Rotta di verifica
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Server in esecuzione sulla porta ${port}`);
}); 