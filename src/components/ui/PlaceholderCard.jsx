import { cn } from '@/lib/utils';

const BORDER = {
  blue:   'border-blue-500/20   bg-blue-500/[0.03]',
  cyan:   'border-cyan-500/20   bg-cyan-500/[0.03]',
  red:    'border-red-500/25    bg-red-500/[0.04]',
  amber:  'border-amber-500/20  bg-amber-500/[0.03]',
  violet: 'border-violet-500/20 bg-violet-500/[0.03]',
  orange: 'border-orange-500/20 bg-orange-500/[0.03]',
  green:  'border-green-500/20  bg-green-500/[0.03]',
};

const ICON_COLOR = {
  blue:   'text-blue-400',
  cyan:   'text-cyan-400',
  red:    'text-red-400',
  amber:  'text-amber-400',
  violet: 'text-violet-400',
  orange: 'text-orange-400',
  green:  'text-green-400',
};

/**
 * General-purpose content card with CycleFlow accent border.
 */
export default function PlaceholderCard({
  title,
  description,
  icon: Icon,
  children,
  className,
  accent = 'blue',
}) {
  return (
    <div className={cn(
      'rounded-xl border p-5 glass-card',
      'transition-all duration-200',
      BORDER[accent],
      className,
    )}>
      {(Icon || title) && (
        <div className="flex items-start gap-3 mb-4">
          {Icon && (
            <div className={cn('flex-shrink-0 mt-0.5', ICON_COLOR[accent])} aria-hidden="true">
              <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
            </div>
          )}
          <div className="min-w-0">
            {title && (
              <h3 className="text-[15px] font-semibold text-foreground leading-tight font-heading">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-1 leading-snug">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}