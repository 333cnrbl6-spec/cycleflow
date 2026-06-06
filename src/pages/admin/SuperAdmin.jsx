import { useState } from 'react';
import { ShieldCheck, Building2, Layers, Activity, Settings, Server, Users, Zap, AlertTriangle, CheckCircle, Search, Plus, X, Edit2 } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import StatBlock from '@/components/ui/StatBlock';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';

const TABS = [
  { id: 'control',      label: 'Platform',       icon: ShieldCheck },
  { id: 'users',        label: 'User Management', icon: Users },
  { id: 'tenants',      label: 'Tenants',         icon: Building2 },
  { id: 'integrations', label: 'Integrations',    icon: Layers },
  { id: 'analytics',    label: 'Analytics',       icon: Activity },
  { id: 'settings',     label: 'Settings',        icon: Settings },
];

const ALL_USERS = [
  { id: 1,  name: 'Alex Turner',    email: 'alex@citycycling.co.uk',  role: 'club_admin',                  tenant: 'City Cycling Club',       status: 'active',    last: '06 Jun 2026' },
  { id: 2,  name: 'Sarah Chen',     email: 'sarah@citycycling.co.uk', role: 'cyclist',                     tenant: 'City Cycling Club',       status: 'active',    last: '06 Jun 2026' },
  { id: 3,  name: 'Marcus Webb',    email: 'm.webb@hillside.cc',      role: 'cyclist',                     tenant: 'Hillside Velo',           status: 'active',    last: '05 Jun 2026' },
  { id: 4,  name: 'Regional Admin', email: 'coord@southeast.gov.uk',  role: 'regional_coordinator',        tenant: 'South East Region',       status: 'active',    last: '04 Jun 2026' },
  { id: 5,  name: 'Fed Director',   email: 'director@british.cycling', role: 'national_federation_admin',  tenant: 'British Cycling',         status: 'active',    last: '06 Jun 2026' },
  { id: 6,  name: 'UCI Observer',   email: 'obs@uci.ch',              role: 'international_governing_body',tenant: 'UCI Test Environment',    status: 'sandbox',   last: '02 Jun 2026' },
  { id: 7,  name: 'Tom Barker',     email: 't.barker@citycycling.co.uk',role:'cyclist',                   tenant: 'City Cycling Club',       status: 'inactive',  last: '12 Apr 2026' },
  { id: 8,  name: 'Super Admin',    email: 'sa@cycleflow.io',         role: 'super_admin',                 tenant: 'Platform',                status: 'active',    last: '06 Jun 2026' },
];

const TENANTS = [
  { name: 'British Cycling',        type: 'National Federation', users: 4620, status: 'active',    plan: 'Enterprise' },
  { name: 'City Cycling Club',      type: 'Club',                users: 48,   status: 'active',    plan: 'Standard' },
  { name: 'South East Region',      type: 'Regional Body',       users: 174,  status: 'active',    plan: 'Professional' },
  { name: 'UCI Test Environment',   type: 'Int. Governing Body', users: 12,   status: 'sandbox',   plan: 'Enterprise' },
  { name: 'Hillside Velo',          type: 'Club',                users: 31,   status: 'active',    plan: 'Standard' },
  { name: 'Wales Cycling',          type: 'Regional Body',       users: 89,   status: 'suspended', plan: 'Professional' },
];

const INTEGRATIONS = [
  { name: 'Azure Active Directory', category: 'Identity', status: 'configured', icon: '🔷' },
  { name: 'Strava API',             category: 'Fitness',  status: 'active',     icon: '🟠' },
  { name: 'Garmin Connect',         category: 'Devices',  status: 'active',     icon: '⚫' },
  { name: 'Wahoo Cloud',            category: 'Devices',  status: 'inactive',   icon: '🔵' },
  { name: 'Stripe Payments',        category: 'Billing',  status: 'active',     icon: '💳' },
  { name: 'Twilio (SMS/SOS)',       category: 'Safety',   status: 'active',     icon: '📱' },
  { name: 'AWS S3 (GPX Storage)',   category: 'Storage',  status: 'active',     icon: '🟡' },
  { name: 'SendGrid (Email)',        category: 'Comms',    status: 'active',     icon: '📧' },
];

const platformData = [
  {d:'01 Jun',users:4800},{d:'02 Jun',users:4920},{d:'03 Jun',users:5100},
  {d:'04 Jun',users:4980},{d:'05 Jun',users:5240},{d:'06 Jun',users:5380},
];

const ROLES = ['cyclist','club_admin','regional_coordinator','national_federation_admin','international_governing_body','super_admin'];
const ROLE_META = {
  cyclist:                      { label:'Cyclist',              color:'bg-blue-500/10 text-blue-400' },
  club_admin:                   { label:'Club Admin',           color:'bg-cyan-500/10 text-cyan-400' },
  regional_coordinator:         { label:'Regional Coord.',      color:'bg-violet-500/10 text-violet-400' },
  national_federation_admin:    { label:'Federation Admin',     color:'bg-amber-500/10 text-amber-400' },
  international_governing_body: { label:'Int. Gov. Body',       color:'bg-orange-500/10 text-orange-400' },
  super_admin:                  { label:'Super Admin',          color:'bg-red-500/10 text-red-400' },
};

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return <div className="bg-[#0a0f1a] border border-[#1e2a3e] rounded-lg px-3 py-2 text-xs shadow-xl">
    <p className="text-muted-foreground mb-1">{label}</p>
    {payload.map((p,i) => <p key={i} style={{ color: p.color }} className="font-mono font-bold">{p.value}</p>)}
  </div>;
};

export default function SuperAdmin() {
  const location = useLocation();
  const pathSegment = location.pathname.split('/').pop();
  const defaultTab = ['users','tenants','integrations','analytics','settings'].includes(pathSegment) ? pathSegment : 'control';
  const [tab, setTab] = useState(defaultTab);

  // User management state
  const [users, setUsers]        = useState(ALL_USERS);
  const [search, setSearch]      = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editUser, setEditUser]   = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email:'', role:'cyclist', tenant:'City Cycling Club' });

  const filteredUsers = users.filter(u =>
    (roleFilter === 'all' || u.role === roleFilter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const updateRole = (id, role) => {
    setUsers(prev => prev.map(u => u.id === id ? {...u, role} : u));
    setEditUser(null);
  };

  return (
    <div className="p-6 page-enter">
      <div className="mb-1">
        <span className="text-xs font-bold uppercase tracking-widest text-red-400/70 bg-red-500/10 px-2 py-0.5 rounded-full">⚡ Super Admin — Platform Owner</span>
      </div>
      <PageHeader title="Platform Control Centre" subtitle="Full system access — CycleFlow v1.0 · SynergyFlow Ecosystem" icon={ShieldCheck} iconColor="text-red-400" />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {/* ── Platform Control ── */}
      {tab === 'control' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Active Users (Live)"  value="5,380" accent="blue"   trend="up" trendValue="+240 today" />
            <StatBlock label="Total Tenants"        value="48"    accent="cyan" />
            <StatBlock label="API Requests (24h)"   value="1.2M"  accent="violet" />
            <StatBlock label="System Uptime"        value="99.98%" accent="green" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PlaceholderCard title="System Health" description="Real-time infrastructure status" icon={Server} accent="blue">
              <div className="mt-3 space-y-2">
                {[
                  { service:'API Gateway',       status:'Operational', latency:'12ms'  },
                  { service:'Database Cluster',  status:'Operational', latency:'4ms'   },
                  { service:'Auth Service',      status:'Operational', latency:'8ms'   },
                  { service:'File Storage (S3)', status:'Operational', latency:'45ms'  },
                  { service:'Telemetry Engine',  status:'Degraded',    latency:'210ms' },
                  { service:'Email Service',     status:'Operational', latency:'90ms'  },
                ].map((s,i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === 'Operational' ? 'bg-green-400' : 'bg-amber-400'}`} />
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
            <PlaceholderCard title="Platform Alerts" description="Issues requiring attention" icon={AlertTriangle} accent="red">
              <div className="mt-3 space-y-2">
                <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
                  <p className="text-xs font-semibold text-amber-400">Telemetry Engine — Elevated Latency</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Average 210ms vs 50ms baseline. Auto-scaling triggered.</p>
                  <p className="text-[10px] text-muted-foreground mt-1">06 Jun 2026 — 09:42 UTC</p>
                </div>
                <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5">
                  <p className="text-xs font-semibold text-green-400 flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> All other systems operational</p>
                </div>
              </div>
            </PlaceholderCard>
          </div>
        </div>
      )}

      {/* ── User Management ── */}
      {tab === 'users' && (
        <div className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search users by name or email…"
                className="cf-input pl-9" />
            </div>
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="cf-select sm:w-48">
              <option value="all">All Roles</option>
              {ROLES.map(r => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
            </select>
            <button onClick={() => setShowInvite(true)} className="btn-danger flex-shrink-0">
              <Plus className="w-4 h-4" /> Invite User
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Total Users"  value={users.length.toString()}                               accent="blue" />
            <StatBlock label="Active"       value={users.filter(u=>u.status==='active').length.toString()} accent="green" />
            <StatBlock label="Inactive"     value={users.filter(u=>u.status==='inactive').length.toString()} accent="amber" />
            <StatBlock label="Admins"       value={users.filter(u=>u.role.includes('admin')||u.role==='super_admin').length.toString()} accent="red" />
          </div>

          {/* Table */}
          <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
            <table className="cf-table">
              <thead>
                <tr>
                  <th className="text-left">User</th>
                  <th className="text-left hidden sm:table-cell">Tenant</th>
                  <th className="text-left">Role</th>
                  <th className="text-center hidden md:table-cell">Status</th>
                  <th className="text-right hidden md:table-cell">Last Active</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border/30 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-blue-400">{u.name[0]}</span>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{u.name}</p>
                          <p className="text-[10px] text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{u.tenant}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ROLE_META[u.role]?.color || 'bg-white/10 text-muted-foreground'}`}>
                        {ROLE_META[u.role]?.label || u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        u.status === 'active'   ? 'bg-green-500/10 text-green-400' :
                        u.status === 'sandbox'  ? 'bg-blue-500/10 text-blue-400'   :
                                                   'bg-muted/50 text-muted-foreground'
                      }`}>{u.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground hidden md:table-cell">{u.last}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setEditUser(u)}
                        className="p-1.5 text-muted-foreground hover:text-blue-400 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tenants ── */}
      {tab === 'tenants' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="btn-danger">
              <Plus className="w-4 h-4" /> Provision Tenant
            </button>
          </div>
          <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
            <table className="cf-table">
              <thead>
                <tr>
                  <th className="text-left">Tenant</th>
                  <th className="text-left hidden sm:table-cell">Type</th>
                  <th className="text-right hidden md:table-cell">Users</th>
                  <th className="text-left hidden md:table-cell">Plan</th>
                  <th className="text-center">Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {TENANTS.map((t, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-white/3">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center"><Building2 className="w-3.5 h-3.5 text-red-400" /></div>
                        <span className="font-medium text-foreground">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{t.type}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground hidden md:table-cell">{t.users.toLocaleString()}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${t.plan === 'Enterprise' ? 'bg-violet-500/10 text-violet-400' : t.plan === 'Professional' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/10 text-muted-foreground'}`}>{t.plan}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'active' ? 'bg-green-500/10 text-green-400' : t.status === 'sandbox' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>{t.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right"><button className="text-xs text-muted-foreground hover:text-red-400 transition-colors">Configure</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Integrations ── */}
      {tab === 'integrations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Total"    value="8"  accent="blue" />
            <StatBlock label="Active"   value="6"  accent="green" />
            <StatBlock label="Inactive" value="1"  accent="amber" />
            <StatBlock label="Pending"  value="1"  accent="violet" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INTEGRATIONS.map((int, i) => (
              <div key={i} className="glass-card rounded-xl border border-white/5 p-4 flex items-center gap-3 hover:border-blue-500/20 transition-all">
                <span className="text-2xl">{int.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{int.name}</p>
                  <p className="text-xs text-muted-foreground">{int.category}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${int.status === 'active' ? 'bg-green-500/10 text-green-400' : int.status === 'configured' ? 'bg-violet-500/10 text-violet-400' : 'bg-white/10 text-muted-foreground'}`}>{int.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Analytics ── */}
      {tab === 'analytics' && (
        <div className="space-y-6">
          <PlaceholderCard title="Daily Active Users — Last 6 Days" description="Platform-wide DAU" icon={Activity} accent="red">
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={platformData}>
                  <defs>
                    <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="d" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<Tip />} />
                  <Area type="monotone" dataKey="users" name="DAU" stroke="#ef4444" strokeWidth={2} fill="url(#redGrad)" dot={{ fill: '#ef4444', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </PlaceholderCard>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="MAU"            value="18,400" accent="blue" />
            <StatBlock label="Rides Logged"   value="94,200" accent="cyan" />
            <StatBlock label="GPX Uploads"    value="12,100" accent="violet" />
            <StatBlock label="SOS Triggers"   value="3"      accent="red" />
          </div>
        </div>
      )}

      {/* ── Settings ── */}
      {tab === 'settings' && (
        <div className="max-w-2xl space-y-4">
          <PlaceholderCard title="Global Platform Settings" description="System-wide config — affects all tenants" icon={Settings} accent="red">
            <div className="mt-4 space-y-3">
              {[
                { label:'Maintenance Mode',            value:'Disabled',           desc:'Lock all tenant access during windows' },
                { label:'New Tenant Registration',     value:'Enabled',            desc:'Allow organisations to self-provision' },
                { label:'Platform-wide SSO (AzureAD)', value:'Configured (Beta)',  desc:'Global Azure AD integration' },
                { label:'Global Data Retention',       value:'7 Years',            desc:'GDPR + UCI record retention compliance' },
                { label:'SOS Alert Provider',          value:'Twilio — Active',    desc:'Emergency SMS gateway' },
              ].map((s,i) => (
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
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/5">
            <p className="text-xs font-bold text-red-400 mb-3 flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> Danger Zone</p>
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

      {/* ── Role Edit Modal ── */}
      {editUser && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setEditUser(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl page-enter">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">Edit User Role</h3>
              <button onClick={() => setEditUser(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-400">{editUser.name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{editUser.name}</p>
                  <p className="text-xs text-muted-foreground">{editUser.email}</p>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-2">Assign Role</label>
                <div className="space-y-1.5">
                  {ROLES.map(r => (
                    <button key={r} onClick={() => updateRole(editUser.id, r)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-xs transition-all ${
                        editUser.role === r ? 'border-blue-500/40 bg-blue-500/10 text-blue-400' : 'border-border bg-white/3 text-foreground hover:bg-white/5'
                      }`}>
                      <span className={`px-2 py-0.5 rounded-full font-medium ${ROLE_META[r].color}`}>{ROLE_META[r].label}</span>
                      {editUser.role === r && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => setEditUser(null)} className="flex-1 py-2 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                <button onClick={() => setEditUser(null)} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">Suspend User</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Invite Modal ── */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowInvite(false)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl page-enter">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">Invite New User</h3>
              <button onClick={() => setShowInvite(false)}><X className="w-4 h-4 text-muted-foreground hover:text-foreground" /></button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <label className="cf-label">Email Address *</label>
                <input value={inviteForm.email} onChange={e => setInviteForm(p=>({...p,email:e.target.value}))}
                  placeholder="user@organisation.com" className="cf-input" />
              </div>
              <div>
                <label className="cf-label">Role</label>
                <select value={inviteForm.role} onChange={e => setInviteForm(p=>({...p,role:e.target.value}))} className="cf-select">
                  {ROLES.map(r => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
                </select>
              </div>
              <div>
                <label className="cf-label">Assign to Tenant</label>
                <select value={inviteForm.tenant} onChange={e => setInviteForm(p=>({...p,tenant:e.target.value}))} className="cf-select">
                  {TENANTS.map(t => <option key={t.name}>{t.name}</option>)}
                </select>
              </div>
              <button onClick={() => setShowInvite(false)} className="btn-danger w-full">
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}