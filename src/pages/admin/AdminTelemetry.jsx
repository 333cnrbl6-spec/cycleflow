import { useState } from 'react';
import { useDemo } from '@/lib/DemoContext';
import { Activity, Users, Building2, Globe, Globe2, TrendingUp, Zap, Heart, Gauge, BarChart2 } from 'lucide-react';
import AdminHandicapTools from '@/components/handicap/AdminHandicapTools';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import StatBlock from '@/components/ui/StatBlock';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const TABS = [
  { id: 'club',        label: 'Club Level',     icon: Building2 },
  { id: 'regional',    label: 'Regional',        icon: Users },
  { id: 'federation',  label: 'Federation',      icon: Globe },
  { id: 'global',      label: 'International',   icon: Globe2 },
  { id: 'handicap',    label: 'Handicap Tools',  icon: BarChart2 },
];

// Mock data
const weeklyKm = [
  { day: 'Mon', club: 420, regional: 2100, fed: 12000 },
  { day: 'Tue', club: 310, regional: 1800, fed: 9800  },
  { day: 'Wed', club: 580, regional: 2800, fed: 15200 },
  { day: 'Thu', club: 290, regional: 1600, fed: 8900  },
  { day: 'Fri', club: 640, regional: 3200, fed: 17400 },
  { day: 'Sat', club: 980, regional: 5100, fed: 28600 },
  { day: 'Sun', club: 760, regional: 4200, fed: 23100 },
];

const powerDist = [
  { zone: 'Z1', pct: 18 }, { zone: 'Z2', pct: 32 }, { zone: 'Z3', pct: 24 },
  { zone: 'Z4', pct: 14 }, { zone: 'Z5', pct: 8  }, { zone: 'Z6', pct: 4  },
];

const TOP_PERFORMERS = [
  { name: 'Alex Turner',  km: '1,842', power: '224W', hr: '148bpm', rides: 47 },
  { name: 'Sarah Chen',   km: '1,724', power: '198W', hr: '156bpm', rides: 41 },
  { name: 'Marcus Webb',  km: '1,612', power: '211W', hr: '152bpm', rides: 38 },
  { name: 'Priya Nair',   km: '1,540', power: '189W', hr: '160bpm', rides: 36 },
];

const CLUB_COMPARISON = [
  { name: 'City CC',      avgKm: 52.4, avgPower: 204, compliance: 94 },
  { name: 'Hillside',     avgKm: 44.1, avgPower: 187, compliance: 88 },
  { name: 'Valley',       avgKm: 38.7, avgPower: 172, compliance: 72 },
  { name: 'Coastal',      avgKm: 61.2, avgPower: 218, compliance: 97 },
  { name: 'N.Climbers',   avgKm: 34.9, avgPower: 165, compliance: 61 },
];

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a0f1a] border border-[#1e2a3e] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p,i) => <p key={i} style={{ color: p.color }} className="font-mono font-bold">{p.name}: {p.value}</p>)}
    </div>
  );
};

export default function AdminTelemetry() {
  const { demoMode, data } = useDemo();
  const cs = demoMode ? data.adminStats.club     : null;
  const rs = demoMode ? data.adminStats.regional : null;
  const fs = demoMode ? data.adminStats.federation : null;
  const gs = demoMode ? data.adminStats.international : null;
  const [tab, setTab] = useState('club');

  return (
    <div className="p-6 page-enter">
      <div className="mb-1">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400/70 bg-cyan-500/10 px-2 py-0.5 rounded-full">Admin Telemetry</span>
      </div>
      <PageHeader title="Telemetry Overview" subtitle="Aggregated performance data across all levels" icon={Activity} iconColor="text-cyan-400" />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {/* ── Club Level ── */}
      {tab === 'club' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Active Members"   value={cs ? String(cs.activeMembers) : '48'} accent="blue" />
            <StatBlock label="Compliance Score" value={cs ? `${cs.complianceScore}%` : '94%'} accent="green" />
            <StatBlock label="Events This Month" value={cs ? String(cs.eventsThisMonth) : '6'} accent="violet" />
            <StatBlock label="Avg HCP"          value={cs ? String(cs.avgHcp) : '3.4'} unit="hcp" accent="cyan" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PlaceholderCard title="Weekly Distance — Club" description="Total km ridden by all club members" icon={TrendingUp} accent="blue">
              <div className="mt-3">
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={weeklyKm}>
                    <defs>
                      <linearGradient id="clubGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2234" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} unit="km" width={40} />
                    <Tooltip content={<Tip />} />
                    <Area type="monotone" dataKey="club" name="Club km" stroke="#3b82f6" strokeWidth={2} fill="url(#clubGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </PlaceholderCard>

            <PlaceholderCard title="Power Zone Distribution" description="% time in each training zone" icon={Zap} accent="violet">
              <div className="mt-3">
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={powerDist}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2234" vertical={false} />
                    <XAxis dataKey="zone" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" width={30} />
                    <Tooltip content={<Tip />} />
                    <Bar dataKey="pct" name="% Time" fill="#8b5cf6" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </PlaceholderCard>
          </div>

          {/* Top performers table */}
          <PlaceholderCard title="Top Performers — This Month" description="Club member performance rankings" icon={Activity} accent="blue">
            <div className="mt-3 overflow-x-auto -mx-1">
              <table className="cf-table">
                <thead>
                  <tr>
                    <th className="text-left">Rider</th>
                    <th className="text-right">Distance</th>
                    <th className="text-right hidden sm:table-cell">Avg Power</th>
                    <th className="text-right hidden md:table-cell">Avg HR</th>
                    <th className="text-right">Rides</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_PERFORMERS.map((p, i) => (
                    <tr key={i}>
                      <td className="font-medium text-foreground">{p.name}</td>
                      <td className="text-right text-blue-400 font-mono font-semibold">{p.km} km</td>
                      <td className="text-right text-violet-400 font-mono hidden sm:table-cell">{p.power}</td>
                      <td className="text-right text-red-400 font-mono hidden md:table-cell">{p.hr}</td>
                      <td className="text-right text-muted-foreground">{p.rides}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </PlaceholderCard>
        </div>
      )}

      {/* ── Regional ── */}
      {tab === 'regional' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Clubs in Region"  value={rs ? String(rs.clubs) : '12'} accent="violet" />
            <StatBlock label="Active Riders"    value={rs ? rs.activeRiders.toLocaleString() : '648'} accent="blue" />
            <StatBlock label="Compliance Rate"  value={rs ? `${rs.complianceRate}%` : '88%'} accent="green" />
            <StatBlock label="Below Threshold"  value={rs ? String(rs.belowThreshold) : '2'} accent="red" />
          </div>

          <PlaceholderCard title="Regional Distance Comparison" description="Weekly total km per club" icon={TrendingUp} accent="violet">
            <div className="mt-3">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={CLUB_COMPARISON}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2234" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} unit="km" width={40} />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="avgKm" name="Avg km/rider" fill="#8b5cf6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PlaceholderCard>

          <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Club Telemetry Summary</span>
            </div>
            <table className="cf-table">
              <thead>
                <tr>
                  <th className="text-left">Club</th>
                  <th className="text-right">Avg Ride</th>
                  <th className="text-right hidden sm:table-cell">Avg Power</th>
                  <th className="text-right">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {CLUB_COMPARISON.map((c, i) => (
                  <tr key={i}>
                    <td className="font-medium text-foreground">{c.name}</td>
                    <td className="text-right text-blue-400 font-mono font-semibold">{c.avgKm} km</td>
                    <td className="text-right text-violet-400 font-mono hidden sm:table-cell">{c.avgPower}W</td>
                    <td className="text-right">
                      <span className={`text-xs font-mono font-bold ${c.compliance >= 90 ? 'text-green-400' : c.compliance >= 75 ? 'text-amber-400' : 'text-red-400'}`}>{c.compliance}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Federation ── */}
      {tab === 'federation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Affiliated Clubs"  value={fs ? String(fs.affiliatedClubs) : '138'} accent="amber" />
            <StatBlock label="Registered Riders" value={fs ? fs.registeredRiders.toLocaleString() : '12,400'} accent="blue" />
            <StatBlock label="Compliance %"      value={fs ? `${fs.complianceSubmitted}%` : '82%'} accent="cyan" />
            <StatBlock label="Avg HCP"           value={fs ? String(fs.avgHcp) : '3.8'} accent="red" />
          </div>

          <PlaceholderCard title="National Distance Trend — 2026" description="Monthly total km across all federation members" icon={TrendingUp} accent="amber">
            <div className="mt-3">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={[
                  {m:'Jan',km:480000},{m:'Feb',km:510000},{m:'Mar',km:620000},
                  {m:'Apr',km:740000},{m:'May',km:880000},{m:'Jun',km:940000},
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2234" vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} width={50} />
                  <Tooltip content={<Tip />} />
                  <Line type="monotone" dataKey="km" name="Total km" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </PlaceholderCard>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Avg Rider Power" value="201" unit="W"   accent="violet" />
            <StatBlock label="Avg Heart Rate"  value="153" unit="bpm" accent="red" />
            <StatBlock label="Avg Cadence"     value="84"  unit="rpm" accent="cyan" />
            <StatBlock label="Avg Ride Dist."  value="48.2" unit="km" accent="blue" />
          </div>
        </div>
      )}

      {/* ── Handicap Tools ── */}
      {tab === 'handicap' && (
        <div>
          <AdminHandicapTools level="federation" />
        </div>
      )}

      {/* ── International ── */}
      {tab === 'global' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Total Riders"       value={gs ? gs.totalRiders.toLocaleString() : '180,000'} accent="orange" />
            <StatBlock label="Federations"        value={gs ? String(gs.federations) : '34'} accent="blue" />
            <StatBlock label="World Events"       value={gs ? String(gs.worldEvents) : '16'} accent="cyan" />
            <StatBlock label="Gov. Alerts"        value={gs ? String(gs.governanceAlerts) : '2'} accent="amber" />
          </div>

          <PlaceholderCard title="Member Activity by Federation" description="Monthly active cyclists — top 6 federations" icon={Globe2} accent="orange">
            <div className="mt-3">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={[
                  {fed:'🇬🇧 UK',  m:4200},{fed:'🇫🇷 FR', m:11800},{fed:'🇩🇪 DE', m:8100},
                  {fed:'🇳🇱 NL',  m:5600},{fed:'🇮🇹 IT', m:8800},{fed:'🇪🇸 ES', m:6900},
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2234" vertical={false} />
                  <XAxis dataKey="fed" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} width={45} />
                  <Tooltip content={<Tip />} />
                  <Bar dataKey="m" name="Active members" fill="#f97316" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PlaceholderCard>
        </div>
      )}
    </div>
  );
}