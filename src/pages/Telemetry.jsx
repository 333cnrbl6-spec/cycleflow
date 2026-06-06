import { useState } from 'react';
import { Activity, Gauge, Zap, Heart, Battery, BarChart2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import StatBlock from '@/components/ui/StatBlock';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const genData = (base, variance, points = 20) =>
  Array.from({ length: points }, (_, i) => ({
    t: `${i}s`,
    v: Math.max(0, base + Math.round((Math.random() - 0.5) * variance * 2))
  }));

const speedData = genData(28, 6);
const cadenceData = genData(85, 12);
const powerData = genData(210, 45);
const hrData = genData(152, 15);

const METRICS = [
  { label: 'Live Speed', value: '28.4', unit: 'km/h', accent: 'blue', glow: true, data: speedData, color: '#3b82f6', icon: Gauge },
  { label: 'Cadence', value: '87', unit: 'rpm', accent: 'cyan', data: cadenceData, color: '#22d3ee', icon: Activity },
  { label: 'Power', value: '214', unit: 'W', accent: 'violet', data: powerData, color: '#a78bfa', icon: Zap },
  { label: 'Heart Rate', value: '152', unit: 'bpm', accent: 'red', data: hrData, color: '#f87171', icon: Heart },
];

const CustomTooltip = ({ active, payload, label, color }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0f1520] border border-[#1e2a3e] rounded-lg px-3 py-2 text-xs">
        <p style={{ color }} className="font-mono font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function Telemetry() {
  return (
    <div className="p-6 page-enter">
      <PageHeader title="Telemetry" subtitle="Live performance metrics from your sensors" icon={Activity} iconColor="text-cyan-400">
        <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Live — 4 sensors active
        </span>
      </PageHeader>

      {/* Live Metric Cards */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-blue-500 rounded-full" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Live Metrics</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {METRICS.map(m => (
            <div key={m.label} className="glass-card rounded-lg border border-white/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{m.label}</p>
                <m.icon className={`w-3.5 h-3.5`} style={{ color: m.color }} />
              </div>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-3xl font-bold font-mono metric-glow" style={{ color: m.color }}>{m.value}</span>
                <span className="text-sm text-muted-foreground mb-0.5">{m.unit}</span>
              </div>
              <ResponsiveContainer width="100%" height={40}>
                <LineChart data={m.data}>
                  <Line type="monotone" dataKey="v" stroke={m.color} strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </section>

      {/* Battery Level */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-amber-500 rounded-full" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Battery Level</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Bike Computer', pct: 78, color: 'text-green-400', bar: 'bg-green-400' },
            { name: 'Power Meter', pct: 91, color: 'text-green-400', bar: 'bg-green-400' },
            { name: 'Speed Sensor', pct: 87, color: 'text-green-400', bar: 'bg-green-400' },
            { name: 'HRM', pct: 12, color: 'text-red-400', bar: 'bg-red-400' },
          ].map((b, i) => (
            <div key={i} className="glass-card rounded-lg border border-white/5 p-4">
              <p className="text-xs text-muted-foreground mb-1">{b.name}</p>
              <p className={`text-2xl font-bold font-mono ${b.color}`}>{b.pct}%</p>
              <div className="mt-2 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${b.bar} transition-all`} style={{ width: `${b.pct}%` }} />
              </div>
              {b.pct < 20 && <p className="text-xs text-red-400 mt-1">⚠ Low battery</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Real-Time Graphs */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-violet-500 rounded-full" />
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Real-Time Graphs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {METRICS.map(m => (
            <div key={m.label} className="glass-card rounded-lg border border-white/5 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <m.icon className="w-4 h-4" style={{ color: m.color }} />
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                </div>
                <span className="text-xs font-mono" style={{ color: m.color }}>{m.value} {m.unit}</span>
              </div>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={m.data}>
                  <defs>
                    <linearGradient id={`grad-${m.label}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={m.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="t" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip color={m.color} />} />
                  <Area type="monotone" dataKey="v" stroke={m.color} strokeWidth={2} fill={`url(#grad-${m.label})`} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}