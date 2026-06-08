'use client';

import Image from 'next/image';
import { ASSETS } from './assets';

type StartQuestButtonProps = {
  hasQuestStarted: boolean;
  isStartButtonPressing: boolean;
  onClick: () => void;
};
export function StartQuestButton({
  hasQuestStarted,
  isStartButtonPressing,
  onClick: handleStartOrResumeClick
}: StartQuestButtonProps) {
  return (
    <button
      type="button"
      onClick={handleStartOrResumeClick}
      className={`absolute right-12 top-10 flex h-12 cursor-pointer items-center gap-3 rounded-xl bg-[#00b5ff] py-2.5 pl-5 text-2xl font-extrabold tracking-wide text-[#0d3352] shadow-[3px_3px_1px_rgba(255,255,255,0.2)] transition-all duration-200 hover:bg-[#00a0e0] hover:brightness-105 active:scale-[0.98] sm:text-4xl ${
        isStartButtonPressing ? 'scale-105' : 'scale-100'
      }`}
    >
      <span className="font-rl-aqva-black">{hasQuestStarted ? 'Resume Quest' : 'Start Quest'}</span>
      <Image
        src={ASSETS.bearZoom}
        alt="Quest agent"
        width={70}
        height={70}
        className="h-20 w-20 rounded-full border-2 border-[#0d3352] object-cover sm:h-20 sm:w-20 -mr-4"
      />
    </button>
  );
}
