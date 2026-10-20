import React, { useState } from 'react';
import { useShop, useCatalog } from '../context/ShopContext';

import { ProductCard } from '../components/products/ProductCard';
import {
  User,
  Package,
  MapPin,
  Heart,
  Truck,
  MessageSquare,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Star,
  Camera,
  Search,
  ExternalLink,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const {
    orders,
    activeOrder,
    updateOrderStatus,
    wishlist,
    reviews,
    formatPrice,
    navigate,
    setReviewModalOpen,
    setReviewTargetOrder,
  } = useShop();
  const PRODUCTS = useCatalog();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'orders' | 'tracking' | 'favorites' | 'addresses' | 'reviews'
  >('orders');

  const [trackingSearch, setTrackingSearch] = useState('');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(
    activeOrder || orders[0] || null
  );

  const favoriteProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  // Orders that are delivered and can be reviewed
  const deliveredOrderForReview = orders.find(
    (o) => o.status === 'Livrée et reçue' && !o.hasReviewed
  );

  const handleSearchTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingSearch.trim()) return;
    const found = orders.find((o) =>
      o.orderId.toLowerCase().includes(trackingSearch.trim().toLowerCase())
    );
    if (found) setSelectedOrderForTracking(found);
  };

  const handleConfirmReceived = (orderId: string) => {
    updateOrderStatus(orderId, 'Livrée et reçue');
    const order = orders.find((o) => o.orderId === orderId);
    if (order) {
      const updated = { ...order, status: 'Livrée et reçue' as const };
      setSelectedOrderForTracking(updated);
      setReviewTargetOrder(updated);
      setReviewModalOpen(true);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-porcelain min-h-screen text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* En-tête Espace Client */}
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-dark block mb-1">
            Espace Privilège
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Mon Compte Client
          </h1>
        </div>

        {/* ======================================================== */}
        {/* BANDEAU NOTIFICATION : COMMANDE REÇUE -> LAISSER UN AVIS */}
        {/* ======================================================== */}
        {deliveredOrderForReview && (
          <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-down">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Camera className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-emerald-950 text-sm block">
                  Votre commande #{deliveredOrderForReview.orderId} a été reçue !
                </span>
                <p className="text-emerald-700 font-light">
                  Aidez notre communauté en partageant votre expérience avec une photo facultative de votre article.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setReviewTargetOrder(deliveredOrderForReview);
                setReviewModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors shrink-0 shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Laisser mon avis avec photo</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* MENU LATÉRAL : 6 SECTIONS OFFICIELLES                   */}
          {/* Mon profil | Mes commandes | Suivi commande |           */}
          {/* Mes favoris | Mes adresses | Mes avis                    */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-ink/10 p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-3 pb-4 border-b border-ink/10">
              <div className="w-12 h-12 rounded-2xl bg-ink text-brand flex items-center justify-center font-bold text-base shadow-xs">
                AT
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">Amina Traoré</h3>
                <span className="text-[11px] font-semibold text-brand-dark">Membre Privilège Or</span>
              </div>
            </div>

            <nav className="space-y-1.5 text-xs font-semibold">
              {[
                { id: 'profile', label: 'Mon profil', icon: User },
                { id: 'orders', label: 'Mes commandes', icon: Package, badge: orders.length },
                { id: 'tracking', label: 'Suivi commande', icon: Truck },
                { id: 'favorites', label: 'Mes favoris', icon: Heart, badge: wishlist.length },
                { id: 'addresses', label: 'Mes adresses', icon: MapPin },
                { id: 'reviews', label: 'Mes avis', icon: MessageSquare, badge: reviews.length },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full text-left px-4 py-3 rounded-2xl min-h-[48px] flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-ink text-brand shadow-xs'
                        : 'text-neutral-700 hover:bg-[#F4F2EF] hover:text-ink'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand' : 'text-neutral-500'}`} />
                      <span>{item.label}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {item.badge !== undefined && item.badge > 0 && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-brand text-ink'
                              : 'bg-[#F4F2EF] text-neutral-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-brand' : 'text-neutral-400'}`} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ======================================================== */}
          {/* CONTENU CENTRAL DES 6 SECTIONS                           */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-ink/10 p-6 sm:p-8 shadow-xs min-h-[440px]">
            
            {/* 1. MON PROFIL */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-xl animate-fadeIn">
                <div className="border-b border-ink/10 pb-3">
                  <h2 className="text-base font-semibold text-ink">Mon Profil Personnel</h2>
                  <p className="text-xs text-neutral-500 font-light">
                    Gérez vos informations de compte et vos préférences de contact.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-neutral-600 font-semibold block mb-1">Nom complet</label>
                    <input
                      type="text"
                      defaultValue="Amina Traoré"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-600 font-semibold block mb-1">Adresse Email</label>
                    <input
                      type="email"
                      defaultValue="amina.traore@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-600 font-semibold block mb-1">
                      Numéro Téléphone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      defaultValue="+237 6XX XX XX XX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div className="pt-2">
                    <button className="px-5 py-2.5 bg-ink hover:bg-black text-brand font-bold text-xs rounded-xl transition-colors cursor-pointer">
                      Mettre à jour mon profil
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MES COMMANDES */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-ink/10 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-ink">Historique de mes Commandes</h2>
                    <p className="text-xs text-neutral-500 font-light">
                      Consultez l'historique de tous vos achats chez SBS SARL.
                    </p>
                  </div>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.orderId}
                        className="p-5 rounded-2xl border border-ink/10 bg-porcelain space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ink/10 gap-2 text-xs">
                          <div>
                            <span className="text-neutral-400">Numéro de Commande</span>
                            <p className="font-bold text-sm text-ink">
                              #{order.orderId}
                            </p>
                            <span className="text-neutral-400 font-light">{order.date}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                                order.status === 'Livrée et reçue'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                          <div>
                            <span className="text-neutral-400">Mode de règlement :</span>
                            <p className="font-semibold text-ink">{order.paymentMethod}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-neutral-400">Montant Total :</span>
                            <p className="font-extrabold text-base text-ink">
                              {formatPrice(order.totalAmount)}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-ink/5 flex items-center justify-between text-xs">
                          <button
                            onClick={() => {
                              setSelectedOrderForTracking(order);
                              setActiveTab('tracking');
                            }}
                            className="font-bold text-ink hover:text-brand-dark flex items-center gap-1 cursor-pointer"
                          >
                            <span>Suivre l'expédition</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>

                          {order.status === 'Livrée et reçue' && !order.hasReviewed && (
                            <button
                              onClick={() => {
                                setReviewTargetOrder(order);
                                setReviewModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-ink text-brand rounded-lg font-bold text-xs flex items-center gap-1.5 hover:bg-black"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Laisser un avis avec photo</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <Package className="w-10 h-10 text-neutral-300 mx-auto" />
                    <p className="text-xs text-neutral-500">Aucune commande pour le moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* 3. SUIVI COMMANDE */}
            {activeTab === 'tracking' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-ink/10 pb-3">
                  <h2 className="text-base font-semibold text-ink">Suivi de Commande en Temps Réel</h2>
                  <p className="text-xs text-neutral-500 font-light">
                    Localisez l'état d'acheminement de votre colis avec précision.
                  </p>
                </div>

                {/* Formulaire de recherche par référence */}
                <form onSubmit={handleSearchTracking} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={trackingSearch}
                      onChange={(e) => setTrackingSearch(e.target.value)}
                      placeholder="Entrez votre N° de commande (ex: LB-782910)"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-porcelain border border-ink/10 rounded-xl focus:outline-none focus:border-brand uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-ink text-brand text-xs font-bold rounded-xl hover:bg-black cursor-pointer"
                  >
                    Vérifier
                  </button>
                </form>

                {selectedOrderForTracking ? (
                  <div className="p-6 rounded-3xl border border-ink/10 bg-porcelain space-y-6 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink/10 pb-3">
                      <div>
                        <span className="text-neutral-400">Commande suivie</span>
                        <p className="font-bold text-base text-ink">
                          #{selectedOrderForTracking.orderId}
                        </p>
                      </div>
                      <span className="font-bold text-sm text-ink">
                        Total : {formatPrice(selectedOrderForTracking.totalAmount)}
                      </span>
                    </div>

                    {/* Jauge d'étapes d'acheminement */}
                    <div className="space-y-4">
                      <p className="font-bold text-xs text-ink uppercase tracking-wider text-brand-dark">
                        Progression de la Livraison
                      </p>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        {[
                          { title: 'En préparation', desc: 'Contrôle scellé & emballage' },
                          { title: 'En transit', desc: 'Pris en charge par coursier' },
                          { title: 'Livrée et reçue', desc: 'Remise en main propre' },
                        ].map((step, idx) => {
                          const orderStatus = selectedOrderForTracking.status;
                          const isDone =
                            orderStatus === 'Livrée et reçue' ||
                            (orderStatus === 'En transit' && idx <= 1) ||
                            idx === 0;
                          const isCurrent = orderStatus === step.title;

                          return (
                            <div
                              key={step.title}
                              className={`p-3 rounded-2xl border text-xs space-y-1 transition-all ${
                                isCurrent
                                  ? 'bg-ink text-brand border-ink shadow-xs'
                                  : isDone
                                  ? 'bg-white border-ink/10 text-neutral-800'
                                  : 'bg-[#F4F2EF] border-transparent text-neutral-400'
                              }`}
                            >
                              <div className="w-5 h-5 rounded-full mx-auto flex items-center justify-center font-bold text-[10px] bg-brand/20 text-brand">
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <p className="font-bold">{step.title}</p>
                              <p className="text-[10px] font-light leading-tight hidden sm:block opacity-80">
                                {step.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bouton de confirmation de réception */}
                    {selectedOrderForTracking.status !== 'Livrée et reçue' && (
                      <div className="pt-2 border-t border-ink/10 flex justify-between items-center">
                        <span className="text-neutral-500">Avez-vous réceptionné votre colis ?</span>
                        <button
                          onClick={() => handleConfirmReceived(selectedOrderForTracking.orderId)}
                          className="px-4 py-2 bg-ink hover:bg-black text-brand font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Confirmer la réception de mon colis
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 text-center py-8">
                    Veuillez entrer une référence de commande valide pour afficher le suivi.
                  </p>
                )}
              </div>
            )}

            {/* 4. MES FAVORIS */}
            {activeTab === 'favorites' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-ink/10 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-ink">Mes Favoris ({favoriteProducts.length})</h2>
                    <p className="text-xs text-neutral-500 font-light">
                      Vos articles marqués d'un cœur doré pour achat ultérieur.
                    </p>
                  </div>
                </div>

                {favoriteProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {favoriteProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <Heart className="w-10 h-10 text-neutral-300 mx-auto" />
                    <p className="text-xs text-neutral-500">Aucun favori enregistré.</p>
                  </div>
                )}
              </div>
            )}

            {/* 5. MES ADRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-ink/10 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-ink">Mes Adresses de Livraison</h2>
                    <p className="text-xs text-neutral-500 font-light">
                      Carnet de vos adresses pour une expédition rapide en 1 clic.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-brand bg-porcelain flex items-start justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink">Domicile Principal</span>
                      <span className="text-[10px] font-bold text-brand-dark bg-white border border-brand/40 px-2 py-0.5 rounded">
                        Par défaut
                      </span>
                    </div>
                    <p className="text-neutral-700">Client Démo · +237 6XX XX XX XX</p>
                    <p className="text-neutral-500">Akwa, Boulevard de la Liberté</p>
                    <p className="text-neutral-500">Douala, Cameroun</p>
                  </div>
                </div>
              </div>
            )}

            {/* 6. MES AVIS */}
            {activeTab === 'reviews' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="border-b border-ink/10 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-ink">Mes Avis Rédigés</h2>
                    <p className="text-xs text-neutral-500 font-light">
                      Historique de vos retours d'expérience et notes partagées.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setReviewTargetOrder(orders[0] || null);
                      setReviewModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-ink hover:bg-black text-brand rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Nouvel avis avec photo</span>
                  </button>
                </div>

                {reviews.length > 0 ? (
                  <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl border border-ink/10 bg-porcelain space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink">{rev.productName}</span>
                          <span className="text-neutral-400 text-[11px]">{rev.date}</span>
                        </div>
                        <div className="flex text-gold">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-gold" />
                          ))}
                        </div>
                        <p className="font-bold text-ink">"{rev.title}"</p>
                        <p className="text-neutral-600 font-light">{rev.content}</p>

                        {/* Photo facultative */}
                        {rev.photo_url && (
                          <div className="pt-2">
                            <img
                              src={rev.photo_url}
                              alt="Photo article reçu"
                              className="w-16 h-16 object-cover rounded-xl border border-ink/10"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 text-center py-8">
                    Vous n'avez pas encore publié d'avis.
                  </p>
                )}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
