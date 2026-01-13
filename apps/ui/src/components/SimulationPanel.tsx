import { useState } from 'react';
import { SimulationConfig, SimulationResults, IndicatorSettings } from '../types/simulation';
import IndicatorControl from './IndicatorControl';

interface SimulationPanelProps {
  onRunSimulation: (config: SimulationConfig, type: 'backtest' | 'fronttest') => Promise<void>;
  results: SimulationResults | null;
  isLoading: boolean;
}

export default function SimulationPanel({ onRunSimulation, results, isLoading }: SimulationPanelProps) {
  const [tokenPair, setTokenPair] = useState('BTC/USDT');
  const [duration, setDuration] = useState('24:00');

  const [indicators, setIndicators] = useState<IndicatorSettings>({
    ema: { enabled: false, fast: 12, slow: 26 },
    sma: { enabled: false, fast: 20, slow: 50 },
    macd: { enabled: false, fast: 12, slow: 26, signal: 9 },
    bollingerBands: { enabled: false, period: 20, deviation: 2 },
    atr: { enabled: false, period: 14 },
    rsi: { enabled: false, period: 14 },
  });

  const updateIndicator = <K extends keyof IndicatorSettings>(
    indicator: K,
    updates: Partial<IndicatorSettings[K]>
  ) => {
    setIndicators((prev) => ({
      ...prev,
      [indicator]: { ...prev[indicator], ...updates },
    }));
  };

  const handleRunSimulation = async (type: 'backtest' | 'fronttest') => {
    const config: SimulationConfig = {
      tokenPair,
      duration,
      indicators,
    };
    await onRunSimulation(config, type);
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Controls */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-white mb-2 uppercase tracking-wider">
              Token Pair
            </label>
            <select
              value={tokenPair}
              onChange={(e) => setTokenPair(e.target.value)}
              className="w-full bg-black border border-neutral-800 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
            >
              <option>BTC/USDT</option>
              <option>ETH/USDT</option>
              <option>SOL/USDT</option>
              <option>AVAX/USDT</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs text-white mb-2 uppercase tracking-wider">
              Duration
            </label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="HH:MM"
              className="w-full bg-black border border-neutral-800 px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-white placeholder:text-neutral-700"
            />
          </div>
        </div>

        {/* Indicators */}
        <div className="border border-neutral-800 p-6">
          <h3 className="text-xs uppercase tracking-widest text-white mb-4">
            Indicators
          </h3>

          <div className="space-y-0">
            <IndicatorControl
              label="EMA"
              enabled={indicators.ema.enabled}
              onToggle={(enabled) => updateIndicator('ema', { enabled })}
              inputs={[
                { label: 'fast', value: indicators.ema.fast, onChange: (fast) => updateIndicator('ema', { fast }) },
                { label: 'slow', value: indicators.ema.slow, onChange: (slow) => updateIndicator('ema', { slow }) },
              ]}
            />

            <IndicatorControl
              label="SMA"
              enabled={indicators.sma.enabled}
              onToggle={(enabled) => updateIndicator('sma', { enabled })}
              inputs={[
                { label: 'fast', value: indicators.sma.fast, onChange: (fast) => updateIndicator('sma', { fast }) },
                { label: 'slow', value: indicators.sma.slow, onChange: (slow) => updateIndicator('sma', { slow }) },
              ]}
            />

            <IndicatorControl
              label="MACD"
              enabled={indicators.macd.enabled}
              onToggle={(enabled) => updateIndicator('macd', { enabled })}
              inputs={[
                { label: 'fast', value: indicators.macd.fast, onChange: (fast) => updateIndicator('macd', { fast }) },
                { label: 'slow', value: indicators.macd.slow, onChange: (slow) => updateIndicator('macd', { slow }) },
                { label: 'signal', value: indicators.macd.signal, onChange: (signal) => updateIndicator('macd', { signal }) },
              ]}
            />

            <IndicatorControl
              label="Bollinger Bands"
              enabled={indicators.bollingerBands.enabled}
              onToggle={(enabled) => updateIndicator('bollingerBands', { enabled })}
              inputs={[
                { label: 'period', value: indicators.bollingerBands.period, onChange: (period) => updateIndicator('bollingerBands', { period }) },
                { label: 'deviation', value: indicators.bollingerBands.deviation, onChange: (deviation) => updateIndicator('bollingerBands', { deviation }) },
              ]}
            />

            <IndicatorControl
              label="ATR"
              enabled={indicators.atr.enabled}
              onToggle={(enabled) => updateIndicator('atr', { enabled })}
              inputs={[
                { label: 'period', value: indicators.atr.period, onChange: (period) => updateIndicator('atr', { period }) },
              ]}
            />

            <IndicatorControl
              label="RSI"
              enabled={indicators.rsi.enabled}
              onToggle={(enabled) => updateIndicator('rsi', { enabled })}
              inputs={[
                { label: 'period', value: indicators.rsi.period, onChange: (period) => updateIndicator('rsi', { period }) },
              ]}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleRunSimulation('backtest')}
            disabled={isLoading}
            className="flex-1 py-3 border border-neutral-700 text-sm uppercase tracking-widest text-white hover:border-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Backtest
          </button>

          <button
            onClick={() => handleRunSimulation('fronttest')}
            disabled={isLoading}
            className="flex-1 py-3 border border-neutral-700 text-sm uppercase tracking-widest text-white hover:border-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Front Test
          </button>
        </div>

        {/* Results */}
        <div className="border border-neutral-800 p-6">
          <h3 className="text-xs uppercase tracking-widest text-white mb-6">
            Results
          </h3>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-white animate-pulse">Running simulation...</p>
            </div>
          ) : results ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white">Profit %</span>
                <span className="text-base font-mono text-white">
                  {results.profit > 0 ? '+' : ''}{results.profit.toFixed(2)}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-white">Winrate %</span>
                <span className="text-base font-mono text-white">
                  {results.winrate.toFixed(2)}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-white">Max Drawdown %</span>
                <span className="text-base font-mono text-white">
                  {results.maxDrawdown.toFixed(2)}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-white">Number of Trades</span>
                <span className="text-base font-mono text-white">
                  {results.numberOfTrades}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600 text-sm">No results yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
