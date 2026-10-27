import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useDashboardStats,
  useDashboardRecentOrders,
} from '../../hooks/use-dashboard';
import { formatPrice, formatDate } from '../../utils';
import { Skeleton } from '../../components/ui';
import { SEO } from '../../components/common';
import { useToast } from '../../components/ui/toast';
import {
  Package,
  ShoppingBag,
  Clock,
  AlertTriangle,
  XCircle,
  Plus,
  Eye,
  Ruler,
  Upload,
  Check,
} from 'lucide-react';

export function AdminDashboardPage() {
  const { data: stats, isLoading: isLoadingStats } = useDashboardStats();
  const { data: recentOrders, isLoading: isLoadingOrders } = useDashboardRecentOrders(5);
  const { addToast } = useToast();

  const [sizeChartUrl, setSizeChartUrl] = useState<string | null>(null);
  const sizeChartInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sanaat_size_chart_image');
      setSizeChartUrl(saved);
    } catch {
      setSizeChartUrl(null);
    }
  }, []);

  const handleSizeChartUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      try {
        localStorage.setItem('sanaat_size_chart_image', result);
        setSizeChartUrl(result);
        addToast({
          type: 'success',
          title: 'Size Chart Updated',
          description: 'Your official size chart image is now active across all product pages.',
        });
      } catch {
        addToast({
          type: 'error',
          title: 'Storage Error',
          description: 'Failed to save size chart image. Try a slightly smaller image file.',
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetSizeChart = () => {
    try {
      localStorage.removeItem('sanaat_size_chart_image');
      setSizeChartUrl(null);
      addToast({
        type: 'info',
        title: 'Reset to Standard',
        description: 'Now using Sanaat standard typography size chart.',
      });
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <SEO title="Dashboard | SANAAT Admin" />

      {/* Header & Quick Action Buttons per Section 21 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-black font-normal">
            SANAAT Admin
          </h1>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-1 font-sans">
            Simple, time-saving boutique management
          </p>
        </div>

        {/* Quick Actions (Section 21) */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/admin/products/new">
            <button
              type="button"
              className="bg-plum hover:bg-plum/90 text-white px-4 py-2 text-xs font-sans uppercase tracking-widest font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Product</span>
            </button>
          </Link>
          <Link to="/admin/orders">
            <button
              type="button"
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 text-xs font-sans uppercase tracking-widest font-medium transition-colors"
            >
              View Orders
            </button>
          </Link>
          <Link to="/admin/products">
            <button
              type="button"
              className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 text-xs font-sans uppercase tracking-widest font-medium transition-colors"
            >
              Manage Products
            </button>
          </Link>
        </div>
      </div>

      {/* Only Useful Information (Section 21) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* New Orders */}
        <div className="bg-white p-5 border border-gray-200 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 font-sans">
              New Orders
            </span>
            <ShoppingBag className="w-4 h-4 text-plum" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-plum">
            {isLoadingStats ? <Skeleton className="h-8 w-12" /> : stats?.newOrders ?? 0}
          </div>
          <Link
            to="/admin/orders"
            className="text-[10px] text-gray-400 hover:text-black uppercase tracking-wider font-sans block"
          >
            Review Orders →
          </Link>
        </div>

        {/* Active Products */}
        <div className="bg-white p-5 border border-gray-200 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 font-sans">
              Active Products
            </span>
            <Package className="w-4 h-4 text-plum" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-black">
            {isLoadingStats ? <Skeleton className="h-8 w-12" /> : stats?.activeProducts ?? 0}
          </div>
          <Link
            to="/admin/products"
            className="text-[10px] text-gray-400 hover:text-black uppercase tracking-wider font-sans block"
          >
            Catalog View →
          </Link>
        </div>

        {/* Pre-Orders */}
        <div className="bg-white p-5 border border-gray-200 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 font-sans">
              Pre-Orders
            </span>
            <Clock className="w-4 h-4 text-plum" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-black">
            {isLoadingStats ? <Skeleton className="h-8 w-12" /> : stats?.preorderProducts ?? 0}
          </div>
          <span className="text-[10px] text-plum font-sans uppercase tracking-wider block font-medium">
            10-12 Days Dispatch
          </span>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 border border-gray-200 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 font-sans">
              Low Stock
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-600">
            {isLoadingStats ? <Skeleton className="h-8 w-12" /> : stats?.lowStockProducts ?? 0}
          </div>
          <Link
            to="/admin/inventory"
            className="text-[10px] text-amber-700 underline font-sans uppercase tracking-wider block"
          >
            Adjust Stock →
          </Link>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-5 border border-gray-200 space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 font-sans">
              Out of Stock
            </span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-red-600">
            {isLoadingStats ? <Skeleton className="h-8 w-12" /> : stats?.outOfStockProducts ?? 0}
          </div>
          <Link
            to="/admin/inventory"
            className="text-[10px] text-red-700 underline font-sans uppercase tracking-wider block"
          >
            Replenish →
          </Link>
        </div>
      </div>

      {/* Global Size Chart Management Card (Section 7) */}
      <div className="bg-white p-5 sm:p-6 border border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 bg-plum/10 text-plum flex items-center justify-center flex-shrink-0 rounded-sm">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-sans font-semibold uppercase tracking-wider text-black">
              Storewide Size Chart
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 font-sans font-light max-w-lg">
              Upload your official Sanaat size chart once. It is automatically presented in a lightbox modal on every product page when customers click &ldquo;SEE SIZE CHART&rdquo;.
            </p>
            <div className="mt-2 flex items-center gap-2 text-[11px] font-sans">
              <span className="text-gray-400">Current status:</span>
              {sizeChartUrl ? (
                <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Custom Size Chart Active
                </span>
              ) : (
                <span className="text-plum font-medium">
                  Standard S/M/L/XL Measurement Grid Active
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <input
            ref={sizeChartInputRef}
            type="file"
            accept="image/*"
            onChange={handleSizeChartUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => sizeChartInputRef.current?.click()}
            className="bg-black hover:bg-plum text-white px-4 py-2 text-xs font-sans uppercase tracking-widest font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{sizeChartUrl ? 'Replace Chart' : 'Upload Size Chart'}</span>
          </button>
          {sizeChartUrl && (
            <button
              type="button"
              onClick={handleResetSizeChart}
              className="border border-gray-300 hover:bg-gray-100 text-black px-3 py-2 text-xs font-sans uppercase tracking-widest transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white border border-gray-200 p-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h2 className="text-sm font-sans font-semibold uppercase tracking-wider text-black">
            Recent Customer Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-xs font-sans uppercase tracking-widest text-plum hover:underline"
          >
            View All Orders →
          </Link>
        </div>

        {isLoadingOrders ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : recentOrders && recentOrders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-sans"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-plum">
                    {order.order_number}
                  </span>
                  <span className="text-black font-medium">{order.customer_name}</span>
                  <span className="text-gray-400">· {formatDate(order.created_at)}</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-gray-500 uppercase">
                    {order.payment_method === 'jazzcash' ? 'JazzCash' : 'COD'}
                  </span>
                  <span className="font-serif font-bold text-black text-sm">
                    {formatPrice(order.total)}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] uppercase font-semibold capitalize rounded-sm ${
                      order.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-plum text-white'
                    }`}
                  >
                    {order.status}
                  </span>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="p-1 text-gray-400 hover:text-black"
                    title="View Order"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-6 font-sans uppercase tracking-wider">
            No recent orders yet. Orders will appear here in real time.
          </p>
        )}
      </div>
    </div>
  );
}
