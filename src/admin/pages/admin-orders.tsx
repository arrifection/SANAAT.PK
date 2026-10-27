import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminOrders } from '../../hooks/use-orders';
import { formatPrice, formatDate } from '../../utils';
import { Input, Select, Skeleton } from '../../components/ui';
import { SEO } from '../../components/common';
import { Search, Eye, MessageCircle } from 'lucide-react';
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
          Review orders, track customer requests, and manage dispatches
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
              placeholder="Search by order #, customer, phone..."
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
          Total: <strong>{orders.length}</strong> orders
        </div>
      </div>

      {/* Orders Table (Section 20) */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Order Number</th>
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Customer</th>
              <th className="py-3 px-4 font-semibold">Destination</th>
              <th className="py-3 px-4 font-semibold">Payment</th>
              <th className="py-3 px-4 font-semibold">Shipping</th>
              <th className="py-3 px-4 font-semibold">Total</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Details</th>
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
                  No orders found matching filters
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const cleanPhone = order.phone.replace(/[^0-9]/g, '');
                const formattedPhone = cleanPhone.startsWith('0') ? `92${cleanPhone.slice(1)}` : cleanPhone;
                const quickWhatsAppUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
                  `Hello ${order.customer_name}, contacting you from SANAAT regarding your order ${order.order_number}.`
                )}`;

                return (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Order Number */}
                    <td className="py-3 px-4 font-mono font-bold text-plum">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="hover:underline flex items-center gap-1"
                      >
                        {order.order_number}
                        {order.order_type === 'preorder' && (
                          <span className="text-[9px] bg-plum text-white px-1 py-0.2 rounded-xs uppercase tracking-wider">
                            Pre
                          </span>
                        )}
                      </Link>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <span className="font-medium text-black block">{order.customer_name}</span>
                      <a
                        href={quickWhatsAppUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-gray-500 hover:text-plum font-mono flex items-center gap-1 mt-0.5"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600 inline" />
                        <span>{order.phone}</span>
                      </a>
                    </td>

                    {/* Address / Province */}
                    <td className="py-3 px-4 text-gray-600">
                      <span>{order.shipping_address?.city || 'Pakistan'}</span>
                      <span className="text-[10px] text-gray-400 block font-light">
                        {order.shipping_address?.province || 'Punjab'}
                      </span>
                    </td>

                    {/* Payment */}
                    <td className="py-3 px-4 uppercase font-medium text-[11px] text-black">
                      {order.payment_method === 'jazzcash' ? (
                        <span className="text-plum font-semibold">JazzCash</span>
                      ) : (
                        <span>COD</span>
                      )}
                    </td>

                    {/* Shipping Fee */}
                    <td className="py-3 px-4 font-mono text-gray-600">
                      {formatPrice(order.shipping_fee)}
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
                            : order.status === 'cancelled'
                            ? 'bg-red-50 text-red-700'
                            : order.status === 'dispatched'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-plum text-white'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Action link */}
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 bg-gray-100 hover:bg-black hover:text-white text-black px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
