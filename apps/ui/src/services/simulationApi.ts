import { SimulationConfig, SimulationResults } from "../types/simulation";

export async function runSimulation(
  config: SimulationConfig,
  type: 'backtest' | 'fronttest'
): Promise<SimulationResults> {

  const r = await fetch(
    `http://localhost:3001/simulate?type=${type}`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(config)
    }
  );

  if (!r.ok) {
    throw new Error("Simulation failed");
  }

  return r.json();
}
