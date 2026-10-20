import React, { useRef } from 'react';
import { useShop, useCatalog } from '../../context/ShopContext';

import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Award,
} from 'lucide-react';

export const BestSellerSection: React.FC = () => {
  const { formatPrice, addToCart, navigate } = useShop();
  const PRODUCTS = useCatalog();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Best sellers items
  const bestSellers = PRODUCTS.filter((p) => p.is_popular || p.isBestSeller || p.rating >= 4.8);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FFFFFF] border-t border-[#EAEAEA] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* En-tête : "Les plus populaires" */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAEAEA] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#C2410C]">
              <Award className="w-3.5 h-3.5" />
              <span>Les mieux notés</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111111]">
              Les plus populaires
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-light">
              Les références qui obtiennent les meilleures notes de nos clients.
            </p>
          </div>

          {/* Contrôles du Carousel Horizontal */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border border-[#EAEAEA] hover:border-[#F26B1D] bg-white text-[#111111] hover:text-[#F26B1D] flex items-center justify-center transition-all shadow-xs cursor-pointer"
              aria-label="Défiler vers la gauche"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border border-[#EAEAEA] hover:border-[#F26B1D] bg-white text-[#111111] hover:text-[#F26B1D] flex items-center justify-center transition-all shadow-xs cursor-pointer"
              aria-label="Défiler vers la droite"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Horizontal avec défilement fluide */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-none snap-x snap-mandatory"
        >
          {bestSellers.map((product) => {
            const cat = product.category_id || product.category;
            const isTechOrAppliance = false && Boolean(cat);

            return (
              <div
                key={product.id}
                onClick={() => navigate(`/produit/${product.slug}`)}
                className="w-64 sm:w-72 shrink-0 snap-start bg-white rounded-2xl border border-[#EAEAEA] hover:border-[#F26B1D]/70 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between cursor-pointer group"
              >
                {/* 1. Image */}
                <div className="relative aspect-square w-full rounded-xl bg-[#F6F6F6]/80 overflow-hidden mb-3.5 flex items-center justify-center">
                  <img
                    src={product.image_url || product.image}
                    alt={product.name}
                    className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                      isTechOrAppliance ? 'object-contain p-2' : 'object-cover'
                    }`}
                    loading="lazy"
                  />

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#111111] text-[#F26B1D] rounded-md shadow-xs">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* 2. Détails Produit */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Note et nombre d'avis */}
                    <div className="flex items-center gap-1.5 text-xs text-neutral-600 mb-1">
                      <div className="flex text-[#D4A017]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < Math.floor(product.rating || 5)
                                ? 'fill-[#F26B1D]'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-mono font-bold text-[#111111] text-[11px]">
                        {(product.rating || 5).toFixed(1)}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        ({product.review_count || product.reviewCount || 30} avis)
                      </span>
                    </div>

                    {/* Nom */}
                    <h3 className="text-xs sm:text-sm font-bold text-[#111111] line-clamp-2 leading-snug group-hover:text-[#C2410C] transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  {/* 3. Prix & Bouton Panier */}
                  <div className="pt-3 mt-2 border-t border-[#F3F3F3] flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs sm:text-sm font-extrabold text-[#111111] font-mono tabular-nums block truncate">
                        {formatPrice(product.price)}
                      </span>
                      {(product.original_price || product.originalPrice) && (
                        <span className="text-[10px] text-neutral-400 line-through font-mono tabular-nums block">
                          {formatPrice(product.original_price || product.originalPrice!)}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="w-8 h-8 rounded-xl bg-[#111111] group-hover:bg-[#F26B1D] text-[#FFFFFF] group-hover:text-[#111111] flex items-center justify-center transition-colors shadow-xs shrink-0 cursor-pointer"
                      title="Ajouter au panier"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
