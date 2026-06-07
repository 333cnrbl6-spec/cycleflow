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
  { icon: Play,       label: 'Start Ride',    desc: 'Begin a new ride session',      color: 'text-blue-400',  bg: 'border-blue-500/25',  hoverBg: 'hover:bg-blue-500/10',  path: '/ride' },
  { icon: Bluetooth,  label: 'Pair Bike',     desc: 'Connect your bicycle sensors',  color: 'text-cyan-400',  bg: 'border-cyan-500/25',  hoverBg: 'hover:bg-cyan-500/10',   path: '/my-bike' },
  { icon: ShieldCheck,label: 'Safety Check',  desc: 'Run pre-ride inspection',       color: 'text-green-400', bg: 'border-green-500/25', hoverBg: 'hover:bg-green-500/10',  path: '/safety' },
];

const ROLE_BANNERS = {
  club_admin: {
    color: 'border-cyan-500/25 bg-cyan-500/[0.05]',
    text: 'text-cyan-400',
    label: 'Club Admin',
    message: 'You have 1 open incident and 3 upcoming club events this week.',
    link: '/admin/club', linkLabel: 'Go to Club Dashboard →',
  },
  regional_coordinator: {
    color: 'border-violet-500/25 bg-violet-500/[0.05]',
    text: 'text-violet-400',
    label: 'Regional Coordinator',
    message: '2 clubs require compliance attention. Northern Climbers CC is below threshold.',
    link: '/admin/regional', linkLabel: 'View Regional Overview →',
  },
  national_federation_admin: {
    color: 'border-amber-500/25 bg-amber-500/[0.05]',
    text: 'text-amber-400',
    label: 'Federation Admin',
    message: 'Q2 compliance submissions are open. 138 affiliated clubs — submission deadline 30 Jun.',
    link: '/admin/federation', linkLabel: 'Go to Federation HQ →',
  },
  international_governing_body: {
    color: 'border-orange-500/25 bg-orange-500/[0.05]',
    text: 'text-orange-400',
    label: 'Int. Governing Body',
    message: '2 federations require governance review. UCI World Championships entries are open.',
    link: '/admin/global', linkLabel: 'View Global Overview →',
  },
  super_admin: {
    color: 'border-red-500/30 bg-red-500/[0.05]',
    text: 'text-red-400',
    label: 'Super Admin',
    message: '⚡ Telemetry engine showing elevated latency (210ms). Auto-scaling triggered. 48 tenants active.',
    link: '/admin/super', linkLabel: 'Open Platform Control →',
  },
};

/** Custom chart tooltip */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1524] border border-blue-500/20 rounded-lg px-3 py-2 shadow-xl text-sm">
      <p className="text-muted-foreground text-[11px] mb-0.5 uppercase tracking-wide font-semibold">{label}</p>
      <p className="text-blue-400 font-mono font-bold">{payload[0].value} <span className="text-muted-foreground font-normal text-[11px]">km</span></p>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { demoMode, data } = useDemo();
  const role = user?.role || 'cyclist';
  const firstName = user?.full_name?.split(' ')[0] || 'Cyclist';
  const roleBanner = ROLE_BANNERS[role];

  const rideData    = demoMode ? data.rideHistory  : STATIC_RIDE_DATA;
  const recentRides = demoMode ? data.recentRides  : STATIC_RECENT_RIDES;
  const summary     = demoMode ? data.todaySummary : { distance: '24.3', duration: '1:12', avgSpeed: '20.3', calories: '612' };
  const demoKey = demoMode ? 'demo' : 'static';

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const hasRides = recentRides.length > 0;

  return (
    <div className="page-enter space-y-10 pb-8">

      <PageHeader
        title={`${greeting}, ${firstName}`}
        subtitle="Here's your CycleFlow overview for today"
        icon={LayoutDashboard}
      >
        {demoMode && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" aria-hidden="true" />
            Demo
          </span>
        )}
      </PageHeader>

      {/* Role-specific admin banner */}
      {roleBanner && (
        <div className={`p-4 rounded-xl border ${roleBanner.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div className="min-w-0">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${roleBanner.text}`}>{roleBanner.label} Notice</span>
            <p className="text-sm text-foreground/90 mt-1 leading-snug">{roleBanner.message}</p>
          </div>
          <Link
            to={roleBanner.link}
            className={`text-xs font-semibold ${roleBanner.text} border border-current/30 px-3 py-1.5 rounded-lg hover:bg-white/[0.06] transition-colors whitespace-nowrap flex-shrink-0`}
          >
            {roleBanner.linkLabel}
          </Link>
        </div>
      )}

      {/* ── Today's Ride Summary ───────────────────────────────── */}
      <section key={`summary-${demoKey}`} className="demo-fade">
        <SectionLabel
          accent="blue"
          label="Today's Ride Summary"
          right={
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" aria-hidden="true" />
              Live
            </span>
          }
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBlock
            label="Distance"
            value={String(summary.distance)}
            unit="km"
            secondaryLabel="Total today"
            accent="blue"
            trend="up"
            trendValue="+8% vs yesterday"
          />
          <StatBlock
            label="Duration"
            value={String(summary.duration)}
            unit="hr"
            secondaryLabel="Active ride time"
            accent="cyan"
          />
          <StatBlock
            label="Avg Speed"
            value={String(summary.avgSpeed)}
            unit="km/h"
            secondaryLabel="Moving average"
            accent="blue"
            trend="up"
            trendValue="+1.2 km/h"
          />
          <StatBlock
            label="Calories"
            value={String(summary.calories)}
            unit="kcal"
            secondaryLabel="Energy burned"
            accent="amber"
          />
        </div>
      </section>

      {/* ── Ride History Graph ─────────────────────────────────── */}
      <section key={`history-${demoKey}`} className="demo-fade">
        <SectionLabel
          accent="cyan"
          label="Weekly Distance"
          right={<span className="text-[12px] font-medium text-muted-foreground">Last 7 days</span>}
        />
        <div className="glass-card rounded-xl border border-white/[0.07] p-5 sm:p-6">
          {/* Graph legend */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-3 h-[3px] bg-blue-500 rounded-full" aria-hidden="true" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Distance (km)</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={rideData} margin={{ left: 4, right: 4, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                dy={6}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                unit=" km"
                width={44}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="km"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#blueGrad)"
                dot={{ fill: '#3b82f6', stroke: '#0d1524', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#60a5fa', stroke: '#0d1524', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* ── Quick Actions ──────────────────────────────────────── */}
      <section>
        <SectionLabel accent="violet" label="Quick Actions" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUICK_ACTIONS.map(({ icon: Icon, label, desc, color, bg, hoverBg, path }) => (
            <Link
              key={label}
              to={path}
              aria-label={`${label}: ${desc}`}
              className={`group flex items-center gap-4 p-5 rounded-xl border glass-card ${bg} ${hoverBg} min-h-[80px] text-left`}
              style={{ transition: 'background-color 200ms cubic-bezier(0.22,1,0.36,1), border-color 200ms cubic-bezier(0.22,1,0.36,1), transform 200ms cubic-bezier(0.22,1,0.36,1), box-shadow 200ms cubic-bezier(0.22,1,0.36,1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div className={`p-3 rounded-xl bg-white/[0.06] ${color} flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-foreground leading-tight">{label}</p>
                <p className="text-[13px] text-muted-foreground mt-0.5 leading-snug">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground flex-shrink-0 transition-all duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent Rides ───────────────────────────────────────── */}
      <section key={`rides-${demoKey}`} className="demo-fade">
        <SectionLabel
          accent="amber"
          label="Recent Rides"
          right={
            <Link to="/routes" className="text-[12px] font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              View all →
            </Link>
          }
        />
        <ErrorBoundary>
          <div className="glass-card rounded-xl border border-white/[0.07] overflow-hidden">
            {hasRides ? (
              <table className="cf-table">
                <thead>
                  <tr>
                    <th className="text-left pl-5">Ride</th>
                    <th className="text-left hidden sm:table-cell">Date</th>
                    <th className="text-right hidden md:table-cell">Distance</th>
                    <th className="text-right hidden md:table-cell">Duration</th>
                    <th className="text-right pr-5 hidden md:table-cell">Avg Power</th>
                    {/* Mobile-only combined metric */}
                    <th className="text-right pr-5 md:hidden">km</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRides.map((ride, i) => (
                    <tr
                      key={i}
                      className="cursor-pointer group"
                    >
                      <td className="pl-5 pr-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Bike className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
                          </div>
                          <span className="font-semibold text-foreground/95 text-[14px]">{ride.name}</span>
                        </div>
                      </td>
                      <td className="text-[13px] text-muted-foreground hidden sm:table-cell">{ride.date}</td>
                      <td className="text-right font-mono font-semibold text-blue-400 text-[14px] hidden md:table-cell">{ride.km}</td>
                      <td className="text-right text-[13px] text-muted-foreground hidden md:table-cell">{ride.time}</td>
                      <td className="text-right font-mono text-cyan-400 text-[13px] pr-5 hidden md:table-cell">{ride.watts}</td>
                      {/* Mobile */}
                      <td className="text-right font-mono font-semibold text-blue-400 text-[14px] pr-5 md:hidden">{ride.km}</td>
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