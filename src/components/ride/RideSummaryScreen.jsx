import { CheckCircle, RotateCcw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import SectionLabel from '@/components/ui/SectionLabel';
import StatBlock from '@/components/ui/StatBlock';
import RideMap from '@/components/ride/RideMap';
import { genElevProfile } from '@/components/routes/routeData';
import { useDemo } from '@/lib/DemoContext';

const ZONE_DATA = [
  { zone: 'Recovery',  pct: 8,  color: '#6b7280' },
  { zone: 'Easy',      pct: 22, color: '#22c55e' },
  { zone: 'Tempo',     pct: 35, color: '#3b82f6' },
  { zone: 'Threshold', pct: 28, color: '#f59e0b' },
  { zone: 'VO2 Max',   pct: 7,  color: '#ef4444' },
];

const elevData = genElevProfile(7, 30);

/** Custom tooltip shared style */
function ElevTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1524] border border-amber-500/20 rounded-lg px-3 py-2 shadow-xl text-sm">
      <p className="text-muted-foreground text-[11px] mb-0.5 uppercase tracking-wide font-semibold">Elevation</p>
      <p className="text-amber-400 font-mono font-bold">{payload[0].value} <span className="text-muted-foreground font-normal text-[11px]">m</span></p>
    </div>
  );
}

export default function RideSummaryScreen({ onNewRide }) {
  const { demoMode } = useDemo();

  return (
    <div className="space-y-8 page-enter pb-6">

      {/* ── Completion Header ──────────────────────────────── */}
      <div className="flex items-center gap-4 p-5 glass-card rounded-xl border border-green-500/25 bg-green-500/[0.04]">
        <div className="w-11 h-11 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-foreground leading-tight">Ride Complete!</p>
          <p className="text-[13px] text-muted-foreground mt-0.5">Morning Loop · Today, 07:14</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {demoMode && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" aria-hidden="true" />
              Demo
            </span>
          )}
          <button
            onClick={onNewRide}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 active:bg-blue-600 text-white text-[13px] font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> New Ride
          </button>
        </div>
      </div>

      {/* ── Key Stats ─────────────────────────────────────── */}
      <section className="demo-fade">
        <SectionLabel accent="blue" label="Key Stats" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatBlock label="Distance"  value="38.1"    unit="km"      secondaryLabel="Total route distance" accent="blue" />
          <StatBlock label="Duration"  value="1:42"    unit="h:mm"    secondaryLabel="Moving time"          accent="green" />
          <StatBlock label="Elevation" value="720"     unit="m"       secondaryLabel="Total gain"           accent="amber" />
          <StatBlock label="Avg Speed" value="22.3"    unit="km/h"    secondaryLabel="Moving average"       accent="violet" />
          <StatBlock label="Calories"  value="748"     unit="kcal"    secondaryLabel="Energy burned"        accent="cyan" />
          <StatBlock label="Avg Power" value="224"     unit="W"       secondaryLabel="Normalised power"     accent="blue" />
        </div>
      </section>

      {/* ── Ride Map ──────────────────────────────────────── */}
      <section className="demo-fade">
        <SectionLabel accent="cyan" label="Route Map" />
        <RideMap demoMode={demoMode} />
      </section>

      {/* ── Elevation Profile ─────────────────────────────── */}
      <section className="demo-fade">
        <SectionLabel accent="amber" label="Elevation Profile" />
        <div className="glass-card rounded-xl border border-white/[0.07] p-5">
          {/* Legend */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-[3px] bg-amber-500 rounded-full" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Altitude (m)</span>
          </div>
          <ResponsiveContainer width="100%" height={110}>
            <AreaChart data={elevData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="sumElev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="d"
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                dy={4}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={36}
                unit="m"
              />
              <Tooltip content={<ElevTooltip />} cursor={{ stroke: '#f59e0b', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="e"
                stroke="#f59e0b"
                strokeWidth={2.5}
                fill="url(#sumElev)"
                dot={false}
                activeDot={{ r: 5, fill: '#fbbf24', stroke: '#0d1524', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Effort Zones ──────────────────────────────────── */}
      <section>
        <SectionLabel accent="violet" label="Effort Breakdown" />
        <div className="glass-card rounded-xl border border-white/[0.07] p-5 space-y-3">
          {ZONE_DATA.map(z => (
            <div key={z.zone} className="flex items-center gap-3 group">
              <span className="text-[13px] font-medium text-muted-foreground w-[88px] flex-shrink-0">{z.zone}</span>
              <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{ width: `${z.pct}%`, background: z.color }}
                />
              </div>
              <span className="text-[12px] font-mono font-semibold text-muted-foreground w-9 text-right">{z.pct}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Handicap Impact ───────────────────────────────── */}
      <section>
        <SectionLabel accent="cyan" label="Handicap Impact" />
        <div className="glass-card rounded-xl border border-cyan-500/20 bg-cyan-500/[0.03] p-5 space-y-3">
          {[
            { label: 'Start HCP',                value: '4.2 pts',  color: 'text-cyan-400' },
            { label: 'End HCP',                  value: '4.0 pts',  color: 'text-cyan-400' },
            { label: 'Assist Events',             value: '3',        color: 'text-foreground/90' },
            { label: 'Fairness Boosts',           value: '+1',       color: 'text-green-400' },
            { label: 'Performance Reductions',    value: '−1',       color: 'text-amber-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-[13px] text-muted-foreground">{label}</span>
              <span className={`text-[13px] font-mono font-semibold ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Safety Summary ────────────────────────────────── */}
      <section>
        <SectionLabel accent="red" label="Safety Summary" />
        <div className="glass-card rounded-xl border border-white/[0.07] p-5 space-y-3">
          {[
            { label: 'Alerts triggered',      value: '3',  color: 'text-red-400' },
            { label: 'Near-miss events',      value: '2',  color: 'text-amber-400' },
            { label: 'Beacon active',         value: 'Yes',color: 'text-green-400' },
            { label: 'Incident reports filed',value: '0',  color: 'text-foreground/90' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-[13px] text-muted-foreground">{label}</span>
              <span className={`text-[13px] font-mono font-semibold ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}