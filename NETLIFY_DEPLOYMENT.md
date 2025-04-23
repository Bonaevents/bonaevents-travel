# Deployment su Netlify

Questa guida ti spiega come fare il deploy di BonaEvents su Netlify, incluso il server di pagamento con Stripe.

## Prerequisiti

- Un account Netlify
- Un account Stripe con le chiavi API
- Git installato sulla tua macchina

## Passaggi per il deployment

### 1. Prepara il tuo repository

1. Assicurati che il codice sia su un repository Git (GitHub, GitLab, Bitbucket)
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <URL_DEL_TUO_REPOSITORY>
   git push -u origin main
   ```

### 2. Configura il progetto su Netlify

1. Accedi a [Netlify](https://app.netlify.com/)
2. Clicca su "New site from Git"
3. Scegli il provider del tuo repository (GitHub, GitLab, ecc.)
4. Seleziona il repository del tuo progetto
5. Nella pagina di configurazione del deploy, inserisci:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Clicca su "Advanced build settings" e aggiungi le seguenti variabili d'ambiente:
   - `STRIPE_SECRET_KEY`: La tua chiave segreta di Stripe (`sk_test_51IU78v...`)
   - `STRIPE_WEBHOOK_SECRET`: Il secret del webhook Stripe (opzionale in fase di test)

### 3. Deploy e configurazione

1. Clicca su "Deploy site"
2. Attendi che Netlify completi il deployment
3. Una volta completato, vai su "Site settings" > "Functions" per verificare che le funzioni serverless siano state compilate correttamente

### 4. Configura il webhook di Stripe (Produzione)

1. Nel dashboard di Stripe, vai su "Developers" > "Webhooks"
2. Clicca su "Add endpoint"
3. Inserisci l'URL del tuo webhook: `https://tuo-sito-netlify.netlify.app/webhook`
4. Seleziona gli eventi da monitorare (almeno `payment_intent.succeeded` e `payment_intent.payment_failed`)
5. Copia il "Signing secret" generato
6. Torna su Netlify, vai in "Site settings" > "Environment variables" e aggiorna `STRIPE_WEBHOOK_SECRET` con il valore copiato

## Test locale

Prima di fare il deploy, puoi testare tutto localmente:

1. Installa Netlify CLI globalmente (se non l'hai già fatto):
   ```
   npm install -g netlify-cli
   ```

2. Avvia il server di sviluppo Netlify:
   ```
   npm run netlify
   ```

3. Il server sarà disponibile su `http://localhost:8888` con le funzioni serverless attive

## Passare alla modalità di produzione

Quando sei pronto per la produzione:

1. Sostituisci le chiavi di test Stripe con quelle di produzione nelle variabili d'ambiente di Netlify
2. Assicurati che il webhook sia configurato correttamente
3. Verifica che i pagamenti funzionino correttamente in modalità produzione

## Risoluzione dei problemi

Se incontri problemi con le funzioni serverless:

1. Controlla i log delle funzioni in Netlify (Functions > Recent function activity)
2. Verifica che le variabili d'ambiente siano configurate correttamente
3. Assicurati che il file `netlify.toml` sia nella root del progetto 