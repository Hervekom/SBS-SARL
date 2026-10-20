/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop, useCatalog } from './context/ShopContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { QuickViewModal } from './components/products/QuickViewModal';
import { ReviewModal } from './components/reviews/ReviewModal';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPage } from './pages/AdminPage';
import { TrackingPage } from './pages/TrackingPage';
import { ProductGrid } from './components/products/ProductGrid';
import { CATEGORIES } from './data/products';
import { SearchX, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentPath, searchQuery, setSearchQuery } = useShop();
  const PRODUCTS = useCatalog();

  // If there's an active search query typed in the search bar, show search results view
  if (searchQuery.trim().length > 1) {
    const searchResults = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sub_category || p.subCategory || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <main className="min-h-screen py-10 bg-porcelain">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-ink/10">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-brand-dark">
                Résultats de recherche
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold text-ink">
                Recherche pour : "{searchQuery}"
              </h1>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-1 text-xs font-semibold text-neutral-500 hover:text-ink bg-[#F4F2EF] px-3 py-1.5 rounded-xl transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Effacer la recherche</span>
            </button>
          </div>

          <ProductGrid products={searchResults} showFilters={true} />
        </div>
      </main>
    );
  }

  // Route matching
  const cleanPath = currentPath.split('?')[0].replace(/\/$/, '') || '/';

  // Detail route: /produit/:slug
  if (cleanPath.startsWith('/produit/')) {
    const slug = cleanPath.replace('/produit/', '');
    return (
      <main className="min-h-screen">
        <ProductDetailPage key={slug} slug={slug} />
      </main>
    );
  }

  // Category routes
  const categoryMatch = CATEGORIES.find((c) => cleanPath === `/${c.slug}`);
  if (categoryMatch) {
    return (
      <main className="min-h-screen">
        <CategoryPage key={categoryMatch.id} categoryId={categoryMatch.id} />
      </main>
    );
  }

  // Promotions route
  if (cleanPath === '/promotions') {
    return (
      <main className="min-h-screen">
        <PromotionsPage />
      </main>
    );
  }

  // Cart route
  if (cleanPath === '/panier') {
    return (
      <main className="min-h-screen">
        <CartPage />
      </main>
    );
  }

  // Wishlist route
  if (cleanPath === '/wishlist') {
    return (
      <main className="min-h-screen">
        <WishlistPage />
      </main>
    );
  }

  // Account route
  if (cleanPath === '/compte') {
    return (
      <main className="min-h-screen">
        <AccountPage />
      </main>
    );
  }

  // Checkout route
  if (cleanPath === '/checkout') {
    return (
      <main className="min-h-screen">
        <CheckoutPage />
      </main>
    );
  }

  if (cleanPath === '/suivi') {
    return (
      <main className="min-h-screen">
        <TrackingPage />
      </main>
    );
  }

  // Admin route
  if (cleanPath === '/admin') {
    return (
      <main className="min-h-screen">
        <AdminPage />
      </main>
    );
  }

  // Default: HomePage
  return (
    <main className="min-h-screen">
      <HomePage />
    </main>
  );
};

const Shell: React.FC = () => {
  const { currentPath, searchQuery } = useShop();
  const isHome = currentPath === '/' && searchQuery.trim().length < 2;
  return (
    <div className="min-h-screen flex flex-col bg-porcelain text-ink">
      <Header />
      {/* L'accueil passe sous l'en-tête transparent ; les autres pages réservent sa hauteur */}
      {!isHome && <div className="h-[104px] sm:h-[108px]" aria-hidden="true" />}
      <div className="flex-1">
        <MainContent />
      </div>
      <Footer />
      <MobileNav />
      {/* Espace pour la barre mobile fixe */}
      <div className="h-16 lg:hidden bg-ink" aria-hidden="true" />
      <CartDrawer />
      <QuickViewModal />
      <ReviewModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <Shell />
    </ShopProvider>
  );
}
