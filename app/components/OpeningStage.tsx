import Image from 'next/image';
import { ASSETS } from './assets';
import { QuestVisibilityControl } from './QuestVisibilityControl';

type OpeningStageProps = {
  onPlay: () => void;
  onMinimize: () => void;
};

export function OpeningStage({ onPlay, onMinimize }: OpeningStageProps) {
  return (
    <section className="relative z-20 h-full w-full overflow-hidden bg-[#0d3352]">
      <div className="absolute inset-[-133.58%_-48.43%_-139.5%_-40.02%] opacity-70">
        <Image src={ASSETS.openingVectorPrimary} alt="" fill className="object-fill" />
      </div>
      <div className="absolute inset-[-138.27%_-55.25%_-144.18%_-46.84%] opacity-70">
        <Image src={ASSETS.openingVectorSecondary} alt="" fill className="object-fill" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
        <div className="max-w-280">
          <h1 className="font-[Baloo_2] text-[clamp(3.9rem,8vw,8.5rem)] font-black leading-none tracking-[-0.04em] text-[#00b5ff] drop-shadow-[0_5px_0_rgba(0,0,0,0.35)] sm:text-[clamp(5.5rem,9vw,8.5rem)]">
            CLIMATE QUEST
          </h1>
          <p className="mx-auto mt-2 max-w-270.75 font-[Baloo_2] text-[clamp(2.2rem,5vw,5.75rem)] font-black leading-[1.02] tracking-[-0.03em] text-[#00b5ff] drop-shadow-[0_4px_0_rgba(0,0,0,0.3)]">
            Arctic Ice Investigators
          </p>
        </div>

        <button
          type="button"
          onClick={onPlay}
          className="mt-14 inline-flex h-16.5 items-center gap-2.5 rounded-xl border-[2.66px] border-white/50 bg-[#00b5ff] px-6 pb-3 pt-2.5 text-[31px] font-extrabold uppercase tracking-[0.04em] text-[#0d3352] shadow-[0_13px_0_rgba(0,0,0,0.2)] transition hover:translate-y-px"
        >
          <Image src={ASSETS.playIcon} alt="" width={37} height={37} className="h-9.25 w-9.25" />
          Play
        </button>
      </div>

      <QuestVisibilityControl onClick={onMinimize} />
    </section>
  );
}
