import { useState } from 'react';
import { Globe2, Globe, Activity, ShieldCheck, Flag, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import StatBlock from '@/components/ui/StatBlock';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';

const TABS = [
  { id: 'overview',    label: 'Global Overview',  icon: Globe2 },
  { id: 'compliance',  label: 'Int. Compliance',  icon: Globe },
  { id: 'events',      label: 'Int. Events',      icon: Activity },
  { id: 'governance',  label: 'Data Governance',  icon: ShieldCheck },
];

const FEDERATIONS = [
  { country: 'United Kingdom',   federation: 'British Cycling',       members: 4620, compliance: 94, flag: '🇬🇧' },
  { country: 'France',           federation: 'Fédération Française', members: 12400, compliance: 91, flag: '🇫🇷' },
  { country: 'Germany',          federation: 'BDR',                   members: 8700, compliance: 89, flag: '🇩🇪' },
  { country: 'Netherlands',      federation: 'KNWU',                  members: 5800, compliance: 97, flag: '🇳🇱' },
  { country: 'Italy',            federation: 'FCI',                   members: 9200, compliance: 82, flag: '🇮🇹' },
  { country: 'Spain',            federation: 'RFEC',                  members: 7100, compliance: 78, flag: '🇪🇸' },
];

const fedBarData = FEDERATIONS.map(f => ({ name: f.flag + ' ' + f.country.split(' ')[0], members: f.members }));

const INT_EVENTS = [
  { name: 'UCI Road World Championships',   date: '20 Sep 2026', host: 'Belgium',    entries: 1420, status: 'Open' },
  { name: 'European Cycling Championships', date: '04 Aug 2026', host: 'Germany',    entries: 860,  status: 'Open' },
  { name: 'Paris–Roubaix 2027 (Planning)', date: '12 Apr 2027', host: 'France',     entries: 0,    status: 'Planning' },
  { name: 'Global Youth Cycling Summit',    date: '15 Nov 2026', host: 'Virtual',    entries: 320,  status: 'Open' },
];

const GOVERNANCE_POLICIES = [
  { policy: 'Cross-Border Data Transfer Framework', region: 'EU/UK', status: 'Compliant', ref: 'GDPR Art. 46' },
  { policy: 'UCI Athlete Data Protection Policy',   region: 'Global', status: 'Compliant', ref: 'UCI Reg. 1.2.109' },
  { policy: 'Biometric Data Processing Agreement',  region: 'Global', status: 'Under Review', ref: 'GDPR Art. 9' },
  { policy: 'Third-Country Data Adequacy Decisions', region: 'Int.', status: 'Compliant', ref: 'GDPR Ch. V' },
];

export default function InternationalBody() {
  const location = useLocation();
  const pathSegment = location.pathname.split('/').pop();
  const defaultTab = ['compliance','events','governance'].includes(pathSegment) ? pathSegment : 'overview';
  const [tab, setTab] = useState(defaultTab);

  return (
    <div className="p-6 page-enter">
      <div className="mb-1">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-400/70 bg-orange-500/10 px-2 py-0.5 rounded-full">International Governing Body</span>
      </div>
      <PageHeader title="Global Oversight" subtitle="International cycling governance, compliance, and cross-border operations" icon={Globe2} iconColor="text-orange-400" />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Member Federations"  value="48"      accent="orange" />
            <StatBlock label="Registered Cyclists" value="2.4M"    accent="blue" trend="up" trendValue="+12% YoY" />
            <StatBlock label="Countries Covered"   value="62"      accent="cyan" />
            <StatBlock label="Global Compliance"   value="88%"     accent="amber" />
          </div>
          <PlaceholderCard title="Member Cyclists by Federation" description="Top 6 national federations by registered cyclist count" icon={Users} accent="orange">
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={fedBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f1520', border: '1px solid #1e2a3e', borderRadius: 8, color: '#f8fafc' }} />
                  <Bar dataKey="members" fill="#f97316" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </PlaceholderCard>
          <PlaceholderCard title="Global Alerts" description="Issues requiring international governance attention" icon={AlertTriangle} accent="amber">
            <div className="mt-3 space-y-2">
              {[
                { country: 'Spain (RFEC)',  issue: 'Compliance below 80% — second consecutive quarter', sev: 'high' },
                { country: 'Italy (FCI)',   issue: 'Incident reporting framework requires alignment with UCIReg v4.1', sev: 'medium' },
              ].map((a, i) => (
                <div key={i} className={`p-3 rounded-lg border ${a.sev === 'high' ? 'border-red-500/30 bg-red-500/5' : 'border-amber-500/30 bg-amber-500/5'}`}>
                  <p className="text-xs font-semibold text-foreground">{a.country}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.issue}</p>
                </div>
              ))}
            </div>
          </PlaceholderCard>
        </div>
      )}

      {tab === 'compliance' && (
        <div className="space-y-4">
          <div className="glass-card rounded-lg border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Country</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Federation</th>
                  <th className="text-right px-4 py-3 hidden md:table-cell">Members</th>
                  <th className="text-center px-4 py-3">Compliance</th>
                </tr>
              </thead>
              <tbody>
                {FEDERATIONS.map((f, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-white/3 cursor-pointer">
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">{f.flag} {f.country}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{f.federation}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground hidden md:table-cell">{f.members.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${f.compliance >= 90 ? 'bg-green-400' : f.compliance >= 80 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${f.compliance}%` }} />
                        </div>
                        <span className={`text-xs font-mono font-bold ${f.compliance >= 90 ? 'text-green-400' : f.compliance >= 80 ? 'text-amber-400' : 'text-red-400'}`}>{f.compliance}%</span>
                      </div>
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
          {INT_EVENTS.map((e, i) => (
            <div key={i} className="glass-card rounded-lg border border-white/5 p-4 hover:border-orange-500/20 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{e.name}</h3>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{e.date}</span>
                    <span className="flex items-center gap-1"><Flag className="w-3 h-3" />{e.host}</span>
                    {e.entries > 0 && <span className="text-orange-400">{e.entries.toLocaleString()} entries</span>}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  e.status === 'Open' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                }`}>{e.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'governance' && (
        <div className="space-y-4">
          <PlaceholderCard title="Data Governance Framework" description="Cross-border data handling policies and compliance references" icon={ShieldCheck} accent="orange">
            <div className="mt-3 space-y-2">
              {GOVERNANCE_POLICIES.map((p, i) => (
                <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{p.policy}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded-full">{p.region}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{p.ref}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${p.status === 'Compliant' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </PlaceholderCard>
          <PlaceholderCard title="Azure AD / Microsoft Entra Integration" description="Future RBAC integration status" icon={ShieldCheck} accent="blue">
            <div className="mt-3 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
              <p className="text-sm font-semibold text-blue-400 mb-1">Integration Planned — Not Yet Active</p>
              <p className="text-xs text-muted-foreground">Azure AD / Microsoft Entra RBAC integration is scheduled for Q3 2026. When enabled, federation roles will sync automatically with your organisation's Azure AD directory.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['Multi-tenant SSO','Role sync from Azure AD','Conditional Access Policy support','Audit log integration'].map(f => (
                  <span key={f} className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
            </div>
          </PlaceholderCard>
        </div>
      )}
    </div>
  );
}