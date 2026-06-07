import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { Menu, X, FlaskConical } from 'lucide-react';
import { DemoProvider, useDemo } from '@/lib/DemoContext';
import DemoBanner from '@/components/demo/DemoBanner';

/* ── Inner layout (needs DemoProvider already in tree) ─────────── */
function InnerLayout({ user }) {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { demoMode, toggleDemo }    = useDemo();

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

  // Close mobile nav on route change
  useEffect(() => { setMobileOpen(false); }, []);

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-20 md:hidden fade-in"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-30 md:z-auto h-full
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}
        role="navigation"
        aria-label="Sidebar navigation"
      >
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
          user={user}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Mobile top bar ───────────────────────────────── */}
        <div className="md:hidden flex items-center justify-between h-14 px-4
                        border-b border-border
                        bg-[hsl(var(--sidebar-bg))]/90 backdrop-blur-md flex-shrink-0"
             role="banner">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-sidebar"
              className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.06]
                         transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                         min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {mobileOpen
                ? <X className="w-5 h-5" aria-hidden="true" />
                : <Menu className="w-5 h-5" aria-hidden="true" />
              }
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center glow-blue" aria-hidden="true">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[15px] font-bold text-foreground tracking-tight">CycleFlow</span>
            </div>
          </div>

          {/* Mobile right controls */}
          <div className="flex items-center gap-1">
            {/* Demo toggle — mobile */}
            <button
              onClick={toggleDemo}
              aria-label={demoMode ? 'Exit Demo Mode' : 'Enable Demo Mode'}
              aria-pressed={demoMode}
              className={`p-2.5 rounded-lg border-2 transition-all duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                demoMode
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <FlaskConical className="w-4 h-4" aria-hidden="true" />
            </button>
            {/* User avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-500/20 border-2 border-blue-500/40
                            flex items-center justify-center ml-1"
                 aria-hidden="true">
              <span className="text-sm font-bold text-blue-400">{user?.full_name?.[0] || 'U'}</span>
            </div>
          </div>
        </div>

        {/* ── Desktop top bar ──────────────────────────────── */}
        <div className="hidden md:block">
          <TopBar user={user} />
        </div>

        {/* Demo active banner */}
        <DemoBanner />

        {/* Skip to content — keyboard accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50
                     focus:px-4 focus:py-2 focus:bg-blue-500 focus:text-white focus:rounded-lg
                     focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto scrollbar-thin overscroll-none"
          tabIndex={-1}
        >
          <div className="min-h-full p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── Exported wrapper (provides DemoContext) ───────────────────── */
export default function AppLayout({ user }) {
  return (
    <DemoProvider>
      <InnerLayout user={user} />
    </DemoProvider>
  );
}