import { Heart, TrendingUp, Droplets, Wind, Thermometer } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';

const PHYSIO = [
  { icon: Heart,       label: 'Resting HR',        value: '58',     unit: 'bpm',    note: 'Excellent', color: 'text-green-400', bar: 'bg-green-400', pct: 82 },
  { icon: TrendingUp,  label: 'Blood Pressure',     value: '118/76', unit: 'mmHg',   note: 'Normal',    color: 'text-green-400', bar: 'bg-green-400', pct: 75 },
  { icon: Droplets,    label: 'Blood Glucose',      value: '4.8',    unit: 'mmol/L', note: 'Optimal',   color: 'text-green-400', bar: 'bg-green-400', pct: 88 },
  { icon: Wind,        label: 'SpO₂',               value: '98',     unit: '%',      note: 'Normal',    color: 'text-blue-400',  bar: 'bg-blue-400',  pct: 98 },
  { icon: Thermometer, label: 'BMI',                value: '22.4',   unit: '',       note: 'Healthy',   color: 'text-cyan-400',  bar: 'bg-cyan-400',  pct: 70 },
];

function MetricBar({ pct, barClass }) {
  return (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
      <div className={`h-full rounded-full ${barClass || 'bg-blue-400'}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function HandicapBaselineCard() {
  return (
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
  );
}