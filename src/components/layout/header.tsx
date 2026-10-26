import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';
import { cn } from '../../utils';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';
import { SearchOverlay } from './search-overlay';
import { useCartStore } from '../../store/cart';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'New Collection', href: '/collections/new' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

interface HeaderProps {
  className?: string;
}

function Header({ className }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full border-b border-gray-100 bg-white',
          className
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* Left: Hamburger (mobile) + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1 text-black lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" aria-label="SANAAT Home">
              <Logo />
            </Link>
          </div>

          {/* Center: Desktop nav */}
          <nav className="hidden lg:flex lg:items-center lg:gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-[11px] font-medium uppercase tracking-widest text-black transition-colors hover:text-plum"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Action icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-black transition-colors hover:text-plum"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/account"
              className="hidden p-1.5 text-black transition-colors hover:text-plum sm:block"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              to="/cart"
              className="relative p-1.5 text-black transition-colors hover:text-plum"
              aria-label={`Cart with ${totalItems} items`}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-plum text-[10px] font-semibold text-on-plum">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export { Header };
export type { HeaderProps };
