import React from 'react';
import { useShop, useCatalog } from '../../context/ShopContext';

import { ProductCard } from '../products/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';

export const NewArrivalSection: React.FC = () => {
  const { navigate } = useShop();
  const PRODUCTS = useCatalog();

  // Curate products marked as new arrivals, ensuring they bear the badge "Nouveau"
  const newProducts = PRODUCTS.filter((p) => p.is_new)
    .slice(0, 4)
    .map((p) => ({ ...p, badge: 'Nouveau' }));

  return (
    <section className="py-16 sm:py-24 bg-[#FFFFFF] border-t border-[#EAEAEA] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* En-tête : "Nouveautés" */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAEAEA] pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#C2410C]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Derniers arrivages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111111]">
              Nouveautés
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-light">
              Les nouveaux modèles et accessoires tout juste arrivés en boutique.
            </p>
          </div>

          <button
            onClick={() => navigate('/smartphones')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:text-[#C2410C] transition-colors self-start md:self-auto cursor-pointer"
          >
            <span>Voir toutes les nouveautés</span>
            <ArrowRight className="w-4 h-4 text-[#F26B1D]" />
          </button>
        </div>

        {/* Grille : 4 Desktop | 3 Tablette | 2 Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};
