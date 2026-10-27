import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { ServicesContext, initializeServices, getDefaultServices } from './lib/service-provider';
import type { Services } from './services/interfaces';
import { ToastProvider } from './components/ui/toast';
import { router } from './routes';

export function App() {
  // Start with verified synchronous services so every device/browser renders instantly
  const [services, setServices] = useState<Services>(() => getDefaultServices());

  useEffect(() => {
    let mounted = true;
    initializeServices()
      .then((s) => {
        if (mounted && s) {
          setServices(s);
        }
      })
      .catch((err) => {
        console.error('Failed to initialize services:', err);
      });

    return () => {
      mounted = false;
    };
  }, []);

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
