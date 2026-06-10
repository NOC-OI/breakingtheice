import type { DatasetMode } from './mapDataset';

const MODE_LABELS: Record<DatasetMode, string> = {
  normal: 'Month',
  yearly: 'Year',
  climatology: 'Average (month)'
};

const MODE_ORDER: DatasetMode[] = ['normal', 'yearly', 'climatology'];

type DatasetModeControlProps = {
  mode: DatasetMode;
  onChangeMode: (mode: DatasetMode) => void;
};

export function DatasetModeControl({ mode, onChangeMode }: DatasetModeControlProps) {
  function handleChange(nextMode: DatasetMode) {
    onChangeMode(nextMode);
  }

  return (
    <div className="text-white" role="radiogroup" aria-label="Dataset mode">
      <div className="relative grid w-full grid-cols-3 gap-2 ">
        {MODE_ORDER.map((option, index) => (
          <div className="w-full" key={index}>
            <div className="hidden md:block">
              {index === 0 && <p className="text-[0.6rem] text-[#C0C0C0]">VIEW DATA BY:</p>}
              {index === 1 && <p className="text-[0.6rem] opacity-0">x</p>}
              {index === 2 && <p className="text-[0.6rem] text-[#C0C0C0]">CLIMATOLOGY</p>}
            </div>
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={option === mode}
              onClick={() => handleChange(option)}
              className={`border border-white/25 relative sm:px-4 min-w-max px-2 w-full md:py-1 md:h-max h-full z-10 text-center tracking-wide items-center justify-center rounded-md bg-white/10 text-[0.5rem] lg:text-[0.7rem] md:whitespace-nowrap md:text-[0.6rem] text-white transition hover:bg-white/25 cursor-pointer  hover:text-white ${option === mode ? 'bg-white/25' : ''}`}
            >
              {MODE_LABELS[option]}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
