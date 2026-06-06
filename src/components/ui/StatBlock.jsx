import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ACCENT = {
  blue:   'text-blue-400',
  cyan:   'text-cyan-400',
  amber:  'text-amber-400',
  violet: 'text-violet-400',
  green:  'text-green-400',
  red:    'text-red-400',
  orange: 'text-orange-400',
};

/**
 * Standardized metric card used across all dashboards.
 */
export default function StatBlock({ label, value, unit, trend, trendValue, accent = 'blue', glow = false }) {
  return (
    <div className={cn(
      'glass-card rounded-xl border border-white/5 p-4 hover:border-white/10 transition-all duration-200',
      glow && 'glow-blue'
    )}>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{label}</p>
      <div className="flex items-end gap-1.5">
        <span className={cn('text-2xl font-bold font-mono leading-none', ACCENT[accent])}>{value}</span>
        {unit && <span className="text-xs text-muted-foreground mb-0.5">{unit}</span>}
      </div>
      {trendValue && (
        <div className={cn(
          'flex items-center gap-1 mt-2 text-[10px] font-medium',
          trend === 'up'   ? 'text-green-400' :
          trend === 'down' ? 'text-red-400'   :
                             'text-muted-foreground'
        )}>
          {trend === 'up'   ? <TrendingUp   className="w-3 h-3" /> :
           trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                              <Minus        className="w-3 h-3" />}
          {trendValue}
        </div>
      )}
    </div>
  );
}