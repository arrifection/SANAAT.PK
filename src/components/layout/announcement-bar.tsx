import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils';
import { announcementBarText } from '../../content/site-content';
import { useSiteSettings } from '../../hooks/use-settings';

const STORAGE_KEY = 'sanaat_announcement_dismissed_v2';

export interface AnnouncementBarProps {
  text?: string;
  className?: string;
}

export function AnnouncementBar({
  text = announcementBarText,
  className,
}: AnnouncementBarProps) {
  const { data: settings } = useSiteSettings();
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

  if (isDismissed || settings?.announcement_visible === false) return null;

  const displayText = settings?.announcement_text || text;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center bg-plum px-4 py-2 text-white',
        className
      )}
    >
      <Link
        to="/shop?preorder=true"
        className="text-[10px] sm:text-[11px] font-sans font-medium uppercase tracking-[0.25em] hover:underline"
      >
        {displayText}
      </Link>
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/70 transition-colors hover:text-white"
        aria-label="Dismiss announcement"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
