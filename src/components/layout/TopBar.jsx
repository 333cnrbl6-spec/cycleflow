import { Bell, Search, HelpCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ROUTE_LABELS = {
  '/':                          ['Dashboard', null],
  '/my-bike':                   ['My Bike', null],
  '/routes':                    ['Routes', null],
  '/safety':                    ['Safety', null],
  '/telemetry':                 ['Telemetry', null],
  '/club-hub':                  ['Club Hub', null],
  '/settings':                  ['Settings', null],
  '/admin/club':                ['Club Admin', 'Dashboard'],
  '/admin/club/members':        ['Club Admin', 'Members'],
  '/admin/club/routes':         ['Club Admin', 'Routes'],
  '/admin/club/safety':         ['Club Admin', 'Safety Reports'],
  '/admin/regional':            ['Regional', 'Overview'],
  '/admin/regional/clubs':      ['Regional', 'Clubs'],
  '/admin/regional/compliance': ['Regional', 'Compliance'],
  '/admin/regional/stats':      ['Regional', 'Stats'],
  '/admin/federation':          ['Federation', 'HQ'],
  '/admin/federation/standards':['Federation', 'Standards'],
  '/admin/federation/events':   ['Federation', 'Events'],
  '/admin/federation/reports':  ['Federation', 'Reports'],
  '/admin/global':              ['Int. Governing Body', 'Overview'],
  '/admin/global/compliance':   ['Int. Governing Body', 'Compliance'],
  '/admin/global/events':       ['Int. Governing Body', 'Events'],
  '/admin/global/governance':   ['Int. Governing Body', 'Governance'],
  '/admin/super':               ['Super Admin', 'Platform Control'],
  '/admin/super/tenants':       ['Super Admin', 'Tenants'],
  '/admin/super/integrations':  ['Super Admin', 'Integrations'],
  '/admin/super/analytics':     ['Super Admin', 'Analytics'],
  '/admin/super/settings':      ['Super Admin', 'Settings'],
};

export default function TopBar({ user }) {
  const location = useLocation();
  const [section, sub] = ROUTE_LABELS[location.pathname] || ['CycleFlow', null];

  return (
    <div className="h-14 px-5 flex items-center justify-between border-b border-border bg-[hsl(var(--sidebar-bg))]/50 backdrop-blur-sm flex-shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground font-medium">CycleFlow</span>
        <span className="text-border">/</span>
        <span className="font-semibold text-foreground">{section}</span>
        {sub && (
          <>
            <span className="text-border">/</span>
            <span className="text-blue-400">{sub}</span>
          </>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
        </button>
        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
          <HelpCircle className="w-4 h-4" />
        </button>
        <div className="ml-2 flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
            <span className="text-xs font-bold text-blue-400">{user?.full_name?.[0] || 'U'}</span>
          </div>
          <span className="text-xs font-medium text-foreground hidden sm:block">{user?.full_name || 'Cyclist'}</span>
        </div>
      </div>
    </div>
  );
}