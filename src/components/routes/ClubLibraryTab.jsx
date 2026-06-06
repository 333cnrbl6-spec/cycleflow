import { useState } from 'react';
import { Users, Filter, Search, Bookmark, BookmarkCheck, ArrowLeft, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionLabel from '@/components/ui/SectionLabel';
import ElevationProfile from './ElevationProfile';
import { CLUB_LIBRARY, SURFACE_COLORS, DIFFICULTY_COLORS } from './routeData';

const ALL = 'All';
const SURFACES    = [ALL, 'Road', 'Gravel', 'Mixed', 'Mountain'];
const DIFFICULTIES = [ALL, 'Easy', 'Moderate', 'Hard', 'Expert'];

function RouteCard({ route, onSelect, onToggleSave }) {
  const sc = SURFACE_COLORS[route.surface]     || SURFACE_COLORS['Road'];
  const dc = DIFFICULTY_COLORS[route.difficulty] || DIFFICULTY_COLORS['Moderate'];

  return (
    <div
      onClick={() => onSelect(route)}
      className="glass-card rounded-xl border border-white/[0.06] p-4 hover:border-blue-500/30 transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground group-hover:text-blue-400 transition-colors truncate">
            {route.name}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className={cn('badge', sc.bg, sc.text)}>{route.surface}</span>
            <span className={cn('badge', dc.bg, dc.text)}>{route.difficulty}</span>
            {route.tags?.map(t => (
              <span key={t} className="badge bg-white/5 text-muted-foreground/60">{t}</span>
            ))}
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onToggleSave(route.id); }}
          className={cn(
            'flex-shrink-0 p-1.5 rounded-lg border transition-all',
            route.saved
              ? 'border-green-500/30 bg-green-500/10 text-green-400'
              : 'border-white/10 bg-transparent text-muted-foreground hover:border-blue-500/30 hover:text-blue-400',
          )}
        >
          {route.saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Mini elevation */}
      <div className="h-14 mb-3">
        <ElevationProfile data={route.elevProfile} height={56} showStats={false} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-white/[0.05] text-center">
        {[
          [`${route.distance} km`, 'Distance'],
          [`${route.elevation}m`, 'Elevation'],
          [route.time,           'Est. Time'],
        ].map(([v, l]) => (
          <div key={l}>
            <p className="text-xs font-bold font-mono text-foreground">{v}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      {/* Rider count */}
      <div className="flex items-center gap-1 mt-2.5 text-[10px] text-muted-foreground">
        <Users className="w-3 h-3" />
        {route.riders} club members completed
      </div>
    </div>
  );
}

function RouteDetail({ route, onBack }) {
  const sc = SURFACE_COLORS[route.surface]     || SURFACE_COLORS['Road'];
  const dc = DIFFICULTY_COLORS[route.difficulty] || DIFFICULTY_COLORS['Moderate'];

  return (
    <div className="space-y-4 page-enter">
      <button onClick={onBack}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Club Library
      </button>

      <div className="glass-card rounded-xl border border-white/5 p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">{route.name}</h2>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className={cn('badge', sc.bg, sc.text)}>{route.surface}</span>
              <span className={cn('badge', dc.bg, dc.text)}>{route.difficulty}</span>
              {route.tags?.map(t => (
                <span key={t} className="badge bg-white/5 text-muted-foreground/60">{t}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground flex-shrink-0">
            <Users className="w-3 h-3" /> {route.riders} riders
          </div>
        </div>

        {route.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">{route.description}</p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            [`${route.distance} km`, 'Distance', 'text-blue-400'],
            [`${route.elevation}m`, 'Elevation', 'text-cyan-400'],
            [route.time, 'Est. Time', 'text-amber-400'],
          ].map(([v, l, c]) => (
            <div key={l} className="glass-card rounded-lg border border-white/5 p-3 text-center">
              <p className={cn('text-base font-bold font-mono', c)}>{v}</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-wide mt-0.5">{l}</p>
            </div>
          ))}
        </div>

        {/* Elevation profile */}
        <div>
          <SectionLabel accent="cyan" label="Elevation Profile" className="mb-2" />
          <ElevationProfile data={route.elevProfile} height={110} showStats />
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn-primary flex-1 gap-2">
          <Navigation className="w-4 h-4" /> Start Ride
        </button>
        <button className="btn-secondary gap-2 px-4">Save to My Routes</button>
      </div>
    </div>
  );
}

export default function ClubLibraryTab() {
  const [routes, setRoutes]     = useState(CLUB_LIBRARY);
  const [surface, setSurface]   = useState(ALL);
  const [diff, setDiff]         = useState(ALL);
  const [query, setQuery]       = useState('');
  const [selected, setSelected] = useState(null);

  const toggleSave = (id) => {
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, saved: !r.saved } : r));
  };

  const filtered = routes.filter(r => {
    const matchSurface = surface === ALL || r.surface === surface;
    const matchDiff    = diff === ALL    || r.difficulty === diff;
    const matchQuery   = !query || r.name.toLowerCase().includes(query.toLowerCase());
    return matchSurface && matchDiff && matchQuery;
  });

  if (selected) return <RouteDetail route={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="space-y-4 page-enter">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search routes…"
            className="cf-input pl-8 py-2 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Filter className="w-3.5 h-3.5 text-muted-foreground/60" />
          <select value={surface} onChange={e => setSurface(e.target.value)}
            className="cf-select py-2 text-xs w-28">
            {SURFACES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={diff} onChange={e => setDiff(e.target.value)}
            className="cf-select py-2 text-xs w-28">
            {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Route count */}
      <p className="text-[11px] text-muted-foreground">
        {filtered.length} route{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* Cards grid */}
      {filtered.length === 0
        ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No routes match your filters.</p>
            <button onClick={() => { setSurface(ALL); setDiff(ALL); setQuery(''); }}
              className="mt-3 text-xs text-blue-400 hover:underline">Clear filters</button>
          </div>
        )
        : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(r => (
              <RouteCard key={r.id} route={r} onSelect={setSelected} onToggleSave={toggleSave} />
            ))}
          </div>
        )
      }
    </div>
  );
}