// ──────────────────────────────────────────────
// SANAAT — Product Image Gallery
// ──────────────────────────────────────────────

import { useState, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage } from '../../types';
import { cn } from '../../utils';
import { SafeImage } from '../common';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const count = images.length;
  const hasImages = count > 0;

  const goTo = useCallback(
    (idx: number) => {
      setActiveIndex((idx + count) % count);
    },
    [count],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPos({ x, y });
    },
    [],
  );

  /** Scroll mobile carousel to a dot index */
  const scrollToSlide = useCallback((idx: number) => {
    if (!scrollRef.current) return;
    const child = scrollRef.current.children[idx] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    setActiveIndex(idx);
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const slideWidth = el.offsetWidth;
    const idx = Math.round(el.scrollLeft / slideWidth);
    setActiveIndex(idx);
  }, []);

  /* ── Fallback: no images ── */
  if (!hasImages) {
    return (
      <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center">
        <span className="text-sm text-gray-400 uppercase tracking-widest">
          No Image
        </span>
      </div>
    );
  }

  const activeImage = images[activeIndex];

  return (
    <div className="w-full">
      {/* ── Desktop layout: thumbnails left + main image ── */}
      <div className="hidden md:flex gap-3">
        {/* Thumbnails strip (vertical) */}
        {count > 1 && (
          <div className="flex flex-col gap-2 w-20 shrink-0 max-h-[680px] overflow-y-auto">
            {images.map((img, idx) => (
              <button
                key={img.id}
                type="button"
                onClick={() => goTo(idx)}
                className={cn(
                  'relative aspect-[3/4] w-full overflow-hidden border transition-all',
                  idx === activeIndex
                    ? 'border-black'
                    : 'border-transparent opacity-60 hover:opacity-100',
                )}
              >
                <SafeImage
                  src={img.url}
                  alt={img.alt_text ?? `${productName} ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image with zoom */}
        <div
          className="relative flex-1 aspect-[3/4] overflow-hidden bg-gray-50 cursor-zoom-in"
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <SafeImage
            src={activeImage.url}
            alt={activeImage.alt_text ?? productName}
            className={cn(
              'h-full w-full object-cover transition-transform duration-300 origin-center',
              zoomed && 'scale-150',
            )}
            style={
              zoomed
                ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                : undefined
            }
            loading="eager"
          />
        </div>
      </div>

      {/* ── Mobile layout: horizontal swipeable carousel ── */}
      <div className="md:hidden">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth scrollbar-none"
          >
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="aspect-[3/4] w-full shrink-0 snap-center bg-gray-50"
              >
                <SafeImage
                  src={img.url}
                  alt={img.alt_text ?? `${productName} ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>

          {/* Nav arrows */}
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => { goTo(activeIndex - 1); scrollToSlide((activeIndex - 1 + count) % count); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-white/80 text-black"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => { goTo(activeIndex + 1); scrollToSlide((activeIndex + 1) % count); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center bg-white/80 text-black"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Dot indicators */}
        {count > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToSlide(idx)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  idx === activeIndex
                    ? 'w-4 bg-black'
                    : 'w-1.5 bg-gray-300',
                )}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
