import React from 'react';
import { useShop } from '../../context/ShopContext';
import { BrandLogo } from './BrandLogo';
import { CATEGORIES, SHOP, whatsappLink } from '../../data/products';
import { Phone, MapPin, MessageCircle, Clock, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useShop();

  return (
    <footer className="bg-[#111111] text-white pt-16 pb-12 border-t-4 border-[#F26B1D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#262626]">
          {/* Marque */}
          <div className="lg:col-span-2 space-y-4">
            <button onClick={() => navigate('/')} className="text-left focus:outline-none" aria-label="Accueil SBS SARL">
              <BrandLogo size="lg" variant="light" />
            </button>

            <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-sm pt-2">
              Smart Business Services SARL : votre boutique d’électronique à Douala. Téléphones neufs, pochettes, verres
              trempés, montres connectées, chargeurs et tous les gadgets du quotidien, au juste prix.
            </p>

            <div className="pt-2 space-y-2 text-xs text-neutral-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#F26B1D] shrink-0" />
                <span>Boutique · {SHOP.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#F26B1D] shrink-0" />
                <span>{SHOP.hours}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F26B1D] shrink-0" />
                <span>Appel & WhatsApp : {SHOP.phoneDisplay}</span>
              </div>
              <a
                href={SHOP.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4 text-[#F26B1D] shrink-0" />
                <span>Smart Business Services Sarl sur Facebook</span>
              </a>
            </div>
          </div>

          {/* Rayons */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017]">Nos rayons</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <button onClick={() => navigate(`/${c.slug}`)} className="hover:text-white transition-colors cursor-pointer">
                    {c.name}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => navigate('/promotions')} className="hover:text-white transition-colors cursor-pointer">
                  Promotions
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017]">Services & aide</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button onClick={() => navigate('/compte')} className="hover:text-white transition-colors cursor-pointer">
                  Suivi de commande
                </button>
              </li>
              <li>
                <a
                  href={whatsappLink('Bonjour SBS SARL, j’ai besoin d’aide.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F26B1D] transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>Assistance WhatsApp</span>
                </a>
              </li>
              <li>Pose de verre trempé offerte</li>
              <li>Garantie boutique sur les téléphones</li>
              <li>
                <button onClick={() => navigate('/wishlist')} className="hover:text-white transition-colors cursor-pointer">
                  Mes favoris
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="transition-colors cursor-pointer text-[11px] text-neutral-500 hover:text-[#F26B1D] hover:underline"
                >
                  Espace administrateur
                </button>
              </li>
            </ul>
          </div>

          {/* Paiements */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4A017]">Paiement</h4>
            <p className="text-xs text-neutral-400 font-light">
              Payez à la livraison ou par Mobile Money, en toute confiance :
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-1 bg-[#1F1F1F] text-neutral-300 rounded text-[11px] border border-neutral-800">
                Espèces à la livraison
              </span>
              <span className="px-2.5 py-1 bg-[#1F1F1F] text-[#F26B1D] rounded text-[11px] font-semibold border border-neutral-800">
                Orange Money
              </span>
              <span className="px-2.5 py-1 bg-[#1F1F1F] text-[#FFCC00] rounded text-[11px] font-semibold border border-neutral-800">
                MTN MoMo
              </span>
              <span className="px-2.5 py-1 bg-[#1F1F1F] text-neutral-300 rounded text-[11px] border border-neutral-800">
                Visa / Mastercard
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} Smart Business Services SARL. Tous droits réservés.</p>
          <div className="flex items-center gap-3">
            <span>Douala · Cameroun</span>
            <span className="text-neutral-600">·</span>
            <span className="text-[#D4A017]">Le bon gadget, au bon prix</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
