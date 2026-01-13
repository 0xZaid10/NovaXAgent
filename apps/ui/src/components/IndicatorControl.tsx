interface IndicatorControlProps {
  label: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  inputs: Array<{ label: string; value: number; onChange: (value: number) => void }>;
}

export default function IndicatorControl({ label, enabled, onToggle, inputs }: IndicatorControlProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-900 last:border-b-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => onToggle(!enabled)}
          className={`w-12 h-6 rounded-sm border transition-colors ${
            enabled
              ? 'bg-white border-white'
              : 'bg-transparent border-neutral-700'
          } relative`}
        >
          <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-semibold tracking-wider ${
            enabled ? 'text-black' : 'text-neutral-600'
          }`}>
            {enabled ? 'ON' : 'OFF'}
          </span>
        </button>
        <span className="text-sm text-white">{label}</span>
      </div>

      <div className="flex gap-3">
        {inputs.map((input, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <label className="text-xs text-white">{input.label}</label>
            <input
              type="text"
              value={input.value}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                input.onChange(val);
              }}
              disabled={!enabled}
              className="w-16 bg-black border border-neutral-800 px-2 py-1 text-xs text-white font-mono text-right focus:outline-none focus:border-white disabled:opacity-30"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
