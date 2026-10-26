import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils';

const STORAGE_KEY = 'sanaat_announcement_dismissed';

interface AnnouncementBarProps {
  text?: string;
  className?: string;
}

function AnnouncementBar({
  text = 'Free shipping on orders over Rs. 5,000',
  className,
}: AnnouncementBarProps) {
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDismissed) {
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch {
        // ignore storage errors
      }
    }
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center bg-plum px-4 py-2 text-on-plum',
        className
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-widest">{text}</p>
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-plum/70 transition-colors hover:text-on-plum"
        aria-label="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export { AnnouncementBar };
export type { AnnouncementBarProps };
