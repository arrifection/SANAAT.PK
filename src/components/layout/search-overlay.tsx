import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Spinner } from '../ui/spinner';
import { useSearchProducts } from '../../hooks/use-products';
import { formatPrice } from '../../utils';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Connect to real product service — fixes 0-results bug
  const { data: results, isLoading } = useSearchProducts(debouncedQuery.trim(), 12);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-white overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="mx-auto max-w-3xl px-4 pt-6 pb-16">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <Search className="h-5 w-5 shrink-0 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by name, color or collection..."
            className="flex-1 bg-transparent text-lg text-black placeholder:text-gray-400 focus:outline-none"
            aria-label="Search products"
          />
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 transition-colors hover:text-black"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-8">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Spinner size="md" />
            </div>
          )}

          {!isLoading && debouncedQuery.trim() && (!results || results.length === 0) && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500 font-sans">
                No results found for &ldquo;{debouncedQuery}&rdquo;
              </p>
              <p className="text-xs text-gray-400 mt-1 font-sans">
                Try a different name, color or collection.
              </p>
            </div>
          )}

          {!isLoading && results && results.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-2">
                    {product.images[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt_text ?? product.name}
                        className="h-full w-full object-cover transition-opacity group-hover:opacity-90"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100">
                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-serif text-black group-hover:text-[#6C255D] transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-sans mt-0.5">{formatPrice(product.price)}</p>
                </Link>
              ))}
            </div>
          )}

          {!debouncedQuery.trim() && (
            <div className="py-12 text-center">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-sans">
                Start typing to search Sanaat
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { SearchOverlay };
export type { SearchOverlayProps };
