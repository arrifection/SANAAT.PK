import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/use-categories';
import { useSiteSettings } from '../../hooks/use-settings';
import { Skeleton } from '../ui';

// Local collection images (supplied by owner — Section 6)
const COLLECTION_IMAGES: Record<string, string> = {
  'winter-formals': '/images/collections/winter-formals.webp',
  'summer-edit': '/images/collections/summer-edit.jpg',
  'occasion-wear': '/images/collections/occasion-wear.jpg',
};

// Intentional placeholder — shown until actual image is available (Section 7)
function CollectionImagePlaceholder({ label }: { label: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-200 p-6 text-center">
      <p className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-gray-400 mt-2">
        {label}
      </p>
      <p className="text-[10px] text-gray-300 font-sans mt-1">Collection image coming soon</p>
    </div>
  );
}

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();
  const { data: settings } = useSiteSettings();

  if (settings?.categories_visible === false) return null;

  if (isLoading) {
    return (
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Skeleton className="h-6 w-36 mx-auto mb-2" />
          <Skeleton className="h-4 w-60 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div className="text-center mb-10 sm:mb-12 animate-fade-in">
        <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.3em] text-plum block mb-1">
          Curated Collections
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif tracking-wide text-black">
          The Sanaat Edit
        </h2>
      </div>

      {/* 3 Core Collections — Alternate left/right entrance, image appearing before text */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
        {categories.map((category, idx) => {
          const imageUrl = category.image_url || COLLECTION_IMAGES[category.slug];
          const isEven = idx % 2 === 0;

          return (
            <Link
              key={category.id}
              to={`/collections/${category.slug}`}
              className={`group relative block aspect-[3/4] overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 ${
                isEven ? 'animate-enter-left' : 'animate-enter-right'
              }`}
            >
              <div className="w-full h-full overflow-hidden animate-image-reveal">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    loading="lazy"
                  />
                ) : (
                  <CollectionImagePlaceholder label={category.name} />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity group-hover:from-black/90" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-center text-white animate-text-reveal">
                <h3 className="text-xl sm:text-2xl font-serif tracking-wider mb-1.5 font-normal">
                  {category.name}
                </h3>
                <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-white/90 border-b border-white/60 pb-0.5 group-hover:border-white transition-colors">
                  Explore Collection →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
