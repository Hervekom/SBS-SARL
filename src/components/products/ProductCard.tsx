import React from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const {
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
    setQuickViewProduct,
  } = useShop();

  const isFavorited = isInWishlist(product.id);

  // Category identifier
  const cat = product.category_id || product.category;
  const isTechOrAppliance = false && Boolean(cat);

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    navigate(`/produit/${product.slug}`);
  };

  const shortDesc =
    product.short_description ||
    product.description?.slice(0, 75) + '...' ||
    '';

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl border border-ink/10 hover:border-ink/20 overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_-12px_rgba(23,18,14,0.18)] flex flex-col justify-between cursor-pointer ${className}`}
    >
      {/* ======================================================== */}
      {/* ZONE IMAGE (Grande, Minimaliste, object-contain si tech) */}
      {/* ======================================================== */}
      <div className="relative aspect-square w-full bg-[#F4F2EF] overflow-hidden flex items-center justify-center">
        <img
          src={product.image_url || product.image}
          alt={product.name}
          className={`w-full h-full transition-transform duration-500 ease-out group-hover:scale-105 ${
            isTechOrAppliance ? 'object-contain p-2' : 'object-cover'
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Badge promotion / nouveauté */}
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold tracking-wide px-2.5 py-1 bg-brand text-white rounded-full z-10">
            {product.badge}
          </span>
        )}

        {/* Bouton Wishlist / Coup de cœur */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer active:scale-90 ${
            isFavorited
              ? 'bg-white text-brand shadow-sm'
              : 'bg-white/85 hover:bg-white text-neutral-600 hover:text-ink shadow-xs'
          }`}
          title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-label="Ajouter aux favoris"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ${
              isFavorited
                ? 'fill-brand text-brand scale-110'
                : 'text-neutral-600 fill-none'
            }`}
          />
        </button>

        {/* Bouton Aperçu Rapide (Apparaît au hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-white/95 hover:bg-ink hover:text-white text-ink text-[11px] font-semibold px-3 py-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap z-10 cursor-pointer"
          title="Aperçu rapide"
        >
          <Eye className="w-3.5 h-3.5 text-brand" />
          <span className="hidden sm:inline">Aperçu rapide</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* INFORMATIONS PRODUIT                                     */}
      {/* ======================================================== */}
      <div className="p-3.5 sm:p-4 space-y-1.5 flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Catégorie & Note */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 mb-1">
            <span className="font-medium text-brand-dark">
              {product.sub_category || product.subCategory}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-gold fill-gold" />
              <span className="tabular-nums text-ink/70 font-medium text-[11px]">
                {product.rating?.toFixed(1) || '4.9'}
              </span>
            </div>
          </div>

          {/* Nom du Produit */}
          <h3 className="text-sm font-semibold text-ink line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Description Courte */}
          {shortDesc && (
            <p className="text-xs text-ink/55 line-clamp-2 mt-1 leading-relaxed">
              {shortDesc}
            </p>
          )}
        </div>

        {/* ======================================================== */}
        {/* PRIX (FCFA) & BOUTON PANIER                               */}
        {/* ======================================================== */}
        <div className="pt-3 mt-2 flex items-end justify-between gap-2">
          <div className="min-w-0">
            {/* Prix actuel */}
            <span className="text-sm sm:text-base font-bold text-ink tabular-nums block truncate">
              {formatPrice(product.price)}
            </span>
            
            {/* Ancien prix si promotion */}
            {(product.original_price || product.originalPrice) && (
              <span className="text-[11px] sm:text-xs text-ink/40 line-through tabular-nums block">
                {formatPrice(product.original_price || product.originalPrice!)}
              </span>
            )}
          </div>

          {/* Bouton Panier (Devient plus visible et doré au hover) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, 1);
            }}
            className="w-9 h-9 rounded-full bg-ink hover:bg-brand text-white flex items-center justify-center transition-colors duration-200 cursor-pointer shrink-0"
            title="Ajouter au panier"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:scale-110" />
          </button>
        </div>
      </div>
    </div>
  );
};
