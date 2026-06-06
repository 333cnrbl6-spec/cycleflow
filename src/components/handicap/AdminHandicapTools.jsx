import { useState } from 'react';
import { Users, Globe2, BarChart2, Sliders, CheckCircle, AlertCircle, Map } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import StatBlock from '@/components/ui/StatBlock';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const CLUB_DIST_DATA = [
  { cat: 'Elite', count: 2 }, { cat: 'A', count: 8 }, { cat: 'B', count: 14 },
  { cat: 'C', count: 11 }, { cat: 'D', count: 5 }, { cat: 'Unrated', count: 3 },
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

const EVENT_GROUPS = [
  { group: 'Elite', hcpRange: '0.0–1.5', riders: 4,  color: 'text-amber-400',  badge: 'bg-amber-500/10 text-amber-400' },
  { group: 'A',     hcpRange: '1.6–3.5', riders: 12, color: 'text-blue-400',   badge: 'bg-blue-500/10 text-blue-400'   },
  { group: 'B',     hcpRange: '3.6–6.0', riders: 19, color: 'text-violet-400', badge: 'bg-violet-500/10 text-violet-400' },
  { group: 'C',     hcpRange: '6.1–9.0', riders: 9,  color: 'text-green-400',  badge: 'bg-green-500/10 text-green-400' },
  { group: 'D',     hcpRange: '9.1+',    riders: 4,  color: 'text-muted-foreground', badge: 'bg-white/10 text-muted-foreground' },
];

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0f1a] border border-[#1e2a3e] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }} className="font-mono font-bold">{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function AdminHandicapTools({ level = 'club' }) {
  const [normMode, setNormMode] = useState('category');

  return (
    <div className="space-y-6">

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBlock label="Avg Club HCP"   value="3.4"  accent="blue"   trend="down" trendValue="−0.3 this month" />
        <StatBlock label="Rated Riders"   value="40"   accent="green" />
        <StatBlock label="Unrated"        value="3"    accent="amber" />
        <StatBlock label="Elite Category" value="2"    accent="violet" />
      </div>

      {/* ── Club distribution chart ── */}
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

      {/* ── Federation analytics ── */}
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

      {/* ── International map placeholder ── */}
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

      {/* ── Event normalisation tool ── */}
      <SectionLabel accent="violet" label="Event Handicap Normalisation" />
      <div className="glass-card rounded-xl border border-violet-500/20 bg-violet-500/[0.03] p-5">
        <div className="flex items-start gap-3 mb-4">
          <Sliders className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Event Start Group Allocator</p>
            <p className="text-xs text-muted-foreground mt-0.5">Automatically assign riders to fair start groups based on current handicap index. Supports mass-start and time-trial formats.</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          {['category', 'adjusted_time', 'wave_start'].map(m => (
            <button
              key={m}
              onClick={() => setNormMode(m)}
              className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all ${
                normMode === m ? 'border-violet-500/50 bg-violet-500/20 text-violet-400' : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {m === 'category' ? 'Category' : m === 'adjusted_time' ? 'Adj. Time' : 'Wave Start'}
            </button>
          ))}
        </div>

        {/* Proposed group table */}
        <div className="space-y-1.5 mb-4">
          {EVENT_GROUPS.map(g => (
            <div key={g.group} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/[0.04]">
              <span className={`badge flex-shrink-0 ${g.badge}`}>Group {g.group}</span>
              <span className="text-xs text-muted-foreground flex-1">HCP {g.hcpRange}</span>
              <span className="text-xs font-mono text-foreground">{g.riders} riders</span>
              {g.riders > 0
                ? <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                : <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              }
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button className="btn-primary flex-1 text-xs">Apply to Event</button>
          <button className="btn-secondary flex-1 text-xs">Export Start Sheet</button>
        </div>
      </div>

      <div className="p-3 rounded-xl border border-dashed border-violet-500/20 text-center">
        <p className="text-xs text-muted-foreground">British Cycling affiliation sync, UCI category rules engine, and real-time normalisation API — integration hook ready.</p>
      </div>
    </div>
  );
}