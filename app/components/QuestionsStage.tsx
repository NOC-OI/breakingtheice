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
      <div className="relative mx-1 h-full w-[76vw] px-4 pb-8 pt-14 xl:pt-35 xl:mx-auto xl:w-96vw sm:px-8 lg:px-18">
        <div className="max-w-220 text-[#0d3352]">
          <h2 className="font-rl-aqva-black text-[clamp(2.1rem,4vw,4rem)] font-extrabold leading-[1.05]">
            {question.title}
          </h2>

          <div
            className={`xl:mt-10.75 w-[80%] xl:w-full font-test-sohne font-medium ${question.id === 'q3' ? 'mt-8.5 text-[20px]' : 'mt-[44.11px] text-[22px]'}  xl:text-[22px] leading-[1.3]`}
          >
            <p>{question.scenario}</p>
            <p className={`${question.id === 'q3' ? 'mt-4' : 'mt-7'} font-bold xl:h-27`}>
              {question.question}
            </p>
          </div>
        </div>

        <div
          className={`flex flex-col gap-6 ${question.id === 'q3' ? 'mt-6' : 'mt-8'} xl:mt-0 w-[85%] xl:w-full lg:flex-row lg:items-end lg:gap-8`}
        >
          <div className="lg:grid lg:w-full lg:max-w-190 lg:gap-4 sm:grid-cols-3">
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
                  className={`relative flex h-80 w-full cursor-pointer flex-col overflow-hidden rounded-lg border-solid bg-[#0d3352] text-center text-[18px] font-bold text-[#efefef] transition ${cardBorderClass}`}
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
                        <div className="relative mt-5 flex h-[55%] w-full items-center justify-center">
                          <Image
                            src={`${BASE_PATH}${option.image}`}
                            alt={option.text}
                            width={option.width}
                            height={option.height}
                            className="object-contain"
                          />
                        </div>
                      ) : null}

                      <div className="flex flex-1 items-center justify-center px-3 py-4">
                        <p className="line-clamp-4 leading-[1.2] text-[18px]">{option.text}</p>
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
                        <div className="relative mt-5 flex h-[55%] w-full items-center justify-center">
                          <Image
                            src={`${BASE_PATH}${option.image}`}
                            alt={option.text}
                            width={option.width}
                            height={option.height}
                            className={`object-contain transition ${
                              isWrongSelected ? 'grayscale opacity-60' : ''
                            }`}
                          />
                        </div>
                      ) : null}

                      <div className="flex flex-1 items-center justify-center px-3 py-4">
                        <p className="line-clamp-7 leading-[1.2] text-[16px]">
                          {option.explanation}
                        </p>
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
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div
          className={`mt-5 flex flex-row gap-104 xl:gap-135 ${questionIndex === 0 && 'ml-120'} w-full md:w-40 xl:mt-8`}
        >
          {questionIndex > 0 && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex cursor-pointer h-11 w-29.25 items-center justify-center gap-2 rounded-sm border border-[#0d3352] bg-transparent px-6 text-[16px] font-semibold text-[#0d3352] transition hover:bg-[#0d3352]/5"
            >
              <FiArrowLeft aria-hidden className="h-5 w-5" />
              <span>Back</span>
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={!isCorrect}
            className={`inline-flex ${isCorrect ? 'cursor-pointer' : 'cursor-not-allowed'} w-[117px] h-11 items-center justify-center gap-2 ${questionIndex === 0 && 'xl:ml-42'} rounded-[4px] bg-[#0d3352] px-6 text-[16px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 w-full`}
          >
            <span>Next</span>
            <FiArrowRight aria-hidden className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`pointer-events-none mt-8 hidden h-125 w-95 top-14 xl:top-35 left-[80%] md:absolute md:mt-0 md:block xl:left-[68.5%]`}
          aria-hidden
        >
          <div
            className={`absolute ${firstMedia?.position === 'front' ? 'z-10' : 'z-0'} overflow-hidden rounded-[15px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] right-8 xl:right-15 top-0`}
            style={{
              width: firstMedia?.width ? `${firstMedia.width * 4}px` : '280px',
              height: firstMedia?.height ? `${firstMedia.height * 4}px` : '360px',
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
            className={`absolute ${secondMedia?.position === 'front' ? 'z-10' : 'z-0'} overflow-hidden rounded-[15px] shadow-[0_4px_4px_rgba(0,0,0,0.25)] left-35 xl:lef-40 top-60 xl:top-70`}
            style={{
              width: secondMedia?.width ? `${secondMedia.width * 4}px` : '320px',
              height: secondMedia?.height ? `${secondMedia.height * 4}px` : '300px',
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

        <p className="absolute bottom-6 left-4 text-[12px] leading-[1.3] text-[#0d3352]/70 sm:left-8 lg:left-18 font-test-sohne">
          {question.imageSource}
        </p>
      </div>

      <QuestVisibilityControl onClick={onMinimize} />
    </section>
  );
}
