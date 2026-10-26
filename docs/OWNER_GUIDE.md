# SANAAT — Brand & Store Owner Guide

Welcome to your SANAAT modest fashion e-commerce platform. This document explains everything about how your store works, how to manage products, how inventory is tracked, and what you need before launching to the public.

---

## 1. What Has Been Built

We have built a custom, production-ready e-commerce web platform engineered specifically for **SANAAT** (Tagline: *FASHION WITH MODESTY*).

### Key Highlights
- **Editorial Brand Aesthetic**: Clean, high-fashion layout with generous whitespace, Cormorant Garamond serif typography for headings, and Inter for modern body text.
- **Strict Brand Palette**:
  - Pure White (`#FFFFFF`) for luminous editorial backdrops
  - Jet Black (`#000000`) for typography and clean UI borders
  - Deep Plum (`#6C255D`) for brand accent buttons, announcement bar, and pre-order badges
- **Dual Operating Modes**:
  1. **Local Fallback Mode**: Works instantly out of the box without any third-party credentials. Pre-seeded with 12+ demo Pakistani fashion pieces (Lawn formals, Silk & Chiffon, Handloom Khaddar, Everyday Solids).
  2. **Supabase Cloud Mode**: Connects to your PostgreSQL database, Auth, Storage, and Row-Level Security policies simply by adding environment variables in `.env.local`. Zero code changes required.
- **Full Storefront**:
  - Announcement bar with customizable text
  - Editorial Hero with campaign imagery and CTAs
  - New Collection showcase
  - Interactive "Shop by Category" tiles
  - Editorial "Reel" / Visual Journal section (Instagram aesthetic)
  - Philosophy and brand statements
  - Full product catalog with live filtering (category, pre-order status, price sort)
  - High-fashion Product Detail page with multi-image gallery, interactive zoom, size selectors, size guide table modal, and expandable accordions (Silhouette, Fabric, Care, Shipping)
  - Quick View modal directly from product cards
  - Real-time search overlay with live debounced product results
  - Slide-out Shopping Bag drawer and full `/cart` page with quantity controls
  - Single-page guest checkout designed for Pakistani customers (tolerant phone validation, Pakistani provinces dropdown, Cash on Delivery, Bank Transfer with IBFT instructions)
  - Automated Order Confirmation page with reference numbers (e.g., `SNT-000123`)
  - Dedicated Contact page with inquiry submission and direct WhatsApp Concierge links
- **Complete Back-Office Admin Dashboard (`/admin`)**:
  - Secure login with role enforcement
  - Real-time analytics overview (Total products, Active, Pre-orders, Low-stock alerts, Depleted items, Orders)
  - Product manager: Full catalog table with instant publish toggle, homepage feature star, archiving, and deletion
  - Product editor: Multi-image drag-and-drop upload, auto-slug generator, per-size variant inventory rows, pre-order window configuration, fabric/care inputs
  - Quick Inventory Control (`/admin/inventory`): Inline increment/decrement stock adjustments that update the customer-facing storefront in real time
  - Order Management: Status pipeline (New → Confirmed → Processing → Dispatched → Delivered / Cancelled) with customer address and line-item breakdown
  - Category manager: Add, edit, reorder, and toggle collections

---

## 2. Project Folder Structure

```
Sanaat/
├── docs/
│   ├── ARCHITECTURE.md          # Technical stack, architecture & schema decisions
│   └── OWNER_GUIDE.md           # This comprehensive guide for the store owner
├── public/
│   ├── _redirects               # Netlify SPA routing rules
│   └── favicon.svg              # SANAAT brand monogram
├── supabase/
│   └── migrations/
│       ├── 20240101000000_init_schema.sql  # Full Postgres schema, RPC function & RLS
│       └── 20240101000001_seed_data.sql    # Category and product seed data
├── src/
│   ├── assets/
│   │   └── brand/               # Place real logo files here (logo.svg / logo.png)
│   ├── components/
│   │   ├── cart/                # CartDrawer, CartItem, CartSummary
│   │   ├── common/              # SafeImage (lazy, no layout shift), EmptyState, SEO
│   │   ├── home/                # Hero, CategoryGrid, EditorialReel, PreorderBanner
│   │   ├── layout/              # Header, Footer, AnnouncementBar, MobileMenu, Logo
│   │   ├── product/             # ProductCard, ProductGallery, SizeSelector, QuickView
│   │   └── ui/                  # Button, Input, Select, Textarea, Badge, Modal, Drawer, Toast
│   ├── layouts/
│   │   ├── StoreLayout.tsx      # Public header, announcement bar, drawer, footer
│   │   └── AdminLayout.tsx      # Dark utilitarian admin sidebar and top bar
│   ├── pages/                   # All public storefront pages
│   ├── admin/
│   │   └── pages/               # Dashboard, Products, Inventory, Orders, Categories
│   ├── content/
│   │   ├── site-config.ts       # Shipping fees, free shipping threshold, WhatsApp, IG
│   │   └── site-content.ts      # All marketing copy, About page, Care, Size chart
│   ├── hooks/                   # React Query data hooks
│   ├── lib/                     # Supabase client, service provider, query client
│   ├── routes/                  # React Router data routes & ProtectedRoute guard
│   ├── services/
│   │   ├── interfaces.ts        # Pure TypeScript service definitions
│   │   ├── mock/                # In-memory service with demo products & checkout
│   │   └── supabase/            # Production Supabase PostgreSQL implementation
│   ├── store/
│   │   └── cart.ts              # Zustand cart store with localStorage persistence
│   ├── types/                   # Unified TypeScript interfaces
│   └── utils/
│       ├── index.ts             # formatPrice (PKR), slugify, order number generator
│       └── stock.ts             # SINGLE SOURCE OF TRUTH for stock & purchase rules
├── .env.example                 # Template for required environment variables
├── package.json
├── tailwind.config.js / App.css # Tailwind CSS v4 styling & typography theme
├── vercel.json                  # Vercel SPA routing configuration
└── vite.config.ts
```

---

## 3. How the Product & Inventory Database Works

Stock is managed strictly per **Size Variant** (`product_variants` table):
- Each product can have multiple sizes: `XS`, `S`, `M`, `L`, `XL` (or `ONE SIZE` for unstitched or accessory pieces).
- Every size has its own `stock_quantity`.
- A product's **Total Stock** is the sum of stock across all its sizes.

### Single Source of Truth for Status
The system automatically calculates the status in real time (`src/utils/stock.ts`):
1. **DRAFT / UNPUBLISHED**: Completely hidden from customer search, collections, and catalog.
2. **ARCHIVED**: Preserved in the database for past order records; hidden from the storefront; restorable by admin at any time.
3. **PRE-ORDER**: If `is_preorder = true` and the closing date has not passed, the item displays a deep plum **PRE-ORDER** badge. Customers can purchase it even if stock is 0. The button reads **PRE-ORDER NOW**, and expected dispatch dates are clearly presented.
4. **OUT OF STOCK**: If total stock reaches `0` (and it is not a pre-order), the storefront automatically updates. The image dims, an **OUT OF STOCK** badge appears, the size buttons disable, and the checkout button becomes disabled. The server-side checkout RPC will reject any attempt to purchase it.
5. **LOW STOCK**: If total stock is equal to or below the `low_stock_threshold` (default is 3), an alert badge and notice (*"Only X left"*) display to encourage immediate checkout.
6. **AVAILABLE**: Standard in-stock item.

---

## 4. How to Add a New Product (Step by Step)

1. Navigate to `http://localhost:5173/admin/products` and click the **+ ADD PRODUCT** button (or go to `/admin/products/new`).
2. **Basic Information**:
   - Enter **Product Title** (e.g. *Aalia Embroidered Lawn Kurti*).
   - The **URL Slug** will automatically format (e.g. `aalia-embroidered-lawn-kurti`). You can edit it manually if desired.
   - Select a **Category** (e.g. *Lawn Formals*).
   - Enter a brief **Description** highlighting the silhouette and embroidery.
   - Enter optional search tags separated by commas (`lawn, summer, formal`).
3. **Pricing & Thresholds**:
   - Enter the **Retail Price** in Pakistani Rupees (e.g. `14500`).
   - If this item is on sale, enter a higher **Compare-at Price** (e.g. `16500`) to display a strike-through discount on the storefront.
   - Set the **Low Stock Alert Threshold** (default: `3`).
4. **Size Variants & Inventory**:
   - Add the sizes you are offering (`XS`, `S`, `M`, `L`, etc.).
   - Enter the initial stock units available for each size.
   - Add optional internal SKUs (e.g. `SNT-AALIA-S`).
5. **Photography**:
   - Drag and drop or browse product images. The first image will be set as the primary catalog cover; additional images form the gallery and crossfade on hover.
6. **Pre-Order Settings (Optional)**:
   - Check *Enable Pre-Order* if this piece is being produced upon demand.
   - Specify a closing date and estimated shipping month.
7. **Fabric & Garment Specifications**:
   - Specify the textile composition (e.g. *Pure Pima Cotton Lawn shirt with chiffon dupatta*).
   - Specify care instructions (e.g. *Dry clean recommended*).
8. Click **PUBLISH PRODUCT**. It is immediately live on the storefront!

---

## 5. How to Mark a Product Out of Stock

There are two ways:
1. **Automatic (Natural Sales)**: As customers purchase the last pieces through checkout, the stock automatically drops to `0`. The moment total stock reaches zero, the product automatically shifts to **OUT OF STOCK** on the live site with zero manual intervention required.
2. **Manual Instant Adjustment**:
   - Go to `/admin/inventory`.
   - Find the product or use the search bar.
   - Click the **Minus (-)** button or type `0` directly into the stock box for each size.
   - The adjustment saves immediately and the storefront reflects the out-of-stock state instantly.

---

## 6. How to Mark a Product as Pre-Order

1. Go to `/admin/products` and click the **Edit** icon next to the product.
2. Scroll to **Section 5: Pre-Order Settings**.
3. Toggle the **Enable Pre-Order** checkbox to `ON`.
4. (Optional) Set **Pre-Order Closes At** if reservations should shut off on a specific date.
5. (Optional) Set **Estimated Dispatch Date** (e.g. *25 November 2026*).
6. Click **SAVE CHANGES**.
7. The product card and detail page will now feature the **PRE-ORDER** badge in deep plum, the primary action button changes to **PRE-ORDER NOW**, and the estimated dispatch timeline is displayed to the customer.

---

## 7. How to Access the Admin Dashboard & Create the First Admin

### Accessing the Dashboard
- Admin URL: `http://localhost:5173/admin`
- Direct Login Page: `http://localhost:5173/admin/login`

### In Local Fallback Mode (Demo)
You can sign in immediately using:
- **Email**: `admin@sanaat.pk`
- **Password**: `admin123`

### In Supabase Production Mode
We do not hard-code default credentials. To create your first administrative user:
1. In your [Supabase Dashboard](https://supabase.com/dashboard), navigate to **Authentication** > **Users** and click **Add User** (Create user with your private email and a strong password).
2. Go to the **SQL Editor** tab in your Supabase dashboard and run this command (replace with your email):

```sql
-- Promote your user to SANAAT Store Administrator
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'your-email@sanaat.pk'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

Now you can log in at `/admin/login` using your private credentials. Only users with `role = 'admin'` can access the dashboard or write to the database.

---

## 8. External Services & Accounts to Connect for Production

When you are ready to transition from local testing to a live public store, set up the following accounts:

| Service | Purpose | Account to Create |
|---|---|---|
| **Supabase** | Cloud PostgreSQL database, image uploads bucket, admin auth | [supabase.com](https://supabase.com) (Free tier available) |
| **Hosting (Vercel or Netlify)** | Fast global edge web hosting with automatic SSL | [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com) |
| **Domain Registrar** | Your custom brand domain (`sanaat.pk` or `sanaat.com`) | PKNIC (for `.pk`) or Namecheap / Google Domains |
| **WhatsApp Business** | Direct customer concierge and payment screenshot verification | WhatsApp Business App on official phone |
| **Email Delivery (Optional)** | Automated transactional order receipts | Resend or SendGrid |
| **Payment Gateway (Phase 2)** | Direct credit/debit card processing | PayFast, Safepay, or JazzCash |

### Exact Environment Variables Required
In your local root folder, copy `.env.example` to `.env.local` and configure:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Store Information
VITE_SITE_URL=https://sanaat.pk
VITE_SITE_NAME=SANAAT

# Customer Contact
VITE_WHATSAPP_NUMBER=+923001234567
VITE_INSTAGRAM_URL=https://instagram.com/sanaat.pk

# Domestic Shipping Rates (PKR)
VITE_SHIPPING_FEE=250
VITE_FREE_SHIPPING_THRESHOLD=5000
```

---

## 9. How to Run the Project Locally

Open PowerShell or terminal in the `sanaat` folder:

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run the development server
npm run dev

# 3. Open in your browser
http://localhost:5173
```

To create an optimized production build and verify performance:
```bash
# Compile and package for production
npm run build

# Preview the production build locally
npm run preview
```

---

## 10. Checklist Remaining Before Production Public Launch

- [ ] **Official Logo**: Place your high-resolution vector logo files in `src/assets/brand/` and update `src/components/layout/logo.tsx`.
- [ ] **Campaign Photography**: Replace demo images in `src/content/site-content.ts` with your high-resolution editorial photoshoot imagery.
- [ ] **Brand Copy Review**: Review the story in `src/content/site-content.ts` (Story, Mission, Care instructions, Size chart) to match your exact atelier specifications.
- [ ] **Domestic Shipping Rates**: Confirm standard flat shipping fee (currently Rs. 250) and free shipping threshold (currently Rs. 5,000) in `.env.local`.
- [ ] **Legal & Return Policies**: Review the 7-day return policy text in `site-content.ts`.
- [ ] **Database Connection**: Run the migrations in `supabase/migrations/` on your live Supabase project and insert your admin account.
- [ ] **Supabase Storage Bucket**: Create a public bucket named `product-images` in your Supabase Storage dashboard with public read access.
- [ ] **Custom Domain**: Connect `sanaat.pk` to your Vercel or Netlify project.
