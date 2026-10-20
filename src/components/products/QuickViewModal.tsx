import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Star, ShoppingBag, Heart, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!quickViewProduct) return null;

  const isFavorited = isInWishlist(quickViewProduct.id);

  const handleAdd = () => {
    addToCart(quickViewProduct, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleViewFullDetails = () => {
    const slug = quickViewProduct.slug;
    setQuickViewProduct(null);
    navigate(`/produit/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          onClick={() => setQuickViewProduct(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="relative inline-block w-full max-w-3xl overflow-hidden text-left align-middle transition-all transform bg-porcelain shadow-2xl rounded-3xl border border-ink/10 z-10 p-6 sm:p-8">
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-ink hover:bg-[#F4F2EF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Image Frame */}
            <div className="aspect-4/3 rounded-2xl overflow-hidden bg-[#F4F2EF] border border-ink/10 flex items-center justify-center">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-brand-dark">
                  {quickViewProduct.subCategory}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-ink mt-1 leading-snug">
                  {quickViewProduct.name}
                </h3>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(quickViewProduct.rating) ? 'fill-brand' : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-mono tabular-nums text-neutral-700 font-semibold">
                  {quickViewProduct.rating.toFixed(1)}
                </span>
                <span className="text-xs text-neutral-400">({quickViewProduct.reviewCount} avis)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-ink font-mono tabular-nums">
                  {formatPrice(quickViewProduct.price)}
                </span>
                {quickViewProduct.originalPrice && (
                  <span className="text-sm text-neutral-400 line-through font-mono tabular-nums">
                    {formatPrice(quickViewProduct.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-600 font-light leading-relaxed line-clamp-3">
                {quickViewProduct.description}
              </p>

              {/* Quantity and Actions */}
              <div className="pt-3 border-t border-ink/10 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-ink/10 rounded-xl bg-white px-2 py-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 py-1 text-xs font-bold hover:text-brand"
                    >
                      -
                    </button>
                    <span className="px-3 text-xs font-mono font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2 py-1 text-xs font-bold hover:text-brand"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    className="flex-1 py-3 bg-ink hover:bg-black text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Ajouté au panier !</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-brand" />
                        <span>Ajouter au panier</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleWishlist(quickViewProduct.id)}
                    className={`p-3 rounded-xl border border-ink/10 transition-colors ${
                      isFavorited ? 'bg-ink text-brand' : 'bg-white text-neutral-700'
                    }`}
                    title="Ajouter aux favoris"
                  >
                    <Heart
                      className={`w-4 h-4 transition-all duration-300 ${
                        isFavorited
                          ? 'fill-brand text-brand scale-110'
                          : 'text-neutral-600 fill-none'
                      }`}
                    />
                  </button>
                </div>

                <button
                  onClick={handleViewFullDetails}
                  className="w-full text-center text-xs font-semibold text-ink hover:text-brand-dark flex items-center justify-center gap-1.5 pt-1"
                >
                  <span>Consulter la fiche technique complète</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
