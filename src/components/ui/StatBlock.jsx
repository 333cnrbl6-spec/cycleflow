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

const GLOW_HOVER = {
  blue:   'hover:shadow-[0_0_18px_rgba(59,130,246,0.18)]',
  cyan:   'hover:shadow-[0_0_18px_rgba(34,211,238,0.18)]',
  amber:  'hover:shadow-[0_0_18px_rgba(245,158,11,0.18)]',
  violet: 'hover:shadow-[0_0_18px_rgba(167,139,250,0.18)]',
  green:  'hover:shadow-[0_0_18px_rgba(74,222,128,0.18)]',
  red:    'hover:shadow-[0_0_18px_rgba(248,113,113,0.18)]',
  orange: 'hover:shadow-[0_0_18px_rgba(251,146,60,0.18)]',
};

/**
 * Single metric tile — used in dashboards and admin pages.
 * Hover: subtle lift + accent glow.
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
    trend === 'up'   ? 'text-green-400' :
    trend === 'down' ? 'text-red-400' :
    'text-muted-foreground';

  return (
    <div
      className={cn(
        'glass-card rounded-xl border border-white/[0.07] p-5',
        'hover:border-white/[0.18] hover:scale-[1.015]',
        'transition-all duration-200 ease-out cursor-default',
        GLOW_HOVER[accent],
        glow && 'glow-blue',
      )}
      role="group"
      aria-label={`${label}: ${value}${unit ? ' ' + unit : ''}`}
    >
      {/* Label */}
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 font-heading leading-none">
        {label}
      </p>

      {/* Value + unit */}
      <div className="flex items-end gap-2">
        <span className={cn(
          'text-2xl font-bold font-mono leading-none transition-colors duration-300',
          VALUE_COLOR[accent]
        )}>
          {value}
        </span>
        {unit && (
          <span className="text-sm text-muted-foreground mb-0.5 leading-none">{unit}</span>
        )}
      </div>

      {/* Trend */}
      {trendValue && (
        <div className={cn(
          'flex items-center gap-1.5 mt-3 text-xs font-medium',
          trendColor
        )}>
          <TrendIcon className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{trendValue}</span>
        </div>
      )}
    </div>
  );
}