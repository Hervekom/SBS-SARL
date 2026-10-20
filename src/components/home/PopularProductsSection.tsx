import React, { useState } from 'react';
import { useShop, useCatalog } from '../../context/ShopContext';

import { ProductCard } from '../products/ProductCard';
import { CategoryId } from '../../types';
import { Sparkles, ArrowRight } from 'lucide-react';

export const PopularProductsSection: React.FC = () => {
  const { navigate } = useShop();
  const PRODUCTS = useCatalog();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');

  const filteredProducts = PRODUCTS.filter((p) => {
    if (selectedCategory === 'all') return Boolean(p.is_popular);
    return (p.category_id || p.category) === selectedCategory;
  });

  return (
    <section className="py-16 sm:py-24 bg-[#FFFFFF] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* En-tête : "Nos produits populaires" */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-[#EAEAEA] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#C2410C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Les incontournables</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111111]">
              Nos produits populaires
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-light">
              Les références que nos clients demandent le plus en boutique.
            </p>
          </div>

          {/* Onglets Catégories discrets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none self-start md:self-auto">
            {[
              { id: 'all', label: 'Top ventes' },
              { id: 'smartphones', label: 'Téléphones' },
              { id: 'protection', label: 'Pochettes & Verres' },
              { id: 'montres-connectees', label: 'Montres' },
              { id: 'chargeurs-gadgets', label: 'Chargeurs & Gadgets' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-[#111111] text-[#F26B1D] shadow-xs'
                    : 'text-neutral-600 hover:text-[#111111] hover:bg-[#F6F6F6]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grille : Desktop (4) | Tablet (3) | Mobile (2) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/smartphones')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-[#EAEAEA] hover:border-[#F26B1D] bg-white text-xs font-bold text-[#111111] hover:text-[#C2410C] transition-all shadow-xs cursor-pointer group"
          >
            <span>Explorer tout le catalogue</span>
            <ArrowRight className="w-4 h-4 text-[#F26B1D] transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
