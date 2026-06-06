import { cn } from '@/lib/utils';
import { Timer, Trophy, Flag } from 'lucide-react';
import { formatElapsed } from '@/hooks/useRideSimulation';

export default function SegmentPopup({ activeSegment, segmentProgress, finishedSegment }) {
  if (finishedSegment) {
    const faster = finishedSegment.yourTime < finishedSegment.komTime;
    return (
      <div className="pointer-events-none absolute bottom-4 right-4 z-30 page-enter">
        <div className="glass-card rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 w-52 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">Segment Complete</span>
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">{finishedSegment.name}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Your time</span>
            <span className={cn('font-mono font-bold', faster ? 'text-green-400' : 'text-blue-400')}>
              {Math.floor(finishedSegment.yourTime / 60)}:{String(finishedSegment.yourTime % 60).padStart(2,'0')}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-0.5">
            <span className="text-muted-foreground">KOM</span>
            <span className="font-mono text-amber-400">
              {Math.floor(finishedSegment.komTime / 60)}:{String(finishedSegment.komTime % 60).padStart(2,'0')}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-0.5">
            <span className="text-muted-foreground">Your rank</span>
            <span className="font-mono font-bold text-violet-400">#{finishedSegment.rank}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!activeSegment) return null;

  return (
    <div className="pointer-events-none absolute bottom-4 right-4 z-30 page-enter">
      <div className="glass-card rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 w-48 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Flag className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">On Segment</span>
        </div>
        <p className="text-sm font-semibold text-foreground mb-2">{activeSegment.name}</p>
        <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
          <div
            className="h-1.5 bg-blue-500 rounded-full transition-all duration-1000"
            style={{ width: `${Math.round(segmentProgress * 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 text-right">
          {Math.round(segmentProgress * 100)}% complete
        </p>
      </div>
    </div>
  );
}