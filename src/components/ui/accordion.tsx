import { type ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils';

interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items?: AccordionItem[];
  title?: string;
  children?: ReactNode;
  defaultOpen?: boolean;
  allowMultiple?: boolean;
  className?: string;
}

function Accordion({
  items,
  title,
  children,
  defaultOpen = false,
  allowMultiple = false,
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<Set<string>>(
    new Set(defaultOpen && title ? ['single-accordion'] : [])
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (title) {
    const isOpen = openIds.has('single-accordion');
    return (
      <div className={cn('py-3 border-b border-gray-100 last:border-0', className)}>
        <button
          type="button"
          onClick={() => toggle('single-accordion')}
          className="flex w-full items-center justify-between py-2 text-left text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:text-plum"
          aria-expanded={isOpen}
        >
          <span>{title}</span>
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180 text-plum'
            )}
          />
        </button>
        {isOpen && <div className="pt-2 pb-1 text-xs text-gray-600 leading-relaxed">{children}</div>}
      </div>
    );
  }

  if (!items) return null;

  return (
    <div className={cn('divide-y divide-gray-100 border-y border-gray-100', className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        return (
          <div key={item.id} className="py-2">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between py-2 text-left text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:text-plum"
              aria-expanded={isOpen}
              aria-controls={`accordion-panel-${item.id}`}
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform duration-200',
                  isOpen && 'rotate-180 text-plum'
                )}
              />
            </button>
            {isOpen && (
              <div id={`accordion-panel-${item.id}`} className="pt-2 pb-1 text-xs text-gray-600 leading-relaxed">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export { Accordion };
export type { AccordionProps, AccordionItem };
