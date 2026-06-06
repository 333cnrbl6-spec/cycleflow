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
      <div className={cn('w-0.5 h-3.5 rounded-full flex-shrink-0', BAR[accent])} />
      <h2 className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-muted-foreground/65 font-heading leading-none">
        {label}
      </h2>
      {right && (
        <div className="ml-auto flex items-center gap-2">{right}</div>
      )}
    </div>
  );
}