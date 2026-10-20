import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { isSupabaseConfigured, ProductRow } from '../lib/supabase';
import {
  AdminOrder,
  AdminReview,
  currentAdmin,
  deleteReview,
  listAllProducts,
  listOrders,
  listReviews,
  saveProduct,
  setOrderStatus,
  setReviewApproved,
  signIn,
  signOut,
  uploadProductImage,
} from '../lib/admin';
import { CATEGORIES } from '../data/products';
import type { CategoryId, OrderStatus } from '../types';
import { Loader2, LogOut, MessageCircle, Plus, RefreshCw, Search, Star, Upload, X, Check, Trash2 } from 'lucide-react';

const STATUSES: OrderStatus[] = ['En préparation', 'En transit', 'Livrée et reçue', 'Annulée'];
const STATUS_STYLE: Record<OrderStatus, string> = {
  'En préparation': 'bg-blush text-brand-dark',
  'En transit': 'bg-[#EAF1FB] text-[#1D4F91]',
  'Livrée et reçue': 'bg-[#E8F5EF] text-[#1F7A5C]',
  Annulée: 'bg-ink/5 text-ink/50',
};

const inputCls = 'w-full px-3 py-2 rounded-lg border border-ink/15 bg-white text-sm focus:outline-none focus:border-brand';

// ---------------------------------------------------------------------------
// Connexion
// ---------------------------------------------------------------------------
const Login: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email.trim(), password);
      onDone();
    } catch (err) {
      setError((err as Error).message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-3xl">Espace administrateur</h1>
      <p className="mt-2 text-sm text-ink/60">Connectez-vous avec le compte créé pour SBS SARL.</p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        <input className={inputCls + ' py-3'} type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
        <input
          className={inputCls + ' py-3'}
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-full bg-ink hover:bg-black text-white py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer">
          {loading && <Loader2 className="w-4 h-4 animate-spin" />} Se connecter
        </button>
      </form>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Commandes
// ---------------------------------------------------------------------------
const OrdersTab: React.FC = () => {
  const { formatPrice } = useShop();
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [error, setError] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setOrders(await listOrders());
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const change = async (id: string, status: OrderStatus) => {
    try {
      await setOrderStatus(id, status);
      setOrders((prev) => prev?.map((o) => (o.id === id ? { ...o, status } : o)) ?? null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const list = (orders ?? []).filter((o) => filter === 'all' || o.status === filter);
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthRevenue = (orders ?? [])
    .filter((o) => o.status !== 'Annulée' && new Date(o.created_at) >= startOfMonth)
    .reduce((s, o) => s + o.total_amount, 0);
  const pending = (orders ?? []).filter((o) => o.status === 'En préparation').length;

  if (!orders) return <p className="py-10 text-sm text-ink/60">{error || 'Chargement des commandes…'}</p>;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { l: 'À préparer', v: String(pending) },
          { l: 'Commandes (total)', v: String(orders.length) },
          { l: 'Chiffre du mois', v: formatPrice(monthRevenue) },
        ].map((k) => (
          <div key={k.l} className="bg-white rounded-2xl border border-ink/10 p-4">
            <p className="text-xs text-ink/55">{k.l}</p>
            <p className="mt-1 font-display text-xl sm:text-2xl font-semibold">{k.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {(['all', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3.5 py-1.5 rounded-full text-sm cursor-pointer ${filter === s ? 'bg-ink text-white' : 'bg-white border border-ink/10 hover:border-ink/30'}`}
          >
            {s === 'all' ? 'Toutes' : s}
          </button>
        ))}
        <button onClick={load} className="ml-auto p-2 rounded-full hover:bg-blush cursor-pointer" aria-label="Actualiser">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 space-y-2">
        {list.length === 0 && <p className="py-8 text-sm text-ink/55">Aucune commande.</p>}
        {list.map((o) => {
          const phoneDigits = o.phone.replace(/\D/g, '');
          const wa = `https://wa.me/${phoneDigits.length === 9 ? '237' + phoneDigits : phoneDigits}?text=${encodeURIComponent(
            `Bonjour ${o.customer_name}, c’est SBS SARL au sujet de votre commande ${o.id}.`
          )}`;
          return (
            <div key={o.id} className="bg-white rounded-2xl border border-ink/10">
              <button onClick={() => setOpen(open === o.id ? null : o.id)} className="w-full p-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-left cursor-pointer">
                <span className="font-semibold">{o.id}</span>
                <span className="text-sm text-ink/60">{new Date(o.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                <span className="text-sm">{o.customer_name}</span>
                <span className="ml-auto font-semibold tabular-nums">{formatPrice(o.total_amount)}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[o.status]}`}>{o.status}</span>
              </button>
              {open === o.id && (
                <div className="px-4 pb-4 border-t border-ink/10 pt-4 grid md:grid-cols-[1fr_260px] gap-6">
                  <div>
                    <ul className="divide-y divide-ink/10 text-sm">
                      {o.order_items.map((i) => (
                        <li key={i.id} className="py-2 flex items-center gap-3">
                          {i.product_image && <img src={i.product_image} alt="" className="w-10 h-10 rounded-lg object-cover bg-[#F4F2EF]" />}
                          <span className="flex-1">
                            {i.quantity} × {i.product_name}
                            {i.selected_variant && <span className="text-ink/50"> · {i.selected_variant}</span>}
                          </span>
                          <span className="tabular-nums">{formatPrice(i.unit_price * i.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-xs text-ink/55">
                      Sous-total {formatPrice(o.subtotal)} · Remise {formatPrice(o.discount_amount)} · Livraison {formatPrice(o.shipping_fee)}
                      {o.notes && ` · ${o.notes}`}
                    </p>
                  </div>
                  <div className="text-sm space-y-1.5">
                    <p className="font-semibold">{o.customer_name}</p>
                    <p>{o.phone}</p>
                    {o.email && o.email !== '-' && <p className="text-ink/60">{o.email}</p>}
                    <p className="text-ink/60">{o.shipping_method}</p>
                    <p className="text-ink/60">
                      {o.delivery_address}, {o.city}
                    </p>
                    <p className="text-ink/60">{o.payment_method}</p>
                    <select value={o.status} onChange={(e) => change(o.id, e.target.value as OrderStatus)} className={inputCls + ' mt-2'}>
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <a
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white py-2 text-sm font-semibold"
                    >
                      <MessageCircle className="w-4 h-4" /> Contacter le client
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Produits
// ---------------------------------------------------------------------------
type Draft = Partial<ProductRow> & { featuresText?: string };

const emptyDraft = (): Draft => ({
  name: '',
  slug: '',
  category_id: 'smartphones',
  brand: '',
  sub_category: '',
  short_description: '',
  description: '',
  price: 0,
  old_price: null,
  stock: 1,
  badge: '',
  image_url: '',
  is_active: true,
  is_new: true,
  is_best_seller: false,
  is_promotion: false,
  featuresText: '',
});

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const ProductForm: React.FC<{ initial: Draft; onClose: () => void; onSaved: () => void }> = ({ initial, onClose, onSaved }) => {
  const [d, setD] = useState<Draft>({ ...initial, featuresText: (initial.features || []).join('\n') });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const set = (k: keyof Draft, v: unknown) => setD((p) => ({ ...p, [k]: v }));

  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      set('image_url', await uploadProductImage(file));
    } catch (e) {
      setError((e as Error).message);
    }
    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.name || !d.price || !d.description) {
      setError('Nom, prix et description sont obligatoires.');
      return;
    }
    setSaving(true);
    setError('');
    const { featuresText, ...rest } = d;
    try {
      await saveProduct({
        ...rest,
        slug: d.slug || slugify(d.name),
        old_price: d.old_price ? Number(d.old_price) : null,
        price: Number(d.price),
        stock: Number(d.stock ?? 0),
        badge: d.badge || null,
        features: (featuresText || '').split('\n').map((l) => l.trim()).filter(Boolean),
      });
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink/50 flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <form onSubmit={submit} className="bg-porcelain w-full sm:max-w-2xl sm:rounded-3xl p-5 sm:p-7 min-h-screen sm:min-h-0">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">{initial.id ? 'Modifier le produit' : 'Nouveau produit'}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-blush cursor-pointer" aria-label="Fermer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 grid sm:grid-cols-[140px_1fr] gap-5">
          <div>
            <div className="aspect-square rounded-2xl bg-[#F4F2EF] overflow-hidden flex items-center justify-center">
              {d.image_url ? <img src={d.image_url} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-ink/40">Aucune photo</span>}
            </div>
            <label className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-ink/15 bg-white py-2 text-xs font-semibold cursor-pointer">
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Photo
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
            </label>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <label className="sm:col-span-2">
              Nom *
              <input className={inputCls} value={d.name || ''} onChange={(e) => set('name', e.target.value)} />
            </label>
            <label>
              Rayon
              <select className={inputCls} value={d.category_id} onChange={(e) => set('category_id', e.target.value as CategoryId)}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Marque
              <input className={inputCls} value={d.brand || ''} onChange={(e) => set('brand', e.target.value)} />
            </label>
            <label>
              Prix (FCFA) *
              <input className={inputCls} type="number" min={0} value={d.price ?? ''} onChange={(e) => set('price', e.target.value)} />
            </label>
            <label>
              Ancien prix (barré)
              <input className={inputCls} type="number" min={0} value={d.old_price ?? ''} onChange={(e) => set('old_price', e.target.value)} />
            </label>
            <label>
              Stock
              <input className={inputCls} type="number" min={0} value={d.stock ?? 0} onChange={(e) => set('stock', e.target.value)} />
            </label>
            <label>
              Badge
              <input className={inputCls} placeholder="Nouveau, -10%…" value={d.badge || ''} onChange={(e) => set('badge', e.target.value)} />
            </label>
            <label className="sm:col-span-2">
              Sous-catégorie
              <input className={inputCls} placeholder="iPhone, Coques, Power banks…" value={d.sub_category || ''} onChange={(e) => set('sub_category', e.target.value)} />
            </label>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-sm">
          <label>
            Accroche courte
            <input className={inputCls} value={d.short_description || ''} onChange={(e) => set('short_description', e.target.value)} />
          </label>
          <label>
            Description *
            <textarea className={inputCls} rows={3} value={d.description || ''} onChange={(e) => set('description', e.target.value)} />
          </label>
          <label>
            Points forts (un par ligne)
            <textarea className={inputCls} rows={3} value={d.featuresText || ''} onChange={(e) => set('featuresText', e.target.value)} />
          </label>
          <div className="flex flex-wrap gap-4">
            {(
              [
                ['is_active', 'Visible sur le site'],
                ['is_new', 'Nouveauté'],
                ['is_best_seller', 'Best-seller'],
                ['is_promotion', 'En promotion'],
              ] as const
            ).map(([k, l]) => (
              <label key={k} className="inline-flex items-center gap-2">
                <input type="checkbox" className="accent-[#F26B1D] w-4 h-4" checked={Boolean(d[k])} onChange={(e) => set(k, e.target.checked)} />
                {l}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-full border border-ink/15 text-sm font-semibold cursor-pointer">
            Annuler
          </button>
          <button className="px-5 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

const ProductsTab: React.FC = () => {
  const { formatPrice } = useShop();
  const [rows, setRows] = useState<ProductRow[] | null>(null);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<Draft | null>(null);
  const [quick, setQuick] = useState<Record<string, { price?: number; stock?: number }>>({});
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setRows(await listAllProducts());
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => (rows ?? []).filter((r) => `${r.name} ${r.brand ?? ''} ${r.sub_category ?? ''}`.toLowerCase().includes(q.toLowerCase())),
    [rows, q]
  );

  const quickSave = async (r: ProductRow) => {
    const patch = quick[r.id];
    if (!patch) return;
    try {
      await saveProduct({ id: r.id, ...patch });
      setRows((prev) => prev?.map((x) => (x.id === r.id ? { ...x, ...patch } : x)) ?? null);
      setQuick((p) => {
        const n = { ...p };
        delete n[r.id];
        return n;
      });
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const toggleActive = async (r: ProductRow) => {
    try {
      await saveProduct({ id: r.id, is_active: !r.is_active });
      setRows((prev) => prev?.map((x) => (x.id === r.id ? { ...x, is_active: !r.is_active } : x)) ?? null);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (!rows) return <p className="py-10 text-sm text-ink/60">{error || 'Chargement du catalogue…'}</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input className={inputCls + ' pl-9 py-2.5'} placeholder="Rechercher un produit" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button
          onClick={() => setEditing(emptyDraft())}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand hover:bg-brand-hover text-white px-5 py-2.5 text-sm font-semibold cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Nouveau produit
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 bg-white rounded-2xl border border-ink/10 divide-y divide-ink/10">
        {filtered.map((r) => {
          const qp = quick[r.id] || {};
          const dirty = qp.price !== undefined || qp.stock !== undefined;
          return (
            <div key={r.id} className={`p-3 flex flex-wrap items-center gap-3 ${r.is_active ? '' : 'opacity-55'}`}>
              <img src={r.image_url || ''} alt="" className="w-12 h-12 rounded-xl object-cover bg-[#F4F2EF]" />
              <button onClick={() => setEditing({ ...r })} className="flex-1 min-w-[180px] text-left cursor-pointer">
                <p className="text-sm font-semibold hover:text-brand-dark">{r.name}</p>
                <p className="text-xs text-ink/50">
                  {CATEGORIES.find((c) => c.id === r.category_id)?.name} · {formatPrice(r.price)}
                </p>
              </button>
              <label className="text-xs text-ink/55">
                Prix
                <input
                  type="number"
                  className={inputCls + ' w-28 mt-0.5'}
                  value={qp.price ?? r.price}
                  onChange={(e) => setQuick((p) => ({ ...p, [r.id]: { ...p[r.id], price: Number(e.target.value) } }))}
                />
              </label>
              <label className="text-xs text-ink/55">
                Stock
                <input
                  type="number"
                  className={`${inputCls} w-20 mt-0.5 ${r.stock <= 3 ? 'border-brand' : ''}`}
                  value={qp.stock ?? r.stock}
                  onChange={(e) => setQuick((p) => ({ ...p, [r.id]: { ...p[r.id], stock: Number(e.target.value) } }))}
                />
              </label>
              <button
                onClick={() => quickSave(r)}
                disabled={!dirty}
                className="self-end mb-0.5 p-2 rounded-lg bg-ink text-white disabled:opacity-20 cursor-pointer"
                aria-label="Enregistrer prix et stock"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleActive(r)}
                className={`self-end mb-0.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${r.is_active ? 'bg-[#E8F5EF] text-[#1F7A5C]' : 'bg-ink/5 text-ink/60'}`}
              >
                {r.is_active ? 'Visible' : 'Masqué'}
              </button>
            </div>
          );
        })}
      </div>

      {editing && (
        <ProductForm
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Avis
// ---------------------------------------------------------------------------
const ReviewsTab: React.FC = () => {
  const [rows, setRows] = useState<AdminReview[] | null>(null);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    try {
      setRows(await listReviews());
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const act = async (fn: () => Promise<void>) => {
    try {
      await fn();
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  if (!rows) return <p className="py-10 text-sm text-ink/60">{error || 'Chargement des avis…'}</p>;
  const pending = rows.filter((r) => !r.is_approved);
  const published = rows.filter((r) => r.is_approved);

  const Card: React.FC<{ r: AdminReview }> = ({ r }) => (
    <div className="bg-white rounded-2xl border border-ink/10 p-4">
      <div className="flex items-center gap-1 text-gold">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-gold' : 'text-ink/15'}`} />
        ))}
        <span className="ml-2 text-xs text-ink/50">{new Date(r.created_at).toLocaleDateString('fr-FR')}</span>
      </div>
      <p className="mt-2 text-sm font-semibold">{r.title}</p>
      <p className="text-sm text-ink/70">{r.content}</p>
      <p className="mt-2 text-xs text-ink/50">
        {r.author_name} · {r.location} · {r.product_name}
      </p>
      <div className="mt-3 flex gap-2">
        {r.is_approved ? (
          <button onClick={() => act(() => setReviewApproved(r.id, false))} className="px-3 py-1.5 rounded-lg border border-ink/15 text-xs font-semibold cursor-pointer">
            Retirer du site
          </button>
        ) : (
          <button onClick={() => act(() => setReviewApproved(r.id, true))} className="px-3 py-1.5 rounded-lg bg-[#1F7A5C] text-white text-xs font-semibold cursor-pointer">
            Publier
          </button>
        )}
        <button onClick={() => act(() => deleteReview(r.id))} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 hover:bg-red-50 inline-flex items-center gap-1 cursor-pointer">
          <Trash2 className="w-3.5 h-3.5" /> Supprimer
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <section>
        <h3 className="font-display text-xl font-semibold">À valider ({pending.length})</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          {pending.length === 0 ? <p className="text-sm text-ink/55">Aucun avis en attente.</p> : pending.map((r) => <Card key={r.id} r={r} />)}
        </div>
      </section>
      <section>
        <h3 className="font-display text-xl font-semibold">Publiés ({published.length})</h3>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          {published.map((r) => (
            <Card key={r.id} r={r} />
          ))}
        </div>
      </section>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export const AdminPage: React.FC = () => {
  const [state, setState] = useState<'loading' | 'out' | 'denied' | 'in'>('loading');
  const [email, setEmail] = useState('');
  const [tab, setTab] = useState<'orders' | 'products' | 'reviews'>('orders');

  const check = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    const me = await currentAdmin();
    if (!me) setState('out');
    else {
      setEmail(me.email);
      setState(me.isAdmin ? 'in' : 'denied');
    }
  }, []);
  useEffect(() => {
    check();
  }, [check]);

  if (!isSupabaseConfigured)
    return <p className="max-w-xl mx-auto px-4 py-20 text-ink/60">L’espace administrateur nécessite la connexion à Supabase.</p>;
  if (state === 'loading') return <p className="max-w-xl mx-auto px-4 py-20 text-ink/60">Chargement…</p>;
  if (state === 'out') return <Login onDone={check} />;
  if (state === 'denied')
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <h1 className="text-3xl">Accès refusé</h1>
        <p className="mt-2 text-ink/60">Le compte {email} n’a pas les droits administrateur.</p>
        <button
          onClick={async () => {
            await signOut();
            setState('out');
          }}
          className="mt-6 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold cursor-pointer"
        >
          Se déconnecter
        </button>
      </div>
    );

  return (
    <div className="bg-porcelain min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl">Gestion de la boutique</h1>
            <p className="text-sm text-ink/55">Connecté : {email}</p>
          </div>
          <button
            onClick={async () => {
              await signOut();
              setState('out');
            }}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>

        <div className="mt-6 flex gap-1 border-b border-ink/10">
          {(
            [
              ['orders', 'Commandes'],
              ['products', 'Produits & stock'],
              ['reviews', 'Avis clients'],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-4 py-2.5 text-sm -mb-px border-b-2 cursor-pointer ${tab === k ? 'border-brand text-ink font-semibold' : 'border-transparent text-ink/60 hover:text-ink'}`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'orders' && <OrdersTab />}
          {tab === 'products' && <ProductsTab />}
          {tab === 'reviews' && <ReviewsTab />}
        </div>
      </div>
    </div>
  );
};
