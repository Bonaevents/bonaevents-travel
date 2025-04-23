import { NavigationItem, TravelPackage } from '../types';

export const navigation: NavigationItem[] = [
  { name: 'Home', href: '#' },
  { name: 'Pacchetti', href: '#packages' },
  { name: 'Destinazioni', href: '#' },
  { name: 'Chi Siamo', href: '#' },
  { name: 'Contatti', href: '#' },
];

export const travelPackages: TravelPackage[] = [
  {
    id: 'estate-folle',
    name: 'Estate Folle a Saranda',
    description: 'Estate folle a Saranda: festa e mare no stop! Hotel sul mare con pool party, feste ogni sera, boat party con alcohol illimitato e accesso VIP a tutti gli eventi. Un esperienza indimenticabile di 5 giorni e 4 notti di pura follia ad Agosto.',
    price: 330,
    location: 'Saranda, Albania',
    rating: 5.0,
    image: '/estate-folle.jpeg', // Questa immagine non verrà utilizzata, useremo il componente personalizzato
    features: [
      'Hotel sul mare con pool party da paura',
      'Feste tutte le sere e boat party con alcohol illimitato',
      '5 giorni e 4 notti di Agosto di pura follia',
      'Sconti esclusivi su escursioni e attività',
      'Accesso VIP a tutti gli eventi'
    ],
  },
  {
    id: '2',
    name: 'Pacchetto Premium',
    description: 'Scopri il perfetto equilibrio tra comfort e avventura. Esplora le meraviglie di Saranda con tour guidati, degustazioni della cucina locale e relax sulle splendide spiagge della Riviera Albanese.',
    price: 280,
    location: 'Saranda, Albania',
    rating: 4.9,
    image: '/pack2.jpeg',
    features: ['10 notti in hotel 4 stelle', 'Prima colazione', 'Tour culturali', 'Attività acquatiche'],
  },
  {
    id: '3',
    name: 'Pacchetto Base',
    description: 'La soluzione ideale per esplorare Saranda con budget contenuto. Alloggio confortevole, posizione strategica e la libertà di organizzare le tue giornate come preferisci nella perla dell\'Albania.',
    price: 189,
    location: 'Saranda, Albania',
    rating: 4.7,
    image: '/pack3.jpeg',
    features: ['5 notti in hotel 3 stelle', 'Prima colazione', 'Guida turistica', 'Assistenza 24/7'],
  },
];