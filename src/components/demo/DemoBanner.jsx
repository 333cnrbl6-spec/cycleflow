import { FlaskConical, RefreshCw, X } from 'lucide-react';
import { useDemo } from '@/lib/DemoContext';

/**
 * Thin banner shown at the top of every page when Demo Mode is active.
 */
export default function DemoBanner() {
  const { demoMode, toggleDemo, regenerate } = useDemo();
  if (!demoMode) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2
                    bg-violet-500/10 border-b border-violet-500/25
                    text-violet-300 text-xs font-medium select-none">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" />
        <span>
          <span className="font-bold text-violet-200">Demo Mode</span>
          {' '}— all data is simulated client-side. No backend calls are made.
        </span>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={regenerate}
          title="Regenerate data"
          className="flex items-center gap-1 px-2.5 py-1 rounded-md
                     bg-violet-500/15 hover:bg-violet-500/25 text-violet-300
                     transition-colors text-[11px] font-semibold"
        >
          <RefreshCw className="w-3 h-3" /> Randomise
        </button>
        <button
          onClick={toggleDemo}
          title="Exit demo mode"
          className="p-1.5 rounded-md hover:bg-violet-500/20 text-violet-400 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}