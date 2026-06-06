import { cn } from '@/lib/utils';
import { Zap, TrendingDown, TrendingUp, ArrowUpRight } from 'lucide-react';

const TYPE_CFG = {
  boost:  { icon: TrendingUp,  color: 'text-cyan-400',   border: 'border-cyan-500/30',  bg: 'bg-cyan-500/10'  },
  reduce: { icon: TrendingDown,color: 'text-amber-400',  border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  fair:   { icon: ArrowUpRight,color: 'text-violet-400', border: 'border-violet-500/30',bg: 'bg-violet-500/10'},
};

export default function AssistOverlay({ message }) {
  if (!message) return null;
  const cfg = TYPE_CFG[message.type] || TYPE_CFG.fair;
  const Icon = cfg.icon;

  return (
    <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 z-30 page-enter">
      <div className={cn(
        'flex items-center gap-2.5 px-4 py-2.5 rounded-xl border backdrop-blur-md shadow-xl',
        cfg.bg, cfg.border,
      )}>
        <Zap className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
        <Icon className={cn('w-3.5 h-3.5 flex-shrink-0', cfg.color)} />
        <span className={cn('text-xs font-semibold', cfg.color)}>{message.msg}</span>
      </div>
    </div>
  );
}