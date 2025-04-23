# Istruzioni per il Deploy di BonaEvents

Caro cliente,

Queste semplici istruzioni ti guideranno passo dopo passo nel processo di deployment del tuo sito BonaEvents su Netlify, con tanto di sistema di pagamento Stripe funzionante.

## PASSO 1: Crea account necessari

1. Crea un account su [Netlify](https://app.netlify.com/signup) (puoi accedere facilmente con GitHub, GitLab o altro)
2. Assicurati di avere accesso al tuo account [Stripe](https://dashboard.stripe.com/login)

## PASSO 2: Carica il progetto su Netlify

### Metodo più semplice: Drag & Drop

1. Crea una build locale del progetto:
   - Apri il terminale nella cartella del progetto
   - Esegui `npm install` se non l'hai già fatto
   - Esegui `npm run build`
   - Attendi che si crei la cartella `dist`

2. Vai alla dashboard di Netlify e semplicemente trascina e rilascia la cartella `dist` nella sezione "Sites"

3. Il sito sarà online immediatamente con un URL temporaneo del tipo: `random-name-123abc.netlify.app`

### Metodo alternativo: Da GitHub

Se hai il codice su GitHub o altro servizio Git:

1. Nella dashboard di Netlify, clicca "New site from Git"
2. Scegli il provider (GitHub, GitLab, ecc.)
3. Seleziona il repository
4. Nelle impostazioni di build inserisci:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Clicca "Deploy site"

## PASSO 3: Configura le funzioni Netlify (obbligatorio per i pagamenti)

1. Nella dashboard di Netlify, vai al sito appena creato e clicca "Site settings"
2. Nella sezione "Build & deploy", clicca "Environment variables"
3. Aggiungi le seguenti variabili d'ambiente:
   - Chiave: `STRIPE_SECRET_KEY`, Valore: La tua chiave segreta di Stripe che trovi nel dashboard di Stripe (Developers > API keys)
   - Chiave: `STRIPE_WEBHOOK_SECRET`, Valore: Il secret del webhook Stripe (opzionale in fase di test)

4. Torna alla dashboard del sito e clicca "Deploys", poi clicca "Trigger deploy" > "Deploy site"

## PASSO 4: Configura un dominio personalizzato (opzionale)

1. Nella dashboard del sito Netlify, vai a "Domain settings"
2. Clicca "Add custom domain"
3. Inserisci il tuo dominio (es. bonaevents.it)
4. Segui le istruzioni per configurare i DNS del tuo dominio

## PASSO 5: Verifica che tutto funzioni

1. Visita il tuo sito (URL Netlify o dominio personalizzato)
2. Prova ad effettuare un acquisto utilizzando la carta di test 4242 4242 4242 4242
3. Assicurati che l'ordine venga registrato nella pagina `/ordini` (password: bonaevents2023)

## PASSO 6: Passare alla modalità di produzione (quando sei pronto)

Quando sei pronto a ricevere pagamenti reali:

1. Accedi al tuo account Stripe e vai su "Developers" > "API keys"
2. Copia la chiave segreta di produzione (che inizia con `sk_live_`)
3. Torna su Netlify, vai in "Site settings" > "Environment variables"
4. Modifica `STRIPE_SECRET_KEY` con la tua chiave di produzione
5. Aggiorna anche il file `src/libs/stripe.ts` con la chiave pubblica di produzione
6. Ricompila e rideploya il sito

## Hai bisogno di aiuto?

Se incontri problemi durante il processo di deployment, non esitare a contattarci:

- Email: support@bonaevents.it
- Telefono: 0123 456789

Saremo lieti di aiutarti a far funzionare il tuo sito al più presto! 