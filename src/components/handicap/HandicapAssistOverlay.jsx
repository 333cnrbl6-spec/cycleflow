import { Zap } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';

const ASSIST_STATS = [
  { label: 'Current HCP',      value: '2.7',  color: 'text-blue-400' },
  { label: 'Suggested Assist', value: 'ECO+', color: 'text-amber-400' },
  { label: 'Group Avg HCP',    value: '3.4',  color: 'text-muted-foreground' },
  { label: 'Delta to Group',   value: '−0.7', color: 'text-green-400' },
];

const LEVELS = ['Off', 'ECO', 'ECO+', 'TOUR', 'SPORT', 'TURBO'];

export default function HandicapAssistOverlay() {
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
          {ASSIST_STATS.map(({ label, value, color }) => (
            <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/[0.06] text-center">
              <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
              <p className={`text-sm font-bold font-mono ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            Assist Level Recommendation
          </p>
          <div className="flex gap-2">
            {LEVELS.map(level => (
              <div
                key={level}
                className={`flex-1 py-2 rounded-lg text-center text-[10px] font-bold border transition-all ${
                  level === 'ECO+'
                    ? 'border-amber-500/60 bg-amber-500/20 text-amber-400'
                    : 'border-border bg-white/5 text-muted-foreground'
                }`}
              >
                {level}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg border border-dashed border-amber-500/20">
          <p className="text-xs text-muted-foreground text-center">
            Bosch Flow API, Shimano Steps BLE, and Brose motor integration hook — e-bike assist handicap modulation ready.
          </p>
        </div>
      </div>
    </div>
  );
}