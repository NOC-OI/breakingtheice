type MapYearLegendProps = {
  yearIndex: number;
  datasetMode: 'normal' | 'climatology' | 'yearly';
  legendColormap: string[];
  legendLabels: string[];
  legendUnitLabel: string;
};

const START_YEAR = 1984;
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
export function MapYearLegend({
  yearIndex,
  datasetMode,
  legendColormap,
  legendLabels,
  legendUnitLabel
}: MapYearLegendProps) {
  const year = START_YEAR + Math.floor(yearIndex / 12);
  const month = MONTHS[yearIndex % 12];
  const currentTimeLabel =
    datasetMode === 'yearly'
      ? `${START_YEAR + yearIndex}`
      : datasetMode === 'climatology'
        ? `${month.slice(0, 3)}`
        : `${year} ${month.slice(0, 3)}`;

  return (
    <div className="absolute sm:left-6 sm:top-6 left-2 top-6 z-20 flex flex-col sm:gap-2 gap-0">
      <div className="flex sm:h-14 h-10 w-max items-center rounded-md px-4 text-xl font-bold tracking-wide text-white sm:text-4xl">
        {currentTimeLabel}
      </div>
      <div className="rounded-md bg-black/45 sm:px-3 sm:py-2 px-1 py-1 text-white">
        <div className="sm:mt-1 mt-0 flex items-center justify-center sm:text-[10px] text-[8px] font-bold uppercase tracking-wide text-white/85">
          <span>Sea Ice Age</span>
        </div>
        <div className="grid sm:w-48 w-40 grid-cols-5 gap-0.5" aria-hidden>
          {legendColormap.map((color, index) => (
            <span
              key={`${color}-${index}`}
              className="h-2.5 first:rounded-l-full last:rounded-r-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="mt-0.5 grid sm:w-48 w-40 grid-cols-5 text-[10px] font-extrabold tracking-wide text-white">
          {legendLabels.map(label => (
            <span key={label} className="text-center">
              {label}
            </span>
          ))}
        </div>
        <div className="mt-1 flex items-center justify-center sm:text-[10px] text-[8px] font-bold uppercase tracking-wide text-white/85">
          <span>{legendUnitLabel}</span>
        </div>
      </div>
    </div>
  );
}
