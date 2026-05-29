import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
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
  onMinimize
}: QuestionsStageProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const mediaSources = (question.media ?? []).map(src =>
    src.startsWith('/') ? `${basePath}${src}` : src
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
            <p className="mt-6">{question.question}</p>
          </div>
        </div>

        <div className="flex items-end gap-8">
          <div className="mt-8 grid max-w-190 gap-4 sm:grid-cols-3">
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
                  className={`cursor-pointer relative flex h-55 flex-col overflow-hidden rounded-lg border-solid text-center text-[24px] font-bold text-[#efefef] transition sm:h-75 sm:text-[18px] bg-[#0d3352] ${
                    revealCorrect
                      ? 'border-x-[3.2px] border-t-[3.2px] border-b-[6.4px] border-[#6FFF00]'
                      : isWrongSelected
                        ? 'border-x-[3.2px] border-t-[3.2px] border-b-[6.4px] border-[#FF0000]'
                        : 'border-x-[3.2px] border-t-[3.2px] border-b-[6.4px] border-[#0d3352] hover:-translate-y-0.5'
                  }`}
                >
                  {option.image ? (
                    <div className="relative h-[60%] w-full mt-2">
                      <Image
                        src={`${BASE_PATH}${option.image}`}
                        alt={option.text}
                        fill
                        className={`object-contain transition ${
                          isWrongSelected ? 'grayscale opacity-60' : ''
                        }`}
                      />
                    </div>
                  ) : null}

                  <div className="flex flex-1 items-center justify-center px-6 py-4">
                    {isSelected ? (
                      <p className="line-clamp-4 leading-[1.2]">{option.explanation}</p>
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
                    <span className="absolute right-3 top-3 text-2xl">
                      <IoCloseCircle className="text-[#FF0000]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex max-w-190 items-center justify-between sm:mt-8">
            <button
              type="button"
              onClick={onNext}
              disabled={!isCorrect}
              className="inline-flex h-11 items-center gap-2 rounded-sm bg-[#0d3352] px-6 text-[16px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Next</span>
              <FiArrowRight aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className={`pointer-events-none mt-8 hidden h-125 w-95 md:absolute md:mt-0 md:block ${
            isEvenQuestion ? 'left-[64.5%] top-30.5' : 'right-[2.5%] top-19.5'
          }`}
          aria-hidden
        >
          <div
            className={`absolute overflow-hidden rounded-[15px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] ${
              isEvenQuestion ? 'right-0 top-0 h-65 w-62.5' : 'right-15 top-0 h-90 w-70'
            }`}
          >
            {firstMedia ? (
              <Image
                src={firstMedia}
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
            className={`absolute overflow-hidden rounded-[15px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] ${
              isEvenQuestion
                ? 'left-0 top-17.5 h-80 w-75 rotate-[8.55deg]'
                : 'right-0 top-52.5 h-75 w-[320px] rotate-[8.55deg]'
            }`}
          >
            {secondMedia ? (
              <Image
                src={secondMedia}
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
