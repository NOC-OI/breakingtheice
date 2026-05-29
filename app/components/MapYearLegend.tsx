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
    <div className="absolute left-6 top-6 z-20 flex flex-col gap-2">
      <div className="flex h-14 w-max items-center rounded-md px-4 text-3xl font-extrabold tracking-wide text-white sm:text-4xl">
        {currentTimeLabel}
      </div>
      <div className="rounded-md bg-black/45 px-3 py-2 text-white">
        <div className="mt-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-wide text-white/85">
          <span>Sea Ice Age</span>
        </div>
        <div className="grid w-48 grid-cols-5 gap-0.5" aria-hidden>
          {legendColormap.map((color, index) => (
            <span
              key={`${color}-${index}`}
              className="h-2.5 first:rounded-l-full last:rounded-r-full"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="mt-0.5 grid w-48 grid-cols-5 text-[10px] font-extrabold tracking-wide text-white">
          {legendLabels.map(label => (
            <span key={label} className="text-center">
              {label}
            </span>
          ))}
        </div>
        <div className="mt-1 flex items-center justify-center text-[10px] font-bold uppercase tracking-wide text-white/85">
          <span>{legendUnitLabel}</span>
        </div>
      </div>
    </div>
  );
}
