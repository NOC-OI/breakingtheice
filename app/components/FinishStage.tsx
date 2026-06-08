import Image from 'next/image';
import { ASSETS } from './assets';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

type FinishStageProps = {
  onFinish: () => void;
  onBack: () => void;
};

export function FinishStage({ onFinish, onBack }: FinishStageProps) {
  return (
    <section className="relative z-20 h-full w-full overflow-auto bg-[#0D3352] text-white">
      <div className="mx-auto flex min-h-full w-[min(1400px,96vw)] flex-col px-5 pb-10 xl:pt-45 sm:px-8 sm:pt-14">
        <h2 className="font-rl-aqva-black text-[45px] font-extrabold leading-tight sm:max-w-2xl sm:text-[45px]">
          Great work.
          <br />
          But we can all do more!
        </h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-[1.3fr_1fr] sm:items-center">
          <div className="text-lg font-medium leading-[1.3] text-[#f2f6fb] sm:text-[20px]">
            <p className="mb-3 text-xl font-bold leading-[1.3] sm:text-[22px] font-test-sohne">
              Some things you can do to help:
            </p>
            <p className="text-[20px] font-bold">
              • Eat more vegetables.
              <span className="text-[20px] font-light">
                {' '}
                Food like fruit & veg, whole grains, legumes, nuts and seeds lower your
                environmental impact. Meat and dairy use a lot of energy!
              </span>
            </p>
            <p className="text-[20px] font-bold">
              • Think about how you live and your relationship to waste.{' '}
              <span className="text-[20px] font-light">
                {' '}
                Do you litter, or do you clean up after yourself? Do you recycle?
              </span>
            </p>
            <p className="text-[20px] font-bold">• Learn about renewable energy.</p>
            <p className="text-[20px] font-bold">
              • Participate in climate-focused projects in your schools or college!
            </p>
            <p className="text-[20px] font-bold">
              • Reduce your energy consumption. When traveling: cycle instead of taking the bus or
              driving a car.{' '}
              <span className="text-[20px] font-light">
                Flying by airplane burns large amounts of fossil fuels. At home: switch off lights
                when you leave the room, don&apos;t leave the tap running when you brush your teeth.
              </span>
            </p>
          </div>
          <div>
            <Image
              src={ASSETS.finishDiver}
              alt="Diver illustration"
              width={520}
              height={360}
              className="mx-auto w-full max-w-130 object-contain"
            />
            <div className="mt-6 flex flex-row gap-3 w-full md:flex-col md:w-40 md:mt-8 md:gap-3">
              <button
                type="button"
                onClick={onBack}
                className="border border-[#ffffff] bg-transparent cursor-pointer mt-10 rounded-md bg-[#00B5FF] w-[68px] px-6 py-3 text-xl font-extrabold text-white shadow-[0_7px_0_rgba(0,0,0,0.22)] transition hover:bg-[#0d3352]/5"
              >
                <FiArrowLeft aria-hidden className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onFinish}
                className="cursor-pointer rounded-md bg-[#00B5FF] w-[123px] px-8 py-3 text-xl font-extrabold text-white shadow-[0_7px_0_rgba(0,0,0,0.22)] transition hover:brightness-110"
              >
                <FiArrowRight aria-hidden className="h-5 w-5 ml-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-row justify-start">
            <p className="text-[12px] pt-20 xl:pt-55 leading-[1.3] text-[#00B5FF]/70 lg:left-18 font-test-sohne">
              Illustration by John Stocker (Iconscout Free to Use License)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
