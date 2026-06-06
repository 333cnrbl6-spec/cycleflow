import { useState } from 'react';
import { Building2, Users, Map, Shield, Bell, Plus, ChevronRight, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import StatBlock from '@/components/ui/StatBlock';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import { useLocation } from 'react-router-dom';

const TABS = [
  { id: 'dashboard', label: 'Dashboard',    icon: Building2 },
  { id: 'members',   label: 'Members',      icon: Users },
  { id: 'routes',    label: 'Club Routes',  icon: Map },
  { id: 'safety',    label: 'Safety Reports', icon: Shield },
];

const MEMBERS = [
  { name: 'Alex Turner',  role: 'Club Admin',   joined: 'Jan 2024', rides: 47, status: 'active' },
  { name: 'Sarah Chen',   role: 'Cyclist',      joined: 'Mar 2024', rides: 41, status: 'active' },
  { name: 'Marcus Webb',  role: 'Cyclist',      joined: 'Feb 2024', rides: 38, status: 'active' },
  { name: 'Priya Nair',   role: 'Cyclist',      joined: 'Jun 2024', rides: 36, status: 'active' },
  { name: 'Tom Barker',   role: 'Cyclist',      joined: 'Oct 2024', rides: 12, status: 'inactive' },
  { name: 'Emma Wilson',  role: 'Cyclist',      joined: 'Jan 2025', rides: 8,  status: 'active' },
];

const ROUTES = [
  { name: 'Sunday Club Ride',     distance: '67 km', elevation: '540m', visibility: 'Public',  uses: 24 },
  { name: 'Tuesday Crit',         distance: '45 km', elevation: '210m', visibility: 'Members', uses: 18 },
  { name: 'Beginners Welcome',    distance: '22 km', elevation: '80m',  visibility: 'Public',  uses: 31 },
  { name: 'Hill Climb Training',  distance: '38 km', elevation: '890m', visibility: 'Members', uses: 9  },
];

const INCIDENTS = [
  { type: 'Near-miss',  rider: 'Marcus Webb',  date: '03 Jun 2026', status: 'Open',    severity: 'Medium' },
  { type: 'Road hazard',rider: 'Sarah Chen',   date: '28 May 2026', status: 'Resolved', severity: 'Low'    },
  { type: 'Mechanical', rider: 'Tom Barker',   date: '14 May 2026', status: 'Resolved', severity: 'Low'    },
];

export default function ClubAdmin() {
  const location = useLocation();
  const pathSegment = location.pathname.split('/').pop();
  const defaultTab = ['members','routes','safety'].includes(pathSegment) ? pathSegment : 'dashboard';
  const [tab, setTab] = useState(defaultTab);

  return (
    <div className="p-6 page-enter">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400/70 bg-cyan-500/10 px-2 py-0.5 rounded-full">Club Admin</span>
      </div>
      <PageHeader title="Club Administration" subtitle="City Cycling Club — manage members, routes, and safety" icon={Building2} iconColor="text-cyan-400" />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="Total Members" value="48"  accent="cyan"   trend="up" trendValue="+3 this month" />
            <StatBlock label="Active This Week" value="31" accent="blue" />
            <StatBlock label="Club Routes" value="12"    accent="violet" />
            <StatBlock label="Open Incidents" value="1"  accent="red"    trend="down" trendValue="was 3 last month" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PlaceholderCard title="Upcoming Club Rides" description="Next 4 scheduled rides" icon={Calendar} accent="blue">
              <div className="mt-3 space-y-2">
                {[
                  { name: 'Sunday Morning Ride', date: 'Sun 8 Jun', signups: 12, max: 20 },
                  { name: 'Tuesday Crit',         date: 'Tue 10 Jun', signups: 8,  max: 15 },
                  { name: 'Beginner Ride',        date: 'Sat 14 Jun', signups: 24, max: 30 },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                    <div>
                      <p className="text-xs font-medium text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                    </div>
                    <span className="text-xs text-blue-400">{r.signups}/{r.max}</span>
                  </div>
                ))}
                <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1">
                  <Plus className="w-3 h-3" /> Create Ride Event
                </button>
              </div>
            </PlaceholderCard>

            <PlaceholderCard title="Recent Announcements" description="Latest club communications" icon={Bell} accent="cyan">
              <div className="mt-3 space-y-2">
                {[
                  { title: 'New Safety Policy', date: '04 Jun', status: 'Pinned' },
                  { title: 'Sunday Route Changed', date: '03 Jun', status: 'Sent' },
                  { title: 'Kit Order Deadline', date: '01 Jun', status: 'Sent' },
                ].map((a, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5">
                    <p className="text-xs font-medium text-foreground">{a.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{a.date}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${a.status === 'Pinned' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/10 text-muted-foreground'}`}>{a.status}</span>
                    </div>
                  </div>
                ))}
                <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1">
                  <Plus className="w-3 h-3" /> New Announcement
                </button>
              </div>
            </PlaceholderCard>
          </div>
        </div>
      )}

      {tab === 'members' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{MEMBERS.length} members total</p>
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors">
              <Plus className="w-3 h-3" /> Invite Member
            </button>
          </div>
          <div className="glass-card rounded-lg border border-white/5 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Role</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Joined</th>
                  <th className="text-right px-4 py-3 hidden md:table-cell">Rides</th>
                  <th className="text-right px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MEMBERS.map((m, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-blue-400">{m.name[0]}</span>
                        </div>
                        <span className="font-medium text-foreground">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${m.role === 'Club Admin' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-500/10 text-blue-400'}`}>{m.role}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{m.joined}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground hidden md:table-cell">{m.rides}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`w-2 h-2 rounded-full inline-block ${m.status === 'active' ? 'bg-green-400' : 'bg-muted-foreground'}`} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs text-muted-foreground hover:text-blue-400 transition-colors">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'routes' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors">
              <Plus className="w-3 h-3" /> Add Route
            </button>
          </div>
          {ROUTES.map((r, i) => (
            <div key={i} className="glass-card rounded-lg border border-white/5 p-4 flex items-center gap-4 hover:border-blue-500/20 transition-all">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Map className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <div className="flex gap-3 mt-0.5 text-xs text-muted-foreground">
                  <span>{r.distance}</span><span>{r.elevation} elev</span><span>{r.uses} uses</span>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${r.visibility === 'Public' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>{r.visibility}</span>
              <button className="text-xs text-muted-foreground hover:text-blue-400 transition-colors">Edit</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'safety' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <StatBlock label="Open Incidents" value="1" accent="red" />
            <StatBlock label="Resolved This Month" value="5" accent="green" />
            <StatBlock label="Compliance Score" value="94%" accent="cyan" />
          </div>
          <div className="glass-card rounded-lg border border-white/5 overflow-hidden">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-foreground">Incident Log</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Rider</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Date</th>
                  <th className="text-center px-4 py-3">Severity</th>
                  <th className="text-right px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {INCIDENTS.map((inc, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-white/3 cursor-pointer">
                    <td className="px-4 py-3 font-medium text-foreground">{inc.type}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{inc.rider}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{inc.date}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${inc.severity === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>{inc.severity}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${inc.status === 'Open' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>{inc.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}