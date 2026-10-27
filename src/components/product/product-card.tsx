// ──────────────────────────────────────────────
// SANAAT — Product Card
// Fix: Image never disappears on hover (plain div wrappers, no SafeImage conflict)
// ──────────────────────────────────────────────

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import type { ProductWithRelations } from '../../types';
import { formatPrice, cn } from '../../utils';
import { getDisplayStatus, getTotalStock, getLowStockMessage } from '../../utils/stock';
import { Badge } from '../ui';
import { QuickView } from './quick-view';

interface ProductCardProps {
  product: ProductWithRelations;
  /** true for above-fold images (eager loading) */
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const displayStatus = getDisplayStatus(product, product.variants);
  const isOutOfStock = displayStatus === 'out_of_stock';
  const isPreorder = displayStatus === 'preorder';
  const lowStockMsg = getLowStockMessage(product.variants, product.low_stock_threshold);
  const totalStock = getTotalStock(product.variants);

  const primaryImage = product.images[0]?.url ?? null;
  const secondaryImage = product.images[1]?.url ?? null;
  const hasSecondImage = !!secondaryImage;

  const hasDiscount =
    product.compare_at_price !== null && product.compare_at_price > product.price;

  return (
    <>
      <article className="group relative">
        {/* Image container – 3:4 portrait ratio */}
        <Link
          to={`/product/${product.slug}`}
          className="block"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            className={cn(
              'relative aspect-[3/4] overflow-hidden bg-gray-100',
              isOutOfStock && 'opacity-60',
            )}
          >
            {/* Primary image — plain wrapper div: no absolute/relative class conflict with SafeImage */}
            <div
              className={cn(
                'absolute inset-0 transition-opacity duration-500',
                hovered && hasSecondImage ? 'opacity-0' : 'opacity-100',
              )}
            >
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={product.images[0]?.alt_text ?? product.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading={priority ? 'eager' : 'lazy'}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Secondary image (crossfade on hover) */}
            {hasSecondImage && (
              <div
                className={cn(
                  'absolute inset-0 transition-opacity duration-500',
                  hovered ? 'opacity-100' : 'opacity-0',
                )}
              >
                <img
                  src={secondaryImage}
                  alt={product.images[1]?.alt_text ?? `${product.name} alternate`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {isPreorder && (
                <Badge className="bg-[#6C255D] text-white text-[10px] tracking-widest uppercase px-2.5 py-1">
                  Pre-Order
                </Badge>
              )}
              {isOutOfStock && (
                <Badge className="bg-black text-white text-[10px] tracking-widest uppercase px-2.5 py-1">
                  Sold Out
                </Badge>
              )}
              {hasDiscount && !isOutOfStock && (
                <Badge className="bg-white text-black text-[10px] tracking-widest uppercase px-2.5 py-1 border border-gray-200">
                  Sale
                </Badge>
              )}
            </div>

            {/* Quick view — hidden on mobile (no hover), visible on desktop hover */}
            {!isOutOfStock && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickViewOpen(true);
                }}
                className="absolute bottom-3 right-3 z-10 hidden sm:flex h-9 w-9 items-center justify-center bg-white/90 text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-white"
                aria-label={`Quick view ${product.name}`}
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="mt-3 space-y-1">
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-serif text-sm leading-snug tracking-wide text-black transition-colors hover:text-[#6C255D]">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-sm font-medium',
                isOutOfStock ? 'text-gray-400' : 'text-black',
              )}
            >
              {formatPrice(product.price)}
            </span>

            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>

          {/* Low stock notice */}
          {!isOutOfStock && lowStockMsg && totalStock > 0 && (
            <p className="text-[11px] tracking-wide text-[#6C255D]">
              {lowStockMsg}
            </p>
          )}
        </div>
      </article>

      {/* Quick view modal */}
      {quickViewOpen && (
        <QuickView
          product={product}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
