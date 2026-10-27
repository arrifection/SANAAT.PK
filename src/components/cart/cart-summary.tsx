import { formatPrice } from '../../utils';
import { SHIPPING_RATES, PREORDER_POLICY } from '../../content/site-config';
import { AlertCircle, Truck } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  hasPreorderItems: boolean;
  className?: string;
}

export function CartSummary({ subtotal, hasPreorderItems, className = '' }: CartSummaryProps) {
  return (
    <div className={`bg-gray-50 p-6 space-y-4 border border-gray-200 ${className}`}>
      <h3 className="text-xs uppercase tracking-widest font-semibold text-black border-b border-gray-200 pb-3 font-sans">
        Order Summary
      </h3>

      <div className="space-y-2 text-xs font-sans">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-black">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Nationwide Shipping</span>
          <span className="font-medium text-black">
            Rs. {SHIPPING_RATES.punjab} / Rs. {SHIPPING_RATES.outsidePunjab}
          </span>
        </div>

        <p className="text-[11px] text-gray-500 pt-0.5 flex items-center gap-1 font-light">
          <Truck className="w-3.5 h-3.5 text-plum inline flex-shrink-0" />
          <span>Punjab Rs. 250 · Outside Punjab Rs. 350 (applied at checkout)</span>
        </p>
      </div>

      <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-sm font-semibold text-black">
        <span>Estimated Total</span>
        <span className="text-base font-serif text-plum tracking-wide">{formatPrice(subtotal)}*</span>
      </div>

      {hasPreorderItems && (
        <div className="bg-plum/5 border border-plum/20 p-3 flex gap-2 items-start text-xs text-plum">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p className="leading-snug text-[11px] font-sans">
            Your bag contains pre-order pieces ({PREORDER_POLICY.preparationTime}).
          </p>
        </div>
      )}
    </div>
  );
}
