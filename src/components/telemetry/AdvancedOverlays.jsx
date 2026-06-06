import { useState } from 'react';
import { Layers, Map, Zap, Heart, Gauge, Activity, BarChart2, Eye, EyeOff } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import PlaceholderCard from '@/components/ui/PlaceholderCard';

const OVERLAY_OPTIONS = [
  { id: 'power_zones',  label: 'Power Zone Heatmap',     desc: 'Colour-code route by power zone output',    icon: Zap,      color: 'violet', on: true  },
  { id: 'hr_zones',     label: 'Heart Rate Zones',        desc: 'Overlay HR zone bands on elevation profile', icon: Heart,    color: 'red',    on: true  },
  { id: 'speed',        label: 'Speed Gradient',           desc: 'Route segment colouring by speed delta',    icon: Gauge,    color: 'blue',   on: false },
  { id: 'cadence',      label: 'Cadence Overlay',          desc: 'Cadence heatmap along ride trace',          icon: Activity, color: 'cyan',   on: false },
  { id: 'elevation',    label: '3D Elevation Profile',     desc: 'Extruded elevation map (WebGL)',             icon: BarChart2,color: 'amber',  on: true  },
  { id: 'segments',     label: 'Segment Markers',          desc: 'Highlight KOM/QOM segment boundaries',      icon: Map,      color: 'green',  on: false },
];

const ACCENT_MAP = {
  violet: 'border-violet-500/20 bg-violet-500/[0.04] text-violet-400',
  red:    'border-red-500/20    bg-red-500/[0.04]    text-red-400',
  blue:   'border-blue-500/20   bg-blue-500/[0.04]   text-blue-400',
  cyan:   'border-cyan-500/20   bg-cyan-500/[0.04]   text-cyan-400',
  amber:  'border-amber-500/20  bg-amber-500/[0.04]  text-amber-400',
  green:  'border-green-500/20  bg-green-500/[0.04]  text-green-400',
};

export default function AdvancedOverlays() {
  const [overlays, setOverlays] = useState(
    Object.fromEntries(OVERLAY_OPTIONS.map(o => [o.id, o.on]))
  );

  const toggle = (id) => setOverlays(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="space-y-5">
      <SectionLabel accent="violet" label="Advanced Telemetry Overlays" />

      {/* Map canvas placeholder */}
      <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
        <div className="relative h-52 bg-gradient-to-br from-[#0a1628] to-[#0d1f3c] flex items-center justify-center">
          {/* Simulated route line */}
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 200">
            <polyline
              points="20,150 60,130 100,110 140,120 180,80 220,60 260,75 300,55 340,40 380,50"
              fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"
            />
            {/* Zone colour segments */}
            <polyline points="20,150 60,130 100,110"   fill="none" stroke="#22d3ee" strokeWidth="4" strokeLinecap="round" />
            <polyline points="100,110 140,120 180,80"  fill="none" stroke="#a78bfa" strokeWidth="4" strokeLinecap="round" />
            <polyline points="180,80 220,60 260,75"    fill="none" stroke="#f87171" strokeWidth="4" strokeLinecap="round" />
            <polyline points="260,75 300,55 340,40 380,50" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <div className="relative z-10 text-center px-4">
            <Layers className="w-8 h-8 text-blue-400/50 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Live overlay map — WebGL render hook ready</p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Mapbox GL / Leaflet integration point</p>
          </div>
          {/* Corner badge */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            {['Z2','Z4','Z5','Z4+'].map((z, i) => (
              <span key={i} className={`badge text-[9px] px-1.5 py-0.5 rounded-md ${
                z === 'Z2' ? 'bg-cyan-500/20 text-cyan-400' :
                z === 'Z4' ? 'bg-violet-500/20 text-violet-400' :
                z === 'Z5' ? 'bg-red-500/20 text-red-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>{z}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay toggles */}
      <PlaceholderCard title="Overlay Layers" description="Toggle which data streams appear on your ride map" icon={Layers} accent="violet">
        <div className="mt-3 space-y-2">
          {OVERLAY_OPTIONS.map(o => {
            const Icon = o.icon;
            const isOn = overlays[o.id];
            return (
              <div
                key={o.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-150 ${
                  isOn ? ACCENT_MAP[o.color] : 'border-white/[0.04] bg-white/[0.02]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isOn ? '' : 'text-muted-foreground/50'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-semibold ${isOn ? 'text-foreground' : 'text-muted-foreground'}`}>{o.label}</p>
                  <p className="text-[10px] text-muted-foreground/70 truncate">{o.desc}</p>
                </div>
                <button
                  onClick={() => toggle(o.id)}
                  className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${isOn ? 'bg-blue-500' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${isOn ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </PlaceholderCard>

      {/* Power zone legend */}
      <div className="glass-card rounded-xl border border-white/[0.06] p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-3">Power Zone Reference</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[
            { zone: 'Z1', label: 'Active Recovery', color: 'bg-cyan-400',   pct: '<55%' },
            { zone: 'Z2', label: 'Endurance',        color: 'bg-blue-400',   pct: '56–75%' },
            { zone: 'Z3', label: 'Tempo',             color: 'bg-green-400',  pct: '76–90%' },
            { zone: 'Z4', label: 'Threshold',         color: 'bg-amber-400',  pct: '91–105%' },
            { zone: 'Z5', label: 'VO2 Max',           color: 'bg-orange-400', pct: '106–120%' },
            { zone: 'Z6', label: 'Anaerobic',         color: 'bg-red-400',    pct: '>121%' },
          ].map(z => (
            <div key={z.zone} className="text-center">
              <div className={`h-2 rounded-full ${z.color} mb-1.5`} />
              <p className="text-[10px] font-bold text-foreground">{z.zone}</p>
              <p className="text-[9px] text-muted-foreground leading-tight">{z.label}</p>
              <p className="text-[9px] text-muted-foreground/60 font-mono">{z.pct}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-xl border border-dashed border-violet-500/20 text-center">
        <p className="text-xs text-muted-foreground">WebGL overlay rendering, real-time segment comparison, and live heatmap — Mapbox GL and Garmin CIQ integration hook ready.</p>
      </div>
    </div>
  );
}