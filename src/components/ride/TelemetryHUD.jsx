import { cn } from '@/lib/utils';
import { effortZone, formatElapsed } from '@/hooks/useRideSimulation';

const ZONE_COLORS = {
  easy:      { speed: 'text-green-400',  power: 'text-green-400',  hr: 'text-green-400'  },
  tempo:     { speed: 'text-blue-400',   power: 'text-blue-400',   hr: 'text-blue-400'   },
  threshold: { speed: 'text-amber-400',  power: 'text-amber-400',  hr: 'text-amber-400'  },
  max:       { speed: 'text-red-400',    power: 'text-red-400',    hr: 'text-red-400'    },
};

function Metric({ label, value, unit, color = 'text-foreground', large = false }) {
  return (
    <div className="flex flex-col items-center">
      <span className={cn('font-mono font-bold leading-none', large ? 'text-4xl' : 'text-2xl', color)}>
        {value}
      </span>
      {unit && <span className="text-[9px] text-muted-foreground/70 mt-0.5">{unit}</span>}
      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 mt-0.5">{label}</span>
    </div>
  );
}

export default function TelemetryHUD({ state, dim = false }) {
  const { speed, hr, power, cadence, hcp, battery, range, elapsed, distance, gradient } = state;
  const zone = effortZone(power);
  const zc = ZONE_COLORS[zone];

  return (
    <div className={cn('transition-opacity duration-500', dim && 'opacity-40')}>
      {/* Primary strip */}
      <div className="glass-card rounded-xl border border-white/[0.07] px-4 py-3 flex items-center justify-between gap-2 mb-2">
        <Metric label="Speed" value={speed} unit="km/h" color={zc.speed} large />
        <div className="w-px h-10 bg-border/50" />
        <Metric label="Distance" value={distance} unit="km" color="text-blue-400" large />
        <div className="w-px h-10 bg-border/50" />
        <Metric label="Time" value={formatElapsed(elapsed)} color="text-foreground" large />
        <div className="w-px h-10 bg-border/50" />
        <Metric label="Gradient" value={`${gradient > 0 ? '+' : ''}${gradient}%`} color={gradient > 3 ? 'text-red-400' : gradient > 0 ? 'text-amber-400' : 'text-green-400'} large />
      </div>

      {/* Secondary strip */}
      <div className="glass-card rounded-xl border border-white/[0.07] px-4 py-3 grid grid-cols-6 gap-2">
        <Metric label="HR"      value={hr}       unit="bpm" color={zc.hr} />
        <Metric label="Power"   value={power}    unit="W"   color={zc.power} />
        <Metric label="Cadence" value={cadence}  unit="rpm" color="text-violet-400" />
        <Metric label="HCP"     value={hcp}      unit="pts" color="text-cyan-400" />
        <Metric label="Battery" value={`${battery}%`} color={battery < 20 ? 'text-red-400' : 'text-green-400'} />
        <Metric label="Range"   value={`${range}km`}  color="text-muted-foreground" />
      </div>

      {/* Zone badge */}
      <div className="flex justify-end mt-1.5">
        <span className={cn('text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border', {
          'border-green-500/30 bg-green-500/10 text-green-400': zone === 'easy',
          'border-blue-500/30 bg-blue-500/10 text-blue-400': zone === 'tempo',
          'border-amber-500/30 bg-amber-500/10 text-amber-400': zone === 'threshold',
          'border-red-500/30 bg-red-500/10 text-red-400': zone === 'max',
        })}>
          Zone: {zone}
        </span>
      </div>
    </div>
  );
}