import { cn } from '@/lib/utils';

const ACCENT = {
  blue:   { icon: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  cyan:   { icon: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  red:    { icon: 'text-red-400 bg-red-500/10 border-red-500/20' },
  amber:  { icon: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  violet: { icon: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  orange: { icon: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  green:  { icon: 'text-green-400 bg-green-500/10 border-green-500/20' },
};

/**
 * Reusable empty-state placeholder.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  accent = 'blue',
  className,
}) {
  const styles = ACCENT[accent] ?? ACCENT.blue;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center py-16 px-6',
      'glass-card rounded-xl border border-dashed border-white/10',
      className,
    )}>
      {Icon && (
        <div className={cn(
          'w-14 h-14 rounded-2xl border flex items-center justify-center mb-5',
          styles.icon,
        )} aria-hidden="true">
          <Icon className="w-7 h-7" aria-hidden="true" />
        </div>
      )}
      {title && (
        <h3 className="text-base font-semibold text-foreground mb-2 max-w-xs">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}