'use client';

import { useState, useCallback } from 'react';
import { Search, Filter, X, ChevronDown, Star, SlidersHorizontal } from 'lucide-react';
import { MARKETPLACE_TEMPLATES, searchTemplates, MarketplaceTemplate } from '@/lib/marketplace-data';
import TemplateCard from '@/components/templates/TemplateCard';
import { useDashboard } from '@/lib/dashboard-context';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const CATEGORIES = [
  { id: 'all', label: '🌐 All' },
  { id: 'business', label: '🏢 Business' },
  { id: 'career', label: '💼 Career' },
  { id: 'content', label: '✍️ Content' },
  { id: 'finance', label: '💰 Finance' },
];

const PRICE_RANGES = [
  { label: 'Any Price', max: undefined },
  { label: 'Under $15', max: 15 },
  { label: 'Under $30', max: 30 },
  { label: 'Under $50', max: 50 },
];

const RATINGS = [
  { label: 'Any Rating', min: undefined },
  { label: '4.5+ ★', min: 4.5 },
  { label: '4.8+ ★', min: 4.8 },
  { label: '5.0 ★', min: 5.0 },
];

const SORT_OPTIONS = [
  'Most Popular',
  'Highest Rated',
  'Newest',
  'Price: Low to High',
  'Price: High to Low',
];

export default function MarketplacePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState('Most Popular');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const { addPurchased, isPurchased } = useDashboard();
  const { user } = useAuth();
  const router = useRouter();

  const handlePurchase = (template: MarketplaceTemplate) => {
    if (!user) {
      router.push('/auth');
      return;
    }
    addPurchased(template);
    alert(`✅ "${template.title}" added to your library! Check your Dashboard.`);
  };

  const results = searchTemplates(query, category, maxPrice, minRating);

  const sorted = [...results].sort((a, b) => {
    switch (sort) {
      case 'Highest Rated': return b.rating - a.rating;
      case 'Newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'Price: Low to High': return a.price - b.price;
      case 'Price: High to Low': return b.price - a.price;
      default: return b.downloadCount - a.downloadCount;
    }
  });

  const totalPages = Math.ceil(sorted.length / PER_PAGE);
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight">Template Marketplace</h1>
        <p className="text-slate-400 text-lg">Discover premium templates crafted by expert creators — {MARKETPLACE_TEMPLATES.length}+ available.</p>
      </div>

      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="marketplace-search"
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search templates, categories, keywords..."
            className="input-field pl-10 w-full"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            id="sort-select"
            className="input-field pr-8 appearance-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            {SORT_OPTIONS.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={clsx('btn-secondary flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap', showFilters && 'border-indigo-500/40 text-indigo-400')}
        >
          <SlidersHorizontal size={15} />
          Filters
          {(maxPrice !== undefined || minRating !== undefined) && (
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            id={`cat-filter-${cat.id}`}
            onClick={() => { setCategory(cat.id); setPage(1); }}
            className={clsx(
              'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              category === cat.id
                ? 'bg-indigo-600 text-white'
                : 'glass border border-white/10 text-slate-400 hover:text-white'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="glass border border-white/[0.06] rounded-2xl p-5 mb-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Price Range</label>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map(r => (
                  <button
                    key={r.label}
                    onClick={() => { setMaxPrice(r.max); setPage(1); }}
                    className={clsx('px-3 py-1.5 rounded-lg text-sm border transition-all', maxPrice === r.max ? 'bg-indigo-600 text-white border-indigo-500' : 'border-white/10 text-slate-400 hover:border-white/20')}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-3">Minimum Rating</label>
              <div className="flex flex-wrap gap-2">
                {RATINGS.map(r => (
                  <button
                    key={r.label}
                    onClick={() => { setMinRating(r.min); setPage(1); }}
                    className={clsx('px-3 py-1.5 rounded-lg text-sm border transition-all flex items-center gap-1', minRating === r.min ? 'bg-indigo-600 text-white border-indigo-500' : 'border-white/10 text-slate-400 hover:border-white/20')}
                  >
                    {r.min && <Star size={10} className="text-amber-400 fill-amber-400" />}
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex justify-end">
            <button
              onClick={() => { setMaxPrice(undefined); setMinRating(undefined); setPage(1); }}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-slate-400 text-sm">
          {sorted.length === 0 ? 'No templates found' : `${sorted.length} template${sorted.length !== 1 ? 's' : ''} found`}
          {query && <span className="text-indigo-400"> for &quot;{query}&quot;</span>}
        </p>
      </div>

      {/* Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {paginated.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onPurchase={handlePurchase}
              isPurchased={isPurchased(template.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <span className="text-5xl mb-4 block">🔍</span>
          <h3 className="text-xl font-bold text-white mb-2">No templates found</h3>
          <p className="text-slate-400 mb-6">Try different keywords or clear your filters</p>
          <button onClick={() => { setQuery(''); setCategory('all'); setMaxPrice(undefined); setMinRating(undefined); }} className="btn-primary px-6 py-2.5 rounded-xl text-sm">
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary px-4 py-2 rounded-lg text-sm disabled:opacity-40"
          >
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={clsx('w-9 h-9 rounded-lg text-sm font-medium transition-all', p === page ? 'bg-indigo-600 text-white' : 'glass border border-white/10 text-slate-400 hover:text-white')}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary px-4 py-2 rounded-lg text-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
