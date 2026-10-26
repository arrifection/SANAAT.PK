import { useState, useCallback, type ImgHTMLAttributes } from 'react';
import { CameraOff } from 'lucide-react';
import { cn } from '../../utils';

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'src'> {
  src: string | null | undefined;
  alt: string;
  aspectRatio?: '3/4' | '1/1' | '16/9' | string;
  fallback?: React.ReactNode;
}

function SafeImage({ src, alt, aspectRatio = '3/4', fallback, className, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}
        style={{ aspectRatio }}
      >
        {fallback ?? <CameraOff className="h-6 w-6 stroke-1 text-gray-400" />}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden bg-gray-100', className)} style={{ aspectRatio }}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        {...props}
      />
    </div>
  );
}

export { SafeImage };
export type { SafeImageProps };
