import { useSearchParams } from 'react-router-dom';
import { useSearchProducts } from '../hooks/use-products';
import { ProductCard } from '../components/product';
import { Skeleton, Input } from '../components/ui';
import { EmptyState, SEO } from '../components/common';
import { Search } from 'lucide-react';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: results, isLoading } = useSearchProducts(query, 24);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = (formData.get('search') as string) || '';
    setSearchParams(newQuery ? { q: newQuery } : {});
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO title={`Search Results for "${query}" | SANAAT`} />

      <div className="max-w-xl mx-auto text-center mb-10">
        <span className="text-[11px] uppercase tracking-[0.25em] text-plum font-sans font-medium">
          Catalog Search
        </span>
        <h1 className="text-3xl font-serif text-black mt-1 mb-6">Search SANAAT</h1>

        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Input
            name="search"
            defaultValue={query}
            placeholder="Search by fabric, silhouette, or name..."
            className="pr-10 text-xs py-3"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-3 text-gray-500 hover:text-plum p-1"
            aria-label="Submit search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {query ? (
        <div>
          <div className="text-xs uppercase tracking-widest text-gray-500 mb-6 pb-2 border-b border-gray-100">
            {isLoading
              ? 'Searching...'
              : `Found ${results?.length || 0} result${results?.length === 1 ? '' : 's'} for "${query}"`}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          ) : !results || results.length === 0 ? (
            <EmptyState
              title="No matching pieces"
              description={`We couldn't find any designs matching "${query}". Try searching for lawn, chiffon, formal, or embroidered.`}
              actionLabel="View All Designs"
              actionHref="/shop"
            />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 text-xs uppercase tracking-widest">
          Enter a term above to explore our archive
        </div>
      )}
    </div>
  );
}
