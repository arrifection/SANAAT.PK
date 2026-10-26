import { useParams, Link } from 'react-router-dom';
import { useOrderByNumber } from '../hooks/use-orders';
import { formatPrice } from '../utils';
import { Button, Skeleton } from '../components/ui';
import { SEO, EmptyState, SafeImage } from '../components/common';
import { CheckCircle2, PackageCheck, MessageSquare } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../content/site-config';

export function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { data: order, isLoading } = useOrderByNumber(orderNumber || '');

  if (isLoading) {
    return (
      <div className="py-20 max-w-2xl mx-auto px-4 text-center space-y-4">
        <Skeleton className="w-16 h-16 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center">
        <SEO title="Order Not Found | SANAAT" />
        <EmptyState
          title="Order not found"
          description={`We could not locate an order matching reference "${orderNumber}".`}
          actionLabel="Return to Shop"
          actionHref="/shop"
        />
      </div>
    );
  }

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <SEO
        title={`Order Confirmed: ${order.order_number} | SANAAT`}
        description="Your SANAAT fashion order has been received and confirmed."
      />

      {/* Confirmation Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-plum/10 text-plum rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-semibold">
          Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-black mt-1 mb-2">
          Thank you, {order.customer_name.split(' ')[0]}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-sans max-w-md mx-auto">
          We have received your order. A confirmation email with receipt and tracking details will be sent to{' '}
          <strong className="text-black font-semibold">{order.email}</strong>.
        </p>

        <div className="inline-block mt-4 px-4 py-2 bg-gray-50 border border-gray-200">
          <span className="text-xs uppercase tracking-widest text-gray-500">Order Number: </span>
          <span className="text-sm font-mono font-bold text-black ml-1">{order.order_number}</span>
        </div>
      </div>

      {/* Payment Instruction Notice */}
      {order.payment_method === 'bank_transfer' && (
        <div className="mb-8 p-6 bg-plum/5 border border-plum/30 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-plum">
            Bank Transfer Details (IBFT)
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed">
            Please transfer <strong>{formatPrice(order.total)}</strong> to our official account:
          </p>
          <div className="text-xs font-mono bg-white p-3 border border-gray-200 space-y-1">
            <p>Bank: <strong>Meezan Bank Ltd</strong></p>
            <p>Title: <strong>SANAAT STUDIO</strong></p>
            <p>IBAN: <strong>PK44MEZN0001234567890123</strong></p>
          </div>
          <p className="text-xs text-gray-600">
            Share payment screenshot via WhatsApp at{' '}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Payment%20Screenshot%20for%20Order%20${order.order_number}`}
              target="_blank"
              rel="noreferrer"
              className="text-plum font-semibold underline inline-flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5 inline" />
              +{WHATSAPP_NUMBER}
            </a>
          </p>
        </div>
      )}

      {order.payment_method === 'cod' && (
        <div className="mb-8 p-4 bg-gray-50 border border-gray-200 flex items-start gap-3 text-xs text-gray-700">
          <PackageCheck className="w-5 h-5 text-plum flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-black uppercase tracking-wider block mb-0.5">
              Cash on Delivery Selected
            </span>
            <span>
              Please have exact cash amount of <strong>{formatPrice(order.total)}</strong> ready for the courier upon arrival.
            </span>
          </div>
        </div>
      )}

      {/* Order Details Card */}
      <div className="bg-white border border-gray-200 p-6 sm:p-8 space-y-6">
        <h2 className="text-sm font-serif font-semibold text-black uppercase tracking-wider border-b border-gray-200 pb-3">
          Order Summary
        </h2>

        {/* Items */}
        <div className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-18 bg-gray-50 overflow-hidden flex-shrink-0">
                  <SafeImage
                    src={item.image_url_snapshot}
                    alt={item.product_name_snapshot}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-serif text-black">
                    {item.product_name_snapshot}
                  </h4>
                  <p className="text-[11px] text-gray-500 uppercase">
                    Size: {item.size} · Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <div className="text-xs font-semibold text-black font-serif">
                {formatPrice(item.unit_price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Address and Financials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200 text-xs">
          <div>
            <span className="uppercase tracking-wider font-semibold text-gray-400 block mb-2 font-sans">
              Shipping Destination
            </span>
            <div className="text-gray-700 space-y-0.5">
              <p className="font-medium text-black">{order.customer_name}</p>
              <p>{order.shipping_address.line1}</p>
              {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
              <p>
                {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
              </p>
              <p>{order.shipping_address.country}</p>
              <p className="pt-1 text-gray-500">Phone: {order.phone}</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="uppercase tracking-wider font-semibold text-gray-400 block mb-2 font-sans">
              Financial Breakdown
            </span>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="text-black font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee</span>
              <span className="text-black font-medium">
                {order.shipping_fee === 0 ? 'Free' : formatPrice(order.shipping_fee)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-black border-t border-gray-200 pt-2">
              <span>Grand Total</span>
              <span className="font-serif text-base">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-8 text-center space-y-3">
        <Link to="/shop">
          <Button variant="secondary" size="lg" className="text-xs tracking-widest px-8">
            CONTINUE SHOPPING
          </Button>
        </Link>
      </div>
    </div>
  );
}
