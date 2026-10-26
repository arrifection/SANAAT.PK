import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { cn } from '../../utils';
import { Logo } from './logo';

interface FooterProps {
  className?: string;
}

const quickLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

const helpLinks = [
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Shipping & Returns', href: '/shipping-returns' },
  { label: 'Care Instructions', href: '/care-instructions' },
] as const;

function Footer({ className }: FooterProps) {
  return (
    <footer className={cn('border-t border-gray-100 bg-white', className)}>
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div>
            <Logo className="mb-4" />
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">
              Fashion with Modesty
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              Curated modest fashion from Pakistan. Elegant, contemporary designs crafted with
              premium fabrics and meticulous attention to detail.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-black">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-plum"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Help */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-black">
              Help
            </h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-plum"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Connect */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-black">
              Connect
            </h4>
            <div className="mb-6 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center border border-gray-200 text-gray-500 transition-colors hover:border-plum hover:text-plum"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center border border-gray-200 text-gray-500 transition-colors hover:border-plum hover:text-plum"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-700">
                Newsletter
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex"
              >
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-plum focus:ring-1 focus:ring-plum focus:outline-none"
                  aria-label="Email for newsletter"
                />
                <button
                  type="submit"
                  className="shrink-0 bg-black px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-white transition-colors hover:bg-plum"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
          <p className="text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} SANAAT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
export type { FooterProps };
