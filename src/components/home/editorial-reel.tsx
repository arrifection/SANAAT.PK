import { editorialReelContent } from '../../content/site-content';
import { SafeImage } from '../common';

export function EditorialReel() {
  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-[11px] font-medium uppercase tracking-[0.25em] text-plum">
            Visual Journal
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-black mt-2">
            {editorialReelContent.heading}
          </h2>
          <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">
            Follow our journey @sanaat.pk
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {editorialReelContent.images.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-[9/16] overflow-hidden bg-gray-200 shadow-sm"
            >
              <SafeImage
                src={item.url}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-xs font-sans tracking-widest uppercase text-white bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                  View Story
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
