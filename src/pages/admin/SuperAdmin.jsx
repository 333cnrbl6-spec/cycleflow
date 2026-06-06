import { useState } from 'react';
import { ShieldCheck, Building2, Layers, Activity, Settings, Server, Globe2, Users, Zap, AlertTriangle, CheckCircle, Database } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import StatBlock from '@/components/ui/StatBlock';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';

const TABS = [
  { id: 'control',      label: 'Platform Control', icon: ShieldCheck },
  { id: 'tenants',      label: 'Tenant Management', icon: Building2 },
  { id: 'integrations', label: 'Integrations',      icon: Layers },
  { id: 'analytics',    label: 'Platform Analytics', icon: Activity },
  { id: 'settings',     label: 'Global Settings',   icon: Settings },
];

const TENANTS = [
  { name: 'British Cycling',        type: 'National Federation', users: 4620,  status: 'active',    plan: 'Enterprise' },
  { name: 'City Cycling Club',      type: 'Club',                users: 48,    status: 'active',    plan: 'Standard' },
  { name: 'South East Region',      type: 'Regional Body',       users: 174,   status: 'active',    plan: 'Professional' },
  { name: 'UCI Test Environment',   type: 'Int. Governing Body', users: 12,    status: 'sandbox',   plan: 'Enterprise' },
  { name: 'Hillside Velo',          type: 'Club',                users: 31,    status: 'active',    plan: 'Standard' },
  { name: 'Wales Cycling',          type: 'Regional Body',       users: 89,    status: 'suspended', plan: 'Professional' },
];

const INTEGRATIONS = [
  { name: 'Azure Active Directory',   category: 'Identity',    status: 'configured', icon: '🔷' },
  { name: 'Strava API',               category: 'Fitness',     status: 'active',     icon: '🟠' },
  { name: 'Garmin Connect',           category: 'Devices',     status: 'active',     icon: '⚫' },
  { name: 'Wahoo Cloud',              category: 'Devices',     status: 'inactive',   icon: '🔵' },
  { name: 'Stripe Payments',          category: 'Billing',     status: 'active',     icon: '💳' },
  { name: 'Twilio (SMS/SOS)',         category: 'Safety',      status: 'active',     icon: '📱' },
  { name: 'AWS S3 (GPX Storage)',     category: 'Storage',     status: 'active',     icon: '🟡' },
  { name: 'SendGrid (Email)',         category: 'Comms',       status: 'active',     icon: '📧' },
];

const platformData = [
  { date: '01 Jun', users: 4800 }, { date: '02 Jun', users: 4920 }, { date: '03 Jun', users: 5100 },
  { date: '04 Jun', users: 4980 }, { date: '05 Jun', users: 5240 }, { date: '06 Jun', users: 5380 },
];

export default function SuperAdmin() {
  const location = useLocation();
  const pathSegment = location.pathname.split('/').pop();
  const defaultTab = ['tenants','integrations','analytics','settings'].includes(pathSegment) ? pathSegment : 'control';
  const [tab, setTab] = useState(defaultTab);

  return (
    <div className="p-6 page-enter">
      <div className="mb-1">
        <span className="text-xs font-bold uppercase tracking-widest text-red-400/70 bg-red-500/10 px-2 py-0.5 rounded-full">⚡ Super Admin — Platform Owner</span>
      </div>
      <PageHeader title="Platform Control Centre" subtitle="Full system access — CycleFlow v1.0 · SynergyFlow Ecosystem" icon={ShieldCheck} iconColor="text-red-400" />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'control' && (
        <div className="space-y-6">
          {/* System Health */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Active Users (Live)" value="5,380" accent="blue" trend="up" trendValue="+240 today" />
            <StatBlock label="Total Tenants"       value="48"    accent="cyan" />
            <StatBlock label="API Requests (24h)"  value="1.2M"  accent="violet" />
            <StatBlock label="System Uptime"       value="99.98%" accent="green" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PlaceholderCard title="System Health" description="Real-time platform infrastructure status" icon={Server} accent="blue">
              <div className="mt-3 space-y-2">
                {[
                  { service: 'API Gateway',        status: 'Operational', latency: '12ms' },
                  { service: 'Database Cluster',   status: 'Operational', latency: '4ms'  },
                  { service: 'Auth Service',        status: 'Operational', latency: '8ms'  },
                  { service: 'File Storage (S3)',   status: 'Operational', latency: '45ms' },
                  { service: 'Telemetry Engine',   status: 'Degraded',    latency: '210ms'},
                  { service: 'Email Service',       status: 'Operational', latency: '90ms' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === 'Operational' ? 'bg-green-400' : s.status === 'Degraded' ? 'bg-amber-400' : 'bg-red-400'}`} />
                      <span className="text-xs text-foreground">{s.service}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground">{s.latency}</span>
                      <span className={`text-xs ${s.status === 'Operational' ? 'text-green-400' : 'text-amber-400'}`}>{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </PlaceholderCard>

            <PlaceholderCard title="Platform Alerts" description="Critical issues requiring immediate attention" icon={AlertTriangle} accent="red">
              <div className="mt-3 space-y-2">
                <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                  <p className="text-xs font-semibold text-amber-400">Telemetry Engine — Elevated Latency</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Average response time 210ms vs 50ms baseline. Auto-scaling triggered. Monitoring.</p>
                  <p className="text-[10px] text-muted-foreground mt-1">06 Jun 2026 — 09:42 UTC</p>
                </div>
                <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                  <p className="text-xs font-semibold text-green-400 flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> All other systems operational</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Last checked 2 minutes ago</p>
                </div>
                <button className="text-xs text-red-400 hover:text-red-300 mt-1">View full incident log →</button>
              </div>
            </PlaceholderCard>
          </div>
        </div>
      )}

      {tab === 'tenants' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{TENANTS.length} tenants registered</p>
            <button className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">
              + Provision Tenant
            </button>
          </div>
          <div className="glass-card rounded-lg border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Tenant</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Type</th>
                  <th className="text-right px-4 py-3 hidden md:table-cell">Users</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Plan</th>
                  <th className="text-center px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Manage</th>
                </tr>
              </thead>
              <tbody>
                {TENANTS.map((t, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-white/3 cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center">
                          <Building2 className="w-3.5 h-3.5 text-red-400" />
                        </div>
                        <span className="font-medium text-foreground">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell text-xs">{t.type}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground hidden md:table-cell">{t.users.toLocaleString()}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${t.plan === 'Enterprise' ? 'bg-violet-500/10 text-violet-400' : t.plan === 'Professional' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/10 text-muted-foreground'}`}>{t.plan}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        t.status === 'active'    ? 'bg-green-500/10 text-green-400' :
                        t.status === 'sandbox'   ? 'bg-blue-500/10 text-blue-400'   :
                                                    'bg-red-500/10 text-red-400'
                      }`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs text-muted-foreground hover:text-red-400 transition-colors">Configure</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'integrations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Total Integrations" value="8"  accent="blue" />
            <StatBlock label="Active"              value="6"  accent="green" />
            <StatBlock label="Inactive"            value="1"  accent="amber" />
            <StatBlock label="Configured (Pending)"value="1"  accent="violet" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INTEGRATIONS.map((int, i) => (
              <div key={i} className="glass-card rounded-lg border border-white/5 p-4 flex items-center gap-3 hover:border-blue-500/20 transition-all">
                <span className="text-2xl">{int.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{int.name}</p>
                  <p className="text-xs text-muted-foreground">{int.category}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                  int.status === 'active'     ? 'bg-green-500/10 text-green-400'  :
                  int.status === 'configured' ? 'bg-violet-500/10 text-violet-400':
                                                'bg-white/10 text-muted-foreground'
                }`}>{int.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'analytics' && (
        <div className="space-y-6">
          <PlaceholderCard title="Daily Active Users — Last 6 Days" description="Platform-wide DAU trend" icon={Activity} accent="red">
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={platformData}>
                  <defs>
                    <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#0f1520', border: '1px solid #1e2a3e', borderRadius: 8, color: '#f8fafc' }} />
                  <Area type="monotone" dataKey="users" stroke="#ef4444" strokeWidth={2} fill="url(#redGrad)" dot={{ fill: '#ef4444', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PlaceholderCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="MAU"            value="18,400"  accent="blue" />
            <StatBlock label="Rides Logged"   value="94,200"  accent="cyan" />
            <StatBlock label="GPX Uploads"    value="12,100"  accent="violet" />
            <StatBlock label="SOS Triggers"   value="3"       accent="red" />
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="max-w-2xl space-y-4">
          <PlaceholderCard title="Global Platform Settings" description="System-wide configuration — changes affect all tenants" icon={Settings} accent="red">
            <div className="mt-4 space-y-3">
              {[
                { label: 'Maintenance Mode',           value: 'Disabled',          desc: 'Locks all tenant access during maintenance windows' },
                { label: 'New Tenant Registration',    value: 'Enabled',           desc: 'Allow new organisations to self-provision' },
                { label: 'Platform-wide SSO (AzureAD)', value: 'Configured (Beta)', desc: 'Global Azure AD Single Sign-On integration' },
                { label: 'Global Data Retention',      value: '7 Years',           desc: 'Compliant with UCI and GDPR record retention rules' },
                { label: 'SOS Alert Provider',         value: 'Twilio — Active',   desc: 'Emergency SMS gateway for SOS functionality' },
              ].map((s, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                  </div>
                  <span className="text-xs text-blue-400 flex-shrink-0 ml-4">{s.value}</span>
                </div>
              ))}
            </div>
          </PlaceholderCard>
          <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
            <p className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Danger Zone</p>
            <div className="space-y-2">
              {['Reset Platform Cache','Force Re-sync All Tenants','Trigger Global Maintenance Mode','Export Full Audit Log'].map(action => (
                <button key={action} className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-red-500/20 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}