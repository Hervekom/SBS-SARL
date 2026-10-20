import React, { useState, useMemo } from 'react';
import { Product, CategoryId } from '../../types';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../../data/products';
import { SlidersHorizontal, ArrowUpDown, SearchX } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  initialCategory?: CategoryId | 'all';
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  initialCategory = 'all',
  showFilters = true,
  title,
  subtitle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        // maintain default ranking
        break;
    }

    return result;
  }, [products, selectedCategory, inStockOnly, sortBy]);

  return (
    <div className="space-y-6">
      {/* Optional Title */}
      {(title || subtitle) && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            {subtitle && (
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C2410C] block mb-1">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                {title}
              </h2>
            )}
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            {filteredProducts.length} articles disponibles
          </span>
        </div>
      )}

      {/* Filter and Sort Bar (Labcraft Store style logic) */}
      {showFilters && (
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-[#EAEAEA] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#111111] text-[#F26B1D]'
                  : 'text-neutral-600 hover:text-[#111111] hover:bg-[#F6F6F6]'
              }`}
            >
              Tous les articles
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-[#111111] text-[#F26B1D]'
                    : 'text-neutral-600 hover:text-[#111111] hover:bg-[#F6F6F6]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Sort & Stock Toggles */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Stock checkbox */}
            <label className="flex items-center gap-1.5 text-xs text-neutral-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-[#F26B1D] focus:ring-[#F26B1D] border-[#F26B1D]"
              />
              <span>En stock uniquement</span>
            </label>

            <div className="h-4 w-px bg-neutral-200 hidden sm:block" />

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#F6F6F6] border border-[#E2E2E2] rounded-xl text-xs font-medium text-neutral-800 py-1.5 pl-2 pr-6 focus:outline-none focus:border-[#F26B1D] cursor-pointer"
                aria-label="Trier les produits"
              >
                <option value="featured">Pertinence</option>
                <option value="price-asc">Prix : Croissant</option>
                <option value="price-desc">Prix : Décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Product Cards : 2 mobile, 3 tablet, 4 desktop */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-[#DADADA] p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F6F6F6] text-neutral-400 flex items-center justify-center mx-auto">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#111111]">Aucun produit trouvé</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Essayez de réinitialiser vos filtres ou de sélectionner un autre rayon.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setInStockOnly(false);
              setSortBy('featured');
            }}
            className="px-4 py-2 bg-[#111111] text-[#F26B1D] text-xs font-semibold rounded-xl hover:bg-[#222222] transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
};
