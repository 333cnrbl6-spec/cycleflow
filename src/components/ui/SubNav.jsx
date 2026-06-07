import { cn } from '@/lib/utils';

/**
 * Horizontal tab strip used directly below every PageHeader.
 */
export default function SubNav({ tabs, active, onSelect }) {
  return (
    <div
      className="flex gap-0 border-b border-border mb-7 overflow-x-auto scrollbar-none -mx-px"
      role="tablist"
      aria-label="Section navigation"
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${id}`}
            id={`tab-${id}`}
            onClick={() => onSelect(id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-3 text-[13px] font-semibold',
              'whitespace-nowrap transition-all duration-200',
              'border-b-2 -mb-px min-h-[48px]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset',
              isActive
                ? 'text-blue-400 border-blue-500 bg-blue-500/[0.04]'
                : 'text-muted-foreground border-transparent hover:text-foreground/90 hover:border-white/20 hover:bg-white/[0.03]',
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  'w-3.5 h-3.5 flex-shrink-0 transition-colors',
                  isActive ? 'text-blue-400' : 'text-muted-foreground/60'
                )}
                aria-hidden="true"
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}