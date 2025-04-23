// Configurazione dell'ambiente
const isDevelopment = process.env.NODE_ENV === 'development';

// Configurazione dell'API
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8888/api' 
  : '/api';

// Configurazione del sito
export const SITE_URL = isDevelopment
  ? 'http://localhost:8888'
  : 'https://bonaevents.netlify.app'; // Sostituisci con il tuo URL di produzione

// Altri valori di configurazione
export const APP_NAME = 'BonaEvents';
export const ADMIN_PASSWORD = 'bonaevents2023';

// Webhook Stripe (solo frontend)
export const WEBHOOK_URL = `${SITE_URL}/webhook`; 