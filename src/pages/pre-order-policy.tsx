import { Link } from 'react-router-dom';
import { SEO } from '../components/common';
import { preOrderPolicy } from '../content/site-content';
import { Clock, ArrowLeft, MessageCircle } from 'lucide-react';
import { CONTACT_INFO } from '../content/site-config';

export function PreOrderPolicyPage() {
  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <SEO
        title="Pre-Order Policy | SANAAT"
        description="Made especially for you. Pre-order pieces take 10–12 days to prepare before dispatch."
      />

      <nav className="text-xs uppercase tracking-wider text-gray-400 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-black transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Pre-Orders</span>
      </nav>

      <div className="space-y-6">
        <div>
          <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-plum block mb-2">
            Tailored to Order
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-black tracking-wide">
            {preOrderPolicy.heading}
          </h1>
          <p className="text-base sm:text-lg font-serif italic text-gray-700 mt-2">
            "{preOrderPolicy.tagline}"
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3.5 bg-white p-4 sm:p-5 border border-plum/30">
            <Clock className="w-5 h-5 text-plum flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-sans font-semibold uppercase tracking-wider text-plum block">
                Estimated Preparation Window
              </span>
              <p className="text-sm font-serif font-medium text-black mt-1">
                {preOrderPolicy.notice}
              </p>
            </div>
          </div>

          <p className="text-sm font-sans text-gray-700 leading-relaxed font-light">
            {preOrderPolicy.details}
          </p>

          <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-sans text-gray-500">
              Have specific sizing questions before pre-ordering?
            </span>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsappNumber}?text=Hi%20Sanaat%2C%20I%20have%20a%20question%20about%20a%20pre-order%20piece`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold text-plum hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-gray-100">
          <Link
            to="/shop?preorder=true"
            className="text-xs uppercase tracking-widest text-black hover:text-plum font-medium transition-colors"
          >
            ← View Pre-Order Pieces
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
