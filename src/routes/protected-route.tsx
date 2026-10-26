import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { PageLoader } from '../components/common';

export function ProtectedRoute() {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader message="Verifying admin credentials..." />;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 max-w-md w-full text-center border border-gray-200">
          <h2 className="text-xl font-serif text-black mb-2">Access Denied</h2>
          <p className="text-xs text-gray-600 mb-6">
            Your account ({user.email}) does not have administrative privileges.
          </p>
          <a
            href="/"
            className="inline-block text-xs uppercase tracking-wider bg-black text-white px-6 py-2.5"
          >
            Return to Store
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
