import { Heart, TrendingUp, Droplets, Wind, Thermometer } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';

function MetricBar({ pct, barClass }) {
  return (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
      <div className={`h-full rounded-full ${barClass || 'bg-blue-400'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

function clamp100(v) { return Math.max(0, Math.min(100, v)); }

export default function HandicapBaselineCard({ snapshot }) {
  // Derive display values from snapshot if provided
  const rhr     = snapshot ? snapshot.restingHR : 58;
  const sys     = snapshot ? snapshot.systolic  : 118;
  const dia     = snapshot ? snapshot.diastolic : 76;
  const glucose = snapshot ? snapshot.glucose   : 4.8;
  const spo2    = snapshot ? snapshot.spo2      : 98;
  const bmi     = snapshot ? snapshot.bmi       : 22.4;

  // Score each metric as 0–100
  const rhrScore  = clamp100(100 - (rhr - 45) * 2);
  const bpScore   = clamp100(100 - Math.max(sys - 115, 0) * 1.5 - Math.max(dia - 75, 0) * 2);
  const gluScore  = clamp100(100 - Math.abs(glucose - 4.7) * 20);
  const spo2Score = clamp100((spo2 - 90) * 10);
  const bmiScore  = clamp100(100 - Math.abs(bmi - 22) * 5);

  const PHYSIO = [
    { icon: Heart,       label: 'Resting HR',      value: String(rhr),          unit: 'bpm',    note: rhr < 60 ? 'Excellent' : rhr < 70 ? 'Good' : 'High',     color: rhr < 65 ? 'text-green-400' : 'text-amber-400', bar: rhr < 65 ? 'bg-green-400' : 'bg-amber-400', pct: rhrScore  },
    { icon: TrendingUp,  label: 'Blood Pressure',  value: `${sys}/${dia}`,      unit: 'mmHg',   note: sys < 120 ? 'Optimal'  : sys < 130 ? 'Normal' : 'Elevated', color: sys < 125 ? 'text-green-400' : 'text-amber-400', bar: sys < 125 ? 'bg-green-400' : 'bg-amber-400', pct: bpScore   },
    { icon: Droplets,    label: 'Blood Glucose',   value: String(glucose),      unit: 'mmol/L', note: glucose < 5.5 ? 'Optimal' : 'Monitor',                    color: glucose < 5.5 ? 'text-green-400' : 'text-amber-400', bar: glucose < 5.5 ? 'bg-green-400' : 'bg-amber-400', pct: gluScore  },
    { icon: Wind,        label: 'SpO₂',            value: String(spo2),         unit: '%',      note: spo2 >= 97 ? 'Normal' : 'Low',                             color: spo2 >= 96 ? 'text-blue-400' : 'text-red-400',    bar: spo2 >= 96 ? 'bg-blue-400' : 'bg-red-400',    pct: spo2Score },
    { icon: Thermometer, label: 'BMI',             value: String(bmi),          unit: '',       note: bmi < 25 ? 'Healthy' : bmi < 30 ? 'Overweight' : 'Obese', color: bmi < 25 ? 'text-cyan-400' : 'text-amber-400',  bar: bmi < 25 ? 'bg-cyan-400' : 'bg-amber-400',    pct: bmiScore  },
  ];

  return (
    <div>
      <SectionLabel accent="red" label={`Physiological Sub-Score — ${snapshot ? snapshot.physioScore : 68}/100`} />
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