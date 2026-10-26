import { cn } from '../../utils';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
}

// TEMPORARY: Replace with real logo asset in src/assets/brand/
function Logo({ className, variant = 'dark' }: LogoProps) {
  return (
    <span
      className={cn(
        'font-serif text-2xl font-bold tracking-[0.2em]',
        variant === 'dark' ? 'text-black' : 'text-white',
        className
      )}
    >
      SANAAT
    </span>
  );
}

export { Logo };
export type { LogoProps };
