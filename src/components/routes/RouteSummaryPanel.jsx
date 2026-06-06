import { cn } from '@/lib/utils';
import { Route, TrendingUp, Clock, Zap, Activity } from 'lucide-react';
import { SURFACE_COLORS, DIFFICULTY_COLORS } from './routeData';

const STATS = [
  { key: 'distance',  label: 'Distance',  unit: 'km', icon: Route,      color: 'text-blue-400' },
  { key: 'elevation', label: 'Elevation', unit: 'm',  icon: TrendingUp, color: 'text-cyan-400' },
  { key: 'time',      label: 'Est. Time', unit: '',   icon: Clock,      color: 'text-amber-400' },
  { key: 'calories',  label: 'Calories',  unit: 'kcal',icon: Zap,      color: 'text-orange-400' },
];

export default function RouteSummaryPanel({ summary, surface, difficulty }) {
  const sc = SURFACE_COLORS[surface]    || SURFACE_COLORS['Road'];
  const dc = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS['Moderate'];

  return (
    <div className="space-y-3">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {STATS.map(s => (
          <div key={s.key} className="glass-card rounded-lg border border-white/[0.05] p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <s.icon className={cn('w-3 h-3', s.color)} />
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">{s.label}</p>
            </div>
            <p className={cn('text-lg font-bold font-mono leading-none', s.color)}>
              {summary[s.key] ?? '—'}
              {s.unit && <span className="text-xs font-normal text-muted-foreground ml-1">{s.unit}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Surface + Difficulty badges */}
      <div className="flex gap-2">
        <div className={cn('flex-1 rounded-lg border p-2.5 text-center', sc.bg, sc.border)}>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">Surface</p>
          <p className={cn('text-xs font-bold', sc.text)}>{surface || 'Road'}</p>
        </div>
        <div className={cn('flex-1 rounded-lg border p-2.5 text-center', dc.bg, dc.border)}>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wide mb-0.5">Difficulty</p>
          <p className={cn('text-xs font-bold', dc.text)}>{difficulty || 'Moderate'}</p>
        </div>
      </div>

      {/* Snap mode indicator */}
      {summary.snapMode && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/8 border border-violet-500/20">
          <Activity className="w-3 h-3 text-violet-400 flex-shrink-0" />
          <p className="text-[10px] text-violet-300">{summary.snapMode}</p>
        </div>
      )}
    </div>
  );
}