import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatBlock({ label, value, unit, trend, trendValue, accent = 'blue', glow = false }) {
  const colors = {
    blue: 'text-blue-400',
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
    violet: 'text-violet-400',
    green: 'text-green-400',
    red: 'text-red-400',
  };

  return (
    <div className={cn(
      'glass-card rounded-lg p-4 border border-white/5',
      glow && 'glow-blue'
    )}>
      <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">{label}</p>
      <div className="flex items-end gap-1">
        <span className={cn('text-2xl font-bold font-mono', colors[accent])}>{value}</span>
        {unit && <span className="text-sm text-muted-foreground mb-0.5">{unit}</span>}
      </div>
      {trendValue && (
        <div className={cn(
          'flex items-center gap-1 mt-1 text-xs',
          trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-muted-foreground'
        )}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          {trendValue}
        </div>
      )}
    </div>
  );
}