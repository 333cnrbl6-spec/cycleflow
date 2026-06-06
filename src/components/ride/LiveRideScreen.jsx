import { useState } from 'react';
import { Pause, Play, Square, Shield, ChevronRight } from 'lucide-react';
import { useRideSimulation } from '@/hooks/useRideSimulation';
import RideMapCanvas from './RideMapCanvas';
import TelemetryHUD from './TelemetryHUD';
import SafetyAlertsPanel from './SafetyAlertsPanel';
import AssistOverlay from './AssistOverlay';
import SegmentPopup from './SegmentPopup';
import AutoPauseBadge from './AutoPauseBadge';

const BEACON_WATCHERS = [
  { name: 'City Cycling Club', status: 'Watching' },
  { name: 'Emergency Contact', status: 'Watching' },
];

export default function LiveRideScreen({ onEnd }) {
  const { state, setPaused, acknowledgeAlert, clearAlerts } = useRideSimulation(true);
  const [showSafety, setShowSafety] = useState(false);
  const newAlerts = state.safetyAlerts.filter(a => !a.acknowledged).length;

  const handlePause = () => setPaused(!state.paused);

  return (
    <div className="flex flex-col gap-3">
      {/* TelemetryHUD */}
      <TelemetryHUD state={state} dim={state.autoPaused && !state.paused} />

      {/* Map area */}
      <div className="relative rounded-xl overflow-hidden border border-white/[0.07]" style={{ height: 340 }}>
        <RideMapCanvas position={state.position} progress={state.progress} className="w-full h-full" />

        {/* Overlays */}
        <AssistOverlay message={state.assistMessage} />
        <AutoPauseBadge visible={state.autoPaused} />
        <SegmentPopup
          activeSegment={state.activeSegment}
          segmentProgress={state.segmentProgress}
          finishedSegment={state.finishedSegment}
        />

        {/* Progress bar at bottom of map */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/50">
          <div
            className="h-1 bg-blue-500 transition-all duration-1000"
            style={{ width: `${state.progress * 100}%` }}
          />
        </div>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePause}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border glass-card text-sm font-semibold text-foreground hover:border-blue-500/40 transition-colors"
        >
          {state.paused ? <Play className="w-4 h-4 text-green-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          {state.paused ? 'Resume' : 'Pause'}
        </button>

        {/* Safety toggle */}
        <button
          onClick={() => setShowSafety(s => !s)}
          className="relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border glass-card text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-blue-500/40 transition-colors"
        >
          <Shield className="w-4 h-4 text-cyan-400" />
          Safety
          {newAlerts > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
              {newAlerts}
            </span>
          )}
        </button>

        <button
          onClick={onEnd}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors"
        >
          <Square className="w-4 h-4" />
          End
        </button>
      </div>

      {/* Safety panel (collapsible) */}
      {showSafety && (
        <div className="tab-enter">
          <SafetyAlertsPanel
            alerts={state.safetyAlerts}
            watchers={BEACON_WATCHERS}
            onAcknowledge={acknowledgeAlert}
            onClear={clearAlerts}
          />
        </div>
      )}
    </div>
  );
}