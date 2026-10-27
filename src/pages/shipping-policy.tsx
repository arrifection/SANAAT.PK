import { Link } from 'react-router-dom';
import { SEO } from '../components/common';
import { shippingPolicy } from '../content/site-content';
import { Truck, ArrowLeft } from 'lucide-react';

export function ShippingPolicyPage() {
  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <SEO
        title="Shipping Policy | SANAAT"
        description="Carefully packed, thoughtfully sent. We deliver across Pakistan. Punjab Rs. 250, Outside Punjab Rs. 350."
      />

      <nav className="text-xs uppercase tracking-wider text-gray-400 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-black transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Shipping Policy</span>
      </nav>

      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-plum block mb-2">
            Delivery Information
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-black tracking-wide">
            {shippingPolicy.heading}
          </h1>
          <p className="text-base sm:text-lg font-serif italic text-gray-700 mt-2">
            "{shippingPolicy.tagline}"
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 space-y-6">
          <p className="text-sm font-sans text-gray-800 leading-relaxed font-light">
            {shippingPolicy.intro}
          </p>

          <div className="space-y-3">
            <h3 className="text-xs font-sans font-semibold uppercase tracking-wider text-black">
              Shipping Rates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shippingPolicy.rates.map((rate, i) => (
                <div key={i} className="bg-white p-4 border border-gray-200">
                  <span className="text-xs font-sans text-gray-500 uppercase tracking-wider block">
                    {rate.region}
                  </span>
                  <span className="text-lg font-serif font-bold text-black mt-1 block">
                    {rate.fee}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 flex items-start gap-3">
            <Truck className="w-5 h-5 text-plum flex-shrink-0 mt-0.5" />
            <p className="text-xs font-sans text-gray-600 leading-relaxed">
              {shippingPolicy.note}
            </p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-gray-100">
          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest text-black hover:text-plum font-medium transition-colors"
          >
            ← Explore the Collection
          </Link>
          <Link
            to="/exchange-policy"
            className="text-xs uppercase tracking-widest text-black hover:text-plum font-medium transition-colors"
          >
            Exchange Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
