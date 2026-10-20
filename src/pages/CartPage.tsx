import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    formatPrice,
    navigate,
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMsg, setPromoMsg] = useState<{ text: string; error?: boolean } | null>(null);

  const discountAmount = (cartTotal * discountPercent) / 100;
  const shippingFee = cartTotal >= 50000 || cartTotal === 0 ? 0 : 2000;
  const finalTotal = cartTotal - discountAmount + shippingFee;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SBS10') {
      setDiscountPercent(10);
      setPromoMsg({ text: 'Code SBS10 appliqué : -10% de réduction !' });
    } else {
      setPromoMsg({ text: 'Code promotionnel invalide ou expiré.', error: true });
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-[#FFFFFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C2410C] block mb-1">
            Votre Commande
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            Panier d'Achats ({cartCount} {cartCount > 1 ? 'articles' : 'article'})
          </h1>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Items */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#EAEAEA] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#EAEAEA] pb-4">
                <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
                  Articles Sélectionnés
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-neutral-400 hover:text-red-500 transition-colors"
                >
                  Vider le panier
                </button>
              </div>

              <div className="divide-y divide-[#EAEAEA]">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-4 flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-2xl bg-[#F6F6F6] border border-[#EAEAEA] shrink-0"
                    />

                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C2410C]">
                        {item.product.subCategory}
                      </span>
                      <h3
                        onClick={() => navigate(`/produit/${item.product.slug}`)}
                        className="text-sm font-bold text-[#111111] cursor-pointer hover:text-[#C2410C] transition-colors"
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-neutral-500 font-mono mt-1">
                        Prix unitaire : {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center border border-[#EAEAEA] rounded-xl bg-[#F6F6F6] px-2 py-1">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-xs font-bold hover:text-[#F26B1D]"
                      >
                        -
                      </button>
                      <span className="px-3 text-xs font-mono font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 text-xs font-bold hover:text-[#F26B1D]"
                      >
                        +
                      </button>
                    </div>

                    {/* Total item price */}
                    <div className="text-right sm:w-28">
                      <span className="text-sm font-bold text-[#111111] font-mono tabular-nums block">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[11px] text-neutral-400 hover:text-red-500 transition-colors mt-1"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-[#EAEAEA] p-6 space-y-6 shadow-xs sticky top-28">
              <h2 className="text-base font-bold text-[#111111] border-b border-[#EAEAEA] pb-3">
                Récapitulatif de la Commande
              </h2>

              {/* Promo Form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Code (ex: SBS10)"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-[#F6F6F6] border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#F26B1D] uppercase font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#111111] text-[#F26B1D] text-xs font-bold rounded-xl hover:bg-[#222222] transition-colors"
                  >
                    Valider
                  </button>
                </div>
                {promoMsg && (
                  <p
                    className={`text-[11px] ${
                      promoMsg.error ? 'text-red-500' : 'text-emerald-600 font-semibold'
                    }`}
                  >
                    {promoMsg.text}
                  </p>
                )}
              </form>

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs text-neutral-600 border-b border-[#EAEAEA] pb-4">
                <div className="flex justify-between">
                  <span>Sous-total articles</span>
                  <span className="font-mono tabular-nums text-[#111111]">{formatPrice(cartTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Remise ({discountPercent}%)</span>
                    <span className="font-mono tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frais de livraison</span>
                  <span className="font-mono tabular-nums text-[#111111]">
                    {shippingFee === 0 ? 'Gratuite' : formatPrice(shippingFee)}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-[#111111]">Montant Total</span>
                <span className="text-xl font-extrabold text-[#111111] font-mono tabular-nums">
                  {formatPrice(finalTotal)}
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-[#111111] hover:bg-[#222222] text-[#FFFFFF] font-bold text-sm rounded-xl tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Passer au paiement</span>
                <ArrowRight className="w-4 h-4 text-[#F26B1D] group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 text-[11px] text-neutral-500 justify-center">
                <ShieldCheck className="w-4 h-4 text-[#F26B1D]" />
                <span>Paiement 100% sécurisé & garanti</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#EAEAEA] p-16 text-center space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-20 h-20 rounded-full bg-[#F6F6F6] text-neutral-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-[#111111]">Votre panier est actuellement vide</h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              Parcourez nos téléphones, protections, montres et accessoires pour composer votre commande.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#111111] text-[#F26B1D] text-xs font-bold rounded-xl hover:bg-[#222222] transition-colors"
            >
              Découvrir les collections
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
