// ──────────────────────────────────────────────
// SANAAT — Size Selector
// ──────────────────────────────────────────────

import type { ProductVariant } from '../../types';
import { cn } from '../../utils';

interface SizeSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onSelect: (variantId: string) => void;
  /** True when the entire product is out of stock / unpurchasable */
  disabled?: boolean;
}

export function SizeSelector({
  variants,
  selectedVariantId,
  onSelect,
  disabled = false,
}: SizeSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <fieldset className="space-y-2" disabled={disabled}>
      <legend className="text-[11px] font-medium uppercase tracking-widest text-gray-500">
        Size
      </legend>

      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const soldOut = variant.stock_quantity === 0;
          const isSelected = variant.id === selectedVariantId;
          const isDisabled = disabled || soldOut;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(variant.id)}
              className={cn(
                'relative flex h-9 min-w-[2.75rem] items-center justify-center border px-3 text-xs font-semibold uppercase tracking-wider transition-colors',
                isSelected && !isDisabled
                  ? 'border-plum bg-plum text-white'
                  : 'border-gray-200 bg-white text-black hover:border-black',
                isDisabled && 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
              )}
              aria-label={`Size ${variant.size}${soldOut ? ' — sold out' : ''}`}
            >
              {variant.size}

              {/* Diagonal strike-through for sold-out sizes */}
              {soldOut && (
                <span aria-hidden="true" className="absolute inset-0 pointer-events-none">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
                    <line
                      x1="0"
                      y1="100"
                      x2="100"
                      y2="0"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-gray-300"
                    />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
