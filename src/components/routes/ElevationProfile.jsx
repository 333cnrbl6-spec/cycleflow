import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0f1a] border border-[#1e2a3e] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-muted-foreground">{payload[0].payload.d}</p>
      <p className="font-mono font-bold text-cyan-400">{payload[0].value}m</p>
    </div>
  );
};

export default function ElevationProfile({ data, height = 100, showGradient = true, showStats = true }) {
  if (!data?.length) return null;

  const values = data.map(d => d.e);
  const minE = Math.min(...values);
  const maxE = Math.max(...values);
  const gain = Math.round(
    values.reduce((acc, v, i) => i > 0 && v > values[i - 1] ? acc + v - values[i - 1] : acc, 0)
  );

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="elevGradMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#22d3ee" stopOpacity={showGradient ? 0.35 : 0.15} />
              <stop offset="40%" stopColor="#3b82f6" stopOpacity={showGradient ? 0.20 : 0.08} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            {/* Gradient shading for steep sections */}
            <linearGradient id="elevGradSteep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#22d3ee" stopOpacity={0} />
              <stop offset="50%"  stopColor="#a78bfa" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="d"
            tick={{ fill: '#475569', fontSize: 8 }}
            axisLine={false}
            tickLine={false}
            interval={Math.floor(data.length / 6)}
          />
          <YAxis
            tick={{ fill: '#475569', fontSize: 8 }}
            axisLine={false}
            tickLine={false}
            domain={[minE - 20, maxE + 30]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="e"
            stroke="#22d3ee"
            strokeWidth={1.5}
            fill="url(#elevGradMain)"
            dot={false}
            isAnimationActive={false}
          />
          {/* Steep-section overlay */}
          <Area
            type="monotone"
            dataKey="e"
            stroke="none"
            fill="url(#elevGradSteep)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      {showStats && (
        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/5">
          {[
            ['Min', `${minE}m`],
            ['Gain', `+${gain}m`],
            ['Max', `${maxE}m`],
          ].map(([l, v]) => (
            <div key={l} className="text-center">
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide">{l}</p>
              <p className="text-xs font-mono font-bold text-cyan-400 mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}