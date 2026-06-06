import { cn } from '@/lib/utils';

const ACCENT_COLORS = {
  blue:   'bg-blue-500',
  cyan:   'bg-cyan-500',
  violet: 'bg-violet-500',
  amber:  'bg-amber-500',
  green:  'bg-green-500',
  red:    'bg-red-500',
  orange: 'bg-orange-500',
};

/**
 * Standardized section heading for use across all CycleFlow pages.
 * Usage: <SectionLabel accent="blue" label="Live Metrics" right={<span>…</span>} />
 */
export default function SectionLabel({ label, accent = 'blue', right, className }) {
  return (
    <div className={cn('flex items-center gap-2.5 mb-4', className)}>
      <div className={cn('w-0.5 h-4 rounded-full flex-shrink-0', ACCENT_COLORS[accent])} />
      <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80 font-heading">
        {label}
      </h2>
      {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
    </div>
  );
}