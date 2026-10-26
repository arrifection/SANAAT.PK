// ──────────────────────────────────────────────
// SANAAT — Quantity Selector
// ──────────────────────────────────────────────

import { Minus, Plus } from 'lucide-react';
import { cn } from '../../utils';

interface QuantitySelectorProps {
  value?: number;
  quantity?: number;
  min?: number;
  max: number;
  onChange: (qty: number) => void;
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  value,
  quantity,
  min = 1,
  max,
  onChange,
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const currentVal = value !== undefined ? value : quantity !== undefined ? quantity : 1;
  const canDecrement = !disabled && currentVal > min;
  const canIncrement = !disabled && currentVal < max;

  return (
    <div className={cn('inline-flex items-center border border-gray-200 bg-white', className)}>
      <button
        type="button"
        disabled={!canDecrement}
        onClick={() => onChange(Math.max(min, currentVal - 1))}
        className={cn(
          'flex h-9 w-9 items-center justify-center transition-colors',
          canDecrement ? 'text-black hover:bg-gray-50' : 'cursor-not-allowed text-gray-300'
        )}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </button>

      <span
        className={cn(
          'flex h-9 w-9 items-center justify-center border-x border-gray-200 text-xs font-medium tabular-nums',
          disabled && 'text-gray-300'
        )}
        aria-live="polite"
        aria-label={`Quantity: ${currentVal}`}
      >
        {currentVal}
      </span>

      <button
        type="button"
        disabled={!canIncrement}
        onClick={() => onChange(Math.min(max, currentVal + 1))}
        className={cn(
          'flex h-9 w-9 items-center justify-center transition-colors',
          canIncrement ? 'text-black hover:bg-gray-50' : 'cursor-not-allowed text-gray-300'
        )}
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
