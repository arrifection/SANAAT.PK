import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useAdminProductById,
  useCreateProduct,
  useUpdateProduct,
  useSetProductVariants,
  useAddProductImage,
  useDeleteProductImage,
} from '../../hooks/use-products';
import { useCategories } from '../../hooks/use-categories';
import { useServices } from '../../hooks/use-services';
import { slugify } from '../../utils';
import { Button, Input, Select, Textarea } from '../../components/ui';
import { SEO, PageLoader, SafeImage } from '../../components/common';
import { useToast } from '../../components/ui/toast';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';
import type { ProductInsert } from '../../types';

interface ProductFormValues {
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_at_price?: number | null;
  category_id?: string | null;
  status: 'active' | 'draft' | 'archived';
  is_published: boolean;
  is_featured: boolean;
  is_preorder: boolean;
  preorder_closes_at?: string | null;
  estimated_dispatch_date?: string | null;
  preorder_limit?: number | null;
  tags?: string;
  fabric?: string;
  care_instructions?: string;
  details?: string;
  display_order: number;
  low_stock_threshold: number;
  variants: Array<{
    size: string;
    stock_quantity: number;
    sku?: string;
  }>;
}

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  compare_at_price: z.number().nullable().optional(),
  category_id: z.string().nullable().optional(),
  status: z.enum(['active', 'draft', 'archived']),
  is_published: z.boolean(),
  is_featured: z.boolean(),
  is_preorder: z.boolean(),
  preorder_closes_at: z.string().nullable().optional(),
  estimated_dispatch_date: z.string().nullable().optional(),
  preorder_limit: z.number().nullable().optional(),
  tags: z.string().optional(),
  fabric: z.string().optional(),
  care_instructions: z.string().optional(),
  details: z.string().optional(),
  display_order: z.number(),
  low_stock_threshold: z.number(),
  variants: z
    .array(
      z.object({
        size: z.string().min(1, 'Size required'),
        stock_quantity: z.number().min(0, 'Stock cannot be negative'),
        sku: z.string().optional(),
      })
    )
    .min(1, 'At least one size variant is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id && id !== 'new');
  const navigate = useNavigate();
  const { addToast } = useToast();
  const services = useServices();

  const { data: existingProduct, isLoading: isLoadingProduct } = useAdminProductById(
    isEditing ? id! : ''
  );
  const { data: categories } = useCategories();

  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutateAsync: setVariants } = useSetProductVariants();
  const { mutateAsync: addImageRecord } = useAddProductImage();
  const { mutateAsync: deleteImageRecord } = useDeleteProductImage();

  const [uploadedImages, setUploadedImages] = useState<
    Array<{ id?: string; url: string; alt_text?: string | null }>
  >([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      price: 0,
      compare_at_price: null,
      status: 'active',
      is_published: true,
      is_featured: false,
      is_preorder: false,
      low_stock_threshold: 3,
      display_order: 0,
      variants: [
        { size: 'XS', stock_quantity: 5 },
        { size: 'S', stock_quantity: 5 },
        { size: 'M', stock_quantity: 5 },
        { size: 'L', stock_quantity: 5 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variants',
  });

  const isPreorder = watch('is_preorder');
  const productName = watch('name');

  // Load existing data when editing
  useEffect(() => {
    if (existingProduct) {
      reset({
        name: existingProduct.name,
        slug: existingProduct.slug,
        description: existingProduct.description || '',
        price: existingProduct.price,
        compare_at_price: existingProduct.compare_at_price,
        category_id: existingProduct.category_id,
        status: existingProduct.status,
        is_published: existingProduct.is_published,
        is_featured: existingProduct.is_featured,
        is_preorder: existingProduct.is_preorder,
        preorder_closes_at: existingProduct.preorder_closes_at
          ? existingProduct.preorder_closes_at.slice(0, 16)
          : null,
        estimated_dispatch_date: existingProduct.estimated_dispatch_date
          ? existingProduct.estimated_dispatch_date.slice(0, 10)
          : null,
        preorder_limit: existingProduct.preorder_limit,
        tags: existingProduct.tags?.join(', ') || '',
        fabric: existingProduct.fabric || '',
        care_instructions: existingProduct.care_instructions || '',
        details: existingProduct.details || '',
        display_order: existingProduct.display_order,
        low_stock_threshold: existingProduct.low_stock_threshold,
        variants:
          existingProduct.variants.length > 0
            ? existingProduct.variants.map((v) => ({
                size: v.size,
                stock_quantity: v.stock_quantity,
                sku: v.sku || undefined,
              }))
            : [{ size: 'ONE SIZE', stock_quantity: 10 }],
      });

      setUploadedImages(
        existingProduct.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt_text: img.alt_text,
        }))
      );
    }
  }, [existingProduct, reset]);

  // Auto-slugify on title change for new products
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('name', val);
    if (!isEditing) {
      setValue('slug', slugify(val));
    }
  };

  // Image Upload Handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await services.storage.uploadProductImage(
          file,
          isEditing ? id! : 'temp'
        );

        if (isEditing) {
          const newImg = await addImageRecord({
            product_id: id!,
            url: res.url,
            storage_path: res.storage_path,
            alt_text: productName || 'Product photo',
            position: uploadedImages.length,
          });
          setUploadedImages((prev) => [...prev, newImg]);
        } else {
          // Keep in local state for newly creating product
          setUploadedImages((prev) => [
            ...prev,
            { url: res.url, alt_text: productName || 'Product photo' },
          ]);
        }
      }
      addToast({ type: 'success', title: 'Images Uploaded', description: 'Product photos added.' });
    } catch {
      addToast({ type: 'error', title: 'Upload Failed', description: 'Could not upload image.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (index: number) => {
    const img = uploadedImages[index];
    if (img.id) {
      try {
        await deleteImageRecord(img.id);
      } catch {
        // ignore
      }
    }
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const tagsArray = data.tags
        ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      const payload: ProductInsert = {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        price: data.price,
        compare_at_price: data.compare_at_price || null,
        category_id: data.category_id || null,
        status: data.status,
        is_published: data.is_published,
        is_featured: data.is_featured,
        is_preorder: data.is_preorder,
        preorder_closes_at: data.preorder_closes_at || null,
        estimated_dispatch_date: data.estimated_dispatch_date || null,
        preorder_limit: data.preorder_limit || null,
        tags: tagsArray,
        fabric: data.fabric || null,
        care_instructions: data.care_instructions || null,
        details: data.details || null,
        display_order: data.display_order,
        low_stock_threshold: data.low_stock_threshold,
      };

      let productId = id;

      if (isEditing) {
        await updateProduct({ id: id!, data: payload });
        await setVariants({
          productId: id!,
          variants: data.variants.map((v) => ({
            size: v.size,
            stock_quantity: v.stock_quantity,
            sku: v.sku || null,
          })),
        });
        addToast({
          type: 'success',
          title: 'Product Updated',
          description: `"${data.name}" changes saved.`,
        });
      } else {
        const newProd = await createProduct(payload);
        productId = newProd.id;

        // Set variants
        await setVariants({
          productId,
          variants: data.variants.map((v) => ({
            size: v.size,
            stock_quantity: v.stock_quantity,
            sku: v.sku || null,
          })),
        });

        // Add uploaded images
        for (let i = 0; i < uploadedImages.length; i++) {
          await addImageRecord({
            product_id: productId,
            url: uploadedImages[i].url,
            storage_path: null,
            alt_text: data.name,
            position: i,
          });
        }

        addToast({
          type: 'success',
          title: 'Product Created',
          description: `"${data.name}" added to inventory.`,
        });
      }

      navigate('/admin/products');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Save Failed',
        description: err instanceof Error ? err.message : 'Please check required fields.',
      });
    }
  };

  if (isEditing && isLoadingProduct) {
    return <PageLoader message="Loading product data..." />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <SEO title={`${isEditing ? 'Edit Product' : 'New Product'} | SANAAT Admin`} />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/products"
            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif text-black">
              {isEditing ? `Edit: ${existingProduct?.name}` : 'Create New Product'}
            </h1>
            <p className="text-xs uppercase tracking-widest text-gray-400 mt-0.5">
              {isEditing ? 'Modify product parameters and inventory' : 'Add a new modest piece to catalog'}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          variant="primary"
          loading={isCreating || isUpdating}
          className="text-xs tracking-widest px-6"
        >
          {isEditing ? 'SAVE CHANGES' : 'PUBLISH PRODUCT'}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Core Details */}
        <div className="bg-white p-6 border border-gray-200 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-black border-b border-gray-100 pb-2">
            1. Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Title *"
              placeholder="e.g. Aalia Silk Embroidered Kurti"
              error={errors.name?.message}
              {...register('name')}
              onChange={handleNameChange}
            />

            <Input
              label="URL Slug *"
              placeholder="aalia-silk-embroidered-kurti"
              error={errors.slug?.message}
              {...register('slug')}
            />
          </div>

          <Textarea
            label="Product Description"
            placeholder="Describe the silhouette, embroidery details, and style inspiration..."
            rows={4}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              error={errors.category_id?.message}
              {...register('category_id')}
            >
              <option value="">No Category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>

            <Input
              label="Search Tags (comma-separated)"
              placeholder="lawn, summer, formal, embroidered"
              error={errors.tags?.message}
              {...register('tags')}
            />
          </div>
        </div>

        {/* Section 2: Pricing & Inventory */}
        <div className="bg-white p-6 border border-gray-200 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-black border-b border-gray-100 pb-2">
            2. Pricing & Stock Thresholds
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Retail Price (PKR) *"
              type="number"
              placeholder="12500"
              error={errors.price?.message}
              {...register('price')}
            />

            <Input
              label="Compare-at Price (for Sale strike-through)"
              type="number"
              placeholder="15000"
              error={errors.compare_at_price?.message}
              {...register('compare_at_price')}
            />

            <Input
              label="Low Stock Alert Threshold"
              type="number"
              defaultValue={3}
              helperText="Badge triggers when stock ≤ this number"
              error={errors.low_stock_threshold?.message}
              {...register('low_stock_threshold')}
            />
          </div>
        </div>

        {/* Section 3: Size Variants & Quantity */}
        <div className="bg-white p-6 border border-gray-200 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-black">
                3. Size Variants & Inventory
              </h2>
              <p className="text-[11px] text-gray-500">
                Stock is tracked per size. If single-size, use &ldquo;ONE SIZE&rdquo;.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ size: 'M', stock_quantity: 5 })}
              className="text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Size
            </Button>
          </div>

          <div className="space-y-2">
            {fields.map((field, idx) => (
              <div key={field.id} className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-sm">
                <div className="w-28">
                  <Input
                    placeholder="Size (e.g. S)"
                    className="text-xs uppercase font-semibold h-8"
                    {...register(`variants.${idx}.size` as const)}
                  />
                </div>
                <div className="w-36">
                  <Input
                    type="number"
                    placeholder="Stock Qty"
                    className="text-xs h-8"
                    {...register(`variants.${idx}.stock_quantity` as const)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Optional SKU (e.g. SNT-LAWN-S)"
                    className="text-xs h-8"
                    {...register(`variants.${idx}.sku` as const)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="p-1.5 text-gray-400 hover:text-red-600"
                  disabled={fields.length === 1}
                  title="Remove variant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {errors.variants?.message && (
            <p className="text-xs text-red-600">{errors.variants.message}</p>
          )}
        </div>

        {/* Section 4: Imagery */}
        <div className="bg-white p-6 border border-gray-200 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-black border-b border-gray-100 pb-2">
            4. Product Photography
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {uploadedImages.map((img, i) => (
              <div key={i} className="group relative aspect-[3/4] bg-gray-100 overflow-hidden border">
                <SafeImage src={img.url} alt="Photo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <span className="text-[10px] text-white bg-black/70 px-1 py-0.5 self-start">
                    {i === 0 ? 'Primary' : `#${i + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(i)}
                    className="p-1 bg-red-600 text-white rounded-full self-end hover:bg-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {/* Upload Box */}
            <label className="aspect-[3/4] border-2 border-dashed border-gray-200 hover:border-plum flex flex-col items-center justify-center cursor-pointer p-3 text-center transition-colors">
              <Upload className="w-5 h-5 text-gray-400 mb-1" />
              <span className="text-[10px] uppercase font-semibold text-gray-600">
                {isUploading ? 'Uploading...' : 'Upload Photos'}
              </span>
              <span className="text-[9px] text-gray-400 mt-0.5">PNG, JPG, WebP</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Section 5: Pre-Order Configuration */}
        <div className="bg-white p-6 border border-gray-200 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-black">
                5. Pre-Order Settings
              </h2>
              <p className="text-[11px] text-gray-500">
                Allows customers to pre-order before stock is manufactured.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded text-plum focus:ring-plum"
                {...register('is_preorder')}
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-black">
                Enable Pre-Order
              </span>
            </label>
          </div>

          {isPreorder && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <Input
                label="Pre-Order Closes At"
                type="datetime-local"
                helperText="Purchase button closes after this date"
                error={errors.preorder_closes_at?.message}
                {...register('preorder_closes_at')}
              />

              <Input
                label="Estimated Dispatch Date"
                type="date"
                helperText="Shown on product page"
                error={errors.estimated_dispatch_date?.message}
                {...register('estimated_dispatch_date')}
              />

              <Input
                label="Order Limit (Cap)"
                type="number"
                placeholder="e.g. 50"
                helperText="Max units permitted before closing"
                error={errors.preorder_limit?.message}
                {...register('preorder_limit')}
              />
            </div>
          )}
        </div>

        {/* Section 6: Garment Specifications */}
        <div className="bg-white p-6 border border-gray-200 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-black border-b border-gray-100 pb-2">
            6. Fabric & Care Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Fabric & Textile Description"
              placeholder="e.g. Pure Cotton Lawn shirt with Organza dupatta"
              error={errors.fabric?.message}
              {...register('fabric')}
            />

            <Input
              label="Care Instructions"
              placeholder="e.g. Dry clean recommended. Do not tumble dry."
              error={errors.care_instructions?.message}
              {...register('care_instructions')}
            />
          </div>

          <Textarea
            label="Additional Garment Details"
            placeholder="Embroidery notes, cut type (straight/A-line), trousers included, etc."
            rows={2}
            error={errors.details?.message}
            {...register('details')}
          />
        </div>

        {/* Section 7: Publishing & Status Flags */}
        <div className="bg-white p-6 border border-gray-200 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-black border-b border-gray-100 pb-2">
            7. Publishing State & Priority
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Lifecycle Status" {...register('status')}>
              <option value="active">Active</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="archived">Archived</option>
            </Select>

            <Input
              label="Display Priority (Order)"
              type="number"
              defaultValue={0}
              helperText="Lower numbers appear first on storefront"
              {...register('display_order')}
            />

            <div className="flex flex-col justify-center space-y-2 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-black">
                <input
                  type="checkbox"
                  className="rounded text-plum focus:ring-plum"
                  {...register('is_published')}
                />
                <span>Published to Store</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold uppercase text-black">
                <input
                  type="checkbox"
                  className="rounded text-plum focus:ring-plum"
                  {...register('is_featured')}
                />
                <span>Feature on Homepage</span>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex justify-between items-center pt-4">
          <Link
            to="/admin/products"
            className="text-xs uppercase tracking-wider text-gray-500 hover:text-black"
          >
            Cancel
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isCreating || isUpdating}
            className="text-xs tracking-widest px-8"
          >
            {isEditing ? 'SAVE CHANGES' : 'CREATE PRODUCT'}
          </Button>
        </div>
      </form>
    </div>
  );
}
