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

  // Flatten product variants for simple inventory table representation (Section 18)
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
      const matchesSize = variant.size.toLowerCase().includes(q);
      if (!matchesName && !matchesSize) return false;
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
        description: `${productName} (Size ${size}) is now ${newQty}.`,
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
        <h1 className="text-2xl font-serif text-black">Inventory Control</h1>
        <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
          Simple per-size stock tracking with instant live storefront updates
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
              placeholder="Search by dress name or size..."
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
              <option value="available">Available</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="preorder">Pre-Order</option>
            </Select>
          </div>
        </div>

        <div className="text-xs text-gray-400 uppercase tracking-wider">
          Tracking <strong>{filteredRows.length}</strong> variant stock items
        </div>
      </div>

      {/* Simple Inventory Table (Section 18: Product, Size, Stock, Status) */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Product</th>
              <th className="py-3 px-4 font-semibold text-center">Size</th>
              <th className="py-3 px-4 font-semibold text-center">Stock</th>
              <th className="py-3 px-4 font-semibold">Quick Adjustment</th>
              <th className="py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td colSpan={5} className="p-4">
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              ))
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 uppercase tracking-widest">
                  No stock items match your search
                </td>
              </tr>
            ) : (
              filteredRows.map(({ product, variant, displayStatus }) => {
                const isSaving = savingVariantId === variant.id;
                const isZeroStock = variant.stock_quantity === 0;
                const badgeClass = getStatusBadgeClass(
                  isZeroStock && !product.is_preorder ? 'out_of_stock' : displayStatus
                );
                const statusLabel = isZeroStock && !product.is_preorder
                  ? 'Out of Stock'
                  : getStatusLabel(displayStatus);

                return (
                  <tr key={variant.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Product */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-12 bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                          <SafeImage
                            src={product.images[0]?.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-serif font-bold text-sm text-black block">
                            {product.name}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase">
                            {product.category?.name || 'Sanaat Collection'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Size */}
                    <td className="py-3 px-4 text-center">
                      <span className="font-serif font-bold text-sm bg-gray-100 px-2.5 py-1 border border-gray-200">
                        {variant.size}
                      </span>
                    </td>

                    {/* Stock Value */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-mono text-sm font-bold ${
                          variant.stock_quantity === 0
                            ? 'text-red-600'
                            : variant.stock_quantity <= 3
                            ? 'text-amber-600'
                            : 'text-black'
                        }`}
                      >
                        {variant.stock_quantity}
                      </span>
                    </td>

                    {/* Quick Adjustment (+ / -) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={isSaving || variant.stock_quantity <= 0}
                          onClick={() =>
                            handleStockChange(
                              variant.id,
                              variant.stock_quantity - 1,
                              product.name,
                              variant.size
                            )
                          }
                          className="h-7 w-7 flex items-center justify-center border border-gray-300 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                          title="Decrease Stock"
                        >
                          <Minus className="w-3.5 h-3.5 text-black" />
                        </button>

                        <input
                          type="number"
                          min={0}
                          disabled={isSaving}
                          value={variant.stock_quantity}
                          onChange={(e) =>
                            handleStockChange(
                              variant.id,
                              Number(e.target.value),
                              product.name,
                              variant.size
                            )
                          }
                          className="w-16 text-center text-xs h-7 border border-gray-300 p-1 font-mono font-medium"
                        />

                        <button
                          disabled={isSaving}
                          onClick={() =>
                            handleStockChange(
                              variant.id,
                              variant.stock_quantity + 1,
                              product.name,
                              variant.size
                            )
                          }
                          className="h-7 w-7 flex items-center justify-center border border-gray-300 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                          title="Increase Stock"
                        >
                          <Plus className="w-3.5 h-3.5 text-black" />
                        </button>
                      </div>
                    </td>

                    {/* Live Status */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${badgeClass}`}>
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
