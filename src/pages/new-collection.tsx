import { useNewProducts } from '../hooks/use-products';
import { ProductCard } from '../components/product';
import { Skeleton } from '../components/ui';
import { SEO } from '../components/common';

export function NewCollectionPage() {
  const { data: products, isLoading } = useNewProducts(20);

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO
        title="New Collection | SANAAT"
        description="Fresh silhouettes and newly dropped modest attire. Explore our most recent releases in signature fabrics."
      />

      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-medium">
          Fresh Off The Loom
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif tracking-wide text-black mt-2 mb-3">
          New Collection
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-sans font-light leading-relaxed">
          Contemporary cuts harmonised with time-honoured Pakistani craftsmanship. Each silhouette is produced in strictly limited quantities.
        </p>
      </div>

      {/* Grid */}
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
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products?.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
