import { useState } from 'react';
import { Settings, User, SlidersHorizontal, Smartphone, Lock, Palette, ChevronRight, Sun, Moon, Globe, WifiOff, RefreshCw, Upload } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import { OfflineModeTab, DeviceSyncTab, RideImportExportTab } from '@/components/settings/OfflineDeviceSync';

const TABS = [
  { id: 'profile',  label: 'Profile',           icon: User },
  { id: 'units',    label: 'Units',             icon: SlidersHorizontal },
  { id: 'devices',  label: 'Device Sync',       icon: RefreshCw },
  { id: 'offline',  label: 'Offline Mode',      icon: WifiOff },
  { id: 'import',   label: 'Import / Export',   icon: Upload },
  { id: 'privacy',  label: 'Data & Privacy',    icon: Lock },
  { id: 'theme',    label: 'App Theme',         icon: Palette },
];

const ROLE_LABELS = {
  cyclist: 'Cyclist',
  club_admin: 'Club Admin',
  regional_coordinator: 'Regional Coordinator',
  national_federation_admin: 'Federation Admin',
  international_governing_body: 'Int. Governing Body',
  super_admin: 'Super Admin',
};

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-white/10'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState('profile');
  const [units, setUnits] = useState('metric');
  const [theme, setTheme] = useState('dark');
  const [privacyToggles, setPrivacyToggles] = useState({
    shareActivity: true,
    locationTracking: true,
    analyticsData: false,
    thirdParty: false,
  });

  const togglePrivacy = (key) => setPrivacyToggles(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="p-6 page-enter">
      <PageHeader title="Settings" subtitle="Manage your profile, preferences, and app configuration" icon={Settings} iconColor="text-slate-400" />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlaceholderCard title="Personal Information" description="Your profile and identity details" icon={User} accent="blue">
            <div className="mt-4 flex items-center gap-4 mb-5 p-3 rounded-lg bg-white/5">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-blue-400">J</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Jamie Ford</p>
                <p className="text-xs text-muted-foreground">jamie.ford@example.com</p>
                <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full mt-1 inline-block">Cyclist</span>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Full Name', value: 'Jamie Ford', type: 'text' },
                { label: 'Email', value: 'jamie.ford@example.com', type: 'email' },
                { label: 'Club', value: 'City Cycling Club', type: 'text' },
                { label: 'Country', value: 'United Kingdom', type: 'text' },
              ].map(field => (
                <div key={field.label}>
                  <label className="text-xs text-muted-foreground block mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full bg-white/5 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              ))}
              <button className="w-full mt-2 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          </PlaceholderCard>

          <PlaceholderCard title="Role & Organisation" description="Your access level and organisational affiliation" icon={Globe} accent="violet">
            <div className="mt-4 space-y-3">
              {[
                { label: 'Current Role', value: 'Cyclist' },
                { label: 'Organisation', value: 'City Cycling Club' },
                { label: 'Region', value: 'South East England' },
                { label: 'Federation', value: 'British Cycling' },
                { label: 'Member Since', value: 'August 2024' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center border-b border-border/30 pb-2.5 last:border-0">
                  <span className="text-xs text-muted-foreground">{label}</span>
                  <span className="text-sm font-medium text-foreground">{value}</span>
                </div>
              ))}
              <div className="mt-3 p-3 rounded-lg bg-violet-500/5 border border-violet-500/20">
                <p className="text-xs text-violet-400">Role upgrades require approval from your Club Admin or Regional Coordinator.</p>
              </div>
            </div>
          </PlaceholderCard>
        </div>
      )}

      {tab === 'units' && (
        <div className="max-w-lg space-y-4">
          <PlaceholderCard title="Measurement Units" description="Choose your preferred unit system" icon={SlidersHorizontal} accent="cyan">
            <div className="mt-4 grid grid-cols-2 gap-3">
              {['metric', 'imperial'].map(u => (
                <button
                  key={u}
                  onClick={() => setUnits(u)}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    units === u ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <p className="text-sm font-semibold text-foreground capitalize">{u}</p>
                  <p className="text-xs text-muted-foreground mt-1">{u === 'metric' ? 'km, kg, bar' : 'miles, lbs, psi'}</p>
                </button>
              ))}
            </div>
          </PlaceholderCard>
          <PlaceholderCard title="Display Preferences" description="Customise how data appears across the app" icon={SlidersHorizontal} accent="blue">
            <div className="mt-3">
              <Toggle label="Show Speed in Real-Time" description="Display live speed on active rides" checked={true} onChange={() => {}} />
              <Toggle label="Show Power Zones" description="Colour-code power output by zone" checked={true} onChange={() => {}} />
              <Toggle label="Auto-Pause on Stoppage" description="Pause ride timer when stopped" checked={false} onChange={() => {}} />
              <Toggle label="24-Hour Clock" checked={true} onChange={() => {}} />
            </div>
          </PlaceholderCard>
        </div>
      )}

      {tab === 'devices' && <DeviceSyncTab />}
      {tab === 'offline' && <OfflineModeTab />}
      {tab === 'import'  && <RideImportExportTab />}

      {tab === 'privacy' && (
        <div className="max-w-lg space-y-4">
          <PlaceholderCard title="Data & Privacy" description="Control how your data is collected and shared" icon={Lock} accent="blue">
            <div className="mt-3">
              <Toggle
                label="Share Activity with Club"
                description="Club members can see your rides and stats"
                checked={privacyToggles.shareActivity}
                onChange={() => togglePrivacy('shareActivity')}
              />
              <Toggle
                label="Location Tracking"
                description="Enable GPS-based route and ride tracking"
                checked={privacyToggles.locationTracking}
                onChange={() => togglePrivacy('locationTracking')}
              />
              <Toggle
                label="Analytics Data"
                description="Send anonymous usage data to improve the app"
                checked={privacyToggles.analyticsData}
                onChange={() => togglePrivacy('analyticsData')}
              />
              <Toggle
                label="Third-Party Integrations"
                description="Allow data sharing with partner services"
                checked={privacyToggles.thirdParty}
                onChange={() => togglePrivacy('thirdParty')}
              />
            </div>
          </PlaceholderCard>
          <div className="glass-card rounded-lg border border-white/5 p-4">
            <p className="text-xs text-muted-foreground mb-3">Data rights under GDPR / international data protection law</p>
            <div className="space-y-2">
              {['Download My Data', 'Request Data Deletion', 'View Privacy Policy', 'Contact Data Protection Officer'].map(action => (
                <button key={action} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                  {action}
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'theme' && (
        <div className="max-w-sm space-y-4">
          <PlaceholderCard title="App Theme" description="Choose your preferred visual theme" icon={Palette} accent="violet">
            <div className="mt-4 space-y-3">
              {[
                { id: 'dark', label: 'Dark', desc: 'SynergyFlow enterprise dark — default', icon: Moon },
                { id: 'light', label: 'Light', desc: 'Light mode (coming soon)', icon: Sun, disabled: true },
              ].map(({ id, label, desc, icon: ThemeIcon, disabled }) => (
                <button
                  key={id}
                  disabled={disabled}
                  onClick={() => !disabled && setTheme(id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border text-left transition-all ${
                    theme === id ? 'border-blue-500/50 bg-blue-500/10' :
                    disabled ? 'border-white/5 opacity-40 cursor-not-allowed' :
                    'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${theme === id ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-muted-foreground'}`}>
                    <ThemeIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  {theme === id && <span className="ml-auto text-xs text-blue-400">Active</span>}
                  {disabled && <span className="ml-auto text-xs text-muted-foreground">Soon</span>}
                </button>
              ))}
            </div>
          </PlaceholderCard>
          <div className="glass-card rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
            <p className="text-xs text-blue-400">CycleFlow is part of the SynergyFlow ecosystem. Theme changes will synchronise across all connected SynergyFlow apps in a future release.</p>
          </div>
        </div>
      )}
    </div>
  );
}