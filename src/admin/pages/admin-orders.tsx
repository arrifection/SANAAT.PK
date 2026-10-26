import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminOrders } from '../../hooks/use-orders';
import { formatPrice, formatDate } from '../../utils';
import { Input, Select, Skeleton } from '../../components/ui';
import { SEO } from '../../components/common';
import { Search, Eye } from 'lucide-react';
import type { OrderStatus, OrderType } from '../../types';

export function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<OrderType | ''>('');

  const { data: result, isLoading } = useAdminOrders({
    search: search || undefined,
    status: (statusFilter as OrderStatus) || undefined,
    order_type: (typeFilter as OrderType) || undefined,
    limit: 50,
  });

  const orders = result?.data || [];

  return (
    <div className="space-y-6">
      <SEO title="Orders | SANAAT Admin" />

      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-serif text-black">Customer Orders</h1>
        <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
          Review purchases, process dispatch statuses, and monitor pre-orders
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 border border-gray-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order number or customer..."
              className="pl-9 text-xs h-9 py-1"
            />
          </div>

          <div className="w-44">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus)}
              className="text-xs h-9 py-1"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>

          <div className="w-36">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as OrderType)}
              className="text-xs h-9 py-1"
            >
              <option value="">All Types</option>
              <option value="standard">Standard</option>
              <option value="preorder">Pre-Order</option>
            </Select>
          </div>
        </div>

        <div className="text-xs text-gray-400 uppercase tracking-wider">
          Found <strong>{orders.length}</strong> orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Order Number</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Customer</th>
              <th className="py-3 px-4 font-semibold text-center">Items</th>
              <th className="py-3 px-4 font-semibold">Type</th>
              <th className="py-3 px-4 font-semibold">Payment</th>
              <th className="py-3 px-4 font-semibold">Total</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td colSpan={9} className="p-4">
                    <Skeleton className="h-10 w-full" />
                  </td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-400 uppercase tracking-widest">
                  No orders match the selected filters
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  {/* Order Number */}
                  <td className="py-3 px-4 font-mono font-bold text-black">
                    <Link to={`/admin/orders/${order.id}`} className="hover:text-plum">
                      {order.order_number}
                    </Link>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-gray-500">{formatDate(order.created_at)}</td>

                  {/* Customer */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-black">{order.customer_name}</div>
                    <div className="text-[10px] text-gray-400">{order.email}</div>
                  </td>

                  {/* Items */}
                  <td className="py-3 px-4 text-center font-medium">
                    {order.items.reduce((s, it) => s + it.quantity, 0)}
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-semibold ${
                        order.order_type === 'preorder'
                          ? 'bg-plum text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {order.order_type}
                    </span>
                  </td>

                  {/* Payment */}
                  <td className="py-3 px-4 uppercase text-[10px] font-semibold text-gray-600">
                    {order.payment_method}
                  </td>

                  {/* Total */}
                  <td className="py-3 px-4 font-serif font-bold text-black text-sm">
                    {formatPrice(order.total)}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-semibold capitalize ${
                        order.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.status === 'dispatched'
                          ? 'bg-blue-50 text-blue-700'
                          : order.status === 'cancelled'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-plum font-semibold uppercase"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
