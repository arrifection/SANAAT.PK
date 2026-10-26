import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/use-products';
import { useCategories } from '../hooks/use-categories';
import { ProductCard } from '../components/product';
import { Skeleton, Select } from '../components/ui';
import { EmptyState, SEO } from '../components/common';
import type { ProductFilters, DisplayStatus } from '../types';

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || undefined;
  const selectedSort = (searchParams.get('sort') as ProductFilters['sort']) || 'newest';
  const selectedStatus = (searchParams.get('status') as DisplayStatus) || undefined;
  const isPreorderOnly = searchParams.get('preorder') === 'true';

  const { data: categories } = useCategories();

  const filters: ProductFilters = {
    category_slug: selectedCategory,
    sort: selectedSort,
    status: selectedStatus,
    is_preorder: isPreorderOnly ? true : undefined,
    limit: 50,
  };

  const { data: result, isLoading } = useProducts(filters);
  const products = result?.data || [];

  const handleCategoryChange = (catSlug: string) => {
    const next = new URLSearchParams(searchParams);
    if (catSlug) {
      next.set('category', catSlug);
    } else {
      next.delete('category');
    }
    setSearchParams(next);
  };

  const handleSortChange = (sortVal: string) => {
    const next = new URLSearchParams(searchParams);
    if (sortVal) {
      next.set('sort', sortVal);
    } else {
      next.delete('sort');
    }
    setSearchParams(next);
  };

  const handlePreorderToggle = () => {
    const next = new URLSearchParams(searchParams);
    if (isPreorderOnly) {
      next.delete('preorder');
    } else {
      next.set('preorder', 'true');
    }
    setSearchParams(next);
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO
        title="Shop All Collections | SANAAT"
        description="Explore the complete collection of Pakistani modest wear — from embroidered lawns to luxury silks and formals."
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[11px] uppercase tracking-[0.25em] text-plum font-sans font-medium">
          Ready to Wear & Pre-Orders
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif tracking-wide text-black mt-1 mb-2">
          The Collection
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-sans font-light">
          Modest silhouettes thoughtfully proportioned with artisanal detail.
        </p>
      </div>

      {/* Filter / Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8 border-y border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="w-44">
            <Select
              value={selectedCategory || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="text-xs h-9 py-1"
            >
              <option value="">All Categories</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Pre-order Filter Pill */}
          <button
            onClick={handlePreorderToggle}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-colors border ${
              isPreorderOnly
                ? 'bg-plum text-white border-plum font-medium'
                : 'bg-white text-gray-700 border-gray-200 hover:border-black'
            }`}
          >
            Pre-Orders Only
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider hidden sm:inline">
            Sort by:
          </span>
          <div className="w-44">
            <Select
              value={selectedSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-xs h-9 py-1"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="No pieces found"
          description="We couldn't find any garments matching your current filters. Try resetting the criteria."
          actionLabel="Clear Filters"
          onAction={() => setSearchParams({})}
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center text-xs text-gray-400 font-sans tracking-widest uppercase">
            Showing {products.length} {products.length === 1 ? 'Design' : 'Designs'}
          </div>
        </>
      )}
    </div>
  );
}
