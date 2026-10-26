import { useState } from 'react';
import { useAllCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/use-categories';
import { slugify } from '../../utils';
import { Button, Input, Modal, Textarea, Skeleton } from '../../components/ui';
import { SEO, SafeImage } from '../../components/common';
import { useToast } from '../../components/ui/toast';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import type { Category } from '../../types';

export function AdminCategoriesPage() {
  const { data: categories, isLoading } = useAllCategories();
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutateAsync: deleteCategory } = useDeleteCategory();
  const { addToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImageUrl('');
    setDisplayOrder(categories?.length || 0);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImageUrl(cat.image_url || '');
    setDisplayOrder(cat.display_order);
    setIsActive(cat.is_active);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          data: {
            name,
            slug,
            description: description || null,
            image_url: imageUrl || null,
            display_order: displayOrder,
            is_active: isActive,
          },
        });
        addToast({ type: 'success', title: 'Category Updated', description: `Saved "${name}".` });
      } else {
        await createCategory({
          name,
          slug,
          description: description || null,
          image_url: imageUrl || null,
          display_order: displayOrder,
          is_active: isActive,
        });
        addToast({ type: 'success', title: 'Category Created', description: `Created "${name}".` });
      }
      setModalOpen(false);
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'Failed to save category.' });
    }
  };

  const handleDelete = async (cat: Category) => {
    if (confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      try {
        await deleteCategory(cat.id);
        addToast({ type: 'success', title: 'Category Deleted', description: `Deleted "${cat.name}".` });
      } catch {
        addToast({ type: 'error', title: 'Error', description: 'Failed to delete category.' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Categories | SANAAT Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-serif text-black">Categories</h1>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
            Organize collections, tiles, and navigation taxonomy
          </p>
        </div>

        <Button onClick={openAddModal} variant="primary" size="md" className="text-xs tracking-widest">
          <Plus className="w-4 h-4 mr-1.5" />
          ADD CATEGORY
        </Button>
      </div>

      {/* Categories Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Image</th>
              <th className="py-3 px-4 font-semibold">Name</th>
              <th className="py-3 px-4 font-semibold">Slug</th>
              <th className="py-3 px-4 font-semibold">Description</th>
              <th className="py-3 px-4 font-semibold text-center">Display Order</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <tr key={i}>
                  <td colSpan={7} className="p-4">
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              ))
            ) : !categories || categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400 uppercase tracking-widest">
                  No categories found
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="w-10 h-10 bg-gray-100 overflow-hidden">
                      <SafeImage src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-2.5 px-4 font-serif font-medium text-black text-sm">{cat.name}</td>
                  <td className="py-2.5 px-4 font-mono text-gray-500">{cat.slug}</td>
                  <td className="py-2.5 px-4 text-gray-600 max-w-xs truncate">{cat.description || '—'}</td>
                  <td className="py-2.5 px-4 text-center font-mono">{cat.display_order}</td>
                  <td className="py-2.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-semibold ${
                        cat.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {cat.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-gray-600 hover:text-plum inline-block"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 text-gray-400 hover:text-red-600 inline-block"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Category Name *"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Lawn Formals"
            required
          />

          <Input
            label="Slug *"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="lawn-formals"
            required
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief collection statement..."
            rows={2}
          />

          <Input
            label="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Display Order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
            />

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-black">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-plum focus:ring-plum"
                />
                <span>Active Category</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={isCreating || isUpdating}
              className="text-xs tracking-wider"
            >
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
