import { useState, useCallback } from 'react';
import { Save, RotateCcw, Download, Upload, Sliders, ArrowRight } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import MapCanvas from './MapCanvas';
import WaypointEditor from './WaypointEditor';
import ElevationProfile from './ElevationProfile';
import RouteSummaryPanel from './RouteSummaryPanel';
import TurnByTurn from './TurnByTurn';
import {
  DEMO_WAYPOINTS, DEMO_TURNS, SNAP_MODES, SURFACE_TYPES,
  DIFFICULTY_LEVELS, genElevProfile,
} from './routeData';

const FORM_DEFAULTS = { name: '', surface: 'Road', difficulty: 'Moderate', desc: '', share: false };

function calcSummary(waypoints, surface) {
  const n = waypoints.length;
  if (n < 2) return { distance: '—', elevation: '—', time: '—', calories: '—', snapMode: null };
  const baseDist = n * 8.5 + Math.random() * 4;
  const baseElev = surface === 'Mountain' ? 800 : surface === 'Gravel' ? 500 : 300;
  const dist = baseDist.toFixed(1);
  const elev = Math.round(baseElev + n * 40);
  const mins = Math.round((baseDist / 22) * 60);
  const h = Math.floor(mins / 60), m = mins % 60;
  return {
    distance: dist,
    elevation: elev,
    time: h > 0 ? `${h}h ${m}m` : `${m}m`,
    calories: Math.round(baseDist * 35),
    snapMode: 'Snapped to roads',
  };
}

export default function RoutePlannerTab({ demoMode }) {
  const [waypoints, setWaypoints]   = useState(demoMode ? DEMO_WAYPOINTS : []);
  const [activeWp, setActiveWp]     = useState(null);
  const [snapMode, setSnapMode]     = useState(SNAP_MODES[0]);
  const [form, setForm]             = useState(FORM_DEFAULTS);
  const [step, setStep]             = useState('plan'); // plan | details | saved
  const [showTurns, setShowTurns]   = useState(false);
  const [gpxMode, setGpxMode]       = useState(false); // toggled by Import GPX button

  const elevData = waypoints.length >= 2
    ? genElevProfile(waypoints.length + 7, 40)
    : [];

  const summary = calcSummary(waypoints, form.surface);

  const handleCanvasClick = useCallback((lat, lng) => {
    setWaypoints(prev => {
      const next = [...prev];
      const newWp = {
        id: `wp-${Date.now()}`,
        label: next.length === 0 ? 'Start' : `Waypoint ${String.fromCharCode(64 + next.length)}`,
        lat, lng,
        type: 'via',
      };
      next.push(newWp);
      if (next.length >= 1) next[0].type = 'start';
      if (next.length >= 2) next[next.length - 1].type = 'end';
      if (next.length > 2) next.slice(1, -1).forEach(w => w.type = 'via');
      return next;
    });
  }, []);

  const loadDemo = () => {
    setWaypoints(DEMO_WAYPOINTS);
    setActiveWp(null);
  };

  const clearAll = () => {
    setWaypoints([]);
    setActiveWp(null);
  };

  if (step === 'saved') {
    return (
      <div className="text-center py-16 page-enter">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-4">
          <Save className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Route Saved!</h3>
        <p className="text-sm text-muted-foreground mb-6">
          "{form.name || 'New Route'}" added to My Routes.
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={() => setStep('plan')} className="btn-primary">Plan Another</button>
          <button onClick={() => { setStep('plan'); clearAll(); setForm(FORM_DEFAULTS); }}
            className="btn-secondary">Start Fresh</button>
        </div>
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div className="max-w-lg space-y-4 page-enter">
        <button onClick={() => setStep('plan')}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
          ← Back to Map
        </button>
        <div className="glass-card rounded-xl border border-white/5 p-5 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Route Details</h3>
          <div>
            <label className="cf-label">Route Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Morning Hill Climb" className="cf-input" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="cf-label">Surface</label>
              <select value={form.surface} onChange={e => setForm(p => ({ ...p, surface: e.target.value }))}
                className="cf-select">
                {SURFACE_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="cf-label">Difficulty</label>
              <select value={form.difficulty} onChange={e => setForm(p => ({ ...p, difficulty: e.target.value }))}
                className="cf-select">
                {DIFFICULTY_LEVELS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="cf-label">Description (optional)</label>
            <textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
              rows={3} className="cf-textarea" placeholder="Road conditions, highlights, hazards…" />
          </div>
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={form.share}
              onChange={e => setForm(p => ({ ...p, share: e.target.checked }))} className="rounded" />
            Share with club members
          </label>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setStep('saved')} className="btn-primary flex-1">
            <Save className="w-4 h-4" /> Save Route
          </button>
          <button className="btn-secondary flex items-center gap-2 px-4">
            <Download className="w-4 h-4" /> Export GPX
          </button>
        </div>
      </div>
    );
  }

  // ── Main plan view ────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 page-enter">
      {/* Top toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <select value={snapMode} onChange={e => setSnapMode(e.target.value)}
          className="cf-select w-40 text-xs py-1.5">
          {SNAP_MODES.map(m => <option key={m}>{m}</option>)}
        </select>
        <button onClick={loadDemo}
          className="btn-secondary py-1.5 px-3 text-xs gap-1.5">
          Load Demo Route
        </button>
        <button onClick={clearAll}
          className="btn-ghost py-1.5 px-3 text-xs gap-1.5 text-muted-foreground">
          <RotateCcw className="w-3.5 h-3.5" /> Clear
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button className="btn-secondary py-1.5 px-3 text-xs gap-1.5">
            <Upload className="w-3.5 h-3.5" /> Import GPX
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
        {/* Map + elevation */}
        <div className="space-y-3">
          {/* Map */}
          <div className="glass-card rounded-xl border border-blue-500/15 overflow-hidden" style={{ height: 340 }}>
            <MapCanvas
              waypoints={waypoints}
              activeWp={activeWp}
              onCanvasClick={handleCanvasClick}
            />
          </div>

          {/* Elevation */}
          <div className="glass-card rounded-xl border border-white/5 p-4">
            <SectionLabel accent="cyan" label="Elevation Profile" className="mb-3" />
            {elevData.length >= 2
              ? <ElevationProfile data={elevData} height={90} showStats />
              : <p className="text-xs text-muted-foreground text-center py-6">Add at least 2 waypoints to preview elevation</p>
            }
          </div>

          {/* Turn-by-turn */}
          {waypoints.length >= 2 && (
            <div>
              <button onClick={() => setShowTurns(v => !v)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2">
                {showTurns ? '▾' : '▸'} Turn-by-turn directions
              </button>
              {showTurns && <TurnByTurn turns={DEMO_TURNS} />}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-3">
          {/* Waypoint editor */}
          <div className="glass-card rounded-xl border border-white/5 p-4">
            <SectionLabel accent="blue" label="Waypoints" className="mb-3"
              right={<span className="text-[10px] text-muted-foreground">{waypoints.length} pts</span>} />
            {waypoints.length === 0
              ? <p className="text-xs text-muted-foreground text-center py-4">Click the map or load a demo route</p>
              : <WaypointEditor waypoints={waypoints} activeWp={activeWp} onSelect={setActiveWp} onChange={setWaypoints} />
            }
          </div>

          {/* Summary */}
          {waypoints.length >= 2 && (
            <div className="glass-card rounded-xl border border-white/5 p-4">
              <SectionLabel accent="violet" label="Route Summary" className="mb-3" />
              <RouteSummaryPanel summary={{ ...summary, snapMode }} surface={form.surface} difficulty={form.difficulty} />
            </div>
          )}

          {/* Continue CTA */}
          {waypoints.length >= 2 && (
            <button onClick={() => setStep('details')} className="btn-primary w-full">
              Continue — Add Details <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}