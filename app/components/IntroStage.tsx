import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import { ASSETS } from './assets';
import { QuestVisibilityControl } from './QuestVisibilityControl';

type IntroStageProps = {
  warningProgress: number;
  showStartMission: boolean;
  onStartMission: () => void;
  onMinimize: () => void;
};

export function IntroStage({
  warningProgress,
  showStartMission,
  onStartMission,
  onMinimize
}: IntroStageProps) {
  const startMissionTimerRef = useRef<number | null>(null);
  const previousWarningProgressRef = useRef(warningProgress);
  const [isStartMissionPressing, setIsStartMissionPressing] = useState(false);
  const [isStartMissionHovered, setIsStartMissionHovered] = useState(false);
  const [alertFlashStep, setAlertFlashStep] = useState(0);

  useEffect(() => {
    return () => {
      if (startMissionTimerRef.current) {
        window.clearTimeout(startMissionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (warningProgress < previousWarningProgressRef.current) {
      setAlertFlashStep(step => step + 1);
    }

    previousWarningProgressRef.current = warningProgress;
  }, [warningProgress]);

  function handleStartMissionClick() {
    if (startMissionTimerRef.current) {
      window.clearTimeout(startMissionTimerRef.current);
    }

    setIsStartMissionPressing(true);
    startMissionTimerRef.current = window.setTimeout(() => {
      onStartMission();
      setIsStartMissionPressing(false);
    }, 150);
  }

  const startMissionOffsetY = isStartMissionPressing ? 8 : isStartMissionHovered ? 3 : 0;
  const clampedWarningProgress = Math.max(0, Math.min(100, warningProgress));
  const isAlertFlipped = clampedWarningProgress < 100 && alertFlashStep % 2 === 1;

  return (
    <section className="relative z-20 h-dvh w-dvw overflow-hidden bg-[#b9b3b9]">
      <div className="absolute inset-0 opacity-55">
        <Image src={ASSETS.arcticOutline} alt="" fill className="object-cover" priority />
      </div>

      <div className="absolute left-[max(20px,4vw)] md:left-[max(24px,5vw)] xl:left-[max(24px,7vw)] top-3 sm:top-4 md:top-[max(16px,3.5vh)] xl:top-[max(28px,11vh)] border border-[#ffd21f] z-10 w-[min(90vw,420px)] md:w-[min(50vw,440px)] xl:w-[482px] overflow-hidden rounded-lg bg-[#0d3352] pt-3 md:pt-4 pb-0 text-white shadow-[0_22px_34px_rgba(0,0,0,0.14),0_8px_42px_rgba(0,0,0,0.12),0_11px_14px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-3 md:gap-4 px-4 md:px-5">
          <div
            className={`flex h-9 w-9 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full text-xl md:text-2xl font-black transition-colors duration-50 ${
              isAlertFlipped ? 'bg-[#ffd21f] text-[#303746]' : 'bg-[#303746] text-[#ffd21f]'
            }`}
          >
            <span className="leading-none">!</span>
          </div>
          <div>
            <div className="text-[18px] sm:text-[20px] md:text-[22px] xl:text-[24px] leading-none font-black tracking-tight">
              WARNING
            </div>
            <p className="mt-1 text-[clamp(12px,1.2vw,18px)] leading-tight font-semibold text-[#e1e1e1]">
              Earth&apos;s Cooling system is under
              <br />
              critical status. Action required.
            </p>
          </div>
        </div>
        <div
          className="mt-2.5 md:mt-3 mb-0 pb-0 h-2 rounded-[10px] bg-[#ffd21f]/35 blur-[1.5px] transition-[width] duration-100 ease-linear"
          style={{ width: `${clampedWarningProgress}%` }}
        />
        <div className="-mt-2 h-2 w-full overflow-hidden rounded-[10px] bg-[#0b2237]">
          <div
            className="h-full rounded-full bg-[#ffd21f] transition-[width] duration-100 ease-linear"
            style={{ width: `${clampedWarningProgress}%` }}
          />
        </div>
      </div>

      <div className="absolute right-2 sm:right-4 md:right-[2vw] lg:right-[4vw] xl:right-[10vw] z-10 top-0 w-[180px] sm:w-[240px] md:w-[300px] lg:w-[380px] xl:w-[480px] drop-shadow-[0_18px_24px_rgba(0,0,0,0.35)] animate-[fadeIn_.45s_ease-out]">
        <Image
          src={ASSETS.agentCard}
          alt=""
          width={480}
          height={500}
          className="h-auto w-full object-contain"
          priority
        />
      </div>

      {showStartMission && (
        <div className="absolute left-[max(20px,4vw)] md:left-[max(24px,5vw)] xl:left-[max(24px,7vw)] top-[16%] sm:top-[18%] md:top-[16%] lg:top-[18%] xl:top-[24vh] z-20 w-[90vw] sm:w-[84vw] md:w-[56%] lg:w-[54%] xl:w-[51%] text-black max-h-[calc(100dvh-18%)] overflow-y-auto pr-2 pb-8">
          <div className="pt-2 sm:pt-4 md:pt-2 xl:pt-0 xl:pb-6">
            <h2 className="font-['Courier_New'] text-[22px] sm:text-[24px] md:text-[28px] lg:text-[32px] xl:text-[36px] leading-[1.2] font-bold">
              Greetings Agent
            </h2>

            <p className="mt-3 md:mt-3.5 xl:mt-6 font-['Courier_New'] text-[14px] sm:text-[15px] md:text-[17px] lg:text-[20px] xl:text-[26px] leading-[1.3] font-bold">
              Across the Arctic, rising temperatures are triggering a chain reaction. Ocean currents
              are changing, glaciers and arctic ice are melting, and habitats are disappearing.
            </p>

            <p className="mt-3 md:mt-3.5 xl:mt-6 font-['Courier_New'] text-[14px] sm:text-[15px] md:text-[17px] lg:text-[20px] xl:text-[26px] leading-[1.3] font-bold">
              NOC have uncovered 5 critical data points.
            </p>

            <p className="mt-3 md:mt-3.5 xl:mt-6 font-['Courier_New'] text-[14px] sm:text-[15px] md:text-[17px] lg:text-[20px] xl:text-[26px] leading-[1.3] font-bold">
              Your mission is to read each scenario and select the correct scientific outcome. One
              wrong calculation could accelerate the damage. We need to stabilise the climate
              models, to protect our polar regions.
            </p>

            <p className="mt-3 md:mt-3.5 xl:mt-6 font-['Courier_New'] text-[14px] sm:text-[15px] md:text-[17px] lg:text-[20px] xl:text-[26px] leading-[1.3] font-bold">
              The fate of Planet Earth rests in your hands.
              <br />
              Are you ready to accept this mission?
            </p>
          </div>
          <button
            type="button"
            onClick={handleStartMissionClick}
            onMouseEnter={() => setIsStartMissionHovered(true)}
            onMouseLeave={() => setIsStartMissionHovered(false)}
            style={{ transform: `translateY(${startMissionOffsetY}px)` }}
            className={`cursor-pointer mt-4 md:mt-6 xl:mt-8 inline-flex h-10 md:h-11 xl:h-12 items-center justify-center gap-2 rounded-sm bg-[#0d3352] px-6 md:px-8 py-3 md:py-6 text-[17px] md:text-[19px] xl:text-[22px] font-semibold text-white transition-[transform,box-shadow,filter] duration-150 hover:brightness-110 active:brightness-100 ${
              isStartMissionPressing
                ? 'shadow-[0_0_0_rgba(0,0,0,0.22)]'
                : isStartMissionHovered
                  ? 'shadow-[0_4px_0_rgba(0,0,0,0.22)]'
                  : 'shadow-[0_7px_0_rgba(0,0,0,0.22)]'
            }`}
          >
            <span>Start Mission</span>
            <FiArrowRight aria-hidden className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      )}

      <QuestVisibilityControl onClick={onMinimize} />
    </section>
  );
}
