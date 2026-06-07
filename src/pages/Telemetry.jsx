import { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, Gauge, Zap, Heart, Wifi, WifiOff } from 'lucide-react';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import SectionLabel from '@/components/ui/SectionLabel';
import AdvancedOverlays from '@/components/telemetry/AdvancedOverlays';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

// ─── Constants ───────────────────────────────────────────────────────────────

const WINDOW = 60; // seconds of rolling data

const SENSORS = [
  { key: 'speed',    label: 'Live Speed',   unit: 'km/h', icon: Gauge,    color: '#3b82f6', accent: 'blue',   base: 28, variance: 6  },
  { key: 'cadence',  label: 'Cadence',      unit: 'rpm',  icon: Activity, color: '#22d3ee', accent: 'cyan',   base: 85, variance: 12 },
  { key: 'power',    label: 'Power Output', unit: 'W',    icon: Zap,      color: '#a78bfa', accent: 'violet', base: 210, variance: 45 },
  { key: 'hr',       label: 'Heart Rate',   unit: 'bpm',  icon: Heart,    color: '#f87171', accent: 'red',    base: 152, variance: 15 },
];

const INITIAL_BATTERIES = [
  { key: 'computer', name: 'Bike Computer',  pct: 78 },
  { key: 'power',    name: 'Power Meter',    pct: 91 },
  { key: 'speed',    name: 'Speed Sensor',   pct: 87 },
  { key: 'hrm',      name: 'Heart Rate Mon.', pct: 12 },
  { key: 'gps',      name: 'GPS Module',     pct: 65 },
];

const rand = (base, variance) =>
  Math.max(0, base + Math.round((Math.random() - 0.5) * variance * 2));

const initSeries = (base, variance) =>
  Array.from({ length: WINDOW }, (_, i) => ({
    t: `${i}s`,
    v: rand(base, variance),
  }));

const batteryColor = (pct) => {
  if (pct > 50) return { text: 'text-green-400', bar: 'bg-green-400' };
  if (pct > 20) return { text: 'text-amber-400', bar: 'bg-amber-400' };
  return { text: 'text-red-400', bar: 'bg-red-400' };
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, unit, color }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0f1a] border border-[#1e2a3e] rounded-lg px-3 py-2 text-xs shadow-xl">
      <span className="font-mono font-bold" style={{ color }}>{payload[0].value}</span>
      <span className="text-muted-foreground ml-1">{unit}</span>
    </div>
  );
};

// ─── Micro Sparkline ──────────────────────────────────────────────────────────

const Sparkline = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={36}>
    <LineChart data={data}>
      <Line
        type="monotone"
        dataKey="v"
        stroke={color}
        strokeWidth={1.5}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  </ResponsiveContainer>
);

const TELEMETRY_TABS = [
  { id: 'live',     label: 'Live Feed',          icon: Activity },
  { id: 'overlays', label: 'Advanced Overlays',  icon: Gauge },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Telemetry() {
  const [tab, setTab] = useState('live');

  // Rolling series for each metric
  const [series, setSeries] = useState(() => ({
    speed:   initSeries(28, 6),
    cadence: initSeries(85, 12),
    power:   initSeries(210, 45),
    hr:      initSeries(152, 15),
  }));

  // Battery levels
  const [batteries, setBatteries] = useState(INITIAL_BATTERIES);

  // Active sensor count (all connected minus HRM which starts low)
  const activeSensors = batteries.filter(b => b.pct > 10).length;

  const tickRef = useRef(0);

  const tick = useCallback(() => {
    tickRef.current += 1;
    const t = `${tickRef.current}s`;

    setSeries(prev => {
      const next = { ...prev };
      SENSORS.forEach(s => {
        const newPt = { t, v: rand(s.base, s.variance) };
        next[s.key] = [...prev[s.key].slice(1), newPt];
      });
      return next;
    });

    // Slowly drift battery (every 10 ticks, -0 to -1%)
    if (tickRef.current % 10 === 0) {
      setBatteries(prev =>
        prev.map(b => ({ ...b, pct: Math.max(0, b.pct - (Math.random() < 0.3 ? 1 : 0)) }))
      );
    }
  }, []);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <div className="page-enter">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <PageHeader
        title="Telemetry"
        subtitle="Live performance metrics from your sensors"
        icon={Activity}
        iconColor="text-cyan-400"
      >
        <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Live — {activeSensors} sensors active
        </span>
      </PageHeader>

      <SubNav tabs={TELEMETRY_TABS} active={tab} onSelect={setTab} />

      {/* ── Overlays tab ───────────────────────────────────────────────── */}
      {tab === 'overlays' && <div className="tab-enter"><AdvancedOverlays /></div>}

      {/* ── Live Feed ─────────────────────────────────────────────────── */}
      {tab === 'live' && <div className="tab-enter">

      {/* ── Section 1: Live Metric StatBlocks ──────────────────────────── */}
      <section className="mb-8">
        <SectionLabel accent="blue" label="Live Metrics" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SENSORS.map(s => {
            const current = series[s.key].at(-1)?.v ?? s.base;
            return (
              <div
                key={s.key}
                className="glass-card rounded-xl border border-white/5 hover:border-blue-500/20 p-4 transition-all duration-300"
                style={{ boxShadow: s.accent === 'blue' ? '0 0 24px rgba(59,130,246,0.07)' : undefined }}
              >
                {/* Icon + Label */}
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</p>
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: s.color + '18' }}>
                    <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                  </div>
                </div>
                {/* Value */}
                <div className="flex items-end gap-1.5 mb-3">
                  <span
                    className="text-3xl font-bold font-mono leading-none metric-glow"
                    style={{ color: s.color }}
                  >
                    {current}
                  </span>
                  <span className="text-xs text-muted-foreground mb-0.5">{s.unit}</span>
                </div>
                {/* Sparkline */}
                <Sparkline data={series[s.key].slice(-20)} color={s.color} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 2: Sensor Health & Battery ─────────────────────────── */}
      <section className="mb-8">
        <SectionLabel accent="amber" label="Sensor Health" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {batteries.map(b => {
            const { text, bar } = batteryColor(b.pct);
            const isLow = b.pct <= 20;
            const isConnected = b.pct > 5;
            return (
              <div
                key={b.key}
                className={`glass-card rounded-xl border p-4 transition-all duration-500 ${
                  isLow ? 'border-red-500/20 bg-red-500/3' : 'border-white/5'
                }`}
              >
                {/* Status dot + name */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isConnected ? (isLow ? 'bg-red-400 animate-pulse' : 'bg-green-400') : 'bg-muted-foreground'}`} />
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide truncate">{b.name}</p>
                </div>
                {/* Percentage */}
                <p className={`text-2xl font-bold font-mono leading-none mb-2 ${text}`}>{b.pct}%</p>
                {/* Bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${bar}`}
                    style={{ width: `${b.pct}%` }}
                  />
                </div>
                {/* Warning */}
                {isLow && (
                  <p className="text-[10px] text-red-400 mt-2 flex items-center gap-1">
                    <span>⚠</span> Low battery
                  </p>
                )}
                {/* Connected icon */}
                <div className="mt-2 flex justify-end">
                  {isConnected
                    ? <Wifi className="w-3 h-3 text-muted-foreground/40" />
                    : <WifiOff className="w-3 h-3 text-red-400/50" />
                  }
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Section 3: Real-Time Area Charts ───────────────────────────── */}
      <section>
        <SectionLabel accent="violet" label="Real-Time Performance" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SENSORS.map(s => {
            const current = series[s.key].at(-1)?.v ?? s.base;
            const gradId = `telemetry-grad-${s.key}`;
            return (
              <div key={s.key} className="glass-card rounded-xl border border-white/5 hover:border-white/10 p-5 transition-all duration-300">
                {/* Chart header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: s.color + '18' }}>
                      <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground font-heading">{s.label}</p>
                      <p className="text-[10px] text-muted-foreground">Last 60 seconds</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold font-mono leading-none" style={{ color: s.color }}>{current}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{s.unit}</p>
                  </div>
                </div>

                {/* Area chart */}
                <ResponsiveContainer width="100%" height={120}>
                  <AreaChart data={series[s.key]} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={s.color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2234" vertical={false} />
                    <XAxis
                      dataKey="t"
                      tick={{ fill: '#475569', fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      interval={14}
                    />
                    <YAxis
                      tick={{ fill: '#475569', fontSize: 9 }}
                      axisLine={false}
                      tickLine={false}
                      width={32}
                    />
                    <Tooltip content={<ChartTooltip unit={s.unit} color={s.color} />} />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={s.color}
                      strokeWidth={2}
                      fill={`url(#${gradId})`}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>

                {/* Footer: min / avg / max */}
                <ChartFooter data={series[s.key]} color={s.color} unit={s.unit} />
              </div>
            );
          })}
        </div>
      </section>
      </div>}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChartFooter({ data, color, unit }) {
  const values = data.map(d => d.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  return (
    <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-3 text-center gap-2">
      {[['Min', min], ['Avg', avg], ['Max', max]].map(([lbl, val]) => (
        <div key={lbl}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{lbl}</p>
          <p className="text-xs font-mono font-bold mt-0.5" style={{ color }}>{val} <span className="text-muted-foreground font-normal">{unit}</span></p>
        </div>
      ))}
    </div>
  );
}