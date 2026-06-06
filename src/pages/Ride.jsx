import { useState } from 'react';
import { Navigation, Zap, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { useDemo } from '@/lib/DemoContext';
import LiveRideScreen from '@/components/ride/LiveRideScreen';
import RideSummaryScreen from '@/components/ride/RideSummaryScreen';

const PHASES = { idle: 'idle', riding: 'riding', summary: 'summary' };

function IdleScreen({ demoMode, onStart }) {
  return (
    <div className="space-y-6">
      {/* Pre-ride card */}
      <div className="glass-card rounded-2xl border border-white/[0.07] p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
          <Navigation className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground font-heading">Ready to Ride?</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {demoMode
              ? 'Demo Mode active — a full simulated ride timeline will begin immediately.'
              : 'Enable Demo Mode from the top bar to simulate a live ride.'}
          </p>
        </div>

        <button
          disabled={!demoMode}
          onClick={onStart}
          className="w-full py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Start Ride
        </button>

        {!demoMode && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/20 text-left">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300/80">
              Turn on Demo Mode (top bar) to activate the simulated ride experience — speed, HR, power, segments, safety events, and handicap assists.
            </p>
          </div>
        )}
      </div>

      {/* Feature list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { label: 'Live Telemetry',        desc: 'Speed, HR, power, cadence — colour-coded by effort zone', color: 'blue' },
          { label: 'Map Follow Mode',       desc: 'Rider dot tracks your simulated position along the route', color: 'cyan' },
          { label: 'Handicap Assist',       desc: 'Real-time fairness overlays based on your HCP profile',   color: 'violet' },
          { label: 'Safety Alerts',         desc: 'Near-miss detection, beacon watchers, incident banners',   color: 'red' },
          { label: 'Segment Tracking',      desc: 'Enter/exit segments with live progress and post-segment rank', color: 'amber' },
          { label: 'Auto-Pause Detection',  desc: 'Detects low speed and dims telemetry automatically',      color: 'green' },
        ].map(f => {
          const borderMap = { blue: 'border-blue-500/20 bg-blue-500/[0.03]', cyan: 'border-cyan-500/20 bg-cyan-500/[0.03]', violet: 'border-violet-500/20 bg-violet-500/[0.03]', red: 'border-red-500/20 bg-red-500/[0.03]', amber: 'border-amber-500/20 bg-amber-500/[0.03]', green: 'border-green-500/20 bg-green-500/[0.03]' };
          const dotMap = { blue: 'bg-blue-400', cyan: 'bg-cyan-400', violet: 'bg-violet-400', red: 'bg-red-400', amber: 'bg-amber-400', green: 'bg-green-400' };
          return (
            <div key={f.label} className={`glass-card rounded-xl border p-4 ${borderMap[f.color]}`}>
              <div className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${dotMap[f.color]}`} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Ride() {
  const { demoMode } = useDemo();
  const [phase, setPhase] = useState(PHASES.idle);

  return (
    <div className="p-6 page-enter">
      <PageHeader
        title="Live Ride"
        subtitle={
          phase === PHASES.idle    ? 'Start a simulated ride session' :
          phase === PHASES.riding  ? 'Ride in progress — stay safe!' :
                                     'Post-ride summary'
        }
        icon={Navigation}
        iconColor="text-blue-400"
      />

      {phase === PHASES.idle && (
        <IdleScreen demoMode={demoMode} onStart={() => setPhase(PHASES.riding)} />
      )}

      {phase === PHASES.riding && (
        <LiveRideScreen onEnd={() => setPhase(PHASES.summary)} />
      )}

      {phase === PHASES.summary && (
        <RideSummaryScreen onNewRide={() => setPhase(PHASES.idle)} />
      )}
    </div>
  );
}