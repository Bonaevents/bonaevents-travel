import emailjs from '@emailjs/browser';

// Configurazione EmailJS
const EMAILJS_SERVICE_ID = 'service_1sxc8cg';
const EMAILJS_TEMPLATE_ID = 'template_h6tpeil';
const EMAILJS_PUBLIC_KEY = 'xSjIE1ggREjwtKbYK';

// Inizializza EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

/**
 * Invia un'email di conferma dell'ordine
 * @param email Email del cliente
 * @param packageName Nome del pacchetto acquistato
 * @param amount Importo pagato
 * @param customerPhone Numero di telefono del cliente
 * @param customerName Nome del cliente
 */
export const sendOrderConfirmationEmail = async (
  email: string,
  packageName: string, 
  amount: number,
  customerPhone?: string,
  customerName?: string
) => {
  try {
    // Prepara i parametri per il template
    const templateParams = {
      to_email: email,
      package_name: packageName,
      amount: `€${amount.toFixed(2)}`,
      order_date: new Date().toLocaleDateString('it-IT'),
      customer_phone: customerPhone || 'Non fornito',
      customer_name: customerName || 'Cliente',
      // Utilizza il logo che esiste nella cartella public
      logo_url: `${window.location.origin}/logoemail.png`
    };

    // Invia l'email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email inviata con successo:', response);
    return { success: true };
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
    return { success: false, error };
  }
}; 