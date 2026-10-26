import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../utils';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-4 py-16 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center bg-red-50">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h3 className="mb-2 font-serif text-xl font-semibold text-black">Oops!</h3>
      <p className="mb-6 max-w-md text-sm text-gray-500">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}

export { ErrorState };
export type { ErrorStateProps };
