import { useState, useEffect } from 'react';
import { useServices } from './use-services';
import type { Profile } from '../types';

export function useAuth() {
  const services = useServices();
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    services.auth.getSession().then((profile) => {
      if (mounted) {
        setUser(profile);
        setIsLoading(false);
      }
    });

    const unsubscribe = services.auth.onAuthStateChange((profile) => {
      if (mounted) {
        setUser(profile);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [services]);

  const signIn = async (email: string, pass: string) => {
    const res = await services.auth.signIn(email, pass);
    setUser(res.user);
    return res;
  };

  const signOut = async () => {
    await services.auth.signOut();
    setUser(null);
  };

  return {
    user,
    isAdmin: user?.role === 'admin',
    isLoading,
    signIn,
    signOut,
  };
}
