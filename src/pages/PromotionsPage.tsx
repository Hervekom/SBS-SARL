import React from 'react';

import { ProductGrid } from '../components/products/ProductGrid';
import { useShop, useCatalog } from '../context/ShopContext';
import { Flame, Tag, Percent, Clock } from 'lucide-react';

export const PromotionsPage: React.FC = () => {
  const { navigate } = useShop();
  const PRODUCTS = useCatalog();
  const promoProducts = PRODUCTS.filter((p) => p.isPromotion || (p.originalPrice && p.originalPrice > p.price));

  return (
    <div className="py-8 sm:py-12 bg-[#FFFFFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Banner */}
        <div className="bg-[#111111] text-[#FFFFFF] rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl border border-[#2B2B2B]">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A017]/20 text-[#D4A017] text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>BONS PLANS SBS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Promotions du moment
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
              Des prix réduits sur les téléphones, montres connectées et accessoires, dans la limite des stocks disponibles. Tous les téléphones sont neufs et scellés.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="bg-[#1C1C1C] border border-[#333333] px-4 py-2.5 rounded-xl flex items-center gap-3">
                <Tag className="w-4 h-4 text-[#F26B1D]" />
                <span className="text-xs text-neutral-300">
                  Code additionnel -10% : <strong className="text-[#D4A017] font-mono">SBS10</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Grid */}
        <ProductGrid
          products={promoProducts}
          showFilters={true}
          title="Articles en promotion"
          subtitle="Économisez jusqu’à 60 000 FCFA"
        />
      </div>
    </div>
  );
};
