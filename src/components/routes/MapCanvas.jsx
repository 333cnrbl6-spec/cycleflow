import { cn } from '@/lib/utils';
import { Map, MapPin } from 'lucide-react';

/**
 * Simulated map canvas — draws a stylised grid with waypoint pins and a
 * simulated road-snapped polyline between them.  No real map library used.
 */
export default function MapCanvas({ waypoints, activeWp, onCanvasClick }) {
  // Map waypoints to x/y percentages across a fixed 600×400 virtual viewport
  const VP_W = 600, VP_H = 400;
  const BASE_LAT = 51.505, BASE_LNG = -0.09, SCALE = 2000;

  const toXY = (lat, lng) => ({
    x: ((lng - BASE_LNG) * SCALE + VP_W * 0.15) / VP_W * 100,
    y: (((BASE_LAT - lat) * SCALE) + VP_H * 0.2) / VP_H * 100,
  });

  const pts = waypoints.map(wp => ({ ...wp, ...toXY(wp.lat, wp.lng) }));

  const handleClick = (e) => {
    if (!onCanvasClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    const lat = BASE_LAT - ((yPct * VP_H - VP_H * 0.2) / SCALE);
    const lng = BASE_LNG + ((xPct * VP_W - VP_W * 0.15) / SCALE);
    onCanvasClick(lat, lng);
  };

  return (
    <div
      className="relative w-full h-full bg-[#060d1a] overflow-hidden cursor-crosshair select-none"
      onClick={handleClick}
    >
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

      {/* Simulated "roads" — static decorative lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Road network */}
        <path d="M 0 45 Q 20 42 40 44 Q 60 46 80 43 Q 90 42 100 44"
          stroke="#1e3a5f" strokeWidth="0.6" fill="none" />
        <path d="M 15 0 Q 17 20 16 40 Q 15 60 18 80 Q 19 90 17 100"
          stroke="#1e3a5f" strokeWidth="0.5" fill="none" />
        <path d="M 0 70 Q 25 68 50 72 Q 75 74 100 70"
          stroke="#1e3a5f" strokeWidth="0.4" fill="none" />
        <path d="M 60 0 Q 58 30 62 60 Q 64 80 60 100"
          stroke="#1e3a5f" strokeWidth="0.4" fill="none" />
        {/* Terrain fills */}
        <ellipse cx="75" cy="30" rx="12" ry="8" fill="#0a2010" opacity="0.6" />
        <ellipse cx="30" cy="65" rx="15" ry="7" fill="#0a2010" opacity="0.4" />
        <ellipse cx="50" cy="15" rx="10" ry="6" fill="#0a1830" opacity="0.5" />
      </svg>

      {/* Route polyline */}
      {pts.length >= 2 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <filter id="routeGlow">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Shadow */}
          <polyline
            points={pts.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeOpacity="0.2"
            strokeLinecap="round" strokeLinejoin="round"
          />
          {/* Main line */}
          <polyline
            points={pts.map(p => `${p.x},${p.y}`).join(' ')}
            fill="none" stroke="#3b82f6" strokeWidth="0.9"
            strokeLinecap="round" strokeLinejoin="round"
            filter="url(#routeGlow)"
            strokeDasharray="none"
          />
          {/* Simulated snap jog (micro offsets every leg midpoint) */}
          {pts.slice(0, -1).map((p, i) => {
            const q = pts[i + 1];
            const mx = (p.x + q.x) / 2 + (i % 2 === 0 ? 0.8 : -0.8);
            const my = (p.y + q.y) / 2 + 0.5;
            return (
              <circle key={i} cx={mx} cy={my} r="0.4"
                fill="#22d3ee" opacity="0.5" />
            );
          })}
        </svg>
      )}

      {/* Waypoint pins */}
      {pts.map((wp, i) => (
        <div
          key={wp.id}
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none"
          style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
        >
          <div className={cn(
            'flex flex-col items-center',
            activeWp === wp.id && 'scale-125',
            'transition-transform duration-150',
          )}>
            <div className={cn(
              'w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-lg',
              wp.type === 'start' ? 'bg-green-500 border-green-300 text-white' :
              wp.type === 'end'   ? 'bg-red-500   border-red-300   text-white' :
                                    'bg-blue-500  border-blue-300  text-white',
            )}>
              {wp.type === 'start' ? 'S' : wp.type === 'end' ? 'E' : i}
            </div>
            <div className={cn(
              'w-0.5 h-2',
              wp.type === 'start' ? 'bg-green-500' :
              wp.type === 'end'   ? 'bg-red-500'   : 'bg-blue-500',
            )} />
          </div>
        </div>
      ))}

      {/* Empty state */}
      {waypoints.length === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center mb-3">
            <Map className="w-7 h-7 text-blue-400/50" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">Click the map to add waypoints</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Or load a Demo route below</p>
        </div>
      )}

      {/* Attribution badge */}
      <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 rounded text-[9px] text-muted-foreground/50 pointer-events-none">
        Simulated map — React Leaflet ready
      </div>
    </div>
  );
}