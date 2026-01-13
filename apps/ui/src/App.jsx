import React, { useState, useEffect } from "react";

// ENGINE API
const API_BASE = "http://localhost:3001";

export default function App() {

  const [strategies, setStrategies] = useState([]);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // MOCK candles (replace with real feed later)
  const [candles] = useState([]);

  const [config, setConfig] = useState({
    name: "UI Strategy",
    tokenPair: "EGLD/USDC",
    duration: "24:00",
    tp: "2.0",
    sl: "1.0",
    indicators: {
      ema_fast: 12,
      ema_slow: 26,
      sma_period: 50,
      macd_fast: 12,
      macd_slow: 26,
      macd_signal: 9,
      rsi_period: 14
    }
  });

  /* HISTORY */
  useEffect(() => {
    setStrategies([
      { id: "1", name: "AlphaPulse", pnl: "+12.4%" }
    ]);
  }, []);

  const updateIndicator = (key, val) => {
    setConfig(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators,
        [key]: Number(val)
      }
    }));
  };

  /* RUN ENGINE */
  const handleRunSimulation = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      const res = await fetch(
        `${API_BASE}/run`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            candles,
            config
          })
        }
      );

      if (!res.ok)
        throw new Error("Simulation API Error");

      const data = await res.json();
      setResults(data);

    } catch (e) {
      console.error("Backtest Failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white select-none font-sans">

      {/* HEADER */}
      <header className="h-28 border-b border-zinc-800 flex items-center px-16 justify-between shrink-0">
        <h1 className="text-4xl font-serif italic font-bold tracking-tighter">
          NovaXAgent
        </h1>
        <nav className="flex space-x-12 text-[11px] font-bold uppercase tracking-[0.4em]">
          <button>Home</button>
          <button className="border-b-2 pb-2">
            Simulation
          </button>
          <button>Dashboard</button>
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-80 border-r border-zinc-800 flex flex-col p-10">
          <h2 className="text-[10px] uppercase tracking-[0.4em] opacity-60 mb-10 font-bold">
            Strategy History
          </h2>

          {strategies.map(s => (
            <div
              key={s.id}
              className="flex justify-between py-4 border-b border-zinc-800 hover:bg-zinc-900 px-2 cursor-pointer"
            >
              <span className="font-bold">
                {s.name}
              </span>
              <span className="font-mono text-xs">
                {s.pnl}
              </span>
            </div>
          ))}

          <button className="mt-10 py-4 border border-white text-[10px] uppercase tracking-[0.2em] font-black hover:bg-white hover:text-black transition">
            + New Simulation
          </button>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-16 overflow-y-auto">
          <div className="max-w-6xl mx-auto">

            {/* GLOBAL PARAMS */}
            <div className="flex space-x-6 mb-16">
              <GlobalInput label="Pair" value={config.tokenPair}
                onChange={(v) => setConfig({...config, tokenPair: v})}
              />
              <GlobalInput label="Timeframe" value={config.duration}
                onChange={(v) => setConfig({...config, duration: v})}
              />
              <GlobalInput label="TP %" value={config.tp}
                onChange={(v) => setConfig({...config, tp: v})}
              />
              <GlobalInput label="SL %" value={config.sl}
                onChange={(v) => setConfig({...config, sl: v})}
              />
            </div>

            <div className="grid grid-cols-12 gap-16">

              {/* CONFIG */}
              <div className="col-span-7 border border-zinc-800 p-10">

                <h3 className="text-[11px] uppercase tracking-[0.3em] mb-10 pb-4 border-b border-zinc-800 font-bold">
                  Configuration
                </h3>

                <div className="space-y-8">
                  <IndicatorField label="EMA"
                    keys={["ema_fast", "ema_slow"]}
                    config={config}
                    update={updateIndicator}
                  />

                  <IndicatorField label="SMA"
                    keys={["sma_period"]}
                    config={config}
                    update={updateIndicator}
                  />

                  <IndicatorField label="MACD"
                    keys={["macd_fast","macd_slow","macd_signal"]}
                    config={config}
                    update={updateIndicator}
                  />

                  <IndicatorField label="RSI"
                    keys={["rsi_period"]}
                    config={config}
                    update={updateIndicator}
                  />
                </div>

                <button
                  onClick={handleRunSimulation}
                  className="w-full mt-12 py-5 border-2 border-white text-[11px] font-black tracking-[0.4em] uppercase hover:bg-white hover:text-black transition"
                >
                  Start Backtest
                </button>
              </div>

              {/* RESULTS */}
              <div className="col-span-5 border border-zinc-800 p-10 flex flex-col">

                <h3 className="text-[11px] uppercase tracking-[0.3em] mb-10 pb-4 border-b border-zinc-800 font-bold">
                  Live Results
                </h3>

                <div className="flex-1 space-y-10">
                  <ResultItem label="Net Profit" value={results?.profit}/>
                  <ResultItem label="Winrate %" value={results?.winrate}/>
                  <ResultItem label="Drawdown" value={results?.maxDrawdown}/>
                  <ResultItem label="Trades" value={results?.numberOfTrades}/>
                </div>

                {isLoading && (
                  <div className="text-[11px] uppercase tracking-[0.5em] text-center pt-10 animate-pulse">
                    Running simulation...
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* HELPERS */

function GlobalInput({ label, value, onChange }) {
  return (
    <div className="flex flex-col space-y-3">
      <label className="text-[10px] uppercase tracking-[0.2em] font-bold">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-black border border-white text-sm p-4 w-44 font-mono outline-none focus:bg-white focus:text-black"
      />
    </div>
  );
}

function IndicatorField({ label, keys, config, update }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm font-black uppercase">
        {label}
      </span>
      <div className="flex space-x-3">
        {keys.map(k => (
          <input
            key={k}
            value={config.indicators[k]}
            onChange={(e)=>update(k,e.target.value)}
            className="w-20 bg-black border border-white text-xs font-mono text-center p-3"
          />
        ))}
      </div>
    </div>
  );
}

function ResultItem({ label, value }) {
  return (
    <div className="flex justify-between border-b border-zinc-800 pb-4">
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
        {label}
      </span>
      <span className="text-2xl font-mono font-black">
        {value ?? "0.00"}
      </span>
    </div>
  );
}
