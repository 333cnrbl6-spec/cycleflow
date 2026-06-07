import { Bell, Search, HelpCircle, ChevronRight, FlaskConical } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useDemo } from '@/lib/DemoContext';

const ROUTE_LABELS = {
  '/':                           ['Dashboard',           null],
  '/my-bike':                    ['My Bike',             null],
  '/routes':                     ['Routes',              null],
  '/safety':                     ['Safety',              null],
  '/telemetry':                  ['Telemetry',           null],
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
    <header className="h-14 px-5 flex items-center justify-between gap-4
                       border-b border-border/60
                       bg-[hsl(var(--sidebar-bg))]/70 backdrop-blur-xl
                       flex-shrink-0">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 min-w-0 text-xs">
        <span className="text-muted-foreground/40 font-medium hidden sm:block select-none">
          CycleFlow
        </span>
        <ChevronRight className="w-3 h-3 text-border/70 hidden sm:block flex-shrink-0" />
        <span className="font-semibold text-foreground/90 truncate">{section}</span>
        {sub && (
          <>
            <ChevronRight className="w-3 h-3 text-border/70 flex-shrink-0" />
            <span className="text-blue-400 font-medium truncate">{sub}</span>
          </>
        )}
      </nav>

      {/* ── Right controls ── */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        <button className="btn-icon" title="Search">
          <Search className="w-4 h-4" />
        </button>
        <button className="btn-icon relative" title="Notifications">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full ring-1 ring-background" />
        </button>
        <button className="btn-icon hidden sm:inline-flex" title="Help">
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Demo Mode toggle */}
        <button
          onClick={toggleDemo}
          title={demoMode ? 'Exit Demo Mode' : 'Enable Demo Mode'}
          className={`btn-icon sm:hidden ${demoMode ? 'text-violet-400' : 'text-muted-foreground'}`}
        >
          <FlaskConical className="w-4 h-4" />
        </button>
        <button
          onClick={toggleDemo}
          title={demoMode ? 'Exit Demo Mode' : 'Enable Demo Mode'}
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 h-8 rounded-lg text-[11px] font-semibold border transition-all duration-150 ${
            demoMode
              ? 'bg-violet-500/20 border-violet-500/40 text-violet-300 hover:bg-violet-500/30'
              : 'bg-transparent border-border text-muted-foreground hover:text-foreground hover:border-white/25 hover:bg-white/5'
          }`}
        >
          <FlaskConical className="w-3 h-3 flex-shrink-0" />
          Demo
        </button>

        {/* User avatar + name */}
        <div className="ml-2 flex items-center gap-2 pl-3 border-l border-border/60">
          <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30
                          flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-blue-400">
              {user?.full_name?.[0] || 'U'}
            </span>
          </div>
          <Link
            to="/settings"
            className="text-xs font-medium text-foreground/80 hover:text-blue-400
                       transition-colors hidden sm:block truncate max-w-[7rem]"
          >
            {user?.full_name || 'Cyclist'}
          </Link>
        </div>
      </div>
    </header>
  );
}