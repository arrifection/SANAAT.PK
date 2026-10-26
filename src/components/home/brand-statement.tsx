import { brandStatement } from '../../content/site-content';

export function BrandStatement() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      <span className="text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-medium block mb-4">
        Philosophy
      </span>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-black mb-6">
        {brandStatement.heading}
      </h2>
      <p className="text-base sm:text-lg md:text-xl font-serif text-gray-700 leading-relaxed max-w-2xl mx-auto italic">
        "{brandStatement.body}"
      </p>
      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="h-px w-12 bg-gray-300" />
        <span className="text-xs uppercase tracking-widest text-gray-400 font-sans">
          SANAAT · LAHORE
        </span>
        <div className="h-px w-12 bg-gray-300" />
      </div>
    </section>
  );
}
