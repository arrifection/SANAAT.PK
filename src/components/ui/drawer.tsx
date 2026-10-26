import { type ReactNode, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  width?: 'sm' | 'md' | 'lg' | 'full';
}

const widthClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  full: 'max-w-full',
};

function Drawer({ isOpen, onClose, title, children, className, width = 'md' }: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);

      requestAnimationFrame(() => {
        const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.[0]?.focus();
      });
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        className={cn(
          'fixed inset-y-0 right-0 flex h-full w-full flex-col bg-white shadow-xl',
          'translate-x-0 transition-transform duration-300 ease-out',
          widthClasses[width],
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          {title && <h2 className="font-serif text-lg font-semibold">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto flex items-center justify-center p-1 text-gray-400 transition-colors hover:text-black"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export { Drawer };
export type { DrawerProps };
