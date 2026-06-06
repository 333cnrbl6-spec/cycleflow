import { Heart, Brain, Zap, Wind, Moon, TrendingUp, Thermometer, Droplets } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';

const PHYSIO = [
  { icon: Heart,       label: 'Resting HR',       value: '58',   unit: 'bpm',    note: 'Excellent',  color: 'text-green-400',  bar: 'bg-green-400',  pct: 82 },
  { icon: TrendingUp,  label: 'Blood Pressure',    value: '118/76', unit: 'mmHg', note: 'Normal',    color: 'text-green-400',  bar: 'bg-green-400',  pct: 75 },
  { icon: Droplets,    label: 'Blood Glucose',     value: '4.8',  unit: 'mmol/L', note: 'Optimal',   color: 'text-green-400',  bar: 'bg-green-400',  pct: 88 },
  { icon: Wind,        label: 'SpO₂',              value: '98',   unit: '%',      note: 'Normal',    color: 'text-blue-400',   bar: 'bg-blue-400',   pct: 98 },
  { icon: Thermometer, label: 'BMI',               value: '22.4', unit: '',       note: 'Healthy',   color: 'text-cyan-400',   bar: 'bg-cyan-400',   pct: 70 },
];

const BEHAVIOURAL = [
  { label: 'Training Consistency',  value: '91%',    note: 'Last 28 days',   color: 'text-green-400',  pct: 91 },
  { label: 'Plan Adherence',        value: '84%',    note: 'Structured WOs', color: 'text-green-400',  pct: 84 },
  { label: 'Sleep Recovery Score',  value: '74/100', note: 'Avg this week',  color: 'text-amber-400',  pct: 74 },
  { label: 'Rest Day Compliance',   value: '3/4',    note: 'This month',     color: 'text-blue-400',   pct: 75 },
  { label: 'Nutrition Log Score',   value: '—',      note: 'Connect app',    color: 'text-muted-foreground', pct: 0 },
];

const REALTIME = [
  { label: 'HRV (Morning)',      value: '64',   unit: 'ms',  delta: '+4',  up: true  },
  { label: 'Live Power Output',  value: '218',  unit: 'W',   delta: '+12', up: true  },
  { label: 'Cadence',            value: '88',   unit: 'rpm', delta: '−2',  up: false },
  { label: 'Power:HR Ratio',     value: '3.76', unit: 'W/bpm', delta: '+0.2', up: true },
  { label: 'Core Temp (est.)',   value: '37.4', unit: '°C',  delta: '',    up: null  },
];

function MetricBar({ pct, barClass }) {
  return (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
      <div className={`h-full rounded-full ${barClass || 'bg-blue-400'}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function HandicapBreakdownCards() {
  return (
    <div className="space-y-6">

      {/* ── Physiological ── */}
      <div>
        <SectionLabel accent="red" label="Physiological Sub-Score — 68/100" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PHYSIO.map(m => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="glass-card rounded-xl border border-red-500/10 bg-red-500/[0.02] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">{m.label}</p>
                </div>
                <div className="flex items-end justify-between">
                  <span className={`text-2xl font-bold font-mono ${m.color}`}>{m.value}</span>
                  <span className="text-xs text-muted-foreground">{m.unit}</span>
                </div>
                <MetricBar pct={m.pct} barClass={m.bar} />
                <p className="text-[10px] text-muted-foreground mt-1.5">{m.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Behavioural ── */}
      <div>
        <SectionLabel accent="violet" label="Behavioural Sub-Score — 82/100" />
        <div className="glass-card rounded-xl border border-violet-500/10 overflow-hidden">
          {BEHAVIOURAL.map((m, i) => (
            <div key={m.label} className="flex items-center gap-3 px-4 py-3.5 border-b border-border/20 last:border-0 hover:bg-white/[0.02] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground">{m.label}</p>
                <p className="text-[10px] text-muted-foreground">{m.note}</p>
                {m.pct > 0 && <MetricBar pct={m.pct} barClass="bg-violet-400" />}
              </div>
              <span className={`text-sm font-bold font-mono flex-shrink-0 ${m.color}`}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Real-Time ── */}
      <div>
        <SectionLabel accent="cyan" label="Real-Time Modifiers — Live" right={
          <span className="flex items-center gap-1.5 text-[10px] text-green-400">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Live
          </span>
        } />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {REALTIME.map(m => (
            <div key={m.label} className="glass-card rounded-xl border border-cyan-500/10 bg-cyan-500/[0.02] p-4 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">{m.label}</p>
              <p className="text-xl font-bold font-mono text-cyan-400">{m.value}</p>
              {m.unit && <p className="text-[10px] text-muted-foreground">{m.unit}</p>}
              {m.delta && (
                <p className={`text-[10px] font-semibold mt-1 ${m.up ? 'text-green-400' : 'text-red-400'}`}>{m.delta}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── E-Bike Assist Overlay placeholder ── */}
      <div>
        <SectionLabel accent="amber" label="Handicap Assist Overlay (E-Bike)" />
        <div className="glass-card rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5">
          <div className="flex items-start gap-3 mb-4">
            <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">Adaptive Assist Modulation</p>
              <p className="text-xs text-muted-foreground mt-0.5">Adjust e-bike assist levels based on your real-time handicap index and physiological state to equalise group riding effort.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Current HCP',    value: '2.7',   color: 'text-blue-400' },
              { label: 'Suggested Assist', value: 'ECO+', color: 'text-amber-400' },
              { label: 'Group Avg HCP',  value: '3.4',   color: 'text-muted-foreground' },
              { label: 'Delta to Group', value: '−0.7',  color: 'text-green-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/[0.06] text-center">
                <p className="text-[10px] text-muted-foreground mb-1">{label}</p>
                <p className={`text-sm font-bold font-mono ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Assist level selector */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Assist Level Recommendation</p>
            <div className="flex gap-2">
              {['Off', 'ECO', 'ECO+', 'TOUR', 'SPORT', 'TURBO'].map((level, i) => (
                <div
                  key={level}
                  className={`flex-1 py-2 rounded-lg text-center text-[10px] font-bold border transition-all ${
                    level === 'ECO+' ? 'border-amber-500/60 bg-amber-500/20 text-amber-400' : 'border-border bg-white/5 text-muted-foreground'
                  }`}
                >
                  {level}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg border border-dashed border-amber-500/20">
            <p className="text-xs text-muted-foreground text-center">Bosch Flow API, Shimano Steps BLE, and Brose motor integration hook — e-bike assist handicap modulation ready.</p>
          </div>
        </div>
      </div>
    </div>
  );
}