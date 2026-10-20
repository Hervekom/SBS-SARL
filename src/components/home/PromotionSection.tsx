import React from 'react';
import { useShop, useCatalog } from '../../context/ShopContext';

import { ProductCard } from '../products/ProductCard';
import { Tag, ArrowRight, Sparkles } from 'lucide-react';

export const PromotionSection: React.FC = () => {
  const { navigate } = useShop();
  const PRODUCTS = useCatalog();

  // Curate 4 items representing the exact requested badges:
  // "Nouveau", "Best Seller", "-20%", "-30%"
  const promoItems = ['prod-galaxy-s24-ultra', 'prod-smartwatch-ultra', 'prod-powerbank-20000', 'prod-coque-magsafe']
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="py-16 sm:py-24 bg-[#111111] text-[#FFFFFF] border-t border-[#222222] text-left relative overflow-hidden">
      {/* Subtle gold atmospheric light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F26B1D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F26B1D]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
        
        {/* En-tête : "Les offres du moment" */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-[#2A2A2A] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#D4A017]">
              <Tag className="w-3.5 h-3.5" />
              <span>Bons plans SBS</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Les offres du moment
            </h2>
            
            <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl">
              Des remises réelles sur les téléphones et accessoires les plus demandés, dans la limite des stocks disponibles.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-[#1C1C1C] border border-[#333333] px-3.5 py-2 rounded-2xl flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#F26B1D]" />
              <span className="text-xs text-neutral-300 font-medium">
                Code : <strong className="font-mono text-[#D4A017]">SBS10</strong> (-10% sur votre commande)
              </span>
            </div>

            <button
              onClick={() => navigate('/promotions')}
              className="px-4 py-2.5 rounded-2xl bg-[#F26B1D] hover:bg-[#C2410C] text-[#111111] font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Tout voir</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Grille des 4 offres avec badges élégants noir + or */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {promoItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              className="border-[#2D2D2D] hover:border-[#F26B1D]/90 shadow-md"
            />
          ))}
        </div>

      </div>
    </section>
  );
};
