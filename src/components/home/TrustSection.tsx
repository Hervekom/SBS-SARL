import React from 'react';
import { Truck, ShieldCheck, CheckCircle2, Headphones, RotateCcw } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustPillars = [
    {
      icon: Truck,
      title: 'Livraison fiable',
      desc: 'Livraison en 24h à Douala, et expédition par agence de voyage vers Yaoundé et tout le Cameroun.',
    },
    {
      icon: ShieldCheck,
      title: 'Paiement sécurisé',
      desc: 'Payez en espèces à la livraison, par Orange Money ou par MTN Mobile Money.',
    },
    {
      icon: CheckCircle2,
      title: 'Produits vérifiés',
      desc: 'Chaque téléphone est testé et chaque accessoire vérifié avant de quitter la boutique.',
    },
    {
      icon: Headphones,
      title: 'Support client',
      desc: 'Une équipe joignable par WhatsApp et téléphone pour vous conseiller avant et après l’achat.',
    },
    {
      icon: RotateCcw,
      title: 'Retours simples',
      desc: 'Échange sous 7 jours en cas de défaut, selon les conditions de la boutique.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-t border-[#EAEAEA] text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grille des 5 engagements avec icônes minimalistes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {trustPillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E8E8E8] hover:border-[#F26B1D] transition-all duration-200 group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EAEAEA] text-[#111111] group-hover:text-[#F26B1D] flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-[#111111]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
