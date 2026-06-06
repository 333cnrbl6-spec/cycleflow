import { useState } from 'react';
import { Info, TrendingDown, TrendingUp } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import StatBlock from '@/components/ui/StatBlock';
import HandicapTrendChart from './HandicapTrendChart';
import { hcpCategory } from '@/hooks/useHandicapSimulation';

const STATIC_FACTORS = [
  { label: 'Physiological', score: 68, color: 'text-red-400',    bar: 'bg-red-400',    desc: 'Resting HR, BP, SpO₂, glucose' },
  { label: 'Behavioural',   score: 82, color: 'text-violet-400', bar: 'bg-violet-400', desc: 'Consistency, adherence, recovery' },
  { label: 'Real-Time',     score: 74, color: 'text-cyan-400',   bar: 'bg-cyan-400',   desc: 'Live HRV, power output, cadence' },
  { label: 'Environmental', score: 91, color: 'text-amber-400',  bar: 'bg-amber-400',  desc: 'Weather, altitude, road surface' },
];

const STATIC_CLUB = [
  { name: 'Alex T.',   hcp: 1.2, category: 'Elite' },
  { name: 'Sarah C.',  hcp: 2.4, category: 'A' },
  { name: 'You',       hcp: 2.7, category: 'A', highlight: true },
  { name: 'Marcus W.', hcp: 3.1, category: 'B' },
  { name: 'Priya N.',  hcp: 3.8, category: 'B' },
  { name: 'Tom B.',    hcp: 5.2, category: 'C' },
  { name: 'Lucy M.',   hcp: 6.4, category: 'C' },
];

const CAT_COLOR = { Elite: 'text-amber-400', A: 'text-blue-400', B: 'text-violet-400', C: 'text-muted-foreground', D: 'text-muted-foreground/60' };

export default function HandicapDashboard({ snapshot }) {
  const [infoOpen, setInfoOpen] = useState(false);

  // Use simulated data when provided, otherwise fall back to statics
  const hcp            = snapshot ? snapshot.hcp            : 2.7;
  const weekChange     = snapshot ? snapshot.hcpWeekChange  : -0.2;
  const category       = snapshot ? snapshot.hcpCategory    : 'A';
  const trend          = snapshot ? snapshot.trend          : null;
  const clubDist       = snapshot ? snapshot.clubDist       : STATIC_CLUB;
  const physioScore    = snapshot ? snapshot.physioScore    : 68;
  const behScore       = snapshot ? snapshot.behScore       : 82;
  const rtScore        = snapshot ? snapshot.rtScore        : 74;
  const envScore       = snapshot ? snapshot.envScore       : 91;
  const hrv            = snapshot ? snapshot.hrv            : 64;
  const restingHR      = snapshot ? snapshot.restingHR      : 58;
  const power          = snapshot ? snapshot.power          : null;
  const consistency    = snapshot ? snapshot.consistency    : 91;

  const baseline  = snapshot ? +(hcp + Math.abs(weekChange) * 8).toFixed(1) : 4.8;
  const target    = snapshot ? +(hcp * 0.55).toFixed(1) : 1.5;
  const weekDelta = weekChange >= 0 ? `+${weekChange}` : String(weekChange);

  const factors = [
    { label: 'Physiological', score: physioScore, color: 'text-red-400',    bar: 'bg-red-400',    desc: 'Resting HR, BP, SpO₂, glucose' },
    { label: 'Behavioural',   score: behScore,    color: 'text-violet-400', bar: 'bg-violet-400', desc: 'Consistency, adherence, recovery' },
    { label: 'Real-Time',     score: rtScore,     color: 'text-cyan-400',   bar: 'bg-cyan-400',   desc: 'Live HRV, power output, cadence' },
    { label: 'Environmental', score: envScore,    color: 'text-amber-400',  bar: 'bg-amber-400',  desc: 'Weather, altitude, road surface' },
  ];

  const rankInClub = clubDist.findIndex(r => r.highlight) + 1;
  const clubSize   = clubDist.length;

  return (
    <div className="space-y-6">

      {/* ── Hero ── */}
      <div className="glass-card rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1">Current Handicap</span>
              <button onClick={() => setInfoOpen(p => !p)} className="text-muted-foreground hover:text-foreground transition-colors">
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold font-mono text-blue-400 leading-none">{hcp}</span>
              <div className="mb-1.5">
                <div className={`flex items-center gap-1 text-xs font-semibold ${weekChange <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {weekChange <= 0 ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                  {weekDelta} this week
                </div>
                <p className="text-[10px] text-muted-foreground">Category {category} · Club rank #{rankInClub} of {clubSize}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Baseline',    value: String(baseline),  color: 'text-muted-foreground' },
              { label: 'Target',      value: String(target),    color: 'text-green-400' },
              { label: 'Week Change', value: weekDelta,         color: weekChange <= 0 ? 'text-green-400' : 'text-red-400' },
              { label: 'Category',   value: category,          color: 'text-blue-400' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {infoOpen && (
          <div className="mt-4 p-4 rounded-xl border border-blue-500/20 bg-blue-500/[0.06] text-xs text-muted-foreground leading-relaxed">
            The CycleFlow Handicap Index is a composite score derived from physiological baseline metrics,
            real-time sensor data, and behavioural patterns. Lower is better. Scores are recalculated weekly
            using a rolling 28-day window. Category A = 0–3.5, B = 3.6–6.0, C = 6.1+.
          </div>
        )}
      </div>

      {/* ── Quick stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBlock label="HRV Score"        value={String(hrv)}         unit="ms"   accent="violet" />
        <StatBlock label="Resting HR"       value={String(restingHR)}   unit="bpm"  accent="red" />
        <StatBlock label="Power"            value={power ? String(power) : '—'} unit="W" accent="blue" />
        <StatBlock label="Ride Consistency" value={String(consistency)} unit="%"    accent="green" />
      </div>

      {/* ── Trend chart ── */}
      <SectionLabel accent="blue" label="12-Week Handicap Trend" />
      <HandicapTrendChart data={trend} />

      {/* ── Contributing factors ── */}
      <SectionLabel accent="violet" label="Contributing Factors" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {factors.map(f => (
          <div key={f.label} className="glass-card rounded-xl border border-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-foreground">{f.label}</p>
              <span className={`text-sm font-bold font-mono ${f.color}`}>{f.score}</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
              <div className={`h-full rounded-full ${f.bar}`} style={{ width: `${f.score}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Club leaderboard ── */}
      <SectionLabel accent="cyan" label="Club Leaderboard" />
      <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
        {clubDist.map((r, i) => (
          <div
            key={r.name + i}
            className={`flex items-center gap-3 px-4 py-3 border-b border-border/20 last:border-0 ${
              r.highlight ? 'bg-blue-500/[0.06] border-l-2 border-l-blue-500' : 'hover:bg-white/[0.02]'
            }`}
          >
            <span className="text-sm font-mono text-muted-foreground w-5 text-center">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold ${r.highlight ? 'text-blue-400' : 'text-foreground'}`}>{r.name}</p>
              <span className={`text-[10px] ${CAT_COLOR[r.category] || 'text-muted-foreground'}`}>Category {r.category}</span>
            </div>
            <span className={`text-sm font-bold font-mono ${r.highlight ? 'text-blue-400' : 'text-foreground'}`}>{r.hcp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}