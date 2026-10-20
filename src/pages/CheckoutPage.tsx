import React, { useMemo, useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Order } from '../types';
import { SHIPPING_ZONES, SHOP, shippingFeeFor, whatsappLink } from '../data/products';
import { submitOrder, isSupabaseConfigured } from '../lib/supabase';
import { ArrowLeft, Check, CheckCircle2, MessageCircle, ShoppingBag, Tag, X, Loader2 } from 'lucide-react';

type Payment = 'cod' | 'orange' | 'mtn';

const PAYMENTS: { id: Payment; label: string; detail: string }[] = [
  { id: 'cod', label: 'Espèces à la livraison', detail: 'Vous vérifiez le produit, puis vous payez le livreur.' },
  { id: 'orange', label: 'Orange Money', detail: 'Le numéro marchand vous est envoyé sur WhatsApp après validation.' },
  { id: 'mtn', label: 'MTN Mobile Money', detail: 'Le numéro marchand vous est envoyé sur WhatsApp après validation.' },
];

const PAYMENT_LABEL: Record<Payment, string> = {
  cod: 'Espèces à la livraison',
  orange: 'Orange Money',
  mtn: 'MTN Mobile Money',
};

/** Message WhatsApp récapitulatif envoyé à SBS. */
const buildWhatsappMessage = (o: Order, fmt: (n: number) => string) => {
  const lines = o.items.map(
    (i) => `• ${i.quantity} × ${i.product.name}${i.selectedVariant ? ` (${i.selectedVariant})` : ''} — ${fmt(i.product.price * i.quantity)}`
  );
  return [
    `Bonjour SBS SARL, voici ma commande ${o.orderId} :`,
    '',
    ...lines,
    '',
    `Sous-total : ${fmt(o.subtotal ?? 0)}`,
    o.discountAmount ? `Remise (${o.promoCode}) : -${fmt(o.discountAmount)}` : '',
    `Livraison : ${o.shippingFee ? fmt(o.shippingFee) : 'offerte'}`,
    `TOTAL : ${fmt(o.totalAmount)}`,
    '',
    `Nom : ${o.customerName}`,
    `Téléphone : ${o.phone}`,
    `Livraison : ${o.shippingMethod}`,
    `Adresse : ${o.address}, ${o.city}`,
    `Paiement : ${o.paymentMethod}`,
  ]
    .filter((l, idx, arr) => !(l === '' && arr[idx - 1] === ''))
    .join('\n');
};

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-ink/15 bg-white text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-ink/35';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    clearCart,
    formatPrice,
    navigate,
    addOrder,
    promoCode,
    discountPercent,
    discountAmount,
    applyPromo,
    clearPromo,
  } = useShop();

  const [form, setForm] = useState({ fullName: '', phone: '', email: '', city: 'Douala', address: '', note: '' });
  const [zoneId, setZoneId] = useState('douala-centre');
  const [payment, setPayment] = useState<Payment>('cod');
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<{ order: Order; saved: boolean } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const zone = SHIPPING_ZONES.find((z) => z.id === zoneId) ?? SHIPPING_ZONES[0];
  const subtotal = cartTotal;
  const shippingFee = shippingFeeFor(zoneId, subtotal - discountAmount);
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const cashAllowed = zone.cashOnDelivery;
  const effectivePayment: Payment = !cashAllowed && payment === 'cod' ? 'orange' : payment;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.fullName.trim().length < 2) e.fullName = 'Indiquez votre nom.';
    if (form.phone.replace(/\D/g, '').length < 8) e.phone = 'Numéro de téléphone invalide.';
    if (zoneId !== 'retrait' && form.address.trim().length < 3) e.address = 'Indiquez votre quartier / repère.';
    if (zoneId === 'autres-villes' && form.city.trim().length < 2) e.city = 'Indiquez votre ville.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromo(promoInput)) {
      setPromoError('');
      setPromoInput('');
    } else setPromoError('Code invalide ou expiré.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);
    const order: Order = {
      orderId: 'SBS-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('fr-FR'),
      customerName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      country: 'Cameroun',
      city: zoneId === 'autres-villes' ? form.city.trim() : 'Douala',
      address: zoneId === 'retrait' ? 'Retrait en boutique – Akwa' : form.address.trim() + (form.note ? ` (${form.note.trim()})` : ''),
      postalCode: '',
      shippingMethod: `${zone.label} – ${zone.delay}`,
      paymentMethod: PAYMENT_LABEL[effectivePayment],
      items: [...cart],
      subtotal,
      discountAmount,
      promoCode: promoCode || undefined,
      shippingFee,
      totalAmount: total,
      status: 'En préparation',
    };
    const saved = await submitOrder(order);
    addOrder(order);
    clearCart();
    clearPromo();
    setConfirmed({ order, saved });
    setSubmitting(false);
    window.scrollTo({ top: 0 });
  };

  const waText = useMemo(() => (confirmed ? buildWhatsappMessage(confirmed.order, formatPrice) : ''), [confirmed, formatPrice]);

  // ------------------------------------------------------------- confirmation
  if (confirmed) {
    const o = confirmed.order;
    return (
      <div className="bg-porcelain min-h-screen py-10 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-ink/10 p-6 sm:p-10">
            <div className="w-12 h-12 rounded-full bg-[#E8F5EF] text-[#1F7A5C] flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h1 className="mt-5 text-3xl sm:text-4xl leading-tight">Merci {o.customerName.split(' ')[0]} !</h1>
            <p className="mt-2 text-ink/65">
              Votre commande <strong className="text-ink">{o.orderId}</strong> est enregistrée. Dernière étape :
              envoyez-la à SBS sur WhatsApp pour confirmer la livraison.
            </p>

            <a
              href={whatsappLink(waText)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold py-4 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Envoyer ma commande à SBS sur WhatsApp
            </a>
            <p className="mt-2 text-xs text-center text-ink/50">Le message est déjà rédigé, il suffit d’appuyer sur « Envoyer ».</p>

            <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10 text-sm">
              {o.items.map((i) => (
                <div key={i.product.id} className="py-3 flex justify-between gap-4">
                  <span className="text-ink/75">
                    {i.quantity} × {i.product.name}
                    {i.selectedVariant && <span className="text-ink/45"> · {i.selectedVariant}</span>}
                  </span>
                  <span className="font-semibold tabular-nums shrink-0">{formatPrice(i.product.price * i.quantity)}</span>
                </div>
              ))}
              {!!o.discountAmount && (
                <div className="py-3 flex justify-between text-[#1F7A5C]">
                  <span>Remise {o.promoCode}</span>
                  <span className="tabular-nums">-{formatPrice(o.discountAmount)}</span>
                </div>
              )}
              <div className="py-3 flex justify-between">
                <span className="text-ink/75">Livraison</span>
                <span className="tabular-nums">{o.shippingFee ? formatPrice(o.shippingFee) : 'Offerte'}</span>
              </div>
              <div className="py-3 flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="tabular-nums">{formatPrice(o.totalAmount)}</span>
              </div>
            </div>

            <dl className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-ink/50">Livraison</dt>
                <dd className="font-medium">{o.shippingMethod}</dd>
                <dd className="text-ink/65">{o.address}</dd>
              </div>
              <div>
                <dt className="text-ink/50">Paiement</dt>
                <dd className="font-medium">{o.paymentMethod}</dd>
                <dd className="text-ink/65">{o.phone}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              {confirmed.saved && (
                <button
                  onClick={() => navigate(`/suivi?commande=${o.orderId}`)}
                  className="flex-1 rounded-full border border-ink/15 hover:border-ink/40 py-3 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Suivre ma commande
                </button>
              )}
              <button
                onClick={() => navigate('/')}
                className="flex-1 rounded-full bg-ink hover:bg-black text-white py-3 text-sm font-semibold transition-colors cursor-pointer"
              >
                Continuer mes achats
              </button>
            </div>
            {!confirmed.saved && isSupabaseConfigured && (
              <p className="mt-4 text-xs text-ink/50">
                La commande n’a pas pu être enregistrée en ligne : l’envoi WhatsApp ci-dessus suffit pour la valider.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------- panier vide
  if (cart.length === 0) {
    return (
      <div className="bg-porcelain min-h-[60vh] py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <ShoppingBag className="w-10 h-10 mx-auto text-ink/30" />
          <h1 className="mt-4 text-3xl">Votre panier est vide</h1>
          <p className="mt-2 text-ink/60">Ajoutez un téléphone ou un accessoire pour passer commande.</p>
          <button
            onClick={() => navigate('/smartphones')}
            className="mt-6 rounded-full bg-brand hover:bg-brand-hover text-white px-6 py-3 text-sm font-semibold cursor-pointer"
          >
            Voir les téléphones
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------- formulaire
  return (
    <div className="bg-porcelain min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate('/panier')} className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Retour au panier
        </button>
        <h1 className="mt-3 text-3xl sm:text-4xl">Finaliser ma commande</h1>
        <p className="mt-1 text-ink/60">Aucun paiement en ligne : vous réglez à la livraison ou par Mobile Money.</p>

        <form onSubmit={handleSubmit} className="mt-8 grid lg:grid-cols-[1fr_380px] gap-8 items-start" noValidate>
          <div className="space-y-6">
            {/* Coordonnées */}
            <fieldset className="bg-white rounded-2xl border border-ink/10 p-5 sm:p-6">
              <legend className="font-display text-xl font-semibold px-1">1. Vos coordonnées</legend>
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">Nom complet *</span>
                  <input className={`${inputCls} mt-1.5`} value={form.fullName} onChange={set('fullName')} autoComplete="name" placeholder="Ex : Paul Ndjock" />
                  {errors.fullName && <span className="text-xs text-red-600">{errors.fullName}</span>}
                </label>
                <label className="block">
                  <span className="text-sm font-medium">Téléphone / WhatsApp *</span>
                  <input className={`${inputCls} mt-1.5`} value={form.phone} onChange={set('phone')} type="tel" autoComplete="tel" placeholder="Ex : 6 71 70 84 75" />
                  {errors.phone && <span className="text-xs text-red-600">{errors.phone}</span>}
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium">E-mail <span className="text-ink/45 font-normal">(facultatif)</span></span>
                  <input className={`${inputCls} mt-1.5`} value={form.email} onChange={set('email')} type="email" autoComplete="email" placeholder="vous@exemple.com" />
                </label>
              </div>
            </fieldset>

            {/* Livraison */}
            <fieldset className="bg-white rounded-2xl border border-ink/10 p-5 sm:p-6">
              <legend className="font-display text-xl font-semibold px-1">2. Livraison</legend>
              <div className="mt-4 grid gap-2.5">
                {SHIPPING_ZONES.map((z) => {
                  const fee = shippingFeeFor(z.id, subtotal - discountAmount);
                  const active = z.id === zoneId;
                  return (
                    <label
                      key={z.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        active ? 'border-brand bg-blush/60' : 'border-ink/10 hover:border-ink/25'
                      }`}
                    >
                      <input type="radio" name="zone" checked={active} onChange={() => setZoneId(z.id)} className="mt-1 accent-[#F26B1D]" />
                      <span className="flex-1">
                        <span className="flex justify-between gap-3">
                          <span className="text-sm font-semibold">{z.label}</span>
                          <span className="text-sm font-semibold tabular-nums shrink-0">{fee === 0 ? 'Gratuit' : formatPrice(fee)}</span>
                        </span>
                        <span className="block text-xs text-ink/55 mt-0.5">
                          {z.delay} · {z.detail}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>

              {zoneId !== 'retrait' && (
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  {zoneId === 'autres-villes' && (
                    <label className="block">
                      <span className="text-sm font-medium">Ville *</span>
                      <input className={`${inputCls} mt-1.5`} value={form.city === 'Douala' ? '' : form.city} onChange={set('city')} placeholder="Ex : Yaoundé" />
                      {errors.city && <span className="text-xs text-red-600">{errors.city}</span>}
                    </label>
                  )}
                  <label className={`block ${zoneId === 'autres-villes' ? '' : 'sm:col-span-2'}`}>
                    <span className="text-sm font-medium">{zoneId === 'autres-villes' ? 'Agence de voyage souhaitée *' : 'Quartier et point de repère *'}</span>
                    <input
                      className={`${inputCls} mt-1.5`}
                      value={form.address}
                      onChange={set('address')}
                      placeholder={zoneId === 'autres-villes' ? 'Ex : Général Express, Mvan' : 'Ex : Akwa, rue Joss, face pharmacie du Centre'}
                    />
                    {errors.address && <span className="text-xs text-red-600">{errors.address}</span>}
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-medium">Précisions <span className="text-ink/45 font-normal">(facultatif)</span></span>
                    <textarea className={`${inputCls} mt-1.5`} rows={2} value={form.note} onChange={set('note')} placeholder="Heure de passage, couleur souhaitée…" />
                  </label>
                </div>
              )}
            </fieldset>

            {/* Paiement */}
            <fieldset className="bg-white rounded-2xl border border-ink/10 p-5 sm:p-6">
              <legend className="font-display text-xl font-semibold px-1">3. Paiement</legend>
              <div className="mt-4 grid gap-2.5">
                {PAYMENTS.map((p) => {
                  const disabled = p.id === 'cod' && !cashAllowed;
                  const active = effectivePayment === p.id;
                  return (
                    <label
                      key={p.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                        disabled ? 'opacity-45 cursor-not-allowed border-ink/10' : 'cursor-pointer'
                      } ${active ? 'border-brand bg-blush/60' : 'border-ink/10 hover:border-ink/25'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        disabled={disabled}
                        checked={active}
                        onChange={() => setPayment(p.id)}
                        className="mt-1 accent-[#F26B1D]"
                      />
                      <span>
                        <span className="block text-sm font-semibold">{p.label}</span>
                        <span className="block text-xs text-ink/55 mt-0.5">
                          {disabled ? 'Non disponible pour une expédition hors de Douala.' : p.detail}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {/* Récapitulatif */}
          <aside className="bg-white rounded-2xl border border-ink/10 p-5 sm:p-6 lg:sticky lg:top-28">
            <h2 className="text-xl">Récapitulatif</h2>
            <ul className="mt-4 divide-y divide-ink/10 max-h-72 overflow-y-auto">
              {cart.map((i) => (
                <li key={i.product.id} className="py-3 flex gap-3">
                  <img src={i.product.image} alt="" className="w-14 h-14 rounded-xl object-cover bg-[#F4F2EF] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium line-clamp-2">{i.product.name}</p>
                    <p className="text-xs text-ink/50">
                      Qté {i.quantity}
                      {i.selectedVariant && ` · ${i.selectedVariant}`}
                    </p>
                  </div>
                  <span className="text-sm font-semibold tabular-nums shrink-0">{formatPrice(i.product.price * i.quantity)}</span>
                </li>
              ))}
            </ul>

            {promoCode ? (
              <div className="mt-4 flex items-center justify-between rounded-xl bg-[#E8F5EF] text-[#1F7A5C] px-3 py-2.5 text-sm">
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <Tag className="w-4 h-4" /> {promoCode} (-{discountPercent} %)
                </span>
                <button type="button" onClick={clearPromo} className="p-1 hover:bg-white/50 rounded-full cursor-pointer" aria-label="Retirer le code">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    className="flex-1 min-w-0 px-3 py-2.5 rounded-xl border border-ink/15 text-sm uppercase focus:outline-none focus:border-brand"
                    placeholder="Code promo"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handlePromo(e);
                    }}
                  />
                  <button type="button" onClick={handlePromo} className="px-4 rounded-xl bg-ink text-white text-sm font-semibold cursor-pointer">
                    Appliquer
                  </button>
                </div>
                {promoError && <p className="mt-1 text-xs text-red-600">{promoError}</p>}
              </div>
            )}

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/65">Sous-total</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#1F7A5C]">
                  <dt>Remise</dt>
                  <dd className="tabular-nums">-{formatPrice(discountAmount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/65">Livraison</dt>
                <dd className="tabular-nums">{shippingFee === 0 ? 'Gratuite' : formatPrice(shippingFee)}</dd>
              </div>
              <div className="flex justify-between pt-3 border-t border-ink/10 text-base font-bold">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatPrice(total)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full rounded-full bg-brand hover:bg-brand-hover disabled:opacity-60 text-white font-semibold py-3.5 transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Valider ma commande
            </button>
            <p className="mt-3 text-xs text-ink/50 text-center">
              Vous recevrez ensuite le récapitulatif à envoyer à SBS sur WhatsApp ({SHOP.phoneDisplay}).
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
};
