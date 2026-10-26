import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { SEO } from '../components/common';
import { User } from 'lucide-react';

export function AccountPlaceholderPage() {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto text-center">
      <SEO title="Customer Account | SANAAT" />

      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
        <User className="w-8 h-8 stroke-[1.5]" />
      </div>

      <span className="text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-medium">
        Client Portal
      </span>
      <h1 className="text-3xl font-serif text-black mt-2 mb-4">Accounts Coming Soon</h1>

      <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed mb-8">
        We are crafting a personalized membership experience with saved measurements, custom sizing history, and priority drop reservations.
        <br />
        <br />
        In the meantime, you can seamlessly shop through our streamlined <strong>Guest Checkout</strong>.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Link to="/shop">
          <Button variant="secondary" size="md" className="text-xs tracking-widest px-8">
            CONTINUE SHOPPING
          </Button>
        </Link>
        <Link to="/admin/login">
          <Button variant="outline" size="md" className="text-xs tracking-widest px-6 border-gray-300 text-gray-500">
            STAFF / ADMIN LOGIN
          </Button>
        </Link>
      </div>
    </div>
  );
}
