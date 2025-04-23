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
    id: '1',
    name: 'Pacchetto Exclusive',
    description: 'Il massimo del lusso a Saranda. Soggiorno in hotel 5 stelle con vista panoramica sulla baia, servizio di concierge privato e accesso a spiagge esclusive. Un\'esperienza indimenticabile sulla costa albanese.',
    price: 330,
    location: 'Saranda, Albania',
    rating: 4.8,
    image: '/pack1.jpeg',
    features: ['7 notti in hotel di lusso', 'Pensione completa', 'Transfer privato', 'Tour esclusivi'],
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