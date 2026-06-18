import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import { SlidersHorizontal, X, ChevronDown, Search, Grid3X3, List } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

const BRANDS = ['AquaLux Pro', 'AquaFlow', 'CleanLine', 'FlowMaster', 'LuxHeat', 'ClearView', 'SmartFlow', 'HydroSpa', 'MirrorLux', 'AquaLux Essentials'];

const CATEGORIES = ['Bathtubs', 'Showers', 'Toilets', 'Washbasins', 'Faucets', 'Accessories'];

function FilterSidebar({ filters, setFilters, onClose }) {
  const [priceRange, setPriceRange] = useState(filters.maxPrice || 100000);

  const handleCategoryToggle = (cat) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const handleBrandToggle = (brand) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handlePriceChange = (e) => {
    const val = Number(e.target.value);
    setPriceRange(val);
    e.target.style.setProperty('--range-progress', `${(val / 100000) * 100}%`);
    setFilters(prev => ({ ...prev, maxPrice: val }));
  };

  const handleRatingChange = (r) => {
    setFilters(prev => ({ ...prev, minRating: prev.minRating === r ? 0 : r }));
  };

  const clearAll = () => {
    setFilters({ categories: [], brands: [], maxPrice: 100000, minRating: 0 });
    setPriceRange(100000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-5 sticky top-24">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-navy text-base">Filters</h2>
        <div className="flex items-center gap-2">
          <button onClick={clearAll} className="text-xs text-aqua hover:underline font-medium">Clear All</button>
          {onClose && <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X size={16} /></button>}
        </div>
      </div>

      {/* Category */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm text-navy mb-3">Category</h3>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() => handleCategoryToggle(cat)}
                className="w-4 h-4 rounded border-gray-300 text-aqua accent-[#4ABFBF] cursor-pointer"
              />
              <span className={`text-sm transition-colors ${filters.categories.includes(cat) ? 'text-aqua font-medium' : 'text-slate group-hover:text-navy'}`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm text-navy mb-3">
          Price Range <span className="text-aqua font-bold">₹{priceRange.toLocaleString('en-IN')}</span>
        </h3>
        <input
          type="range"
          min="0"
          max="100000"
          step="500"
          value={priceRange}
          onChange={handlePriceChange}
          className="w-full"
          style={{ '--range-progress': `${(priceRange / 100000) * 100}%` }}
        />
        <div className="flex justify-between text-xs text-slate mt-1">
          <span>₹0</span>
          <span>₹1,00,000</span>
        </div>
      </div>

      {/* Brand */}
      <div className="mb-6">
        <h3 className="font-semibold text-sm text-navy mb-3">Brand</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 hide-scrollbar">
          {BRANDS.map(brand => (
            <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => handleBrandToggle(brand)}
                className="w-4 h-4 rounded border-gray-300 accent-[#4ABFBF] cursor-pointer"
              />
              <span className={`text-sm transition-colors ${filters.brands.includes(brand) ? 'text-aqua font-medium' : 'text-slate group-hover:text-navy'}`}>
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-sm text-navy mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2].map(r => (
            <button
              key={r}
              onClick={() => handleRatingChange(r)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                filters.minRating === r ? 'bg-aqua/10 text-aqua font-semibold' : 'text-slate hover:bg-warm-100'
              }`}
            >
              {'★'.repeat(r)}{'☆'.repeat(5 - r)} & above
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const ITEMS_PER_PAGE = 9;

export default function Products() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('newest');
  const [filters, setFilters] = useState({ categories: [], brands: [], maxPrice: 100000, minRating: 0 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pre-select category from URL
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setFilters(prev => ({ ...prev, categories: [cat] }));
  }, []);

  const filtered = useMemo(() => {
    let result = products.filter(p => p.status === 'active');

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filters.categories.length) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    if (filters.brands.length) {
      result = result.filter(p => filters.brands.includes(p.brand));
    }

    result = result.filter(p => p.discountPrice <= filters.maxPrice);

    if (filters.minRating > 0) {
      result = result.filter(p => p.rating >= filters.minRating);
    }

    switch (sort) {
      case 'price-asc': return [...result].sort((a, b) => a.discountPrice - b.discountPrice);
      case 'price-desc': return [...result].sort((a, b) => b.discountPrice - a.discountPrice);
      case 'popular': return [...result].sort((a, b) => b.reviewCount - a.reviewCount);
      case 'rating': return [...result].sort((a, b) => b.rating - a.rating);
      default: return [...result].sort((a, b) => b.id - a.id);
    }
  }, [products, search, filters, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => setPage(1), [search, filters, sort]);

  return (
    <div className="min-h-screen bg-warm-white">
      <Navbar />

      {/* Page Header */}
      <div className="bg-navy pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">All Products</h1>
          <p className="text-white/60 mt-2">Discover our complete collection of premium bath & sanitary products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2.5"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="input-field pr-9 py-2.5 appearance-none cursor-pointer w-48"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate pointer-events-none" />
          </div>

          {/* Mobile filter */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden btn-outline py-2.5 px-4 text-sm"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>

          <span className="text-sm text-slate ml-auto">{filtered.length} products found</span>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          {/* Mobile Filter Overlay */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFilterOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-warm-white overflow-y-auto p-4">
                <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setMobileFilterOpen(false)} />
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {paginated.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-navy mb-2">No products found</h3>
                <p className="text-slate">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {paginated.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-navy hover:border-aqua hover:text-aqua disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                      page === p ? 'bg-aqua text-white shadow-aqua-glow' : 'border border-gray-200 text-navy hover:border-aqua hover:text-aqua'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-navy hover:border-aqua hover:text-aqua disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
