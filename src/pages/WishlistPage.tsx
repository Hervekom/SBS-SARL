import React from 'react';
import { useShop, useCatalog } from '../context/ShopContext';

import { ProductCard } from '../components/products/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, navigate } = useShop();
  const PRODUCTS = useCatalog();

  const favoriteProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="py-8 sm:py-12 bg-porcelain min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 text-left">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-dark block mb-1">
            Vos Coups de Cœur
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
            Liste d'Envies ({favoriteProducts.length})
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1">
            Retrouvez ici tous les articles que vous avez marqués d'un cœur doré.
          </p>
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-ink/10 p-12 sm:p-16 text-center space-y-4 max-w-lg mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#F4F2EF] text-neutral-400 flex items-center justify-center mx-auto border border-ink/10">
              <Heart className="w-8 h-8 text-brand fill-none" />
            </div>
            <h2 className="text-xl font-semibold text-ink">Votre liste d'envies est vide</h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              Enregistrez vos articles préférés en cliquant sur l'icône cœur pour les sauvegarder et les retrouver en un coup d'œil.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-ink hover:bg-black text-brand text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <span>Explorer la boutique</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
