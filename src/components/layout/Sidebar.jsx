import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Bike, Map, Shield, Activity, Users, Settings,
  ChevronLeft, ChevronRight, Menu, X, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Bike, label: 'My Bike', path: '/my-bike' },
  { icon: Map, label: 'Routes', path: '/routes' },
  { icon: Shield, label: 'Safety', path: '/safety' },
  { icon: Activity, label: 'Telemetry', path: '/telemetry' },
  { icon: Users, label: 'Club Hub', path: '/club-hub' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const ROLE_LABELS = {
  cyclist: 'Cyclist',
  club_admin: 'Club Admin',
  regional_coordinator: 'Regional Coordinator',
  national_federation_admin: 'Federation Admin',
  international_governing_body: 'Int. Governing Body',
  super_admin: 'Super Admin',
};

const ROLE_COLORS = {
  cyclist: 'text-blue-400 bg-blue-500/10',
  club_admin: 'text-cyan-400 bg-cyan-500/10',
  regional_coordinator: 'text-violet-400 bg-violet-500/10',
  national_federation_admin: 'text-amber-400 bg-amber-500/10',
  international_governing_body: 'text-orange-400 bg-orange-500/10',
  super_admin: 'text-red-400 bg-red-500/10',
};

export default function Sidebar({ collapsed, onToggle, user }) {
  const location = useLocation();
  const role = user?.role || 'cyclist';

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-full transition-all duration-300 ease-in-out',
        'bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-[hsl(var(--sidebar-border))] flex-shrink-0',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center glow-blue">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">CycleFlow</p>
              <p className="text-[10px] text-blue-400/70 leading-none mt-0.5">SynergyFlow</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center glow-blue">
            <Zap className="w-4 h-4 text-white" />
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            'p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors',
            collapsed && 'hidden'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {collapsed && (
          <button
            onClick={onToggle}
            className="w-full flex justify-center mb-4 p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <ul className="space-y-0.5 px-2">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
            <li key={path}>
              <Link
                to={path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150',
                  'hover:bg-white/5 hover:text-foreground',
                  isActive(path)
                    ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500 rounded-l-none pl-[10px]'
                    : 'text-muted-foreground border-l-2 border-transparent',
                  collapsed && 'justify-center px-0 border-l-0 rounded-md'
                )}
                title={collapsed ? label : undefined}
              >
                <Icon className={cn('flex-shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
                {!collapsed && <span>{label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Footer */}
      <div className={cn(
        'border-t border-[hsl(var(--sidebar-border))] p-3 flex-shrink-0',
        collapsed ? 'flex justify-center' : ''
      )}>
        {collapsed ? (
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-blue-400">
              {user?.full_name?.[0] || 'U'}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-blue-400">
                {user?.full_name?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {user?.full_name || 'Cyclist'}
              </p>
              <span className={cn(
                'inline-block text-[10px] font-medium px-1.5 py-0.5 rounded mt-0.5',
                ROLE_COLORS[role]
              )}>
                {ROLE_LABELS[role]}
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}