import { useEffect, useRef } from 'react';
import { Map, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * RideMap — Azure Maps placeholder integration.
 * Renders a stylised canvas polyline of the demo ride route.
 * No backend calls. UI-only simulation.
 */

// Demo route: rough lat/lng pairs forming a loop (normalised to canvas coords below)
const DEMO_ROUTE = [
  [0.10, 0.80], [0.18, 0.62], [0.22, 0.45], [0.30, 0.32],
  [0.42, 0.22], [0.55, 0.18], [0.68, 0.24], [0.78, 0.35],
  [0.82, 0.50], [0.76, 0.65], [0.65, 0.74], [0.52, 0.78],
  [0.38, 0.76], [0.25, 0.82], [0.14, 0.88], [0.10, 0.80],
];

// Dot positions along the route for visual interest
const POI = [
  { x: 0.22, y: 0.45, label: 'Summit', color: '#f59e0b' },
  { x: 0.55, y: 0.18, label: 'KOM',    color: '#22d3ee' },
  { x: 0.76, y: 0.65, label: 'Sprint', color: '#a78bfa' },
];

function drawMap(canvas, dpr, prefersReducedMotion) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width  / dpr;
  const H = canvas.height / dpr;

  // Background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#08111f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid lines
  ctx.strokeStyle = 'rgba(30,64,175,0.12)';
  ctx.lineWidth = 1;
  const step = 40 * dpr;
  for (let x = 0; x < canvas.width; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // Route glow shadow
  ctx.save();
  ctx.shadowColor = 'rgba(59,130,246,0.35)';
  ctx.shadowBlur  = 18 * dpr;

  // Route polyline
  ctx.beginPath();
  DEMO_ROUTE.forEach(([rx, ry], i) => {
    const px = rx * W * dpr;
    const py = ry * H * dpr;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth   = 3 * dpr;
  ctx.lineJoin    = 'round';
  ctx.lineCap     = 'round';
  ctx.stroke();
  ctx.restore();

  // Completed portion (first 60%) in brighter blue
  ctx.beginPath();
  const splitIdx = Math.floor(DEMO_ROUTE.length * 0.6);
  DEMO_ROUTE.slice(0, splitIdx + 1).forEach(([rx, ry], i) => {
    const px = rx * W * dpr;
    const py = ry * H * dpr;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  });
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth   = 3 * dpr;
  ctx.stroke();

  // POI dots
  POI.forEach(({ x, y, color }) => {
    const px = x * W * dpr;
    const py = y * H * dpr;
    ctx.beginPath();
    ctx.arc(px, py, 5 * dpr, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur  = 10 * dpr;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Rider dot (at ~60% progress)
  const [rx, ry] = DEMO_ROUTE[splitIdx];
  const px = rx * W * dpr;
  const py = ry * H * dpr;

  // Pulse ring
  if (!prefersReducedMotion) {
    ctx.beginPath();
    ctx.arc(px, py, 10 * dpr, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(59,130,246,0.18)';
    ctx.fill();
  }

  // Rider circle
  ctx.beginPath();
  ctx.arc(px, py, 6 * dpr, 0, Math.PI * 2);
  ctx.fillStyle = '#3b82f6';
  ctx.shadowColor = '#3b82f6';
  ctx.shadowBlur  = 12 * dpr;
  ctx.fill();
  ctx.strokeStyle = '#0d1524';
  ctx.lineWidth = 2 * dpr;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Start / finish markers
  [[DEMO_ROUTE[0], '#22c55e', 'S'], [DEMO_ROUTE[DEMO_ROUTE.length - 1], '#ef4444', 'F']].forEach(([[mrx, mry], color, letter]) => {
    const mx = mrx * W * dpr;
    const my = mry * H * dpr;
    ctx.beginPath();
    ctx.arc(mx, my, 7 * dpr, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${9 * dpr}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, mx, my);
  });
}

export default function RideMap({ demoMode = false, className }) {
  const canvasRef = useRef(null);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      drawMap(canvas, dpr, prefersReducedMotion);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [prefersReducedMotion]);

  return (
    <div
      className={cn(
        'glass-card rounded-xl border border-white/[0.07] overflow-hidden',
        'transition-all duration-200 ease-out',
        'hover:border-white/[0.18] hover:shadow-[0_8px_32px_rgba(0,0,0,0.28)]',
        !prefersReducedMotion && 'fade-in',
        className,
      )}
      role="img"
      aria-label="Demo ride route map — simulated polyline route"
    >
      {/* Map header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-blue-400" aria-hidden="true" />
          <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-[0.08em]">Ride Route</span>
        </div>
        <div className="flex items-center gap-2">
          {demoMode && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full">
              <span className="w-1 h-1 bg-amber-400 rounded-full" aria-hidden="true" />
              Demo Route
            </span>
          )}
          <div
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.10] transition-colors cursor-default"
            aria-label="Compass — North up"
            title="North up"
            tabIndex={0}
          >
            <Compass className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Canvas map */}
      <div className="relative" style={{ height: 220 }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          tabIndex={0}
          aria-label="Ride route polyline — 38.1 km loop with summit, KOM, and sprint segments"
          style={{ outline: 'none' }}
          onFocus={e => { e.currentTarget.style.boxShadow = 'inset 0 0 0 2px hsl(217 91% 60%)'; }}
          onBlur={e => { e.currentTarget.style.boxShadow = ''; }}
        />

        {/* Zoom controls */}
        <div className="absolute top-3 right-3 flex flex-col gap-1" role="group" aria-label="Zoom controls">
          {['+', '−'].map(z => (
            <button
              key={z}
              disabled
              aria-label={z === '+' ? 'Zoom in (placeholder)' : 'Zoom out (placeholder)'}
              className="w-7 h-7 rounded-lg bg-[#0d1524]/90 border border-white/[0.12] text-foreground/80 text-sm font-bold flex items-center justify-center hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 transition-colors"
            >
              {z}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 px-2.5 py-1.5 rounded-lg bg-[#0d1524]/80 border border-white/[0.08] backdrop-blur-sm">
          <div className="flex items-center gap-1.5"><div className="w-3 h-[2px] bg-[#60a5fa] rounded-full" /><span className="text-[10px] text-muted-foreground">Completed</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-[2px] bg-[#3b82f6]/50 rounded-full" /><span className="text-[10px] text-muted-foreground">Remaining</span></div>
        </div>
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.06] border-t border-white/[0.06]">
        {[
          { label: 'Total',    value: '38.1 km' },
          { label: 'Elapsed', value: '1:42:08' },
          { label: 'Remain',  value: '0.0 km' },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center py-2.5 px-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.07em] text-muted-foreground/70">{label}</span>
            <span className="text-[13px] font-mono font-semibold text-foreground/90 mt-0.5">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}