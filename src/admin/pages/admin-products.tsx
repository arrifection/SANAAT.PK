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
import { Plus, Search, Edit3, Trash2, Archive, Star, Eye } from 'lucide-react';
import type { ProductFilters, DisplayStatus } from '../../types';

export function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<DisplayStatus | ''>('');
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

  const handleTogglePublished = async (id: string, current: boolean) => {
    try {
      await updateProduct({ id, data: { is_published: !current } });
      addToast({
        type: 'success',
        title: 'Status Updated',
        description: `Product is now ${!current ? 'published' : 'hidden'}.`,
      });
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'Failed to update publication status' });
    }
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    try {
      await updateProduct({ id, data: { is_featured: !current } });
      addToast({
        type: 'success',
        title: 'Featured Status Updated',
        description: `Product is ${!current ? 'now featured' : 'no longer featured'}.`,
      });
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'Failed to update featured flag' });
    }
  };

  const handleArchive = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'archived' ? 'active' : 'archived';
      await updateProduct({ id, data: { status: nextStatus as any } });
      addToast({
        type: 'success',
        title: 'Archive Status Updated',
        description: `Product moved to ${nextStatus}.`,
      });
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'Failed to archive product' });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete "${name}"? This action cannot be undone.`)) {
      try {
        await deleteProduct(id);
        addToast({ type: 'success', title: 'Product Deleted', description: `"${name}" was deleted.` });
      } catch {
        addToast({ type: 'error', title: 'Error', description: 'Failed to delete product' });
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
            Manage your fashion pieces, stock, and photography
          </p>
        </div>

        <Link to="/admin/products/new">
          <Button variant="primary" size="md" className="text-xs tracking-widest">
            <Plus className="w-4 h-4 mr-1.5" />
            ADD PRODUCT
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
              placeholder="Search by title, SKU, or tag..."
              className="pl-9 text-xs h-9 py-1"
            />
          </div>

          <div className="w-44">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs h-9 py-1"
            >
              <option value="">All Categories</option>
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
          Total: <strong>{products.length}</strong> items
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Image</th>
              <th className="py-3 px-4 font-semibold">Product Name</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Price</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-center">Published</th>
              <th className="py-3 px-4 font-semibold text-center">Featured</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td colSpan={8} className="p-4">
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-400 uppercase tracking-widest">
                  No products found matching filters
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const status = getDisplayStatus(product, product.variants);
                const badgeClass = getStatusBadgeClass(status);
                const statusLabel = getStatusLabel(status);

                return (
                  <tr key={product.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-2 px-4">
                      <div className="w-10 h-12 bg-gray-100 overflow-hidden flex-shrink-0">
                        <SafeImage
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-2 px-4">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="font-serif text-sm font-medium text-black hover:text-plum"
                      >
                        {product.name}
                      </Link>
                      <div className="text-[10px] text-gray-400 font-mono">
                        slug: /{product.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-2 px-4 text-gray-600">
                      {product.category?.name || '—'}
                    </td>

                    {/* Price */}
                    <td className="py-2 px-4 font-medium text-black font-serif">
                      {formatPrice(product.price)}
                    </td>

                    {/* Derived Status */}
                    <td className="py-2 px-4">
                      <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-semibold ${badgeClass}`}>
                        {statusLabel}
                      </span>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublished(product.id, product.is_published)}
                        className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-sm transition-colors ${
                          product.is_published
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {product.is_published ? 'Live' : 'Hidden'}
                      </button>
                    </td>

                    {/* Featured Star */}
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                        className="p-1 hover:scale-110 transition-transform"
                        title={product.is_featured ? 'Featured on homepage' : 'Not featured'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            product.is_featured
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-2 px-4 text-right space-x-1">
                      <Link
                        to={`/product/${product.slug}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-black inline-block"
                        title="View on storefront"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="p-1.5 text-gray-600 hover:text-plum inline-block"
                        title="Edit product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleArchive(product.id, product.status)}
                        className="p-1.5 text-gray-400 hover:text-amber-600"
                        title={product.status === 'archived' ? 'Restore product' : 'Archive product'}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
