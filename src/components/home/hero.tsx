import { Link } from 'react-router-dom';
import { heroContent } from '../../content/site-content';

export function Hero() {
  return (
    <section className="relative w-full h-[75vh] sm:h-[82vh] md:h-[88vh] min-h-[520px] overflow-hidden bg-black flex items-center justify-center text-center">
      {/* Background Campaign Visual */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroContent.backgroundUrl}
          alt="SANAAT Campaign"
          className="w-full h-full object-cover object-center opacity-70"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/35" />
      </div>

      {/* Hero Content strictly per Section 3.C */}
      <div className="relative z-10 max-w-2xl px-4 sm:px-6 mx-auto flex flex-col items-center">
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-white/90 font-sans mb-3 sm:mb-4 font-medium">
          {heroContent.headline}
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white tracking-wide leading-tight mb-4 sm:mb-6 font-normal">
          Timeless Modest Elegance
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-white/80 font-sans font-light max-w-lg mx-auto mb-8 leading-relaxed">
          {heroContent.subline}
        </p>

        {/* Two primary options */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link to={heroContent.ctaPrimaryLink} className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto min-w-[200px] bg-plum hover:bg-plum/90 text-white px-8 py-3.5 text-xs font-sans uppercase tracking-[0.2em] font-medium transition-colors"
            >
              {heroContent.ctaPrimaryText}
            </button>
          </Link>
          <Link to={heroContent.ctaSecondaryLink} className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto min-w-[200px] bg-transparent hover:bg-white hover:text-black text-white border border-white px-8 py-3.5 text-xs font-sans uppercase tracking-[0.2em] font-medium transition-colors"
            >
              {heroContent.ctaSecondaryText}
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
