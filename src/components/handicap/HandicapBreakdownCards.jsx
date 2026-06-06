import HandicapBaselineCard   from './HandicapBaselineCard';
import HandicapBehaviourCard  from './HandicapBehaviourCard';
import HandicapRealtimeCard   from './HandicapRealtimeCard';
import HandicapAssistOverlay  from './HandicapAssistOverlay';

/**
 * Orchestrates all breakdown sub-cards on the Breakdown tab.
 * Accepts an optional `snapshot` from the simulation layer and
 * passes relevant slices to each focused component.
 */
export default function HandicapBreakdownCards({ snapshot }) {
  return (
    <div className="space-y-6">
      <HandicapBaselineCard  snapshot={snapshot} />
      <HandicapBehaviourCard snapshot={snapshot} />
      <HandicapRealtimeCard  data={snapshot} />
      <HandicapAssistOverlay data={snapshot} />
    </div>
  );
}