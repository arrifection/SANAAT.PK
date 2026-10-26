import { Link } from 'react-router-dom';
import {
  useDashboardStats,
  useDashboardRecentOrders,
  useDashboardLowStock,
} from '../../hooks/use-dashboard';
import { formatPrice } from '../../utils';
import { getTotalStock } from '../../utils/stock';
import { Skeleton } from '../../components/ui';
import { SEO, SafeImage } from '../../components/common';
import {
  Package,
  ShoppingBag,
  Clock,
  AlertTriangle,
  XCircle,
  TrendingUp,
} from 'lucide-react';

export function AdminDashboardPage() {
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: recentOrders, isLoading: isLoadingOrders } = useDashboardRecentOrders(5);
  const { data: lowStockItems, isLoading: isLoadingLowStock } = useDashboardLowStock(6);

  return (
    <div className="space-y-8">
      <SEO title="Dashboard | SANAAT Admin" />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-black">Store Overview</h1>
        <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
          Real-time metrics and order activity
        </p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white p-5 border border-gray-200">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium text-gray-500">
              Total Products
            </span>
            <Package className="w-4 h-4 text-plum" />
          </div>
          <div className="text-2xl font-serif font-bold text-black">
            {isLoadingStats ? <Skeleton className="h-8 w-12" /> : stats?.totalProducts}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">
            {stats?.activeProducts} currently active
          </span>
        </div>

        {/* Pre-Orders */}
        <div className="bg-white p-5 border border-gray-200">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium text-gray-500">
              Pre-Orders
            </span>
            <Clock className="w-4 h-4 text-plum" />
          </div>
          <div className="text-2xl font-serif font-bold text-black">
            {isLoadingStats ? <Skeleton className="h-8 w-12" /> : stats?.preorderProducts}
          </div>
          <span className="text-[11px] text-plum mt-1 block font-medium">
            Active pre-order campaigns
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 border border-gray-200">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium text-gray-500">
              Low Stock
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-amber-600">
            {isLoadingStats ? <Skeleton className="h-8 w-12" /> : stats?.lowStockProducts}
          </div>
          <Link
            to="/admin/inventory"
            className="text-[11px] text-amber-700 underline mt-1 block"
          >
            Review in Inventory →
          </Link>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-5 border border-gray-200">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium text-gray-500">
              Out of Stock
            </span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-serif font-bold text-red-600">
            {isLoadingStats ? <Skeleton className="h-8 w-12" /> : stats?.outOfStockProducts}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Zero inventory</span>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 border border-gray-200">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium text-gray-500">
              Total Orders
            </span>
            <ShoppingBag className="w-4 h-4 text-plum" />
          </div>
          <div className="text-2xl font-serif font-bold text-black">
            {isLoadingStats ? <Skeleton className="h-8 w-12" /> : stats?.totalOrders}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 block">Lifetime volume</span>
        </div>

        {/* New Orders */}
        <div className="bg-white p-5 border border-gray-200">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs uppercase tracking-wider font-medium text-gray-500">
              New Orders
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-600">
            {isLoadingStats ? <Skeleton className="h-8 w-12" /> : stats?.newOrders}
          </div>
          <Link to="/admin/orders" className="text-[11px] text-emerald-700 underline mt-1 block">
            Awaiting dispatch →
          </Link>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Panel */}
        <div className="lg:col-span-7 bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h2 className="text-lg font-serif text-black">Recent Orders</h2>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider">
                Latest customer purchases
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs uppercase tracking-wider text-plum hover:underline font-semibold"
            >
              View All Orders →
            </Link>
          </div>

          {isLoadingOrders ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !recentOrders || recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400 uppercase tracking-widest">
              No orders placed yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider">
                    <th className="pb-2 font-medium">Order #</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-mono font-semibold text-black">
                        <Link to={`/admin/orders/${order.id}`} className="hover:text-plum">
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="py-3 text-gray-700">{order.customer_name}</td>
                      <td className="py-3 font-medium text-black">{formatPrice(order.total)}</td>
                      <td className="py-3">
                        <span className="capitalize px-2 py-0.5 rounded-sm text-[10px] bg-gray-100 text-gray-700 font-medium">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Watchlist */}
        <div className="lg:col-span-5 bg-white p-6 border border-gray-200">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div>
              <h2 className="text-lg font-serif text-black">Stock Watchlist</h2>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider">
                Low or depleted inventory
              </p>
            </div>
            <Link
              to="/admin/inventory"
              className="text-xs uppercase tracking-wider text-plum hover:underline font-semibold"
            >
              Manage →
            </Link>
          </div>

          {isLoadingLowStock ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !lowStockItems || lowStockItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-700 uppercase tracking-widest">
              Inventory levels healthy
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {lowStockItems.map((prod) => {
                const totalStock = getTotalStock(prod.variants);
                return (
                  <div key={prod.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-12 bg-gray-50 flex-shrink-0 overflow-hidden">
                        <SafeImage
                          src={prod.images[0]?.url}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-serif text-black truncate">{prod.name}</h4>
                        <span className="text-[10px] text-gray-400 uppercase">
                          Threshold: {prod.low_stock_threshold}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
                          totalStock === 0
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {totalStock} Left
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
