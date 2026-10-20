import React, { useState } from 'react';
import { CategoryId } from '../../types';
import { CATEGORY_FILTERS } from '../../data/products';
import { SlidersHorizontal, Search, ArrowUpDown, X, Check, RotateCcw } from 'lucide-react';

export interface FilterState {
  search: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'bestsellers';
  inStockOnly: boolean;
  maxPrice: number;
  /** Filtres d'attributs propres au rayon (ex: { Marque: 'Samsung', Stockage: '256 Go' }) */
  attrs: Record<string, string>;
}

export const initialFilterState: FilterState = {
  search: '',
  sortBy: 'featured',
  inStockOnly: false,
  maxPrice: 2000000,
  attrs: {},
};

interface CategoryFilterSystemProps {
  categoryId: CategoryId;
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalResults: number;
}

export const CategoryFilterSystem: React.FC<CategoryFilterSystemProps> = ({
  categoryId,
  filters,
  onChange,
  totalResults,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const groups = CATEGORY_FILTERS[categoryId] || [];

  const activeAttrs = Object.entries(filters.attrs).filter(([, v]) => Boolean(v));
  const activeCount = activeAttrs.length + (filters.inStockOnly ? 1 : 0);

  const handleReset = () => {
    onChange({ ...initialFilterState, search: filters.search, sortBy: filters.sortBy });
  };

  const toggleAttr = (key: string, value: string) => {
    const next = { ...filters.attrs };
    if (next[key] === value) delete next[key];
    else next[key] = value;
    onChange({ ...filters, attrs: next });
  };

  const chip = (selected: boolean) =>
    `px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
      selected
        ? 'bg-ink text-brand shadow-xs'
        : 'bg-white border border-ink/10 text-neutral-700 hover:border-brand'
    }`;

  return (
    <div className="space-y-4">
      {/* Barre de contrôle */}
      <div className="bg-white rounded-2xl border border-ink/10 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Rechercher un modèle, une marque..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-porcelain border border-ink/10 rounded-xl focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-ink placeholder-neutral-400"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              activeCount > 0
                ? 'bg-ink text-brand border-ink shadow-xs'
                : 'bg-porcelain text-neutral-800 border-ink/10 hover:border-brand'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtrer</span>
            {activeCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-brand text-white text-[10px] flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-1.5 bg-porcelain border border-ink/10 rounded-xl px-2.5 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="text-[11px] text-neutral-500 hidden sm:inline">Trier par :</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
              className="bg-transparent text-xs font-bold text-ink focus:outline-none cursor-pointer"
              aria-label="Trier par"
            >
              <option value="featured">Pertinence</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="newest">Nouveautés</option>
              <option value="bestsellers">Meilleures ventes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filtres actifs */}
      <div className="flex flex-wrap items-center gap-1.5 px-1 text-xs">
        <span className="text-neutral-500 text-[11px] mr-1">
          {totalResults} {totalResults > 1 ? 'articles trouvés' : 'article trouvé'}
        </span>

        {activeCount > 0 && (
          <button
            onClick={handleReset}
            className="text-[11px] font-semibold text-neutral-500 hover:text-red-600 flex items-center gap-1 underline mr-2 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Réinitialiser
          </button>
        )}

        {activeAttrs.map(([key, value]) => (
          <span
            key={key}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-ink text-brand text-[11px] font-medium"
          >
            {key} : {value}
            <button onClick={() => toggleAttr(key, value)} className="hover:text-white" aria-label={`Retirer ${key}`}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {filters.inStockOnly && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
            En stock
            <button onClick={() => onChange({ ...filters, inStockOnly: false })} className="hover:text-black">
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>

      {/* Tiroir de filtres */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" />

          <div className="fixed inset-y-0 right-0 w-[min(100%,28rem)] flex">
            <div className="w-full bg-porcelain shadow-2xl flex flex-col justify-between border-l border-ink/10 animate-slide-down">
              <div className="p-5 border-b border-ink/10 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand" />
                  <h3 className="text-sm font-bold text-ink">Filtrer la sélection ({activeCount})</h3>
                </div>
                <div className="flex items-center gap-2">
                  {activeCount > 0 && (
                    <button onClick={handleReset} className="text-xs text-neutral-500 hover:text-red-600 transition-colors cursor-pointer mr-1">
                      Effacer tout
                    </button>
                  )}
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="p-1.5 text-neutral-400 hover:text-ink hover:bg-[#F4F2EF] rounded-lg transition-colors cursor-pointer"
                    aria-label="Fermer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6 text-left">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-dark">Disponibilité</p>
                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-ink/10 hover:border-brand cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStockOnly}
                      onChange={(e) => onChange({ ...filters, inStockOnly: e.target.checked })}
                      className="w-4 h-4 rounded accent-brand"
                    />
                    <span className="text-xs font-semibold text-ink">En stock uniquement (disponible immédiatement)</span>
                  </label>
                </div>

                {groups.map((group) => (
                  <div key={group.key} className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-dark">{group.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((opt) => (
                        <button key={opt} onClick={() => toggleAttr(group.key, opt)} className={chip(filters.attrs[group.key] === opt)}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-white border-t border-ink/10 space-y-2">
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-full py-3.5 bg-ink hover:bg-black text-white font-bold text-xs rounded-xl tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 text-brand" />
                  <span>Afficher les résultats ({totalResults})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
