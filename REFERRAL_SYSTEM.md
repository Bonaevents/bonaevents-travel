# Sistema di Referral - BonaEvents

Questo documento spiega come funziona il sistema di referral di BonaEvents e come utilizzarlo.

## Panoramica

Il sistema di referral permette di:

1. Creare link personalizzati da condividere con potenziali clienti
2. Tracciare gli acquisti effettuati tramite questi link
3. Visualizzare statistiche dettagliate sulle conversioni e vendite generate da ciascun referrer
4. Impostare commissioni personalizzate per i referral

## Componenti del Sistema

Il sistema è composto da:

- Un database Firestore con due collezioni principali:
  - `orders`: salva tutti gli ordini, incluso il campo `referralCode` quando applicabile
  - `referrals`: contiene i referral, con nome, codice, stato attivo/disattivo e commissione

- Una pagina di amministrazione protetta da password (`/referral`) per gestire i referral
- Logica di tracciamento nella pagina principale per rilevare e salvare i codici referral
- Integrazione nella pagina ordini per visualizzare la fonte di provenienza degli acquisti

## Come Creare un Nuovo Referral

1. Accedi alla pagina di amministrazione dei referral: `/referral`
2. Usa la stessa password dell'area ordini: `bonaevents2023`
3. Compila il modulo con:
   - **Nome**: Il nome della persona o dell'azienda referrer
   - **Codice**: Un codice univoco per identificare il referral (es. MARIO23)
   - **Commissione**: La percentuale da riconoscere al referrer (opzionale)
4. Clicca su "Crea Referral"

## Come Funzionano i Link Referral

Il sistema genera automaticamente link nel formato:
```
https://tuosito.com/?ref=CODICE
```

Quando un utente visita questo link:
1. Il sistema verifica se il codice è valido
2. Se valido, il codice viene salvato nel browser dell'utente
3. Quando l'utente effettua un acquisto, l'ordine viene associato al referral

## Come Visualizzare le Statistiche

### Nella Pagina Ordini

Nella pagina `/ordini` troverai:
- Una nuova sezione "Riepilogo Referral" che mostra per ciascun referral:
  - Numero totale di ordini
  - Valore totale delle vendite generate
- Una colonna "Referral" nella tabella degli ordini che mostra da quale link proviene ciascun ordine

### Nella Pagina Referral

Nella pagina `/referral` puoi:
- Visualizzare tutti i referral attivi
- Copiare i link referral con un click
- Visualizzare in dettaglio gli ordini generati da ciascun referral
- Vedere il calcolo delle commissioni in base alle percentuali impostate

## Come Condividere i Link Referral

1. Dalla pagina `/referral`, trova il referral desiderato
2. Clicca sull'icona di copia accanto al codice
3. Il link completo viene copiato negli appunti
4. Condividi il link con il referrer tramite email, messaggi, ecc.

## Note Tecniche

- Il sistema utilizza Firebase Firestore per archiviare i dati in modo sicuro e scalabile
- I referral sono tracciati anche se l'utente non completa l'acquisto immediatamente
- I codici referral restano validi nel browser dell'utente per 30 giorni

## Supporto

Per ulteriori informazioni o assistenza con il sistema di referral, contatta:
- Email: support@bonaevents.it
- Telefono: 0123 456789 