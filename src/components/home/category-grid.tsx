import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/use-categories';
import { Skeleton } from '../ui';
import { SafeImage } from '../common';

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

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
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10 sm:mb-12">
        <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.3em] text-plum block mb-1">
          Curated Silhouettes
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif tracking-wide text-black">
          The Collections
        </h2>
      </div>

      {/* 3 Core Collections per Section 3.G & 4 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="group relative block aspect-[3/4] overflow-hidden bg-gray-100"
          >
            <SafeImage
              src={category.image_url}
              alt={category.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent transition-opacity group-hover:from-black/85" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-center text-white">
              <h3 className="text-xl sm:text-2xl font-serif tracking-wider mb-1.5">
                {category.name}
              </h3>
              <p className="text-[11px] font-sans text-white/80 line-clamp-1 mb-3 font-light">
                {category.description}
              </p>
              <span className="text-[10px] sm:text-[11px] font-sans uppercase tracking-[0.2em] text-white border-b border-white/60 pb-0.5 group-hover:border-white transition-colors">
                Explore Collection →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
