import { useParams, Link } from 'react-router-dom';
import { useCategory } from '../hooks/use-categories';
import { useProducts } from '../hooks/use-products';
import { ProductCard } from '../components/product';
import { Skeleton } from '../components/ui';
import { EmptyState, SEO } from '../components/common';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: category, isLoading: isLoadingCategory } = useCategory(slug || '');
  const { data: result, isLoading: isLoadingProducts } = useProducts({
    category_slug: slug,
    limit: 50,
  });

  const products = result?.data || [];

  if (isLoadingCategory) {
    return (
      <div className="py-12 max-w-7xl mx-auto px-4">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-4 w-96 mx-auto mb-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center">
        <SEO title="Category Not Found | SANAAT" />
        <EmptyState
          title="Category not found"
          description="We couldn't locate this product category in our directory."
          actionLabel="View All Collections"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO
        title={`${category.name} | SANAAT`}
        description={category.description || `Shop modest ${category.name} from SANAAT.`}
      />

      {/* Breadcrumb */}
      <nav className="text-xs uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-black transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span className="text-black font-medium">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-medium">
          Category
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif tracking-wide text-black mt-1 mb-3">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-xs sm:text-sm text-gray-600 font-sans font-light leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Grid */}
      {isLoadingProducts ? (
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
          title="No pieces in this category yet"
          description="New designs are arriving soon from our atelier. Explore our other collections in the meantime."
          actionLabel="Browse All Pieces"
          actionHref="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
