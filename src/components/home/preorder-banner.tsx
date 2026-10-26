import { Link } from 'react-router-dom';
import { preorderBannerContent } from '../../content/site-content';
import { Button } from '../ui';

export function PreorderBanner() {
  return (
    <section className="bg-plum text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <span className="text-[11px] uppercase tracking-[0.25em] text-white/80 block mb-3 font-sans">
          Limited Edition Drops
        </span>
        <h2 className="text-2xl sm:text-4xl font-serif tracking-wide text-white mb-4">
          {preorderBannerContent.heading}
        </h2>
        <p className="text-sm sm:text-base text-white/90 font-light max-w-xl mx-auto mb-8 leading-relaxed">
          {preorderBannerContent.body}
        </p>
        <Link to={preorderBannerContent.ctaLink}>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-black tracking-widest text-xs px-8"
          >
            {preorderBannerContent.ctaText}
          </Button>
        </Link>
      </div>

      {/* Subtle decorative background watermark */}
      <div className="absolute -bottom-10 -right-10 text-[120px] font-serif text-white/5 select-none pointer-events-none">
        SANAAT
      </div>
    </section>
  );
}
