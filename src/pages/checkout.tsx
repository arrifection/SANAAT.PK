import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCartStore } from '../store/cart';
import { useCreateOrder } from '../hooks/use-orders';
import { useToast } from '../components/ui/toast';
import { Button, Input, Select, Textarea } from '../components/ui';
import { SEO } from '../components/common';
import { formatPrice } from '../utils';
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '../content/site-config';
import { SafeImage } from '../components/common';
import { ShieldCheck, Lock } from 'lucide-react';

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
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(10, 'Valid Pakistani phone number required (e.g. 03001234567)')
    .regex(/^(\+92|0)?3[0-9]{9}$/, 'Format must be a valid Pakistani mobile number'),
  line1: z.string().min(5, 'Street address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(1, 'Please select a province'),
  postal_code: z.string().min(3, 'Postal code is required'),
  country: z.literal('Pakistan'),
  payment_method: z.enum(['cod', 'bank_transfer', 'online']),
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

  const isFreeShipping = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : SHIPPING_FEE;
  const finalTotal = totalPrice + shippingFee;

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
      country: 'Pakistan',
      province: 'Punjab',
      payment_method: 'cod',
    },
  });

  const selectedPaymentMethod = watch('payment_method');

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const orderPayload = {
        customer_name: data.customer_name,
        email: data.email,
        phone: data.phone,
        shipping_address: {
          line1: data.line1,
          line2: data.line2,
          city: data.city,
          province: data.province,
          postal_code: data.postal_code,
          country: data.country,
        },
        payment_method: data.payment_method,
        notes: data.notes,
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
      <SEO title="Secure Checkout | SANAAT" description="Complete your SANAAT order with safe nationwide delivery." />

      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-[11px] uppercase tracking-[0.25em] text-plum font-sans font-medium flex items-center justify-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          <span>Encrypted Checkout</span>
        </span>
        <h1 className="text-3xl font-serif text-black mt-1">Order Details</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Customer & Delivery Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* 1. Contact Information */}
            <div className="bg-white p-6 border border-gray-200 space-y-4">
              <h2 className="text-base font-serif font-semibold text-black uppercase tracking-wider border-b border-gray-100 pb-2">
                1. Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Fatima Ali"
                  error={errors.customer_name?.message}
                  {...register('customer_name')}
                />
                <Input
                  label="Email Address (for order tracking) *"
                  type="email"
                  placeholder="fatima@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>
              <Input
                label="Mobile Number (Pakistan format) *"
                placeholder="0300 1234567"
                helperText="We send SMS dispatch updates to this number"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white p-6 border border-gray-200 space-y-4">
              <h2 className="text-base font-serif font-semibold text-black uppercase tracking-wider border-b border-gray-100 pb-2">
                2. Shipping Address
              </h2>
              <Input
                label="Street Address *"
                placeholder="House / Apartment #, Street name"
                error={errors.line1?.message}
                {...register('line1')}
              />
              <Input
                label="Apartment, Suite, Unit (optional)"
                placeholder="Near landmark, sector, floor"
                error={errors.line2?.message}
                {...register('line2')}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City *"
                  placeholder="Lahore, Karachi, etc."
                  error={errors.city?.message}
                  {...register('city')}
                />
                <Select
                  label="Province *"
                  error={errors.province?.message}
                  {...register('province')}
                >
                  {PAKISTAN_PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </Select>
                <Input
                  label="Postal Code *"
                  placeholder="54000"
                  error={errors.postal_code?.message}
                  {...register('postal_code')}
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white p-6 border border-gray-200 space-y-4">
              <h2 className="text-base font-serif font-semibold text-black uppercase tracking-wider border-b border-gray-100 pb-2">
                3. Payment Method
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    selectedPaymentMethod === 'cod'
                      ? 'border-plum bg-plum/5'
                      : 'border-gray-200 hover:border-gray-400'
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
                    <span className="text-xs text-gray-500 mt-0.5 block">
                      Pay cash upon delivery at your doorstep anywhere in Pakistan.
                    </span>
                  </div>
                </label>

                {/* Direct Bank Transfer */}
                <label
                  className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                    selectedPaymentMethod === 'bank_transfer'
                      ? 'border-plum bg-plum/5'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    value="bank_transfer"
                    className="mt-1 text-plum focus:ring-plum"
                    {...register('payment_method')}
                  />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-black block">
                      Direct Bank Transfer / IBFT
                    </span>
                    <span className="text-xs text-gray-500 mt-0.5 block">
                      Account details provided after checkout. Screenshot verified via WhatsApp.
                    </span>
                  </div>
                </label>

                {/* Online Card (Placeholder) */}
                <label className="flex items-start gap-3 p-4 border border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed">
                  <input type="radio" value="online" disabled className="mt-1" />
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                      Credit / Debit Card (Visa, Mastercard)
                      <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-sm">
                        Coming Soon
                      </span>
                    </span>
                    <span className="text-xs text-gray-400 mt-0.5 block">
                      Direct card gateway integration in progress.
                    </span>
                  </div>
                </label>
              </div>

              {/* Order Notes */}
              <div className="pt-2">
                <Textarea
                  label="Order Notes / Delivery Instructions (optional)"
                  placeholder="Special instructions for the courier, gate codes, etc."
                  rows={2}
                  {...register('notes')}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 bg-gray-50 p-6 border border-gray-200 space-y-6">
              <h2 className="text-base font-serif font-semibold text-black uppercase tracking-wider border-b border-gray-200 pb-3">
                Order Review ({items.length})
              </h2>

              {/* Items List */}
              <div className="divide-y divide-gray-200 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.variant_id} className="py-3 flex gap-3">
                    <div className="relative w-14 h-18 bg-white overflow-hidden flex-shrink-0">
                      <SafeImage
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-serif text-black truncate">{item.product_name}</h4>
                      <p className="text-[11px] text-gray-500 uppercase">Size: {item.size}</p>
                      <p className="text-xs font-medium text-black mt-1">
                        {formatPrice(item.unit_price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="space-y-2 border-t border-gray-200 pt-4 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-black">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Standard Shipping</span>
                  <span className="font-medium text-black">
                    {isFreeShipping ? (
                      <span className="text-emerald-700 uppercase font-semibold">Free</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-black border-t border-gray-200 pt-3">
                  <span>Total Amount</span>
                  <span className="font-serif text-lg">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isPending}
                className="py-4 text-xs tracking-widest font-semibold"
              >
                PLACE ORDER
              </Button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 text-center">
                <ShieldCheck className="w-4 h-4 text-plum" />
                <span>Zero Risk · 7-Day Hassle-Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
