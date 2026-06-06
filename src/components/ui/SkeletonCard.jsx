import { cn } from '@/lib/utils';

/** Shimmer line — used inside skeleton layouts */
export function SkeletonLine({ className }) {
  return (
    <div className={cn(
      'rounded skeleton-shimmer',
      className,
    )} />
  );
}

/** Full-card skeleton — matches PlaceholderCard dimensions */
export function SkeletonCard({ className, rows = 3, height = 'h-32' }) {
  return (
    <div className={cn(
      'rounded-xl border border-white/[0.04] bg-white/[0.02] p-5',
      className,
    )}>
      <div className="flex items-center gap-2.5 mb-4">
        <SkeletonLine className="w-4 h-4 rounded-md flex-shrink-0" />
        <SkeletonLine className="h-3 w-36" />
      </div>
      {rows > 0 && (
        <div className="space-y-2.5">
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonLine key={i} className={cn('h-3', i === rows - 1 ? 'w-2/3' : 'w-full')} />
          ))}
        </div>
      )}
      {height && <SkeletonLine className={cn('mt-4 w-full rounded-lg', height)} />}
    </div>
  );
}

/** Stat block skeleton */
export function SkeletonStat({ className }) {
  return (
    <div className={cn(
      'glass-card rounded-xl border border-white/[0.04] p-4',
      className,
    )}>
      <SkeletonLine className="h-2.5 w-20 mb-3" />
      <SkeletonLine className="h-7 w-16 mb-2" />
      <SkeletonLine className="h-2 w-24" />
    </div>
  );
}

/** Table skeleton */
export function SkeletonTable({ rows = 4, cols = 4, className }) {
  return (
    <div className={cn('glass-card rounded-xl border border-white/[0.04] overflow-hidden', className)}>
      <div className="px-4 py-3 border-b border-border/40 flex gap-6">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonLine key={i} className="h-2.5 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3 border-b border-border/20 flex gap-6">
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonLine key={j} className={cn('h-3 flex-1', j === 0 ? 'w-1/3' : '')} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default SkeletonCard;