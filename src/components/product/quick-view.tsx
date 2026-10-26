import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { ProductWithRelations, CartItem } from '../../types';
import { formatPrice } from '../../utils';
import { getProductStockSummary, isVariantPurchasable, getMaxQuantity } from '../../utils/stock';
import { Modal, Button } from '../ui';
import { SafeImage } from '../common';
import { SizeSelector } from './size-selector';
import { QuantitySelector } from './quantity-selector';
import { StockBadge } from './stock-badge';
import { useCartStore } from '../../store/cart';

interface QuickViewProps {
  product: ProductWithRelations;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Set default selected variant
  useEffect(() => {
    if (product.variants.length > 0) {
      // Find first in-stock variant or fallback to first
      const firstAvailable = product.variants.find((v) => v.stock_quantity > 0);
      setSelectedVariantId(firstAvailable ? firstAvailable.id : product.variants[0].id);
      setQuantity(1);
    }
  }, [product, isOpen]);

  const stockSummary = getProductStockSummary(product);
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const isSelectedVariantPurchasable = selectedVariant
    ? isVariantPurchasable(product, selectedVariant)
    : false;

  const maxQty = selectedVariant
    ? getMaxQuantity(product, selectedVariant)
    : 1;

  const handleAddToCart = () => {
    if (!selectedVariant || !isSelectedVariantPurchasable) return;

    const cartItem: CartItem = {
      product_id: product.id,
      variant_id: selectedVariant.id,
      product_name: product.name,
      product_slug: product.slug,
      size: selectedVariant.size,
      unit_price: product.price,
      quantity,
      image_url: product.images[0]?.url || null,
      is_preorder: product.is_preorder,
      max_quantity: maxQty,
    };

    addItem(cartItem);
    onClose();
  };

  const primaryImage = product.images[0]?.url || null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Quick View">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          <SafeImage
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <StockBadge status={stockSummary.displayStatus} />
              <h2 className="text-xl font-serif mt-2 tracking-wide text-black">{product.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-medium text-black">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>
            </div>

            {product.description && (
              <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                {product.description}
              </p>
            )}

            {product.variants.length > 0 && (
              <div className="pt-2">
                <div className="text-xs uppercase tracking-wider font-medium text-gray-700 mb-2">
                  Select Size
                </div>
                <SizeSelector
                  variants={product.variants}
                  selectedVariantId={selectedVariantId}
                  onSelect={(id) => {
                    setSelectedVariantId(id);
                    setQuantity(1);
                  }}
                  disabled={stockSummary.isOutOfStock}
                />
              </div>
            )}

            {!stockSummary.isOutOfStock && (
              <div className="pt-2">
                <div className="text-xs uppercase tracking-wider font-medium text-gray-700 mb-2">
                  Quantity
                </div>
                <QuantitySelector
                  quantity={quantity}
                  max={maxQty}
                  onChange={setQuantity}
                />
              </div>
            )}
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-100">
            <Button
              variant={stockSummary.isPreorder ? 'primary' : 'secondary'}
              fullWidth
              disabled={stockSummary.isOutOfStock || !isSelectedVariantPurchasable}
              onClick={handleAddToCart}
            >
              {stockSummary.ctaLabel}
            </Button>

            <Link
              to={`/product/${product.slug}`}
              onClick={onClose}
              className="block text-center text-xs tracking-wider uppercase text-gray-500 hover:text-plum transition-colors"
            >
              View Full Product Details →
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
