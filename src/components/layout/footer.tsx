import { Link } from 'react-router-dom';
import { MessageCircle, Mail } from 'lucide-react';
import { cn } from '../../utils';
import { Logo } from './logo';
import {
  SITE_TAGLINE,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  CONTACT_EMAIL,
  CONTACT_INFO,
} from '../../content/site-config';
import { brandStatement } from '../../content/site-content';

function InstagramIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('border-t border-gray-100 bg-white text-black', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Column 1: Brand & Statement */}
          <div className="md:col-span-4 space-y-2.5">
            <Link to="/" aria-label="SANAAT Home" className="inline-block transition-transform duration-200 hover:scale-[1.02]">
              <Logo />
            </Link>
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-plum">
              {SITE_TAGLINE}
            </p>
            <p className="max-w-sm text-xs font-sans text-gray-500 leading-relaxed font-light">
              {brandStatement.quote}
            </p>
            <p className="text-[10px] text-gray-400 font-sans tracking-wide">
              Delivering nationwide across Pakistan.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-black">
              Explore
            </h4>
            <ul className="space-y-1.5 text-xs font-sans tracking-wider">
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-plum focus:text-plum focus:outline-none transition-colors duration-200 inline-block py-0.5">
                  Shop All Pieces
                </Link>
              </li>
              <li>
                <Link to="/collections/new" className="text-gray-600 hover:text-plum focus:text-plum focus:outline-none transition-colors duration-200 inline-block py-0.5">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-gray-600 hover:text-plum focus:text-plum focus:outline-none transition-colors duration-200 inline-block py-0.5">
                  The Sanaat Edit
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-plum focus:text-plum focus:outline-none transition-colors duration-200 inline-block py-0.5">
                  About Sanaat
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-plum focus:text-plum focus:outline-none transition-colors duration-200 inline-block py-0.5">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="md:col-span-2 space-y-2.5">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-black">
              Policies
            </h4>
            <ul className="space-y-1.5 text-xs font-sans tracking-wider">
              <li>
                <Link to="/shipping-policy" className="text-gray-600 hover:text-plum focus:text-plum focus:outline-none transition-colors duration-200 inline-block py-0.5">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/pre-order-policy" className="text-gray-600 hover:text-plum focus:text-plum focus:outline-none transition-colors duration-200 inline-block py-0.5">
                  Pre-Order Policy
                </Link>
              </li>
              <li>
                <Link to="/exchange-policy" className="text-gray-600 hover:text-plum focus:text-plum focus:outline-none transition-colors duration-200 inline-block py-0.5">
                  Exchange Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-black">
              Connect
            </h4>
            <div className="space-y-2 text-xs font-sans text-gray-600">
              {/* WhatsApp */}
              <p>
                <span className="text-gray-400 block text-[9px] uppercase tracking-wider">WhatsApp Concierge</span>
                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-black hover:text-plum focus:text-plum focus:outline-none transition-colors duration-200 inline-flex items-center gap-1.5 mt-0.5"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-plum" />
                  {CONTACT_INFO.phoneDisplay}
                </a>
              </p>

              {/* Email */}
              <p>
                <span className="text-gray-400 block text-[9px] uppercase tracking-wider">Customer Care</span>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-black hover:text-plum focus:text-plum focus:outline-none transition-colors duration-200 mt-0.5 block"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>

              {/* Social Icons */}
              <div className="pt-1">
                <div className="flex items-center gap-2">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 border border-gray-200 text-gray-600 hover:text-plum hover:border-plum focus:text-plum focus:border-plum transition-all duration-200"
                    aria-label="Sanaat on Instagram"
                  >
                    <InstagramIcon className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 border border-gray-200 text-gray-600 hover:text-plum hover:border-plum focus:text-plum focus:border-plum transition-all duration-200"
                    aria-label="Sanaat on Facebook"
                  >
                    <FacebookIcon className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="p-1.5 border border-gray-200 text-gray-600 hover:text-plum hover:border-plum focus:text-plum focus:border-plum transition-all duration-200"
                    aria-label="Email Sanaat"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-gray-400 font-sans">
          <p>© {new Date().getFullYear()} SANAAT. Quiet Luxury Modest Fashion. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/shipping-policy" className="hover:text-plum transition-colors">Shipping</Link>
            <span>·</span>
            <Link to="/exchange-policy" className="hover:text-plum transition-colors">Returns</Link>
            <span>·</span>
            <Link to="/admin/login" className="hover:text-plum transition-colors">Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
