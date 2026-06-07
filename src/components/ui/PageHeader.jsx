import { cn } from '@/lib/utils';

/**
 * Standardised page header — used on every CycleFlow page.
 * `children` → optional right-side slot (badges, buttons, etc.)
 */
export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-400',
  children,
  className,
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-7', className)}>
      {/* Left: icon + text */}
      <div className="flex items-center gap-3.5 min-w-0">
        {Icon && (
          <div
            className={cn(
              'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
              'bg-white/[0.06] border border-white/[0.09] transition-colors duration-200',
              iconColor,
            )}
            aria-hidden="true"
          >
            <Icon className="w-[18px] h-[18px]" strokeWidth={1.75} aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground font-heading leading-tight tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right slot */}
      {children && (
        <div className="flex items-center gap-2.5 flex-shrink-0 pt-1">
          {children}
        </div>
      )}
    </div>
  );
}