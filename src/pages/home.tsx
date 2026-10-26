import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Hero,
  CategoryGrid,
  EditorialReel,
  BrandStatement,
  PreorderBanner,
} from '../components/home';
import { ProductCard } from '../components/product';
import { useNewProducts, useFeaturedProducts } from '../hooks/use-products';
import { Skeleton, Button, Input } from '../components/ui';
import { SEO } from '../components/common';
import { useToast } from '../components/ui/toast';

export function HomePage() {
  const { data: newProducts, isLoading: isLoadingNew } = useNewProducts(4);
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useFeaturedProducts(4);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { addToast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        description: 'Please provide a valid email address.',
      });
      return;
    }

    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setNewsletterEmail('');
      addToast({
        type: 'success',
        title: 'Subscribed',
        description: 'Welcome to the SANAAT circle. You will receive private previews and updates.',
      });
    }, 600);
  };

  return (
    <>
      <SEO
        title="SANAAT | Fashion with Modesty"
        description="Contemporary Pakistani modest fashion brand. Discover handloom fabrics, refined silhouettes, and bespoke artisanal craft."
      />

      {/* 1. Large Hero */}
      <Hero />

      {/* 2. New Collection Grid */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-10 pb-4 border-b border-gray-100">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-plum font-sans font-medium">
              Latest Arrivals
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-wide text-black mt-1">
              New Collection
            </h2>
          </div>
          <Link
            to="/collections/new"
            className="text-xs uppercase tracking-widest text-black hover:text-plum transition-colors mt-2 sm:mt-0 font-medium"
          >
            View All ({newProducts?.length ?? 0}) →
          </Link>
        </div>

        {isLoadingNew ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newProducts?.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 2} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Shop by Category */}
      <CategoryGrid />

      {/* 4. Featured Pieces */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-10 pb-4 border-b border-gray-100">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-plum font-sans font-medium">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif tracking-wide text-black mt-1">
              Featured Designs
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest text-black hover:text-plum transition-colors mt-2 sm:mt-0 font-medium"
          >
            Explore Shop →
          </Link>
        </div>

        {isLoadingFeatured ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[3/4] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Editorial Reel */}
      <EditorialReel />

      {/* 6. Brand Statement */}
      <BrandStatement />

      {/* 7. Pre-order Banner */}
      <PreorderBanner />

      {/* 8. Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 max-w-2xl mx-auto text-center">
        <span className="text-[11px] uppercase tracking-[0.25em] text-plum font-sans font-medium">
          Privilege Access
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-black mt-2 mb-3">
          Join the SANAAT Circle
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 font-light max-w-md mx-auto mb-6">
          Subscribe for early access to private pre-orders, new seasonal launches, and curated design notes.
        </p>

        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="flex-1 text-xs"
            required
          />
          <Button
            type="submit"
            variant="secondary"
            loading={isSubscribing}
            className="text-xs tracking-widest px-6"
          >
            SUBSCRIBE
          </Button>
        </form>
      </section>
    </>
  );
}
