import { type HTMLAttributes } from 'react';
import { cn } from '../../utils';

type BadgeVariant = 'default' | 'plum' | 'outline' | 'muted';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-black text-white',
  plum: 'bg-plum text-on-plum',
  outline: 'border border-black text-black bg-transparent',
  muted: 'bg-gray-100 text-gray-700',
};

function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider leading-tight',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
