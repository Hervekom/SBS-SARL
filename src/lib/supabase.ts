import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { CartItem, CategoryId, Order, Product, ProductOption, Review } from '../types';

// ============================================================================
// SBS SARL - SUPABASE CLIENT INTERFACE
// Ready for direct deployment with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
// ============================================================================

export interface DatabaseProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  price: number;
  old_price?: number;
  stock: number;
  brand?: string;
  images: string[];
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  is_active: boolean;
  created_at: string;
}

export interface DatabaseOrder {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  delivery_address: string;
  shipping_method: string;
  payment_method: string;
  total_amount: number;
  status: 'En préparation' | 'En transit' | 'Livrée et reçue' | 'Annulée';
  created_at: string;
}

export interface HomepageConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  promoCode: string;
  promoDiscount: number;
  showSpecialOffers: boolean;
  featuredCategoryIds: string[];
}

export const defaultHomepageConfig: HomepageConfig = {
  heroTitle: 'Votre téléphone et ses accessoires, au même endroit.',
  heroSubtitle: 'Smartphones, pochettes, verres trempés, montres connectées, chargeurs et gadgets électroniques à Douala.',
  heroBadge: 'Smart Business Services SARL',
  promoCode: 'SBS10',
  promoDiscount: 10,
  showSpecialOffers: true,
  featuredCategoryIds: ['smartphones', 'protection', 'montres-connectees', 'chargeurs-gadgets'],
};

// ---------------------------------------------------------------------------
// Client Supabase (projet SBS : https://eyftgsnmgnikrwvozrvx.supabase.co)
// Variables à définir dans Vercel / .env.local :
//   VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
// Sans clé, le site fonctionne en mode démo avec le catalogue local.
// ---------------------------------------------------------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: true, storageKey: 'sbs-admin-session' } })
  : null;

export interface ProductRow {
  id: string;
  options: ProductOption[] | null;
  name: string;
  slug: string;
  category_id: CategoryId;
  sub_category: string | null;
  short_description: string | null;
  description: string;
  price: number;
  old_price: number | null;
  stock: number;
  brand: string | null;
  rating: number | null;
  review_count: number | null;
  badge: string | null;
  image_url: string | null;
  attributes: Record<string, string> | null;
  specs: Record<string, string> | null;
  features: string[] | null;
  is_featured: boolean | null;
  is_new: boolean | null;
  is_best_seller: boolean | null;
  is_promotion: boolean | null;
  is_active: boolean | null;
  display_order: number | null;
  created_at: string;
}

export const rowToProduct = (r: ProductRow): Product => {
  const img = r.image_url || '/images/hero-sbs.svg';
  const old = r.old_price ?? undefined;
  const stock = r.stock ?? 0;
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    category_id: r.category_id,
    category: r.category_id,
    sub_category: r.sub_category ?? undefined,
    subCategory: r.sub_category ?? undefined,
    short_description: r.short_description ?? undefined,
    price: r.price,
    old_price: old,
    original_price: old,
    originalPrice: old,
    stock,
    stock_count: stock,
    stockCount: stock,
    in_stock: stock > 0,
    inStock: stock > 0,
    brand: r.brand ?? undefined,
    images: [img],
    image_url: img,
    image: img,
    gallery: [img],
    rating: Number(r.rating ?? 5),
    review_count: r.review_count ?? 0,
    reviewCount: r.review_count ?? 0,
    badge: r.badge ?? undefined,
    features: r.features ?? [],
    specs: r.specs ?? {},
    attributes: { ...(r.brand ? { Marque: r.brand } : {}), ...(r.attributes ?? {}) },
    options: r.options ?? undefined,
    is_featured: Boolean(r.is_featured),
    is_popular: Boolean(r.is_best_seller),
    isBestSeller: Boolean(r.is_best_seller),
    is_best_seller: Boolean(r.is_best_seller),
    is_new: Boolean(r.is_new),
    isNewArrival: Boolean(r.is_new),
    is_promotion: Boolean(r.is_promotion),
    isPromotion: Boolean(r.is_promotion),
    is_active: r.is_active !== false,
    created_at: r.created_at,
    condition: 'Neuf scellé',
  };
};

/** Charge le catalogue actif depuis Supabase (null si non configuré ou erreur). */
export async function fetchProducts(): Promise<Product[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) {
    console.warn('[Supabase] produits :', error.message);
    return null;
  }
  return (data as ProductRow[]).map(rowToProduct);
}

/** Charge les avis approuvés. */
export async function fetchReviews(): Promise<Review[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    console.warn('[Supabase] avis :', error.message);
    return null;
  }
  return (data as any[]).map((r) => ({
    id: r.id,
    author: r.author_name,
    location: r.location ?? '',
    rating: r.rating,
    date: new Date(r.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    timestamp: new Date(r.created_at).getTime(),
    title: r.title,
    content: r.content,
    verifiedPurchase: Boolean(r.verified_purchase),
    productName: r.product_name,
    photo_url: r.photo_url ?? undefined,
  }));
}

/** Envoie un avis (il apparaît après validation par SBS dans Supabase). */
export async function submitReview(review: Omit<Review, 'id' | 'date' | 'timestamp' | 'verifiedPurchase'>) {
  if (!supabase) return;
  const { error } = await supabase.from('reviews').insert({
    author_name: review.author,
    location: review.location,
    rating: review.rating,
    title: review.title,
    content: review.content,
    product_name: review.productName || 'Boutique SBS',
    photo_url: review.photo_url?.startsWith('data:') ? null : review.photo_url ?? null,
  });
  if (error) console.warn('[Supabase] envoi avis :', error.message);
}

/** Enregistre une commande et ses lignes dans Supabase. Renvoie true si tout est enregistré. */
export async function submitOrder(order: Order): Promise<boolean> {
  if (!supabase) return false;
  const subtotal = order.subtotal ?? order.items.reduce((sum: number, i: CartItem) => sum + i.product.price * i.quantity, 0);
  const { error } = await supabase.from('orders').insert({
    id: order.orderId,
    customer_name: order.customerName,
    email: order.email || '-',
    phone: order.phone,
    country: order.country,
    city: order.city,
    delivery_address: order.address,
    postal_code: order.postalCode || null,
    shipping_method: order.shippingMethod,
    payment_method: order.paymentMethod,
    subtotal,
    shipping_fee: order.shippingFee ?? 0,
    discount_amount: order.discountAmount ?? 0,
    total_amount: order.totalAmount,
    notes: order.promoCode ? `Code promo : ${order.promoCode}` : null,
  });
  if (error) {
    console.warn('[Supabase] commande :', error.message);
    return false;
  }
  const { error: itemsError } = await supabase.from('order_items').insert(
    order.items.map((i) => ({
      order_id: order.orderId,
      product_id: i.product.parentId || i.product.id,
      product_name: i.product.name,
      product_image: i.product.image_url || i.product.image,
      unit_price: i.product.price,
      quantity: i.quantity,
      selected_variant: i.selectedVariant ?? null,
      total_price: i.product.price * i.quantity,
    }))
  );
  if (itemsError) {
    console.warn('[Supabase] lignes de commande :', itemsError.message);
    return false;
  }
  return true;
}

export interface TrackedOrder {
  id: string;
  status: string;
  created_at: string;
  total_amount: number;
  shipping_method: string;
  payment_method: string;
  city: string;
  items: { name: string; quantity: number; variant: string | null }[];
}

/** Suivi sans compte : numéro de commande + téléphone (fonction SQL track_order). */
export async function trackOrder(orderId: string, phone: string): Promise<TrackedOrder | null | 'error'> {
  if (!supabase) return 'error';
  const { data, error } = await supabase.rpc('track_order', { p_order_id: orderId.trim().toUpperCase(), p_phone: phone });
  if (error) {
    console.warn('[Supabase] suivi :', error.message);
    return 'error';
  }
  const row = Array.isArray(data) ? data[0] : data;
  return (row as TrackedOrder) ?? null;
}
