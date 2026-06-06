import { CheckCircle, Map, TrendingUp, Zap, Shield, BarChart2, RotateCcw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import SectionLabel from '@/components/ui/SectionLabel';
import { genElevProfile } from '@/components/routes/routeData';
import { cn } from '@/lib/utils';

const ZONE_DATA = [
  { zone: 'Recovery', pct: 8,  color: '#6b7280' },
  { zone: 'Easy',     pct: 22, color: '#22c55e' },
  { zone: 'Tempo',    pct: 35, color: '#3b82f6' },
  { zone: 'Threshold',pct: 28, color: '#f59e0b' },
  { zone: 'VO2 Max',  pct: 7,  color: '#ef4444' },
];

const elevData = genElevProfile(7, 30);

function StatCard({ label, value, unit, accent = 'blue' }) {
  const colors = {
    blue: 'text-blue-400', green: 'text-green-400',
    amber: 'text-amber-400', violet: 'text-violet-400', cyan: 'text-cyan-400',
  };
  return (
    <div className="glass-card rounded-xl border border-white/[0.06] p-4 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">{label}</p>
      <p className={cn('text-2xl font-bold font-mono', colors[accent])}>{value}</p>
      {unit && <p className="text-[10px] text-muted-foreground/50 mt-0.5">{unit}</p>}
    </div>
  );
}

export default function RideSummaryScreen({ onNewRide }) {
  return (
    <div className="space-y-5 page-enter">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 glass-card rounded-xl border border-green-500/20 bg-green-500/[0.04]">
        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Ride Complete!</p>
          <p className="text-xs text-muted-foreground">Morning Loop · Today, 07:14</p>
        </div>
        <button
          onClick={onNewRide}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> New Ride
        </button>
      </div>

      {/* Key stats */}
      <div>
        <SectionLabel accent="blue" label="Key Stats" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatCard label="Distance"  value="38.1"   unit="km"      accent="blue" />
          <StatCard label="Duration"  value="1:42:08" unit="h:mm:ss" accent="green" />
          <StatCard label="Elevation" value="720"    unit="m gain"   accent="amber" />
          <StatCard label="Avg Speed" value="22.3"   unit="km/h"    accent="violet" />
          <StatCard label="Calories"  value="748"    unit="kcal"    accent="cyan" />
          <StatCard label="Avg Power" value="224"    unit="watts"   accent="blue" />
        </div>
      </div>

      {/* Route map preview */}
      <div>
        <SectionLabel accent="cyan" label="Route" />
        <div className="h-40 rounded-xl bg-[#0a1628] border border-blue-500/20 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(90deg, #1e40af 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="z-10 text-center">
            <Map className="w-8 h-8 text-blue-400/40 mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Route recorded · 38.1 km</p>
          </div>
        </div>
      </div>

      {/* Elevation profile */}
      <div>
        <SectionLabel accent="amber" label="Elevation Profile" />
        <div className="glass-card rounded-xl border border-white/[0.06] p-4">
          <ResponsiveContainer width="100%" height={100}>
            <AreaChart data={elevData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="sumElev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="d" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: '#0f1520', border: '1px solid #1e2a3e', borderRadius: 8, color: '#f8fafc', fontSize: 11 }} />
              <Area type="monotone" dataKey="e" stroke="#f59e0b" strokeWidth={2} fill="url(#sumElev)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Effort zones */}
      <div>
        <SectionLabel accent="violet" label="Effort Breakdown" />
        <div className="glass-card rounded-xl border border-white/[0.06] p-4 space-y-2">
          {ZONE_DATA.map(z => (
            <div key={z.zone} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-20 flex-shrink-0">{z.zone}</span>
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${z.pct}%`, background: z.color }} />
              </div>
              <span className="text-xs font-mono text-muted-foreground w-8 text-right">{z.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Handicap impact */}
      <div>
        <SectionLabel accent="cyan" label="Handicap Impact" />
        <div className="glass-card rounded-xl border border-cyan-500/20 bg-cyan-500/[0.03] p-4 space-y-2">
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Start HCP</span><span className="font-mono text-cyan-400">4.2 pts</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">End HCP</span><span className="font-mono text-cyan-400">4.0 pts</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Assist Events</span><span className="font-mono text-foreground">3</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Fairness Boosts</span><span className="font-mono text-green-400">+1</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Performance Reductions</span><span className="font-mono text-amber-400">−1</span></div>
        </div>
      </div>

      {/* Safety summary */}
      <div>
        <SectionLabel accent="red" label="Safety Summary" />
        <div className="glass-card rounded-xl border border-white/[0.06] p-4 space-y-2">
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Alerts triggered</span><span className="font-mono text-red-400">3</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Near-miss events</span><span className="font-mono text-amber-400">2</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Beacon active</span><span className="font-mono text-green-400">Yes</span></div>
          <div className="flex justify-between text-xs"><span className="text-muted-foreground">Incident reports filed</span><span className="font-mono text-foreground">0</span></div>
        </div>
      </div>
    </div>
  );
}