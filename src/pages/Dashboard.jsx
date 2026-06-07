import { LayoutDashboard, Play, Bluetooth, ShieldCheck, ChevronRight, Bike } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import PageHeader from '@/components/ui/PageHeader';
import StatBlock from '@/components/ui/StatBlock';
import SectionLabel from '@/components/ui/SectionLabel';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { useDemo } from '@/lib/DemoContext';

const STATIC_RIDE_DATA = [
  { day: 'Mon', km: 24 }, { day: 'Tue', km: 0 }, { day: 'Wed', km: 38 },
  { day: 'Thu', km: 15 }, { day: 'Fri', km: 42 }, { day: 'Sat', km: 67 }, { day: 'Sun', km: 29 },
];

const STATIC_RECENT_RIDES = [
  { name: 'Morning Loop',       date: 'Today, 07:14',  km: '24.3 km', time: '1h 12m', watts: '187W' },
  { name: 'Evening Commute',    date: 'Yesterday',      km: '12.1 km', time: '38m',    watts: '142W' },
  { name: 'Weekend Club Ride',  date: 'Sat 31 May',    km: '67.5 km', time: '3h 04m', watts: '211W' },
];

const QUICK_ACTIONS = [
  { icon: Play,       label: 'Start Ride',    desc: 'Begin a new ride session',      color: 'text-blue-400',  bg: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20',  path: '/ride' },
  { icon: Bluetooth,  label: 'Pair Bike',     desc: 'Connect your bicycle sensors',  color: 'text-cyan-400',  bg: 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20',   path: '/my-bike' },
  { icon: ShieldCheck,label: 'Safety Check',  desc: 'Run pre-ride inspection',       color: 'text-green-400', bg: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20', path: '/safety' },
];

const RECENT_RIDES = [
  { name: 'Morning Loop',       date: 'Today, 07:14',  km: '24.3 km', time: '1h 12m', watts: '187W' },
  { name: 'Evening Commute',    date: 'Yesterday',      km: '12.1 km', time: '38m',    watts: '142W' },
  { name: 'Weekend Club Ride',  date: 'Sat 31 May',    km: '67.5 km', time: '3h 04m', watts: '211W' },
];

const ROLE_BANNERS = {
  club_admin: {
    color: 'border-cyan-500/20 bg-cyan-500/5',
    text: 'text-cyan-400',
    label: 'Club Admin',
    message: 'You have 1 open incident and 3 upcoming club events this week.',
    link: '/admin/club', linkLabel: 'Go to Club Dashboard →',
  },
  regional_coordinator: {
    color: 'border-violet-500/20 bg-violet-500/5',
    text: 'text-violet-400',
    label: 'Regional Coordinator',
    message: '2 clubs require compliance attention. Northern Climbers CC is below threshold.',
    link: '/admin/regional', linkLabel: 'View Regional Overview →',
  },
  national_federation_admin: {
    color: 'border-amber-500/20 bg-amber-500/5',
    text: 'text-amber-400',
    label: 'Federation Admin',
    message: 'Q2 compliance submissions are open. 138 affiliated clubs — submission deadline 30 Jun.',
    link: '/admin/federation', linkLabel: 'Go to Federation HQ →',
  },
  international_governing_body: {
    color: 'border-orange-500/20 bg-orange-500/5',
    text: 'text-orange-400',
    label: 'Int. Governing Body',
    message: '2 federations require governance review. UCI World Championships entries are open.',
    link: '/admin/global', linkLabel: 'View Global Overview →',
  },
  super_admin: {
    color: 'border-red-500/30 bg-red-500/5',
    text: 'text-red-400',
    label: 'Super Admin',
    message: '⚡ Telemetry engine showing elevated latency (210ms). Auto-scaling triggered. 48 tenants active.',
    link: '/admin/super', linkLabel: 'Open Platform Control →',
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const { demoMode, data } = useDemo();
  const role = user?.role || 'cyclist';
  const firstName = user?.full_name?.split(' ')[0] || 'Cyclist';
  const roleBanner = ROLE_BANNERS[role];

  const rideData    = demoMode ? data.rideHistory     : STATIC_RIDE_DATA;
  const recentRides = demoMode ? data.recentRides     : STATIC_RECENT_RIDES;
  const summary     = demoMode ? data.todaySummary    : { distance: '24.3', duration: '1:12', avgSpeed: '20.3', calories: '612' };
  // key changes when demoMode flips so data sections re-animate
  const demoKey = demoMode ? 'demo' : 'static';

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const hasRides = recentRides.length > 0;

  return (
    <div className="page-enter">
      <PageHeader
        title={`${greeting}, ${firstName}`}
        subtitle="Here's your CycleFlow overview for today"
        icon={LayoutDashboard}
      />

      {/* Role-specific admin banner */}
      {roleBanner && (
        <div className={`mb-6 p-4 rounded-xl border ${roleBanner.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div className="min-w-0">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${roleBanner.text}`}>{roleBanner.label} Notice</span>
            <p className="text-sm text-foreground mt-1 leading-snug">{roleBanner.message}</p>
          </div>
          <Link to={roleBanner.link}
            className={`text-xs font-semibold ${roleBanner.text} border border-current/30 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors whitespace-nowrap flex-shrink-0`}>
            {roleBanner.linkLabel}
          </Link>
        </div>
      )}

      {/* Today's Ride Summary */}
      <section key={`summary-${demoKey}`} className="mb-8 sm:mb-10 demo-fade">
        <SectionLabel accent="blue" label="Today's Ride Summary"
          right={<span className="text-[11px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" /> Live</span>}
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBlock label="Distance"  value={String(summary.distance)} unit="km"   accent="blue"  trend="up" trendValue="+8% vs yesterday" />
          <StatBlock label="Duration"  value={String(summary.duration)} unit="hr"   accent="cyan" />
          <StatBlock label="Avg Speed" value={String(summary.avgSpeed)} unit="km/h" accent="blue"  trend="up" trendValue="+1.2 km/h" />
          <StatBlock label="Calories"  value={String(summary.calories)} unit="kcal" accent="amber" />
        </div>
      </section>

      {/* Ride History Graph */}
      <section key={`history-${demoKey}`} className="mb-8 sm:mb-10 demo-fade">
        <SectionLabel accent="cyan" label="Ride History" right={<span className="text-sm text-muted-foreground">Last 7 days</span>} />
        <div className="glass-card rounded-xl border border-white/[0.06] p-4 sm:p-5">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={rideData}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} unit=" km" />
              <Tooltip contentStyle={{ background: '#0f1520', border: '1px solid #1e2a3e', borderRadius: 8, color: '#f8fafc' }} cursor={{ stroke: '#3b82f6', strokeWidth: 1 }} />
              <Area type="monotone" dataKey="km" stroke="#3b82f6" strokeWidth={2} fill="url(#blueGrad)" dot={{ fill: '#3b82f6', r: 3 }} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8 sm:mb-10">
        <SectionLabel accent="violet" label="Quick Actions" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map(({ icon: Icon, label, desc, color, bg, path }) => (
            <Link
              key={label}
              to={path}
              aria-label={`${label}: ${desc}`}
              className={`flex items-center gap-4 p-5 rounded-xl border text-left min-h-[72px] ${bg}`}
              style={{ transition: 'background-color 200ms cubic-bezier(0.22,1,0.36,1), border-color 200ms cubic-bezier(0.22,1,0.36,1), transform 200ms cubic-bezier(0.22,1,0.36,1), box-shadow 200ms cubic-bezier(0.22,1,0.36,1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px) scale(1.008)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div className={`p-3 rounded-xl bg-white/5 ${color} flex-shrink-0`}>
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Rides */}
      <section key={`rides-${demoKey}`} className="pb-6 demo-fade">
        <SectionLabel accent="amber" label="Recent Rides" right={<Link to="/routes" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">View all →</Link>} />
        <ErrorBoundary>
          <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
            {hasRides ? (
              <table className="cf-table">
                <thead>
                  <tr>
                    <th className="text-left">Ride</th>
                    <th className="text-left hidden sm:table-cell">Date</th>
                    <th className="text-right">Distance</th>
                    <th className="text-right hidden md:table-cell">Duration</th>
                    <th className="text-right hidden md:table-cell">Avg Power</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRides.map((ride, i) => (
                    <tr key={i} className="cursor-pointer">
                      <td className="font-medium text-foreground">{ride.name}</td>
                      <td className="text-muted-foreground hidden sm:table-cell">{ride.date}</td>
                      <td className="text-right text-blue-400 font-mono font-semibold">{ride.km}</td>
                      <td className="text-right text-muted-foreground hidden md:table-cell">{ride.time}</td>
                      <td className="text-right text-cyan-400 font-mono hidden md:table-cell">{ride.watts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState
                icon={Bike}
                title="No rides yet"
                description="Complete a ride to see your history here."
                accent="blue"
              />
            )}
          </div>
        </ErrorBoundary>
      </section>
    </div>
  );
}