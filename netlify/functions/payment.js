const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_51IU78vEXr2WN8c8uVt0JFR4FciCIOpjoDJMJN2coXthd4ElSOxIlZknRCyLjD320WmhlJb7D58mwdUcLAyIMmXAD0017d46zSl');

exports.handler = async (event, context) => {
  // Imposta CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };

  // Gestisce le richieste OPTIONS (pre-flight)
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 200, 
      headers, 
      body: '' 
    };
  }

  // Estrai il percorso dalla URL
  const path = event.path.replace('/.netlify/functions/payment', '');
  
  try {
    // ----- ROTTA DI CREAZIONE PAGAMENTO -----
    if (event.httpMethod === 'POST' && path === '/create') {
      const { amount, currency = 'eur', description, email } = JSON.parse(event.body);
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe usa i centesimi
        currency,
        description,
        receipt_email: email,
        metadata: {
          packageName: description
        }
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          clientSecret: paymentIntent.client_secret,
          id: paymentIntent.id
        })
      };
    }
    
    // ----- ROTTA VERIFICA STATO PAGAMENTO -----
    if (event.httpMethod === 'GET' && path.startsWith('/status/')) {
      const id = path.split('/status/')[1];
      const paymentIntent = await stripe.paymentIntents.retrieve(id);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: paymentIntent.status })
      };
    }
    
    // ----- ROTTA WEBHOOK -----
    if (event.httpMethod === 'POST' && path === '/webhook') {
      const sig = event.headers['stripe-signature'];
      let stripeEvent;
      
      try {
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret';
        stripeEvent = stripe.webhooks.constructEvent(
          event.body,
          sig,
          webhookSecret
        );
      } catch (err) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
        };
      }
      
      // Gestisci vari tipi di eventi Stripe
      switch (stripeEvent.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = stripeEvent.data.object;
          console.log('PaymentIntent completato con successo:', paymentIntent.id);
          // Qui potresti salvare l'ordine nel database o inviare email di conferma
          break;
        case 'payment_intent.payment_failed':
          const failedPayment = stripeEvent.data.object;
          console.log('Pagamento fallito:', failedPayment.id);
          // Qui potresti aggiornare lo stato dell'ordine
          break;
        default:
          console.log(`Evento non gestito: ${stripeEvent.type}`);
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ received: true })
      };
    }
    
    // ----- ROTTA VERIFICA SALUTE API -----
    if (event.httpMethod === 'GET' && path === '/health') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: 'ok', timestamp: new Date() })
      };
    }
    
    // ----- ROTTA NON TROVATA -----
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Rotta non trovata' })
    };
    
  } catch (error) {
    console.error('Errore:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
}; 