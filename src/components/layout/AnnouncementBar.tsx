import React, { useState } from 'react';
import { Zap, MessageCircle, MapPin, X } from 'lucide-react';
import { SHOP, whatsappLink } from '../../data/products';

export const AnnouncementBar: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#111111] text-white text-xs py-2 px-4 border-b border-[#222222] relative z-40">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#F26B1D]/20">
            <Zap className="w-3 h-3 text-[#F26B1D]" />
          </span>
          <span className="font-light tracking-wide text-neutral-300">
            <strong className="font-semibold text-white">Livraison gratuite à Douala</strong> dès 50 000 FCFA · Code{' '}
            <span className="font-mono text-[#D4A017] font-bold tracking-wider">{SHOP.promoCode}</span> : -10%
          </span>
        </div>

        <div className="flex items-center gap-4 text-neutral-300">
          <div className="hidden md:flex items-center gap-1.5 text-neutral-400">
            <MapPin className="w-3.5 h-3.5 text-[#D4A017]" />
            <span className="text-[11px] font-medium text-neutral-300">Boutique à {SHOP.city}</span>
          </div>

          <div className="hidden md:block h-3 w-px bg-neutral-700" />

          <a
            href={whatsappLink('Bonjour SBS SARL, j’ai une question.')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#F26B1D] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Commander sur WhatsApp</span>
          </a>

          <button
            onClick={() => setDismissed(true)}
            className="text-neutral-400 hover:text-white p-0.5 ml-1 transition-colors"
            title="Masquer le bandeau"
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
