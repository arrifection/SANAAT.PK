import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { ServicesContext, initializeServices } from './lib/service-provider';
import type { Services } from './services/interfaces';
import { ToastProvider } from './components/ui/toast';
import { PageLoader } from './components/common';
import { router } from './routes';

export function App() {
  const [services, setServices] = useState<Services | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;
    initializeServices()
      .then((s) => {
        if (mounted) {
          setServices(s);
          setIsInitializing(false);
        }
      })
      .catch((err) => {
        console.error('Failed to initialize services:', err);
        if (mounted) setIsInitializing(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (isInitializing || !services) {
    return <PageLoader message="Preparing SANAAT Collection..." />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ServicesContext.Provider value={services}>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </ServicesContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
