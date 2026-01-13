import { Strategy } from '../types/simulation';

interface SidebarProps {
  strategies: Strategy[];
  onSelectStrategy: (strategy: Strategy) => void;
  onNewStrategy: () => void;
}

export default function Sidebar({ strategies, onSelectStrategy, onNewStrategy }: SidebarProps) {
  return (
    <aside className="w-64 bg-black border-r border-neutral-800 p-6 flex flex-col h-full">
      <h2 className="text-xs uppercase tracking-widest text-neutral-500 mb-6">
        Past Strategies
      </h2>

      <div className="flex-1 space-y-1 overflow-y-auto">
        {strategies.map((strategy) => (
          <button
            key={strategy.id}
            onClick={() => onSelectStrategy(strategy)}
            className="w-full text-left p-3 rounded hover:bg-neutral-900 transition-colors group"
          >
            <div className="font-semibold text-white text-sm mb-1">
              {strategy.name}
            </div>
            <div className="text-xs text-neutral-500">
              {strategy.profit > 0 ? '+' : ''}{strategy.profit.toFixed(2)}%
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={onNewStrategy}
        className="mt-6 w-full py-3 border border-neutral-700 text-xs uppercase tracking-widest text-white hover:border-white transition-all"
      >
        + New Strategy
      </button>
    </aside>
  );
}
