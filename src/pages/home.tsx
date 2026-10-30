import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Hero,
  CategoryGrid,
  BrandStatement,
} from '../components/home';
import { ProductCard } from '../components/product';
import { useFeaturedProducts } from '../hooks/use-products';
import { useSiteSettings } from '../hooks/use-settings';
import { Skeleton } from '../components/ui';
import { SEO } from '../components/common';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export function HomePage() {
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useFeaturedProducts(12);
  const { data: settings } = useSiteSettings();
  const [startIndex, setStartIndex] = useState(0);

  const total = featuredProducts?.length || 0;
  // Show 3 compact cards in one horizontal row
  const itemsPerPage = 3;
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + itemsPerPage < total;

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + itemsPerPage < total ? prev + 1 : 0));
  };

  const visibleProducts = featuredProducts?.slice(startIndex, startIndex + itemsPerPage) || [];

  return (
    <>
      <SEO
        title="SANAAT | Fashion with Modesty"
        description="SANAAT — Quiet luxury modest fashion. Handcrafted Pakistani silhouettes designed with timeless elegance and modest grace."
      />

      {/* Hero section */}
      <Hero />

      {/* Featured Pieces (Three compact cards in one row with left/right browse arrows) */}
      {settings?.featured_visible !== false && (
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 pb-4 border-b border-gray-100 gap-4">
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-medium block">
                Curated Selection
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif tracking-wide text-black mt-1 font-normal">
                Featured Pieces
              </h2>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
              {/* Left / Right Browse Arrows */}
              {total > itemsPerPage && (
                <div className="flex items-center gap-1.5 border border-gray-200 p-0.5 rounded-sm">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={!canGoPrev && startIndex === 0}
                    aria-label="Previous featured pieces"
                    className={`p-1.5 transition-colors ${
                      canGoPrev ? 'text-black hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-sans text-gray-400 px-1">
                    {Math.min(startIndex + 1, total)}–{Math.min(startIndex + itemsPerPage, total)} of {total}
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!canGoNext}
                    aria-label="Next featured pieces"
                    className={`p-1.5 transition-colors ${
                      canGoNext ? 'text-black hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* View All Pieces with subtle animated arrow */}
              <Link
                to="/shop"
                className="group text-xs uppercase tracking-widest text-black hover:text-plum transition-colors font-medium inline-flex items-center gap-1.5"
              >
                <span>View All Pieces</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[3/4] w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
              {visibleProducts.map((product, idx) => (
                <div key={product.id} className="animate-fade-in transition-transform duration-300 hover:-translate-y-1">
                  <ProductCard product={product} priority={idx === 0} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* The Sanaat Edit (Curated Collections) */}
      <CategoryGrid />

      {/* About Sanaat directly below The Sanaat Edit */}
      <BrandStatement />
    </>
  );
}
