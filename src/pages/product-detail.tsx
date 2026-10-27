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
  SizeChartModal,
} from '../components/product';
import { Button, Accordion, Skeleton } from '../components/ui';
import { SEO, EmptyState } from '../components/common';
import { shippingPolicy, exchangePolicy } from '../content/site-content';
import { PREORDER_POLICY } from '../content/site-config';
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
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
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

  // Derive color from tags or details
  const colorTag = product.tags?.find((t) =>
    ['Plum', 'Ivory', 'Sage', 'Charcoal', 'Emerald', 'Blush', 'Black', 'White'].includes(t)
  ) || product.fabric?.split(' ')[0] || 'Sanaat Palette';

  const handleAddToCart = () => {
    if (!selectedVariant || !isSelectedVariantPurchasable) return;

    const cartItem: CartItem = {
      product_id: product.id,
      variant_id: selectedVariant.id,
      product_name: product.name,
      product_slug: product.slug,
      size: selectedVariant.size, // Size selected here, never asked again at checkout
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

      {/* Breadcrumb Navigation */}
      <nav className="text-xs uppercase tracking-wider text-gray-400 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-black transition-colors">
          Shop
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              to={`/category/${product.category.slug}`}
              className="hover:text-black transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-black font-medium">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left: Gallery (Large Image Gallery supporting up to 3 images) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images.slice(0, 3)} productName={product.name} />
        </div>

        {/* Right: Info Column */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              {/* Status and collection tag */}
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <StockBadge status={stockSummary.displayStatus} />
                {product.category && (
                  <Link
                    to={`/category/${product.category.slug}`}
                    className="text-[11px] font-sans uppercase tracking-widest text-gray-500 hover:text-plum transition-colors"
                  >
                    {product.category.name}
                  </Link>
                )}
                {stockSummary.lowStockMessage && (
                  <span className="text-xs text-amber-800 font-medium tracking-wide">
                    {stockSummary.lowStockMessage}
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-black tracking-wide leading-tight font-normal">
                {product.name}
              </h1>

              {/* Price */}
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

              {/* Product Specifications: Color, Fabric, Fabric Care (Section 13, 14, 22) */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 uppercase tracking-wider text-[11px] w-24">Color:</span>
                  <span className="font-medium text-black">{product.color || colorTag}</span>
                </div>
                {product.fabric && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 uppercase tracking-wider text-[11px] w-24">Fabric:</span>
                    <span className="font-medium text-black">{product.fabric}</span>
                  </div>
                )}
                {(product.fabric_care || product.care_instructions) && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 uppercase tracking-wider text-[11px] w-24">Fabric Care:</span>
                    <span className="font-medium text-black">{product.fabric_care || product.care_instructions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Short Description */}
            {product.description && (
              <p className="text-xs sm:text-sm font-sans text-gray-600 leading-relaxed font-light">
                {product.description}
              </p>
            )}

            {/* Pre-order Details Banner strictly per Section 9 */}
            {product.is_preorder && (
              <div className="bg-plum/5 border border-plum/30 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-plum">
                  <Clock className="w-4 h-4" />
                  <span>PRE-ORDER</span>
                </div>
                <p className="text-xs font-sans text-gray-800 font-medium">
                  Preparation time: <strong className="text-black font-semibold">{PREORDER_POLICY.preparationTime}</strong>
                </p>
                <p className="text-[11px] font-sans text-gray-600">
                  Each piece is tailored especially for you and dispatched after careful artisan quality inspection.
                </p>
              </div>
            )}

            {/* Size Selector + "SEE SIZE CHART" Link (Section 6 & 7) */}
            {product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs uppercase tracking-wider">
                  <span className="font-medium text-black">Select Size</span>
                  <button
                    type="button"
                    onClick={() => setSizeChartOpen(true)}
                    className="flex items-center gap-1.5 text-black hover:text-plum transition-colors font-medium underline tracking-widest text-[11px]"
                  >
                    <Ruler className="w-3.5 h-3.5 text-plum" />
                    <span>SEE SIZE CHART</span>
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

            {/* Primary Action Button (Add to Cart / Pre-order) */}
            <div className="pt-2">
              <Button
                variant={stockSummary.isPreorder ? 'primary' : 'secondary'}
                size="lg"
                fullWidth
                disabled={stockSummary.isOutOfStock || !isSelectedVariantPurchasable}
                onClick={handleAddToCart}
                className="py-4 text-xs font-sans tracking-[0.2em] font-medium"
              >
                {stockSummary.isPreorder ? 'PRE-ORDER NOW' : stockSummary.ctaLabel}
              </Button>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-plum flex-shrink-0" />
                <span>Punjab Rs. 250 · Outside Rs. 350</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-plum flex-shrink-0" />
                <span>Modest Artisanal Craft</span>
              </div>
            </div>

            {/* Expandable Accordions for Details, Shipping & Exchanges */}
            <div className="pt-2 divide-y divide-gray-100">
              {product.details && (
                <Accordion title="Product Details" defaultOpen>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light">
                    {product.details}
                  </p>
                </Accordion>
              )}

              {product.fabric && (
                <Accordion title="Fabric & Care">
                  <div className="text-xs sm:text-sm text-gray-600 space-y-2 font-light">
                    <p><strong className="text-black font-medium">Fabric:</strong> {product.fabric}</p>
                    <p><strong className="text-black font-medium">Care:</strong> {product.care_instructions || 'Dry clean recommended.'}</p>
                  </div>
                </Accordion>
              )}

              {/* Shipping Policy Accordion (Section 11) */}
              <Accordion title="Shipping Information">
                <div className="text-xs sm:text-sm text-gray-600 space-y-2 leading-relaxed font-light">
                  <p className="font-serif italic text-black font-medium">
                    &ldquo;{shippingPolicy.tagline}&rdquo;
                  </p>
                  <p>We deliver across Pakistan:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Punjab:</strong> Rs. 250</li>
                    <li><strong>Outside Punjab (Sindh, KPK, Balochistan, ICT, etc.):</strong> Rs. 350</li>
                  </ul>
                  <p className="text-[11px] text-gray-500 pt-1">
                    Shipping is added automatically at checkout based on your address.
                  </p>
                </div>
              </Accordion>

              {/* Exchange Policy Accordion (Section 10) */}
              <Accordion title="Exchange Policy">
                <div className="text-xs sm:text-sm text-gray-600 space-y-2 leading-relaxed font-light">
                  <p className="font-serif italic text-black font-medium">
                    &ldquo;{exchangePolicy.tagline}&rdquo;
                  </p>
                  <p>{exchangePolicy.paragraphs[0]}</p>
                  <p className="font-semibold text-black text-xs pt-1">
                    {exchangePolicy.paragraphs[1]}
                  </p>
                </div>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 p-3 flex items-center justify-between gap-4 lg:hidden shadow-lg">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wider line-clamp-1 font-sans">
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
          className="text-xs tracking-wider min-w-[140px] font-sans"
        >
          {stockSummary.isPreorder ? 'PRE-ORDER' : stockSummary.ctaLabel}
        </Button>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-gray-100">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[10px] uppercase tracking-[0.25em] text-plum font-sans font-medium">
              You May Also Love
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-black mt-1 font-normal">
              Complementary Pieces
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Global Size Chart Modal per Section 7 & 17 */}
      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        productType={product.product_type}
      />
    </div>
  );
}
