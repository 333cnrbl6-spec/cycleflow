import { useState } from 'react';
import { BarChart2, Settings2, Layers } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import SubNav from '@/components/ui/SubNav';
import HandicapDashboard    from '@/components/handicap/HandicapDashboard';
import HandicapSetupWizard  from '@/components/handicap/HandicapSetupWizard';
import HandicapBreakdownCards from '@/components/handicap/HandicapBreakdownCards';
import SimulationControls   from '@/components/handicap/SimulationControls';
import useHandicapSimulation from '@/hooks/useHandicapSimulation';

const TABS = [
  { id: 'dashboard',  label: 'My Handicap',   icon: BarChart2  },
  { id: 'breakdown',  label: 'Breakdown',      icon: Layers     },
  { id: 'setup',      label: 'Setup / Update', icon: Settings2  },
];

export default function Handicap() {
  const [tab, setTab] = useState('dashboard');
  const sim = useHandicapSimulation();
  const { snapshot, profile, setProfile, running, setRunning, regenerate, reset } = sim;

  return (
    <div className="p-6 page-enter">
      <PageHeader
        title="Handicap Index"
        subtitle="Your personalised performance equalisation score"
        icon={BarChart2}
        iconColor="text-blue-400"
      >
        <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1">
          {snapshot.hcp} — Cat. {snapshot.hcpCategory}
        </span>
      </PageHeader>

      <SubNav tabs={TABS} active={tab} onSelect={setTab} />

      {/* Simulation controls visible on Dashboard + Breakdown */}
      {(tab === 'dashboard' || tab === 'breakdown') && (
        <SimulationControls
          profile={profile}
          setProfile={setProfile}
          running={running}
          setRunning={setRunning}
          regenerate={regenerate}
          reset={reset}
        />
      )}

      {tab === 'dashboard' && <HandicapDashboard snapshot={snapshot} />}
      {tab === 'breakdown' && <HandicapBreakdownCards snapshot={snapshot} />}
      {tab === 'setup'     && (
        <div className="max-w-lg">
          <HandicapSetupWizard onComplete={() => setTab('dashboard')} />
        </div>
      )}
    </div>
  );
}