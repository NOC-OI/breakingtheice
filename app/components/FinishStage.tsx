import Image from 'next/image';
import { ASSETS } from './assets';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

type FinishStageProps = {
  onFinish: () => void;
  onBack: () => void;
};

export function FinishStage({ onFinish, onBack }: FinishStageProps) {
  return (
    <section className="relative z-20 h-full w-full overflow-auto pl-20 bg-[#0D3352] text-white">
      <div className="mx-auto flex min-h-full w-[min(1400px,96vw)] flex-col px-5 pb-10 px-8 pt-14 xl:pt-45">
        <h2 className="font-rl-aqva-black text-[45px] font-extrabold leading-tight sm:max-w-2xl sm:text-[45px]">
          Great work.
          <br />
          But we can all do more!
        </h2>

        <div className="mt-8 xl:mt-10 grid gap-18 grid-cols-[1.3fr_1fr] items-center">
          <div className="text-lg font-medium leading-[1.3] text-[#f2f6fb] sm:text-[20px]">
            <p className="mb-3 text-xl font-bold leading-[1.3] sm:text-[22px] font-test-sohne">
              Some things you can do to help:
            </p>
            <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
              <li className="font-test-sohne text-[20px] font-semibold pb-2 leading-[1.3]">
                Reduce your energy consumption.
                <br />
                When traveling:
                <span className="font-light">
                  {' '}
                  cycle or take the train or bus instead of driving a car. Flying by airplane burns
                  large amounts of fossil fuels.
                </span>
              </li>

              <li className="font-test-sohne text-[20px] font-semibold pb-2 leading-[1.3]">
                Save energy at home.
                <br />
                <span className="font-light">
                  Switch off lights when you leave the room, don&apos;t leave the tap running when
                  you brush your teeth.
                </span>
              </li>

              <li className="font-test-sohne text-[20px] font-semibold pb-2 leading-[1.3]">
                Participate in climate-focused projects in your schools or college!
              </li>

              <li className="font-test-sohne text-[20px] font-semibold pb-2 leading-[1.3]">
                Learn about renewable energy.
              </li>

              <li className="font-test-sohne text-[20px] font-semibold pb-2 leading-[1.3]">
                Eat more vegetables.
                <br />
                <span className="font-light">
                  Food like fruit & veg, whole grains, legumes, nuts and seeds lower your
                  environmental impact. Meat and dairy use a lot of energy!
                </span>
              </li>

              <li className="font-test-sohne text-[20px] font-semibold pb-2 leading-[1.3]">
                Think about how you live and your relationship to waste.
                <br />
                <span className="font-light">
                  Do you litter, or do you clean up after yourself? Do you recycle?
                </span>
              </li>
            </ul>
          </div>
          <div className="flex flex-col">
            <div className="mx-auto w-full max-w-120 h-85 xl:h-70">
              <Image src={ASSETS.finishDiver} alt="Diver illustration" width={500} height={360} />
            </div>
            <div className="mt-6 flex flex-col gap-3 w-full w-40 xl:mt-0">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex w-[130px] h-11 items-center justify-center gap-1 border border-[#00B5FF] bg-transparent cursor-pointer mt-10 rounded-md bg-[#00B5FF] px-6 py-3 text-white shadow-[0_7px_0_rgba(0,0,0,0.22)] transition hover:bg-[#0d3352]/5"
              >
                <FiArrowLeft aria-hidden className="h-5 w-5" />
                <span className="text-[1rem] font-semibold">Back</span>
              </button>
              <button
                type="button"
                onClick={onFinish}
                className="inline-flex w-[130px] h-11 items-center justify-center gap-1 cursor-pointer rounded-md bg-[#00B5FF] px-8 py-3 text-black shadow-[0_7px_0_rgba(0,0,0,0.22)] transition hover:brightness-110"
              >
                <span className="text-[1rem] font-semibold">Finish</span>
                <FiArrowRight aria-hidden className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-self-end">
          <p className="text-[12px] pt-5 xl:pt-50 leading-[1.3] text-[#00B5FF]/70 lg:left-18 font-test-sohne">
            Illustration by John Stocker (Iconscout Free to Use License)
          </p>
        </div>
      </div>
    </section>
  );
}
