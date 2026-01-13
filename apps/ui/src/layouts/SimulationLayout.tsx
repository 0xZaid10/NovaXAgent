import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SimulationPanel from '../components/SimulationPanel';
import { useSimulation } from '../hooks/useSimulation';

export default function SimulationLayout() {

  const sim = useSimulation();

  return (
    <div className="h-screen bg-black text-white flex flex-col">

      <Header
        activeTab="Simulation"
        onTabChange={() => {}}
      />

      <div className="flex-1 flex overflow-hidden">

        <Sidebar
          strategies={sim.history}
          onSelectStrategy={() => {}}
          onNewStrategy={() => {}}
        />

        <SimulationPanel
          onRunSimulation={sim.run}
          results={sim.results}
          isLoading={sim.status === 'running'}
        />

      </div>
    </div>
  );
}
