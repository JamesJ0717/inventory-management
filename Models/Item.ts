export interface Item {
  ean: string;
  title: string;
  description: string;
  upc: string;
  brand: string;
  model: string;
  color: string;
  size: string;
  dimension: string;
  weight: string;
  category: string;
  currency: string;
  lowest_recorded_price: number;
  highest_recorded_price: number;
  images: string[];
  offers: Offer[];
  asin: string;
  elid: string;
  quantity: number;
}

interface Offer {
  merchant: string;
  domain: string;
  title: string;
  currency: string;
  list_price: number;
  price: number;
  shipping: string;
  condition: string;
  availability: string;
  link: string;
  updated_t: string;
}
