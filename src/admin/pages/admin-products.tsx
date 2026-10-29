import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  useAdminProducts,
  useUpdateProduct,
  useDeleteProduct,
} from '../../hooks/use-products';
import { useCategories } from '../../hooks/use-categories';
import { formatPrice } from '../../utils';
import { getDisplayStatus, getStatusBadgeClass, getStatusLabel } from '../../utils/stock';
import { Button, Input, Select, Skeleton } from '../../components/ui';
import { SEO, SafeImage } from '../../components/common';
import { useToast } from '../../components/ui/toast';
import { Plus, Search, Edit3, Trash2, Eye, Star } from 'lucide-react';
import type { ProductFilters, DisplayStatus } from '../../types';

export function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<DisplayStatus | ''>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { addToast } = useToast();

  const { data: categories } = useCategories();
  const filters: ProductFilters = {
    search: search || undefined,
    category_slug: selectedCategory || undefined,
    status: (selectedStatus as DisplayStatus) || undefined,
    limit: 100,
  };

  const { data: result, isLoading } = useAdminProducts(filters);
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const products = result?.data || [];

  // Bulk selection logic (Section 19)
  const isAllSelected = products.length > 0 && selectedIds.length === products.length;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Actions
  const handleBulkPublish = async () => {
    try {
      for (const id of selectedIds) {
        await updateProduct({ id, data: { is_published: true, status: 'active' } });
      }
      addToast({
        type: 'success',
        title: 'Published',
        description: `${selectedIds.length} products published.`,
      });
      setSelectedIds([]);
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'Failed to publish selected products.' });
    }
  };

  const handleBulkUnpublish = async () => {
    try {
      for (const id of selectedIds) {
        await updateProduct({ id, data: { is_published: false, status: 'draft' } });
      }
      addToast({
        type: 'success',
        title: 'Unpublished',
        description: `${selectedIds.length} products unpublished.`,
      });
      setSelectedIds([]);
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'Failed to unpublish selected products.' });
    }
  };

  const handleBulkArchive = async () => {
    try {
      for (const id of selectedIds) {
        await updateProduct({ id, data: { status: 'archived' as any } });
      }
      addToast({
        type: 'success',
        title: 'Archived',
        description: `${selectedIds.length} products moved to archived.`,
      });
      setSelectedIds([]);
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'Failed to archive selected products.' });
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`Permanently delete ${selectedIds.length} selected products? This action cannot be undone.`)) {
      try {
        for (const id of selectedIds) {
          await deleteProduct(id);
        }
        addToast({
          type: 'success',
          title: 'Deleted',
          description: `${selectedIds.length} products permanently deleted.`,
        });
        setSelectedIds([]);
      } catch {
        addToast({ type: 'error', title: 'Error', description: 'Failed to delete selected products.' });
      }
    }
  };

  const handleDeleteSingle = async (id: string, name: string) => {
    if (confirm(`Permanently delete "${name}"?`)) {
      try {
        await deleteProduct(id);
        addToast({ type: 'success', title: 'Product Deleted', description: `"${name}" was deleted.` });
      } catch {
        addToast({ type: 'error', title: 'Error', description: 'Failed to delete product.' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Products | SANAAT Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-serif text-black">Product Catalog</h1>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
            Manage your dresses, photography, and inventory
          </p>
        </div>

        <Link to="/admin/products/new">
          <Button variant="primary" size="md" className="text-xs tracking-widest">
            <Plus className="w-4 h-4 mr-1.5" />
            + ADD PRODUCT
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by dress name, color..."
              className="pl-9 text-xs h-9 py-1"
            />
          </div>

          <div className="w-44">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs h-9 py-1"
            >
              <option value="">All Collections</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="w-40">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as DisplayStatus)}
              className="text-xs h-9 py-1"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="preorder">Pre-Order</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="draft">Draft / Hidden</option>
              <option value="archived">Archived</option>
            </Select>
          </div>
        </div>

        <div className="text-xs text-gray-400 uppercase tracking-wider">
          Total: <strong>{products.length}</strong> dresses
        </div>
      </div>

      {/* Bulk Action Bar (Section 19: Obvious and Fast) */}
      {selectedIds.length > 0 && (
        <div className="bg-plum text-white p-3.5 px-4 flex flex-wrap items-center justify-between gap-3 shadow-md animate-fadeIn">
          <div className="text-xs font-sans font-medium uppercase tracking-wider flex items-center gap-2">
            <span className="bg-white text-plum px-2 py-0.5 font-bold rounded-sm text-[11px]">
              {selectedIds.length}
            </span>
            <span>Products Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBulkPublish}
              className="bg-white text-black hover:bg-gray-100 text-xs px-3 py-1.5 uppercase tracking-wider font-medium transition-colors"
            >
              Publish Selected
            </button>
            <button
              onClick={handleBulkUnpublish}
              className="bg-black/20 hover:bg-black/40 text-white text-xs px-3 py-1.5 uppercase tracking-wider font-medium transition-colors"
            >
              Unpublish Selected
            </button>
            <button
              onClick={handleBulkArchive}
              className="bg-black/40 hover:bg-black/60 text-white text-xs px-3 py-1.5 uppercase tracking-wider font-medium transition-colors"
            >
              Archive Selected
            </button>
            <button
              onClick={handleBulkDelete}
              className="bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1.5 uppercase tracking-wider font-medium transition-colors"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Products Table with Checkboxes */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="rounded text-plum focus:ring-plum"
                  aria-label="Select all products"
                />
              </th>
              <th className="py-3 px-4 font-semibold">Image</th>
              <th className="py-3 px-4 font-semibold">Product Name</th>
              <th className="py-3 px-4 font-semibold">Collection</th>
              <th className="py-3 px-4 font-semibold">Price</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-3 font-semibold text-center">Featured</th>
              <th className="py-3 px-4 font-semibold text-center">Live</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td colSpan={9} className="p-4">
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-400 uppercase tracking-widest">
                  No products found matching filters
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const status = getDisplayStatus(product, product.variants);
                const badgeClass = getStatusBadgeClass(status);
                const statusLabel = getStatusLabel(status);
                const isSelected = selectedIds.includes(product.id);

                return (
                  <tr
                    key={product.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-plum/5' : 'hover:bg-gray-50/80'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-2 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(product.id)}
                        className="rounded text-plum focus:ring-plum"
                        aria-label={`Select ${product.name}`}
                      />
                    </td>

                    {/* Thumbnail */}
                    <td className="py-2 px-4">
                      <div className="w-10 h-12 bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                        <SafeImage
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Name & Variants */}
                    <td className="py-2 px-4 font-medium text-black">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="hover:text-plum transition-colors font-serif text-sm block"
                      >
                        {product.name}
                      </Link>
                      <span className="text-[11px] text-gray-400 block font-light">
                        Sizes: {product.variants.map((v) => `${v.size}(${v.stock_quantity})`).join(', ') || 'None'}
                      </span>
                    </td>

                    {/* Collection */}
                    <td className="py-2 px-4 text-gray-600">
                      {product.category?.name || '—'}
                    </td>

                    {/* Price */}
                    <td className="py-2 px-4 font-serif font-medium text-black text-sm">
                      {formatPrice(product.price)}
                    </td>

                    {/* Status Badge */}
                    <td className="py-2 px-4">
                      <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold ${badgeClass}`}>
                        {statusLabel}
                      </span>
                    </td>

                    {/* Featured on Homepage Toggle */}
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await updateProduct({ id: product.id, data: { is_featured: !product.is_featured } });
                            addToast({
                              type: 'success',
                              title: !product.is_featured ? 'Featured on Homepage' : 'Removed from Featured',
                              description: `"${product.name}" updated.`,
                            });
                          } catch {
                            addToast({ type: 'error', title: 'Error', description: 'Failed to update featured state.' });
                          }
                        }}
                        className={`p-1.5 rounded transition-colors ${
                          product.is_featured ? 'text-amber-500 hover:text-amber-600' : 'text-gray-300 hover:text-gray-500'
                        }`}
                        title={product.is_featured ? 'Featured on Homepage (Click to unfeature)' : 'Click to feature on Homepage'}
                        aria-label="Toggle Featured on Homepage"
                      >
                        <Star className={`w-4 h-4 ${product.is_featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>

                    {/* Live status (Click to toggle published / hidden) */}
                    <td className="py-2 px-4 text-center">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            const newPub = !product.is_published;
                            await updateProduct({
                              id: product.id,
                              data: {
                                is_published: newPub,
                                status: newPub ? 'active' : 'draft',
                              },
                            });
                            addToast({
                              type: 'success',
                              title: newPub ? 'Published' : 'Unpublished',
                              description: `"${product.name}" is now ${newPub ? 'live' : 'hidden'}.`,
                            });
                          } catch {
                            addToast({
                              type: 'error',
                              title: 'Error',
                              description: 'Failed to update publication status.',
                            });
                          }
                        }}
                        className="inline-flex items-center justify-center p-1 rounded hover:bg-gray-100 transition-colors"
                        title={product.is_published ? 'Published (Click to unpublish)' : 'Hidden (Click to publish)'}
                        aria-label={product.is_published ? 'Unpublish dress' : 'Publish dress'}
                      >
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full ${
                            product.is_published ? 'bg-emerald-500' : 'bg-gray-300'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/product/${product.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-gray-400 hover:text-black transition-colors"
                          title="View on Storefront"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/${product.id}`}
                          className="p-1.5 text-gray-500 hover:text-plum transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteSingle(product.id, product.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
