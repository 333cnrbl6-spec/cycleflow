import { useState } from 'react';
import { Sliders, CheckCircle, AlertCircle } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';

const EVENT_GROUPS = [
  { group: 'Elite', hcpRange: '0.0–1.5', riders: 4,  badge: 'bg-amber-500/10 text-amber-400'          },
  { group: 'A',     hcpRange: '1.6–3.5', riders: 12, badge: 'bg-blue-500/10 text-blue-400'             },
  { group: 'B',     hcpRange: '3.6–6.0', riders: 19, badge: 'bg-violet-500/10 text-violet-400'         },
  { group: 'C',     hcpRange: '6.1–9.0', riders: 9,  badge: 'bg-green-500/10 text-green-400'           },
  { group: 'D',     hcpRange: '9.1+',    riders: 4,  badge: 'bg-white/10 text-muted-foreground'        },
];

const MODES = [
  { id: 'category',      label: 'Category'    },
  { id: 'adjusted_time', label: 'Adj. Time'   },
  { id: 'wave_start',    label: 'Wave Start'  },
];

export default function HandicapEventNormalizer() {
  const [mode, setMode] = useState('category');

  return (
    <div>
      <SectionLabel accent="violet" label="Event Handicap Normalisation" />
      <div className="glass-card rounded-xl border border-violet-500/20 bg-violet-500/[0.03] p-5">
        <div className="flex items-start gap-3 mb-4">
          <Sliders className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Event Start Group Allocator</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automatically assign riders to fair start groups based on current handicap index.
              Supports mass-start and time-trial formats.
            </p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2 mb-4">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all ${
                mode === m.id
                  ? 'border-violet-500/50 bg-violet-500/20 text-violet-400'
                  : 'border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Group rows */}
        <div className="space-y-1.5 mb-4">
          {EVENT_GROUPS.map(g => (
            <div key={g.group} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/[0.04]">
              <span className={`badge flex-shrink-0 ${g.badge}`}>Group {g.group}</span>
              <span className="text-xs text-muted-foreground flex-1">HCP {g.hcpRange}</span>
              <span className="text-xs font-mono text-foreground">{g.riders} riders</span>
              {g.riders > 0
                ? <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                : <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              }
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button className="btn-primary flex-1 text-xs">Apply to Event</button>
          <button className="btn-secondary flex-1 text-xs">Export Start Sheet</button>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl border border-dashed border-violet-500/20 text-center">
        <p className="text-xs text-muted-foreground">
          British Cycling affiliation sync, UCI category rules engine, and real-time normalisation API — integration hook ready.
        </p>
      </div>
    </div>
  );
}