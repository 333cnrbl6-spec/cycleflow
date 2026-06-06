import { Users, BarChart2, Globe2, Map } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import StatBlock from '@/components/ui/StatBlock';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const CLUB_DIST_DATA = [
  { cat: 'Elite', count: 2  }, { cat: 'A',       count: 8  }, { cat: 'B',   count: 14 },
  { cat: 'C',     count: 11 }, { cat: 'D',        count: 5  }, { cat: 'Unrated', count: 3 },
];

const FEDERATION_TREND = [
  { m: 'Jan', avg: 4.2 }, { m: 'Feb', avg: 4.0 }, { m: 'Mar', avg: 3.8 },
  { m: 'Apr', avg: 3.6 }, { m: 'May', avg: 3.4 }, { m: 'Jun', avg: 3.2 },
];

const INT_COUNTRY_DATA = [
  { country: '🇬🇧 UK', avg: 3.1 }, { country: '🇫🇷 FR', avg: 2.8 },
  { country: '🇩🇪 DE', avg: 2.6 }, { country: '🇳🇱 NL', avg: 3.4 },
  { country: '🇮🇹 IT', avg: 3.7 }, { country: '🇪🇸 ES', avg: 3.0 },
];

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0f1a] border border-[#1e2a3e] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-mono font-bold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

/**
 * level: 'club' | 'regional' | 'federation' | 'global'
 */
export default function HandicapAdminDistribution({ level = 'club' }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBlock label="Avg Club HCP"   value="3.4" accent="blue"   trend="down" trendValue="−0.3 this month" />
        <StatBlock label="Rated Riders"   value="40"  accent="green" />
        <StatBlock label="Unrated"        value="3"   accent="amber" />
        <StatBlock label="Elite Category" value="2"   accent="violet" />
      </div>

      {/* Club / Regional distribution bar */}
      {(level === 'club' || level === 'regional') && (
        <>
          <SectionLabel accent="blue" label="Club Handicap Distribution" />
          <PlaceholderCard title="Category Distribution" description="Member count per handicap category" icon={Users} accent="blue">
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={CLUB_DIST_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2234" vertical={false} />
                  <XAxis dataKey="cat" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="count" name="Riders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PlaceholderCard>
        </>
      )}

      {/* Federation trend line */}
      {(level === 'federation' || level === 'regional') && (
        <>
          <SectionLabel accent="amber" label="Federation Handicap Analytics" />
          <PlaceholderCard title="National Average HCP Trend" description="Rolling monthly average across all registered cyclists" icon={BarChart2} accent="amber">
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={FEDERATION_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2234" vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[2, 5]} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip content={<Tip />} />
                  <Line type="monotone" dataKey="avg" name="Avg HCP" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </PlaceholderCard>
        </>
      )}

      {/* International choropleth placeholder */}
      {level === 'global' && (
        <>
          <SectionLabel accent="orange" label="International Handicap Map" />
          <div className="glass-card rounded-xl border border-orange-500/20 overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-[#0a1628] to-[#0d1f3c] flex items-center justify-center">
              <Globe2 className="w-10 h-10 text-orange-400/30 absolute" />
              <div className="relative z-10 text-center">
                <Map className="w-8 h-8 text-orange-400/50 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">International Handicap Distribution Map</p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">Choropleth / D3.js integration hook ready</p>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INT_COUNTRY_DATA.map(c => (
                  <div key={c.country} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/[0.04]">
                    <span className="text-xs text-foreground">{c.country}</span>
                    <span className="text-xs font-bold font-mono text-orange-400">{c.avg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}