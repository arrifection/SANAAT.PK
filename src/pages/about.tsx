import { aboutContent } from '../content/site-content';
import { SEO } from '../components/common';

export function AboutPage() {

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <SEO
        title="Our Story | SANAAT"
        description="Sanaat — A celebration of thoughtful design and modest elegance. Pakistani silhouettes designed to feel timeless, graceful and distinctly your own."
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-medium">
          Heritage & Vision
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif tracking-wide text-black mt-2 mb-4 font-normal">
          {aboutContent.pageTitle}
        </h1>
        <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 font-sans">
          FASHION WITH MODESTY · PAKISTANI FASHION LABEL
        </p>
      </div>

      {/* Story Visual Area (Section 7 & 8: Authentic textile craft storytelling visual) */}
      <div className="relative aspect-[16/9] max-w-3xl mx-auto w-full overflow-hidden bg-neutral-100 border border-neutral-200 mb-16 shadow-xs">
        <img
          src="/images/story/our-story.webp"
          alt="SANAAT Artisanal Textile Weaving"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
          loading="eager"
        />
      </div>

      {/* Editorial Body */}
      <div className="max-w-2xl mx-auto space-y-6 text-base sm:text-lg font-serif text-gray-800 leading-relaxed">
        {aboutContent.paragraphs.map((p: string, idx: number) => (
          <p key={idx} className={idx === 0 ? 'text-lg sm:text-xl font-light italic text-black' : ''}>
            {p}
          </p>
        ))}
      </div>

      {/* Mission Quote */}
      <div className="my-16 p-8 sm:p-12 bg-neutral-50 border-l-2 border-plum max-w-2xl mx-auto">
        <h2 className="text-xs uppercase tracking-[0.25em] font-sans font-semibold text-plum mb-3">
          {aboutContent.mission.heading}
        </h2>
        <p className="text-lg sm:text-xl font-serif text-black italic leading-relaxed font-normal">
          &ldquo;{aboutContent.mission.body}&rdquo;
        </p>
      </div>

      {/* Core Values */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-serif text-center text-black mb-10 font-normal">
          Our Guiding Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {aboutContent.values.map((v: { heading: string; body: string }, i: number) => (
            <div key={i} className="p-6 border border-gray-100 bg-white space-y-3">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                0{i + 1}
              </span>
              <h3 className="text-xl font-serif text-black font-normal">{v.heading}</h3>
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
