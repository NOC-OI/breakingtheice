'use client';

import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { DatasetModeControl } from './DatasetModeControl';
import { TimelinePlayControls, type PlaybackMode } from './TimelinePlayControls';
import { DATASET_CONFIG, END_YEAR, MONTHS, START_YEAR, type DatasetMode } from './mapDataset';

const ALL_TICK_YEARS = Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => START_YEAR + i);
const TICK_YEARS = Array.from(
  { length: Math.floor((END_YEAR - START_YEAR) / 5) + 1 },
  (_, i) => START_YEAR + i * 5
);
const THUMB_SIZE = 32;

type TimeSliderProps = {
  yearIndex: number;
  datasetMode: DatasetMode;
  timelineVisible: boolean;
  onToggleTimeline: () => void;
  onChangeYear: (index: number) => void;
  onChangeDatasetMode: (mode: DatasetMode) => void;
};
export function TimeSlider({
  yearIndex,
  datasetMode,
  timelineVisible,
  onToggleTimeline,
  onChangeYear,
  onChangeDatasetMode
}: TimeSliderProps) {
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('paused');
  const maxIndex = DATASET_CONFIG[datasetMode].maxIndex;

  function getThumbCenterPosition(value: number) {
    const ratio = maxIndex === 0 ? 0 : value / maxIndex;

    return `calc(${ratio * 100}% + ${THUMB_SIZE / 2}px - ${ratio * THUMB_SIZE}px)`;
  }

  const progressWidth = getThumbCenterPosition(yearIndex);

  const labelTickMarks =
    datasetMode === 'climatology'
      ? MONTHS.map((month, monthIndex) => ({
          label: month,
          left: monthIndex === 0 ? '0px' : getThumbCenterPosition(monthIndex)
        }))
      : TICK_YEARS.map(year => {
          const value = datasetMode === 'yearly' ? year - START_YEAR : (year - START_YEAR) * 12;
          return {
            label: `${year}`,
            left: year === START_YEAR ? '0px' : getThumbCenterPosition(value)
          };
        });

  const yearTickMarks =
    datasetMode === 'climatology'
      ? MONTHS.map((_, monthIndex) => ({
          value: monthIndex,
          left: monthIndex === 0 ? '0px' : getThumbCenterPosition(monthIndex),
          isMajor: true
        }))
      : ALL_TICK_YEARS.map(year => {
          const value = datasetMode === 'yearly' ? year - START_YEAR : (year - START_YEAR) * 12;
          return {
            value,
            left: year === START_YEAR ? '0px' : getThumbCenterPosition(value),
            isMajor: year % 5 === 0
          };
        });

  useEffect(() => {
    if (playbackMode === 'paused') {
      return;
    }

    const playbackSettings: Record<PlaybackMode, { step: number; intervalMs: number }> = {
      paused: { step: 0, intervalMs: 0 },
      play: { step: 1, intervalMs: 300 },
      fast: { step: 1, intervalMs: 150 },
      faster: { step: 1, intervalMs: 75 },
      evenfaster: { step: 1, intervalMs: 30 }
    };

    const { intervalMs, step } = playbackSettings[playbackMode];
    const timer = window.setInterval(() => {
      if (yearIndex >= maxIndex) {
        onChangeYear(0);
        return;
      }

      const nextIndex = yearIndex + step;
      onChangeYear(nextIndex > maxIndex ? 0 : nextIndex);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [datasetMode, maxIndex, onChangeYear, playbackMode, yearIndex]);

  function handleDatasetModeChange(mode: DatasetMode) {
    setPlaybackMode('paused');
    onChangeDatasetMode(mode);
  }

  function handlePlaybackCycle() {
    setPlaybackMode(currentMode => {
      if (currentMode === 'paused') {
        return 'play';
      }

      if (currentMode === 'play') {
        return 'fast';
      }

      if (currentMode === 'fast') {
        return 'faster';
      }
      if (currentMode === 'faster') {
        return 'evenfaster';
      }

      return 'paused';
    });
  }

  function handleNext() {
    setPlaybackMode('paused');
    if (yearIndex >= maxIndex) {
      return;
    }
    onChangeYear(yearIndex + 1);
  }

  function handleNextYear() {
    setPlaybackMode('paused');
    if (datasetMode === 'climatology') {
      return;
    }

    const step = datasetMode === 'normal' ? 12 : 1;
    if (yearIndex >= maxIndex - step) {
      return;
    }
    onChangeYear(yearIndex + step);
  }

  function handleBefore() {
    setPlaybackMode('paused');

    if (yearIndex <= 0) {
      return;
    }
    onChangeYear(yearIndex - 1);
  }
  function handleLastYear() {
    setPlaybackMode('paused');

    if (datasetMode === 'climatology') {
      return;
    }

    const step = datasetMode === 'normal' ? 12 : 1;

    if (yearIndex <= step - 1) {
      return;
    }

    onChangeYear(yearIndex - step);
  }

  return (
    <div className="absolute bottom-8 left-1/2 z-20 h-37.25 w-[80vw] -translate-x-1/2">
      <div
        className={`relative ml-auto flex text-white shadow-xl transition-[width,height,padding] duration-300 ease-out ${
          timelineVisible
            ? 'h-full w-full rounded-2xl bg-[#0d3352f0] px-4 py-4 backdrop-blur-sm sm:px-6'
            : 'h-16.25 w-17.5 rounded-[10px] bg-[#0d3352] p-3'
        }`}
      >
        <button
          type="button"
          onClick={onToggleTimeline}
          className={`flex cursor-pointer items-center justify-center rounded-xs bg-[#faf7f5] hover:bg-[#e0e0e0] text-[#0d3352] transition-[filter,background-color] hover:brightness-95 ${
            timelineVisible
              ? 'absolute right-4 top-4 h-8 w-8'
              : 'absolute bottom-5.5 right-5.75 h-5 w-6'
          }`}
          aria-label={timelineVisible ? 'Hide timeline' : 'Show timeline'}
        >
          <span className="relative block h-4 w-4">
            <FiEye
              aria-hidden
              className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                timelineVisible ? 'scale-100 rotate-0 opacity-100' : 'scale-75 -rotate-90 opacity-0'
              }`}
            />
            <FiEyeOff
              aria-hidden
              className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                timelineVisible ? 'scale-75 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
              }`}
            />
          </span>
        </button>

        <div
          className={`min-w-0 overflow-hidden transition-[max-width,opacity] duration-300 ease-out ${
            timelineVisible ? 'w-full pr-14 opacity-100' : 'max-w-0 opacity-0'
          }`}
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm font-bold text-[#d8e6f5] sm:text-2xl">
              Scroll across to see how ice cover changes over time
            </p>

            <DatasetModeControl mode={datasetMode} onChangeMode={handleDatasetModeChange} />

            <TimelinePlayControls
              playbackMode={playbackMode}
              datasetMode={datasetMode}
              onCyclePlayback={handlePlaybackCycle}
              onPause={() => setPlaybackMode('paused')}
              onPreviousMonth={handleBefore}
              onPreviousYear={handleLastYear}
              onNextMonth={handleNext}
              onNextYear={handleNextYear}
            />
          </div>
          <div className="mb-0 hidden h-4.5 text-[10px] font-bold sm:block -mr-2">
            <div className="relative h-full w-full">
              {labelTickMarks.map((mark, index) => (
                <span
                  key={mark.label}
                  style={{ left: mark.left }}
                  className={`absolute top-0 ${
                    index === 0
                      ? 'translate-x-0'
                      : index === labelTickMarks.length - 1
                        ? '-translate-x-full'
                        : '-translate-x-1/2'
                  }`}
                >
                  {mark.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-0 hidden h-2 sm:block">
            <div className="relative h-full w-full">
              {yearTickMarks.map((mark, index) => (
                <span
                  key={`tick-${mark.value}`}
                  style={{ left: mark.left }}
                  className={`absolute top-0 h-2 w-px ${
                    mark.isMajor ? 'bg-white/90' : 'bg-white/50'
                  } ${index === 0 ? 'translate-x-0' : '-translate-x-1/2'}`}
                  aria-hidden
                />
              ))}
            </div>
          </div>
          <div className="relative h-8 w-full">
            <div className="pointer-events-none absolute left-0 top-1/2 h-6 w-full -translate-y-1/2 overflow-hidden rounded-full bg-gray-300">
              <div className="h-full bg-black" style={{ width: progressWidth }} />
            </div>

            <input
              type="range"
              min={0}
              max={maxIndex}
              value={yearIndex}
              onChange={event => onChangeYear(Number(event.target.value))}
              className="
      absolute inset-0
      h-8
      w-full
      appearance-none
      cursor-pointer
      bg-transparent

      [&::-webkit-slider-runnable-track]:h-8
      [&::-webkit-slider-runnable-track]:bg-transparent

      [&::-webkit-slider-thumb]:appearance-none
      [&::-webkit-slider-thumb]:h-8
      [&::-webkit-slider-thumb]:w-8
      [&::-webkit-slider-thumb]:rounded-full
      [&::-webkit-slider-thumb]:bg-black

      [&::-moz-range-track]:h-8
      [&::-moz-range-track]:bg-transparent

      [&::-moz-range-progress]:bg-transparent

      [&::-moz-range-thumb]:h-8
      [&::-moz-range-thumb]:w-8
      [&::-moz-range-thumb]:rounded-full
      [&::-moz-range-thumb]:border-0
      [&::-moz-range-thumb]:bg-black
    "
            />
          </div>
        </div>
      </div>
    </div>
  );
}
