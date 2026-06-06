import { useState } from 'react';
import { Map, Star, Users, Plus, FileUp, Route, ChevronRight, Download, Navigation, Save, X, TrendingUp, Trophy, Lock } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import SectionLabel from '@/components/ui/SectionLabel';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const TABS = [
  { id: 'my',       label: 'My Routes',     icon: Star },
  { id: 'club',     label: 'Club Routes',   icon: Users },
  { id: 'segments', label: 'Segments',      icon: TrendingUp },
  { id: 'plan',     label: 'Plan Route',    icon: Plus },
  { id: 'gpx',      label: 'GPX Files',     icon: FileUp },
];

const MY_ROUTES = [
  { name: 'Morning Loop',        distance: '24.3 km', elevation: '320m', time: '1:12', type: 'Road',    rating: 4 },
  { name: 'Park Circuit',        distance: '18.7 km', elevation: '120m', time: '52m',  type: 'Mixed',   rating: 5 },
  { name: 'Hill Climb Challenge',distance: '38.1 km', elevation: '890m', time: '2:18', type: 'Road',    rating: 3 },
  { name: 'Canal Path Loop',     distance: '29.4 km', elevation: '60m',  time: '1:28', type: 'Gravel',  rating: 4 },
];

const CLUB_ROUTES = [
  { name: 'Sunday Club Ride',      distance: '67.5 km', elevation: '540m', riders: 12, difficulty: 'Moderate', saved: true },
  { name: 'Weekly Crit Training',  distance: '45.0 km', elevation: '210m', riders: 8,  difficulty: 'Hard',     saved: false },
  { name: 'Beginner Welcome Ride', distance: '22.0 km', elevation: '80m',  riders: 24, difficulty: 'Easy',     saved: true },
  { name: 'Sportive Prep 80k',     distance: '80.0 km', elevation: '920m', riders: 6,  difficulty: 'Hard',     saved: false },
];

const GPX_FILES = [
  { name: 'etape_du_tour_2025.gpx',   size: '184 KB', imported: '12 Jan 2026', points: 4210 },
  { name: 'gran_fondo_route.gpx',     size: '236 KB', imported: '03 Mar 2026', points: 5830 },
  { name: 'local_sportive_2026.gpx',  size: '97 KB',  imported: '28 Apr 2026', points: 2140 },
];

// Fake elevation profile data
const elevData = [
  {d:'0km',e:80},{d:'5km',e:140},{d:'10km',e:320},{d:'15km',e:410},{d:'20km',e:350},
  {d:'25km',e:280},{d:'30km',e:180},{d:'35km',e:240},{d:'38km',e:120},
];

const ROUTE_TYPES = ['Road', 'Gravel', 'Mixed', 'Mountain', 'Commute'];
const DIFFICULTY  = ['Easy', 'Moderate', 'Hard', 'Expert'];

// Shared label utility used inside this file
const CfLabel = ({ children }) => <label className="cf-label">{children}</label>;

export default function Routes() {
  const [tab, setTab]               = useState('my');
  const [planStep, setPlanStep]     = useState(0); // 0=draw, 1=metadata, 2=saved
  const [formData, setFormData]     = useState({ name:'', type:'Road', difficulty:'Moderate', desc:'' });
  const [selectedRoute, setSelected]= useState(null);

  const diffColor = (d) => d === 'Easy' ? 'bg-green-500/10 text-green-400' : d === 'Moderate' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400';

  return (
    <div className="p-6 page-enter">
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
              <ResponsiveContainer width="100%" height={80}>
                <AreaChart data={elevData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="elevGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: '#0f1520', border: '1px solid #1e2a3e', borderRadius: 8, color: '#f8fafc', fontSize: 11 }} />
                  <Area type="monotone" dataKey="e" stroke="#3b82f6" strokeWidth={2} fill="url(#elevGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" /> Start Ride
            </button>
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

      {/* ── Club Routes ── */}
      {tab === 'club' && (
        <div className="space-y-2.5">
          {CLUB_ROUTES.map((r, i) => (
            <div key={i} className="glass-card rounded-xl border border-white/5 p-4 hover:border-blue-500/30 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${diffColor(r.difficulty)}`}>{r.difficulty}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>{r.distance}</span>
                  <span>↑ {r.elevation}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.riders}</span>
                </div>
                <button className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${r.saved ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-blue-500/30 text-blue-400 hover:bg-blue-500/10'}`}>
                  {r.saved ? '✓ Saved' : '+ Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Plan New Route ── */}
      {tab === 'plan' && planStep === 0 && (
        <div className="space-y-4">
          {/* Map canvas */}
          <div className="glass-card rounded-xl border border-blue-500/20 overflow-hidden">
            <div className="h-72 bg-[#0a1628] relative flex items-center justify-center"
              style={{ backgroundImage: 'linear-gradient(#1e3a5f22 1px, transparent 1px), linear-gradient(90deg, #1e3a5f22 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center mx-auto mb-3">
                  <Map className="w-8 h-8 text-blue-400/60" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Interactive Route Planner</p>
                <p className="text-xs text-muted-foreground mb-4">Click the map to add waypoints — React Leaflet integration ready</p>
                <div className="flex justify-center gap-2">
                  <button className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors">Draw Route</button>
                  <button className="px-4 py-1.5 border border-blue-500/30 text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-500/10 transition-colors" onClick={() => setTab('gpx')}>Import GPX</button>
                </div>
              </div>
            </div>
            {/* Waypoint pills */}
            <div className="flex gap-2 p-3 border-t border-border overflow-x-auto">
              {['Start Point', 'Waypoint A', 'End Point'].map((w, i) => (
                <div key={w} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs flex-shrink-0 ${i === 0 || i === 2 ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-border bg-white/5 text-muted-foreground'}`}>
                  <span className="w-4 h-4 rounded-full bg-current opacity-30 flex items-center justify-center text-[8px] font-bold text-foreground">{i+1}</span>
                  {w}
                  {i === 1 && <X className="w-3 h-3 text-muted-foreground" />}
                </div>
              ))}
              <button className="px-3 py-1.5 border border-dashed border-blue-500/20 text-blue-400 text-xs rounded-lg flex-shrink-0 hover:bg-blue-500/5 transition-colors">+ Add</button>
            </div>
          </div>
          {/* Elevation preview */}
          <div className="glass-card rounded-xl border border-white/5 p-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Elevation Preview</p>
            <ResponsiveContainer width="100%" height={70}>
              <AreaChart data={elevData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="planElev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Area type="monotone" dataKey="e" stroke="#22d3ee" strokeWidth={1.5} fill="url(#planElev)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-white/5 text-center">
              {[['Distance','38.1 km'],['Elevation','890m'],['Est. Time','~2h 18m']].map(([l,v]) => (
                <div key={l}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{l}</p>
                  <p className="text-sm font-bold font-mono text-foreground mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setPlanStep(1)} className="btn-primary w-full">
            Continue — Add Route Details →
          </button>
        </div>
      )}

      {tab === 'plan' && planStep === 1 && (
        <div className="space-y-4 max-w-xl page-enter">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => setPlanStep(0)} className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back to Map</button>
          </div>
          <div className="glass-card rounded-xl border border-white/5 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Route Details</h3>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Route Name *</label>
              <input value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))}
                placeholder="e.g. Morning Hill Climb"
                className="cf-input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1.5">Surface Type</label>
                <select value={formData.type} onChange={e => setFormData(p => ({...p, type: e.target.value}))}
                  className="w-full bg-white/5 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground">
                  {ROUTE_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="cf-label">Difficulty</label>
                <select value={formData.difficulty} onChange={e => setFormData(p => ({...p, difficulty: e.target.value}))}
                  className="cf-select">
                  {DIFFICULTY.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="cf-label">Description (optional)</label>
              <textarea value={formData.desc} onChange={e => setFormData(p => ({...p, desc: e.target.value}))}
                rows={3} placeholder="Add notes about road conditions, hazards, or highlights…"
                className="cf-textarea" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs text-muted-foreground flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" /> Share with club members
              </label>
              <label className="text-xs text-muted-foreground flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" /> Make public
              </label>
            </div>
          </div>
          <button onClick={() => setPlanStep(2)} className="btn-primary w-full">
            <Save className="w-4 h-4" /> Save Route
          </button>
        </div>
      )}

      {tab === 'plan' && planStep === 2 && (
        <div className="text-center py-12 page-enter">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-4">
            <Save className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">Route Saved!</h3>
          <p className="text-sm text-muted-foreground mb-6">"{formData.name || 'New Route'}" has been added to My Routes.</p>
          <div className="flex justify-center gap-3">
            <button onClick={() => { setTab('my'); setPlanStep(0); }} className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors">View My Routes</button>
            <button onClick={() => setPlanStep(0)} className="px-5 py-2 border border-border text-muted-foreground text-sm rounded-lg hover:text-foreground transition-colors">Plan Another</button>
          </div>
        </div>
      )}

      {/* ── GPX Files ── */}
      {tab === 'gpx' && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-blue-500/30 rounded-xl p-10 text-center bg-blue-500/3 hover:bg-blue-500/5 transition-colors cursor-pointer">
            <FileUp className="w-10 h-10 text-blue-400/50 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground mb-1">Upload GPX File</p>
            <p className="text-xs text-muted-foreground mb-4">Drag and drop or click to select a .gpx file</p>
            <button className="btn-primary">Browse Files</button>
          </div>
          <div className="space-y-2">
            {GPX_FILES.map((f, i) => (
              <div key={i} className="glass-card rounded-xl border border-white/5 p-4 flex items-center gap-3 hover:border-blue-500/20 transition-all">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                  <FileUp className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground font-mono truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{f.size} · {f.points.toLocaleString()} pts · Imported {f.imported}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 border border-blue-500/20 rounded-lg hover:bg-blue-500/10 transition-colors">Load</button>
                  <button className="p-2 text-muted-foreground hover:text-blue-400 transition-colors"><Download className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}