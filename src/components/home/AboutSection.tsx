import React from 'react';
import { Smartphone, Shield, BatteryCharging, Compass } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-[#FFFFFF] border-t border-[#EAEAEA] text-left relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#111111] text-[#D4A017] text-[11px] font-bold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5" />
            <span>Qui sommes-nous ?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] leading-tight">
            Bien plus qu’une boutique de téléphones.
          </h2>

          <p className="text-base sm:text-lg text-neutral-600 font-light leading-relaxed max-w-2xl mx-auto">
            Smart Business Services SARL accompagne les Doualais dans le choix de leur <strong>téléphone</strong>, de sa <strong>protection</strong> et de tous les <strong>accessoires</strong> qui vont avec : conseils honnêtes, produits testés en boutique et service après-vente joignable.
          </p>
        </div>

        {/* Les 3 Piliers Réunis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          
          {/* 1. Technologie */}
          <div className="p-8 rounded-3xl bg-white border border-[#EAEAEA] hover:border-[#F26B1D] transition-all duration-300 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F6F6F6] border border-[#EAEAEA] text-[#F26B1D] flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111111]">Téléphones</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                iPhone, Samsung, Tecno, Infinix, Xiaomi : des appareils neufs scellés, vérifiés devant vous et garantis par la boutique.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F0F0F0] text-[11px] font-mono font-semibold text-[#C2410C]">
              Neufs & garantis
            </div>
          </div>

          {/* 2. Électroménager */}
          <div className="p-8 rounded-3xl bg-white border border-[#EAEAEA] hover:border-[#F26B1D] transition-all duration-300 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F6F6F6] border border-[#EAEAEA] text-[#F26B1D] flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111111]">Protection</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Coques, pochettes et verres trempés pour chaque modèle, avec la pose du verre offerte en boutique.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F0F0F0] text-[11px] font-mono font-semibold text-[#C2410C]">
              Pose offerte
            </div>
          </div>

          {/* 3. Beauté */}
          <div className="p-8 rounded-3xl bg-white border border-[#EAEAEA] hover:border-[#F26B1D] transition-all duration-300 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F6F6F6] border border-[#EAEAEA] text-[#F26B1D] flex items-center justify-center">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111111]">Accessoires & gadgets</h3>
              <p className="text-xs text-neutral-600 font-light leading-relaxed">
                Chargeurs rapides et auto, power banks contre les coupures, écouteurs, montres connectées et enceintes.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F0F0F0] text-[11px] font-mono font-semibold text-[#C2410C]">
              Toujours chargé
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
