import { useState } from 'react';
import { Globe, ShieldCheck, Calendar, Layers, Award, FileText, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import StatBlock from '@/components/ui/StatBlock';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';

const TABS = [
  { id: 'hq',        label: 'Federation HQ',   icon: Globe },
  { id: 'standards', label: 'Safety Standards', icon: ShieldCheck },
  { id: 'events',    label: 'National Events',  icon: Calendar },
  { id: 'reports',   label: 'Reporting',        icon: Layers },
];

const growthData = [
  { month: 'Jan', cyclists: 3200 }, { month: 'Feb', cyclists: 3450 },
  { month: 'Mar', cyclists: 3800 }, { month: 'Apr', cyclists: 4100 },
  { month: 'May', cyclists: 4380 }, { month: 'Jun', cyclists: 4620 },
];

const STANDARDS = [
  { code: 'BCF-S001', title: 'Helmet Compliance',          category: 'PPE',        status: 'Active', version: 'v3.2' },
  { code: 'BCF-S002', title: 'Pre-Ride Safety Check',      category: 'Operations', status: 'Active', version: 'v2.1' },
  { code: 'BCF-S003', title: 'Incident Reporting Protocol',category: 'Compliance', status: 'Active', version: 'v4.0' },
  { code: 'BCF-S004', title: 'Route Risk Assessment',      category: 'Planning',   status: 'Under Review', version: 'v1.8' },
  { code: 'BCF-S005', title: 'First Aid Certification',    category: 'Training',   status: 'Active', version: 'v2.4' },
];

const EVENTS = [
  { name: 'National Road Championships 2026', date: '12 Jul 2026',  region: 'Midlands',     status: 'Open',    entries: 284 },
  { name: 'Tour of Britain — Federation Stage', date: '05 Sep 2026', region: 'National',    status: 'Planning', entries: 0 },
  { name: 'Youth Cycling Grand Prix',           date: '20 Aug 2026', region: 'South East',  status: 'Open',    entries: 128 },
  { name: 'Winter Endurance Series R1',         date: '15 Nov 2026', region: 'North West',  status: 'Draft',   entries: 0 },
];

export default function FederationAdmin() {
  const location = useLocation();
  const pathSegment = location.pathname.split('/').pop();
  const defaultTab = ['standards','events','reports'].includes(pathSegment) ? pathSegment : 'hq';
  const [tab, setTab] = useState(defaultTab);

  return (
    <div className="p-6 page-enter">
      <div className="mb-1">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400/70 bg-amber-500/10 px-2 py-0.5 rounded-full">National Federation Admin</span>
      </div>
      <PageHeader title="Federation Headquarters" subtitle="British Cycling — National governance and standards" icon={Globe} iconColor="text-amber-400" />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'hq' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Registered Cyclists" value="4,620"  accent="amber" trend="up" trendValue="+240 this month" />
            <StatBlock label="Affiliated Clubs"    value="138"     accent="blue" />
            <StatBlock label="Regions"             value="9"       accent="violet" />
            <StatBlock label="Active Standards"    value="24"      accent="cyan" />
          </div>
          <PlaceholderCard title="Cyclist Growth — Jan to Jun 2026" description="National registered cyclist trend" icon={TrendingUp} accent="amber">
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f1520', border: '1px solid #1e2a3e', borderRadius: 8, color: '#f8fafc' }} />
                  <Line type="monotone" dataKey="cyclists" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </PlaceholderCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PlaceholderCard title="Compliance by Region" description="Regional compliance overview" icon={ShieldCheck} accent="amber">
              <div className="mt-3 space-y-2">
                {['South East — 91%','North West — 87%','Midlands — 83%','Yorkshire — 79%','Wales — 76%'].map((r, i) => {
                  const pct = parseInt(r.split('— ')[1]);
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-28 truncate">{r.split(' —')[0]}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct >= 90 ? 'bg-green-400' : pct >= 80 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </PlaceholderCard>
            <PlaceholderCard title="Federation Notices" description="Active national directives" icon={FileText} accent="amber">
              <div className="mt-3 space-y-2">
                {[
                  { title: 'Updated helmet standard BCF-S001 v3.2', date: '01 Jun 2026', type: 'Standard Update' },
                  { title: 'National championship entry deadline — 30 Jun', date: '15 May 2026', type: 'Event' },
                  { title: 'Q2 compliance submission window open', date: '01 Jun 2026', type: 'Compliance' },
                ].map((n, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-xs font-medium text-foreground">{n.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full">{n.type}</span>
                      <span className="text-[10px] text-muted-foreground">{n.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </PlaceholderCard>
          </div>
        </div>
      )}

      {tab === 'standards' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors">
              + Publish New Standard
            </button>
          </div>
          <div className="glass-card rounded-lg border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Code</th>
                  <th className="text-left px-4 py-3">Standard</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Category</th>
                  <th className="text-center px-4 py-3 hidden md:table-cell">Version</th>
                  <th className="text-right px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {STANDARDS.map((s, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-white/3 cursor-pointer">
                    <td className="px-4 py-3 font-mono text-xs text-amber-400">{s.code}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{s.title}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{s.category}</td>
                    <td className="px-4 py-3 text-center font-mono text-xs text-muted-foreground hidden md:table-cell">{s.version}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'events' && (
        <div className="space-y-3">
          {EVENTS.map((e, i) => (
            <div key={i} className="glass-card rounded-lg border border-white/5 p-4 hover:border-amber-500/20 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{e.name}</h3>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{e.date}</span><span>{e.region}</span>
                    {e.entries > 0 && <span className="text-blue-400">{e.entries} entries</span>}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  e.status === 'Open'    ? 'bg-green-500/10 text-green-400' :
                  e.status === 'Planning'? 'bg-blue-500/10 text-blue-400'   :
                                           'bg-muted/50 text-muted-foreground'
                }`}>{e.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Total Incidents (YTD)" value="847"  accent="amber" />
            <StatBlock label="Incident Rate"          value="0.18" unit="/ride" accent="blue" />
            <StatBlock label="Resolved"               value="96%"  accent="green" />
            <StatBlock label="Pending Review"         value="34"   accent="red" />
          </div>
          <PlaceholderCard title="Quarterly Reports" description="Download or preview submitted compliance reports" icon={FileText} accent="amber">
            <div className="mt-3 space-y-2">
              {['Q1 2026 — National Safety Report','Q4 2025 — Annual Compliance Summary','Q3 2025 — Incident Analysis'].map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-sm text-foreground">{r}</span>
                  <button className="text-xs text-amber-400 hover:text-amber-300 transition-colors">Download PDF</button>
                </div>
              ))}
            </div>
          </PlaceholderCard>
        </div>
      )}
    </div>
  );
}