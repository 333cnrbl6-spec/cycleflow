import HandicapBaselineCard   from './HandicapBaselineCard';
import HandicapBehaviourCard  from './HandicapBehaviourCard';
import HandicapRealtimeCard   from './HandicapRealtimeCard';
import HandicapAssistOverlay  from './HandicapAssistOverlay';

/**
 * Orchestrates all breakdown sub-cards on the Breakdown tab.
 * Each card is a focused, standalone component.
 */
export default function HandicapBreakdownCards() {
  return (
    <div className="space-y-6">
      <HandicapBaselineCard />
      <HandicapBehaviourCard />
      <HandicapRealtimeCard />
      <HandicapAssistOverlay />
    </div>
  );
}