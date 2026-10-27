import { Link } from 'react-router-dom';
import { SEO } from '../components/common';
import { exchangePolicy } from '../content/site-content';
import { CONTACT_INFO } from '../content/site-config';
import { ArrowLeft, MessageCircle, AlertCircle } from 'lucide-react';

export function ExchangePolicyPage() {
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsappNumber}?text=Hi%20Sanaat%2C%20I%20received%20a%20damaged%20order%20and%20would%20like%20to%20request%20an%20exchange.`;

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <SEO
        title="Exchange Policy | SANAAT"
        description="We want your Sanaat piece to reach you just right. We currently accept exchanges only for damaged products."
      />

      <nav className="text-xs uppercase tracking-wider text-gray-400 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-black transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Exchange Policy</span>
      </nav>

      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-plum block mb-2">
            Peace of Mind
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-black tracking-wide">
            {exchangePolicy.heading}
          </h1>
          <p className="text-base sm:text-lg font-serif italic text-gray-700 mt-2">
            "{exchangePolicy.tagline}"
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-4 text-sm font-sans text-gray-800 leading-relaxed font-light">
            {exchangePolicy.paragraphs.map((p, i) => (
              <p key={i} className={i === 1 ? 'font-semibold text-black font-serif text-base' : ''}>
                {p}
              </p>
            ))}
          </div>

          <div className="bg-white p-5 border border-plum/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-plum flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-black block">
                  Report a Damaged Item
                </span>
                <span className="text-xs font-sans text-gray-500">
                  Please include photos of the damaged area and your order number.
                </span>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-plum hover:bg-plum/90 text-white px-5 py-2.5 text-xs font-sans uppercase tracking-widest transition-colors flex-shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-gray-100">
          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest text-black hover:text-plum font-medium transition-colors"
          >
            ← Return to Shop
          </Link>
          <Link
            to="/shipping-policy"
            className="text-xs uppercase tracking-widest text-black hover:text-plum font-medium transition-colors"
          >
            Shipping Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
