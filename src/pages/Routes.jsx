import { useState } from 'react';
import { Map, Star, Users, Plus, FileUp, Route, ChevronRight, Download, Navigation, TrendingUp, Trophy, ArrowLeftRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import SectionLabel from '@/components/ui/SectionLabel';

import { useDemo } from '@/lib/DemoContext';
import RoutePlannerTab    from '@/components/routes/RoutePlannerTab';
import ClubLibraryTab     from '@/components/routes/ClubLibraryTab';
import RouteCompareTab    from '@/components/routes/RouteCompareTab';
import GpxPanel           from '@/components/routes/GpxPanel';
import ElevationProfile   from '@/components/routes/ElevationProfile';
import { genElevProfile } from '@/components/routes/routeData';

const TABS = [
  { id: 'my',       label: 'My Routes',     icon: Star },
  { id: 'club',     label: 'Club Library',  icon: Users },
  { id: 'segments', label: 'Segments',      icon: TrendingUp },
  { id: 'plan',     label: 'Map Planner',   icon: Map },
  { id: 'compare',  label: 'Compare',       icon: ArrowLeftRight },
  { id: 'gpx',      label: 'GPX Files',     icon: FileUp },
];

const MY_ROUTES = [
  { name: 'Morning Loop',        distance: '24.3 km', elevation: '320m', time: '1:12', type: 'Road',    rating: 4 },
  { name: 'Park Circuit',        distance: '18.7 km', elevation: '120m', time: '52m',  type: 'Mixed',   rating: 5 },
  { name: 'Hill Climb Challenge',distance: '38.1 km', elevation: '890m', time: '2:18', type: 'Road',    rating: 3 },
  { name: 'Canal Path Loop',     distance: '29.4 km', elevation: '60m',  time: '1:28', type: 'Gravel',  rating: 4 },
];







export default function Routes() {
  const { demoMode } = useDemo();
  const [tab, setTab]               = useState('my');
  const [planStep, setPlanStep]     = useState(0); // 0=draw, 1=metadata, 2=saved
  const [formData, setFormData]     = useState({ name:'', type:'Road', difficulty:'Moderate', desc:'' });
  const [selectedRoute, setSelected]= useState(null);

  const diffColor = (d) => d === 'Easy' ? 'bg-green-500/10 text-green-400' : d === 'Moderate' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400';

  return (
    <div className="page-enter">
      <PageHeader title="Routes" subtitle="Plan, explore, and manage your cycling routes" icon={Map} iconColor="text-blue-400" />
      <SubNav tabs={TABS} active={tab} onSelect={t => { setTab(t); setPlanStep(0); setSelected(null); }} />

      {/* ── My Routes ── */}
      {tab === 'my' && !selectedRoute && (
        <div className="space-y-2.5">
          {MY_ROUTES.map((r, i) => (
            <div key={i} onClick={() => setSelected(r)}
              className="glass-card rounded-xl border border-white/5 p-4 flex items-center gap-4 hover:border-blue-500/30 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <Route className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="text-xs text-muted-foreground">{r.distance}</span>
                  <span className="text-xs text-muted-foreground">↑ {r.elevation}</span>
                  <span className="text-xs text-muted-foreground">~ {r.time}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{r.type}</span>
                <span className="text-xs text-muted-foreground">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          ))}
          <button onClick={() => setTab('plan')}
            className="w-full py-3 rounded-xl border border-dashed border-blue-500/30 text-sm text-blue-400 hover:bg-blue-500/5 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Plan New Route
          </button>
        </div>
      )}

      {/* Route Detail View */}
      {tab === 'my' && selectedRoute && (
        <div className="space-y-4 page-enter">
          <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to My Routes
          </button>
          <div className="glass-card rounded-xl border border-white/5 p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">{selectedRoute.name}</h2>
                <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{selectedRoute.distance}</span>
                  <span>↑ {selectedRoute.elevation} elevation</span>
                  <span>Est. {selectedRoute.time}</span>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${diffColor(selectedRoute.difficulty || 'Moderate')}`}>{selectedRoute.type}</span>
            </div>
            {/* Map placeholder */}
            <div className="h-52 rounded-lg bg-[#0a1628] border border-blue-500/20 flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'linear-gradient(#1e40af 1px, transparent 1px), linear-gradient(90deg, #1e40af 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <div className="text-center z-10">
                <Map className="w-10 h-10 text-blue-400/40 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Interactive map — React Leaflet integration ready</p>
              </div>
            </div>
            {/* Elevation chart */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Elevation Profile</p>
              <ElevationProfile data={genElevProfile(selectedRoute.name.length, 30)} height={80} showStats={false} />
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/ride" className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Start Ride
            </Link>
            <button className="px-4 py-2.5 border border-border text-muted-foreground text-sm rounded-lg hover:text-foreground hover:border-foreground/30 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> GPX
            </button>
          </div>
        </div>
      )}

      {/* ── Segments ── */}
      {tab === 'segments' && (
        <div className="space-y-5">
          <SectionLabel accent="amber" label="Segments Near You" />

          {/* KOM / PR strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Segments Matched',  value: '24',    accent: 'blue' },
              { label: 'KOM / QOM Held',    value: '2',     accent: 'amber' },
              { label: 'Personal Records',  value: '11',    accent: 'green' },
              { label: 'Top-10 Positions',  value: '7',     accent: 'violet' },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-xl border border-white/[0.06] p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2">{s.label}</p>
                <p className={`text-2xl font-bold font-mono ${
                  s.accent === 'blue' ? 'text-blue-400' :
                  s.accent === 'amber' ? 'text-amber-400' :
                  s.accent === 'green' ? 'text-green-400' : 'text-violet-400'
                }`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Segment list */}
          <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Recent Segment Efforts</span>
            </div>
            <table className="cf-table">
              <thead>
                <tr>
                  <th className="text-left">Segment</th>
                  <th className="text-right hidden sm:table-cell">Distance</th>
                  <th className="text-right">Your Time</th>
                  <th className="text-right hidden md:table-cell">KOM</th>
                  <th className="text-right">Rank</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Box Hill Climb',         dist: '2.4 km', time: '8:12', kom: '6:44', rank: 3,   pr: true  },
                  { name: 'Leith Hill Sprint',       dist: '1.1 km', time: '2:54', kom: '2:31', rank: 8,   pr: false },
                  { name: 'Newlands Corner Dash',   dist: '3.8 km', time: '6:31', kom: '5:50', rank: 2,   pr: true  },
                  { name: 'Zig Zag Road',           dist: '1.9 km', time: '4:48', kom: '3:59', rank: 14,  pr: false },
                  { name: 'Ranmore Road Segment',   dist: '4.2 km', time: '9:05', kom: '7:22', rank: 5,   pr: false },
                ].map((s, i) => (
                  <tr key={i} className={s.rank <= 3 ? '!bg-amber-500/[0.04]' : ''}>
                    <td>
                      <span className="font-medium text-foreground">{s.name}</span>
                      {s.pr && <span className="ml-2 badge bg-green-500/10 text-green-400">PR</span>}
                    </td>
                    <td className="text-right text-muted-foreground hidden sm:table-cell">{s.dist}</td>
                    <td className="text-right font-mono font-semibold text-blue-400">{s.time}</td>
                    <td className="text-right font-mono text-muted-foreground hidden md:table-cell">{s.kom}</td>
                    <td className="text-right">
                      <span className={`badge font-mono ${
                        s.rank === 1 ? 'bg-amber-500/10 text-amber-400' :
                        s.rank <= 3  ? 'bg-yellow-500/10 text-yellow-400' :
                        s.rank <= 10 ? 'bg-blue-500/10 text-blue-400' :
                        'bg-white/10 text-muted-foreground'
                      }`}>#{s.rank}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Club segment leaderboard */}
          <PlaceholderCard title="Club Segment Leaderboard" description="How club members rank on local segments this month" icon={Trophy} accent="amber">
            <div className="mt-3 space-y-2">
              {[
                { rider: 'Alex Turner',  segment: 'Box Hill Climb',      rank: 1, time: '7:02' },
                { rider: 'Sarah Chen',   segment: 'Newlands Corner Dash',rank: 2, time: '6:38' },
                { rider: 'You (Jamie)',  segment: 'Newlands Corner Dash',rank: 2, time: '6:31' },
              ].map((e, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg border transition-colors
                  ${e.rider.includes('You') ? 'border-blue-500/20 bg-blue-500/5' : 'border-white/5 bg-white/5'}`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`text-sm font-bold ${e.rank === 1 ? 'text-amber-400' : e.rank === 2 ? 'text-slate-300' : 'text-muted-foreground'}`}>
                      {e.rank === 1 ? '🥇' : e.rank === 2 ? '🥈' : `#${e.rank}`}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{e.rider}</p>
                      <p className="text-[10px] text-muted-foreground">{e.segment}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-blue-400 font-semibold">{e.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg border border-dashed border-amber-500/20 text-center">
              <p className="text-xs text-muted-foreground">Live leaderboard sync — Strava Segments API and Komoot Highlights integration hook ready.</p>
            </div>
          </PlaceholderCard>
        </div>
      )}

      {/* ── Club Library ── */}
      {tab === 'club' && <div className="tab-enter"><ClubLibraryTab /></div>}

      {/* ── Map Planner ── */}
      {tab === 'plan' && <div className="tab-enter"><RoutePlannerTab demoMode={demoMode} /></div>}

      {/* ── Route Compare ── */}
      {tab === 'compare' && <div className="tab-enter"><RouteCompareTab /></div>}



      {/* ── GPX Files ── */}
      {tab === 'gpx' && <div className="tab-enter"><GpxPanel /></div>}
    </div>
  );
}