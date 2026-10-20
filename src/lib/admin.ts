// ============================================================================
// SBS SARL – fonctions de l'espace administrateur (Supabase Auth + RLS)
// ============================================================================
import { supabase, ProductRow } from './supabase';
import type { OrderStatus } from '../types';

export interface AdminOrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  unit_price: number;
  quantity: number;
  selected_variant: string | null;
}

export interface AdminOrder {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  city: string;
  delivery_address: string;
  shipping_method: string;
  payment_method: string;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  order_items: AdminOrderItem[];
}

export interface AdminReview {
  id: string;
  product_name: string;
  author_name: string;
  location: string | null;
  rating: number;
  title: string;
  content: string;
  is_approved: boolean;
  created_at: string;
}

const need = () => {
  if (!supabase) throw new Error('Supabase non configuré');
  return supabase;
};

export async function signIn(email: string, password: string) {
  const { error } = await need().auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message === 'Invalid login credentials' ? 'E-mail ou mot de passe incorrect.' : error.message);
}

export async function signOut() {
  await need().auth.signOut();
}

export async function currentAdmin(): Promise<{ email: string; isAdmin: boolean } | null> {
  const sb = need();
  const { data } = await sb.auth.getSession();
  const user = data.session?.user;
  if (!user) return null;
  // La politique RLS n'autorise un utilisateur qu'à lire sa propre ligne admin_users
  const { data: row } = await sb.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle();
  return { email: user.email ?? '', isAdmin: Boolean(row) };
}

export async function listOrders(): Promise<AdminOrder[]> {
  const { data, error } = await need()
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return data as AdminOrder[];
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  const { error } = await need()
    .from('orders')
    .update({ status, delivered_at: status === 'Livrée et reçue' ? new Date().toISOString() : null })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listAllProducts(): Promise<ProductRow[]> {
  const { data, error } = await need().from('products').select('*').order('display_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data as ProductRow[];
}

export async function saveProduct(row: Partial<ProductRow> & { id?: string }) {
  const sb = need();
  const payload = { ...row };
  const { error } = row.id
    ? await sb.from('products').update(payload).eq('id', row.id)
    : await sb.from('products').insert(payload);
  if (error) throw new Error(error.message);
}

export async function uploadProductImage(file: File): Promise<string> {
  const sb = need();
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await sb.storage.from('products').upload(path, file, { cacheControl: '31536000', contentType: file.type });
  if (error) throw new Error(error.message);
  return sb.storage.from('products').getPublicUrl(path).data.publicUrl;
}

export async function listReviews(): Promise<AdminReview[]> {
  const { data, error } = await need().from('reviews').select('*').order('created_at', { ascending: false }).limit(200);
  if (error) throw new Error(error.message);
  return data as AdminReview[];
}

export async function setReviewApproved(id: string, approved: boolean) {
  const { error } = await need().from('reviews').update({ is_approved: approved }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteReview(id: string) {
  const { error } = await need().from('reviews').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
