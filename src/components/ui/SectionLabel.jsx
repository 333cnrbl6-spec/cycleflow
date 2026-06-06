import { cn } from '@/lib/utils';

const BAR = {
  blue:   'bg-blue-500',
  cyan:   'bg-cyan-500',
  violet: 'bg-violet-500',
  amber:  'bg-amber-500',
  green:  'bg-green-500',
  red:    'bg-red-500',
  orange: 'bg-orange-500',
};

/**
 * Standardised section-heading strip used across all CycleFlow pages.
 * <SectionLabel accent="blue" label="Live Metrics" right={<span>…</span>} />
 */
export default function SectionLabel({ label, accent = 'blue', right, className }) {
  return (
    <div className={cn('flex items-center gap-2.5 mb-4', className)}>
      <div className={cn('w-px h-4 rounded-full flex-shrink-0', BAR[accent])} />
      <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/75 font-heading">
        {label}
      </h2>
      {right && (
        <div className="ml-auto flex items-center gap-2">{right}</div>
      )}
    </div>
  );
}