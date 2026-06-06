import { cn } from '@/lib/utils';

export default function SubNav({ tabs, active, onSelect }) {
  return (
    <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto pb-0">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px',
            active === id
              ? 'text-blue-400 border-blue-500'
              : 'text-muted-foreground border-transparent hover:text-foreground hover:border-white/20'
          )}
        >
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {label}
        </button>
      ))}
    </div>
  );
}