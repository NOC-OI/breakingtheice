import Image from 'next/image';
import { ASSETS } from './assets';

type FinishStageProps = {
  onFinish: () => void;
};

export function FinishStage({ onFinish }: FinishStageProps) {
  return (
    <section className="relative z-20 h-full w-full overflow-auto bg-[#0d3352] text-white">
      <div className="mx-auto flex min-h-full w-[min(1400px,96vw)] flex-col px-5 pb-10 pt-8 sm:px-8 sm:pt-14">
        <h2 className="font-[Baloo_2] text-5xl font-extrabold leading-tight sm:max-w-2xl sm:text-7xl">
          Great work.
          <br />
          But we can all do more!
        </h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-[1.3fr_1fr] sm:items-center">
          <div className="text-lg font-bold leading-relaxed text-[#f2f6fb] sm:text-3xl">
            <p className="mb-3 text-xl font-extrabold sm:text-3xl">
              Some things you can do to help:
            </p>
            <p>• Eat more vegetables. Plant-rich diets often lower climate impact.</p>
            <p>• Reduce waste and recycle where possible.</p>
            <p>• Learn about renewable energy in your community.</p>
            <p>• Save power at home and choose low-emission travel when possible.</p>
            <p>• Join climate-focused projects in your school or college.</p>
          </div>

          <Image
            src={ASSETS.finishDiver}
            alt="Diver illustration"
            width={520}
            height={360}
            className="mx-auto w-full max-w-130 object-contain"
          />
        </div>

        <button
          type="button"
          onClick={onFinish}
          className="mx-auto mt-10 rounded-md bg-[#00b5ff] px-8 py-3 text-xl font-extrabold text-white shadow-[0_7px_0_rgba(0,0,0,0.22)] transition hover:brightness-110"
        >
          Finish →
        </button>
      </div>
    </section>
  );
}
