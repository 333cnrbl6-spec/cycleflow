import { useState } from 'react';
import { Layers, Building2, ShieldCheck, Activity, TrendingUp, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import StatBlock from '@/components/ui/StatBlock';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';

const TABS = [
  { id: 'overview',    label: 'Regional Overview',  icon: Layers },
  { id: 'clubs',       label: 'Manage Clubs',        icon: Building2 },
  { id: 'compliance',  label: 'Compliance',          icon: ShieldCheck },
  { id: 'stats',       label: 'Aggregated Stats',    icon: Activity },
];

const CLUBS = [
  { name: 'City Cycling Club',    members: 48, rides: 312, compliance: 94, status: 'compliant' },
  { name: 'Hillside Velo',        members: 31, rides: 201, compliance: 88, status: 'compliant' },
  { name: 'Valley Riders',        members: 22, rides: 148, compliance: 72, status: 'warning'   },
  { name: 'Coastal Peloton',      members: 56, rides: 420, compliance: 97, status: 'compliant' },
  { name: 'Northern Climbers CC', members: 17, rides: 89,  compliance: 61, status: 'non-compliant' },
];

const statsData = CLUBS.map(c => ({ name: c.name.split(' ')[0], km: c.rides * 50 }));

export default function RegionalCoordinator() {
  const location = useLocation();
  const pathSegment = location.pathname.split('/').pop();
  const defaultTab = ['clubs','compliance','stats'].includes(pathSegment) ? pathSegment : 'overview';
  const [tab, setTab] = useState(defaultTab);

  return (
    <div className="p-6 page-enter">
      <div className="mb-1">
        <span className="text-xs font-bold uppercase tracking-widest text-violet-400/70 bg-violet-500/10 px-2 py-0.5 rounded-full">Regional Coordinator</span>
      </div>
      <PageHeader title="Regional Overview" subtitle="South East England — 5 clubs, 174 active cyclists" icon={Layers} iconColor="text-violet-400" />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Clubs in Region"  value="5"    accent="violet" />
            <StatBlock label="Total Cyclists"   value="174"  accent="blue"   trend="up" trendValue="+12 this quarter" />
            <StatBlock label="Rides This Month" value="1,170" accent="cyan"  />
            <StatBlock label="Avg Compliance"   value="82%"  accent="amber"  />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PlaceholderCard title="Club Compliance Summary" description="Compliance score across all regional clubs" icon={ShieldCheck} accent="violet">
              <div className="mt-3 space-y-2">
                {CLUBS.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-32 truncate">{c.name}</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${c.compliance >= 90 ? 'bg-green-400' : c.compliance >= 75 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${c.compliance}%` }}
                      />
                    </div>
                    <span className={`text-xs font-mono w-10 text-right ${c.compliance >= 90 ? 'text-green-400' : c.compliance >= 75 ? 'text-amber-400' : 'text-red-400'}`}>{c.compliance}%</span>
                  </div>
                ))}
              </div>
            </PlaceholderCard>
            <PlaceholderCard title="Regional Alerts" description="Issues requiring coordinator attention" icon={AlertTriangle} accent="amber">
              <div className="mt-3 space-y-2">
                {[
                  { club: 'Northern Climbers CC', issue: 'Compliance below 65% — action required', sev: 'high' },
                  { club: 'Valley Riders',         issue: 'Safety report overdue by 14 days',      sev: 'medium' },
                ].map((a, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${a.sev === 'high' ? 'border-red-500/30 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
                    <p className="text-xs font-semibold text-foreground">{a.club}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.issue}</p>
                  </div>
                ))}
                <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                  <p className="text-xs text-green-400 flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> 3 clubs fully compliant this month</p>
                </div>
              </div>
            </PlaceholderCard>
          </div>
        </div>
      )}

      {tab === 'clubs' && (
        <div className="glass-card rounded-lg border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                <th className="text-left px-4 py-3">Club</th>
                <th className="text-right px-4 py-3 hidden sm:table-cell">Members</th>
                <th className="text-right px-4 py-3 hidden md:table-cell">Rides</th>
                <th className="text-center px-4 py-3">Compliance</th>
                <th className="text-right px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {CLUBS.map((c, i) => (
                <tr key={i} className="border-b border-border/30 hover:bg-white/3 cursor-pointer transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-500/10 flex items-center justify-center">
                        <Building2 className="w-3.5 h-3.5 text-violet-400" />
                      </div>
                      <span className="font-medium text-foreground">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-foreground hidden sm:table-cell">{c.members}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground hidden md:table-cell">{c.rides}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-mono font-bold ${c.compliance >= 90 ? 'text-green-400' : c.compliance >= 75 ? 'text-amber-400' : 'text-red-400'}`}>{c.compliance}%</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      c.status === 'compliant' ? 'bg-green-500/10 text-green-400' :
                      c.status === 'warning'   ? 'bg-amber-500/10 text-amber-400' :
                                                  'bg-red-500/10 text-red-400'
                    }`}>{c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'compliance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <StatBlock label="Fully Compliant"    value="3" accent="green" />
            <StatBlock label="Needs Attention"    value="1" accent="amber" />
            <StatBlock label="Non-Compliant"      value="1" accent="red"   />
          </div>
          <PlaceholderCard title="Compliance Standards" description="National federation requirements for all clubs in the region" icon={ShieldCheck} accent="violet">
            <div className="mt-4 space-y-2">
              {[
                { standard: 'Pre-ride safety checks logged',       required: 'Monthly', clubs: '5/5' },
                { standard: 'Incident reports submitted',          required: 'Per event','clubs': '4/5' },
                { standard: 'First-aid trained member per ride',   required: 'Always',  clubs: '3/5' },
                { standard: 'Route risk assessment completed',     required: 'Per route','clubs': '4/5' },
                { standard: 'Equipment inspection log updated',    required: 'Quarterly','clubs': '5/5' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-xs font-medium text-foreground">{s.standard}</p>
                    <p className="text-xs text-muted-foreground">Required: {s.required}</p>
                  </div>
                  <span className={`text-xs font-mono font-bold ${s.clubs === '5/5' ? 'text-green-400' : 'text-amber-400'}`}>{s.clubs} clubs</span>
                </div>
              ))}
            </div>
          </PlaceholderCard>
        </div>
      )}

      {tab === 'stats' && (
        <div className="space-y-4">
          <PlaceholderCard title="Total Distance by Club (km)" description="Aggregated ride distance — current month" icon={Activity} accent="violet">
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit="km" />
                  <Tooltip contentStyle={{ background: '#0f1520', border: '1px solid #1e2a3e', borderRadius: 8, color: '#f8fafc' }} />
                  <Bar dataKey="km" fill="#8b5cf6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PlaceholderCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Total Rides (Month)" value="1,170" accent="violet" />
            <StatBlock label="Total Distance"      value="58,400" unit="km" accent="blue" />
            <StatBlock label="Avg Ride Length"     value="49.9" unit="km" accent="cyan" />
            <StatBlock label="Active Cyclists"     value="142"  accent="green" />
          </div>
        </div>
      )}
    </div>
  );
}