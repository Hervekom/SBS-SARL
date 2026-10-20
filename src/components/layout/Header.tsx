import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { BrandLogo } from './BrandLogo';
import { whatsappLink } from '../../data/products';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Smartphone,
  Shield,
  Watch,
  BatteryCharging,
  Flame,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';

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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track window scroll to smoothly shrink header and apply sticky styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Téléphones', path: '/smartphones' },
    { label: 'Pochettes & Verres', path: '/protection' },
    { label: 'Montres', path: '/montres-connectees' },
    { label: 'Chargeurs & Gadgets', path: '/chargeurs-gadgets' },
    { label: 'Promotions', path: '/promotions', highlight: true },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setIsSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(true);
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ease-in-out ${
        isScrolled
          ? 'bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E6E6E6] shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)]'
          : 'bg-[#FFFFFF] border-b border-[#EEEEEE]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between transition-all duration-300 ease-in-out ${
            isScrolled ? 'h-16 sm:h-18' : 'h-20 sm:h-22'
          }`}
        >
          {/* ======================================================== */}
          {/* ZONE GAUCHE : Logo SBS SARL              */}
          {/* ======================================================== */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => handleNav('/')}
              className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26B1D] rounded-lg group cursor-pointer"
              aria-label="Accueil SBS SARL"
            >
              <BrandLogo size={isScrolled ? 'sm' : 'md'} className="transition-transform duration-300 group-hover:opacity-95" />
            </button>
          </div>

          {/* ======================================================== */}
          {/* ZONE CENTRALE (DESKTOP) : Navigation Aérée             */}
          {/* Accueil, rayons, Promotions */}
          {/* ======================================================== */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-[13.5px] xl:text-[14px] font-medium tracking-wide transition-all relative py-1.5 cursor-pointer select-none ${
                    isActive
                      ? 'text-[#111111] font-semibold'
                      : 'text-neutral-600 hover:text-[#111111]'
                  } ${
                    link.highlight
                      ? 'text-[#C2410C] font-semibold hover:text-[#F26B1D]'
                      : ''
                  }`}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    {link.highlight && (
                      <Flame className="w-3.5 h-3.5 text-[#F26B1D] animate-pulse" />
                    )}
                    {link.label}
                  </span>
                  {/* Subtle gold indicator on active route */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F26B1D] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ======================================================== */}
          {/* ZONE DROITE (DESKTOP & MOBILE)                          */}
          {/* Desktop : Recherche, Compte, Wishlist, Panier (+ badge)  */}
          {/* Mobile : Search, Cart (+ badge), Menu                   */}
          {/* ======================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* 1. RECHERCHE (Visible Desktop + Mobile) */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2.5 text-neutral-700 hover:text-[#111111] hover:bg-[#F6F6F6] rounded-full transition-colors cursor-pointer"
              aria-label="Rechercher des articles"
              title="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* 2. COMPTE (Desktop only) */}
            <button
              onClick={() => handleNav('/compte')}
              className="hidden lg:flex p-2.5 text-neutral-700 hover:text-[#111111] hover:bg-[#F6F6F6] rounded-full transition-colors cursor-pointer"
              aria-label="Mon compte"
              title="Mon compte"
            >
              <User className="w-5 h-5" />
            </button>

            {/* 3. WISHLIST (Desktop only) */}
            <button
              onClick={() => handleNav('/wishlist')}
              className="hidden lg:flex p-2.5 text-neutral-700 hover:text-[#111111] hover:bg-[#F6F6F6] rounded-full transition-colors relative cursor-pointer"
              aria-label="Liste d'envies"
              title="Favoris"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#F26B1D] text-[#111111] text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* 4. PANIER (Desktop + Mobile avec Compteur) */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 pl-3 pr-2.5 sm:pl-3.5 sm:pr-3 py-2 bg-[#111111] hover:bg-[#222222] text-white rounded-full text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer group shrink-0"
              aria-label="Ouvrir mon panier"
            >
              <ShoppingBag className="w-4 h-4 text-[#F26B1D] group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline font-medium">Panier</span>
              <span className="w-5 h-5 rounded-full bg-[#F26B1D] text-[#111111] flex items-center justify-center font-bold text-[11px] font-mono tabular-nums">
                {cartCount}
              </span>
            </button>

            {/* 5. MENU MOBILE (Mobile only) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 lg:hidden text-neutral-800 hover:bg-[#F6F6F6] rounded-full transition-colors cursor-pointer"
              aria-label="Ouvrir le menu de navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Expandable Live Search Bar */}
        {isSearchOpen && (
          <div className="py-3 px-1 border-t border-[#EEEEEE] animate-slide-down">
            <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher iPhone, Galaxy, verre trempé, chargeur auto, montre..."
                className="w-full pl-11 pr-24 py-2.5 bg-white border border-[#E2E2E2] rounded-xl text-sm focus:outline-none focus:border-[#F26B1D] focus:ring-1 focus:ring-[#F26B1D] text-[#111111] placeholder-neutral-400"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#F26B1D] hover:bg-[#C2410C] text-[#111111] font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Explorer
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* NAVIGATION MOBILE : Tiroir Mobile Fluide & Spacieux      */}
      {/* ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop avec flou léger */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#FFFFFF] shadow-2xl flex flex-col justify-between border-l border-[#EAEAEA] animate-slide-down">
            {/* Drawer Top Bar */}
            <div className="p-5 border-b border-[#EAEAEA] flex items-center justify-between bg-white">
              <button
                onClick={() => handleNav('/')}
                className="focus:outline-none"
              >
                <BrandLogo size="sm" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-neutral-500 hover:text-[#111111] hover:bg-[#F6F6F6] rounded-full transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items (Touch Targets >= 48px) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
              <p className="px-3 pt-2 pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#C2410C]">
                Nos rayons
              </p>

              {navLinks.map((link) => {
                const isActive = currentPath === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNav(link.path)}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl min-h-[50px] text-[15px] font-semibold transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#111111] text-[#FFFFFF] shadow-xs'
                        : 'text-neutral-800 hover:bg-[#F6F6F6]'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {link.path === '/smartphones' && (
                        <Smartphone className={`w-4 h-4 ${isActive ? 'text-[#F26B1D]' : 'text-[#C2410C]'}`} />
                      )}
                      {link.path === '/protection' && (
                        <Shield className={`w-4 h-4 ${isActive ? 'text-[#F26B1D]' : 'text-[#C2410C]'}`} />
                      )}
                      {link.path === '/montres-connectees' && (
                        <Watch className={`w-4 h-4 ${isActive ? 'text-[#F26B1D]' : 'text-[#C2410C]'}`} />
                      )}
                      {link.path === '/chargeurs-gadgets' && (
                        <BatteryCharging className={`w-4 h-4 ${isActive ? 'text-[#F26B1D]' : 'text-[#C2410C]'}`} />
                      )}
                      {link.path === '/promotions' && (
                        <Flame className={`w-4 h-4 ${isActive ? 'text-[#F26B1D]' : 'text-[#F26B1D]'}`} />
                      )}
                      {link.label}
                    </span>

                    {link.highlight ? (
                      <span className="text-[10px] font-bold text-[#F26B1D] bg-[#111111] px-2.5 py-0.5 rounded-full border border-[#F26B1D]/40">
                        OFFRES
                      </span>
                    ) : (
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#F26B1D]' : 'text-neutral-400'}`} />
                    )}
                  </button>
                );
              })}

              <div className="pt-4 mt-3 border-t border-[#EAEAEA]">
                <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                  Votre Compte
                </p>

                <button
                  onClick={() => handleNav('/compte')}
                  className="w-full text-left px-4 py-3 rounded-xl min-h-[48px] text-sm text-neutral-700 hover:bg-[#F6F6F6] flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <User className="w-4 h-4 text-neutral-500" />
                    <span>Mon Compte & Commandes</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>

                <button
                  onClick={() => handleNav('/wishlist')}
                  className="w-full text-left px-4 py-3 rounded-xl min-h-[48px] text-sm text-neutral-700 hover:bg-[#F6F6F6] flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-neutral-500" />
                    <span>Mes Coups de Cœur ({wishlist.length})</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Bottom Actions / VIP Concierge */}
            <div className="p-4 bg-white border-t border-[#EAEAEA] space-y-3">
              <a
                href={whatsappLink('Bonjour SBS SARL, je souhaite passer une commande.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Commander sur WhatsApp</span>
              </a>

              <p className="text-[11px] text-center text-neutral-400 font-light">
                SBS SARL · Électronique & accessoires · Douala
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
