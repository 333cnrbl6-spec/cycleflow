import SectionLabel from '@/components/ui/SectionLabel';

function MetricBar({ pct }) {
  return (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1.5">
      <div className="h-full rounded-full bg-violet-400" style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

export default function HandicapBehaviourCard({ snapshot }) {
  const consistency  = snapshot ? snapshot.consistency    : 91;
  const adherence    = snapshot ? snapshot.planAdherence  : 84;
  const sleep        = snapshot ? snapshot.sleepScore     : 74;
  const restDays     = snapshot ? snapshot.restDays       : '3/4';
  const nutrition    = snapshot ? snapshot.nutritionConnected : false;
  const score        = snapshot ? snapshot.behScore       : 82;

  const BEHAVIOURAL = [
    { label: 'Training Consistency', value: `${consistency}%`, note: 'Last 28 days',   color: consistency >= 85 ? 'text-green-400' : 'text-amber-400', pct: consistency },
    { label: 'Plan Adherence',       value: `${adherence}%`,   note: 'Structured WOs', color: adherence >= 80   ? 'text-green-400' : 'text-amber-400', pct: adherence   },
    { label: 'Sleep Recovery Score', value: `${sleep}/100`,    note: 'Avg this week',  color: sleep >= 75       ? 'text-green-400' : 'text-amber-400', pct: sleep       },
    { label: 'Rest Day Compliance',  value: restDays,          note: 'This month',     color: 'text-blue-400',                                          pct: 75          },
    { label: 'Nutrition Log Score',  value: nutrition ? '✓ Connected' : '—', note: nutrition ? 'App linked' : 'Connect app', color: nutrition ? 'text-green-400' : 'text-muted-foreground', pct: 0 },
  ];

  return (
    <div>
      <SectionLabel accent="violet" label={`Behavioural Sub-Score — ${score}/100`} />
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