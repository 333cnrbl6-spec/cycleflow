import { FlaskConical, RefreshCw, X } from 'lucide-react';
import { useDemo } from '@/lib/DemoContext';

/**
 * Thin banner shown below the TopBar when Demo Mode is active.
 * Animates in/out with a smooth slide-down.
 */
export default function DemoBanner() {
  const { demoMode, toggleDemo, regenerate } = useDemo();
  if (!demoMode) return null;

  return (
    <div
      className="flex items-center justify-between gap-3 px-4 py-2
                 bg-violet-500/10 border-b border-violet-500/25
                 text-violet-300 text-xs font-medium select-none
                 animate-[slideDown_0.2s_ease-out]"
    >
      <div className="flex items-center gap-2 min-w-0">
        <FlaskConical className="w-3.5 h-3.5 flex-shrink-0 text-violet-400" />
        <span className="truncate">
          <span className="font-bold text-violet-200">Demo Mode</span>
          <span className="hidden sm:inline text-violet-300/80">
            {' '}— all data is simulated client-side. No backend calls are made.
          </span>
        </span>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={regenerate}
          title="Regenerate data"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md
                     bg-violet-500/15 hover:bg-violet-500/30 text-violet-300
                     transition-colors duration-150 text-[11px] font-semibold"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">Randomise</span>
        </button>
        <button
          onClick={toggleDemo}
          title="Exit demo mode"
          className="p-1.5 rounded-md hover:bg-violet-500/20 text-violet-400
                     transition-colors duration-150"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}