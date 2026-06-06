import { cn } from '@/lib/utils';

export default function PageHeader({ title, subtitle, icon: Icon, iconColor = 'text-blue-400', children }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn('p-2 rounded-lg bg-white/5 border border-white/10', iconColor)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-foreground font-heading">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}