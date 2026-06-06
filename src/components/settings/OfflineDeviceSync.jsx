import { useState } from 'react';
import { WifiOff, RefreshCw, Upload, Download, Smartphone, CheckCircle, Clock, AlertCircle, HardDrive, FolderOpen, FileText, Zap } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import PlaceholderCard from '@/components/ui/PlaceholderCard';

// ── Offline Mode Tab ───────────────────────────────────────────────────────────

export function OfflineModeTab() {
  const [offlineEnabled, setOfflineEnabled] = useState(true);
  const [cacheRoutes, setCacheRoutes] = useState(true);
  const [cacheMaps, setCacheMaps]     = useState(false);

  const CACHED = [
    { name: 'Sunday Club Ride',      size: '14.2 MB', date: '05 Jun' },
    { name: 'Thames Path Route',     size: '8.7 MB',  date: '01 Jun' },
    { name: 'Box Hill Segment',      size: '3.1 MB',  date: '28 May' },
  ];

  return (
    <div className="space-y-5">
      <SectionLabel accent="blue" label="Offline Mode" />

      {/* Status banner */}
      <div className={`flex items-center gap-3 p-4 rounded-xl border ${offlineEnabled ? 'border-blue-500/20 bg-blue-500/[0.05]' : 'border-white/[0.06] bg-white/[0.02]'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${offlineEnabled ? 'bg-blue-500/20' : 'bg-white/5'}`}>
          <WifiOff className={`w-5 h-5 ${offlineEnabled ? 'text-blue-400' : 'text-muted-foreground'}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">Offline Mode</p>
          <p className="text-xs text-muted-foreground mt-0.5">Cache routes, maps, and plans for use without connectivity</p>
        </div>
        <button
          onClick={() => setOfflineEnabled(p => !p)}
          className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${offlineEnabled ? 'bg-blue-500' : 'bg-white/10'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${offlineEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      </div>

      {/* Cache settings */}
      <PlaceholderCard title="Cache Settings" description="Choose what gets stored offline" icon={HardDrive} accent="blue">
        <div className="mt-3 space-y-0">
          {[
            { label: 'Cache Route Data',       desc: 'GPX, elevation, and segment data for saved routes', val: cacheRoutes, set: setCacheRoutes },
            { label: 'Cache Map Tiles',         desc: 'Download map tiles for your local area (uses ~120 MB)', val: cacheMaps,   set: setCacheMaps },
          ].map(({ label, desc, val, set }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <button onClick={() => set(p => !p)} className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ml-4 ${val ? 'bg-blue-500' : 'bg-white/10'}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${val ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground p-3 rounded-lg bg-white/5">
          <span>Cache used: <span className="text-foreground font-mono">26.0 MB</span></span>
          <button className="text-red-400 hover:text-red-300 transition-colors">Clear Cache</button>
        </div>
      </PlaceholderCard>

      {/* Cached routes */}
      <SectionLabel accent="cyan" label="Cached Content" />
      <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
        {CACHED.map((c, i) => (
          <div key={i} className="px-4 py-3 border-b border-border/20 last:border-0 flex items-center gap-3">
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{c.name}</p>
              <p className="text-[10px] text-muted-foreground">{c.size} · Cached {c.date}</p>
            </div>
            <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl border border-dashed border-blue-500/20 text-center">
        <p className="text-xs text-muted-foreground">Service Worker offline caching, background sync queue, and conflict resolution — PWA integration hook ready.</p>
      </div>
    </div>
  );
}

// ── Device Sync Tab ────────────────────────────────────────────────────────────

export function DeviceSyncTab() {
  const DEVICES = [
    { name: 'Garmin Edge 1040',    proto: 'USB / WiFi', status: 'synced',   last: '05 Jun 18:42', icon: '🖥️' },
    { name: 'Wahoo ELEMNT Bolt',   proto: 'WiFi',       status: 'pending',  last: '03 Jun 09:15', icon: '📡' },
    { name: 'KICKR Smart Trainer', proto: 'Bluetooth',  status: 'synced',   last: '01 Jun 20:00', icon: '⚡' },
    { name: 'Apple Watch Ultra',   proto: 'Bluetooth',  status: 'error',    last: '28 May 07:30', icon: '⌚' },
  ];

  const STATUS = {
    synced:  { label: 'Synced',  badge: 'bg-green-500/10 text-green-400',  icon: CheckCircle },
    pending: { label: 'Pending', badge: 'bg-amber-500/10 text-amber-400',  icon: Clock },
    error:   { label: 'Error',   badge: 'bg-red-500/10   text-red-400',    icon: AlertCircle },
  };

  return (
    <div className="space-y-5">
      <SectionLabel accent="violet" label="Device Sync" />

      <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
        <div className="px-4 py-3 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Paired Devices</span>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors">
            <Smartphone className="w-3 h-3" /> Pair New Device
          </button>
        </div>
        {DEVICES.map((d, i) => {
          const s = STATUS[d.status];
          const SIcon = s.icon;
          return (
            <div key={i} className="px-4 py-3.5 border-b border-border/20 last:border-0 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
              <span className="text-lg flex-shrink-0">{d.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{d.name}</p>
                <p className="text-[10px] text-muted-foreground">{d.proto} · Last sync {d.last}</p>
              </div>
              <span className={`badge flex-shrink-0 ${s.badge}`}>
                <SIcon className="w-2.5 h-2.5" /> {s.label}
              </span>
              <button className="btn-icon flex-shrink-0"><RefreshCw className="w-3.5 h-3.5" /></button>
            </div>
          );
        })}
      </div>

      {/* Sync settings */}
      <PlaceholderCard title="Sync Configuration" description="Control when and how data syncs to your devices" icon={RefreshCw} accent="violet">
        <div className="mt-3 space-y-2">
          {[
            { label: 'Auto-sync on WiFi',          desc: 'Push new workouts automatically when on WiFi' },
            { label: 'Sync on App Open',            desc: 'Pull latest device data each time you open CycleFlow' },
            { label: 'Background Sync',             desc: 'Keep devices updated in the background' },
            { label: 'Sync Training Plans',         desc: 'Push structured workouts to Garmin / Wahoo' },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
              <button className="relative w-9 h-5 rounded-full bg-white/10 flex-shrink-0 ml-4">
                <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </button>
            </div>
          ))}
        </div>
      </PlaceholderCard>

      <div className="p-3 rounded-xl border border-dashed border-violet-500/20 text-center">
        <p className="text-xs text-muted-foreground">Garmin Connect IQ, Wahoo Cloud API, and Ant-FS device transfer — integration hooks ready.</p>
      </div>
    </div>
  );
}

// ── Ride Import/Export Tab ────────────────────────────────────────────────────

export function RideImportExportTab() {
  const [dragging, setDragging] = useState(false);

  const RECENT_IMPORTS = [
    { name: 'Morning Ride 2026-06-05.fit', size: '824 KB', status: 'imported', date: '05 Jun' },
    { name: 'Club_Ride_Sunday.gpx',        size: '312 KB', status: 'imported', date: '01 Jun' },
    { name: 'Zwift_Race_Watopia.fit',       size: '1.2 MB', status: 'error',    date: '29 May' },
  ];

  return (
    <div className="space-y-5">
      <SectionLabel accent="amber" label="Ride Import / Export" />

      {/* Drag & drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); }}
        className={`rounded-xl border-2 border-dashed transition-all duration-150 p-10 text-center cursor-pointer ${
          dragging ? 'border-blue-500/60 bg-blue-500/[0.06]' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
        }`}
      >
        <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-3" />
        <p className="text-sm font-semibold text-foreground mb-1">Drop .fit or .gpx files here</p>
        <p className="text-xs text-muted-foreground mb-4">Supports FIT, GPX, TCX, KML</p>
        <button className="btn-primary text-xs px-5">Browse Files</button>
      </div>

      {/* Recent imports */}
      <PlaceholderCard title="Recent Imports" description="Files imported into CycleFlow" icon={FileText} accent="amber">
        <div className="mt-3 space-y-1.5">
          {RECENT_IMPORTS.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/[0.04]">
              <FileText className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{f.name}</p>
                <p className="text-[10px] text-muted-foreground">{f.size} · {f.date}</p>
              </div>
              <span className={`badge flex-shrink-0 ${f.status === 'imported' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {f.status === 'imported' ? '✓ Imported' : '✕ Error'}
              </span>
            </div>
          ))}
        </div>
      </PlaceholderCard>

      {/* Export options */}
      <SectionLabel accent="green" label="Export Your Data" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Export All Rides',   desc: 'Download complete ride history as a ZIP of GPX files',  icon: Download, color: 'green' },
          { label: 'Strava Sync',         desc: 'One-click push to Strava account — OAuth hook ready',   icon: Zap,      color: 'orange' },
          { label: 'Training Peaks',      desc: 'Export structured workouts and FTP data',               icon: Upload,   color: 'violet' },
        ].map(({ label, desc, icon: Icon, color }) => (
          <div key={label} className={`glass-card rounded-xl border p-4 ${
            color === 'green'  ? 'border-green-500/20  bg-green-500/[0.03]' :
            color === 'orange' ? 'border-orange-500/20 bg-orange-500/[0.03]' :
            'border-violet-500/20 bg-violet-500/[0.03]'
          }`}>
            <Icon className={`w-4 h-4 mb-2 ${
              color === 'green' ? 'text-green-400' : color === 'orange' ? 'text-orange-400' : 'text-violet-400'
            }`} />
            <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
            <p className="text-[10px] text-muted-foreground mb-3">{desc}</p>
            <button className="btn-secondary w-full text-xs">Connect</button>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl border border-dashed border-amber-500/20 text-center">
        <p className="text-xs text-muted-foreground">FIT SDK parser, Strava OAuth, TrainingPeaks API, and Garmin Health API — integration hooks ready.</p>
      </div>
    </div>
  );
}