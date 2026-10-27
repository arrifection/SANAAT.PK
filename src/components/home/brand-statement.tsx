import { brandStatement } from '../../content/site-content';

export function BrandStatement() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-medium block mb-3 sm:mb-4">
        {brandStatement.heading}
      </span>
      <h2 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-wide text-black max-w-2xl mx-auto leading-relaxed font-normal">
        &ldquo;{brandStatement.quote}&rdquo;
      </h2>
      <p className="mt-4 sm:mt-6 text-xs sm:text-sm font-sans font-light text-gray-600 max-w-lg mx-auto leading-relaxed">
        {brandStatement.description}
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="h-px w-8 bg-gray-200" />
        <span className="text-[10px] uppercase tracking-[0.25em] text-gray-400 font-sans">
          SANAAT · PAKISTAN
        </span>
        <div className="h-px w-8 bg-gray-200" />
      </div>
    </section>
  );
}
