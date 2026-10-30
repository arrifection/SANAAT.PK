import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { heroContent, defaultSiteSettings } from '../../content/site-content';
import { useSiteSettings } from '../../hooks/use-settings';

export function Hero() {
  const { data: settings } = useSiteSettings();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  const quotes = settings?.brand_quotes && settings.brand_quotes.length > 0
    ? settings.brand_quotes
    : defaultSiteSettings.brand_quotes;

  const bgImage = settings?.hero_bg_image || heroContent.backgroundUrl;
  const headline = settings?.hero_headline || heroContent.headline;
  const heroTitle = settings?.hero_title || 'Timeless Modest Elegance';

  // Rotate 2-3 short brand quotes every 2.5 seconds with smooth crossfade
  useEffect(() => {
    if (quotes.length <= 1) return;

    const interval = setInterval(() => {
      setFadeState('out');
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFadeState('in');
      }, 400); // 400ms fade transition
    }, 2800); // changes every 2.8s

    return () => clearInterval(interval);
  }, [quotes]);

  return (
    <section className="relative w-full h-[75vh] sm:h-[82vh] md:h-[88vh] min-h-[520px] overflow-hidden bg-black flex items-center justify-center text-center">
      {/* Background Campaign Visual (Preserved authentic visual) */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="SANAAT Campaign"
          className="w-full h-full object-cover object-center opacity-70"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl px-4 sm:px-6 mx-auto flex flex-col items-center">
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.35em] text-white/90 font-sans mb-3 sm:mb-4 font-medium animate-fade-in">
          {headline}
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white tracking-wide leading-tight mb-4 sm:mb-6 font-normal">
          {heroTitle}
        </h1>

        {/* Smooth Rotating Brand Quotes (2-3 seconds cycle) */}
        <div className="h-16 sm:h-14 flex items-center justify-center max-w-xl mx-auto mb-8 px-2">
          <p
            className={`text-xs sm:text-sm md:text-base font-serif italic text-white/90 leading-relaxed transition-all duration-400 ease-in-out ${
              fadeState === 'in' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            &ldquo;{quotes[quoteIndex]}&rdquo;
          </p>
        </div>

        {/* Two primary options */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link to={heroContent.ctaPrimaryLink} className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto min-w-[200px] bg-plum hover:bg-plum/90 text-white px-8 py-3.5 text-xs font-sans uppercase tracking-[0.2em] font-medium transition-colors shadow-md"
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
