import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';
import { cn } from '../../utils';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';
import { SearchOverlay } from './search-overlay';
import { useCartStore } from '../../store/cart';
import { useSiteSettings } from '../../hooks/use-settings';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/collections/new' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
] as const;

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: settings } = useSiteSettings();
  const totalItems = useCartStore((state) => state.totalItems);
  const openCart = useCartStore((state) => state.openCart);

  const showTicker = settings?.moving_ticker_visible !== false;
  const tickerText = settings?.moving_ticker_text || 'Pre-order Available ✦ Free Delivery Above Rs 10,000';

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-30 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm',
          className
        )}
      >
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Mobile hamburger menu & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-5 flex-shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 -ml-1 text-black hover:text-plum transition-colors lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" aria-label="SANAAT Home" className="flex items-center">
              <Logo />
            </Link>
          </div>

          {/* Slim moving announcement near logo (Desktop & Tablet) */}
          {showTicker && (
            <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-4 overflow-hidden py-1 px-3 bg-gray-50/80 border border-gray-100 rounded-full">
              <div className="animate-marquee whitespace-nowrap text-[10px] font-sans tracking-[0.2em] uppercase text-gray-600">
                <span className="font-semibold text-plum">{tickerText}</span>
                <span className="mx-4 text-gray-300">✦</span>
                <span className="font-semibold text-plum">{tickerText}</span>
                <span className="mx-4 text-gray-300">✦</span>
                <span className="font-semibold text-plum">{tickerText}</span>
              </div>
            </div>
          )}

          {/* Center: Desktop Navigation strictly per Section 3.B */}
          <nav className="hidden lg:flex lg:items-center lg:gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-[11px] font-sans font-medium uppercase tracking-[0.2em] text-black transition-colors hover:text-plum py-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Search, Account & Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-black transition-colors hover:text-plum"
              aria-label="Search collection"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <Link
              to="/account"
              className="p-2 text-black transition-colors hover:text-plum hidden sm:block"
              aria-label="Account"
            >
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>

            <button
              onClick={openCart}
              className="relative p-2 text-black transition-colors hover:text-plum"
              aria-label={`Cart with ${totalItems} items`}
            >
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center bg-plum text-[10px] font-semibold text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile slim moving announcement bar */}
        {showTicker && (
          <div className="md:hidden overflow-hidden bg-gray-50 border-t border-gray-100 py-1 px-2">
            <div className="animate-marquee whitespace-nowrap text-[9px] font-sans tracking-[0.2em] uppercase text-gray-600">
              <span className="font-semibold text-plum">{tickerText}</span>
              <span className="mx-3 text-gray-300">✦</span>
              <span className="font-semibold text-plum">{tickerText}</span>
              <span className="mx-3 text-gray-300">✦</span>
            </div>
          </div>
        )}
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
