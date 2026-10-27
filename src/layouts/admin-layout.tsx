import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  FolderTree,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/use-auth';
import { cn } from '../utils';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
  { label: 'Products', href: '/admin/products', icon: Package, end: false },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes, end: false },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, end: false },
  { label: 'Collections', href: '/admin/categories', icon: FolderTree, end: false },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-black text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-0 -translate-x-full'
        )}
      >
        <div>
          {/* Logo / Header */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-serif text-xl tracking-widest text-white font-bold">
                SANAAT
              </span>
              <span className="text-[10px] uppercase font-sans tracking-widest text-plum bg-white px-1.5 py-0.5 rounded-sm">
                Admin
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs uppercase tracking-wider font-medium transition-colors',
                    isActive
                      ? 'bg-plum text-white font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900'
                  )
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          {user && (
            <div className="px-3 py-2 text-[11px] text-gray-400 truncate">
              Signed in as <span className="text-white font-medium">{user.email}</span>
            </div>
          )}

          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-gray-400 hover:text-white hover:bg-gray-900 rounded-sm transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
            <span>View Storefront</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-gray-900 rounded-sm transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header for Mobile & Quick Actions */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-700 hover:text-black focus:outline-none"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs uppercase tracking-widest text-gray-400 hidden sm:inline-block">
              Store Administration
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/products/new"
              className="text-xs uppercase tracking-wider bg-black text-white hover:bg-gray-800 px-3 py-1.5 rounded-sm font-medium transition-colors"
            >
              + New Product
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
