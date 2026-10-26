import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { SafeImage } from '../common/safe-image';
import { Spinner } from '../ui/spinner';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
}

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

function formatPrice(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}

function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    // Search will be connected to product service
    // For now, results remain empty until the service layer is built
    const searchTimeout = setTimeout(() => {
      if (!cancelled) {
        setResults([]);
        setIsLoading(false);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(searchTimeout);
    };
  }, [debouncedQuery]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="mx-auto max-w-3xl px-4 pt-6">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
          <Search className="h-5 w-5 shrink-0 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products..."
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

          {!isLoading && debouncedQuery.trim() && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-500">
                No results found for &ldquo;{debouncedQuery}&rdquo;
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={onClose}
                  className="group"
                >
                  <SafeImage
                    src={product.images[0] ?? ''}
                    alt={product.name}
                    aspectRatio="3/4"
                    className="mb-2 transition-opacity group-hover:opacity-90"
                  />
                  <h4 className="text-sm font-medium text-black">{product.name}</h4>
                  <p className="text-sm text-gray-500">{formatPrice(product.price)}</p>
                </Link>
              ))}
            </div>
          )}

          {!debouncedQuery.trim() && (
            <div className="py-12 text-center">
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Start typing to search
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
