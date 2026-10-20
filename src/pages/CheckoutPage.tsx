import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { SHOP } from '../data/products';
import { submitOrder } from '../lib/supabase';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  ShoppingBag,
  CreditCard,
  Smartphone,
  Banknote,
  Check,
  Star,
  Camera,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    clearCart,
    formatPrice,
    navigate,
    addOrder,
    activeOrder,
    setActiveOrder,
    updateOrderStatus,
    setReviewModalOpen,
    setReviewTargetOrder,
  } = useShop();

  // Step state: 1: Informations | 2: Livraison | 3: Paiement | 4: Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [formData, setFormData] = useState({
    // 01 Informations client
    fullName: '',
    email: '',
    phone: '',

    // 02 Adresse & Livraison
    country: 'Cameroun',
    city: 'Douala',
    address: '',
    postalCode: '',
    shippingMethod: 'express', // express | standard | pickup

    // 03 Paiement
    paymentMethod: 'cod', // cod | wave | mobile_money | card
  });

  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const shippingFees: Record<string, number> = {
    express: cartTotal >= SHOP.freeShippingThreshold || cartTotal === 0 ? 0 : SHOP.shippingFee,
    standard: 0,
    pickup: 0,
  };

  const currentShippingFee = shippingFees[formData.shippingMethod] || 0;
  const finalTotal = cartTotal + currentShippingFee;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Move to Next Step with light validation
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.country || !formData.city || !formData.address) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Create and save final order
      const newOrderId = 'SBS-' + Math.floor(100000 + Math.random() * 900000);
      const newOrder: Order = {
        orderId: newOrderId,
        date: 'Aujourd’hui',
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        address: formData.address,
        postalCode: formData.postalCode,
        shippingMethod:
          formData.shippingMethod === 'express'
            ? 'Livraison Express Douala (24h)'
            : formData.shippingMethod === 'pickup'
            ? 'Retrait en boutique'
            : 'Expédition par agence (24h-72h)',
        paymentMethod:
          formData.paymentMethod === 'cod'
            ? 'Paiement à la livraison (Espèces)'
            : formData.paymentMethod === 'wave'
            ? 'Orange Money'
            : formData.paymentMethod === 'mobile_money'
            ? 'MTN Mobile Money'
            : 'Carte Bancaire (Visa / Mastercard)',
        items: [...cart],
        totalAmount: finalTotal,
        status: 'En préparation',
      };

      addOrder(newOrder);
      submitOrder(newOrder, currentShippingFee);
      setConfirmedOrder(newOrder);
      clearCart();
      setCurrentStep(4);
    }
  };

  // If on confirmation step
  if (currentStep === 4 && confirmedOrder) {
    return (
      <div className="py-12 sm:py-20 bg-porcelain min-h-screen text-left">
        <div className="max-w-2xl mx-auto px-4 space-y-8 animate-fadeIn">
          
          {/* Header Confirmation */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 shadow-sm">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">
              Étape 04 · Confirmation
            </span>
            <h1 className="text-2xl sm:text-4xl font-semibold text-ink">
              Merci pour votre commande !
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto font-light">
              Votre commande a été transmise à notre service logistique. Vous recevrez un appel du livreur dès son départ.
            </p>
          </div>

          {/* Reçu de commande détaillé */}
          <div className="bg-white rounded-3xl border border-ink/10 p-6 sm:p-8 space-y-5 shadow-xs text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ink/10 gap-2">
              <div>
                <span className="text-neutral-400">Numéro de Commande</span>
                <p className="font-mono font-bold text-base text-ink">
                  #{confirmedOrder.orderId}
                </p>
              </div>

              {/* État de commande dynamique */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-porcelain border border-brand/40 text-ink font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                <span>Statut : {confirmedOrder.status}</span>
              </div>
            </div>

            {/* Détails client & livraison */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-neutral-400 font-semibold mb-1">Informations Client</p>
                <p className="font-bold text-ink">{confirmedOrder.customerName}</p>
                <p className="text-neutral-600">{confirmedOrder.phone}</p>
                <p className="text-neutral-600">{confirmedOrder.email}</p>
              </div>

              <div>
                <p className="text-neutral-400 font-semibold mb-1">Adresse de Réception</p>
                <p className="font-bold text-ink">{confirmedOrder.city}, {confirmedOrder.country}</p>
                <p className="text-neutral-600">{confirmedOrder.address}</p>
                <p className="text-neutral-500 font-mono">CP : {confirmedOrder.postalCode}</p>
              </div>
            </div>

            {/* Mode de livraison & paiement */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-ink/5">
              <div>
                <p className="text-neutral-400">Mode de Livraison</p>
                <p className="font-semibold text-ink">{confirmedOrder.shippingMethod}</p>
              </div>
              <div>
                <p className="text-neutral-400">Mode de Règlement</p>
                <p className="font-semibold text-ink">{confirmedOrder.paymentMethod}</p>
              </div>
            </div>

            {/* Total Net */}
            <div className="pt-4 border-t border-ink/10 flex justify-between items-baseline">
              <span className="text-sm font-bold text-ink">Montant Total Dû</span>
              <span className="text-xl font-mono font-extrabold text-ink">
                {formatPrice(confirmedOrder.totalAmount)}
              </span>
            </div>
          </div>

          {/* SIMULATION : Confirmer la réception pour déclencher l'avis avec photo */}
          {confirmedOrder.status !== 'Livrée et reçue' ? (
            <div className="p-4 rounded-2xl bg-porcelain border border-brand/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-ink flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand" />
                  Simuler la réception de votre colis
                </span>
                <p className="text-neutral-500 font-light">
                  Permet de tester l'invitation à laisser un avis client avec photo.
                </p>
              </div>

              <button
                onClick={() => {
                  updateOrderStatus(confirmedOrder.orderId, 'Livrée et reçue');
                  setConfirmedOrder({ ...confirmedOrder, status: 'Livrée et reçue' });
                  setReviewTargetOrder(confirmedOrder);
                  setReviewModalOpen(true);
                }}
                className="px-4 py-2 bg-ink text-brand rounded-xl font-bold text-xs hover:bg-black transition-colors cursor-pointer shrink-0"
              >
                Colis reçu (Déclencher avis)
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-emerald-900">
                  Commande confirmée comme reçue ! Merci pour votre confiance.
                </span>
              </div>
              <button
                onClick={() => {
                  setReviewTargetOrder(confirmedOrder);
                  setReviewModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-800 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Laisser un avis avec photo</span>
              </button>
            </div>
          )}

          {/* Navigation boutons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <a
              href={`https://wa.me/${SHOP.whatsappNumber}?text=${encodeURIComponent(
                `Bonjour SBS SARL, je confirme ma commande #${confirmedOrder.orderId} d'un montant de ${formatPrice(
                  confirmedOrder.totalAmount
                )}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Suivre sur WhatsApp avec un conseiller</span>
            </a>

            <button
              onClick={() => navigate('/compte')}
              className="w-full sm:w-auto px-6 py-3.5 bg-ink hover:bg-black text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Aller à mon Compte Client
            </button>
          </div>

        </div>
      </div>
    );
  }

  // If cart is empty and not confirmed
  if (cart.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 bg-porcelain min-h-screen">
        <div className="w-16 h-16 rounded-full bg-[#F4F2EF] text-neutral-400 flex items-center justify-center mx-auto border border-ink/10">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold text-ink">Votre panier est vide</h2>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Ajoutez des téléphones ou accessoires à votre panier pour finaliser votre commande.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-ink text-brand rounded-xl text-xs font-semibold hover:bg-black cursor-pointer"
        >
          Découvrir les collections
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-porcelain min-h-screen text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Titre & Étapes 01, 02, 03, 04 */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-dark block mb-1">
              Finalisation de Commande
            </span>
            <h1 className="text-2xl sm:text-4xl font-semibold text-ink">
              Paiement Sécurisé
            </h1>
          </div>

          {/* Stepper Minimaliste 01, 02, 03, 04 */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-4 max-w-3xl">
            {[
              { step: 1, label: '01 Informations' },
              { step: 2, label: '02 Livraison' },
              { step: 3, label: '03 Paiement' },
              { step: 4, label: '04 Confirmation' },
            ].map((s) => {
              const isPassed = currentStep > s.step;
              const isCurrent = currentStep === s.step;
              return (
                <div
                  key={s.step}
                  onClick={() => {
                    if (s.step < currentStep) setCurrentStep(s.step as any);
                  }}
                  className={`p-3 rounded-xl border transition-all text-xs font-bold flex items-center gap-2 ${
                    isCurrent
                      ? 'bg-ink text-brand border-ink shadow-xs'
                      : isPassed
                      ? 'bg-white text-neutral-800 border-ink/10 cursor-pointer hover:border-brand'
                      : 'bg-[#F4F2EF] text-neutral-400 border-transparent'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold bg-brand/20 text-brand">
                    {isPassed ? '✓' : s.step}
                  </span>
                  <span className="truncate">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contenu Formulaire + Résumé de Commande */}
        <form onSubmit={handleNextStep} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Colonne Gauche : Formulaire de l'étape courante */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* ======================================================== */}
            {/* ÉTAPE 01 : INFORMATIONS CLIENT                           */}
            {/* Nom | Email | Téléphone                                 */}
            {/* ======================================================== */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl border border-ink/10 p-6 sm:p-8 space-y-5 shadow-xs animate-fadeIn">
                <div className="border-b border-ink/10 pb-3">
                  <h2 className="text-base font-semibold text-ink">
                    01. Informations Client
                  </h2>
                  <p className="text-xs text-neutral-500 font-light">
                    Vos coordonnées nécessaires à la confirmation et au suivi de votre commande.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Nom complet *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Ex: Amina Traoré"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">Adresse Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Ex: amina.traore@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">
                        Numéro Téléphone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ex: +237 6XX XX XX XX"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-ink hover:bg-black text-white font-bold text-xs rounded-xl tracking-wide transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continuer vers la livraison</span>
                    <ArrowRight className="w-4 h-4 text-brand" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* ÉTAPE 02 : LIVRAISON & ADRESSE                          */}
            {/* Pays | Ville | Adresse | Code postal | Méthode livraison*/}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <div className="bg-white rounded-3xl border border-ink/10 p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn">
                <div className="border-b border-ink/10 pb-3">
                  <h2 className="text-base font-semibold text-ink">
                    02. Adresse de Réception & Méthode de Livraison
                  </h2>
                  <p className="text-xs text-neutral-500 font-light">
                    Où souhaitez-vous que notre service de livraison dépose votre colis ?
                  </p>
                </div>

                {/* Adresse */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Pays *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                    >
                      <option value="Cameroun">Cameroun</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Ville *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Ex: Douala, Yaoundé, Bafoussam..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-neutral-700 block mb-1">
                      Adresse précise (Quartier, Rue, Résidence) *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Ex: Akwa, rue Joss, en face de la pharmacie"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Code Postal</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="Facultatif"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-ink/10 bg-porcelain focus:outline-none focus:border-brand"
                    />
                  </div>
                </div>

                {/* Méthode de livraison */}
                <div className="space-y-3 pt-2">
                  <p className="font-bold text-xs text-ink uppercase tracking-wider text-brand-dark">
                    Sélectionner la Méthode de Livraison
                  </p>

                  <div className="space-y-2 text-xs">
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        formData.shippingMethod === 'express'
                          ? 'border-brand bg-porcelain'
                          : 'border-ink/10 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={formData.shippingMethod === 'express'}
                        onChange={handleChange}
                        className="mt-0.5 text-brand focus:ring-brand"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-ink">
                            Livraison à domicile (Douala 24h · autres villes par agence)
                          </span>
                          <span className="font-mono font-bold text-brand">
                            {currentShippingFee === 0 ? 'Gratuite' : formatPrice(currentShippingFee)}
                          </span>
                        </div>
                        <p className="text-neutral-500 font-light mt-0.5">
                          Notre livreur vous remet le colis ; vous vérifiez avant de payer.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        formData.shippingMethod === 'pickup'
                          ? 'border-brand bg-porcelain'
                          : 'border-ink/10 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="pickup"
                        checked={formData.shippingMethod === 'pickup'}
                        onChange={handleChange}
                        className="mt-0.5 text-brand focus:ring-brand"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-ink">
                            Retrait en boutique SBS (Douala)
                          </span>
                          <span className="font-mono font-bold text-emerald-600">Gratuit</span>
                        </div>
                        <p className="text-neutral-500 font-light mt-0.5">
                          Disponible le jour même, avec pose du verre trempé offerte.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-ink cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Retour aux informations</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-ink hover:bg-black text-white font-bold text-xs rounded-xl tracking-wide transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continuer vers le paiement</span>
                    <ArrowRight className="w-4 h-4 text-brand" />
                  </button>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* ÉTAPE 03 : PAIEMENT                                      */}
            {/* Méthodes de paiement                                    */}
            {/* ======================================================== */}
            {currentStep === 3 && (
              <div className="bg-white rounded-3xl border border-ink/10 p-6 sm:p-8 space-y-6 shadow-xs animate-fadeIn">
                <div className="border-b border-ink/10 pb-3">
                  <h2 className="text-base font-semibold text-ink">
                    03. Choix du Mode de Paiement
                  </h2>
                  <p className="text-xs text-neutral-500 font-light">
                    Sélectionnez votre mode de règlement préféré. Toutes les transactions sont cryptées et certifiées.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Paiement à la livraison */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      formData.paymentMethod === 'cod'
                        ? 'border-brand bg-porcelain'
                        : 'border-ink/10 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="mt-1 text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-brand" />
                        <span className="font-bold text-xs sm:text-sm text-ink">
                          Paiement à la livraison (Espèces)
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-light mt-1">
                        Inspectez votre colis avec le coursier avant de régler en toute confiance.
                      </p>
                    </div>
                  </label>

                  {/* Orange Money */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      formData.paymentMethod === 'wave'
                        ? 'border-brand bg-porcelain'
                        : 'border-ink/10 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wave"
                      checked={formData.paymentMethod === 'wave'}
                      onChange={handleChange}
                      className="mt-1 text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-brand" />
                        <span className="font-bold text-xs sm:text-sm text-ink">
                          Orange Money
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-light mt-1">
                        Paiement via #150# ; vous recevez le numéro marchand après validation.
                      </p>
                    </div>
                  </label>

                  {/* Mobile Money Orange / MTN */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      formData.paymentMethod === 'mobile_money'
                        ? 'border-brand bg-porcelain'
                        : 'border-ink/10 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile_money"
                      checked={formData.paymentMethod === 'mobile_money'}
                      onChange={handleChange}
                      className="mt-1 text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-brand" />
                        <span className="font-bold text-xs sm:text-sm text-ink">
                          MTN Mobile Money
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-light mt-1">
                        Paiement via *126# ; vous recevez le numéro marchand après validation.
                      </p>
                    </div>
                  </label>

                  {/* Carte Bancaire */}
                  <label
                    className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                      formData.paymentMethod === 'card'
                        ? 'border-brand bg-porcelain'
                        : 'border-ink/10 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="mt-1 text-brand focus:ring-brand"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-brand" />
                        <span className="font-bold text-xs sm:text-sm text-ink">
                          Carte Bancaire (Visa / Mastercard)
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-light mt-1">
                        Chiffrement 3D Secure conforme aux standards bancaires internationaux.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-ink cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Retour à la livraison</span>
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-ink hover:bg-black text-white font-bold text-xs rounded-xl tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-brand" />
                    <span>Confirmer la commande ({formatPrice(finalTotal)})</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ======================================================== */}
          {/* COLONNE DROITE : RÉSUMÉ DE COMMANDE MINIMALISTE          */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-ink/10 p-6 space-y-5 shadow-xs sticky top-28">
            <div className="border-b border-ink/10 pb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-ink">Résumé de Commande</h2>
              <span className="text-xs text-neutral-400 font-mono">
                {cart.reduce((s, i) => s + i.quantity, 0)} articles
              </span>
            </div>

            {/* Liste compacte des articles */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.image_url || item.product.image}
                    alt=""
                    className="w-12 h-12 object-contain rounded-xl bg-[#F4F2EF] p-1 border border-ink/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink truncate">{item.product.name}</p>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      Qté: {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-ink">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Décomposition financière */}
            <div className="space-y-2 text-xs text-neutral-600 border-t border-ink/10 pt-4">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-mono tabular-nums text-ink">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison</span>
                <span className="font-mono tabular-nums text-ink">
                  {currentShippingFee === 0 ? 'Gratuite' : formatPrice(currentShippingFee)}
                </span>
              </div>
              <div className="pt-2.5 border-t border-ink/10 flex justify-between items-baseline text-sm font-bold text-ink">
                <span>Montant Net Total</span>
                <span className="text-lg font-mono font-extrabold text-ink">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-brand" />
              <span>Garantie Authenticité & Sécurité bancaire</span>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
