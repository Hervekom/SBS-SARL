import React from 'react';
import { useShop } from '../../context/ShopContext';
import { heroBannerImg } from '../../data/products';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const Hero: React.FC = () => {
  const { navigate } = useShop();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#FAFAFA]/70 to-[#FFFFFF] pt-8 pb-14 sm:pt-14 sm:pb-20 lg:pt-20 lg:pb-28 border-b border-[#EEEEEE]">
      {/* Delicate background aura and subtle geometric pattern */}
      <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#D4A017_0.75px,transparent_0.75px)] [background-size:28px_28px]" />
      
      {/* Ambient subtle warm gold glow */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-gradient-to-br from-[#F26B1D]/10 via-[#FFFFFF]/0 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-12 lg:gap-14 items-center">
          
          {/* ======================================================== */}
          {/* COLONNE GAUCHE (Desktop) / HAUT (Mobile)                 */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            
            {/* 1. Petit label */}
            <div className="animate-hero-label inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#111111] text-[#D4A017] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F26B1D] animate-pulse" />
              <span>Smart Business Services · Douala</span>
            </div>

            {/* 2. Grand titre avec animation fade-up */}
            <h1 className="animate-hero-title text-3xl sm:text-5xl lg:text-6xl xl:text-[64px] font-extrabold tracking-tight text-[#111111] leading-[1.08] [text-wrap:balance]">
              Votre téléphone et ses accessoires,<br className="hidden sm:inline" />{' '}
              <span className="relative inline-block mt-1 sm:mt-0">
                <span className="relative z-10 text-[#F26B1D]">au même endroit.</span>
                <span className="absolute bottom-1.5 left-0 w-full h-3 bg-gradient-to-r from-[#D4A017]/35 via-[#D4A017]/20 to-transparent -z-0 rounded" />
              </span>
            </h1>

            {/* 3. Sous-titre avec animation fade-up */}
            <p className="animate-hero-subtitle text-[15px] sm:text-lg text-neutral-600 font-normal leading-relaxed max-w-xl [text-wrap:balance]">
              Smartphones neufs, pochettes, verres trempés, montres connectées, chargeurs auto et gadgets électroniques — livrés rapidement à Douala et partout au Cameroun.
            </p>

            {/* 4. Boutons avec animation fade-up */}
            <div className="animate-hero-buttons flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1 sm:pt-3">
              {/* Bouton 1 : Découvrir la boutique */}
              <button
                onClick={() => navigate('/smartphones')}
                className="px-7 py-4 bg-[#111111] hover:bg-[#222222] text-[#FFFFFF] rounded-xl font-semibold text-sm tracking-wide transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 group cursor-pointer border border-[#111111] min-h-[50px]"
              >
                <span>Voir les téléphones</span>
                <ArrowRight className="w-4 h-4 text-[#F26B1D] group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Bouton 2 : Voir les promotions */}
              <button
                onClick={() => navigate('/promotions')}
                className="px-6 py-4 bg-white hover:bg-[#F6F6F6] text-[#111111] border border-[#F26B1D]/60 hover:border-[#F26B1D] rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[50px]"
              >
                <Sparkles className="w-4 h-4 text-[#F26B1D]" />
                <span>Voir les promotions</span>
              </button>
            </div>

            {/* Subtils repères d'excellence et confiance (contexte africain & international) */}
            <div className="pt-6 border-t border-[#E5E5E5]/80 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-neutral-500 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F26B1D]" />
                <span className="text-neutral-800 font-semibold">Téléphones neufs scellés</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4A017]" />
                <span>Livraison 24h à Douala</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#111111]" />
                <span>Pose de verre offerte</span>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* COLONNE DROITE : Grande Image Lifestyle / Product        */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0 animate-hero-image">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Cadre décoratif or subtil inspiré du logo */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#F26B1D]/25 via-transparent to-[#C2410C]/20 rounded-3xl blur-md -z-10" />

              {/* Conteneur image épuré avec bordure délicate */}
              <div className="relative bg-white p-2 sm:p-2.5 rounded-3xl shadow-xl border border-[#E2E2E2] overflow-hidden group">
                <div className="relative aspect-4/3 sm:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#F6F6F6]">
                  <img
                    src={heroBannerImg}
                    alt="SBS SARL – téléphones, montres connectées et accessoires"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                  {/* Subtle vignette gradient for depth */}
                  
                </div>

                {/* Badge Flottant Subtil : Sélection Officielle */}
                <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-[#EAEAEA] shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#111111] text-[#F26B1D] flex items-center justify-center shrink-0 shadow-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111111] leading-tight">
                        Produits garantis
                      </p>
                      <p className="text-[11px] text-neutral-500 font-light mt-0.5">
                        Téléphones · Accessoires · Gadgets
                      </p>
                    </div>
                  </div>
                  
                  <span className="hidden sm:inline-flex text-[11px] font-bold text-[#C2410C] bg-[#FFFFFF] px-2.5 py-1 rounded-lg border border-[#F26B1D]/40 shrink-0">
                    Paiement à la livraison
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
