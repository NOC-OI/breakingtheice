import type { DatasetMode } from './mapDataset';

const MODE_LABELS: Record<DatasetMode, string> = {
  normal: 'Month',
  climatology: 'Clima',
  yearly: 'Year'
};

const MODE_ORDER: DatasetMode[] = ['normal', 'climatology', 'yearly'];

type DatasetModeControlProps = {
  mode: DatasetMode;
  onChangeMode: (mode: DatasetMode) => void;
};

export function DatasetModeControl({ mode, onChangeMode }: DatasetModeControlProps) {
  const selectedIndex = MODE_ORDER.indexOf(mode);
  const safeSelectedIndex = selectedIndex < 0 ? 0 : selectedIndex;
  const thumbLeftPercent = (safeSelectedIndex * 100) / MODE_ORDER.length;
  const thumbWidthPercent = 100 / MODE_ORDER.length;

  function handleChange(nextMode: DatasetMode) {
    onChangeMode(nextMode);
  }

  return (
    <div className="w-56 text-white" role="radiogroup" aria-label="Dataset mode">
      <div className="relative grid h-7 w-full grid-cols-3 overflow-hidden rounded-md border border-white/25 bg-white/10">
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0.5 top-0.5 rounded-sm bg-[#00b5ff] shadow-[0_0_0_1px_rgba(0,0,0,0.15)] transition-all duration-200"
          style={{
            left: `calc(${thumbLeftPercent}% + 2px)`,
            width: `calc(${thumbWidthPercent}% - 4px)`
          }}
        />
        {MODE_ORDER.map(option => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={option === mode}
            onClick={() => handleChange(option)}
            className={`relative z-10 cursor-pointer items-center text-center text-[10px] font-extrabold uppercase tracking-wide transition-colors ${
              option === mode ? 'text-[#0d3352]' : 'text-white/80 hover:text-white'
            }`}
          >
            {MODE_LABELS[option]}
          </button>
        ))}
      </div>
    </div>
  );
}
