import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Bike, Map, Shield, Activity, Users, Settings,
  ChevronLeft, ChevronRight, Zap, Building2, Globe, Globe2,
  ShieldCheck, Layers, ChevronDown, Dumbbell, BarChart2, Navigation
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CYCLIST_NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Navigation,      label: 'Ride',      path: '/ride' },
  { icon: Bike,            label: 'My Bike',   path: '/my-bike' },
  { icon: Map,             label: 'Routes',    path: '/routes' },
  { icon: Shield,          label: 'Safety',    path: '/safety' },
  { icon: Activity,        label: 'Telemetry', path: '/telemetry' },
  { icon: Dumbbell,        label: 'Training',  path: '/training' },
  { icon: BarChart2,       label: 'Handicap',  path: '/handicap' },
  { icon: Users,           label: 'Club Hub',  path: '/club-hub' },
  { icon: Settings,        label: 'Settings',  path: '/settings' },
];

const ADMIN_SECTIONS = {
  club_admin: {
    label: 'Club Admin', color: 'text-cyan-400',
    items: [
      { icon: Building2,  label: 'Club Dashboard',  path: '/admin/club' },
      { icon: Users,      label: 'Manage Members',   path: '/admin/club/members' },
      { icon: Map,        label: 'Club Routes',      path: '/admin/club/routes' },
      { icon: Shield,     label: 'Safety Reports',   path: '/admin/club/safety' },
      { icon: Activity,   label: 'Club Telemetry',   path: '/admin/telemetry' },
    ],
  },
  regional_coordinator: {
    label: 'Regional Admin', color: 'text-violet-400',
    items: [
      { icon: Layers,      label: 'Regional Overview',  path: '/admin/regional' },
      { icon: Building2,   label: 'Manage Clubs',       path: '/admin/regional/clubs' },
      { icon: ShieldCheck, label: 'Compliance',          path: '/admin/regional/compliance' },
      { icon: Activity,    label: 'Aggregated Stats',    path: '/admin/regional/stats' },
      { icon: Activity,    label: 'Regional Telemetry',  path: '/admin/telemetry' },
    ],
  },
  national_federation_admin: {
    label: 'Federation Admin', color: 'text-amber-400',
    items: [
      { icon: Globe,       label: 'Federation HQ',    path: '/admin/federation' },
      { icon: ShieldCheck, label: 'Safety Standards',  path: '/admin/federation/standards' },
      { icon: Activity,    label: 'National Events',   path: '/admin/federation/events' },
      { icon: Layers,      label: 'Reporting',         path: '/admin/federation/reports' },
    ],
  },
  international_governing_body: {
    label: 'Int. Governing Body', color: 'text-orange-400',
    items: [
      { icon: Globe2,      label: 'Global Overview',   path: '/admin/global' },
      { icon: Globe,       label: 'Int. Compliance',   path: '/admin/global/compliance' },
      { icon: Activity,    label: 'Int. Events',       path: '/admin/global/events' },
      { icon: ShieldCheck, label: 'Data Governance',   path: '/admin/global/governance' },
    ],
  },
  super_admin: {
    label: 'Super Admin', color: 'text-red-400',
    items: [
      { icon: ShieldCheck, label: 'Platform Control',   path: '/admin/super' },
      { icon: Building2,   label: 'Tenant Management',  path: '/admin/super/tenants' },
      { icon: Layers,      label: 'Integrations',       path: '/admin/super/integrations' },
      { icon: Activity,    label: 'Platform Analytics', path: '/admin/super/analytics' },
      { icon: Settings,    label: 'Global Settings',    path: '/admin/super/settings' },
    ],
  },
};

const ROLE_META = {
  cyclist:                     { label: 'Cyclist',              color: 'text-blue-400 bg-blue-500/15' },
  club_admin:                  { label: 'Club Admin',           color: 'text-cyan-400 bg-cyan-500/15' },
  regional_coordinator:        { label: 'Regional Coord.',      color: 'text-violet-400 bg-violet-500/15' },
  national_federation_admin:   { label: 'Federation Admin',     color: 'text-amber-400 bg-amber-500/15' },
  international_governing_body:{ label: 'Int. Governing Body',  color: 'text-orange-400 bg-orange-500/15' },
  super_admin:                 { label: 'Super Admin',          color: 'text-red-400 bg-red-500/15' },
};

/* ── Individual nav link ───────────────────────────────────────── */
function NavItem({ icon: Icon, label, path, collapsed, isActive }) {
  return (
    <Link
      to={path}
      aria-label={collapsed ? label : undefined}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium',
        'transition-all duration-150 group relative outline-none',
        'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:ring-offset-[hsl(var(--sidebar-bg))]',
        'hover:bg-white/[0.06] hover:text-foreground',
        isActive
          ? 'bg-blue-500/12 text-blue-400 border-l-2 border-blue-500 rounded-l-none pl-[10px] font-semibold'
          : 'text-muted-foreground border-l-2 border-transparent',
        collapsed && 'justify-center px-0 border-l-0 rounded-lg pl-0 w-11 h-11 mx-auto'
      )}
    >
      <Icon
        className={cn(
          'flex-shrink-0 transition-colors',
          collapsed ? 'w-5 h-5' : 'w-4 h-4',
          isActive ? 'text-blue-400' : 'text-muted-foreground group-hover:text-foreground'
        )}
        aria-hidden="true"
      />
      {!collapsed && <span className="truncate">{label}</span>}

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <span
          role="tooltip"
          className="absolute left-full ml-3 px-3 py-1.5 bg-card border border-border rounded-lg
                     text-sm text-foreground whitespace-nowrap shadow-lg
                     opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity duration-150"
        >
          {label}
        </span>
      )}
    </Link>
  );
}

/* ── Admin section group ───────────────────────────────────────── */
function AdminSection({ section, collapsed, isActive }) {
  const [open, setOpen] = useState(true);

  if (collapsed) {
    return (
      <div className="mt-2 space-y-1 px-2">
        {section.items.map(item => (
          <NavItem key={item.path} {...item} collapsed={true} isActive={isActive(item.path)} />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-5">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className={cn(
          'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
          'text-xs font-bold uppercase tracking-widest',
          'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]',
          'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          'min-h-[36px]'
        )}
      >
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', section.color.replace('text-', 'bg-'))} />
          <span className={cn('truncate', section.color)}>{section.label}</span>
        </div>
        <ChevronDown
          className={cn('w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200', !open && '-rotate-90')}
          aria-hidden="true"
        />
      </button>
      {open && (
        <ul className="mt-1 space-y-0.5 px-2" role="list">
          {section.items.map(item => (
            <li key={item.path}>
              <NavItem {...item} collapsed={false} isActive={isActive(item.path)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Main sidebar ──────────────────────────────────────────────── */
export default function Sidebar({ collapsed, onToggle, user }) {
  const location = useLocation();
  const role = user?.role || 'cyclist';
  const meta = ROLE_META[role] || ROLE_META.cyclist;
  const adminSection = ADMIN_SECTIONS[role];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      aria-label="Main navigation"
      className={cn(
        'flex flex-col h-full transition-all duration-300 ease-in-out select-none',
        'bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* ── Logo Header ─────────────────────────────────────── */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-[hsl(var(--sidebar-border))] flex-shrink-0',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center glow-blue flex-shrink-0"
              aria-hidden="true"
            >
              <Zap className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-bold text-white leading-none tracking-tight">CycleFlow</p>
              <p className="text-[10px] text-blue-400/70 leading-none mt-0.5 tracking-widest uppercase">Performance Platform</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div
            className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center glow-blue"
            aria-hidden="true"
          >
            <Zap className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.06]
                       transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                       min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ── Navigation ──────────────────────────────────────── */}
      <nav
        aria-label="App navigation"
        className="flex-1 py-3 overflow-y-auto overflow-x-hidden scrollbar-none"
      >
        {collapsed && (
          <button
            onClick={onToggle}
            aria-label="Expand sidebar"
            className="w-full flex justify-center mb-3 p-2.5 text-muted-foreground hover:text-foreground
                       hover:bg-white/[0.06] transition-colors
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                       min-h-[44px] items-center"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        )}

        {/* Personal section heading */}
        {!collapsed && (
          <p className="px-5 mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50"
             aria-hidden="true">
            Personal
          </p>
        )}

        <ul className="space-y-0.5 px-2" role="list">
          {CYCLIST_NAV.map(item => (
            <li key={item.path}>
              <NavItem {...item} collapsed={collapsed} isActive={isActive(item.path)} />
            </li>
          ))}
        </ul>

        {/* Admin section */}
        {adminSection && (
          <>
            <div className={cn('border-t border-[hsl(var(--sidebar-border))]', collapsed ? 'mx-3 my-3' : 'mx-4 my-4')} />
            <AdminSection section={adminSection} collapsed={collapsed} isActive={isActive} />
          </>
        )}
      </nav>

      {/* ── User Footer ─────────────────────────────────────── */}
      <div className={cn(
        'border-t border-[hsl(var(--sidebar-border))] p-3 flex-shrink-0',
        collapsed && 'flex justify-center'
      )}>
        {collapsed ? (
          <div
            title={user?.full_name || 'Cyclist'}
            className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30
                       flex items-center justify-center"
          >
            <span className="text-xs font-bold text-blue-400" aria-hidden="true">
              {user?.full_name?.[0] || 'U'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30
                            flex items-center justify-center flex-shrink-0"
                 aria-hidden="true">
              <span className="text-sm font-bold text-blue-400">
                {user?.full_name?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.full_name || 'Cyclist'}
              </p>
              <span className={cn(
                'inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-0.5',
                meta.color
              )}>
                {meta.label}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}