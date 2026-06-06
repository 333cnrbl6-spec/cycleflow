import { PauseCircle } from 'lucide-react';

export default function AutoPauseBadge({ visible }) {
  if (!visible) return null;
  return (
    <div className="pointer-events-none absolute top-4 right-4 z-30 page-enter">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 backdrop-blur-md">
        <PauseCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Auto-Paused</span>
      </div>
    </div>
  );
}