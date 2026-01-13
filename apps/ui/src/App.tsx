import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SimulationPanel from "./components/SimulationPanel";
import { Strategy } from "./types/simulation";

export default function App() {

  const [tab, setTab] = useState("Simulation");

  const [strategies] = useState<Strategy[]>([
    {
      id: "1",
      name: "EMA Crossover",
      profit: 12.34,
      createdAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "RSI Divergence",
      profit: -3.21,
      createdAt: new Date().toISOString()
    },
    {
      id: "3",
      name: "Bollinger Bounce",
      profit: 8.76,
      createdAt: new Date().toISOString()
    }
  ]);

  return (
    <div className="h-screen bg-black text-white flex flex-col">

      <Header activeTab={tab} onTabChange={setTab} />

      <div className="flex flex-1 max-w-[1800px] mx-auto w-full">

        <Sidebar
          strategies={strategies}
          onSelectStrategy={() => {}}
          onNewStrategy={() => {}}
        />

        <SimulationPanel />

      </div>
    </div>
  );
}
