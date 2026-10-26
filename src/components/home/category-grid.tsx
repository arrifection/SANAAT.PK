import { Link } from 'react-router-dom';
import { useCategories } from '../../hooks/use-categories';
import { Skeleton } from '../ui';
import { SafeImage } from '../common';

export function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-72 mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-black mb-2">
          Shop by Category
        </h2>
        <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 font-sans">
          Curated collections crafted for every occasion
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity group-hover:from-black/80" />
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-center text-white">
              <h3 className="text-base sm:text-lg md:text-xl font-serif tracking-wider mb-1">
                {category.name}
              </h3>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                Explore →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
