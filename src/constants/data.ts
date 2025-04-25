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
    description: 'Estate folle a Saranda: festa e mare no stop! Hotel sul mare con pool party, feste ogni sera, boat party con alcohol illimitato e accesso VIP a tutti gli eventi. Un\'esperienza indimenticabile di 5 giorni di pura emozione e follia ad Agosto.',
    price: 329,
    location: 'Saranda, Albania',
    rating: 5.0,
    image: '/estate-folle.jpeg', // Questa immagine non verrà utilizzata, useremo il componente personalizzato
    features: [
      '5 giorni di Agosto di pura emozione e follia',
      'Hotel sul mare con festa in piscina da paura',
      'Feste tutte le sere; incluso boat party con alcohol illimitato',
      'Accesso VIP a tutti i nostri eventi',
      'Sconti esclusivi su escursioni, beach club, ristoranti e attività'
    ],
  },
  {
    id: '2',
    name: 'Estate Folle a Saranda',
    description: 'Estate folle a Saranda: festa e mare no stop! Hotel sul mare con pool party, feste ogni sera, boat party con alcohol illimitato e accesso VIP a tutti gli eventi. Un\'esperienza indimenticabile di 5 giorni di pura emozione e follia a Luglio.',
    price: 279,
    location: 'Saranda, Albania',
    rating: 4.9,
    image: '/pack2.jpeg',
    features: [
      '5 giorni di Luglio di pura emozione e follia',
      'Hotel sul mare con festa in piscina da paura',
      'Feste tutte le sere; incluso boat party con alcohol illimitato',
      'Accesso VIP a tutti i nostri eventi',
      'Sconti esclusivi su escursioni, beach club, ristoranti e attività'
    ],
  },
  {
    id: '3',
    name: 'Estate Folle a Saranda',
    description: 'Estate folle a Saranda: festa e mare no stop! Hotel sul mare con pool party, feste ogni sera, boat party con alcohol illimitato e accesso VIP a tutti gli eventi. Un\'esperienza indimenticabile di 4 giorni di pura emozione e follia a Giugno.',
    price: 189,
    location: 'Saranda, Albania',
    rating: 4.7,
    image: '/estate-folle-base.jpeg',
    features: [
      '4 giorni di Giugno di pura emozione e follia',
      'Hotel sul mare con festa in piscina da paura',
      'Feste tutte le sere; incluso boat party con alcohol illimitato',
      'Accesso VIP a tutti i nostri eventi',
      'Sconti esclusivi su escursioni, beach club, ristoranti e attività',
      'Offerta valida per le prime 50 persone!'
    ],
  },
];