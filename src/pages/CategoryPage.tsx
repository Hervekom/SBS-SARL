import React, { useState, useMemo } from 'react';
import { useSeo } from '../lib/seo';
import { CategoryId } from '../types';
import { CATEGORIES } from '../data/products';
import { ProductCard } from '../components/products/ProductCard';
import {
  CategoryFilterSystem,
  FilterState,
  initialFilterState,
} from '../components/products/CategoryFilterSystem';
import { useShop, useCatalog } from '../context/ShopContext';
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  SearchX,
  RotateCcw,
} from 'lucide-react';

interface CategoryPageProps {
  categoryId: CategoryId;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categoryId }) => {
  const { navigate } = useShop();
  const PRODUCTS = useCatalog();

  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Exact Titles & Subtitles requested
  const pageMeta: Record<CategoryId, { title: string; subtitle: string; editorialBadge: string }> = {
    smartphones: {
      title: 'Téléphones',
      subtitle: 'iPhone, Samsung, Tecno, Infinix, Xiaomi : neufs scellés et garantis.',
      editorialBadge: 'Smartphones neufs',
    },
    protection: {
      title: 'Pochettes & Verres',
      subtitle: 'Coques, pochettes et verres trempés pour tous les modèles. Pose du verre offerte en boutique.',
      editorialBadge: 'Protection',
    },
    'montres-connectees': {
      title: 'Montres connectées',
      subtitle: 'Santé, sport et notifications au poignet, pour iPhone comme pour Android.',
      editorialBadge: 'Objets connectés',
    },
    'chargeurs-gadgets': {
      title: 'Chargeurs & Gadgets',
      subtitle: 'Chargeurs rapides et auto, power banks, écouteurs, câbles et enceintes.',
      editorialBadge: 'Accessoires du quotidien',
    },
  };

  const meta = pageMeta[categoryId] || pageMeta.smartphones;
  useSeo({ title: `${meta.title} à Douala`, description: `${meta.subtitle} Prix en FCFA, livraison 24 h à Douala, paiement à la livraison.`, path: `/${categoryId}` });
  const categoryInfo = CATEGORIES.find((c) => c.id === categoryId) || CATEGORIES[0];

  // Base products for this category
  const baseCategoryProducts = useMemo(() => {
    return PRODUCTS.filter((p) => (p.category_id || p.category) === categoryId);
  }, [categoryId, PRODUCTS]);

  // Filter & sort logic applied to category products
  const filteredProducts = useMemo(() => {
    let list = [...baseCategoryProducts];

    // Search query
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.short_description?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.sub_category?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }

    // Availability
    if (filters.inStockOnly) {
      list = list.filter((p) => p.in_stock || p.inStock);
    }

    // Filtres d'attributs propres au rayon
    Object.entries(filters.attrs).forEach(([key, value]) => {
      if (!value) return;
      list = list.filter((p) => (key === 'Marque' ? p.brand === value : p.attributes?.[key] === value));
    });

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
        break;
      case 'bestsellers':
        list.sort((a, b) => (b.is_popular ? 1 : 0) - (a.is_popular ? 1 : 0));
        break;
      case 'featured':
      default:
        // maintain curated order
        break;
    }

    return list;
  }, [baseCategoryProducts, categoryId, filters]);

  return (
    <div className="py-6 sm:py-10 bg-porcelain min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-10">
        
        {/* ======================================================== */}
        {/* FIL D'ARIANE (BREADCRUMB)                                */}
        {/* ======================================================== */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500">
          <button
            onClick={() => navigate('/')}
            className="hover:text-ink transition-colors cursor-pointer"
          >
            Accueil
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-ink font-semibold">{meta.title}</span>
        </nav>

        {/* ======================================================== */}
        {/* BANNIÈRE ÉDITORIALE PREMIUM                              */}
        {/* ======================================================== */}
        <div className="relative rounded-3xl overflow-hidden bg-ink text-white p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <p className="text-sm font-medium text-white/70">{meta.editorialBadge}</p>

              {/* Titre Officiel */}
              <h1 className="text-4xl sm:text-5xl text-white leading-[1.05]">
                {meta.title}
              </h1>

              {/* Sous-titre Officiel */}
              <p className="text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
                {meta.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold-light" />
                  <span>Produits vérifiés en boutique</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-light" />
                  <span>Paiement à la livraison</span>
                </div>
              </div>
            </div>

            {/* Image d'ambiance éditoriale */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src={categoryInfo.image}
                  alt={meta.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SYSTÈME DE CONTRÔLE : RECHERCHE + FILTRER + TRIER       */}
        {/* ======================================================== */}
        <CategoryFilterSystem
          categoryId={categoryId}
          filters={filters}
          onChange={setFilters}
          totalResults={filteredProducts.length}
        />

        {/* ======================================================== */}
        {/* CATALOGUE PRODUITS : 4 Desktop | 3 Tablet | 2 Mobile     */}
        {/* ======================================================== */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-dashed border-ink/10 p-12 sm:p-16 text-center space-y-4 max-w-md mx-auto shadow-xs">
            <div className="w-14 h-14 rounded-full bg-[#F4F2EF] text-neutral-400 flex items-center justify-center mx-auto">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-ink">
              Aucun article ne correspond à ces critères
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Essayez de désactiver un ou plusieurs filtres pour afficher davantage de références disponibles.
            </p>
            <button
              onClick={() => setFilters(initialFilterState)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-ink text-brand text-xs font-bold rounded-xl hover:bg-black transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser les filtres</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
