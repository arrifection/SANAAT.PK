import { createBrowserRouter, Navigate } from 'react-router-dom';
import { StoreLayout } from '../layouts/store-layout';
import { AdminLayout } from '../layouts/admin-layout';
import { ProtectedRoute } from './protected-route';

// Storefront Pages
import { HomePage } from '../pages/home';
import { ShopPage } from '../pages/shop';
import { NewCollectionPage } from '../pages/new-collection';
import { CollectionsPage } from '../pages/collections-page';
import { ProductDetailPage } from '../pages/product-detail';
import { CategoryPage } from '../pages/category-page';
import { AboutPage } from '../pages/about';
import { ContactPage } from '../pages/contact';
import { CartPage } from '../pages/cart-page';
import { CheckoutPage } from '../pages/checkout';
import { OrderConfirmationPage } from '../pages/order-confirmation';
import { SearchPage } from '../pages/search-page';
import { AccountPlaceholderPage } from '../pages/account-placeholder';
import { ShippingPolicyPage } from '../pages/shipping-policy';
import { PreOrderPolicyPage } from '../pages/pre-order-policy';
import { ExchangePolicyPage } from '../pages/exchange-policy';
import { NotFoundPage } from '../pages/not-found';

// Admin Pages
import { AdminLoginPage } from '../admin/pages/admin-login';
import { AdminDashboardPage } from '../admin/pages/admin-dashboard';
import { AdminProductsPage } from '../admin/pages/admin-products';
import { AdminProductFormPage } from '../admin/pages/admin-product-form';
import { AdminInventoryPage } from '../admin/pages/admin-inventory';
import { AdminOrdersPage } from '../admin/pages/admin-orders';
import { AdminOrderDetailPage } from '../admin/pages/admin-order-detail';
import { AdminCategoriesPage } from '../admin/pages/admin-categories';

export const router = createBrowserRouter([
  // Storefront Layout Routes
  {
    path: '/',
    element: <StoreLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'collections/new', element: <NewCollectionPage /> },
      { path: 'collections', element: <CollectionsPage /> },
      { path: 'collections/:slug', element: <CategoryPage /> },
      { path: 'collection/:slug', element: <CategoryPage /> },
      { path: 'product/:slug', element: <ProductDetailPage /> },
      { path: 'category/:slug', element: <CategoryPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'order-confirmation/:orderNumber', element: <OrderConfirmationPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'account', element: <AccountPlaceholderPage /> },

      // Policies (Section 10, 11, 12)
      { path: 'shipping-policy', element: <ShippingPolicyPage /> },
      { path: 'pre-order-policy', element: <PreOrderPolicyPage /> },
      { path: 'exchange-policy', element: <ExchangePolicyPage /> },

      // Legacy / Friendly Aliases to prevent 404s
      { path: 'shipping-returns', element: <Navigate to="/shipping-policy" replace /> },
      { path: 'shipping', element: <Navigate to="/shipping-policy" replace /> },
      { path: 'returns', element: <Navigate to="/exchange-policy" replace /> },
      { path: 'size-guide', element: <Navigate to="/shop" replace /> },
      { path: 'care-instructions', element: <Navigate to="/about" replace /> },

      // Catch-all
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Admin Login (Standalone)
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },

  // Protected Admin Routes
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'products/new', element: <AdminProductFormPage /> },
          { path: 'products/:id', element: <AdminProductFormPage /> },
          { path: 'inventory', element: <AdminInventoryPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'orders/:id', element: <AdminOrderDetailPage /> },
          { path: 'categories', element: <AdminCategoriesPage /> },
        ],
      },
    ],
  },
]);
