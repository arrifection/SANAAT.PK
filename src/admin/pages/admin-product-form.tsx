import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useAdminProductById,
  useCreateProduct,
  useUpdateProduct,
  useSetProductVariants,
  useAddProductImage,
} from '../../hooks/use-products';
import { useCategories } from '../../hooks/use-categories';
import { slugify, formatPrice } from '../../utils';
import { Button, Input, Select, Textarea } from '../../components/ui';
import { SEO, PageLoader } from '../../components/common';
import { useToast } from '../../components/ui/toast';
import {
  suggestedProductNames,
  productDescriptionTemplates,
} from '../../content/site-content';
import { ArrowLeft, Upload, Trash2 } from 'lucide-react';

const COMMON_COLORS = ['Plum', 'Ivory', 'Sage', 'Charcoal', 'Emerald', 'Blush', 'White', 'Black', 'Navy', 'Dusty Rose'];

// Fabric types per Section 13 (NO Velvet)
const FABRIC_TYPES = ['Lawn', 'Khaddar', 'Cotton', 'Silk'] as const;

// Fabric care per Section 14
const FABRIC_CARE_OPTIONS = ['Washable', 'Dry Clean'] as const;

// Product types per Section 15
const PRODUCT_TYPES = ['Top', 'Bottom', 'Set'] as const;

// Canonical Collections verified against Supabase (Winter Formals, Summer Edit)
const CANONICAL_COLLECTIONS = [
  { id: 'c1000000-0000-0000-0000-000000000010', name: 'Winter Formals', slug: 'winter-formals' },
  { id: 'c1000000-0000-0000-0000-000000000020', name: 'Summer Edit', slug: 'summer-edit' },
];

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id && id !== 'new');
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { data: categories } = useCategories();
  const availableCollections =
    categories && categories.length > 0 ? categories : CANONICAL_COLLECTIONS;
  const { data: existingProduct, isLoading: isLoadingExisting } = useAdminProductById(
    isEditing ? id! : ''
  );

  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutateAsync: setVariants } = useSetProductVariants();
  const { mutateAsync: addProductImage } = useAddProductImage();

  // 1. Photos (Up to 3 images per Section 17)
  const [images, setImages] = useState<Array<{ id?: string; url: string; file?: File }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Product Name & Slug
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  // 3. Color
  const [color, setColor] = useState('Plum');

  // 4. Price
  const [price, setPrice] = useState<number | ''>(16500);

  // 5. Collection
  const [categoryId, setCategoryId] = useState('');

  // 6. Sizes (Default: S, M, L, XL per Section 17)
  const [sizes, setSizes] = useState<{ [key: string]: { enabled: boolean; stock: number } }>({
    S: { enabled: true, stock: 5 },
    M: { enabled: true, stock: 5 },
    L: { enabled: true, stock: 5 },
    XL: { enabled: true, stock: 5 },
  });

  // 7. Status
  const [statusType, setStatusType] = useState<
    'available' | 'preorder' | 'draft' | 'low_stock' | 'out_of_stock' | 'archived'
  >('available');

  // 8. Description
  const [description, setDescription] = useState('');

  // 9. Fabric Type (Section 13: Lawn | Khaddar | Cotton | Silk — no Velvet)
  const [fabricType, setFabricType] = useState<string>('Lawn');

  // 10. Fabric Care (Section 14: Washable | Dry Clean)
  const [fabricCare, setFabricCare] = useState<string>('Washable');

  // 11. Product Type (Section 15: Top | Bottom | Set — determines size chart)
  const [productType, setProductType] = useState<string>('Set');

  // 12. Featured on Homepage (Section 24)
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  // 13. New Arrival Status (Task 3: Admin Control)
  const [isNewArrival, setIsNewArrival] = useState<boolean>(true);

  // 14. Display Order (Task 3: Admin Control)
  const [displayOrder, setDisplayOrder] = useState<number>(0);

  // Populate data when editing
  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setSlug(existingProduct.slug);
      setPrice(existingProduct.price);

      // Match collection by ID, slug, or name; fallback to first available collection
      const matchedCat = availableCollections.find(
        (c) =>
          c.id === existingProduct.category_id ||
          c.slug === existingProduct.category_id ||
          ('cat-' + c.slug) === existingProduct.category_id ||
          c.name.toLowerCase() === existingProduct.category_id?.toLowerCase()
      );
      setCategoryId(
        matchedCat
          ? matchedCat.id
          : (existingProduct.category_id || availableCollections[0]?.id || 'c1000000-0000-0000-0000-000000000010')
      );

      setDescription(existingProduct.description || '');

      // Populate color & attributes
      if (existingProduct.color) {
        setColor(existingProduct.color);
      } else {
        const foundColor = existingProduct.tags?.find((t) => COMMON_COLORS.includes(t)) || 'Plum';
        setColor(foundColor);
      }

      if (existingProduct.is_featured !== undefined) {
        setIsFeatured(Boolean(existingProduct.is_featured));
      }

      if (existingProduct.is_new_arrival !== undefined) {
        setIsNewArrival(Boolean(existingProduct.is_new_arrival));
      }

      if (existingProduct.display_order !== undefined) {
        setDisplayOrder(Number(existingProduct.display_order) || 0);
      }

      if (existingProduct.product_type) {
        setProductType(existingProduct.product_type);
      }

      if (existingProduct.fabric) {
        const foundFabric = FABRIC_TYPES.find((f) =>
          existingProduct.fabric?.toLowerCase().includes(f.toLowerCase())
        );
        if (foundFabric) setFabricType(foundFabric);
        else setFabricType(existingProduct.fabric);
      }

      if (existingProduct.fabric_care) {
        setFabricCare(existingProduct.fabric_care);
      } else if (existingProduct.care_instructions) {
        if (existingProduct.care_instructions.toLowerCase().includes('dry clean')) setFabricCare('Dry Clean');
        else setFabricCare('Washable');
      }

      // Infer status
      if (existingProduct.status === 'draft') setStatusType('draft');
      else if (existingProduct.status === 'archived') setStatusType('archived');
      else if (existingProduct.is_preorder) setStatusType('preorder');
      else setStatusType('available');

      // Populate existing images (up to 3)
      if (existingProduct.images && existingProduct.images.length > 0) {
        setImages(
          existingProduct.images.slice(0, 3).map((img) => ({
            id: img.id,
            url: img.url,
          }))
        );
      }

      // Populate variants
      if (existingProduct.variants && existingProduct.variants.length > 0) {
        const nextSizes = {
          S: { enabled: false, stock: 0 },
          M: { enabled: false, stock: 0 },
          L: { enabled: false, stock: 0 },
          XL: { enabled: false, stock: 0 },
        };
        for (const v of existingProduct.variants) {
          if (nextSizes[v.size as keyof typeof nextSizes]) {
            nextSizes[v.size as keyof typeof nextSizes] = {
              enabled: true,
              stock: v.stock_quantity,
            };
          }
        }
        setSizes(nextSizes);
      }
    } else if (availableCollections && availableCollections.length > 0) {
      if (!categoryId || !availableCollections.some((c) => c.id === categoryId)) {
        const match = availableCollections.find((c) => c.id === categoryId || c.slug === categoryId || ('cat-' + c.slug) === categoryId);
        setCategoryId(match ? match.id : availableCollections[0].id);
      }
      if (!description) {
        // Auto populate first template
        setDescription(productDescriptionTemplates[0].generate('Noor', 'Plum'));
      }
    }
  }, [existingProduct, categories, availableCollections, categoryId, description]);

  // Name select helper
  const handleSelectSuggestedName = (suggested: string) => {
    setName(suggested);
    setSlug(slugify(suggested));
  };

  // Color select helper
  const handleSelectColor = (selectedColor: string) => {
    setColor(selectedColor);
  };

  // Template select helper
  const handleSelectTemplate = (templateId: string) => {
    const tmpl = productDescriptionTemplates.find((t) => t.id === templateId);
    if (tmpl) {
      setDescription(tmpl.generate(name || 'Dress', color || 'Plum'));
    }
  };

  // Handle Photo Upload (up to 3)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = 3 - images.length;
    if (remainingSlots <= 0) {
      addToast({
        type: 'error',
        title: 'Limit Reached',
        description: 'You can upload a maximum of 3 images per dress.',
      });
      return;
    }

    const filesToAdd = Array.from(files).slice(0, remainingSlots);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [
          ...prev,
          { url: reader.result as string, file },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle size
  const handleToggleSize = (sizeKey: string) => {
    setSizes((prev) => ({
      ...prev,
      [sizeKey]: {
        ...prev[sizeKey],
        enabled: !prev[sizeKey].enabled,
      },
    }));
  };

  const handleStockChange = (sizeKey: string, val: number) => {
    setSizes((prev) => ({
      ...prev,
      [sizeKey]: {
        ...prev[sizeKey],
        stock: Math.max(0, val),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      addToast({ type: 'error', title: 'Name Required', description: 'Please enter or select a dress name.' });
      return;
    }

    if (!price || Number(price) <= 0) {
      addToast({ type: 'error', title: 'Price Required', description: 'Please enter a valid price in PKR.' });
      return;
    }

    const enabledVariants = Object.entries(sizes)
      .filter(([_, config]) => config.enabled)
      .map(([sizeKey, config]) => ({
        size: sizeKey,
        stock_quantity: statusType === 'out_of_stock' ? 0 : config.stock,
        sku: `SAN-${slugify(name).toUpperCase()}-${sizeKey}`,
      }));

    if (enabledVariants.length === 0) {
      addToast({ type: 'error', title: 'Size Required', description: 'Please enable at least one size (S, M, L, XL).' });
      return;
    }

    const isPreorder = statusType === 'preorder';
    const isPublished = statusType !== 'draft';
    const rawStatus = statusType === 'archived' ? 'archived' : statusType === 'draft' ? 'draft' : 'active';

    try {
      let productId = id;

      const matchedCat = availableCollections.find(
        (c) =>
          c.id === categoryId ||
          c.slug === categoryId ||
          ('cat-' + c.slug) === categoryId ||
          c.id === existingProduct?.category_id ||
          c.slug === existingProduct?.category_id ||
          ('cat-' + c.slug) === existingProduct?.category_id
      );

      const finalCategoryId =
        matchedCat?.id ||
        categoryId ||
        availableCollections[0]?.id ||
        'c1000000-0000-0000-0000-000000000010';

      const productPayload = {
        name: name.trim(),
        slug: slug.trim() || slugify(name),
        description: description.trim(),
        price: Number(price),
        compare_at_price: null,
        category_id: finalCategoryId,
        status: rawStatus as any,
        is_published: isPublished,
        is_featured: isFeatured,
        is_new_arrival: isNewArrival,
        is_preorder: isPreorder,
        preorder_closes_at: null,
        estimated_dispatch_date: null,
        preorder_limit: isPreorder ? 30 : null,
        tags: [color, fabricType, productType, isPreorder ? 'Pre-Order' : 'Available'].filter(Boolean) as string[],
        fabric: fabricType,
        fabric_care: fabricCare,
        product_type: productType,
        color: color,
        care_instructions: fabricCare === 'Dry Clean' ? 'Dry clean only.' : 'Washable (gentle cycle).',
        details: 'Graceful modest silhouette tailored with fine finishings.',
        display_order: Number(displayOrder) || 0,
        low_stock_threshold: 3,
      };

      if (isEditing && productId) {
        await updateProduct({ id: productId, data: productPayload });
      } else {
        const created = await createProduct(productPayload);
        productId = created.id;
      }

      // Save variants
      if (productId) {
        await setVariants({ productId, variants: enabledVariants });

        // Save images
        for (let i = 0; i < images.length; i++) {
          const img = images[i];
          if (!img.id) {
            await addProductImage({
              product_id: productId,
              url: img.url,
              storage_path: null,
              alt_text: `${name} — view ${i + 1}`,
              position: i,
            });
          }
        }
      }

      addToast({
        type: 'success',
        title: isEditing ? 'Product Updated' : 'Product Published',
        description: `"${name}" is now live on Sanaat.`,
      });

      navigate('/admin/products');
    } catch (err: any) {
      console.error('[SANAAT] Product save error:', err);
      const msg = err?.message || err?.error_description || 'Failed to save product.';
      addToast({
        type: 'error',
        title: 'Save Failed',
        description: msg.includes('row-level security')
          ? 'Database policy error (42501). Please apply the provided Supabase migration SQL to enable admin writes.'
          : msg,
      });
    }
  };

  if (isEditing && isLoadingExisting) {
    return <PageLoader message="Loading dress details..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <SEO title={`${isEditing ? 'Edit' : 'Add'} Product | SANAAT Admin`} />

      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
        <Link
          to="/admin/products"
          className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-serif text-black">
            {isEditing ? `Edit "${name || 'Dress'}"` : 'Add New Dress'}
          </h1>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-0.5">
            Effortless product publishing in under 2 minutes
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Photos Upload (Max 3 Images per Section 17) */}
        <div className="bg-white p-5 border border-gray-200 space-y-3">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black">
              Dress Photography (Up to 3 Photos) *
            </label>
            <span className="text-[11px] text-gray-400">
              {images.length}/3 uploaded
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((slotIdx) => {
              const img = images[slotIdx];
              return (
                <div
                  key={slotIdx}
                  className="aspect-[3/4] border border-dashed border-gray-300 relative bg-gray-50 flex flex-col items-center justify-center overflow-hidden"
                >
                  {img ? (
                    <>
                      <img
                        src={img.url}
                        alt={`Slot ${slotIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(slotIdx)}
                        className="absolute top-1.5 right-1.5 bg-black/75 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 font-sans uppercase tracking-widest">
                        Photo {slotIdx + 1}
                      </span>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-full flex flex-col items-center justify-center p-2 text-gray-400 hover:text-plum hover:bg-gray-100 transition-colors"
                    >
                      <Upload className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-sans uppercase tracking-wider font-medium">
                        + Add Photo {slotIdx + 1}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <p className="text-[11px] text-gray-500 font-sans">
            Upload clear, vertical fashion photos. The first image will be the primary catalog cover.
          </p>
        </div>

        {/* 2. Dress Name with Suggested Templates (Section 17) */}
        <div className="bg-white p-5 border border-gray-200 space-y-3">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block">
            Dress Name *
          </label>

          {/* Suggested Names Chips */}
          <div>
            <span className="text-[11px] text-gray-400 uppercase tracking-wider block mb-1.5 font-light">
              Suggested Sanaat Names (Click to select):
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedProductNames.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => handleSelectSuggestedName(sug)}
                  className={`text-xs px-3 py-1 font-serif border transition-colors ${
                    name === sug
                      ? 'border-plum bg-plum text-white font-medium'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(slugify(e.target.value));
            }}
            placeholder="e.g. Noor, Mehr, Aira..."
            required
          />
        </div>

        {/* 3. Color & Price */}
        <div className="bg-white p-5 border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Color */}
            <div>
              <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block mb-1">
                Color *
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COMMON_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleSelectColor(c)}
                    className={`text-[11px] px-2 py-0.5 border ${
                      color === c
                        ? 'border-plum bg-plum text-white font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Plum, Ivory, Sage"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block mb-1">
                Price (PKR) *
              </label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="16500"
                min={0}
                required
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Customer sees: {price ? formatPrice(Number(price)) : 'Rs. 0'}
              </span>
            </div>
          </div>
        </div>

        {/* 4. Collection Selection (Section 5: Winter Formals, Summer Edit, Occasion Wear) */}
        <div className="bg-white p-5 border border-gray-200 space-y-3">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block">
            Collection *
          </label>
          <p className="text-[11px] text-gray-500 font-sans">
            Select one of Sanaat's three signature collections.
          </p>

          {/* Quick Collection Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {availableCollections.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategoryId(cat.id)}
                className={`py-2.5 px-3 text-xs font-serif uppercase tracking-wider border transition-colors text-center ${
                  categoryId === cat.id
                    ? 'border-plum bg-plum text-white font-medium'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="pt-1">
            <Select
              value={categoryId || availableCollections[0]?.id || ''}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {availableCollections.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* 4.1 Product Type (Section 15: Top | Bottom | Set) */}
        <div className="bg-white p-5 border border-gray-200 space-y-3">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block">
            Product Type *
          </label>
          <p className="text-[11px] text-gray-500 font-sans">
            Determines whether customer views the Tops chart, Bottoms chart, or both.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {PRODUCT_TYPES.map((pt) => (
              <button
                key={pt}
                type="button"
                onClick={() => setProductType(pt)}
                className={`py-2.5 px-3 text-xs font-serif uppercase tracking-wider border transition-colors ${
                  productType === pt
                    ? 'border-plum bg-plum text-white font-medium'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                }`}
              >
                {pt}
              </button>
            ))}
          </div>
        </div>

        {/* 4.2 Fabric Selector (Section 13: Lawn | Khaddar | Cotton | Silk — strictly NO Velvet) */}
        <div className="bg-white p-5 border border-gray-200 space-y-3">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block">
            Fabric Type *
          </label>
          <p className="text-[11px] text-gray-500 font-sans">
            Select one fabric type. Customer product page will display &quot;Fabric: {fabricType}&quot;.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FABRIC_TYPES.map((fab) => (
              <button
                key={fab}
                type="button"
                onClick={() => setFabricType(fab)}
                className={`py-2.5 px-3 text-xs font-serif uppercase tracking-wider border transition-colors ${
                  fabricType === fab
                    ? 'border-plum bg-plum text-white font-medium'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                }`}
              >
                {fab}
              </button>
            ))}
          </div>
        </div>

        {/* 4.3 Fabric Care Selector (Section 14: Washable | Dry Clean) */}
        <div className="bg-white p-5 border border-gray-200 space-y-3">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block">
            Fabric Care *
          </label>
          <p className="text-[11px] text-gray-500 font-sans">
            Customer product page will display &quot;Fabric Care: {fabricCare}&quot;.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {FABRIC_CARE_OPTIONS.map((care) => (
              <button
                key={care}
                type="button"
                onClick={() => setFabricCare(care)}
                className={`py-2.5 px-3 text-xs font-serif uppercase tracking-wider border transition-colors ${
                  fabricCare === care
                    ? 'border-plum bg-plum text-white font-medium'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                }`}
              >
                {care}
              </button>
            ))}
          </div>
        </div>

        {/* 4.4 Featured on Homepage (Section 24: Admin Control) */}
        <div className="bg-white p-5 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block">
              Featured on Homepage
            </label>
            <p className="text-[11px] text-gray-500 font-sans mt-0.5">
              Display this dress in the curated homepage Featured Pieces carousel.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsFeatured(!isFeatured)}
            className={`w-full sm:w-auto px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-colors ${
              isFeatured
                ? 'bg-plum text-white border-plum'
                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {isFeatured ? '★ FEATURED (ON)' : 'NOT FEATURED (OFF)'}
          </button>
        </div>

        {/* 4.5 New Arrival Status (Task 3: Admin Control) */}
        <div className="bg-white p-5 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block">
              New Arrival Status
            </label>
            <p className="text-[11px] text-gray-500 font-sans mt-0.5">
              Flag this silhouette as a New Arrival on the storefront and New Collection pages.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsNewArrival(!isNewArrival)}
            className={`w-full sm:w-auto px-4 py-2 text-xs uppercase tracking-wider font-semibold border transition-colors ${
              isNewArrival
                ? 'bg-plum text-white border-plum'
                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {isNewArrival ? '✦ NEW ARRIVAL (ON)' : 'STANDARD (OFF)'}
          </button>
        </div>

        {/* 4.6 Product Display Order (Task 3: Admin Control) */}
        <div className="bg-white p-5 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block">
              Display Sequence Order
            </label>
            <p className="text-[11px] text-gray-500 font-sans mt-0.5">
              Sequence position on the storefront. Lower numbers appear first (e.g. 1, 2, 3).
            </p>
          </div>
          <div className="w-full sm:w-32">
            <input
              type="number"
              min="0"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 0)}
              className="w-full h-10 px-3 text-sm border border-gray-300 focus:border-plum focus:ring-1 focus:ring-plum outline-none bg-white font-mono"
            />
          </div>
        </div>

        {/* 5. Sizes & Stock (Default: S, M, L, XL per Section 17) */}
        <div className="bg-white p-5 border border-gray-200 space-y-3">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block">
            Sizes & Available Stock
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['S', 'M', 'L', 'XL'].map((sKey) => {
              const isEnabled = sizes[sKey]?.enabled;
              const stock = sizes[sKey]?.stock ?? 5;
              return (
                <div
                  key={sKey}
                  className={`p-3 border transition-colors ${
                    isEnabled ? 'border-plum bg-plum/5' : 'border-gray-200 bg-gray-50 opacity-60'
                  }`}
                >
                  <label className="flex items-center gap-2 cursor-pointer mb-2">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={() => handleToggleSize(sKey)}
                      className="text-plum focus:ring-plum"
                    />
                    <span className="font-serif font-bold text-sm text-black">Size {sKey}</span>
                  </label>
                  {isEnabled && (
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase block mb-1">
                        Stock
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={stock}
                        onChange={(e) => handleStockChange(sKey, Number(e.target.value))}
                        className="w-full text-xs p-1 border border-gray-300 bg-white"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Description with 3-4 Reusable Templates (Section 17 & 22) */}
        <div className="bg-white p-5 border border-gray-200 space-y-3">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block">
            Description Templates
          </label>

          <div className="flex flex-wrap gap-2">
            {productDescriptionTemplates.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleSelectTemplate(tmpl.id)}
                className="text-[11px] px-2.5 py-1 border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 transition-colors"
              >
                + {tmpl.label}
              </button>
            ))}
          </div>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Description automatically fills when selecting a template above, or type custom copy..."
          />
        </div>

        {/* 7. Status Selector (Section 17) */}
        <div className="bg-white p-5 border border-gray-200 space-y-3">
          <label className="text-xs font-sans font-semibold uppercase tracking-wider text-black block">
            Product Status *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'available', label: 'Available (In Stock)' },
              { id: 'preorder', label: 'Pre-Order (10-12 Days)' },
              { id: 'low_stock', label: 'Low Stock' },
              { id: 'out_of_stock', label: 'Out of Stock' },
              { id: 'draft', label: 'Draft / Hidden' },
              { id: 'archived', label: 'Archived' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setStatusType(st.id as any)}
                className={`p-2.5 text-xs text-left border transition-colors ${
                  statusType === st.id
                    ? 'border-plum bg-plum text-white font-medium'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* 8. Publish Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isCreating || isUpdating}
            className="py-4 text-xs tracking-[0.2em] font-sans font-medium"
          >
            {isEditing ? 'SAVE CHANGES' : 'PUBLISH DRESS TO SANAAT'}
          </Button>
        </div>
      </form>
    </div>
  );
}
