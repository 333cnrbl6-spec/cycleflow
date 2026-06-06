import { useState } from 'react';
import { Dumbbell, CalendarDays, Zap, ListChecks, ChevronRight, Lock } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import PlaceholderCard from '@/components/ui/PlaceholderCard';
import SectionLabel from '@/components/ui/SectionLabel';
import StatBlock from '@/components/ui/StatBlock';

const TABS = [
  { id: 'plans',    label: 'Training Plans',   icon: CalendarDays },
  { id: 'builder',  label: 'Workout Builder',  icon: Zap },
  { id: 'history',  label: 'Training Log',     icon: ListChecks },
];

const PLANS = [
  {
    name: 'Gran Fondo Base Build',
    weeks: 12, level: 'Intermediate',
    goal: 'Build endurance for 160km events',
    accent: 'blue', locked: false,
    tss: 480, weeklyHours: '8–10 hrs',
  },
  {
    name: 'Sprint Power Development',
    weeks: 8,  level: 'Advanced',
    goal: 'Increase 5s and 30s peak power',
    accent: 'violet', locked: false,
    tss: 560, weeklyHours: '10–12 hrs',
  },
  {
    name: 'Beginner Road Cycling',
    weeks: 6,  level: 'Beginner',
    goal: 'Build a solid aerobic base',
    accent: 'green', locked: false,
    tss: 280, weeklyHours: '4–6 hrs',
  },
  {
    name: 'UCI Race Preparation',
    weeks: 16, level: 'Elite',
    goal: 'Peak for national-level competition',
    accent: 'amber', locked: true,
    tss: 720, weeklyHours: '14–18 hrs',
  },
];

const WORKOUT_BLOCKS = [
  { name: 'Warm-up',      duration: '10 min', zone: 'Z1–Z2', color: 'bg-blue-400',   w: '10%' },
  { name: 'Sweet Spot',   duration: '20 min', zone: 'Z4',    color: 'bg-amber-400',  w: '28%' },
  { name: 'Active Rest',  duration: '5 min',  zone: 'Z2',    color: 'bg-blue-400',   w: '8%'  },
  { name: 'VO2 Intervals',duration: '15 min', zone: 'Z5',    color: 'bg-red-400',    w: '20%' },
  { name: 'Active Rest',  duration: '5 min',  zone: 'Z2',    color: 'bg-blue-400',   w: '8%'  },
  { name: 'Cool-down',    duration: '5 min',  zone: 'Z1',    color: 'bg-cyan-400',   w: '6%'  },
];

const ZONE_COLORS = {
  'Z1': 'bg-cyan-500/10 text-cyan-400',
  'Z2': 'bg-blue-500/10 text-blue-400',
  'Z3': 'bg-green-500/10 text-green-400',
  'Z4': 'bg-amber-500/10 text-amber-400',
  'Z5': 'bg-orange-500/10 text-orange-400',
  'Z5+': 'bg-red-500/10 text-red-400',
  'Z1–Z2': 'bg-blue-500/10 text-blue-400',
};

const LOG = [
  { date: '05 Jun', name: 'Threshold Intervals', tss: 94,  dur: '1h 15m', load: 'Hard'   },
  { date: '03 Jun', name: 'Recovery Spin',       tss: 28,  dur: '45m',    load: 'Easy'   },
  { date: '01 Jun', name: 'Sweet Spot x3',       tss: 112, dur: '1h 30m', load: 'Hard'   },
  { date: '29 May', name: 'Base Endurance',      tss: 74,  dur: '2h 00m', load: 'Medium' },
];

const LOAD_COLOR = {
  Easy:   'bg-green-500/10 text-green-400',
  Medium: 'bg-amber-500/10 text-amber-400',
  Hard:   'bg-red-500/10 text-red-400',
};

export default function Training() {
  const [tab, setTab]             = useState('plans');
  const [activePlan, setActivePlan] = useState(null);

  return (
    <div className="p-6 page-enter">
      <PageHeader
        title="Training"
        subtitle="Structured training plans, workout builder, and load tracking"
        icon={Dumbbell}
        iconColor="text-violet-400"
      >
        <span className="badge bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-1">
          Coming Soon
        </span>
      </PageHeader>

      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {/* ── Training Plans ── */}
      {tab === 'plans' && (
        <div className="space-y-5">
          <SectionLabel accent="violet" label="Available Plans" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                onClick={() => !plan.locked && setActivePlan(plan)}
                className={`glass-card rounded-xl border p-5 transition-all duration-200 
                  ${plan.locked
                    ? 'border-white/5 opacity-60 cursor-not-allowed'
                    : 'border-white/[0.06] hover:border-violet-500/30 cursor-pointer group'
                  }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`badge ${
                        plan.level === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                        plan.level === 'Intermediate' ? 'bg-blue-500/10 text-blue-400' :
                        plan.level === 'Advanced' ? 'bg-violet-500/10 text-violet-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>{plan.level}</span>
                      <span className="text-[10px] text-muted-foreground">{plan.weeks} weeks</span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{plan.goal}</p>
                  </div>
                  {plan.locked
                    ? <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5 group-hover:text-violet-400 transition-colors" />
                  }
                </div>
                <div className="flex gap-4 pt-3 border-t border-border/30">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Weekly TSS</p>
                    <p className="text-xs font-mono font-semibold text-foreground mt-0.5">{plan.tss}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Weekly Hours</p>
                    <p className="text-xs font-mono font-semibold text-foreground mt-0.5">{plan.weeklyHours}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active plan detail */}
          {activePlan && (
            <PlaceholderCard
              title={`Active Plan — ${activePlan.name}`}
              description={`${activePlan.weeks}-week plan · ${activePlan.weeklyHours} per week`}
              icon={CalendarDays}
              accent="violet"
            >
              <div className="mt-3 space-y-2">
                <p className="text-[11px] text-muted-foreground">Week 1 of {activePlan.weeks} — Sample schedule</p>
                {['Mon: Threshold intervals 1h','Tue: Rest','Wed: Sweet spot 1h 15m','Thu: Endurance 2h','Fri: Rest','Sat: Long ride 3h','Sun: Recovery spin 45m'].map((d, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/[0.04]">
                    <span className="text-xs text-muted-foreground w-7 font-mono">{d.split(':')[0]}</span>
                    <span className="text-xs text-foreground flex-1">{d.split(': ')[1]}</span>
                  </div>
                ))}
                <div className="p-3 mt-2 rounded-lg border border-violet-500/20 bg-violet-500/5">
                  <p className="text-xs text-violet-400">Full plan calendar sync with Garmin Connect, Wahoo, and Komoot — integration hook ready.</p>
                </div>
              </div>
            </PlaceholderCard>
          )}

          <div className="p-4 rounded-xl border border-dashed border-violet-500/20 bg-violet-500/[0.03] text-center">
            <p className="text-sm font-medium text-foreground mb-1">AI Adaptive Training</p>
            <p className="text-xs text-muted-foreground">Plans that auto-adjust based on your live sensor data and recovery metrics. Hook ready for future ML pipeline integration.</p>
          </div>
        </div>
      )}

      {/* ── Workout Builder ── */}
      {tab === 'builder' && (
        <div className="space-y-5">
          <SectionLabel accent="amber" label="Structured Workout" />

          <PlaceholderCard title="Workout Builder" description="Drag and drop intervals to design a structured training session" icon={Zap} accent="amber">
            <div className="mt-4 space-y-4">
              {/* Visual workout bar */}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Workout Profile</p>
                <div className="flex h-10 rounded-lg overflow-hidden gap-px">
                  {WORKOUT_BLOCKS.map((b, i) => (
                    <div
                      key={i}
                      className={`${b.color} opacity-80 flex items-end justify-center pb-1 cursor-pointer hover:opacity-100 transition-opacity`}
                      style={{ width: b.w }}
                      title={`${b.name} — ${b.duration}`}
                    />
                  ))}
                </div>
                {/* Zone legend */}
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {WORKOUT_BLOCKS.filter((b, i, arr) => arr.findIndex(x => x.name === b.name) === i).map(b => (
                    <span key={b.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <span className={`w-2 h-2 rounded-full ${b.color}`} />
                      {b.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Block list */}
              <div className="space-y-1.5">
                {WORKOUT_BLOCKS.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/[0.04]">
                    <div className={`w-2 h-8 rounded-full flex-shrink-0 ${b.color}`} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground">{b.name}</p>
                      <p className="text-[10px] text-muted-foreground">{b.duration}</p>
                    </div>
                    <span className={`badge ${ZONE_COLORS[b.zone] || 'bg-white/10 text-muted-foreground'}`}>{b.zone}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/30">
                {[['Total Duration', '60 min'], ['Estimated TSS', '~94'], ['IF (Intensity)', '0.88']].map(([l, v]) => (
                  <div key={l} className="text-center">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{l}</p>
                    <p className="text-sm font-bold font-mono text-foreground mt-0.5">{v}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="btn-primary flex-1">Save Workout</button>
                <button className="btn-secondary flex-1">Push to Device</button>
              </div>

              <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.04]">
                <p className="text-xs text-amber-400/80">Drag-and-drop interval builder and real-time ERG mode control — device sync hook ready for Wahoo KICKR and Garmin Edge.</p>
              </div>
            </div>
          </PlaceholderCard>
        </div>
      )}

      {/* ── Training Log ── */}
      {tab === 'history' && (
        <div className="space-y-4">
          <SectionLabel accent="cyan" label="Training Load" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBlock label="7-Day TSS"    value="412"  accent="violet" trend="up" trendValue="+18 vs prev week" />
            <StatBlock label="CTL (Fitness)"value="68"   accent="blue" />
            <StatBlock label="ATL (Fatigue)"value="81"   accent="amber" />
            <StatBlock label="Form (TSB)"   value="-13"  accent="red" />
          </div>

          <div className="glass-card rounded-xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-3 border-b border-border/60 flex items-center gap-2">
              <ListChecks className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Recent Sessions</span>
            </div>
            <table className="cf-table">
              <thead>
                <tr>
                  <th className="text-left">Date</th>
                  <th className="text-left">Workout</th>
                  <th className="text-right hidden sm:table-cell">Duration</th>
                  <th className="text-right">TSS</th>
                  <th className="text-right hidden md:table-cell">Load</th>
                </tr>
              </thead>
              <tbody>
                {LOG.map((r, i) => (
                  <tr key={i}>
                    <td className="text-muted-foreground font-mono text-xs">{r.date}</td>
                    <td className="font-medium text-foreground">{r.name}</td>
                    <td className="text-right text-muted-foreground hidden sm:table-cell">{r.dur}</td>
                    <td className="text-right text-violet-400 font-mono font-semibold">{r.tss}</td>
                    <td className="text-right hidden md:table-cell">
                      <span className={`badge ${LOAD_COLOR[r.load]}`}>{r.load}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl border border-dashed border-cyan-500/20 bg-cyan-500/[0.03] text-center">
            <p className="text-xs text-muted-foreground">Performance Management Chart (PMC) — CTL/ATL/TSB trend visualisation hook ready.</p>
          </div>
        </div>
      )}
    </div>
  );
}