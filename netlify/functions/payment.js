const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Log dettagliato dell'evento per debug
  console.log(`Richiesta ricevuta: ${event.httpMethod} ${event.path}`);
  console.log(`Query string: ${JSON.stringify(event.queryStringParameters)}`);
  console.log(`Path parameters: ${JSON.stringify(event.pathParameters)}`);
  console.log(`Corpo richiesta: ${event.body}`);
  console.log(`Chiave Stripe configurata: ${!!process.env.STRIPE_SECRET_KEY}`);
  
  // Imposta CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };

  // Gestisce le richieste OPTIONS (pre-flight)
  if (event.httpMethod === 'OPTIONS') {
    console.log('Gestione richiesta OPTIONS');
    return { 
      statusCode: 200, 
      headers, 
      body: '' 
    };
  }

  // Estrai il percorso dalla URL - correggo la gestione dei percorsi
  let path = event.path;
  
  // Rimuove il prefisso /.netlify/functions/payment se presente
  if (path.includes('/.netlify/functions/payment')) {
    path = path.split('/.netlify/functions/payment')[1] || '';
  } 
  // Gestisce anche richieste dirette da /api/
  else if (path.includes('/api/')) {
    path = path.replace('/api', '');
  }
  
  // Assicura che il percorso inizi con /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  console.log(`Percorso normalizzato: ${path}`);
  
  try {
    // ----- ROTTA DI CREAZIONE PAGAMENTO -----
    if (event.httpMethod === 'POST' && (path === '/create' || path === '')) {
      console.log('Creazione payment intent');
      
      // Assicurati che il corpo della richiesta sia valido
      if (!event.body) {
        console.error('Corpo della richiesta mancante');
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Corpo della richiesta mancante' })
        };
      }
      
      const { amount, currency = 'eur', description, email } = JSON.parse(event.body);
      console.log(`Dati ricevuti: amount=${amount}, currency=${currency}, email=${email}`);
      
      if (!amount) {
        console.error('Amount è richiesto');
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Amount è richiesto' })
        };
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe usa i centesimi
        currency,
        description,
        receipt_email: email,
        metadata: {
          packageName: description
        }
      });
      
      console.log(`PaymentIntent creato: ${paymentIntent.id}`);
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
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
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
    if (event.httpMethod === 'GET' && (path === '/health' || path === '')) {
      console.log('Verifica salute API');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          status: 'ok', 
          timestamp: new Date(),
          path: event.path,
          httpMethod: event.httpMethod,
          stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
          stripeKeyLength: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0,
          webhookConfigured: !!process.env.STRIPE_WEBHOOK_SECRET
        })
      };
    }
    
    // ----- ROTTA NON TROVATA -----
    console.log(`Rotta non trovata: ${event.httpMethod} ${path}`);
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ 
        error: 'Rotta non trovata',
        path: path,
        method: event.httpMethod
      })
    };
    
  } catch (error) {
    console.error('Errore:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack
      })
    };
  }
}; 