import { Link } from 'react-router-dom';
import { heroContent } from '../../content/site-content';
import { Button } from '../ui';

export function Hero() {
  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] min-h-[500px] overflow-hidden bg-black flex items-center justify-center text-center">
      {/* Background Image with subtle gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroContent.backgroundUrl}
          alt="SANAAT Collection Campaign"
          className="w-full h-full object-cover object-center opacity-65 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-4 sm:px-6 mx-auto flex flex-col items-center">
        <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80 font-sans mb-3 sm:mb-4">
          FASHION WITH MODESTY
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-white tracking-wide leading-tight mb-4 sm:mb-6">
          {heroContent.headline}
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-white/90 font-sans font-light max-w-xl mx-auto mb-8 leading-relaxed">
          {heroContent.subline}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to={heroContent.ctaLink}>
            <Button
              variant="primary"
              size="lg"
              className="bg-plum hover:bg-plum/90 text-white min-w-[200px] shadow-lg tracking-widest text-xs"
            >
              {heroContent.ctaText}
            </Button>
          </Link>
          <Link to="/collections/new">
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-black min-w-[200px] tracking-widest text-xs"
            >
              NEW ARRIVALS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
