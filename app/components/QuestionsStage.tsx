import Image from 'next/image';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import type { Question } from '../types/quiz';
import { QuestVisibilityControl } from './QuestVisibilityControl';
import { IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';

type QuestionsStageProps = {
  question: Question;
  questionIndex: number;
  selectedOption: number | null;
  isCorrect: boolean;
  onSelectOption: (index: number) => void;
  onNext: () => void;
  onBack: () => void;
  onMinimize: () => void;
};

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function QuestionsStage({
  question,
  questionIndex,
  selectedOption,
  isCorrect,
  onSelectOption,
  onNext,
  onBack,
  onMinimize
}: QuestionsStageProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const mediaSources = (question.media ?? []).map(src =>
    ({ ...src, image: src.image && src.image.startsWith('/') ? `${basePath}${src.image}` : src.image })
  );

  const firstMedia = mediaSources[0];
  const secondMedia = mediaSources[1];

  const isEvenQuestion = (questionIndex + 1) % 2 === 0;

  return (
    <section
      className="relative z-20 h-screen w-full overflow-hidden"
      style={{ backgroundColor: question.bg }}
    >
      <div className="relative mx-auto h-full w-[min(1440px,96vw)] px-4 pb-8 pt-19 sm:px-8 lg:px-18">
        <div className="max-w-197.5 text-[#0d3352]">
          <h2 className="font-rl-aqva-black text-[clamp(2.1rem,4vw,4rem)] font-extrabold leading-[1.05]">
            {question.title}
          </h2>

          <div className="mt-4 text-[clamp(1.05rem,1.75vw,1.85rem)] font-extrabold leading-[1.3]">
            <p>{question.scenario}</p>
            <p className="mt-6 font-black">{question.question}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:gap-8 mt-15 w-full">
          <div className="mt-8 grid w-full max-w-190 gap-4 sm:grid-cols-3">
            {question.options.map((option, index) => {
              const isSelected = selectedOption === index;
              const isCorrectOption = question.correctIndex === index;
              const revealCorrect = isSelected && isCorrectOption;
              const isWrongSelected = isSelected && !isCorrectOption;

              return (
                <button
                  key={option.text}
                  type="button"
                  onClick={() => onSelectOption(index)}
                  className={`w-full cursor-pointer relative flex h-55 flex-col overflow-hidden rounded-lg border-solid text-center text-[24px] font-bold text-[#efefef] transition sm:h-75 sm:text-[18px] bg-[#0d3352] ${revealCorrect
                    ? 'border-x-[3.2px] border-t-[3.2px] border-b-[6.4px] border-[#6FFF00]'
                    : isWrongSelected
                      ? 'border-x-[3.2px] border-t-[3.2px] border-b-[6.4px] border-[#FF0000]'
                      : 'border-x-[3.2px] border-t-[3.2px] border-b-[6.4px] border-[#0d3352] hover:-translate-y-0.5'
                    }`}
                >
                  {option.image ? (
                    <div className="relative h-[55%] flex items-center justify-center w-full mt-5">
                      <Image
                        src={`${BASE_PATH}${option.image}`}
                        alt={option.text}
                        width={option.width}
                        height={option.height}
                        className={`object-contain transition ${isWrongSelected ? 'grayscale opacity-60' : ''
                          }`}
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 items-center justify-center px-3 py-4">
                    {isSelected ? (
                      <p className="line-clamp-6 leading-[1.2]">{option.explanation}</p>
                    ) : (
                      <p className="line-clamp-4 leading-[1.2]">{option.text}</p>
                    )}
                  </div>

                  {revealCorrect && (
                    <span className="absolute right-3 top-3 text-2xl">
                      <IoCheckmarkCircle className="text-[#6FFF00]" />
                    </span>
                  )}
                  {isWrongSelected && (
                    <span className="absolute right-3 top-3 flex items-center justify-center text-2xl">
                      <span className="absolute h-[0.6em] w-[0.6em] rounded-full bg-white" />
                      <IoCloseCircle className="relative z-10 text-[#FF0000]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex flex-row gap-3 w-full md:flex-col md:w-40 md:mt-8 md:gap-3">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[4px] border border-[#0d3352] bg-transparent px-6 text-[16px] font-semibold text-[#0d3352] transition hover:bg-[#0d3352]/5 w-full"
            >
              <FiArrowLeft aria-hidden className="h-5 w-5" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!isCorrect}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[4px] bg-[#0d3352] px-6 text-[16px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 w-full"
            >
              <span>Next</span>
              <FiArrowRight aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className={`pointer-events-none mt-8 hidden h-125 w-95 md:absolute md:mt-0 md:block ${true ? 'left-[68.5%] top-30.5' : 'right-[2.5%] top-19.5'
            }`}
          aria-hidden
        >
          <div
            className={`absolute ${firstMedia?.position === 'top' ? 'z-10' : 'z-0'} overflow-hidden rounded-[15px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] right-15 top-0`}
            style={{
              width: firstMedia?.width ? `${Number(firstMedia.width) * 4}px` : '280px',
              height: firstMedia?.height ? `${Number(firstMedia.height) * 4}px` : '360px',
              transform: `rotate(${firstMedia?.transform ?? '0deg'})`
            }}
          >
            {firstMedia ? (
              <Image
                src={firstMedia.image}
                alt="Question visual"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 280px"
              />
            ) : (
              <div className="h-full w-full bg-[#d9d9d9]" />
            )}
          </div>

          <div
            className={`absolute ${secondMedia?.position === 'top' ? 'z-10' : 'z-0'} overflow-hidden rounded-[15px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] left-40 top-72.5`}
            style={{
              width: secondMedia?.width ? `${Number(secondMedia.width) * 4}px` : '320px',
              height: secondMedia?.height ? `${Number(secondMedia.height) * 4}px` : '300px',
              transform: `rotate(${secondMedia?.transform ?? '0deg'})`
            }}
          >
            {secondMedia ? (
              <Image
                src={secondMedia.image}
                alt="Question visual"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 320px"
              />
            ) : (
              <div className="h-full w-full bg-[#807f7f]" />
            )}
          </div>
        </div>
      </div>

      <QuestVisibilityControl onClick={onMinimize} />
    </section>
  );
}
