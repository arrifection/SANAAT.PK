import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../store/cart';
import { useCreateOrder } from '../hooks/use-orders';
import { useToast } from '../components/ui/toast';
import { Button, Input, Select, Textarea } from '../components/ui';
import { SEO, SafeImage } from '../components/common';
import { formatPrice } from '../utils';
import {
  calculateShippingFee,
  JAZZCASH_INFO,
  CONTACT_INFO,
} from '../content/site-config';
import { Lock, ShieldCheck, ArrowLeft } from 'lucide-react';

const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Kashmir',
  'Gilgit-Baltistan',
] as const;

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address').or(z.literal('')).optional(),
  phone: z
    .string()
    .min(10, 'Valid Pakistani phone number required (e.g. 03424786076)'),
  whatsapp: z.string().optional(),
  province: z.string().min(1, 'Please select a province'),
  city: z.string().min(2, 'City is required'),
  line1: z.string().min(5, 'Full delivery address is required'),
  payment_method: z.enum(['cod', 'jazzcash']),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const { mutateAsync: createOrder, isPending } = useCreateOrder();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      province: 'Punjab',
      payment_method: 'cod',
    },
  });

  const selectedProvince = watch('province') || 'Punjab';
  const selectedPaymentMethod = watch('payment_method');

  // Section 8: Punjab = Rs. 250, Outside Punjab = Rs. 350
  const shippingFee = calculateShippingFee(selectedProvince);
  const finalTotal = totalPrice + shippingFee;

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const orderPayload = {
        customer_name: data.customer_name,
        email: data.email || `${data.phone}@sanaat.pk`,
        phone: data.phone,
        shipping_address: {
          line1: data.line1,
          line2: data.whatsapp ? `WhatsApp: ${data.whatsapp}` : undefined,
          city: data.city,
          province: data.province,
          postal_code: '00000',
          country: 'Pakistan',
        },
        payment_method: data.payment_method as any,
        notes: data.notes
          ? `${data.notes}${data.whatsapp ? ` | Alternate WhatsApp: ${data.whatsapp}` : ''}`
          : data.whatsapp
          ? `Alternate WhatsApp: ${data.whatsapp}`
          : undefined,
        items: items.map((item) => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
        })),
      };

      const result = await createOrder(orderPayload);
      clearCart();
      navigate(`/order-confirmation/${result.order_number}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Checkout failed. Please verify your details.';
      addToast({
        type: 'error',
        title: 'Checkout Failed',
        description: errorMessage,
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <SEO
        title="Checkout | SANAAT"
        description="Complete your SANAAT order with safe nationwide delivery across Pakistan."
      />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gray-500 hover:text-plum mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Bag</span>
        </Link>
        <span className="text-[10px] uppercase tracking-[0.3em] text-plum font-sans font-semibold flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>Secure Checkout</span>
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif text-black mt-1 font-normal">
          Complete Your Order
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Simple Checkout Form (Section 15) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Contact & Customer Details */}
            <div className="bg-white p-5 sm:p-6 border border-gray-200 space-y-4">
              <h2 className="text-sm font-sans font-semibold uppercase tracking-wider text-black border-b border-gray-100 pb-2">
                1. Customer Details
              </h2>
              <div className="space-y-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Sara Khan"
                  error={errors.customer_name?.message}
                  {...register('customer_name')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number (Call / SMS) *"
                    placeholder="0342 4786076"
                    helperText="We contact this number for delivery coordination"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <Input
                    label="WhatsApp Number (if different)"
                    placeholder="0300 1234567"
                    helperText="For order updates & tracking screenshot"
                    error={errors.whatsapp?.message}
                    {...register('whatsapp')}
                  />
                </div>

                <Input
                  label="Email Address (optional)"
                  type="email"
                  placeholder="name@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white p-5 sm:p-6 border border-gray-200 space-y-4">
              <h2 className="text-sm font-sans font-semibold uppercase tracking-wider text-black border-b border-gray-100 pb-2">
                2. Delivery Address
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Province *"
                    error={errors.province?.message}
                    {...register('province')}
                  >
                    {PAKISTAN_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov} {prov === 'Punjab' ? '(Rs. 250)' : '(Rs. 350)'}
                      </option>
                    ))}
                  </Select>

                  <Input
                    label="City *"
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                    error={errors.city?.message}
                    {...register('city')}
                  />
                </div>

                <Input
                  label="Full Delivery Address *"
                  placeholder="House / Apartment #, Street, Phase / Block / Landmark"
                  error={errors.line1?.message}
                  {...register('line1')}
                />

                <Textarea
                  label="Delivery Instructions (optional)"
                  placeholder="Any special notes for courier (e.g. deliver after 2 PM)"
                  rows={2}
                  {...register('notes')}
                />
              </div>
            </div>

            {/* 3. Payment Method (Section 14: Cash on Delivery & JazzCash) */}
            <div className="bg-white p-5 sm:p-6 border border-gray-200 space-y-4">
              <h2 className="text-sm font-sans font-semibold uppercase tracking-wider text-black border-b border-gray-100 pb-2">
                3. Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    selectedPaymentMethod === 'cod'
                      ? 'border-plum bg-plum/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="cod"
                    className="mt-1 text-plum focus:ring-plum"
                    {...register('payment_method')}
                  />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-black block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 block font-light">
                      Pay cash upon delivery at your doorstep anywhere in Pakistan.
                    </span>
                  </div>
                </label>

                {/* JazzCash Option strictly per Section 14 */}
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    selectedPaymentMethod === 'jazzcash'
                      ? 'border-plum bg-plum/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value="jazzcash"
                    className="mt-1 text-plum focus:ring-plum"
                    {...register('payment_method')}
                  />
                  <div className="w-full">
                    <span className="text-xs font-semibold uppercase tracking-wider text-black block">
                      JazzCash Mobile Account
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 block font-light">
                      Direct instant transfer via JazzCash app or retailer.
                    </span>

                    {/* Display JazzCash Account Details per Section 14 */}
                    {selectedPaymentMethod === 'jazzcash' && (
                      <div className="mt-3.5 p-3.5 bg-white border border-plum/30 text-xs space-y-2">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                          <span className="text-gray-500">JazzCash Account Name:</span>
                          <span className="font-semibold text-black">{JAZZCASH_INFO.accountName}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-1.5">
                          <span className="text-gray-500">JazzCash Number:</span>
                          <span className="font-mono font-bold text-plum text-sm">
                            {JAZZCASH_INFO.accountNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 font-light pt-1">
                          After placing your order, please transfer the exact order amount to this JazzCash account and send the confirmation receipt on WhatsApp to{' '}
                          <strong className="text-black font-medium">{CONTACT_INFO.phoneDisplay}</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Complete Order Summary (Section 15) */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50 p-6 border border-gray-200 sticky top-24 space-y-6">
              <h2 className="text-sm font-sans font-semibold uppercase tracking-wider text-black border-b border-gray-200 pb-3">
                Order Summary ({items.reduce((sum, item) => sum + item.quantity, 0)} Items)
              </h2>

              {/* Items List - Note: Size is already displayed here, never re-selected */}
              <div className="divide-y divide-gray-200/60 max-h-[340px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.variant_id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-white overflow-hidden border border-gray-200 flex-shrink-0">
                        <SafeImage
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-serif font-medium text-black">
                          {item.product_name}
                        </h4>
                        <p className="text-[11px] font-sans text-gray-500 uppercase mt-0.5">
                          Size: <strong className="text-black font-semibold">{item.size}</strong> · Qty: {item.quantity}
                        </p>
                        {item.is_preorder && (
                          <span className="text-[10px] font-sans text-plum uppercase font-medium">
                            Pre-order Piece
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="font-serif font-medium text-black text-xs sm:text-sm">
                      {formatPrice(item.unit_price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations (Section 8: Clear shipping fee) */}
              <div className="border-t border-gray-200 pt-4 space-y-2.5 text-xs font-sans">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-black">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600 items-baseline">
                  <div>
                    <span>Shipping Fee</span>
                    <span className="text-[10px] text-gray-400 block font-light">
                      {selectedProvince === 'Punjab' ? 'Punjab standard rate' : 'Outside Punjab rate'}
                    </span>
                  </div>
                  <span className="font-medium text-black">{formatPrice(shippingFee)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-sm font-bold text-black">
                  <span>Total Due</span>
                  <span className="font-serif text-lg text-plum">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isPending}
                className="py-4 text-xs font-sans tracking-[0.2em] font-medium"
              >
                PLACE ORDER · {formatPrice(finalTotal)}
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] font-sans text-gray-500 text-center">
                <ShieldCheck className="w-4 h-4 text-plum" />
                <span>Genuine Pakistani handcraft with guaranteed delivery</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
