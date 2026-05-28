'use client';

import { useEffect, useState } from 'react';
import { FaBackwardStep, FaForwardStep, FaPause, FaPlay } from 'react-icons/fa6';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const START_YEAR = 1984;
const END_YEAR = 2024;
const TOTAL_MONTHS = (END_YEAR - START_YEAR + 1) * 12;
const MAX_MONTH_INDEX = TOTAL_MONTHS - 1;
const TICK_YEARS = Array.from(
  { length: Math.floor((END_YEAR - START_YEAR) / 5) + 1 },
  (_, i) => START_YEAR + i * 5
);
const THUMB_SIZE = 32;

type TimeSliderProps = {
  yearIndex: number;
  timelineVisible: boolean;
  onToggleTimeline: () => void;
  onChangeYear: (index: number) => void;
};
export function TimeSlider({
  yearIndex,
  timelineVisible,
  onToggleTimeline,
  onChangeYear
}: TimeSliderProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  function getThumbCenterPosition(value: number) {
    const ratio = MAX_MONTH_INDEX === 0 ? 0 : value / MAX_MONTH_INDEX;

    return `calc(${ratio * 100}% + ${THUMB_SIZE / 2}px - ${ratio * THUMB_SIZE}px)`;
  }

  const progressWidth = getThumbCenterPosition(yearIndex);

  const tickMarks = TICK_YEARS.map(year => {
    const value = (year - START_YEAR) * 12;

    return {
      year,
      value,
      left: year === START_YEAR ? '0px' : getThumbCenterPosition(value)
    };
  });
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = window.setInterval(() => {
      if (yearIndex >= MAX_MONTH_INDEX) {
        setIsPlaying(false);
        return;
      }

      onChangeYear(yearIndex + 1);
    }, 150);

    return () => window.clearInterval(timer);
  }, [isPlaying, onChangeYear, yearIndex]);

  function handleNext() {
    setIsPlaying(false);
    if (yearIndex >= MAX_MONTH_INDEX) {
      return;
    }
    onChangeYear(yearIndex + 1);
  }

  function handleBefore() {
    setIsPlaying(false);

    if (yearIndex <= 0) {
      return;
    }
    onChangeYear(yearIndex - 1);
  }

  return (
    <div className="absolute bottom-8 left-1/2 z-20 h-33.25 w-[min(94vw,1180px)] -translate-x-1/2">
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
              ? 'absolute right-4 top-4 h-7 w-8'
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
          <div className="mb-2 flex justify-between gap-4">
            <p className="text-sm font-bold text-[#d8e6f5] sm:text-2xl">
              Scroll across to see how ice cover changes over time
            </p>

            <div className="flex items-center gap-2 rounded-xl backdrop-blur-md">
              <button
                type="button"
                onClick={handleBefore}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 px-3 text-sm font-extrabold text-white transition hover:bg-white/25 cursor-pointer"
                aria-label="Next month"
              >
                <FaBackwardStep aria-hidden className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className={`flex h-8 w-8 items-center justify-center rounded-md bg-white/10 px-3 text-sm font-extrabold text-white transition hover:bg-white/25 cursor-pointer ${isPlaying ? 'bg-white/25' : ''}`}
                aria-label="Play timeline"
              >
                <FaPlay aria-hidden className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 px-3 text-sm font-extrabold text-white transition hover:bg-white/25 cursor-pointer"
                aria-label="Pause timeline"
              >
                <FaPause aria-hidden className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 px-3 text-sm font-extrabold text-white transition hover:bg-white/25 cursor-pointer"
                aria-label="Next month"
              >
                <FaForwardStep aria-hidden className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mb-0 hidden h-4.5 text-[10px] font-bold sm:block -mr-2">
            <div className="relative h-full w-full">
              {tickMarks.map((mark, index) => (
                <span
                  key={mark.year}
                  style={{ left: mark.left }}
                  className={`absolute top-0 ${
                    index === 0
                      ? 'translate-x-0'
                      : index === tickMarks.length - 1
                        ? '-translate-x-full'
                        : '-translate-x-1/2'
                  }`}
                >
                  {mark.year}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-0 hidden h-2 sm:block">
            <div className="relative h-full w-full">
              {tickMarks.map((mark, index) => (
                <span
                  key={`tick-${mark.year}`}
                  style={{ left: mark.left }}
                  className={`absolute top-0 h-2 w-px bg-white/80 ${
                    index === 0 ? 'translate-x-0' : '-translate-x-1/2'
                  }`}
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
              max={MAX_MONTH_INDEX}
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
