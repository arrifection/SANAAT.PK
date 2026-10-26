import { Link } from 'react-router-dom';
import { Trash2, AlertCircle } from 'lucide-react';
import type { CartItem as CartItemType } from '../../types';
import { formatPrice } from '../../utils';
import { SafeImage } from '../common';
import { Badge } from '../ui';
import { QuantitySelector } from '../product';
import { useCartStore } from '../../store/cart';

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      {/* Thumbnail */}
      <Link
        to={`/product/${item.product_slug}`}
        className="relative w-20 h-24 flex-shrink-0 bg-gray-50 overflow-hidden"
      >
        <SafeImage
          src={item.image_url}
          alt={item.product_name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              to={`/product/${item.product_slug}`}
              className="font-serif text-sm sm:text-base text-black hover:text-plum transition-colors line-clamp-1"
            >
              {item.product_name}
            </Link>
            <button
              onClick={() => removeItem(item.variant_id)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1 -mr-1"
              aria-label={`Remove ${item.product_name} from cart`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500 uppercase tracking-wider">
              Size: <strong className="text-black font-medium">{item.size}</strong>
            </span>
            {item.is_preorder && (
              <Badge variant="plum" className="text-[9px] px-1.5 py-0.5">
                Pre-Order
              </Badge>
            )}
          </div>

          <div className="text-xs font-medium text-black mt-1">
            {formatPrice(item.unit_price)}
          </div>
        </div>

        {/* Quantity Controls & Line Total */}
        <div className="flex justify-between items-center mt-3 pt-2">
          <QuantitySelector
            quantity={item.quantity}
            max={item.max_quantity}
            onChange={(qty) => updateQuantity(item.variant_id, qty)}
            className="scale-90 origin-left"
          />

          <div className="text-xs font-semibold text-black">
            {formatPrice(item.unit_price * item.quantity)}
          </div>
        </div>

        {item.is_preorder && (
          <div className="flex items-center gap-1 mt-2 text-[10px] text-plum">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />
            <span>Ships when pre-order production completes</span>
          </div>
        )}
      </div>
    </div>
  );
}
