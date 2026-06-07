import { Bell, Search, HelpCircle, ChevronRight, FlaskConical } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useDemo } from '@/lib/DemoContext';

const ROUTE_LABELS = {
  '/':                           ['Dashboard',           null],
  '/ride':                       ['Ride',                null],
  '/my-bike':                    ['My Bike',             null],
  '/routes':                     ['Routes',              null],
  '/safety':                     ['Safety',              null],
  '/telemetry':                  ['Telemetry',           null],
  '/training':                   ['Training',            null],
  '/handicap':                   ['Handicap',            null],
  '/club-hub':                   ['Club Hub',            null],
  '/settings':                   ['Settings',            null],
  '/admin/telemetry':            ['Admin',               'Telemetry'],
  '/admin/club':                 ['Club Admin',          'Dashboard'],
  '/admin/club/members':         ['Club Admin',          'Members'],
  '/admin/club/routes':          ['Club Admin',          'Routes'],
  '/admin/club/safety':          ['Club Admin',          'Safety Reports'],
  '/admin/regional':             ['Regional',            'Overview'],
  '/admin/regional/clubs':       ['Regional',            'Clubs'],
  '/admin/regional/compliance':  ['Regional',            'Compliance'],
  '/admin/regional/stats':       ['Regional',            'Stats'],
  '/admin/federation':           ['Federation',          'HQ'],
  '/admin/federation/standards': ['Federation',          'Standards'],
  '/admin/federation/events':    ['Federation',          'Events'],
  '/admin/federation/reports':   ['Federation',          'Reports'],
  '/admin/global':               ['Int. Governing Body', 'Overview'],
  '/admin/global/compliance':    ['Int. Governing Body', 'Compliance'],
  '/admin/global/events':        ['Int. Governing Body', 'Events'],
  '/admin/global/governance':    ['Int. Governing Body', 'Governance'],
  '/admin/super':                ['Super Admin',         'Platform'],
  '/admin/super/tenants':        ['Super Admin',         'Tenants'],
  '/admin/super/integrations':   ['Super Admin',         'Integrations'],
  '/admin/super/analytics':      ['Super Admin',         'Analytics'],
  '/admin/super/settings':       ['Super Admin',         'Settings'],
};

export default function TopBar({ user }) {
  const location = useLocation();
  const [section, sub] = ROUTE_LABELS[location.pathname] || ['CycleFlow', null];
  const { demoMode, toggleDemo } = useDemo();

  return (
    <header
      className="h-14 px-5 flex items-center justify-between gap-4
                 border-b border-border
                 bg-[hsl(var(--sidebar-bg))]/80 backdrop-blur-xl
                 flex-shrink-0"
      role="banner"
    >
      {/* ── Breadcrumb ─────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0">
        <span className="text-sm text-muted-foreground/60 font-medium hidden sm:block select-none">
          CycleFlow
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-border hidden sm:block flex-shrink-0" aria-hidden="true" />
        <span className="text-sm font-semibold text-foreground/90 truncate">{section}</span>
        {sub && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-border flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-blue-400 font-medium truncate">{sub}</span>
          </>
        )}
      </nav>

      {/* ── Right controls ─────────────────────────────────── */}
      <div className="flex items-center gap-1 flex-shrink-0" role="toolbar" aria-label="Global controls">
        <button className="btn-icon" title="Search" aria-label="Search">
          <Search className="w-4 h-4" aria-hidden="true" />
        </button>
        <button className="btn-icon relative" title="Notifications" aria-label="Notifications">
          <Bell className="w-4 h-4" aria-hidden="true" />
          <span
            className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-[hsl(var(--sidebar-bg))]"
            aria-label="You have notifications"
          />
        </button>
        <button className="btn-icon hidden sm:inline-flex" title="Help" aria-label="Help and documentation">
          <HelpCircle className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Demo Mode — icon only on mobile */}
        <button
          onClick={toggleDemo}
          aria-label={demoMode ? 'Exit Demo Mode' : 'Enable Demo Mode — explore with sample data'}
          aria-pressed={demoMode}
          title="Demo Mode: explore the app with sample data"
          className={`sm:hidden btn-icon border-2 transition-all duration-150 ${
            demoMode
              ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FlaskConical className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Demo Mode — labelled on desktop */}
        <button
          onClick={toggleDemo}
          aria-label={demoMode ? 'Exit Demo Mode' : 'Enable Demo Mode'}
          aria-pressed={demoMode}
          title="Demo Mode: explore the app with sample data"
          className={`hidden sm:inline-flex items-center gap-2 px-3 min-h-[40px] rounded-lg
                      text-[13px] font-semibold border-2 transition-all duration-150
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            demoMode
              ? 'bg-violet-500/20 border-violet-500/50 text-violet-300 hover:bg-violet-500/25'
              : 'bg-transparent border-border/70 text-muted-foreground hover:text-foreground hover:border-white/30 hover:bg-white/[0.05]'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>Demo</span>
          {demoMode && (
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" aria-hidden="true" />
          )}
        </button>

        {/* User avatar */}
        <div className="ml-1 flex items-center gap-2.5 pl-3 border-l border-border/60">
          <div
            className="w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-500/40
                       flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <span className="text-[11px] font-bold text-blue-400">
              {user?.full_name?.[0] || 'U'}
            </span>
          </div>
          <Link
            to="/settings"
            className="text-sm font-medium text-foreground/80 hover:text-blue-400
                       transition-colors hidden sm:block truncate max-w-[8rem]
                       focus-visible:outline-none focus-visible:underline"
            aria-label={`Account settings for ${user?.full_name || 'Cyclist'}`}
          >
            {user?.full_name || 'Cyclist'}
          </Link>
        </div>
      </div>
    </header>
  );
}