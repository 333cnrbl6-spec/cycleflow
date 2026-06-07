import { FlaskConical, RefreshCw, X } from 'lucide-react';
import { useDemo } from '@/lib/DemoContext';

/**
 * Prominent banner shown below TopBar when Demo Mode is active.
 */
export default function DemoBanner() {
  const { demoMode, toggleDemo, regenerate } = useDemo();
  if (!demoMode) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-between gap-3 px-4 py-2.5
                 bg-violet-900/50 border-b-2 border-violet-500/40
                 slide-down"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse flex-shrink-0" aria-hidden="true" />
        <FlaskConical className="w-4 h-4 flex-shrink-0 text-violet-300" aria-hidden="true" />
        <span className="text-sm font-medium text-violet-200 truncate">
          <span className="font-bold">Demo Mode active</span>
          <span className="hidden sm:inline text-violet-300/80">
            {' '}— all data is simulated. No backend calls are made.
          </span>
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={regenerate}
          aria-label="Regenerate demo data"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg min-h-[36px]
                     bg-violet-500/20 hover:bg-violet-500/35 text-violet-200
                     text-xs font-semibold transition-colors duration-150
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Regenerate</span>
        </button>
        <button
          onClick={toggleDemo}
          aria-label="Exit Demo Mode"
          className="flex items-center justify-center w-9 h-9 rounded-lg min-h-[36px]
                     hover:bg-violet-500/25 text-violet-300 hover:text-violet-100
                     transition-colors duration-150
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}