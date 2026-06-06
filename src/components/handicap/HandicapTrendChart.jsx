import { TrendingDown } from 'lucide-react';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const STATIC_TREND = [
  { w: 'W1',  hcp: 4.8 }, { w: 'W2',  hcp: 4.6 }, { w: 'W3',  hcp: 4.4 },
  { w: 'W4',  hcp: 4.1 }, { w: 'W5',  hcp: 3.9 }, { w: 'W6',  hcp: 4.2 },
  { w: 'W7',  hcp: 3.7 }, { w: 'W8',  hcp: 3.4 }, { w: 'W9',  hcp: 3.2 },
  { w: 'W10', hcp: 3.0 }, { w: 'W11', hcp: 2.9 }, { w: 'W12', hcp: 2.7 },
];

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0f1a] border border-[#1e2a3e] rounded-lg px-3 py-2 text-xs shadow-xl">
      <span className="font-mono font-bold text-blue-400">{payload[0].value}</span>
      <span className="text-muted-foreground ml-1">HCP</span>
    </div>
  );
};

export default function HandicapTrendChart({ data }) {
  const chartData = data || STATIC_TREND;

  return (
    <PlaceholderCard
      title="Handicap Progression"
      description="Your rolling weekly handicap index over the last 12 weeks"
      icon={TrendingDown}
      accent="blue"
    >
      <div className="mt-4">
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="hcpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2234" vertical={false} />
            <XAxis dataKey="w" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 10]} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
            <Tooltip content={<Tip />} />
            <ReferenceLine
              y={3.5}
              stroke="#22d3ee"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
              label={{ value: 'A/B', fill: '#22d3ee', fontSize: 9, position: 'right' }}
            />
            <Area
              type="monotone"
              dataKey="hcp"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#hcpGrad)"
              dot={{ fill: '#3b82f6', r: 3 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </PlaceholderCard>
  );
}