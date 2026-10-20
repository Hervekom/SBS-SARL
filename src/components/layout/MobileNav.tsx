import React from 'react';
import { Home, LayoutGrid, Search, ShoppingBag, MessageCircle } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { whatsappLink } from '../../data/products';

/** Barre d'actions fixe en bas d'écran (mobile) + bouton WhatsApp flottant (ordinateur). */
export const MobileNav: React.FC = () => {
  const { currentPath, navigate, cartCount, setIsCartDrawerOpen, setIsSearchOpen } = useShop();
  const wa = whatsappLink('Bonjour SBS SARL, j’ai une question.');

  const item = 'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] cursor-pointer';
  const isHome = currentPath === '/';
  const isShop = ['/smartphones', '/protection', '/montres-connectees', '/chargeurs-gadgets', '/promotions'].includes(currentPath);

  return (
    <>
      <nav
        className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-porcelain/95 backdrop-blur-md border-t border-ink/10 flex pb-[env(safe-area-inset-bottom)]"
        aria-label="Navigation rapide"
      >
        <button onClick={() => navigate('/')} className={`${item} ${isHome ? 'text-brand-dark font-semibold' : 'text-ink/70'}`}>
          <Home className="w-5 h-5" />
          Accueil
        </button>
        <button onClick={() => navigate('/smartphones')} className={`${item} ${isShop ? 'text-brand-dark font-semibold' : 'text-ink/70'}`}>
          <LayoutGrid className="w-5 h-5" />
          Rayons
        </button>
        <button
          onClick={() => {
            setIsSearchOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`${item} text-ink/70`}
        >
          <Search className="w-5 h-5" />
          Rechercher
        </button>
        <button onClick={() => setIsCartDrawerOpen(true)} className={`${item} text-ink/70 relative`}>
          <span className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </span>
          Panier
        </button>
        <a href={wa} target="_blank" rel="noopener noreferrer" className={`${item} text-[#1EA952]`}>
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </a>
      </nav>

      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:flex fixed bottom-6 right-6 z-40 items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white pl-4 pr-5 py-3 shadow-lg shadow-black/15 text-sm font-semibold transition-colors"
        aria-label="Écrire à SBS sur WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
        Une question ?
      </a>
    </>
  );
};
