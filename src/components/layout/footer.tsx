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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14">
          {/* Column 1: Brand & Statement */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" aria-label="SANAAT Home">
              <Logo />
            </Link>
            <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.25em] text-plum">
              {SITE_TAGLINE}
            </p>
            <p className="max-w-md text-xs sm:text-sm font-sans text-gray-600 leading-relaxed font-light">
              {brandStatement.quote}
            </p>
            <p className="text-[11px] text-gray-400 font-sans tracking-wide">
              Delivering nationwide across Pakistan.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-black">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-sans tracking-wider">
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-plum transition-colors">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/collections/new" className="text-gray-600 hover:text-plum transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-gray-600 hover:text-plum transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-plum transition-colors">
                  About Sanaat
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-plum transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-black">
              Policies
            </h4>
            <ul className="space-y-2.5 text-xs font-sans tracking-wider">
              <li>
                <Link to="/shipping-policy" className="text-gray-600 hover:text-plum transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/pre-order-policy" className="text-gray-600 hover:text-plum transition-colors">
                  Pre-Order Policy
                </Link>
              </li>
              <li>
                <Link to="/exchange-policy" className="text-gray-600 hover:text-plum transition-colors">
                  Exchange Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-[11px] font-sans font-semibold uppercase tracking-[0.25em] text-black">
              Connect
            </h4>
            <div className="space-y-3 text-xs font-sans text-gray-600">
              {/* WhatsApp */}
              <p>
                <span className="text-gray-400 block text-[10px] uppercase tracking-wider">WhatsApp</span>
                <a
                  href={CONTACT_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-black hover:text-plum transition-colors inline-flex items-center gap-1.5 mt-0.5"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-plum" />
                  {CONTACT_INFO.phoneDisplay}
                </a>
              </p>

              {/* Email */}
              <p>
                <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Email</span>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-medium text-black hover:text-plum transition-colors mt-0.5 block"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>

              {/* Social Icons */}
              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-2">
                  Follow Us
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-gray-200 text-gray-600 hover:text-plum hover:border-plum transition-colors"
                    aria-label="Sanaat on Instagram"
                  >
                    <InstagramIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-gray-200 text-gray-600 hover:text-plum hover:border-plum transition-colors"
                    aria-label="Sanaat on Facebook"
                  >
                    <FacebookIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="p-2 border border-gray-200 text-gray-600 hover:text-plum hover:border-plum transition-colors"
                    aria-label="Email Sanaat"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright & tagline */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-sans text-gray-400">
          <p>© {new Date().getFullYear()} SANAAT. All rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px] text-gray-400">
            {SITE_TAGLINE}
          </p>
        </div>
      </div>
    </footer>
  );
}
