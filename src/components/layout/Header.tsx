import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useShop } from '../../context/ShopContext';
import { BrandLogo } from './BrandLogo';
import { CATEGORIES, SHOP, whatsappLink } from '../../data/products';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronRight, MessageCircle } from 'lucide-react';

/**
 * En-tête façon éditorial : transparent au-dessus du hero sombre de l'accueil,
 * puis blanc cassé avec un filet dès qu'on défile (ou sur les autres pages).
 */
export const Header: React.FC = () => {
  const {
    currentPath,
    navigate,
    cartCount,
    wishlist,
    setIsCartDrawerOpen,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isHome = currentPath === '/' && searchQuery.trim().length < 2;
  const solid = !isHome || scrolled || menuOpen || isSearchOpen;

  const links = [
    ...CATEGORIES.map((c) => ({ label: c.id === 'montres-connectees' ? 'Montres' : c.name, path: `/${c.slug}` })),
    { label: 'Promotions', path: '/promotions' },
  ];

  const go = (path: string) => {
    navigate(path);
    setMenuOpen(false);
    setIsSearchOpen(false);
  };

  const iconBtn = `p-2.5 rounded-full transition-colors cursor-pointer ${
    solid ? 'text-ink/80 hover:text-ink hover:bg-blush' : 'text-white/85 hover:text-white hover:bg-white/10'
  }`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? 'bg-porcelain/95 backdrop-blur-md shadow-[0_1px_0_rgba(23,18,14,0.08)]' : 'bg-transparent'
      }`}
    >
      {/* Bandeau d'annonce (orange), masqué après défilement */}
      {!scrolled && (
        <div className="bg-brand text-white text-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-center gap-2 text-center">
            <span>
              Livraison gratuite à Douala dès 50 000 FCFA · Code <strong className="font-semibold">{SHOP.promoCode}</strong> : -10%
            </span>
            <a
              href={whatsappLink('Bonjour SBS SARL, je souhaite passer une commande.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline font-semibold underline underline-offset-2"
            >
              Commander sur WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between gap-4">
        <button onClick={() => go('/')} className="shrink-0 cursor-pointer" aria-label="Accueil SBS SARL">
          <BrandLogo size="sm" variant={solid ? 'dark' : 'light'} />
        </button>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => {
            const active = currentPath === l.path;
            return (
              <button
                key={l.path}
                onClick={() => go(l.path)}
                className={`text-sm transition-colors cursor-pointer ${
                  solid
                    ? active
                      ? 'text-brand-dark font-semibold'
                      : 'text-ink/75 hover:text-ink'
                    : active
                    ? 'text-white font-semibold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={iconBtn} aria-label="Rechercher">
            <Search className="w-[18px] h-[18px]" />
          </button>
          <button onClick={() => go('/compte')} className={`hidden lg:flex ${iconBtn}`} aria-label="Mon compte">
            <User className="w-[18px] h-[18px]" />
          </button>
          <button onClick={() => go('/wishlist')} className={`hidden lg:flex relative ${iconBtn}`} aria-label="Favoris">
            <Heart className="w-[18px] h-[18px]" />
            {wishlist.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-brand text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="ml-1 inline-flex items-center gap-2 rounded-full bg-brand hover:bg-brand-hover text-white pl-3.5 pr-2 py-2 text-sm font-semibold transition-colors cursor-pointer"
            aria-label="Ouvrir mon panier"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Panier</span>
            <span className="min-w-5 h-5 px-1 rounded-full bg-white text-brand-dark text-[11px] font-bold flex items-center justify-center tabular-nums">
              {cartCount}
            </span>
          </button>
          <button onClick={() => setMenuOpen(true)} className={`lg:hidden ${iconBtn}`} aria-label="Ouvrir le menu">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t border-ink/10 bg-porcelain">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="max-w-2xl mx-auto px-4 sm:px-6 py-3 relative"
          >
            <Search className="w-4 h-4 absolute left-8 sm:left-10 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="iPhone, Galaxy, verre trempé, chargeur auto, montre…"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-ink/15 rounded-full text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand placeholder:text-ink/40"
              autoFocus
            />
          </form>
        </div>
      )}

      {/* Menu mobile : rendu dans <body> (le flou de l'en-tête crée un conteneur qui rognerait un panneau « fixed ») */}
      {menuOpen && createPortal(
        <div className="fixed inset-0 z-50 lg:hidden">
          <div onClick={() => setMenuOpen(false)} className="fixed inset-0 bg-ink/50" />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-porcelain flex flex-col">
            <div className="h-16 px-4 flex items-center justify-between border-b border-ink/10">
              <BrandLogo size="sm" />
              <button onClick={() => setMenuOpen(false)} className="p-2.5 rounded-full hover:bg-blush" aria-label="Fermer le menu">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {[{ label: 'Accueil', path: '/' }, ...links].map((l) => (
                <button
                  key={l.path}
                  onClick={() => go(l.path)}
                  className={`w-full flex items-center justify-between py-4 border-b border-ink/10 text-base text-left ${
                    currentPath === l.path ? 'text-brand-dark font-semibold' : 'text-ink'
                  }`}
                >
                  {l.label}
                  <ChevronRight className="w-4 h-4 text-ink/40" />
                </button>
              ))}
              <button onClick={() => go('/compte')} className="w-full flex items-center justify-between py-4 border-b border-ink/10 text-base text-left text-ink">
                Mon compte & commandes
                <ChevronRight className="w-4 h-4 text-ink/40" />
              </button>
              <button onClick={() => go('/wishlist')} className="w-full flex items-center justify-between py-4 border-b border-ink/10 text-base text-left text-ink">
                Mes favoris ({wishlist.length})
                <ChevronRight className="w-4 h-4 text-ink/40" />
              </button>
            </div>
            <div className="p-4 border-t border-ink/10">
              <a
                href={whatsappLink('Bonjour SBS SARL, je souhaite passer une commande.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Commander sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      , document.body)}
    </header>
  );
};
