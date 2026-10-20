export type CategoryId = 'smartphones' | 'protection' | 'montres-connectees' | 'chargeurs-gadgets';

export type Currency = 'XAF'; // Franc CFA (FCFA)

export interface Product {
  // Required commercial & Supabase fields
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: CategoryId;
  price: number; // en FCFA
  old_price?: number; // en FCFA
  stock?: number;
  brand?: string;
  images?: string[];
  rating: number;
  review_count: number;
  is_featured?: boolean;
  is_new?: boolean;
  is_best_seller?: boolean;
  is_active?: boolean;
  created_at?: string;

  // Compatibility aliases for frontend components
  category: CategoryId;
  sub_category?: string;
  subCategory?: string;
  short_description?: string;
  original_price?: number;
  originalPrice?: number;
  badge?: string;
  in_stock: boolean;
  inStock: boolean;
  stock_count: number;
  stockCount: number;
  reviewCount: number;
  features?: string[];
  specs?: Record<string, string>;
  image_url: string;
  image: string;
  gallery: string[];
  is_popular?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  is_promotion?: boolean;
  isPromotion?: boolean;

  // Attributs de filtrage (ex: { Stockage: '256 Go', Compatibilité: 'iPhone' })
  attributes?: Record<string, string>;
  condition?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  timestamp: number;
  title: string;
  content: string;
  verifiedPurchase: boolean;
  productName?: string;
  photo_url?: string;
}

export interface Order {
  orderId: string;
  date: string;
  customerName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  shippingMethod: string;
  paymentMethod: string;
  items: CartItem[];
  totalAmount: number;
  status: 'En préparation' | 'En transit' | 'Livrée et reçue';
  deliveredAt?: string;
  hasReviewed?: boolean;
}

export interface CategoryMeta {
  id: CategoryId;
  index: string;
  slug: string;
  name: string;
  headline: string;
  description: string;
  image: string;
  itemCount: number;
}
