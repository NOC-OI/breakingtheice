import Image from 'next/image';
import { ASSETS } from './assets';
import { QuestVisibilityControl } from './QuestVisibilityControl';

type IntroStageProps = {
  warningProgress: number;
  showAgent: boolean;
  showStartMission: boolean;
  onStartMission: () => void;
  onMinimize: () => void;
};

export function IntroStage({
  warningProgress,
  showAgent,
  showStartMission,
  onStartMission,
  onMinimize
}: IntroStageProps) {
  return (
    <section className="relative z-20 h-full w-full overflow-hidden bg-[#b9b3b9]">
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[24px_24px]" />

      <div className="absolute left-6 top-10 z-10 w-[min(90vw,520px)] rounded-lg bg-[#0d3352] p-4 text-white shadow-2xl">
        <div className="mb-1 text-3xl font-extrabold tracking-wide">WARNING</div>
        <p className="text-lg font-semibold text-[#d8e6f5]">
          Earth&apos;s Cooling system is under critical status. Action required.
        </p>
        <div className="mt-4 h-3 w-full rounded-full bg-[#0b2237]">
          <div
            className="h-full rounded-full bg-[#ffd21f] transition-[width] duration-100"
            style={{ width: `${warningProgress}%` }}
          />
        </div>
      </div>

      {showAgent && (
        <div className="absolute right-[6vw] top-[18vh] z-10 rotate-6 rounded-3xl bg-white/90 p-4 shadow-2xl animate-[fadeIn_.45s_ease-out] sm:p-6">
          <Image
            src={ASSETS.agentCard}
            alt="Agent Blue"
            width={330}
            height={470}
            className="h-90 w-62.5 rounded-2xl object-cover sm:h-117.5 sm:w-82.5"
          />
        </div>
      )}

      {showStartMission && (
        <button
          type="button"
          onClick={onStartMission}
          className="absolute bottom-14 left-1/2 z-20 -translate-x-1/2 rounded-xl border border-white/70 bg-[#00b5ff] px-7 py-3 text-2xl font-extrabold uppercase tracking-wide text-[#0d3352] shadow-[0_8px_0_rgba(0,0,0,0.22)] transition hover:brightness-105"
        >
          Start Mission
        </button>
      )}

      <QuestVisibilityControl onClick={onMinimize} />
    </section>
  );
}
