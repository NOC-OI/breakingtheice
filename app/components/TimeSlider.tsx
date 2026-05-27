'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ASSETS } from './assets';

const START_YEAR = 1984;
const END_YEAR = 2024;
const TOTAL_MONTHS = (END_YEAR - START_YEAR + 1) * 12;
const MAX_MONTH_INDEX = TOTAL_MONTHS - 1;
const TICK_YEARS = Array.from(
  { length: Math.floor((END_YEAR - START_YEAR) / 5) + 1 },
  (_, i) => START_YEAR + i * 5
);

type TimeSliderProps = {
  yearIndex: number;
  onHideTimeline: () => void;
  onChangeYear: (index: number) => void;
};

export function TimeSlider({ yearIndex, onHideTimeline, onChangeYear }: TimeSliderProps) {
  const tickId = 'time-slider-ticks';
  const [isPlaying, setIsPlaying] = useState(false);

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
    }, 350);

    return () => window.clearInterval(timer);
  }, [isPlaying, onChangeYear, yearIndex]);

  function handleNext() {
    if (yearIndex >= MAX_MONTH_INDEX) {
      return;
    }
    onChangeYear(yearIndex + 1);
  }

  return (
    <div className="absolute bottom-8 left-1/2 w-[min(94vw,1180px)] -translate-x-1/2 rounded-2xl bg-[#0d3352f0] px-4 py-4 text-white shadow-xl sm:px-6">
      <div className="mb-2 flex items-start justify-between gap-4">
        <p className="text-sm font-bold text-[#d8e6f5] sm:text-2xl">
          Scroll across to see how ice cover changes over time
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-white/60 bg-[linear-gradient(135deg,rgba(0,0,0,0.35),rgba(40,50,95,0.28))] p-2 shadow-[0_8px_20px_rgba(31,38,135,0.25),inset_0_0_0_1px_rgba(255,255,255,0.2)] backdrop-blur-md">
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              className="flex h-10 min-w-10 items-center justify-center rounded-md bg-white/10 px-3 text-sm font-extrabold text-white transition hover:bg-white/25"
              aria-label="Play timeline"
            >
              ▶
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(false)}
              className="flex h-10 min-w-10 items-center justify-center rounded-md bg-white/10 px-3 text-sm font-extrabold text-white transition hover:bg-white/25"
              aria-label="Pause timeline"
            >
              ❚❚
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex h-10 min-w-10 items-center justify-center rounded-md bg-white/10 px-3 text-sm font-extrabold text-white transition hover:bg-white/25"
              aria-label="Next month"
            >
              ⏭
            </button>
          </div>

          <button
            type="button"
            onClick={onHideTimeline}
            className="flex h-5 w-6 items-center justify-center rounded-xs bg-[#faf7f5] px-1 py-1.5 transition hover:bg-white"
            aria-label="Hide timeline"
          >
            <Image
              src={ASSETS.visibilityHideIcon}
              alt=""
              width={14}
              height={10}
              aria-hidden
              className="h-2.5 w-3.5"
            />
          </button>
        </div>
      </div>
      <div className="mb-2 hidden justify-between text-[10px] font-bold sm:flex">
        {TICK_YEARS.map(year => (
          <span key={year}>{year}</span>
        ))}
      </div>
      <input
        type="range"
        min={0}
        max={MAX_MONTH_INDEX}
        value={yearIndex}
        onChange={event => onChangeYear(Number(event.target.value))}
        list={tickId}
        className="w-full accent-black"
      />
      <datalist id={tickId}>
        {TICK_YEARS.map(year => (
          <option key={year} value={(year - START_YEAR) * 12} label={String(year)} />
        ))}
      </datalist>
    </div>
  );
}
