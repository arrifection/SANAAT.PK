import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cart';
import { formatPrice } from '../../utils';
import { Drawer, Button } from '../ui';
import { CartItem } from './cart-item';

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const hasPreorderItems = useCartStore((state) => state.hasPreorderItems);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeCart}
      title={`Your Bag (${totalItems})`}
      width="md"
    >
      <div className="flex flex-col h-[calc(100vh-130px)] justify-between">
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-black">Your bag is empty</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                Explore our modest fashion silhouettes crafted with heritage textiles.
              </p>
            </div>
            <Link to="/shop" onClick={closeCart}>
              <Button variant="secondary" size="sm" className="mt-2 text-xs tracking-widest">
                START SHOPPING
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Scrollable Items */}
            <div className="flex-1 overflow-y-auto px-1 py-2 divide-y divide-gray-100">
              {items.map((item) => (
                <CartItem key={item.variant_id} item={item} />
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-gray-100 pt-4 space-y-3 bg-white">
              {hasPreorderItems && (
                <p className="text-[11px] text-plum bg-plum/5 p-2 text-center">
                  Contains pre-order items. Dispatched when crafted.
                </p>
              )}

              <div className="flex justify-between items-center text-sm font-semibold text-black">
                <span className="uppercase tracking-wider text-xs">Subtotal</span>
                <span className="font-serif text-base">{formatPrice(totalPrice)}</span>
              </div>

              <p className="text-[11px] text-gray-500 text-center">
                Shipping calculated at checkout
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link to="/cart" onClick={closeCart} className="w-full">
                  <Button variant="outline" fullWidth size="md" className="text-xs tracking-widest">
                    VIEW BAG
                  </Button>
                </Link>
                <Link to="/checkout" onClick={closeCart} className="w-full">
                  <Button variant="primary" fullWidth size="md" className="text-xs tracking-widest">
                    CHECKOUT
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
