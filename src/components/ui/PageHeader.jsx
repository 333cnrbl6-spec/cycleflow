import { cn } from '@/lib/utils';

/**
 * Standardised page header used on every CycleFlow page.
 * children → optional right-side slot (badges, buttons, etc.)
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
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      {/* Left: icon + text */}
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className={cn(
            'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center',
            'bg-white/[0.05] border border-white/[0.07] transition-colors duration-200',
            iconColor,
          )}>
            <Icon className="w-[17px] h-[17px]" strokeWidth={1.75} />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-[17px] font-bold text-foreground font-heading leading-tight tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] text-muted-foreground/75 mt-0.5 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: slot */}
      {children && (
        <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
          {children}
        </div>
      )}
    </div>
  );
}