import { cn } from '@/lib/utils';

const ACCENT_BORDER = {
  blue:   'border-blue-500/20   bg-blue-500/[0.04]',
  cyan:   'border-cyan-500/20   bg-cyan-500/[0.04]',
  red:    'border-red-500/25    bg-red-500/[0.06]',
  amber:  'border-amber-500/20  bg-amber-500/[0.04]',
  violet: 'border-violet-500/20 bg-violet-500/[0.04]',
  orange: 'border-orange-500/20 bg-orange-500/[0.04]',
  green:  'border-green-500/20  bg-green-500/[0.04]',
};

const ACCENT_ICON = {
  blue:   'text-blue-400',
  cyan:   'text-cyan-400',
  red:    'text-red-400',
  amber:  'text-amber-400',
  violet: 'text-violet-400',
  orange: 'text-orange-400',
  green:  'text-green-400',
};

/**
 * General-purpose content card with consistent border, background, and icon treatment.
 */
export default function PlaceholderCard({ title, description, icon: Icon, children, className, accent = 'blue' }) {
  return (
    <div className={cn(
      'rounded-xl border p-5 glass-card transition-all duration-200 hover:border-blue-500/25',
      ACCENT_BORDER[accent],
      className
    )}>
      {(Icon || title) && (
        <div className="flex items-start gap-3 mb-3">
          {Icon && (
            <div className={cn('mt-0.5 flex-shrink-0', ACCENT_ICON[accent])}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div className="min-w-0">
            {title && (
              <h3 className="text-sm font-semibold text-foreground leading-tight">{title}</h3>
            )}
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{description}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}