import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminOrderById, useUpdateOrderStatus } from '../../hooks/use-orders';
import { formatPrice, formatDateTime } from '../../utils';
import { Button, Select, Skeleton } from '../../components/ui';
import { SEO, SafeImage, EmptyState } from '../../components/common';
import { useToast } from '../../components/ui/toast';
import { ArrowLeft, MapPin, User, Package } from 'lucide-react';
import type { OrderStatus } from '../../types';

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useAdminOrderById(id || '');
  const { mutateAsync: updateStatus, isPending } = useUpdateOrderStatus();
  const { addToast } = useToast();

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        description="The requested order ID does not exist in the database."
        actionLabel="Back to Orders"
        actionHref="/admin/orders"
      />
    );
  }

  const currentStatus = (selectedStatus || order.status) as OrderStatus;

  const handleStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === order.status) return;

    try {
      await updateStatus({ id: order.id, status: selectedStatus as OrderStatus });
      addToast({
        type: 'success',
        title: 'Status Updated',
        description: `Order ${order.order_number} marked as ${selectedStatus}.`,
      });
    } catch {
      addToast({ type: 'error', title: 'Error', description: 'Failed to update order status' });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <SEO title={`Order ${order.order_number} | SANAAT Admin`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/orders"
            className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif text-black">{order.order_number}</h1>
              <span
                className={`px-2 py-0.5 rounded-sm text-[10px] uppercase font-semibold capitalize ${
                  order.status === 'delivered'
                    ? 'bg-emerald-50 text-emerald-700'
                    : order.status === 'cancelled'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-plum text-white'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Placed on {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>

        {/* Status Update Control */}
        <div className="flex items-center gap-2 bg-white p-2 border border-gray-200">
          <Select
            value={currentStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="text-xs h-8 py-0.5 w-40"
          >
            <option value="new">New</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="dispatched">Dispatched</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Select>

          <Button
            size="sm"
            variant="secondary"
            loading={isPending}
            disabled={!selectedStatus || selectedStatus === order.status}
            onClick={handleStatusUpdate}
            className="text-[11px] tracking-wider"
          >
            UPDATE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Ordered Items & Financials */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 border border-gray-200 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-black border-b border-gray-100 pb-2 flex items-center gap-2">
              <Package className="w-4 h-4 text-plum" />
              <span>Items in Order ({order.items.length})</span>
            </h2>

            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-16 bg-gray-50 overflow-hidden flex-shrink-0">
                      <SafeImage
                        src={item.image_url_snapshot}
                        alt={item.product_name_snapshot}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-serif font-medium text-black">
                        {item.product_name_snapshot}
                      </h4>
                      <p className="text-[11px] text-gray-500 uppercase">
                        Size: <strong>{item.size}</strong> · Qty: {item.quantity}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Unit: {formatPrice(item.unit_price)}
                      </p>
                    </div>
                  </div>

                  <div className="font-serif font-semibold text-black text-sm">
                    {formatPrice(item.unit_price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Financial summary */}
            <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-black">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee</span>
                <span className="font-medium text-black">
                  {order.shipping_fee === 0 ? 'Free' : formatPrice(order.shipping_fee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-black border-t border-gray-200 pt-2">
                <span>Grand Total</span>
                <span className="font-serif text-base">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white p-6 border border-gray-200 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-black">
                Customer Delivery Notes
              </h3>
              <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-sm leading-relaxed">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Right: Customer & Shipping Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Profile */}
          <div className="bg-white p-6 border border-gray-200 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-black border-b border-gray-100 pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-plum" />
              <span>Customer Details</span>
            </h2>
            <div className="text-xs space-y-1">
              <p className="font-bold text-black text-sm">{order.customer_name}</p>
              <p className="text-gray-600">{order.email}</p>
              <p className="font-mono text-gray-700">{order.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-6 border border-gray-200 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-black border-b border-gray-100 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-plum" />
              <span>Shipping Address</span>
            </h2>
            <div className="text-xs text-gray-700 space-y-0.5">
              <p>{order.shipping_address.line1}</p>
              {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
              <p>
                {order.shipping_address.city}, {order.shipping_address.province}
              </p>
              <p>{order.shipping_address.postal_code}</p>
              <p className="font-medium text-black">{order.shipping_address.country}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 border border-gray-200 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-black border-b border-gray-100 pb-2">
              Payment Status
            </h2>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Method</span>
                <span className="font-semibold uppercase text-black">
                  {order.payment_method}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="capitalize font-medium text-black">
                  {order.payment_status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
