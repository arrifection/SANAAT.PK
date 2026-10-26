import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cart';
import { CartItem, CartSummary } from '../components/cart';
import { Button } from '../components/ui';
import { EmptyState, SEO } from '../components/common';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const hasPreorderItems = useCartStore((state) => state.hasPreorderItems);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO title="Your Bag | SANAAT" description="Review items in your shopping bag before proceeding to checkout." />

      <div className="flex justify-between items-baseline mb-8 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-4xl font-serif tracking-wide text-black">
            Shopping Bag
          </h1>
          <p className="text-xs uppercase tracking-widest text-gray-500 mt-1">
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'} Selected
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs uppercase tracking-wider text-gray-400 hover:text-red-600 transition-colors"
          >
            Clear Bag
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="py-16 text-center">
          <EmptyState
            icon={ShoppingBag}
            title="Your bag is currently empty"
            description="You have not added any silhouettes to your shopping bag yet."
            actionLabel="Discover Collection"
            actionHref="/shop"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-8 divide-y divide-gray-100">
            {items.map((item) => (
              <CartItem key={item.variant_id} item={item} />
            ))}

            <div className="pt-6 flex justify-between items-center">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <CartSummary subtotal={totalPrice} hasPreorderItems={hasPreorderItems} />

              <Link to="/checkout" className="block w-full">
                <Button variant="primary" size="lg" fullWidth className="text-xs tracking-widest py-4">
                  PROCEED TO CHECKOUT
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
