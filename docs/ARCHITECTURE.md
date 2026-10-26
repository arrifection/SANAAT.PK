# SANAAT — Architecture

## Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | React 18 + TypeScript + Vite | Fast DX, type safety, fast builds |
| Styling | Tailwind CSS v4 | Utility-first, design-token driven |
| Routing | React Router v7 (data routers, lazy routes) | SPA with code splitting |
| Database / Auth / Storage | Supabase (Postgres, Auth, Storage) | Managed DB with RLS, auth, and file uploads |
| Data Fetching | TanStack Query v5 | Caching, background refetch, optimistic updates |
| Forms | React Hook Form + Zod | Declarative validation, great DX |
| Client State | Zustand (cart, persisted to localStorage) | Minimal boilerplate, works outside React tree |
| Icons | Lucide React | Consistent, tree-shakable icon set |
| Typography | Cormorant Garamond (serif headings) + Inter (sans body) via @fontsource | Self-hosted, no CDN dependency |

## Local Fallback

All data access goes through service interfaces in `src/services/`. Each service has:
- A **Supabase implementation** (real database)
- A **Mock implementation** (in-memory, seeded with demo data)

The active implementation is selected at startup in `src/lib/service-provider.ts` based on the presence of `VITE_SUPABASE_URL`. Components never import a specific implementation.

## Data Model

See `supabase/migrations/` for full schema. Key tables:
- `categories` — product groupings
- `products` — main product info, status flags, pre-order config
- `product_images` — ordered gallery images per product
- `product_variants` — one row per size, stock lives here
- `orders` / `order_items` — guest checkout orders
- `profiles` — extends Supabase auth with `role` column
- `contact_messages` — contact form submissions

Stock status is **derived** from variant quantities and product flags. The single source of truth is `src/utils/stock.ts`.

## Routing Map

### Storefront
| Path | Page |
|---|---|
| `/` | Home |
| `/shop` | All products (filterable) |
| `/collections/new` | New collection |
| `/product/:slug` | Product detail |
| `/category/:slug` | Category listing |
| `/about` | About |
| `/contact` | Contact form |
| `/cart` | Cart (full page) |
| `/checkout` | Checkout |
| `/order-confirmation/:orderNumber` | Order confirmation |
| `/search` | Search results |
| `/account` | Account placeholder |
| `*` | 404 |

### Admin (`/admin/*`)
| Path | Page |
|---|---|
| `/admin/login` | Admin login |
| `/admin` | Dashboard |
| `/admin/products` | Product list |
| `/admin/products/new` | New product |
| `/admin/products/:id` | Edit product |
| `/admin/inventory` | Inventory management |
| `/admin/orders` | Order list |
| `/admin/orders/:id` | Order detail |
| `/admin/categories` | Category management |

## Auth Approach

- Supabase Auth (email/password) for admin users
- A `profiles` table with `role = 'admin'` gates admin access
- `ProtectedRoute` component checks session + role on the client
- Row Level Security on every table enforces access on the server
- First admin created via a documented SQL snippet (no default credentials)
- Guest checkout for customers (no customer auth required)

## Folder Structure

```
sanaat/
├── docs/                          # Architecture, owner guide
├── public/                        # Static assets, favicon, robots.txt
├── supabase/migrations/           # SQL schema, RLS, seed data
├── src/
│   ├── assets/brand/              # Logo files
│   ├── components/
│   │   ├── ui/                    # Design system primitives
│   │   ├── layout/                # Header, Footer, AnnouncementBar
│   │   ├── product/               # ProductCard, Gallery, SizeSelector
│   │   ├── home/                  # Hero, CategoryGrid, EditorialReel
│   │   ├── cart/                  # CartDrawer, CartItem
│   │   └── common/                # SafeImage, EmptyState, ErrorState
│   ├── layouts/                   # StoreLayout, AdminLayout
│   ├── pages/                     # Storefront pages
│   ├── admin/
│   │   ├── pages/                 # Admin pages
│   │   └── components/            # Admin-specific components
│   ├── services/                  # Data access interfaces + implementations
│   ├── hooks/                     # Custom hooks (useProducts, useCart, etc.)
│   ├── store/                     # Zustand stores (cart)
│   ├── types/                     # TypeScript type definitions
│   ├── utils/                     # formatPrice, slugify, stock helpers
│   ├── lib/                       # Supabase client, env validation, query client
│   ├── routes/                    # Route config, ProtectedRoute
│   └── content/                   # Editable placeholder copy
├── .env.example                   # Required environment variables
└── package.json
```

## Deployment

Target: Vercel or Netlify. SPA rewrite config included (`vercel.json` / `_redirects`).
