// Configurazione dell'ambiente
const isDevelopment = process.env.NODE_ENV === 'development';

// Configurazione dell'API
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8888/.netlify/functions/payment' 
  : '/.netlify/functions/payment';

// Configurazione del sito
export const SITE_URL = isDevelopment
  ? 'http://localhost:8888'
  : window.location.origin;

// Altri valori di configurazione
export const APP_NAME = 'BonaEvents';

// Password per l'area admin
export const ADMIN_PASSWORD = 'bonaevents2023';

// Webhook Stripe (solo frontend)
export const WEBHOOK_URL = `${SITE_URL}/.netlify/functions/payment/webhook`; 