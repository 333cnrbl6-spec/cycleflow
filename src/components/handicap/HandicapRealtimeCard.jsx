import SectionLabel from '@/components/ui/SectionLabel';

export default function HandicapRealtimeCard({ data }) {
  const metrics = data
    ? [
        { label: 'HRV (Morning)',     value: String(data.hrv),      unit: 'ms',    delta: null,       up: null },
        { label: 'Live Power Output', value: String(data.power),    unit: 'W',     delta: null,       up: null },
        { label: 'Cadence',           value: String(data.cadence),  unit: 'rpm',   delta: null,       up: null },
        { label: 'Speed',             value: String(data.speed),    unit: 'km/h',  delta: null,       up: null },
        { label: 'Gradient',          value: String(data.gradient), unit: '%',     delta: null,       up: null },
        { label: 'Wind',              value: String(data.wind),     unit: 'km/h',  delta: null,       up: null },
        { label: 'Core Temp (est.)',  value: String(data.coreTemp), unit: '°C',    delta: null,       up: null },
        { label: 'Power:HR Ratio',    value: String(data.powerHR),  unit: 'W/bpm', delta: null,       up: null },
      ]
    : [
        { label: 'HRV (Morning)',     value: '64',   unit: 'ms',    delta: '+4',  up: true  },
        { label: 'Live Power Output', value: '218',  unit: 'W',     delta: '+12', up: true  },
        { label: 'Cadence',           value: '88',   unit: 'rpm',   delta: '−2',  up: false },
        { label: 'Power:HR Ratio',    value: '3.76', unit: 'W/bpm', delta: '+0.2',up: true  },
        { label: 'Core Temp (est.)',  value: '37.4', unit: '°C',    delta: '',    up: null  },
      ];

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
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {metrics.map(m => (
          <div key={m.label} className="glass-card rounded-xl border border-cyan-500/10 bg-cyan-500/[0.02] p-3 text-center">
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-1.5 leading-tight">{m.label}</p>
            <p className="text-lg font-bold font-mono text-cyan-400">{m.value}</p>
            {m.unit && <p className="text-[10px] text-muted-foreground">{m.unit}</p>}
            {m.delta && (
              <p className={`text-[10px] font-semibold mt-0.5 ${m.up ? 'text-green-400' : 'text-red-400'}`}>{m.delta}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}