import { cn } from '@/lib/utils';

export default function PlaceholderCard({ title, description, icon: Icon, children, className, accent = 'blue' }) {
  const accents = {
    blue: 'border-blue-500/20 bg-blue-500/5',
    cyan: 'border-cyan-500/20 bg-cyan-500/5',
    red: 'border-red-500/30 bg-red-500/10',
    amber: 'border-amber-500/20 bg-amber-500/5',
    violet: 'border-violet-500/20 bg-violet-500/5',
  };
  const iconColors = {
    blue: 'text-blue-400',
    cyan: 'text-cyan-400',
    red: 'text-red-400',
    amber: 'text-amber-400',
    violet: 'text-violet-400',
  };

  return (
    <div className={cn(
      'rounded-lg border p-5 glass-card transition-all duration-200 hover:border-blue-500/30',
      accents[accent],
      className
    )}>
      {(Icon || title) && (
        <div className="flex items-start gap-3 mb-3">
          {Icon && (
            <div className={cn('mt-0.5 flex-shrink-0', iconColors[accent])}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            {title && <h3 className="text-sm font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}