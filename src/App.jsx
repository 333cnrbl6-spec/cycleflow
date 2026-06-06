import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from '@/components/layout/AppLayout';

// Core pages
import Dashboard from '@/pages/Dashboard';
import MyBike from '@/pages/MyBike';
import RoutesPage from '@/pages/Routes';
import Safety from '@/pages/Safety';
import Telemetry from '@/pages/Telemetry';
import ClubHub from '@/pages/ClubHub';
import SettingsPage from '@/pages/Settings';

// Admin pages
import ClubAdmin from '@/pages/admin/ClubAdmin';
import RegionalCoordinator from '@/pages/admin/RegionalCoordinator';
import FederationAdmin from '@/pages/admin/FederationAdmin';
import InternationalBody from '@/pages/admin/InternationalBody';
import SuperAdmin from '@/pages/admin/SuperAdmin';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, user } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-xs text-muted-foreground tracking-widest uppercase">Loading CycleFlow</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <Routes>
      <Route element={<AppLayout user={user} />}>
        {/* Cyclist screens */}
        <Route path="/"           element={<Dashboard />} />
        <Route path="/my-bike"    element={<MyBike />} />
        <Route path="/routes"     element={<RoutesPage />} />
        <Route path="/safety"     element={<Safety />} />
        <Route path="/telemetry"  element={<Telemetry />} />
        <Route path="/club-hub"   element={<ClubHub />} />
        <Route path="/settings"   element={<SettingsPage />} />

        {/* Club Admin */}
        <Route path="/admin/club"          element={<ClubAdmin />} />
        <Route path="/admin/club/members"  element={<ClubAdmin />} />
        <Route path="/admin/club/routes"   element={<ClubAdmin />} />
        <Route path="/admin/club/safety"   element={<ClubAdmin />} />

        {/* Regional Coordinator */}
        <Route path="/admin/regional"             element={<RegionalCoordinator />} />
        <Route path="/admin/regional/clubs"       element={<RegionalCoordinator />} />
        <Route path="/admin/regional/compliance"  element={<RegionalCoordinator />} />
        <Route path="/admin/regional/stats"       element={<RegionalCoordinator />} />

        {/* Federation Admin */}
        <Route path="/admin/federation"            element={<FederationAdmin />} />
        <Route path="/admin/federation/standards"  element={<FederationAdmin />} />
        <Route path="/admin/federation/events"     element={<FederationAdmin />} />
        <Route path="/admin/federation/reports"    element={<FederationAdmin />} />

        {/* International Governing Body */}
        <Route path="/admin/global"            element={<InternationalBody />} />
        <Route path="/admin/global/compliance" element={<InternationalBody />} />
        <Route path="/admin/global/events"     element={<InternationalBody />} />
        <Route path="/admin/global/governance" element={<InternationalBody />} />

        {/* Super Admin */}
        <Route path="/admin/super"                element={<SuperAdmin />} />
        <Route path="/admin/super/tenants"        element={<SuperAdmin />} />
        <Route path="/admin/super/integrations"   element={<SuperAdmin />} />
        <Route path="/admin/super/analytics"      element={<SuperAdmin />} />
        <Route path="/admin/super/settings"       element={<SuperAdmin />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;