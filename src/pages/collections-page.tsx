import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/use-categories';
import { SEO } from '../components/common';
import { Skeleton } from '../components/ui';

const COLLECTION_IMAGES: Record<string, string> = {
  'winter-formals': '/images/collections/winter-formals.webp',
  'summer-edit': '/images/collections/summer-edit.jpg',
  'occasion-wear': '/images/collections/occasion-wear.jpg',
};

export function CollectionsPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO
        title="Collections | SANAAT"
        description="Explore Sanaat curated collections — Winter Formals, Summer Edit, and Occasion Wear."
      />

      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-plum font-medium block mb-2">
          Curated Ensembles
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-black tracking-wide font-normal">
          The Sanaat Edit
        </h1>
        <p className="text-sm sm:text-base font-serif italic text-gray-600 mt-2">
          &ldquo;Pieces created to feel timeless, graceful and distinctly your own.&rdquo;
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {categories?.map((cat) => {
            const imgUrl = COLLECTION_IMAGES[cat.slug] || cat.image_url;
            return (
              <Link
                key={cat.id}
                to={`/collections/${cat.slug}`}
                className="group block relative overflow-hidden bg-gray-50 border border-gray-100 transition-all duration-500 hover:shadow-lg"
              >
                <div className="aspect-[3/4] overflow-hidden relative">
                  {imgUrl ? (
                    <img
                      src={imgUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gray-50">
                      <span className="text-xs font-serif uppercase tracking-widest text-black">{cat.name}</span>
                      <span className="text-[11px] text-gray-400 font-sans mt-1">Collection image coming soon</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-center text-white">
                    <h3 className="text-2xl font-serif tracking-wider mb-2 font-normal">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-sans text-white/80 line-clamp-2 max-w-xs mx-auto mb-4 font-light">
                      {cat.description}
                    </p>
                    <span className="inline-block text-[11px] uppercase tracking-[0.2em] font-sans font-medium text-white border-b border-white/60 pb-0.5 group-hover:border-white transition-colors">
                      Explore Collection →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
