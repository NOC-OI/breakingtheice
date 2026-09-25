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
  const mediaSources = (question.media ?? []).map(src => ({
    ...src,
    image: src.image && src.image.startsWith('/') ? `${basePath}${src.image}` : src.image
  }));

  const firstMedia = mediaSources[0];
  const secondMedia = mediaSources[1];
  return (
    <section
      className="relative z-20 h-dvh w-full overflow-hidden"
      style={{ backgroundColor: question.bg }}
    >
      <div className="relative mx-auto h-full w-full max-w-[1550px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 pb-8 pt-12 sm:pt-14 md:pt-14 lg:pt-18 xl:pt-28 flex flex-col justify-between overflow-y-auto md:overflow-hidden">
        <div className="relative z-10 w-full md:w-[63%] lg:w-[65%] xl:w-[68%] max-w-220">
          <div className="text-[#0d3352]">
            <h2 className="font-rl-aqva-black text-[clamp(1.75rem,3.2vw,3.6rem)] font-extrabold leading-[1.08]">
              {question.title}
            </h2>

            <div
              className={`w-full font-test-sohne font-medium leading-[1.3] text-[#0d3352] ${
                question.id === 'q3'
                  ? 'mt-3 md:mt-4 lg:mt-6 text-[15px] sm:text-[17px] md:text-[18px] xl:text-[20px]'
                  : 'mt-3 md:mt-5 lg:mt-7 text-[16px] sm:text-[18px] md:text-[19px] xl:text-[22px]'
              }`}
            >
              <p>{question.scenario}</p>
              <p
                className={`${
                  question.id === 'q3' ? 'mt-2.5 md:mt-3' : 'mt-3 md:mt-4 xl:mt-6'
                } font-bold md:min-h-[2.6rem] xl:h-27`}
              >
                {question.question}
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 md:mt-5 xl:mt-7 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-3.5 lg:gap-4 w-full max-w-190">
              {question.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrectOption = question.correctIndex === index;
                const revealCorrect = isSelected && isCorrectOption;
                const isWrongSelected = isSelected && !isCorrectOption;
                const cardBorderClass = revealCorrect
                  ? 'border-x-[3.2px] border-t-[3.2px] border-b-[6.4px] border-[#6FFF00]'
                  : isWrongSelected
                    ? 'border-x-[3.2px] border-t-[3.2px] border-b-[6.4px] border-[#FF0000]'
                    : 'border-x-[3.2px] border-t-[3.2px] border-b-[6.4px] border-[#0d3352] hover:-translate-y-0.5';

                return (
                  <button
                    key={option.text}
                    type="button"
                    onClick={() => onSelectOption(index)}
                    aria-pressed={isSelected}
                    className={`relative flex h-64 sm:h-72 md:h-72 lg:h-76 xl:h-80 w-full cursor-pointer flex-col overflow-hidden rounded-lg border-solid bg-[#0d3352] text-center text-[15px] md:text-[16px] xl:text-[18px] font-bold text-[#efefef] transition ${cardBorderClass}`}
                  >
                    <div
                      className="relative h-full w-full transform-3d transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                      style={{
                        transform: isSelected ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      <div
                        className="absolute inset-0 flex flex-col"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(0deg)'
                        }}
                      >
                        {option.image ? (
                          <div className="relative mt-3 md:mt-4 flex h-[48%] md:h-[50%] xl:h-[55%] w-full items-center justify-center">
                            <Image
                              src={`${BASE_PATH}${option.image}`}
                              alt={option.text}
                              width={option.width}
                              height={option.height}
                              className="max-h-full max-w-[85%] object-contain"
                            />
                          </div>
                        ) : null}

                        <div className="flex flex-1 items-center justify-center px-2.5 md:px-3 py-2 md:py-3">
                          <p className="line-clamp-3 sm:line-clamp-4 leading-[1.2] text-[13px] sm:text-[14px] md:text-[15px] xl:text-[18px]">
                            {option.text}
                          </p>
                        </div>
                      </div>

                      <div
                        className="absolute inset-0 flex flex-col"
                        style={{
                          backfaceVisibility: 'hidden',
                          WebkitBackfaceVisibility: 'hidden',
                          transform: 'rotateY(180deg)'
                        }}
                      >
                        {option.image ? (
                          <div className="relative mt-3 md:mt-4 flex h-[48%] md:h-[50%] xl:h-[55%] w-full items-center justify-center">
                            <Image
                              src={`${BASE_PATH}${option.image}`}
                              alt={option.text}
                              width={option.width}
                              height={option.height}
                              className={`max-h-full max-w-[85%] object-contain transition ${
                                isWrongSelected ? 'grayscale opacity-60' : ''
                              }`}
                            />
                          </div>
                        ) : null}

                        <div className="flex flex-1 items-center justify-center px-2.5 md:px-3 py-2 md:py-3">
                          <p className="line-clamp-6 sm:line-clamp-6 md:line-clamp-7 leading-[1.2] text-[11.5px] sm:text-[12px] md:text-[13px] lg:text-[14px] xl:text-[16px]">
                            {option.explanation}
                          </p>
                        </div>

                        {revealCorrect && (
                          <span className="absolute right-3 top-3 text-xl md:text-2xl">
                            <IoCheckmarkCircle className="text-[#6FFF00]" />
                          </span>
                        )}
                        {isWrongSelected && (
                          <span className="absolute right-3 top-3 flex items-center justify-center text-xl md:text-2xl">
                            <span className="absolute h-[0.6em] w-[0.6em] rounded-full bg-white" />
                            <IoCloseCircle className="relative z-10 text-[#FF0000]" />
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className={`mt-4 sm:mt-5 md:mt-6 xl:mt-8 flex flex-row items-center ${
              questionIndex > 0 ? 'justify-between' : 'justify-end'
            } w-full max-w-190`}
          >
            {questionIndex > 0 && (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex cursor-pointer h-10 md:h-11 w-28 md:w-29.25 items-center justify-center gap-1.5 rounded-sm border border-[#0d3352] bg-transparent px-4 md:px-6 text-[15px] md:text-[16px] font-semibold text-[#0d3352] transition hover:bg-[#0d3352]/5"
              >
                <FiArrowLeft aria-hidden className="h-5 w-5" />
                <span>Back</span>
              </button>
            )}
            <button
              type="button"
              onClick={onNext}
              disabled={!isCorrect}
              className={`inline-flex ${
                isCorrect ? 'cursor-pointer' : 'cursor-not-allowed'
              } h-10 md:h-11 w-28 md:w-[117px] items-center justify-center gap-1.5 rounded-[4px] bg-[#0d3352] px-4 md:px-6 text-[15px] md:text-[16px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <span>Next</span>
              <FiArrowRight aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          className="pointer-events-none hidden md:block absolute right-2 md:right-4 lg:right-8 xl:right-14 top-12 sm:top-14 md:top-14 lg:top-20 xl:top-32 w-64 md:w-72 lg:w-85 xl:w-95 h-96 md:h-100 lg:h-115 xl:h-125"
          aria-hidden
        >
          <div
            className={`absolute ${
              firstMedia?.position === 'front' ? 'z-10' : 'z-0'
            } overflow-hidden rounded-[15px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] right-2 md:right-4 xl:right-10 top-0 w-[170px] h-[220px] md:w-[190px] md:h-[250px] lg:w-[230px] lg:h-[300px] xl:w-[280px] xl:h-[360px]`}
            style={{
              transform: `rotate(${firstMedia?.transform ?? '0deg'})`
            }}
          >
            {firstMedia ? (
              <Image
                src={firstMedia.image}
                alt="Question visual"
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 280px, (min-width: 1024px) 230px, (min-width: 768px) 190px, 170px"
              />
            ) : (
              <div className="h-full w-full bg-[#d9d9d9]" />
            )}
          </div>

          <div
            className={`absolute ${
              secondMedia?.position === 'front' ? 'z-10' : 'z-0'
            } overflow-hidden rounded-[15px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] left-2 md:left-4 lg:left-12 xl:left-24 top-36 md:top-40 lg:top-52 xl:top-64 w-[180px] h-[170px] md:w-[200px] md:h-[190px] lg:w-[250px] lg:h-[240px] xl:w-[320px] xl:h-[300px]`}
            style={{
              transform: `rotate(${secondMedia?.transform ?? '0deg'})`
            }}
          >
            {secondMedia ? (
              <Image
                src={secondMedia.image}
                alt="Question visual"
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 320px, (min-width: 1024px) 250px, (min-width: 768px) 200px, 180px"
              />
            ) : (
              <div className="h-full w-full bg-[#807f7f]" />
            )}
          </div>
        </div>

        <p className="mt-4 md:mt-0 md:absolute md:bottom-4 lg:bottom-6 left-4 sm:left-6 md:left-8 lg:left-12 xl:left-16 text-[11px] md:text-[12px] leading-[1.3] text-[#0d3352]/70 font-test-sohne">
          {question.imageSource}
        </p>
      </div>

      <QuestVisibilityControl onClick={onMinimize} />
    </section>
  );
}
