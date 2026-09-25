import Image from 'next/image';
import { ASSETS } from './assets';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

type FinishStageProps = {
  onFinish: () => void;
  onBack: () => void;
};

export function FinishStage({ onFinish, onBack }: FinishStageProps) {
  return (
    <section className="relative z-20 h-dvh w-dvw overflow-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 bg-[#0D3352] text-white">
      <div className="mx-auto flex min-h-full w-full max-w-[1400px] flex-col justify-between pb-8 pt-6 sm:pt-8 md:pt-10 lg:pt-16 xl:pt-28">
        <div>
          <h2 className="font-rl-aqva-black text-[28px] sm:text-[34px] md:text-[38px] lg:text-[42px] xl:text-[45px] font-extrabold leading-tight sm:max-w-2xl">
            Great work.
            <br />
            But we can all do more!
          </h2>

          <div className="mt-6 md:mt-8 xl:mt-10 grid gap-6 sm:gap-8 md:gap-8 lg:gap-12 xl:gap-16 grid-cols-1 md:grid-cols-[1.25fr_1fr] lg:grid-cols-[1.3fr_1fr] items-start md:items-center">
            <div className="text-[#f2f6fb]">
              <p className="mb-2 md:mb-3 text-lg font-bold leading-[1.3] sm:text-xl md:text-xl lg:text-[22px] font-test-sohne">
                Some things you can do to help:
              </p>
              <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
                <li className="font-test-sohne text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] font-semibold pb-2 leading-[1.35]">
                  Reduce your energy consumption.
                  <br />
                  When traveling:
                  <span className="font-light">
                    {' '}
                    cycle or take the train or bus instead of driving a car. Flying by airplane
                    burns large amounts of fossil fuels.
                  </span>
                </li>

                <li className="font-test-sohne text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] font-semibold pb-2 leading-[1.35]">
                  Save energy at home.
                  <br />
                  <span className="font-light">
                    Switch off lights when you leave the room, don&apos;t leave the tap running when
                    you brush your teeth.
                  </span>
                </li>

                <li className="font-test-sohne text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] font-semibold pb-2 leading-[1.35]">
                  Participate in climate-focused projects in your schools or college!
                </li>

                <li className="font-test-sohne text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] font-semibold pb-2 leading-[1.35]">
                  Learn about renewable energy.
                </li>

                <li className="font-test-sohne text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] font-semibold pb-2 leading-[1.35]">
                  Eat more vegetables.
                  <br />
                  <span className="font-light">
                    Food like fruit & veg, whole grains, legumes, nuts and seeds lower your
                    environmental impact. Meat and dairy use a lot of energy!
                  </span>
                </li>

                <li className="font-test-sohne text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] font-semibold pb-2 leading-[1.35]">
                  Think about how you live and your relationship to waste.
                  <br />
                  <span className="font-light">
                    Do you litter, or do you clean up after yourself? Do you recycle?
                  </span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <div className="mx-auto w-full max-w-[260px] sm:max-w-[300px] md:max-w-[340px] lg:max-w-[420px] xl:max-w-120">
                <Image
                  src={ASSETS.finishDiver}
                  alt="Diver illustration"
                  width={500}
                  height={360}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="mt-6 md:mt-6 xl:mt-8 flex flex-row md:flex-row lg:flex-col gap-3 sm:gap-4 md:gap-4 w-full justify-center md:justify-start">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex w-32 md:w-32.5 h-10 md:h-11 items-center justify-center gap-1.5 border border-[#00B5FF] bg-transparent cursor-pointer rounded-md px-5 md:px-6 py-2.5 md:py-3 text-white shadow-[0_5px_0_rgba(0,0,0,0.22)] md:shadow-[0_7px_0_rgba(0,0,0,0.22)] transition hover:bg-[#00B5FF]/15 active:translate-y-0.5"
                >
                  <FiArrowLeft aria-hidden className="h-5 w-5" />
                  <span className="text-[1rem] font-semibold">Back</span>
                </button>
                <button
                  type="button"
                  onClick={onFinish}
                  className="inline-flex w-32 md:w-32.5 h-10 md:h-11 items-center justify-center gap-1.5 cursor-pointer rounded-md bg-[#00B5FF] px-6 md:px-8 py-2.5 md:py-3 text-black font-semibold shadow-[0_5px_0_rgba(0,0,0,0.22)] md:shadow-[0_7px_0_rgba(0,0,0,0.22)] transition hover:brightness-110 active:translate-y-0.5"
                >
                  <span className="text-[1rem] font-semibold">Finish</span>
                  <FiArrowRight aria-hidden className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-4 flex flex-row">
          <p className="text-[11px] md:text-[12px] leading-[1.3] text-[#00B5FF]/70 font-test-sohne">
            Illustration by John Stocker (Iconscout Free to Use License)
          </p>
        </div>
      </div>
    </section>
  );
}
