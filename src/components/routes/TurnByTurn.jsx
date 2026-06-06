import { useState } from 'react';
import { Navigation, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TurnByTurn({ turns }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? turns : turns.slice(0, 4);

  return (
    <div className="glass-card rounded-xl border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            Turn-by-Turn Preview
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">{turns.length} directions</span>
      </div>

      <div className="divide-y divide-border/30">
        {visible.map((t, i) => (
          <div
            key={t.idx}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 transition-colors',
              i === 0 ? 'bg-blue-500/5' : 'hover:bg-white/[0.02]',
            )}
          >
            {/* Direction icon */}
            <div className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0',
              i === 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-muted-foreground',
            )}>
              {t.icon}
            </div>
            {/* Instruction */}
            <p className={cn(
              'flex-1 text-xs leading-snug min-w-0',
              i === 0 ? 'text-foreground font-medium' : 'text-muted-foreground',
            )}>
              {t.instruction}
            </p>
            {/* Distance marker */}
            <span className="text-[10px] font-mono text-muted-foreground/60 flex-shrink-0">
              {t.dist}
            </span>
          </div>
        ))}
      </div>

      {turns.length > 4 && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full py-2.5 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1.5 border-t border-border/30 hover:bg-white/[0.02]"
        >
          {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</> : <><ChevronDown className="w-3.5 h-3.5" /> Show {turns.length - 4} more steps</>}
        </button>
      )}
    </div>
  );
}