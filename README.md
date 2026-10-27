# SANAAT — E-Commerce Web Platform
**Tagline:** *FASHION WITH MODESTY*

A complete, production-ready modest fashion e-commerce website designed and engineered for **SANAAT**, a Pakistani luxury modest fashion brand.

Built with **React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router v7 + TanStack Query + Zustand**. Fully architected for **Supabase** with a seamless, zero-config in-memory mock fallback.

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Access Storefront
http://localhost:5173

# 4. Access Admin Dashboard
http://localhost:5173/admin
# (Sign in using the configured store owner admin credentials)
```

---

## Core Architecture & Features

- **Brand Aesthetic**: High-contrast, minimal editorial design.
  - White `#FFFFFF` primary background
  - Black `#000000` text & primary UI
  - Deep Plum `#6C255D` signature brand accent
  - Typographic pairing: *Cormorant Garamond* (self-hosted display serif) & *Inter* (sans-serif)
- **Storefront**:
  - Announcement bar with dismissible state
  - High-impact full-width editorial hero
  - New Collection, Category Tiles & Featured Products grids
  - Vertical-video/image Editorial Reel (Instagram aesthetic)
  - Interactive Size Selector with out-of-stock strike-throughs & Size Chart modal
  - Multi-image zoom gallery with thumbnail track
  - Live debounced search overlay
  - Quick View modal directly from cards
  - Slide-out Cart Drawer and full `/cart` page with line-item management
  - Single-page Pakistani checkout with phone validation, province selectors, Cash on Delivery, and Bank Transfer with IBFT instructions
  - Automated Order Confirmation page with reference numbers (e.g. `SNT-000123`)
  - Contact page with validated form and direct WhatsApp Concierge integration
- **Admin Dashboard (`/admin`)**:
  - Overview cards: Total products, Active, Pre-orders, Low Stock, Out of Stock, Orders
  - Product catalog manager: Add, edit, publish/unpublish, feature star, archive, delete
  - Product form: Multi-image drag-and-drop upload, auto-slug generator, size variant inventory rows, pre-order window configuration, fabric/care inputs
  - Quick Inventory Control (`/admin/inventory`): Inline stock adjustments that update the customer-facing storefront in real time
  - Order Management: Status pipeline (New → Confirmed → Processing → Dispatched → Delivered / Cancelled)
  - Category manager: CRUD operations on collections
- **Database & Security**:
  - PostgreSQL schema with Row Level Security (RLS) in `supabase/migrations/`
  - Atomic server-side order creation database function (RPC) validating stock and calculating authentic prices
  - Swappable mock service layer for immediate local development without credentials

---

## Documentation

For full documentation and step-by-step guides, refer to:
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Technical stack, routing map, and database model.
- [`docs/OWNER_GUIDE.md`](docs/OWNER_GUIDE.md) — Comprehensive guide for the store owner on adding products, managing stock, and launching to production.
