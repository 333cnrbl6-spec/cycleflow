import { cn } from '@/lib/utils';

const ACCENT_ICON = {
  blue:   'text-blue-400   bg-blue-500/10   border-blue-500/20',
  cyan:   'text-cyan-400   bg-cyan-500/10   border-cyan-500/20',
  violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  amber:  'text-amber-400  bg-amber-500/10  border-amber-500/20',
  green:  'text-green-400  bg-green-500/10  border-green-500/20',
  red:    'text-red-400    bg-red-500/10    border-red-500/20',
  orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
};

/**
 * Empty state placeholder — shown when a data set is empty.
 *
 * <EmptyState icon={Inbox} title="No rides yet" description="Start a ride to see your history here." />
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  accent = 'blue',
  className,
}) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-12 px-6 text-center',
      className,
    )}>
      {Icon && (
        <div className={cn(
          'w-12 h-12 rounded-2xl border flex items-center justify-center mb-4',
          ACCENT_ICON[accent],
        )}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
      {description && (
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}