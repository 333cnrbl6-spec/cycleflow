import { cn } from '@/lib/utils';
// Icon is passed as a prop — no import needed here

/**
 * Horizontal tab-strip used directly below every PageHeader.
 */
export default function SubNav({ tabs, active, onSelect }) {
  return (
    <div className="flex gap-0 border-b border-border/60 mb-6 overflow-x-auto scrollbar-none -mx-px">
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={cn(
              'relative flex items-center gap-1.5 px-4 py-2.5 text-[11px] font-semibold',
              'whitespace-nowrap tracking-wide transition-all duration-200',
              'border-b-2 -mb-px focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/50',
              isActive
                ? 'text-blue-400 border-blue-500'
                : 'text-muted-foreground/60 border-transparent hover:text-foreground/90 hover:border-white/20',
            )}
          >
            {Icon && <Icon className={cn('w-3.5 h-3.5 flex-shrink-0 transition-colors', isActive ? 'text-blue-400' : 'text-muted-foreground/50')} />}
            {label}
          </button>
        );
      })}
    </div>
  );
}