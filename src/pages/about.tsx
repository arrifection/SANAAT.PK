import { aboutContent } from '../content/site-content';
import { SEO, SafeImage } from '../components/common';

export function AboutPage() {
  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <SEO
        title="Our Story | SANAAT"
        description="Learn about SANAAT — our commitment to modest Pakistani fashion, artisan textile preservation, and mindful luxury."
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-medium">
          Heritage & Vision
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-wide text-black mt-2 mb-4">
          {aboutContent.pageTitle}
        </h1>
        <p className="text-sm uppercase tracking-widest text-gray-500 font-sans">
          FASHION WITH MODESTY · HANDCRAFTED IN PAKISTAN
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 mb-16 shadow-sm">
        <SafeImage
          src={aboutContent.heroImageUrl}
          alt="SANAAT Artisans & Weavers"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Editorial Body */}
      <div className="max-w-3xl mx-auto space-y-6 text-base sm:text-lg font-serif text-gray-800 leading-relaxed">
        {aboutContent.paragraphs.map((p, idx) => (
          <p key={idx} className={idx === 0 ? 'text-xl sm:text-2xl font-light italic text-black' : ''}>
            {p}
          </p>
        ))}
      </div>

      {/* Mission Quote */}
      <div className="my-20 p-8 sm:p-12 bg-gray-50 border-l-2 border-plum max-w-3xl mx-auto">
        <h2 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-plum mb-3">
          {aboutContent.mission.heading}
        </h2>
        <p className="text-lg sm:text-xl font-serif text-black italic leading-relaxed">
          "{aboutContent.mission.body}"
        </p>
      </div>

      {/* Core Values */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-serif text-center text-black mb-12">
          Our Guiding Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutContent.values.map((v, i) => (
            <div key={i} className="p-6 border border-gray-100 bg-white space-y-3">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                0{i + 1}
              </span>
              <h3 className="text-xl font-serif text-black">{v.heading}</h3>
              <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
