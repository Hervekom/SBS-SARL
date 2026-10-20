import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/products';
import { ArrowUpRight } from 'lucide-react';

export const CategorySection: React.FC = () => {
  const { navigate } = useShop();

  return (
    <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#EAEAEA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ======================================================== */}
        {/* EN-TÊTE DE SECTION ÉDITORIALE                            */}
        {/* Titre : "Explorez nos catégories"                        */}
        {/* Sous-titre : "Tout l’univers du smartphone : l’appareil, sa protection, sa recharge et ses compagnons connectés." */}
        {/* ======================================================== */}
        <div className="mb-12 sm:mb-16 text-left max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#C2410C] block mb-2">
            Nos rayons
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#111111]">
            Explorez nos catégories
          </h2>
          <p className="mt-3 text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
            Tout l’univers du smartphone : l’appareil, sa protection, sa recharge et ses compagnons connectés.
          </p>
        </div>

        {/* ======================================================== */}
        {/* 4 RAYONS            */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/${category.slug}`)}
              className="group cursor-pointer rounded-3xl bg-white border border-[#E8E8E8] hover:border-[#F26B1D]/80 p-5 sm:p-6 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              {/* Grande Image Éditoriale */}
              <div className="relative aspect-4/3 sm:aspect-[16/11] w-full rounded-2xl overflow-hidden bg-[#F6F6F6] mb-6">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Voile dégradé subtil pour la lisibilité */}
                

                {/* Index Numérotation Éditoriale : 01, 02, 03 */}
                <div className="absolute top-4 left-4 bg-[#111111]/85 backdrop-blur-xs text-[#FFFFFF] text-xs font-mono font-bold tracking-wider px-3 py-1.5 rounded-xl border border-white/10 shadow-xs">
                  {category.index}
                </div>

                {/* Flèche animée au hover en haut à droite */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/95 text-[#111111] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="w-5 h-5 text-[#F26B1D] transition-transform duration-300 group-hover:scale-110" />
                </div>
              </div>

              {/* Contenu Titre & Présentation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
                  <span className="uppercase tracking-widest text-[#C2410C] font-semibold text-[11px]">
                    Rayon
                  </span>
                  <span className="font-mono tabular-nums text-neutral-400">
                    {category.itemCount} références
                  </span>
                </div>

                {/* Titre animé avec apparition de l'accent doré */}
                <div>
                  <h3 className="text-xl font-bold text-[#111111] group-hover:text-[#C2410C] transition-all duration-300 transform group-hover:translate-x-1 flex items-center justify-between">
                    <span>{category.name}</span>
                  </h3>
                  
                  {/* Accent doré animé qui s'étire au hover */}
                  <div className="h-[2px] bg-[#F26B1D] w-0 group-hover:w-16 transition-all duration-300 mt-2 rounded-full" />
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed pt-1">
                  {category.description}
                </p>
              </div>

              {/* Ligne d'action inférieure aérée */}
              <div className="pt-5 mt-5 border-t border-[#F0F0F0] flex items-center justify-between text-xs font-bold text-[#111111] group-hover:text-[#C2410C] transition-colors">
                <span className="tracking-wide">Découvrir la collection</span>
                <span className="text-[#F26B1D] transform transition-transform duration-300 group-hover:translate-x-1.5 text-sm">
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
