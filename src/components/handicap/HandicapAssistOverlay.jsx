import { Zap, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';

const DEFAULT_LEVELS = ['Off', 'ECO', 'ECO+', 'TOUR', 'SPORT', 'TURBO'];

const TRIGGER_ICON = {
  spike:  { Icon: AlertTriangle, border: 'border-red-500/30 bg-red-500/[0.05]'    },
  fair:   { Icon: CheckCircle,   border: 'border-green-500/20 bg-green-500/[0.05]' },
  adjust: { Icon: TrendingUp,    border: 'border-amber-500/20 bg-amber-500/[0.05]' },
};

export default function HandicapAssistOverlay({ data }) {
  const hcp             = data ? data.hcp            : 2.7;
  const groupAvgHcp     = data ? data.groupAvgHcp    : 3.4;
  const delta           = data ? data.delta          : -0.7;
  const suggestedAssist = data ? data.suggestedAssist : 'ECO+';
  const levels          = data ? data.assistLevels   : DEFAULT_LEVELS;
  const triggers        = data ? data.triggers       : [];

  const stats = [
    { label: 'Current HCP',      value: String(hcp),              color: 'text-blue-400' },
    { label: 'Suggested Assist', value: suggestedAssist,           color: 'text-amber-400' },
    { label: 'Group Avg HCP',    value: String(groupAvgHcp),       color: 'text-muted-foreground' },
    { label: 'Delta to Group',   value: (delta >= 0 ? '+' : '') + delta, color: delta > 0 ? 'text-red-400' : 'text-green-400' },
  ];

  return (
    <div>
      <SectionLabel accent="amber" label="Handicap Assist Overlay (E-Bike)" />
      <div className="glass-card rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5">
        <div className="flex items-start gap-3 mb-4">
          <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Adaptive Assist Modulation</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Adjust e-bike assist levels based on your real-time handicap index and physiological state
              to equalise group riding effort.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/[0.06] text-center">
              <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
              <p className={`text-sm font-bold font-mono ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Assist level bar */}
        <div className="space-y-2 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            Assist Level Recommendation
          </p>
          <div className="flex gap-2">
            {levels.map(level => (
              <div
                key={level}
                className={`flex-1 py-2 rounded-lg text-center text-[10px] font-bold border transition-all ${
                  level === suggestedAssist
                    ? 'border-amber-500/60 bg-amber-500/20 text-amber-400'
                    : 'border-border bg-white/5 text-muted-foreground'
                }`}
              >
                {level}
              </div>
            ))}
          </div>
        </div>

        {/* Live trigger alerts */}
        {triggers.length > 0 && (
          <div className="space-y-1.5 mb-4">
            {triggers.map((t, i) => {
              const { Icon, border } = TRIGGER_ICON[t.type] || TRIGGER_ICON.adjust;
              return (
                <div key={i} className={`flex items-center gap-2 p-2.5 rounded-lg border ${border}`}>
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${t.color}`} />
                  <p className={`text-xs font-semibold ${t.color}`}>{t.label}</p>
                </div>
              );
            })}
          </div>
        )}

        <div className="p-3 rounded-lg border border-dashed border-amber-500/20">
          <p className="text-xs text-muted-foreground text-center">
            Bosch Flow API, Shimano Steps BLE, and Brose motor integration hook — e-bike assist handicap modulation ready.
          </p>
        </div>
      </div>
    </div>
  );
}