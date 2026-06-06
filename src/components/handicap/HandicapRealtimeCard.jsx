import SectionLabel from '@/components/ui/SectionLabel';

const REALTIME = [
  { label: 'HRV (Morning)',     value: '64',   unit: 'ms',    delta: '+4',  up: true  },
  { label: 'Live Power Output', value: '218',  unit: 'W',     delta: '+12', up: true  },
  { label: 'Cadence',           value: '88',   unit: 'rpm',   delta: '−2',  up: false },
  { label: 'Power:HR Ratio',    value: '3.76', unit: 'W/bpm', delta: '+0.2',up: true  },
  { label: 'Core Temp (est.)',  value: '37.4', unit: '°C',    delta: '',    up: null  },
];

export default function HandicapRealtimeCard() {
  return (
    <div>
      <SectionLabel
        accent="cyan"
        label="Real-Time Modifiers — Live"
        right={
          <span className="flex items-center gap-1.5 text-[10px] text-green-400">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Live
          </span>
        }
      />
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
  );
}