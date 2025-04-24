// Configurazione dell'ambiente
// Forziamo production per assicurarci che in deployment usi gli URL corretti
const isDevelopment = false; // process.env.NODE_ENV === 'development';

// Configurazione dell'API
export const API_BASE_URL = '/api';

// Configurazione del sito
export const SITE_URL = window.location.origin;

// Altri valori di configurazione
export const APP_NAME = 'BonaEvents';

// Password per l'area admin
export const ADMIN_PASSWORD = 'bonaevents2023';

// Webhook Stripe (solo frontend)
export const WEBHOOK_URL = `${SITE_URL}/webhook`; 