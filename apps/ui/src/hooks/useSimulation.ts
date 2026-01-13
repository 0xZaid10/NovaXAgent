import { useState } from 'react';
import {
  SimulationConfig,
  SimulationResults,
  Strategy
} from '../types/simulation';
import { runSimulation } from '../services/simulationApi';

type Status = 'idle' | 'running' | 'done' | 'error';

export function useSimulation() {

  const [status, setStatus] = useState<Status>('idle');
  const [results, setResults] =
    useState<SimulationResults | null>(null);
  const [history, setHistory] =
    useState<Strategy[]>([]);

  async function run(
    config: SimulationConfig,
    type: 'backtest' | 'fronttest'
  ) {
    try {
      setStatus('running');
      setResults(null);

      const data =
        await runSimulation(config, type);

      setResults(data);
      setStatus('done');

      const strat: Strategy = {
        id: Date.now().toString(),
        name: `${config.tokenPair} ${type}`,
        profit: data.profit,
        createdAt: new Date().toISOString()
      };

      setHistory(prev => [strat, ...prev]);

    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  }

  return {
    status,
    results,
    history,
    run
  };
}
