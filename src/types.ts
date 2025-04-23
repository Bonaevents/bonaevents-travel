export interface TravelPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  rating: number;
  image: string;
  features: string[];
}

export interface NavigationItem {
  name: string;
  href: string;
}