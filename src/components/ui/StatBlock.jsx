import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const VALUE_COLOR = {
  blue:   'text-blue-400',
  cyan:   'text-cyan-400',
  amber:  'text-amber-400',
  violet: 'text-violet-400',
  green:  'text-green-400',
  red:    'text-red-400',
  orange: 'text-orange-400',
};

/**
 * Single metric tile — used in dashboards and admin pages.
 */
export default function StatBlock({
  label,
  value,
  unit,
  trend,
  trendValue,
  accent = 'blue',
  glow = false,
}) {
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up' ? 'text-green-400' :
    trend === 'down' ? 'text-red-400' :
    'text-muted-foreground';

  return (
    <div className={cn(
      'glass-card rounded-xl border border-white/[0.06] p-4',
      'hover:border-white/[0.14] transition-all duration-200',
      glow && 'glow-blue',
    )}>
      <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-2.5 font-heading leading-none">
        {label}
      </p>

      <div className="flex items-end gap-1.5">
        <span className={cn('text-[22px] font-bold font-mono leading-none transition-colors duration-300', VALUE_COLOR[accent])}>
          {value}
        </span>
        {unit && (
          <span className="text-[11px] text-muted-foreground/70 mb-0.5 leading-none">{unit}</span>
        )}
      </div>

      {trendValue && (
        <div className={cn('flex items-center gap-1 mt-2.5 text-[10px] font-medium', trendColor)}>
          <TrendIcon className="w-3 h-3 flex-shrink-0" />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}