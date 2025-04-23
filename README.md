# BonaEvents - Piattaforma di Pacchetti Vacanza

Questo progetto è una piattaforma per la vendita di pacchetti vacanza a Saranda, Albania, con integrazione di pagamenti Stripe.

## Struttura del Progetto

- **Frontend**: React + TypeScript + Tailwind CSS
- **Serverless Backend**: Netlify Functions + Stripe API

## Guida Rapida

### Sviluppo Locale

1. Installa le dipendenze:
```
npm install
npm install -g netlify-cli
```

2. Avvia l'applicazione con le funzioni Netlify:
```
npm run netlify
```

Questo comando avvierà sia il frontend che le funzioni serverless, accessibili su http://localhost:8888.

### Build per la Produzione

```
npm run build
```

Il codice compilato sarà nella directory `dist` pronto per il deployment.

## Deployment su Netlify

Questo progetto è configurato per essere facilmente deployato su Netlify, che gestirà sia il frontend che le funzioni serverless per i pagamenti.

Vedi il file [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) per istruzioni dettagliate.

## Funzionalità

- Visualizzazione dei pacchetti vacanza
- Checkout con Stripe per i pagamenti
- Pagina di amministrazione protetta con password per visualizzare gli ordini (rotta `/ordini`)
- Integrazione completa con Stripe per processare pagamenti reali
- Architettura serverless per facile deployment e scalabilità

## Pagamenti di Test

Per testare i pagamenti, usa le seguenti carte:

- Pagamento riuscito: `4242 4242 4242 4242`
- Pagamento fallito: `4000 0000 0000 0002`
- Autenticazione richiesta: `4000 0025 0000 3155`

Usa una data di scadenza futura qualsiasi e un CVC a 3 cifre.

## Accesso alla Pagina Ordini

URL: `/ordini`
Password: `bonaevents2023`

## Passare alla Produzione

Per passare alla modalità di produzione con pagamenti reali:

1. Configura le variabili d'ambiente su Netlify:
   - `STRIPE_SECRET_KEY`: La tua chiave segreta Stripe di produzione
   - `STRIPE_WEBHOOK_SECRET`: Il secret del webhook Stripe di produzione

2. Aggiorna il file `src/libs/stripe.ts` con la chiave pubblica di produzione
3. Segui le istruzioni nel file [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) per completare la configurazione 