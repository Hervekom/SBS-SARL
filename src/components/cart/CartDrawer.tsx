import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    removeFromCart,
    updateCartQuantity,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    formatPrice,
    navigate,
  } = useShop();

  const { promoCode, discountPercent, discountAmount, applyPromo } = useShop();
  const [promoInput, setPromoInput] = useState(promoCode);
  const [promoMsg, setPromoMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartDrawerOpen) return null;

  // Livraison gratuite à Douala dès 50 000 FCFA
  const FREE_SHIPPING_THRESHOLD = 50000;
  const progressToFreeShipping = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountLeftForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);

  const finalTotal = cartTotal - discountAmount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (applyPromo(promoInput)) {
      setPromoMsg({ text: `Code ${promoInput.trim().toUpperCase()} appliqué : réduction ajoutée à votre commande.` });
    } else {
      setPromoMsg({ text: 'Code invalide ou expiré', error: true });
    }
  };

  const handleGoToCheckout = () => {
    setIsCartDrawerOpen(false);
    navigate('/checkout');
  };

  const handleGoToCartPage = () => {
    setIsCartDrawerOpen(false);
    navigate('/panier');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 w-[min(100%,28rem)] flex">
        <div className="w-full bg-porcelain shadow-2xl flex flex-col justify-between border-l border-ink/10 animate-slideInRight">
          {/* Header */}
          <div className="p-5 border-b border-ink/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand" />
              <h2 className="text-base font-semibold text-ink">
                Votre Panier <span className="text-sm text-neutral-500">({cartCount})</span>
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-lg text-neutral-500 hover:text-ink hover:bg-[#F4F2EF] transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#F4F2EF] px-5 py-3 border-b border-ink/10 text-xs">
            {amountLeftForFreeShipping > 0 ? (
              <p className="text-neutral-700 mb-1.5">
                Ajoutez encore <strong className="text-brand-dark">{formatPrice(amountLeftForFreeShipping)}</strong> pour bénéficier de la <strong className="font-semibold text-ink">Livraison Offerte</strong> !
              </p>
            ) : (
              <p className="text-emerald-700 font-semibold flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand" />
                Félicitations ! Vous bénéficiez de la livraison offerte.
              </p>
            )}
            <div className="w-full bg-ink/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-brand h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white p-3.5 rounded-2xl border border-ink/10 flex gap-3.5 items-center relative group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 object-cover rounded-xl bg-[#F4F2EF] shrink-0 border border-ink/10"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-ink line-clamp-1 leading-snug">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-brand-dark font-medium mt-0.5">
                      {item.selectedVariant || item.product.subCategory}
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-ink/10 rounded-lg bg-[#F4F2EF] px-1 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:text-brand transition-colors"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-ink">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:text-brand transition-colors"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-ink tabular-nums whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Item */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-neutral-400 hover:text-red-500 p-1 self-start transition-colors"
                    title="Supprimer du panier"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#F4F2EF] text-neutral-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-ink">Votre panier est vide</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Découvrez nos trois départements prestigieux et ajoutez vos articles favoris.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/');
                  }}
                  className="px-5 py-2.5 bg-ink text-brand rounded-xl text-xs font-semibold hover:bg-black transition-colors"
                >
                  Commencer mon shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer with Subtotal & Actions */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-ink/10 space-y-3.5">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Code promo (ex: SBS10)"
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F4F2EF] border border-ink/10 rounded-lg focus:outline-none focus:border-brand uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-ink hover:bg-black text-brand font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Appliquer
                </button>
              </form>

              {promoMsg && (
                <p
                  className={`text-[11px] ${
                    promoMsg.error ? 'text-red-500' : 'text-emerald-600 font-semibold'
                  }`}
                >
                  {promoMsg.text}
                </p>
              )}

              {/* Subtotal Breakdowns */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Sous-total</span>
                  <span className="tabular-nums">{formatPrice(cartTotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Remise ({discountPercent}%)</span>
                    <span className="tabular-nums">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Livraison</span>
                  <span>{amountLeftForFreeShipping === 0 ? 'Offerte à Douala' : 'Selon la zone'}</span>
                </div>
                <div className="pt-2 border-t border-ink/10 flex justify-between text-sm font-bold text-ink">
                  <span>Total estimé</span>
                  <span className="text-base text-ink tabular-nums">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleGoToCheckout}
                  className="w-full py-3.5 bg-ink hover:bg-black text-white font-bold text-sm rounded-xl tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Passer la commande</span>
                  <ArrowRight className="w-4 h-4 text-brand group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full py-2.5 text-xs font-semibold text-neutral-600 hover:text-ink transition-colors text-center cursor-pointer"
                >
                  Continuer mes achats
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
