import { Link } from 'react-router-dom';
import { MessageCircle, User, ShoppingBag } from 'lucide-react';
import { Drawer } from '../ui/drawer';
import { Logo } from './logo';
import {
  WHATSAPP_NUMBER,
  INSTAGRAM_URL,
  FACEBOOK_URL,
  CONTACT_EMAIL,
  CONTACT_INFO,
} from '../../content/site-config';
import { useCartStore } from '../../store/cart';

const mobileNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/collections/new' },
  { label: 'Collections', href: '/collections' },
  { label: 'About Sanaat', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} width="full">
      <div className="flex h-full flex-col justify-between p-6">
        <div>
          {/* Brand header in drawer */}
          <div className="border-b border-gray-100 pb-4 mb-4">
            <Logo />
            <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-plum mt-1">
              FASHION WITH MODESTY
            </p>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
            {mobileNavLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className="py-3 text-base font-serif font-medium tracking-wider text-black transition-colors hover:text-plum border-b border-gray-50 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-xs text-gray-400 font-sans">→</span>
              </Link>
            ))}

            {/* Account & Cart quick links */}
            <Link
              to="/account"
              onClick={onClose}
              className="py-3 text-base font-serif font-medium tracking-wider text-black transition-colors hover:text-plum border-b border-gray-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-plum" />
                <span>My Account</span>
              </div>
              <span className="text-xs text-gray-400 font-sans">→</span>
            </Link>

            <Link
              to="/cart"
              onClick={onClose}
              className="py-3 text-base font-serif font-medium tracking-wider text-black transition-colors hover:text-plum border-b border-gray-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-4 w-4 text-plum" />
                <span>Shopping Bag ({totalItems})</span>
              </div>
              <span className="text-xs text-gray-400 font-sans">→</span>
            </Link>
          </nav>
        </div>

        {/* Footer info in mobile drawer */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans uppercase tracking-widest text-gray-400">
              Direct Contact
            </span>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-black hover:text-plum font-medium font-sans"
            >
              <MessageCircle className="h-4 w-4 text-plum" />
              <span>{CONTACT_INFO.phoneDisplay}</span>
            </a>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-wider text-gray-500 hover:text-plum transition-colors"
            >
              Instagram
            </a>
            <span className="text-gray-300">·</span>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-wider text-gray-500 hover:text-plum transition-colors"
            >
              Facebook
            </a>
            <span className="text-gray-300">·</span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-xs uppercase tracking-wider text-gray-500 hover:text-plum transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
