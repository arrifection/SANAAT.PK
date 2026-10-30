import { brandStatement } from '../../content/site-content';
import { useSiteSettings } from '../../hooks/use-settings';

export function BrandStatement() {
  const { data: settings } = useSiteSettings();

  const isVisible = settings?.about_visible ?? true;
  if (!isVisible) return null;

  const heading = settings?.about_heading || brandStatement.heading;
  const quote = settings?.about_quote || brandStatement.quote;
  const description = settings?.about_description || brandStatement.description;

  return (
    <section className="bg-plum text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
        <span className="text-xs sm:text-sm uppercase tracking-[0.35em] text-white/80 font-sans font-medium block">
          {heading}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-white max-w-3xl mx-auto leading-relaxed font-normal">
          &ldquo;{quote}&rdquo;
        </h2>
        <p className="mt-3 text-sm sm:text-base font-sans font-light text-white/90 max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="pt-4 flex items-center justify-center gap-3">
          <div className="h-px w-10 bg-white/30" />
          <span className="text-[11px] uppercase tracking-[0.3em] text-white/70 font-sans font-light">
            SANAAT · PAKISTAN
          </span>
          <div className="h-px w-10 bg-white/30" />
        </div>
      </div>
    </section>
  );
}
