// ──────────────────────────────────────────────
// SANAAT — Stock Status Logic (Single Source of Truth)
// ──────────────────────────────────────────────

import type { Product, ProductVariant, ProductWithRelations, DisplayStatus } from '../types';

/**
 * Get total stock across all variants
 */
export function getTotalStock(variants: ProductVariant[]): number {
  return variants.reduce((sum, v) => sum + v.stock_quantity, 0);
}

/**
 * Check if a pre-order window is currently open
 */
export function isPreorderOpen(product: Pick<Product, 'is_preorder' | 'preorder_closes_at'>): boolean {
  if (!product.is_preorder) return false;
  if (!product.preorder_closes_at) return true; // No close date = open indefinitely
  return new Date(product.preorder_closes_at) > new Date();
}

/**
 * Check if pre-order limit has been reached
 * (In a real implementation, this would check against actual order counts)
 */
export function isPreorderLimitReached(
  _product: Pick<Product, 'preorder_limit'>,
  _currentPreorderCount: number = 0
): boolean {
  if (!_product.preorder_limit) return false;
  return _currentPreorderCount >= _product.preorder_limit;
}

/**
 * Derive display status from product data.
 * This is the SINGLE SOURCE OF TRUTH for status display.
 */
export function getDisplayStatus(
  product: Pick<Product, 'status' | 'is_published' | 'is_preorder' | 'preorder_closes_at' | 'preorder_limit' | 'low_stock_threshold'>,
  variants: ProductVariant[],
  preorderCount: number = 0
): DisplayStatus {
  // Explicit states first
  if (product.status === 'draft' || !product.is_published) return 'draft';
  if (product.status === 'archived') return 'archived';

  // Pre-order check
  if (product.is_preorder && isPreorderOpen(product) && !isPreorderLimitReached(product, preorderCount)) {
    return 'preorder';
  }

  // Stock-based status
  const totalStock = getTotalStock(variants);
  if (totalStock === 0) return 'out_of_stock';
  if (totalStock <= product.low_stock_threshold) return 'low_stock';
  return 'available';
}

/**
 * Check if a product is purchasable (can be added to cart)
 */
export function isPurchasable(
  product: Pick<Product, 'status' | 'is_published' | 'is_preorder' | 'preorder_closes_at' | 'preorder_limit' | 'low_stock_threshold'>,
  variants: ProductVariant[],
  preorderCount: number = 0
): boolean {
  const status = getDisplayStatus(product, variants, preorderCount);
  return status === 'available' || status === 'low_stock' || status === 'preorder';
}

/**
 * Check if a specific variant (size) is purchasable
 */
export function isVariantPurchasable(
  product: Pick<Product, 'status' | 'is_published' | 'is_preorder' | 'preorder_closes_at' | 'preorder_limit' | 'low_stock_threshold'>,
  variant: ProductVariant,
  preorderCount: number = 0
): boolean {
  if (product.status === 'draft' || !product.is_published || product.status === 'archived') {
    return false;
  }

  // Pre-order products are purchasable regardless of stock
  if (product.is_preorder && isPreorderOpen(product) && !isPreorderLimitReached(product, preorderCount)) {
    return true;
  }

  return variant.stock_quantity > 0;
}

/**
 * Get maximum quantity a customer can add for a variant
 */
export function getMaxQuantity(
  product: Pick<Product, 'is_preorder' | 'preorder_closes_at' | 'preorder_limit'>,
  variant: ProductVariant,
  preorderCount: number = 0
): number {
  if (product.is_preorder && isPreorderOpen(product)) {
    if (product.preorder_limit) {
      return Math.max(0, product.preorder_limit - preorderCount);
    }
    return 99; // No limit
  }
  return variant.stock_quantity;
}

/**
 * Get human-readable status label
 */
export function getStatusLabel(status: DisplayStatus): string {
  switch (status) {
    case 'draft': return 'Draft';
    case 'preorder': return 'Pre-Order';
    case 'available': return 'Available';
    case 'low_stock': return 'Low Stock';
    case 'out_of_stock': return 'Out of Stock';
    case 'archived': return 'Archived';
  }
}

/**
 * Get status badge color class
 */
export function getStatusBadgeClass(status: DisplayStatus): string {
  switch (status) {
    case 'draft': return 'bg-gray-100 text-gray-700';
    case 'preorder': return 'bg-plum text-white';
    case 'available': return 'bg-gray-900 text-white';
    case 'low_stock': return 'bg-amber-50 text-amber-800';
    case 'out_of_stock': return 'bg-gray-100 text-gray-500';
    case 'archived': return 'bg-gray-100 text-gray-400';
  }
}

/**
 * Check if product is visible on storefront
 */
export function isStorefrontVisible(product: Pick<Product, 'status' | 'is_published'>): boolean {
  return product.is_published && product.status === 'active';
}

/**
 * Get low stock message
 */
export function getLowStockMessage(variants: ProductVariant[], threshold: number): string | null {
  const total = getTotalStock(variants);
  if (total > 0 && total <= threshold) {
    return `Only ${total} left`;
  }
  return null;
}

/**
 * Summarize stock status for a product (used in product page)
 */
export function getProductStockSummary(product: ProductWithRelations, preorderCount: number = 0) {
  const displayStatus = getDisplayStatus(product, product.variants, preorderCount);
  const totalStock = getTotalStock(product.variants);
  const purchasable = isPurchasable(product, product.variants, preorderCount);
  const lowStockMsg = getLowStockMessage(product.variants, product.low_stock_threshold);

  return {
    displayStatus,
    totalStock,
    purchasable,
    lowStockMessage: lowStockMsg,
    statusLabel: getStatusLabel(displayStatus),
    isPreorder: displayStatus === 'preorder',
    isOutOfStock: displayStatus === 'out_of_stock',
    ctaLabel: displayStatus === 'preorder'
      ? 'PRE-ORDER NOW'
      : displayStatus === 'out_of_stock'
        ? 'OUT OF STOCK'
        : 'ADD TO CART',
  };
}
