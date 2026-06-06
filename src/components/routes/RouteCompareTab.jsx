import { useState } from 'react';
import { ArrowLeftRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionLabel from '@/components/ui/SectionLabel';
import ElevationProfile from './ElevationProfile';
import { CLUB_LIBRARY, SURFACE_COLORS, DIFFICULTY_COLORS } from './routeData';

const STAT_ROWS = [
  { key: 'distance',   label: 'Distance',   fmt: v => `${v} km`,     color: 'text-blue-400' },
  { key: 'elevation',  label: 'Elevation',  fmt: v => `${v}m`,        color: 'text-cyan-400' },
  { key: 'time',       label: 'Est. Time',  fmt: v => v,              color: 'text-amber-400' },
  { key: 'surface',    label: 'Surface',    fmt: v => v,              color: 'text-violet-400' },
  { key: 'difficulty', label: 'Difficulty', fmt: v => v,              color: 'text-orange-400' },
  { key: 'riders',     label: 'Riders',     fmt: v => `${v} members`, color: 'text-green-400' },
];

export default function RouteCompareTab() {
  const [leftId,  setLeftId]  = useState(CLUB_LIBRARY[0].id);
  const [rightId, setRightId] = useState(CLUB_LIBRARY[3].id);

  const left  = CLUB_LIBRARY.find(r => r.id === leftId);
  const right = CLUB_LIBRARY.find(r => r.id === rightId);

  const winner = (key) => {
    const lv = parseFloat(left[key])  || 0;
    const rv = parseFloat(right[key]) || 0;
    if (key === 'distance' || key === 'time') return lv < rv ? 'left' : lv > rv ? 'right' : 'tie';
    if (key === 'elevation') return lv < rv ? 'left' : lv > rv ? 'right' : 'tie';
    if (key === 'riders') return lv > rv ? 'left' : lv < rv ? 'right' : 'tie';
    return 'tie';
  };

  return (
    <div className="space-y-5 page-enter">
      <SectionLabel accent="violet" label="Compare Routes" />

      {/* Route selectors */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: leftId,  setId: setLeftId,  label: 'Route A', accent: 'blue' },
          { id: rightId, setId: setRightId, label: 'Route B', accent: 'violet' },
        ].map(({ id, setId, label, accent }) => (
          <div key={label}>
            <p className="cf-label">{label}</p>
            <select value={id} onChange={e => setId(e.target.value)} className="cf-select text-xs">
              {CLUB_LIBRARY.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Side-by-side elevation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { route: left,  accent: '#3b82f6', label: 'Route A Elevation' },
          { route: right, accent: '#a78bfa', label: 'Route B Elevation' },
        ].map(({ route, accent, label }) => (
          <div key={label} className="glass-card rounded-xl border border-white/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">{label}</p>
            <p className="text-sm font-semibold text-foreground mb-3">{route.name}</p>
            <ElevationProfile data={route.elevProfile} height={90} showStats />
          </div>
        ))}
      </div>

      {/* Stat comparison table */}
      <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
        <div className="px-4 py-3 border-b border-border/50 flex items-center gap-2">
          <ArrowLeftRight className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Stats Comparison</span>
        </div>

        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-2.5 border-b border-border/30 bg-white/[0.02]">
          <p className="text-[10px] font-bold text-blue-400 truncate">{left.name}</p>
          <div className="w-16 text-center" />
          <p className="text-[10px] font-bold text-violet-400 text-right truncate">{right.name}</p>
        </div>

        {STAT_ROWS.map(row => {
          const w = winner(row.key);
          const lsc = SURFACE_COLORS[left.surface];
          const rsc = SURFACE_COLORS[right.surface];
          const ldc = DIFFICULTY_COLORS[left.difficulty];
          const rdc = DIFFICULTY_COLORS[right.difficulty];

          const lClass = row.key === 'surface' ? lsc?.text : row.key === 'difficulty' ? ldc?.text : row.color;
          const rClass = row.key === 'surface' ? rsc?.text : row.key === 'difficulty' ? rdc?.text : row.color;

          return (
            <div key={row.key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-3 border-b border-border/20 last:border-b-0 hover:bg-white/[0.015] transition-colors">
              {/* Left value */}
              <div className="flex items-center gap-1.5">
                {w === 'left' && <Check className="w-3 h-3 text-green-400 flex-shrink-0" />}
                <span className={cn('text-sm font-bold font-mono', lClass)}>
                  {row.fmt(left[row.key])}
                </span>
              </div>

              {/* Centre label */}
              <div className="w-20 text-center flex-shrink-0">
                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">{row.label}</p>
              </div>

              {/* Right value */}
              <div className="flex items-center justify-end gap-1.5">
                <span className={cn('text-sm font-bold font-mono text-right', rClass)}>
                  {row.fmt(right[row.key])}
                </span>
                {w === 'right' && <Check className="w-3 h-3 text-green-400 flex-shrink-0" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Verdict */}
      <div className="glass-card rounded-xl border border-violet-500/15 bg-violet-500/5 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          <span className="text-violet-300 font-semibold">Simulated analysis:</span>{' '}
          {left.difficulty === 'Easy' || left.distance < right.distance
            ? `${left.name} is the more accessible option.`
            : `${right.name} offers a less demanding profile.`}
          {' '}Both routes are club-approved.
        </p>
      </div>
    </div>
  );
}