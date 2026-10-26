import { formatPrice } from '../../utils';
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '../../content/site-config';
import { AlertCircle } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  hasPreorderItems: boolean;
  className?: string;
}

export function CartSummary({ subtotal, hasPreorderItems, className = '' }: CartSummaryProps) {
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = isFreeShipping ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  return (
    <div className={`bg-gray-50 p-6 space-y-4 ${className}`}>
      <h3 className="text-sm uppercase tracking-widest font-semibold text-black border-b border-gray-200 pb-3">
        Order Summary
      </h3>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-black">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping (Pakistan)</span>
          <span className="font-medium text-black">
            {isFreeShipping ? (
              <span className="text-emerald-700 uppercase font-semibold">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {!isFreeShipping && (
          <p className="text-[11px] text-gray-500 pt-1">
            Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
          </p>
        )}
      </div>

      <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-sm font-semibold text-black">
        <span>Estimated Total</span>
        <span className="text-base font-serif tracking-wide">{formatPrice(total)}</span>
      </div>

      {hasPreorderItems && (
        <div className="bg-plum/5 border border-plum/20 p-3 flex gap-2 items-start text-xs text-plum">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">
            Your bag contains pre-order items. These will be dispatched once production is complete.
          </p>
        </div>
      )}
    </div>
  );
}
