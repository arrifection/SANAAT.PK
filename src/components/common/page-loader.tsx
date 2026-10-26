import { Spinner } from '../ui/spinner';
import { cn } from '../../utils';

interface PageLoaderProps {
  message?: string;
  className?: string;
}

function PageLoader({ message, className }: PageLoaderProps) {
  return (
    <div
      className={cn(
        'flex min-h-[60vh] flex-col items-center justify-center gap-4',
        className
      )}
    >
      <Spinner size="lg" />
      {message && (
        <p className="text-sm uppercase tracking-wider text-gray-500">{message}</p>
      )}
    </div>
  );
}

export { PageLoader };
export type { PageLoaderProps };
