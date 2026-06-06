import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Menu } from 'lucide-react';
import { DemoProvider } from '@/lib/DemoContext';
import DemoBanner from '@/components/demo/DemoBanner';

export default function AppLayout({ user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
        setMobileOpen(false);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <DemoProvider>
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30 md:z-auto h-full transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          user={user}
        />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-border bg-[hsl(var(--sidebar-bg))]/80 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500 flex items-center justify-center glow-blue">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <span className="text-sm font-bold text-foreground tracking-tight">CycleFlow</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-blue-400">{user?.full_name?.[0] || 'U'}</span>
            </div>
          </div>
        </div>

        {/* Desktop top bar */}
        <div className="hidden md:block">
          <TopBar user={user} />
        </div>

        {/* Demo banner */}
        <DemoBanner />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin overscroll-none focus:outline-none" tabIndex={-1}>
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
    </DemoProvider>
  );
}