import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct, useRelatedProducts } from '../hooks/use-products';
import { useCartStore } from '../store/cart';
import { formatPrice } from '../utils';
import {
  getProductStockSummary,
  isVariantPurchasable,
  getMaxQuantity,
} from '../utils/stock';
import {
  ProductGallery,
  SizeSelector,
  QuantitySelector,
  StockBadge,
  ProductCard,
} from '../components/product';
import { Button, Accordion, Modal, Skeleton } from '../components/ui';
import { SEO, EmptyState } from '../components/common';
import { sizeGuide, careInstructions, shippingInfo } from '../content/site-content';
import { Ruler, Truck, ShieldCheck, Clock } from 'lucide-react';
import type { CartItem } from '../types';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || '');
  const { data: relatedProducts } = useRelatedProducts(
    product?.id || '',
    product?.category_id || null,
    4
  );

  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  // Auto-select first in-stock variant when product loads
  useEffect(() => {
    if (product && product.variants.length > 0) {
      const firstAvailable = product.variants.find((v) => v.stock_quantity > 0);
      setSelectedVariantId(firstAvailable ? firstAvailable.id : product.variants[0].id);
      setQuantity(1);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <Skeleton className="aspect-[3/4] w-full" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center">
        <SEO title="Product Not Found | SANAAT" />
        <EmptyState
          title="Product not found"
          description="The piece you are looking for may have been archived or removed from the catalog."
          actionLabel="Return to Shop"
          actionHref="/shop"
        />
      </div>
    );
  }

  const stockSummary = getProductStockSummary(product);
  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const isSelectedVariantPurchasable = selectedVariant
    ? isVariantPurchasable(product, selectedVariant)
    : false;

  const maxQty = selectedVariant ? getMaxQuantity(product, selectedVariant) : 1;

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
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SEO
        title={`${product.name} | SANAAT`}
        description={product.description || 'Modest contemporary fashion crafted in Pakistan.'}
        image={product.images[0]?.url}
      />

      {/* Breadcrumb */}
      <nav className="text-xs uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-black transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span className="text-black font-medium">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left: Gallery (Large & Sticky on desktop) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right: Info Column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <StockBadge status={stockSummary.displayStatus} />
                {stockSummary.lowStockMessage && (
                  <span className="text-xs text-amber-800 font-medium tracking-wide">
                    {stockSummary.lowStockMessage}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-black tracking-wide leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-xl sm:text-2xl font-serif text-black font-medium">
                  {formatPrice(product.price)}
                </span>
                {product.compare_at_price && product.compare_at_price > product.price && (
                  <span className="text-sm text-gray-400 line-through font-serif">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
              </div>
            </div>

            {/* Pre-order Details Banner */}
            {product.is_preorder && (
              <div className="bg-plum/5 border border-plum/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum">
                  <Clock className="w-4 h-4" />
                  <span>Pre-Order Window</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  This design is crafted upon order.
                  {product.estimated_dispatch_date
                    ? ` Estimated dispatch: ${new Date(product.estimated_dispatch_date).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' })}`
                    : ' Estimated dispatch: To be announced upon completion of the artisan run.'}
                </p>
              </div>
            )}

            {/* Size Selector + Size Guide Link */}
            {product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider">
                  <span className="font-medium text-black">Select Size</span>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-gray-500 hover:text-plum transition-colors underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide</span>
                  </button>
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

            {/* Quantity Selector */}
            {!stockSummary.isOutOfStock && (
              <div className="space-y-2 pt-2">
                <span className="text-xs uppercase tracking-wider font-medium text-black block">
                  Quantity
                </span>
                <QuantitySelector
                  quantity={quantity}
                  max={maxQty}
                  onChange={setQuantity}
                />
              </div>
            )}

            {/* Primary Action Button */}
            <div className="pt-4">
              <Button
                variant={stockSummary.isPreorder ? 'primary' : 'secondary'}
                size="lg"
                fullWidth
                disabled={stockSummary.isOutOfStock || !isSelectedVariantPurchasable}
                onClick={handleAddToCart}
                className="py-4 text-xs tracking-[0.2em]"
              >
                {stockSummary.ctaLabel}
              </Button>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-plum flex-shrink-0" />
                <span>Nationwide Express Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-plum flex-shrink-0" />
                <span>100% Authentic Handcraft</span>
              </div>
            </div>

            {/* Expandable Accordions */}
            <div className="pt-2 divide-y divide-gray-100">
              {product.description && (
                <Accordion title="Design & Silhouette" defaultOpen>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </Accordion>
              )}

              {product.fabric && (
                <Accordion title="Fabric & Material">
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {product.fabric}
                  </p>
                </Accordion>
              )}

              <Accordion title="Care Instructions">
                <div className="text-xs sm:text-sm text-gray-600 leading-relaxed space-y-2">
                  <p>{product.care_instructions || 'Dry clean recommended.'}</p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-500 pt-1">
                    {careInstructions.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Accordion>

              <Accordion title="Shipping & Returns">
                <div className="text-xs sm:text-sm text-gray-600 space-y-2 leading-relaxed">
                  <p><strong>Domestic:</strong> {shippingInfo.deliveryTime}</p>
                  <p>{shippingInfo.internationalNote}</p>
                  <p className="text-xs text-gray-500 pt-1">{shippingInfo.returnsPolicy}</p>
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 p-3 flex items-center justify-between gap-4 lg:hidden shadow-lg">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider line-clamp-1">
            {product.name}
          </div>
          <div className="font-serif text-sm font-semibold text-black">
            {formatPrice(product.price)}
          </div>
        </div>
        <Button
          variant={stockSummary.isPreorder ? 'primary' : 'secondary'}
          size="sm"
          disabled={stockSummary.isOutOfStock || !isSelectedVariantPurchasable}
          onClick={handleAddToCart}
          className="text-xs tracking-wider min-w-[140px]"
        >
          {stockSummary.ctaLabel}
        </Button>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-24 pt-12 border-t border-gray-100">
          <div className="text-center mb-10">
            <span className="text-[11px] uppercase tracking-[0.25em] text-plum font-sans font-medium">
              Complete the Look
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-black mt-1">
              Complementary Pieces
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Size Guide Modal */}
      <Modal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        title={sizeGuide.heading}
        size="lg"
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-gray-500">{sizeGuide.note}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  {sizeGuide.headers.map((h, i) => (
                    <th key={i} className="py-2.5 px-3 uppercase tracking-wider font-semibold text-black">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sizeGuide.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-gray-50">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-2 px-3 text-gray-700 font-medium">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </div>
  );
}
