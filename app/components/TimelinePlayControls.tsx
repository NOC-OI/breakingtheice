import { FaBackwardStep, FaForward, FaForwardStep, FaPause, FaPlay } from 'react-icons/fa6';
import type { DatasetMode } from './mapDataset';

export type PlaybackMode = 'paused' | 'play' | 'fast' | 'faster' | 'evenfaster';

type TimelinePlayControlsProps = {
  playbackMode: PlaybackMode;
  datasetMode: DatasetMode;
  onCyclePlayback: () => void;
  onPause: () => void;
  onPreviousMonth: () => void;
  onPreviousYear: () => void;
  onNextMonth: () => void;
  onNextYear: () => void;
};

function PlaybackIcon({ playbackMode }: { playbackMode: PlaybackMode }) {
  if (playbackMode === 'fast') {
    return <FaForward aria-hidden className="h-5 w-5" />;
  }

  if (playbackMode === 'faster') {
    return (
      <span className="flex items-center gap-0.5" aria-hidden>
        <FaPlay className="h-2.5 w-2.5" />
        <FaForward className="h-3 w-3 ml-[-0.28rem]" />
      </span>
    );
  }

  if (playbackMode === 'evenfaster') {
    return (
      <span className="flex items-center gap-0.5" aria-hidden>
        <FaForward className="h-[0.65rem] w-[0.65rem]" />
        <FaForward className="h-[0.65rem] w-[0.65rem] ml-[-0.20rem]" />
      </span>
    );
  }

  return <FaPlay aria-hidden className="h-4 w-4" />;
}

export function TimelinePlayControls({
  playbackMode,
  onCyclePlayback,
  onPause,
  onPreviousMonth,
  onNextMonth
}: TimelinePlayControlsProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl backdrop-blur-md">
      {/*
      <button
        type="button"
        onClick={onPreviousYear}
        disabled={yearStepDisabled}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 px-2.5 text-sm font-extrabold text-white transition hover:bg-white/25 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous year"
        title="Previous year"
      >
        <FaFastBackward aria-hidden className="h-4 w-4" />
      </button>
      */}

      <button
        type="button"
        onClick={onPreviousMonth}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 px-3 text-sm font-extrabold text-white transition hover:bg-white/25 cursor-pointer"
        aria-label="Previous month"
        title="Previous month"
      >
        <FaBackwardStep aria-hidden className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onCyclePlayback}
        className={`flex h-8 w-8 items-center justify-center rounded-md bg-white/10 ${playbackMode === 'fast' ? 'px-2.5' : 'px-3'} text-sm font-extrabold text-white transition hover:bg-white/25 cursor-pointer ${playbackMode !== 'paused' ? 'bg-white/25' : ''}`}
        aria-label="Cycle playback speed"
        title="Cycle playback speed"
      >
        <PlaybackIcon playbackMode={playbackMode} />
      </button>

      <button
        type="button"
        onClick={onPause}
        className={`flex h-8 w-8 items-center justify-center rounded-md bg-white/10 px-3 text-sm font-extrabold text-white transition hover:bg-white/25 cursor-pointer ${playbackMode === 'paused' ? 'bg-white/25' : ''}`}
        aria-label="Pause timeline"
        title="Pause timeline"
      >
        <FaPause aria-hidden className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onNextMonth}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 px-3 text-sm font-extrabold text-white transition hover:bg-white/25 cursor-pointer"
        aria-label="Next month"
        title="Next month"
      >
        <FaForwardStep aria-hidden className="h-4 w-4" />
      </button>

      {/*
      <button
        type="button"
        onClick={onNextYear}
        disabled={yearStepDisabled}
        className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 px-2.5 text-sm font-extrabold text-white transition hover:bg-white/25 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next year"
        title="Next year"
      >
        <FaFastForward aria-hidden className="h-5 w-5" />
      </button>
      */}
    </div>
  );
}
