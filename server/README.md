# BonaEvents Server

Questo è il server di backend per l'elaborazione dei pagamenti di BonaEvents.

## Configurazione

1. Installa le dipendenze:
```
npm install
```

2. Avvia il server in modalità sviluppo:
```
npm run dev
```

3. Per la produzione:
```
npm start
```

## Endpoints API

### Creazione del pagamento
- **POST** `/api/create-payment`
- **Body**: 
  ```json
  {
    "amount": 330, 
    "currency": "eur", 
    "description": "Pacchetto Exclusive", 
    "email": "cliente@example.com"
  }
  ```
- **Risposta**:
  ```json
  {
    "clientSecret": "pi_..._secret_...",
    "id": "pi_..."
  }
  ```

### Verifica stato pagamento
- **GET** `/api/payment-status/:id`
- **Risposta**:
  ```json
  {
    "status": "succeeded"
  }
  ```

### Webhook
- **POST** `/webhook`
- Riceve notifiche da Stripe sugli eventi relativi ai pagamenti

## Note su Stripe
- In modalità test, puoi usare il numero di carta `4242 4242 4242 4242` con una data futura e un CVC a 3 cifre qualsiasi
- Per testare pagamenti falliti, usa `4000 0000 0000 0002` 