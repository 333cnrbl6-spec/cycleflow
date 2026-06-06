import HandicapAdminDistribution from './HandicapAdminDistribution';
import HandicapEventNormalizer    from './HandicapEventNormalizer';

/**
 * Orchestrates admin-facing handicap tooling.
 * Accepts `level`: 'club' | 'regional' | 'federation' | 'global'
 */
export default function AdminHandicapTools({ level = 'club' }) {
  return (
    <div className="space-y-6">
      <HandicapAdminDistribution level={level} />
      <HandicapEventNormalizer />
    </div>
  );
}