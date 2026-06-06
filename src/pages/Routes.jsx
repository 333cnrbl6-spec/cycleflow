import { useState } from 'react';
import { Map, Star, Users, Plus, FileUp, Clock, Route, ChevronRight, Download } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import PlaceholderCard from '@/components/ui/PlaceholderCard';

const TABS = [
  { id: 'my', label: 'My Routes', icon: Star },
  { id: 'club', label: 'Club Routes', icon: Users },
  { id: 'plan', label: 'Plan New Route', icon: Plus },
  { id: 'gpx', label: 'Saved GPX Files', icon: FileUp },
];

const MY_ROUTES = [
  { name: 'Morning Loop', distance: '24.3 km', elevation: '320m', time: '1:12', type: 'Road' },
  { name: 'Park Circuit', distance: '18.7 km', elevation: '120m', time: '52m', type: 'Mixed' },
  { name: 'Hill Climb Challenge', distance: '38.1 km', elevation: '890m', time: '2:18', type: 'Road' },
];

const CLUB_ROUTES = [
  { name: 'Sunday Club Ride', distance: '67.5 km', elevation: '540m', riders: 12, difficulty: 'Moderate' },
  { name: 'Weekly Crit Training', distance: '45.0 km', elevation: '210m', riders: 8, difficulty: 'Hard' },
  { name: 'Beginner Welcome Ride', distance: '22.0 km', elevation: '80m', riders: 24, difficulty: 'Easy' },
];

const GPX_FILES = [
  { name: 'etape_du_tour_2025.gpx', size: '184 KB', imported: '12 Jan 2026' },
  { name: 'gran_fondo_route.gpx', size: '236 KB', imported: '03 Mar 2026' },
  { name: 'local_sportive_2026.gpx', size: '97 KB', imported: '28 Apr 2026' },
];

export default function Routes() {
  const [tab, setTab] = useState('my');

  return (
    <div className="p-6 page-enter">
      <PageHeader title="Routes" subtitle="Plan, explore, and manage your cycling routes" icon={Map} />
      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {tab === 'my' && (
        <div className="space-y-3">
          {MY_ROUTES.map((r, i) => (
            <div key={i} className="glass-card rounded-lg border border-white/5 p-4 flex items-center gap-4 hover:border-blue-500/30 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <Route className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <div className="flex gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">{r.distance}</span>
                  <span className="text-xs text-muted-foreground">{r.elevation} elev</span>
                  <span className="text-xs text-muted-foreground">~{r.time}</span>
                </div>
              </div>
              <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{r.type}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          ))}
          <button className="w-full py-3 rounded-lg border border-dashed border-blue-500/30 text-sm text-blue-400 hover:bg-blue-500/5 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add New Route
          </button>
        </div>
      )}

      {tab === 'club' && (
        <div className="space-y-3">
          {CLUB_ROUTES.map((r, i) => (
            <div key={i} className="glass-card rounded-lg border border-white/5 p-4 hover:border-blue-500/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  r.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                  r.difficulty === 'Moderate' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-red-500/10 text-red-400'
                }`}>{r.difficulty}</span>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span>{r.distance}</span>
                <span>{r.elevation} elev</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.riders} riders</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'plan' && (
        <PlaceholderCard title="Route Planner" description="Draw, import, or auto-generate a new cycling route" icon={Map} accent="blue">
          <div className="mt-4 rounded-lg bg-white/5 border border-blue-500/20 h-64 flex flex-col items-center justify-center">
            <Map className="w-12 h-12 text-blue-400/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">Interactive map will appear here</p>
            <p className="text-xs text-muted-foreground mt-1">Click to set waypoints or import a GPX file</p>
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors">Start Drawing</button>
              <button className="px-4 py-1.5 border border-blue-500/30 text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-500/10 transition-colors">Import GPX</button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            {['Start Point', 'End Point', 'Waypoints'].map(label => (
              <div key={label} className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-muted-foreground mt-1">— Not set —</p>
              </div>
            ))}
          </div>
        </PlaceholderCard>
      )}

      {tab === 'gpx' && (
        <div className="space-y-4">
          <div className="border border-dashed border-blue-500/30 rounded-lg p-8 text-center bg-blue-500/5">
            <FileUp className="w-10 h-10 text-blue-400/50 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">Upload GPX File</p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">Drag and drop or click to select a .gpx file</p>
            <button className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">Browse Files</button>
          </div>
          <div className="space-y-2">
            {GPX_FILES.map((f, i) => (
              <div key={i} className="glass-card rounded-lg border border-white/5 p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <FileUp className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground font-mono">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.size} · Imported {f.imported}</p>
                </div>
                <button className="p-2 text-muted-foreground hover:text-blue-400 transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}