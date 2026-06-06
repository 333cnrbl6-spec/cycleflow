import { cn } from '@/lib/utils';

/**
 * Horizontal tab navigation strip — used under every PageHeader.
 */
export default function SubNav({ tabs, active, onSelect }) {
  return (
    <div className="flex gap-0.5 border-b border-border mb-6 overflow-x-auto scrollbar-none">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap',
            'transition-all duration-150 border-b-2 -mb-px tracking-wide',
            active === id
              ? 'text-blue-400 border-blue-500 bg-blue-500/5'
              : 'text-muted-foreground border-transparent hover:text-foreground hover:border-white/20'
          )}
        >
          {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
          {label}
        </button>
      ))}
    </div>
  );
}