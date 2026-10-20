import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, CategoryId } from '../types';
import { CATEGORIES } from '../data/products';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Star,
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  X,
  Search,
  Save,
  Compass,
  ArrowRight,
  TrendingUp,
  Tag,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    homepageConfig,
    updateHomepageConfig,
    orders,
    updateOrderStatus,
    reviews,
    formatPrice,
    navigate,
  } = useShop();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'homepage' | 'orders' | 'reviews' | 'categories'
  >('overview');

  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Modal State for Add / Edit Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    slug: '',
    category_id: 'smartphones',
    price: 100000,
    old_price: 120000,
    stock: 10,
    brand: '',
    description: '',
    short_description: '',
    badge: 'Nouveau',
    is_featured: false,
    is_new: true,
    is_best_seller: false,
    is_active: true,
    image_url: '',
  });

  // Homepage Config Form State
  const [homeForm, setHomeForm] = useState(homepageConfig);
  const [homeSavedNotice, setHomeSavedNotice] = useState(false);

  // Filtered products list for table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCat =
      selectedCategoryFilter === 'all' || (p.category_id || p.category) === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalActiveProducts = products.filter((p) => p.is_active).length;
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      slug: '',
      category_id: 'smartphones',
      price: 150000,
      old_price: 180000,
      stock: 8,
      brand: 'Apple',
      description: 'Produit certifié conforme avec emballage d’origine scellé et garantie officielle constructeur.',
      short_description: 'Performance d’exception et finitions soignées.',
      badge: 'Nouveau',
      is_featured: false,
      is_new: true,
      is_best_seller: false,
      is_active: true,
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      slug: product.slug,
      category_id: product.category_id || product.category,
      price: product.price,
      old_price: product.old_price || product.original_price,
      stock: product.stock,
      brand: product.brand || '',
      description: product.description,
      short_description: product.short_description || '',
      badge: product.badge || '',
      is_featured: product.is_featured,
      is_new: product.is_new,
      is_best_seller: product.is_best_seller,
      is_active: product.is_active,
      image_url: product.image_url || product.image,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;

    if (editingProductId) {
      // Update
      updateProduct(editingProductId, productForm);
    } else {
      // Add new
      const newId = 'prod-' + Date.now();
      const generatedSlug =
        productForm.slug?.trim() ||
        productForm.name!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const newProd: Product = {
        id: newId,
        name: productForm.name!,
        slug: generatedSlug,
        description: productForm.description || '',
        short_description: productForm.short_description || '',
        category_id: (productForm.category_id as CategoryId) || 'smartphones',
        category: (productForm.category_id as CategoryId) || 'smartphones',
        price: Number(productForm.price),
        old_price: productForm.old_price ? Number(productForm.old_price) : undefined,
        original_price: productForm.old_price ? Number(productForm.old_price) : undefined,
        stock: Number(productForm.stock || 5),
        stock_count: Number(productForm.stock || 5),
        stockCount: Number(productForm.stock || 5),
        in_stock: Number(productForm.stock || 5) > 0,
        inStock: Number(productForm.stock || 5) > 0,
        brand: productForm.brand || 'SBS Accessoires',
        images: [productForm.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80'],
        image_url: productForm.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
        image: productForm.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
        gallery: [productForm.image_url || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80'],
        rating: 5.0,
        review_count: 0,
        reviewCount: 0,
        badge: productForm.badge,
        is_featured: Boolean(productForm.is_featured),
        is_new: Boolean(productForm.is_new),
        is_best_seller: Boolean(productForm.is_best_seller),
        is_active: productForm.is_active ?? true,
        created_at: new Date().toISOString(),
      };

      addProduct(newProd);
    }

    setIsProductModalOpen(false);
  };

  const handleSaveHomepage = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageConfig(homeForm);
    setHomeSavedNotice(true);
    setTimeout(() => setHomeSavedNotice(false), 2200);
  };

  return (
    <div className="py-8 sm:py-12 bg-porcelain min-h-screen text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* En-tête Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ink text-brand text-[11px] font-bold uppercase tracking-widest mb-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Back-Office d'Administration</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold text-ink">
              Tableau de Bord Commercial
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2.5 rounded-xl border border-ink/10 hover:border-brand bg-white text-xs font-bold text-ink transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Voir la boutique</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand" />
            </button>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-ink hover:bg-black text-brand font-bold text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Produit</span>
            </button>
          </div>
        </div>

        {/* Grille principale : Sidebar onglets + Contenu */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Latérale */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-ink/10 p-4 sm:p-5 space-y-1.5 shadow-xs">
            {[
              { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
              { id: 'products', label: 'Produits & Stock', icon: Package, badge: products.length },
              { id: 'homepage', label: 'Gestion Homepage', icon: Sparkles },
              { id: 'orders', label: 'Commandes', icon: ShoppingBag, badge: orders.length },
              { id: 'reviews', label: 'Avis & Testimonials', icon: Star, badge: reviews.length },
              { id: 'categories', label: 'Catégories', icon: Layers, badge: CATEGORIES.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-ink text-brand shadow-xs'
                      : 'text-neutral-700 hover:bg-[#F4F2EF] hover:text-ink'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand' : 'text-neutral-500'}`} />
                    <span>{tab.label}</span>
                  </span>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-brand text-ink' : 'bg-[#F4F2EF] text-neutral-600'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Panneau Contenu */}
          <div className="lg:col-span-9 bg-white rounded-3xl border border-ink/10 p-6 sm:p-8 shadow-xs min-h-[520px]">
            
            {/* ======================================================== */}
            {/* 1. VUE D'ENSEMBLE (OVERVIEW)                            */}
            {/* ======================================================== */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fadeIn">
                <div>
                  <h2 className="text-lg font-semibold text-ink">Performances & Chiffres Clés</h2>
                  <p className="text-xs text-neutral-500 font-light">
                    Indicateurs en temps réel des ventes et du catalogue SBS SARL.
                  </p>
                </div>

                {/* Cartes Métriques */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl bg-porcelain border border-ink/10 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-neutral-500">
                      Chiffre d’Affaires Total
                    </span>
                    <p className="text-2xl font-extrabold text-ink font-mono">
                      {formatPrice(totalRevenue)}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Commandes enregistrées
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-porcelain border border-ink/10 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-neutral-500">
                      Références Actives
                    </span>
                    <p className="text-2xl font-extrabold text-ink font-mono">
                      {totalActiveProducts} / {products.length}
                    </p>
                    <span className="text-[10px] text-neutral-500 font-light">
                      {totalStockUnits} unités physiques en stock
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-porcelain border border-ink/10 space-y-1">
                    <span className="text-[11px] uppercase font-bold text-neutral-500">
                      Avis Certifiés Clients
                    </span>
                    <p className="text-2xl font-extrabold text-ink font-mono">
                      {reviews.length} avis
                    </p>
                    <span className="text-[10px] text-brand-dark font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3 fill-gold" />
                      Note moyenne 4.9/5
                    </span>
                  </div>
                </div>

                {/* Dernières commandes */}
                <div className="space-y-4 pt-4 border-t border-ink/5">
                  <h3 className="text-sm font-bold text-ink">Dernières Commandes Reçues</h3>
                  <div className="space-y-2.5 text-xs">
                    {orders.slice(0, 3).map((o) => (
                      <div
                        key={o.orderId}
                        className="p-4 rounded-xl border border-ink/10 bg-porcelain flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-ink">#{o.orderId} · {o.customerName}</p>
                          <p className="text-neutral-500">{o.city}, {o.country} · {o.paymentMethod}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold block">{formatPrice(o.totalAmount)}</span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 2. GESTION DES PRODUITS (CRUD + STATUTS + STOCK)        */}
            {/* ======================================================== */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-ink">Catalogue Produits ({products.length})</h2>
                    <p className="text-xs text-neutral-500 font-light">
                      Ajoutez, modifiez le stock, ajustez les prix ou activez/désactivez des références.
                    </p>
                  </div>

                  <button
                    onClick={handleOpenAddModal}
                    className="px-4 py-2 bg-ink hover:bg-black text-brand font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Ajouter</span>
                  </button>
                </div>

                {/* Filtres de recherche */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Rechercher par nom, marque..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                    />
                  </div>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="smartphones">Téléphones</option>
                    <option value="protection">Pochettes & Verres</option>
                    <option value="montres-connectees">Montres connectées</option>
                    <option value="chargeurs-gadgets">Chargeurs & Gadgets</option>
                  </select>
                </div>

                {/* Tableau Produits */}
                <div className="border border-ink/10 rounded-2xl overflow-hidden overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F4F2EF] border-b border-ink/10 text-neutral-700 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Produit</th>
                        <th className="p-3">Catégorie</th>
                        <th className="p-3">Prix Fcfa</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3">Statut</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-porcelain/60 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <img
                              src={p.image_url || p.image}
                              alt=""
                              className="w-10 h-10 object-contain rounded-lg bg-[#F4F2EF] p-1 border border-ink/10 shrink-0"
                            />
                            <div className="min-w-0 max-w-[200px]">
                              <p className="font-bold text-ink truncate">{p.name}</p>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                Réf: {p.id}
                              </span>
                            </div>
                          </td>

                          <td className="p-3 text-neutral-600 font-medium">
                            {p.category_id || p.category}
                          </td>

                          <td className="p-3 font-mono font-bold text-ink">
                            {formatPrice(p.price)}
                            {p.old_price && (
                              <span className="block text-[10px] text-neutral-400 line-through">
                                {formatPrice(p.old_price)}
                              </span>
                            )}
                          </td>

                          <td className="p-3">
                            <span
                              className={`font-mono font-bold px-2 py-0.5 rounded ${
                                (p.stock || p.stock_count || 0) > 3
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {p.stock ?? p.stock_count ?? 0} unités
                            </span>
                          </td>

                          <td className="p-3">
                            <button
                              onClick={() => toggleProductActive(p.id)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                p.is_active
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-neutral-100 text-neutral-500 border border-neutral-300'
                              }`}
                            >
                              {p.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                              <span>{p.is_active ? 'Actif' : 'Désactivé'}</span>
                            </button>
                          </td>

                          <td className="p-3 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-1.5 text-neutral-600 hover:text-ink hover:bg-[#F4F2EF] rounded-lg cursor-pointer"
                                title="Modifier"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Supprimer définitivement "${p.name}" ?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 3. HOMEPAGE MANAGEMENT                                   */}
            {/* ======================================================== */}
            {activeTab === 'homepage' && (
              <form onSubmit={handleSaveHomepage} className="space-y-6 animate-fadeIn">
                <div className="border-b border-ink/10 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-ink">Gestion de la Homepage</h2>
                    <p className="text-xs text-neutral-500 font-light">
                      Personnalisez les messages d'accueil, le bandeau promo et la mise en avant.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-ink hover:bg-black text-brand font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Sauvegarder</span>
                  </button>
                </div>

                {homeSavedNotice && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Configuration de la page d’accueil mise à jour avec succès !</span>
                  </div>
                )}

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-ink block mb-1">Badge du Hero</label>
                    <input
                      type="text"
                      value={homeForm.heroBadge}
                      onChange={(e) => setHomeForm({ ...homeForm, heroBadge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-ink block mb-1">Titre Principal du Hero</label>
                    <input
                      type="text"
                      value={homeForm.heroTitle}
                      onChange={(e) => setHomeForm({ ...homeForm, heroTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-ink block mb-1">Sous-Titre du Hero</label>
                    <textarea
                      rows={2}
                      value={homeForm.heroSubtitle}
                      onChange={(e) => setHomeForm({ ...homeForm, heroSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="font-bold text-ink block mb-1">Code Promo Actif</label>
                      <input
                        type="text"
                        value={homeForm.promoCode}
                        onChange={(e) => setHomeForm({ ...homeForm, promoCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand font-mono uppercase"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-ink block mb-1">Pourcentage de Remise (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={homeForm.promoDiscount}
                        onChange={(e) =>
                          setHomeForm({ ...homeForm, promoDiscount: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* 4. COMMANDES                                             */}
            {/* ======================================================== */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-ink/10 pb-3">
                  <h2 className="text-lg font-semibold text-ink">Gestion des Commandes ({orders.length})</h2>
                  <p className="text-xs text-neutral-500 font-light">
                    Mettez à jour le statut d'acheminement des commandes clients.
                  </p>
                </div>

                <div className="space-y-4">
                  {orders.map((o) => (
                    <div
                      key={o.orderId}
                      className="p-5 rounded-2xl border border-ink/10 bg-porcelain space-y-3 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-ink/10">
                        <div>
                          <span className="font-bold text-ink text-sm">#{o.orderId}</span>
                          <p className="text-neutral-500">{o.customerName} · {o.phone}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-neutral-500">Statut :</span>
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.orderId, e.target.value as any)}
                            className="px-3 py-1.5 rounded-xl border border-ink/10 bg-white font-semibold text-xs text-ink focus:outline-none focus:border-brand cursor-pointer"
                          >
                            <option value="En préparation">En préparation</option>
                            <option value="En transit">En transit</option>
                            <option value="Livrée et reçue">Livrée et reçue</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-600">
                        <div>
                          <p className="font-semibold text-ink">Adresse :</p>
                          <p>{o.address}, {o.city} ({o.country})</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-ink">Montant net dû :</p>
                          <p className="font-mono font-extrabold text-sm text-ink">
                            {formatPrice(o.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 5. AVIS & TESTIMONIALS                                   */}
            {/* ======================================================== */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-ink/10 pb-3">
                  <h2 className="text-lg font-semibold text-ink">Modération des Avis Clients ({reviews.length})</h2>
                  <p className="text-xs text-neutral-500 font-light">
                    Visualisez les avis déposés par vos clients avec photos de déballage.
                  </p>
                </div>

                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-5 rounded-2xl border border-ink/10 bg-porcelain space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-ink">{r.author}</span>
                          <span className="text-neutral-400"> · {r.location}</span>
                        </div>
                        <div className="flex text-gold">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-gold" />
                          ))}
                        </div>
                      </div>

                      <p className="font-semibold text-brand-dark">Produit : {r.productName}</p>
                      <p className="font-bold text-ink">"{r.title}"</p>
                      <p className="text-neutral-600 font-light">{r.content}</p>

                      {r.photo_url && (
                        <div className="pt-2">
                          <img
                            src={r.photo_url}
                            alt=""
                            className="w-16 h-16 object-cover rounded-xl border border-ink/10"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* 6. CATÉGORIES                                            */}
            {/* ======================================================== */}
            {activeTab === 'categories' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-ink/10 pb-3">
                  <h2 className="text-lg font-semibold text-ink">Rayons SBS SARL</h2>
                  <p className="text-xs text-neutral-500 font-light">
                    Les 3 départements signatures configurés sur la boutique.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {CATEGORIES.map((c) => (
                    <div
                      key={c.id}
                      className="p-5 rounded-2xl border border-ink/10 bg-porcelain space-y-3 text-xs"
                    >
                      <div className="aspect-video rounded-xl overflow-hidden bg-neutral-900">
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-mono text-brand font-bold">{c.index}</span>
                      <h3 className="font-bold text-sm text-ink">{c.name}</h3>
                      <p className="text-neutral-500 text-[11px] font-light leading-relaxed">
                        {c.headline}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* MODAL CRÉATION / MODIFICATION PRODUIT                    */}
      {/* ======================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-porcelain rounded-3xl border border-ink/10 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-ink/10 flex items-center justify-between bg-white">
              <h3 className="text-sm font-bold text-ink">
                {editingProductId ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-ink rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-bold text-ink block mb-1">Nom du produit *</label>
                <input
                  type="text"
                  required
                  value={productForm.name || ''}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ex: Samsung Galaxy A35 128 Go"
                  className="w-full px-3.5 py-2 rounded-xl border border-ink/10 bg-white focus:outline-none focus:border-brand"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-ink block mb-1">Catégorie *</label>
                  <select
                    value={productForm.category_id || 'smartphones'}
                    onChange={(e) =>
                      setProductForm({ ...productForm, category_id: e.target.value as CategoryId })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-ink/10 bg-white focus:outline-none focus:border-brand"
                  >
                    <option value="smartphones">Téléphones</option>
                    <option value="protection">Pochettes & Verres</option>
                    <option value="montres-connectees">Montres connectées</option>
                    <option value="chargeurs-gadgets">Chargeurs & Gadgets</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Marque</label>
                  <input
                    type="text"
                    value={productForm.brand || ''}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="Ex: Apple, LG, Ninja..."
                    className="w-full px-3.5 py-2 rounded-xl border border-ink/10 bg-white focus:outline-none focus:border-brand"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-ink block mb-1">Prix Fcfa *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.price || ''}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-ink/10 bg-white focus:outline-none focus:border-brand font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Ancien Prix</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.old_price || ''}
                    onChange={(e) =>
                      setProductForm({ ...productForm, old_price: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-ink/10 bg-white focus:outline-none focus:border-brand font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Stock Physique *</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stock || ''}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-ink/10 bg-white focus:outline-none focus:border-brand font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Badge d'état</label>
                <input
                  type="text"
                  value={productForm.badge || ''}
                  onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  placeholder="Ex: Nouveau, Best Seller, -20%..."
                  className="w-full px-3.5 py-2 rounded-xl border border-ink/10 bg-white focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">URL de l'image principale</label>
                <input
                  type="url"
                  value={productForm.image_url || ''}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-ink/10 bg-white focus:outline-none focus:border-brand"
                />
              </div>

              <div>
                <label className="font-bold text-ink block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-ink/10 bg-white focus:outline-none focus:border-brand resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-600 hover:text-ink cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-ink hover:bg-black text-brand font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  {editingProductId ? 'Enregistrer les modifications' : 'Créer le produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
