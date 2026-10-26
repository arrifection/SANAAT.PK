import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { SEO } from '../components/common';

export function NotFoundPage() {
  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto text-center">
      <SEO title="Page Not Found (404) | SANAAT" />

      <span className="text-[11px] uppercase tracking-[0.3em] text-plum font-sans font-medium">
        Error 404
      </span>
      <h1 className="text-4xl sm:text-5xl font-serif text-black mt-2 mb-4">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-gray-600 font-sans leading-relaxed mb-8">
        The destination you are seeking does not exist or has been shifted in our modern archive.
      </p>

      <div className="flex justify-center gap-4">
        <Link to="/">
          <Button variant="secondary" size="md" className="text-xs tracking-widest px-6">
            GO TO HOME
          </Button>
        </Link>
        <Link to="/shop">
          <Button variant="outline" size="md" className="text-xs tracking-widest px-6">
            EXPLORE SHOP
          </Button>
        </Link>
      </div>
    </div>
  );
}
