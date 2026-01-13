import { useState } from "react";
import { runSimulation } from "../api/simulate";

export default function Simulation() {

  const [name, setName] = useState("");
  const [tp, setTp] = useState(2);
  const [sl, setSl] = useState(1);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleRun() {

    setLoading(true);

    const res = await runSimulation({
      name,
      tokenPair: "WEGLD/USDC",
      duration: "24:00",
      indicators: {}, // from UI
      tp,
      sl
    });

    setResults(res);
    setLoading(false);
  }

  return (
    <div className="p-10">

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Strategy Name"
        className="bg-black border px-3 py-2 mb-4"
      />

      <div className="flex gap-4">

        <input
          type="number"
          value={tp}
          onChange={e => setTp(+e.target.value)}
          placeholder="TP %"
          className="bg-black border px-3 py-2"
        />

        <input
          type="number"
          value={sl}
          onChange={e => setSl(+e.target.value)}
          placeholder="SL %"
          className="bg-black border px-3 py-2"
        />
      </div>

      <button
        onClick={handleRun}
        className="border px-6 py-3 mt-4"
      >
        Run Backtest
      </button>

      {loading && <p>Running...</p>}

      {results && (
        <div className="border p-6 mt-6">

          <p>Profit: {results.profit.toFixed(2)}%</p>
          <p>Winrate: {results.winrate.toFixed(2)}%</p>
          <p>Drawdown: {results.maxDrawdown.toFixed(2)}%</p>
          <p>Trades: {results.numberOfTrades}</p>

          <button
            onClick={() => {
              const blob = new Blob(
                [JSON.stringify(results.trades, null, 2)],
                { type: "application/json" }
              );
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "trades.json";
              a.click();
            }}
            className="border px-4 py-2 mt-4"
          >
            Download Logs
          </button>

        </div>
      )}

    </div>
  );
}
