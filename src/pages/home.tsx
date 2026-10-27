import { Link } from 'react-router-dom';
import {
  Hero,
  CategoryGrid,
  BrandStatement,
} from '../components/home';
import { ProductCard } from '../components/product';
import { useFeaturedProducts } from '../hooks/use-products';
import { Skeleton } from '../components/ui';
import { SEO } from '../components/common';
import { ArrowRight } from 'lucide-react';

export function HomePage() {
  // Section 3.D: Show three beautiful product cards
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useFeaturedProducts(3);

  return (
    <>
      <SEO
        title="SANAAT | Fashion with Modesty"
        description="SANAAT — Quiet luxury modest fashion. Handcrafted Pakistani silhouettes designed with timeless elegance and modest grace."
      />

      {/* C. Hero section */}
      <Hero />

      {/* D. Three featured dresses */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 sm:mb-12 pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-medium block">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-wide text-black mt-1 font-normal">
              Featured Pieces
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest text-black hover:text-plum transition-colors mt-3 sm:mt-0 font-medium inline-flex items-center gap-1.5"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoadingFeatured ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProducts?.slice(0, 3).map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx === 0} />
            ))}
          </div>
        )}
      </section>


      {/* F. About Sanaat */}
      <BrandStatement />

      {/* G. Collections (Winter Formals, Summer Edit, Occasion Wear) */}
      <CategoryGrid />

      {/* H. Final CTA — Sanaat Plum brand box */}
      <section className="py-16 sm:py-24 bg-[#6C255D] text-white text-center px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
          <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.35em] text-white/70">
            SANAAT · PAKISTAN
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif tracking-wide leading-tight font-normal">
            Pakistani Fashion, Made Modest.
          </h2>
          <p className="text-xs sm:text-sm text-white/80 font-sans font-light max-w-md mx-auto leading-relaxed">
            Sanaat is a quiet celebration of thoughtful design — for the woman who values quality, modesty, and enduring elegance. Available nationwide across Pakistan.
          </p>
          <div className="pt-2">
            <Link to="/shop">
              <button
                type="button"
                className="bg-white hover:bg-gray-100 text-[#6C255D] px-8 py-3.5 text-xs font-sans uppercase tracking-[0.2em] font-semibold transition-colors"
              >
                EXPLORE ALL PIECES
              </button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
