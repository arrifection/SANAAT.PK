import { useState } from 'react';
import { useAdminProducts, useUpdateStock } from '../../hooks/use-products';
import { getDisplayStatus, getStatusBadgeClass, getStatusLabel } from '../../utils/stock';
import { Input, Select, Skeleton } from '../../components/ui';
import { SEO, SafeImage } from '../../components/common';
import { useToast } from '../../components/ui/toast';
import { Search, Plus, Minus } from 'lucide-react';
import type { DisplayStatus } from '../../types';

export function AdminInventoryPage() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<DisplayStatus | ''>('');
  const { data: result, isLoading } = useAdminProducts({ limit: 100 });
  const { mutateAsync: updateStock } = useUpdateStock();
  const { addToast } = useToast();

  const [savingVariantId, setSavingVariantId] = useState<string | null>(null);

  const products = result?.data || [];

  // Flatten product variants for inventory row representation
  const inventoryRows = products.flatMap((product) =>
    product.variants.map((variant) => ({
      product,
      variant,
      displayStatus: getDisplayStatus(product, product.variants),
    }))
  );

  const filteredRows = inventoryRows.filter(({ product, variant, displayStatus }) => {
    if (search) {
      const q = search.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(q);
      const matchesSku = variant.sku ? variant.sku.toLowerCase().includes(q) : false;
      const matchesSize = variant.size.toLowerCase().includes(q);
      if (!matchesName && !matchesSku && !matchesSize) return false;
    }

    if (filterStatus) {
      if (displayStatus !== filterStatus) return false;
    }

    return true;
  });

  const handleStockChange = async (variantId: string, newQty: number, productName: string, size: string) => {
    if (newQty < 0) return;
    setSavingVariantId(variantId);
    try {
      await updateStock({ variantId, quantity: newQty });
      addToast({
        type: 'success',
        title: 'Stock Updated',
        description: `${productName} (${size}) stock set to ${newQty}.`,
      });
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'Failed to update stock.' });
    } finally {
      setSavingVariantId(null);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Inventory Management | SANAAT Admin" />

      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-serif text-black">Inventory & Stock Control</h1>
        <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
          Instant per-size stock adjustments with live storefront synchronization
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by product name, SKU, or size..."
              className="pl-9 text-xs h-9 py-1"
            />
          </div>

          <div className="w-48">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as DisplayStatus)}
              className="text-xs h-9 py-1"
            >
              <option value="">All Stock Levels</option>
              <option value="available">Healthy Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="preorder">Pre-Order</option>
            </Select>
          </div>
        </div>

        <div className="text-xs text-gray-400 uppercase tracking-wider">
          Total Variant SKUs: <strong>{filteredRows.length}</strong>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Product</th>
              <th className="py-3 px-4 font-semibold">SKU</th>
              <th className="py-3 px-4 font-semibold text-center">Size</th>
              <th className="py-3 px-4 font-semibold text-center">Current Stock</th>
              <th className="py-3 px-4 font-semibold text-center">Quick Adjust</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td colSpan={6} className="p-4">
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              ))
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400 uppercase tracking-widest">
                  No inventory variants match your criteria
                </td>
              </tr>
            ) : (
              filteredRows.map(({ product, variant, displayStatus }) => {
                const isSaving = savingVariantId === variant.id;
                const badgeClass = getStatusBadgeClass(displayStatus);
                const statusLabel = getStatusLabel(displayStatus);

                return (
                  <tr key={variant.id} className="hover:bg-gray-50 transition-colors">
                    {/* Product */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-11 bg-gray-100 flex-shrink-0 overflow-hidden">
                          <SafeImage
                            src={product.images[0]?.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-serif font-medium text-black text-sm block">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase">
                            Threshold: {product.low_stock_threshold} units
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-2.5 px-4 font-mono text-[11px] text-gray-500">
                      {variant.sku || '—'}
                    </td>

                    {/* Size */}
                    <td className="py-2.5 px-4 text-center font-bold text-black uppercase">
                      {variant.size}
                    </td>

                    {/* Current Stock */}
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`font-mono text-sm font-bold ${
                          variant.stock_quantity === 0
                            ? 'text-red-600'
                            : variant.stock_quantity <= product.low_stock_threshold
                            ? 'text-amber-600'
                            : 'text-black'
                        }`}
                      >
                        {variant.stock_quantity}
                      </span>
                    </td>

                    {/* Quick Adjust Buttons */}
                    <td className="py-2.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-gray-100 p-0.5 rounded-sm">
                        <button
                          onClick={() =>
                            handleStockChange(
                              variant.id,
                              Math.max(0, variant.stock_quantity - 1),
                              product.name,
                              variant.size
                            )
                          }
                          disabled={variant.stock_quantity <= 0 || isSaving}
                          className="p-1 hover:bg-white text-gray-700 disabled:opacity-30 rounded-sm transition-colors"
                          title="Decrease 1"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <input
                          type="number"
                          value={variant.stock_quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val)) {
                              handleStockChange(variant.id, val, product.name, variant.size);
                            }
                          }}
                          className="w-12 text-center text-xs font-mono font-bold bg-white border border-gray-200 py-0.5 rounded-sm focus:outline-none focus:border-plum"
                        />

                        <button
                          onClick={() =>
                            handleStockChange(
                              variant.id,
                              variant.stock_quantity + 1,
                              product.name,
                              variant.size
                            )
                          }
                          disabled={isSaving}
                          className="p-1 hover:bg-white text-gray-700 disabled:opacity-30 rounded-sm transition-colors"
                          title="Increase 1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-2.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-semibold ${badgeClass}`}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
