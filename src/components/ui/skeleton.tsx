import { cn } from '../../utils';

type SkeletonVariant = 'text' | 'image' | 'card' | 'circle';

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  width?: string;
  height?: string;
  aspectRatio?: string;
}

function Skeleton({ variant = 'text', className, width, height, aspectRatio }: SkeletonProps) {
  const style: Record<string, string | undefined> = { width, height, aspectRatio };

  switch (variant) {
    case 'text':
      return (
        <div
          className={cn('h-4 w-full animate-pulse rounded-sm bg-gray-200', className)}
          style={style}
        />
      );

    case 'image':
      return (
        <div
          className={cn('w-full animate-pulse bg-gray-200', className)}
          style={{ aspectRatio: aspectRatio ?? '3/4', ...style }}
        />
      );

    case 'card':
      return (
        <div className={cn('w-full animate-pulse space-y-3', className)} style={style}>
          <div className="bg-gray-200" style={{ aspectRatio: '3/4' }} />
          <div className="space-y-2 px-1">
            <div className="h-4 w-3/4 rounded-sm bg-gray-200" />
            <div className="h-3 w-1/2 rounded-sm bg-gray-200" />
          </div>
        </div>
      );

    case 'circle':
      return (
        <div
          className={cn('h-10 w-10 animate-pulse rounded-full bg-gray-200', className)}
          style={style}
        />
      );

    default:
      return null;
  }
}

export { Skeleton };
export type { SkeletonProps, SkeletonVariant };
