import {
  type ReactNode,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

export interface ToastOptions {
  type: ToastType;
  title?: string;
  description?: string;
  message?: string;
}

interface ToastContextValue {
  addToast: (
    typeOrOptions: ToastType | ToastOptions,
    message?: string
  ) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const toastIcons: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="h-5 w-5 text-emerald-600" />,
  error: <AlertCircle className="h-5 w-5 text-red-600" />,
  info: <Info className="h-5 w-5 text-plum" />,
};

const toastStyles: Record<ToastType, string> = {
  success: 'border-l-emerald-600',
  error: 'border-l-red-600',
  info: 'border-l-plum',
};

let toastCounter = 0;

function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (typeOrOptions: ToastType | ToastOptions, messageParam?: string) => {
      const id = `toast-${++toastCounter}`;
      let type: ToastType = 'info';
      let title: string | undefined;
      let message = '';

      if (typeof typeOrOptions === 'string') {
        type = typeOrOptions;
        message = messageParam || '';
      } else {
        type = typeOrOptions.type;
        title = typeOrOptions.title;
        message = typeOrOptions.description || typeOrOptions.message || '';
      }

      setToasts((prev) => [...prev, { id, type, title, message }]);

      const timer = setTimeout(() => {
        removeToast(id);
      }, 4000);
      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'flex items-start gap-3 border-l-4 bg-white p-4 shadow-xl border border-gray-100',
              toastStyles[toast.type]
            )}
            role="alert"
          >
            <span className="shrink-0 mt-0.5">{toastIcons[toast.type]}</span>
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-xs font-semibold text-black mb-0.5">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-gray-600 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-gray-400 transition-colors hover:text-black p-0.5"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export { ToastProvider, useToast };
export type { ToastType, Toast };
