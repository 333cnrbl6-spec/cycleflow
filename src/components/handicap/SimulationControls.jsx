import { Play, Square, RefreshCw, Sliders } from 'lucide-react';

const STYLES   = ['Endurance', 'Sprinter', 'Climber', 'All-Rounder'];
const RISKS    = ['Conservative', 'Moderate', 'Aggressive'];
const TERRAINS = ['Flat', 'Mixed', 'Mountains', 'Urban'];
const FATIGUE  = ['Consistent', 'Mid-week dip', 'Weekend peaker', 'Irregular'];
const GENDERS  = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];

export default function SimulationControls({ profile, setProfile, running, setRunning, regenerate, reset }) {
  const set = (key, val) => {
    const next = { ...profile, [key]: val };
    setProfile(next);
    regenerate(next);
  };

  return (
    <div className="glass-card rounded-2xl border border-violet-500/20 bg-violet-500/[0.03] p-5 mb-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-violet-400" />
          <p className="text-sm font-semibold text-foreground">Simulation Controls</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${running ? 'bg-green-500/15 text-green-400' : 'bg-white/10 text-muted-foreground'}`}>
            {running ? '● LIVE' : '○ STATIC'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setRunning(r => !r)}
            className={`btn-icon w-auto px-3 h-8 text-xs gap-1.5 ${running ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
          >
            {running ? <Square className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {running ? 'Stop' : 'Run Live'}
          </button>
          <button onClick={() => regenerate(profile)} className="btn-icon w-auto px-3 h-8 text-xs gap-1.5">
            <RefreshCw className="w-3 h-3" /> Regenerate
          </button>
          <button onClick={reset} className="btn-icon w-auto px-3 h-8 text-xs text-muted-foreground hover:text-red-400">
            Reset
          </button>
        </div>
      </div>

      {/* Profile controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div>
          <label className="cf-label">Age</label>
          <input
            type="number" min="16" max="80"
            value={profile.age}
            onChange={e => set('age', +e.target.value)}
            className="cf-input"
          />
        </div>
        <div>
          <label className="cf-label">Gender</label>
          <select value={profile.gender} onChange={e => set('gender', e.target.value)} className="cf-select">
            {GENDERS.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="cf-label">Mass (kg)</label>
          <input
            type="number" min="40" max="130"
            value={profile.bodyMass}
            onChange={e => set('bodyMass', +e.target.value)}
            className="cf-input"
          />
        </div>
        <div>
          <label className="cf-label">Height (cm)</label>
          <input
            type="number" min="140" max="210"
            value={profile.height}
            onChange={e => set('height', +e.target.value)}
            className="cf-input"
          />
        </div>
        <div>
          <label className="cf-label">Riding Style</label>
          <select value={profile.ridingStyle} onChange={e => set('ridingStyle', e.target.value)} className="cf-select">
            {STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="cf-label">Risk Profile</label>
          <select value={profile.riskProfile} onChange={e => set('riskProfile', e.target.value)} className="cf-select">
            {RISKS.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="cf-label">Terrain</label>
          <select value={profile.terrainPref} onChange={e => set('terrainPref', e.target.value)} className="cf-select">
            {TERRAINS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="cf-label">Fatigue Pattern</label>
          <select value={profile.fatiguePattern} onChange={e => set('fatiguePattern', e.target.value)} className="cf-select">
            {FATIGUE.map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground mt-3">
        Changing any parameter immediately regenerates the simulation. "Run Live" updates real-time telemetry every 2 s.
      </p>
    </div>
  );
}