import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';
import { Button, Input } from '../../components/ui';
import { Logo } from '../../components/layout';
import { SEO } from '../../components/common';
import { Lock, Info } from 'lucide-react';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <SEO title="Admin Login | SANAAT" />

      <div className="max-w-md w-full bg-white p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <Logo />
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-plum font-semibold pt-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Storefront Portal</span>
          </div>
          <h1 className="text-2xl font-serif text-black pt-1">Owner Sign In</h1>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Admin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@sanaat.pk"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            fullWidth
            loading={isLoading}
            className="text-xs tracking-widest mt-2"
          >
            ENTER DASHBOARD
          </Button>
        </form>

        <div className="bg-gray-50 border border-gray-200 p-3.5 text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-1.5 font-medium text-black">
            <Info className="w-3.5 h-3.5 text-plum" />
            <span>Authorized Owner Access</span>
          </div>
          <p className="text-[11px] text-gray-500 font-sans">
            Please sign in with your registered Sanaat owner credentials.
          </p>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
