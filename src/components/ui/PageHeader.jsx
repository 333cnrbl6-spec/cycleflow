import { cn } from '@/lib/utils';

/**
 * Standardized page header used on every CycleFlow page.
 * Accepts an optional right-side slot via children.
 */
export default function PageHeader({ title, subtitle, icon: Icon, iconColor = 'text-blue-400', children }) {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div className={cn(
            'flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center',
            'bg-white/5 border border-white/10',
            iconColor
          )}>
            <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-foreground font-heading leading-tight truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{subtitle}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">{children}</div>
      )}
    </div>
  );
}