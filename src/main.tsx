import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Aggiungiamo un handler per gli errori non catturati
window.addEventListener('error', function(event) {
  console.error('Errore globale:', event.error);
  // Evita che l'app si blocchi completamente
  event.preventDefault();
});

// Aggiungiamo un handler per le promise non gestite
window.addEventListener('unhandledrejection', function(event) {
  console.error('Promise non gestita:', event.reason);
  // Evita che l'app si blocchi completamente
  event.preventDefault();
});

// Prova a renderizzare l'app, ma se fallisce mostra un messaggio di errore
try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Errore durante il rendering dell\'app:', error);
  // Crea un div di fallback in caso di errore grave
  const errorDiv = document.createElement('div');
  errorDiv.style.padding = '20px';
  errorDiv.style.textAlign = 'center';
  errorDiv.innerHTML = `
    <h1>Si è verificato un errore</h1>
    <p>Stiamo lavorando per risolverlo. Ricarica la pagina per riprovare.</p>
    <button onclick="window.location.reload()" style="padding: 10px 20px; background: #0ea5e9; color: white; border: none; border-radius: 5px; margin-top: 20px; cursor: pointer;">
      Ricarica pagina
    </button>
  `;
  
  // Sostituisci il contenuto del root con il messaggio di errore
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = '';
    rootElement.appendChild(errorDiv);
  }
}
