import { type ReactNode } from 'react';
import { type LucideIcon, PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { cn } from '../../utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  children?: ReactNode;
}

function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  action,
  className,
  children,
}: EmptyStateProps) {
  const finalActionLabel = actionLabel || action?.label;
  const finalActionClick = onAction || action?.onClick;

  return (
    <div className={cn('flex flex-col items-center justify-center px-4 py-16 text-center', className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center bg-gray-100">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-2 font-serif text-xl font-semibold text-black">{title}</h3>
      {description && <p className="mb-6 max-w-md text-sm text-gray-500 leading-relaxed">{description}</p>}

      {finalActionLabel && actionHref && (
        <Link to={actionHref}>
          <Button variant="outline" size="sm" className="text-xs uppercase tracking-wider">
            {finalActionLabel}
          </Button>
        </Link>
      )}

      {finalActionLabel && !actionHref && finalActionClick && (
        <Button variant="outline" size="sm" onClick={finalActionClick} className="text-xs uppercase tracking-wider">
          {finalActionLabel}
        </Button>
      )}

      {children}
    </div>
  );
}

export { EmptyState };
export type { EmptyStateProps };
