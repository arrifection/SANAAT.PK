import { useParams, Link } from 'react-router-dom';
import { useOrderByNumber } from '../hooks/use-orders';
import { formatPrice } from '../utils';
import { Button, Skeleton } from '../components/ui';
import { SEO, EmptyState, SafeImage } from '../components/common';
import { CheckCircle2, PackageCheck, MessageSquare, ArrowRight } from 'lucide-react';
import { JAZZCASH_INFO, CONTACT_INFO } from '../content/site-config';

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

  const isJazzCash = (order.payment_method as string) === 'jazzcash';
  const whatsappReceiptUrl = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${encodeURIComponent(
    `Hello Sanaat, here is my JazzCash payment confirmation for Order ${order.order_number}. Total: Rs. ${order.total}`
  )}`;

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <SEO
        title={`Order Received: ${order.order_number} | SANAAT`}
        description="Your SANAAT fashion order has been received and confirmed."
      />

      {/* Confirmation Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-plum/10 text-plum rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
        </div>
        <span className="text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-semibold">
          Order Received
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-black mt-1 mb-2 font-normal">
          Thank you, {order.customer_name.split(' ')[0]}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 font-sans max-w-md mx-auto font-light">
          We have received your order. We will reach out to you via call or WhatsApp at{' '}
          <strong className="text-black font-semibold">{order.phone}</strong> before dispatch.
        </p>

        <div className="inline-block mt-4 px-4 py-2.5 bg-gray-50 border border-gray-200">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-sans">Order Number: </span>
          <span className="text-sm font-mono font-bold text-plum ml-1">{order.order_number}</span>
        </div>
      </div>

      {/* JazzCash Payment Instructions (Section 14) */}
      {isJazzCash && (
        <div className="mb-8 p-6 bg-plum/5 border border-plum/30 space-y-4">
          <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-plum">
            JazzCash Payment Instructions
          </h3>
          <p className="text-xs font-sans text-gray-700 leading-relaxed font-light">
            Please transfer the total amount of <strong className="font-semibold text-black">{formatPrice(order.total)}</strong> to our official JazzCash account:
          </p>
          <div className="text-xs font-mono bg-white p-4 border border-gray-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Account Name:</span>
              <strong className="text-black font-semibold">{JAZZCASH_INFO.accountName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">JazzCash Number:</span>
              <strong className="text-plum text-sm">{JAZZCASH_INFO.accountNumber}</strong>
            </div>
          </div>
          <div className="pt-1">
            <a
              href={whatsappReceiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-plum hover:bg-plum/90 text-white px-5 py-2.5 text-xs font-sans uppercase tracking-widest transition-colors w-full sm:w-auto"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Share Payment Screenshot on WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Cash on Delivery Notice */}
      {!isJazzCash && (
        <div className="mb-8 p-4 bg-gray-50 border border-gray-200 flex items-start gap-3 text-xs text-gray-700">
          <PackageCheck className="w-5 h-5 text-plum flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-black uppercase tracking-wider block mb-0.5">
              Cash on Delivery Confirmed
            </span>
            <p className="text-gray-600 font-light">
              Please have exact cash amount of <strong>{formatPrice(order.total)}</strong> ready upon delivery by the courier.
            </p>
          </div>
        </div>
      )}

      {/* Order Details Card */}
      <div className="bg-white border border-gray-200 divide-y divide-gray-100 mb-8">
        <div className="p-4 sm:p-5">
          <h2 className="text-xs font-sans font-semibold uppercase tracking-wider text-black">
            Ordered Items ({order.items.length})
          </h2>
          <div className="divide-y divide-gray-100 mt-3">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-16 bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
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
                    <p className="text-[11px] font-sans text-gray-500 uppercase mt-0.5">
                      Size: <strong className="text-black font-semibold">{item.size}</strong> · Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-serif font-medium text-black text-sm">
                  {formatPrice(item.unit_price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-4 sm:p-5 bg-gray-50/50 space-y-2 text-xs font-sans">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium text-black">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping ({order.shipping_address.province})</span>
            <span className="font-medium text-black">{formatPrice(order.shipping_fee)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-black border-t border-gray-200 pt-2.5">
            <span>Total</span>
            <span className="font-serif text-base text-plum">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="p-4 sm:p-5 text-xs font-sans text-gray-600 space-y-1">
          <span className="font-semibold text-black uppercase tracking-wider block mb-1">
            Shipping Destination:
          </span>
          <p>{order.shipping_address.line1}</p>
          <p>{order.shipping_address.city}, {order.shipping_address.province}</p>
          <p>Contact: {order.phone}</p>
        </div>
      </div>

      <div className="text-center">
        <Link to="/shop">
          <Button variant="secondary" size="md" className="text-xs uppercase tracking-widest font-sans">
            <span>CONTINUE SHOPPING</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 inline" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
