import { editorialStrip } from '../../content/site-content';
import { SafeImage } from '../common';

export function EditorialReel() {
  return (
    <section className="py-14 sm:py-20 bg-gray-50/70 border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Subtle Editorial Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.3em] text-plum block">
            Campaign Editorial
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-black tracking-wide mt-1.5">
            The Sanaat Edit
          </h2>
        </div>

        {/* Clean Editorial Images Grid - Editorial Fashion Campaign feel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {editorialStrip.images.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-[3/4] overflow-hidden bg-gray-200"
            >
              <SafeImage
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                <span className="text-[10px] sm:text-xs font-serif tracking-widest uppercase">
                  {item.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
