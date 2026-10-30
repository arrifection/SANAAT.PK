import { useState, useEffect } from 'react';
import { useSiteSettings, useUpdateSiteSettings } from '../../hooks/use-settings';
import { useAllCategories, useUpdateCategory } from '../../hooks/use-categories';
import { useProducts, useUpdateProduct } from '../../hooks/use-products';
import { useToast } from '../../components/ui/toast';
import { SEO } from '../../components/common';
import { Input, Textarea, Skeleton } from '../../components/ui';
import {
  Sparkles,
  Quote,
  Eye,
  EyeOff,
  Save,
  Plus,
  Trash2,
  ArrowUpDown,
  Layers,
} from 'lucide-react';
import type { SiteSettings } from '../../types';

export function AdminStorefrontPage() {
  const { data: settings, isLoading: isLoadingSettings } = useSiteSettings();
  const { mutateAsync: updateSettings, isPending: isSavingSettings } = useUpdateSiteSettings();
  const { data: categories, isLoading: isLoadingCategories } = useAllCategories();
  const { mutateAsync: updateCategory } = useUpdateCategory();
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ limit: 50 });
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { addToast } = useToast();

  // Local form state for site settings
  const [formData, setFormData] = useState<SiteSettings>({
    announcement_text: '',
    announcement_visible: true,
    moving_ticker_text: '',
    moving_ticker_visible: true,
    hero_headline: '',
    hero_title: '',
    hero_subline: '',
    hero_bg_image: '',
    brand_quotes: [],
    about_heading: '',
    about_quote: '',
    about_description: '',
    about_visible: true,
    featured_visible: true,
    categories_visible: true,
  });

  const [activeTab, setActiveTab] = useState<'announcements' | 'hero' | 'sections' | 'ordering'>('announcements');
  const [newQuoteText, setNewQuoteText] = useState('');

  // Category & Product order local states
  const [categoryOrders, setCategoryOrders] = useState<Record<string, number>>({});
  const [productOrders, setProductOrders] = useState<Record<string, number>>({});

  useEffect(() => {
    if (settings) {
      setFormData({
        announcement_text: settings.announcement_text ?? 'Free Delivery Across Pakistan on Orders Over PKR 10,000',
        announcement_visible: settings.announcement_visible ?? true,
        moving_ticker_text: settings.moving_ticker_text ?? 'Pre-order Available ✦ Free Delivery Above Rs 10,000',
        moving_ticker_visible: settings.moving_ticker_visible ?? true,
        hero_headline: settings.hero_headline ?? 'Winter Formals 2026',
        hero_title: settings.hero_title ?? 'Timeless Modest Elegance',
        hero_subline: settings.hero_subline ?? 'Contemporary silhouettes woven with traditional Pakistani craftsmanship',
        hero_bg_image: settings.hero_bg_image ?? '/images/hero/sanaat-hero-campaign.webp',
        brand_quotes: settings.brand_quotes && settings.brand_quotes.length > 0
          ? [...settings.brand_quotes]
          : [
              'Simplicity is the ultimate sophistication.',
              'Grace woven into every thread.',
              'Understated luxury for the modern muse.',
            ],
        about_heading: settings.about_heading ?? 'About Sanaat',
        about_quote: settings.about_quote ?? 'Each piece in our collection is an ode to understated luxury, designed for the woman who values modesty without compromising on poise.',
        about_description: settings.about_description ?? 'Sanaat is a luxury Pakistani modest wear brand celebrating the timeless beauty of eastern cuts, handcrafted textures, and refined minimalism.',
        about_visible: settings.about_visible ?? true,
        featured_visible: settings.featured_visible ?? true,
        categories_visible: settings.categories_visible ?? true,
      });
    }
  }, [settings]);

  useEffect(() => {
    if (categories) {
      const orders: Record<string, number> = {};
      categories.forEach((cat) => {
        orders[cat.id] = cat.display_order ?? 0;
      });
      setCategoryOrders(orders);
    }
  }, [categories]);

  useEffect(() => {
    if (productsData?.data) {
      const pOrders: Record<string, number> = {};
      productsData.data.forEach((prod) => {
        pOrders[prod.id] = prod.display_order ?? 0;
      });
      setProductOrders(pOrders);
    }
  }, [productsData]);

  const handleSaveSettings = async () => {
    try {
      await updateSettings(formData);
      addToast({
        type: 'success',
        title: 'Settings Saved',
        description: 'Homepage and storefront settings updated successfully on the live site.',
      });
    } catch (err: any) {
      console.error('[SANAAT] Storefront save error:', err);
      const msg = err?.message || 'Could not save storefront settings to the database.';
      addToast({
        type: 'error',
        title: 'Save Failed',
        description: msg,
      });
    }
  };

  const handleAddQuote = () => {
    if (!newQuoteText.trim()) return;
    setFormData((prev) => ({
      ...prev,
      brand_quotes: [...prev.brand_quotes, newQuoteText.trim()],
    }));
    setNewQuoteText('');
  };

  const handleRemoveQuote = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      brand_quotes: prev.brand_quotes.filter((_, i) => i !== index),
    }));
  };

  const handleSaveCategoryOrder = async (catId: string) => {
    try {
      const order = categoryOrders[catId] ?? 0;
      await updateCategory({ id: catId, data: { display_order: order } });
      addToast({
        type: 'success',
        title: 'Order Updated',
        description: 'Category display sequence saved.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        description: err?.message || 'Could not update category sequence.',
      });
    }
  };

  const handleSaveProductOrder = async (prodId: string) => {
    try {
      const order = productOrders[prodId] ?? 0;
      await updateProduct({ id: prodId, data: { display_order: order } });
      addToast({
        type: 'success',
        title: 'Order Updated',
        description: 'Product display sequence saved.',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Update Failed',
        description: err?.message || 'Could not update product sequence.',
      });
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <SEO title="Storefront & Homepage | SANAAT Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-black font-normal">
            Storefront & Homepage Manager
          </h1>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-1 font-sans">
            Direct mobile-first control over homepage visual elements, copy & display order
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveSettings}
          disabled={isSavingSettings}
          className="w-full sm:w-auto bg-plum hover:bg-plum/90 text-white px-6 py-2.5 text-xs font-sans uppercase tracking-widest font-semibold inline-flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSavingSettings ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Navigation Tabs (Mobile-friendly horizontal scroll) */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'announcements', label: 'Announcements & Ticker', icon: Sparkles },
          { id: 'hero', label: 'Hero & Quotes', icon: Quote },
          { id: 'sections', label: 'Section Visibility & About', icon: Layers },
          { id: 'ordering', label: 'Sequence & Display Order', icon: ArrowUpDown },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-plum text-plum font-semibold'
                : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Announcements & Ticker */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          {/* Top Announcement Bar */}
          <div className="bg-white p-5 sm:p-6 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-black">
                  Top Announcement Bar
                </h3>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  Top strip displayed above the navigation on all pages.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    announcement_visible: !prev.announcement_visible,
                  }))
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-sm border ${
                  formData.announcement_visible
                    ? 'bg-plum text-white border-plum'
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                {formData.announcement_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{formData.announcement_visible ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-sans font-medium uppercase tracking-wider text-black block mb-1">
                Announcement Message
              </label>
              <Input
                value={formData.announcement_text}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, announcement_text: e.target.value }))
                }
                placeholder="Free Delivery Across Pakistan on Orders Over PKR 10,000"
              />
            </div>
          </div>

          {/* Slim Moving Ticker */}
          <div className="bg-white p-5 sm:p-6 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-black">
                  Slim Moving Announcement Ticker
                </h3>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  Subtle animated marquee badge positioned right next to the logo.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    moving_ticker_visible: !prev.moving_ticker_visible,
                  }))
                }
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-sm border ${
                  formData.moving_ticker_visible
                    ? 'bg-plum text-white border-plum'
                    : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}
              >
                {formData.moving_ticker_visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{formData.moving_ticker_visible ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>

            <div>
              <label className="text-xs font-sans font-medium uppercase tracking-wider text-black block mb-1">
                Ticker Text
              </label>
              <Input
                value={formData.moving_ticker_text}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, moving_ticker_text: e.target.value }))
                }
                placeholder="Pre-order Available ✦ Free Delivery Above Rs 10,000"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Hero & Rotating Quotes */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {/* Hero Banner Controls */}
          <div className="bg-white p-5 sm:p-6 border border-gray-200 space-y-4">
            <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-black pb-3 border-b border-gray-100">
              Hero Campaign Content
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans font-medium uppercase tracking-wider text-black block mb-1">
                  Eyebrow / Subheading
                </label>
                <Input
                  value={formData.hero_headline}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hero_headline: e.target.value }))
                  }
                  placeholder="Winter Formals 2026"
                />
              </div>

              <div>
                <label className="text-xs font-sans font-medium uppercase tracking-wider text-black block mb-1">
                  Main Title
                </label>
                <Input
                  value={formData.hero_title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hero_title: e.target.value }))
                  }
                  placeholder="Timeless Modest Elegance"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-sans font-medium uppercase tracking-wider text-black block mb-1">
                Hero Tagline / Subtitle
              </label>
              <Input
                value={formData.hero_subline}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, hero_subline: e.target.value }))
                }
                placeholder="Contemporary silhouettes woven with traditional Pakistani craftsmanship"
              />
            </div>

            <div>
              <label className="text-xs font-sans font-medium uppercase tracking-wider text-black block mb-1">
                Hero Background Image URL
              </label>
              <Input
                value={formData.hero_bg_image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, hero_bg_image: e.target.value }))
                }
                placeholder="/images/hero/sanaat-hero-campaign.webp"
              />
              <p className="text-[11px] text-gray-400 mt-1 font-sans">
                Preserves current official visual by default. Update only when new campaign assets are provided.
              </p>
            </div>
          </div>

          {/* Rotating Brand Quotes */}
          <div className="bg-white p-5 sm:p-6 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-black">
                  Rotating Brand Quotes
                </h3>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  Smoothly cycle every 2–3 seconds in the center of the hero banner.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {formData.brand_quotes.map((quote, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-sm"
                >
                  <Quote className="w-4 h-4 text-plum flex-shrink-0" />
                  <span className="font-serif italic text-sm text-black flex-1">
                    &ldquo;{quote}&rdquo;
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuote(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove quote"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Input
                value={newQuoteText}
                onChange={(e) => setNewQuoteText(e.target.value)}
                placeholder="Enter a short brand quote (e.g. Elegance in every thread)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddQuote();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddQuote}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 flex-shrink-0 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Quote</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Section Visibility & About Sanaat */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          {/* Section Visibility Controls */}
          <div className="bg-white p-5 sm:p-6 border border-gray-200 space-y-4">
            <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-black pb-3 border-b border-gray-100">
              Homepage Section Visibility
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Featured Pieces */}
              <div className="p-4 border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-sans font-medium text-xs uppercase tracking-wider text-black">
                    Featured Pieces Carousel
                  </h4>
                  <p className="text-[11px] text-gray-500 font-sans mt-1">
                    Three compact cards in one horizontal row with left/right browse arrows.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      featured_visible: !prev.featured_visible,
                    }))
                  }
                  className={`w-full py-2 text-xs uppercase tracking-wider font-semibold border transition-colors ${
                    formData.featured_visible
                      ? 'bg-plum text-white border-plum'
                      : 'bg-gray-200 text-gray-600 border-gray-300'
                  }`}
                >
                  {formData.featured_visible ? 'Visible (ON)' : 'Hidden (OFF)'}
                </button>
              </div>

              {/* The Sanaat Edit (Categories) */}
              <div className="p-4 border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-sans font-medium text-xs uppercase tracking-wider text-black">
                    The Sanaat Edit
                  </h4>
                  <p className="text-[11px] text-gray-500 font-sans mt-1">
                    Curated collection cover cards with alternating animated entrances.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      categories_visible: !prev.categories_visible,
                    }))
                  }
                  className={`w-full py-2 text-xs uppercase tracking-wider font-semibold border transition-colors ${
                    formData.categories_visible
                      ? 'bg-plum text-white border-plum'
                      : 'bg-gray-200 text-gray-600 border-gray-300'
                  }`}
                >
                  {formData.categories_visible ? 'Visible (ON)' : 'Hidden (OFF)'}
                </button>
              </div>

              {/* About Sanaat */}
              <div className="p-4 border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-sans font-medium text-xs uppercase tracking-wider text-black">
                    About Sanaat Statement
                  </h4>
                  <p className="text-[11px] text-gray-500 font-sans mt-1">
                    Signature plum-brand banner positioned directly below The Sanaat Edit.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      about_visible: !prev.about_visible,
                    }))
                  }
                  className={`w-full py-2 text-xs uppercase tracking-wider font-semibold border transition-colors ${
                    formData.about_visible
                      ? 'bg-plum text-white border-plum'
                      : 'bg-gray-200 text-gray-600 border-gray-300'
                  }`}
                >
                  {formData.about_visible ? 'Visible (ON)' : 'Hidden (OFF)'}
                </button>
              </div>
            </div>
          </div>

          {/* About Sanaat Content */}
          <div className="bg-white p-5 sm:p-6 border border-gray-200 space-y-4">
            <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-black pb-3 border-b border-gray-100">
              About Sanaat Content (Plum Banner)
            </h3>

            <div>
              <label className="text-xs font-sans font-medium uppercase tracking-wider text-black block mb-1">
                Heading Label
              </label>
              <Input
                value={formData.about_heading}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, about_heading: e.target.value }))
                }
                placeholder="About Sanaat"
              />
            </div>

            <div>
              <label className="text-xs font-sans font-medium uppercase tracking-wider text-black block mb-1">
                Center Quote (Serif Heading)
              </label>
              <Input
                value={formData.about_quote}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, about_quote: e.target.value }))
                }
                placeholder="Each piece in our collection is an ode to understated luxury..."
              />
            </div>

            <div>
              <label className="text-xs font-sans font-medium uppercase tracking-wider text-black block mb-1">
                Description Paragraph
              </label>
              <Textarea
                rows={3}
                value={formData.about_description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, about_description: e.target.value }))
                }
                placeholder="Sanaat is a luxury Pakistani modest wear brand celebrating..."
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Sequence & Display Order */}
      {activeTab === 'ordering' && (
        <div className="space-y-6">
          {/* Category Ordering */}
          <div className="bg-white p-5 sm:p-6 border border-gray-200 space-y-4">
            <div>
              <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-black">
                Category Display Sequence
              </h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                Controls the arrangement order of collections in The Sanaat Edit and navigation menus (lower numbers appear first).
              </p>
            </div>

            {isLoadingCategories ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <div className="divide-y divide-gray-100">
                {categories?.map((cat) => (
                  <div
                    key={cat.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="font-serif font-medium text-sm text-black">
                        {cat.name}
                      </span>
                      <span className="text-[11px] text-gray-400 font-sans ml-2">
                        ({cat.slug})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-sans">Sequence Order:</span>
                      <input
                        type="number"
                        min="0"
                        value={categoryOrders[cat.id] ?? cat.display_order}
                        onChange={(e) =>
                          setCategoryOrders((prev) => ({
                            ...prev,
                            [cat.id]: parseInt(e.target.value, 10) || 0,
                          }))
                        }
                        className="w-20 h-9 px-2 text-sm border border-gray-300 focus:border-plum outline-none font-mono text-center"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveCategoryOrder(cat.id)}
                        className="bg-black hover:bg-plum text-white px-3 py-2 text-xs uppercase tracking-wider font-medium transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Ordering */}
          <div className="bg-white p-5 sm:p-6 border border-gray-200 space-y-4">
            <div>
              <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-black">
                Product Display Sequence
              </h3>
              <p className="text-xs text-gray-500 font-sans mt-0.5">
                Controls the priority order in Featured Pieces and Shop catalog listings (lower numbers appear first).
              </p>
            </div>

            {isLoadingProducts ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {productsData?.data.map((prod) => (
                  <div
                    key={prod.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                        {prod.images?.[0]?.url && (
                          <img
                            src={prod.images[0].url}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <div className="font-serif font-medium text-sm text-black">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-gray-400 font-sans">
                          {prod.category?.name || 'Uncategorized'} · {prod.is_featured ? '⭐ Featured' : 'Standard'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-sans">Sequence Order:</span>
                      <input
                        type="number"
                        min="0"
                        value={productOrders[prod.id] ?? prod.display_order}
                        onChange={(e) =>
                          setProductOrders((prev) => ({
                            ...prev,
                            [prod.id]: parseInt(e.target.value, 10) || 0,
                          }))
                        }
                        className="w-20 h-9 px-2 text-sm border border-gray-300 focus:border-plum outline-none font-mono text-center"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveProductOrder(prod.id)}
                        className="bg-black hover:bg-plum text-white px-3 py-2 text-xs uppercase tracking-wider font-medium transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}