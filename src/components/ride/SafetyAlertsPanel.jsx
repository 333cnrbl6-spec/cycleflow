import { AlertTriangle, Shield, X, CheckCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_CONFIG = {
  near_miss: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/25' },
  hazard:    { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/25' },
  incident:  { icon: AlertTriangle, color: 'text-red-400',   bg: 'bg-red-500/10 border-red-500/25' },
};

export default function SafetyAlertsPanel({ alerts = [], watchers = [], onAcknowledge, onClear }) {
  const active = alerts.filter(a => !a.acknowledged);

  return (
    <div className="space-y-3">
      {/* Beacon watchers */}
      <div className="glass-card rounded-xl border border-border p-3">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Beacon Watchers</span>
          <span className="ml-auto text-[10px] font-mono text-cyan-400 font-bold">{watchers.length} active</span>
        </div>
        <div className="space-y-1.5">
          {watchers.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-xs text-muted-foreground">{w.name}</span>
              <span className="ml-auto text-[10px] text-green-400 font-medium">{w.status}</span>
            </div>
          ))}
          {watchers.length === 0 && (
            <p className="text-xs text-muted-foreground/50">No active watchers</p>
          )}
        </div>
      </div>

      {/* Alerts */}
      <div className="glass-card rounded-xl border border-border p-3">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-3.5 h-3.5 text-red-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Safety Alerts</span>
          {active.length > 0 && (
            <>
              <span className="ml-auto text-[10px] font-bold text-red-400">{active.length} new</span>
              <button onClick={onClear} className="text-[9px] text-muted-foreground hover:text-foreground transition-colors">
                Clear all
              </button>
            </>
          )}
        </div>

        <div className="space-y-2 max-h-52 overflow-y-auto scrollbar-thin">
          {alerts.length === 0 && (
            <div className="flex items-center gap-2 p-2">
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs text-muted-foreground">No alerts — ride safe!</span>
            </div>
          )}
          {[...alerts].reverse().map(alert => {
            const cfg = TYPE_CONFIG[alert.type] || TYPE_CONFIG.hazard;
            const Icon = cfg.icon;
            return (
              <div
                key={alert.id}
                className={cn(
                  'flex items-start gap-2 p-2.5 rounded-lg border text-xs transition-all',
                  alert.acknowledged ? 'opacity-40' : cfg.bg,
                )}
              >
                <Icon className={cn('w-3.5 h-3.5 flex-shrink-0 mt-0.5', cfg.color)} />
                <span className={cn('flex-1 leading-snug', alert.acknowledged ? 'text-muted-foreground' : 'text-foreground')}>
                  {alert.msg}
                </span>
                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}