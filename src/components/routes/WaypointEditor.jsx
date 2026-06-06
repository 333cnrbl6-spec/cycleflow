import { useState } from 'react';
import { GripVertical, X, Plus, MapPin, Flag, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_CONFIG = {
  start: { icon: Navigation, color: 'text-green-400',  bg: 'bg-green-500/10',  label: 'Start' },
  via:   { icon: MapPin,     color: 'text-blue-400',   bg: 'bg-blue-500/10',   label: 'Via' },
  end:   { icon: Flag,       color: 'text-red-400',    bg: 'bg-red-500/10',    label: 'Finish' },
};

export default function WaypointEditor({ waypoints, activeWp, onSelect, onChange }) {
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const addWaypoint = () => {
    const seed = Date.now();
    const newWp = {
      id: `wp-${seed}`,
      label: `Waypoint ${String.fromCharCode(64 + waypoints.filter(w => w.type === 'via').length + 1)}`,
      lat: 51.505 + Math.random() * 0.02 - 0.01,
      lng: -0.09  + Math.random() * 0.03 - 0.015,
      type: 'via',
    };
    const last = waypoints.findIndex(w => w.type === 'end');
    const next = [...waypoints];
    if (last > -1) next.splice(last, 0, newWp);
    else next.push(newWp);
    onChange(next);
  };

  const remove = (id) => {
    const next = waypoints.filter(w => w.id !== id);
    if (next.length > 0) {
      next[0].type = 'start';
      next[next.length - 1].type = 'end';
      next.slice(1, -1).forEach(w => w.type = 'via');
    }
    onChange(next);
  };

  const handleDragStart = (e, id) => {
    setDragging(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return; }
    const next = [...waypoints];
    const fromIdx = next.findIndex(w => w.id === dragging);
    const toIdx   = next.findIndex(w => w.id === targetId);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    // Re-assign types
    next.forEach((w, i) => {
      w.type = i === 0 ? 'start' : i === next.length - 1 ? 'end' : 'via';
    });
    onChange(next);
    setDragging(null);
    setDragOver(null);
  };

  const updateLabel = (id, label) => {
    onChange(waypoints.map(w => w.id === id ? { ...w, label } : w));
  };

  return (
    <div className="space-y-1.5">
      {waypoints.map((wp, i) => {
        const cfg = TYPE_CONFIG[wp.type];
        const Icon = cfg.icon;
        const isDraggingThis = dragging === wp.id;
        const isOver = dragOver === wp.id;

        return (
          <div
            key={wp.id}
            draggable
            onDragStart={e => handleDragStart(e, wp.id)}
            onDragOver={e => { e.preventDefault(); setDragOver(wp.id); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => handleDrop(e, wp.id)}
            onClick={() => onSelect(wp.id)}
            className={cn(
              'flex items-center gap-2.5 p-2.5 rounded-lg border transition-all duration-150 cursor-pointer group',
              activeWp === wp.id
                ? 'border-blue-500/40 bg-blue-500/10'
                : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]',
              isDraggingThis && 'opacity-40',
              isOver && 'border-blue-500/50 bg-blue-500/10',
            )}
          >
            {/* Drag handle */}
            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 flex-shrink-0 cursor-grab active:cursor-grabbing" />

            {/* Type icon */}
            <div className={cn('w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0', cfg.bg)}>
              <Icon className={cn('w-3.5 h-3.5', cfg.color)} />
            </div>

            {/* Label input */}
            <input
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/50 outline-none min-w-0"
              value={wp.label}
              onChange={e => { e.stopPropagation(); updateLabel(wp.id, e.target.value); }}
              onClick={e => e.stopPropagation()}
            />

            {/* Type badge */}
            <span className={cn('text-[9px] font-bold uppercase tracking-wider flex-shrink-0', cfg.color)}>
              {cfg.label}
            </span>

            {/* Remove (only for via points) */}
            {wp.type === 'via' && (
              <button
                onClick={e => { e.stopPropagation(); remove(wp.id); }}
                className="p-0.5 text-muted-foreground/40 hover:text-red-400 transition-colors flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}

      {/* Add waypoint */}
      <button
        onClick={addWaypoint}
        className="w-full py-2 rounded-lg border border-dashed border-blue-500/25 text-xs text-blue-400/70 hover:text-blue-400 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" /> Add Waypoint
      </button>
    </div>
  );
}