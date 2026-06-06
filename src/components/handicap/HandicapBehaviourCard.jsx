import SectionLabel from '@/components/ui/SectionLabel';

const BEHAVIOURAL = [
  { label: 'Training Consistency', value: '91%',    note: 'Last 28 days',   color: 'text-green-400',       pct: 91 },
  { label: 'Plan Adherence',       value: '84%',    note: 'Structured WOs', color: 'text-green-400',       pct: 84 },
  { label: 'Sleep Recovery Score', value: '74/100', note: 'Avg this week',  color: 'text-amber-400',       pct: 74 },
  { label: 'Rest Day Compliance',  value: '3/4',    note: 'This month',     color: 'text-blue-400',        pct: 75 },
  { label: 'Nutrition Log Score',  value: '—',      note: 'Connect app',    color: 'text-muted-foreground', pct: 0  },
];

function MetricBar({ pct }) {
  return (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
      <div className="h-full rounded-full bg-violet-400" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function HandicapBehaviourCard() {
  return (
    <div>
      <SectionLabel accent="violet" label="Behavioural Sub-Score — 82/100" />
      <div className="glass-card rounded-xl border border-violet-500/10 overflow-hidden">
        {BEHAVIOURAL.map(m => (
          <div
            key={m.label}
            className="flex items-center gap-3 px-4 py-3.5 border-b border-border/20 last:border-0 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">{m.label}</p>
              <p className="text-[10px] text-muted-foreground">{m.note}</p>
              {m.pct > 0 && <MetricBar pct={m.pct} />}
            </div>
            <span className={`text-sm font-bold font-mono flex-shrink-0 ${m.color}`}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}