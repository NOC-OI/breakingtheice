import Image from 'next/image';
import type { Question } from '../types/quiz';
import { QuestVisibilityControl } from './QuestVisibilityControl';

type QuestionsStageProps = {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedOption: number | null;
  showCorrectAnswer: boolean;
  isCorrect: boolean;
  onSelectOption: (index: number) => void;
  onNext: () => void;
  onMinimize: () => void;
};

export function QuestionsStage({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  showCorrectAnswer,
  isCorrect,
  onSelectOption,
  onNext,
  onMinimize
}: QuestionsStageProps) {
  return (
    <section
      className="relative z-20 h-full w-full overflow-auto"
      style={{ backgroundColor: question.bg }}
    >
      <div className="mx-auto flex min-h-full w-[min(1400px,96vw)] flex-col px-4 pb-8 pt-8 sm:px-8 sm:pt-14">
        <h2 className="font-[Baloo_2] text-4xl font-extrabold text-[#0d3352] sm:text-6xl">
          {question.title}
        </h2>

        <div className="mt-4 max-w-4xl text-[#0d3352]">
          <p className="text-xl font-extrabold sm:text-3xl">{question.scenario}</p>
          <p className="mt-4 text-lg font-extrabold sm:text-3xl">{question.question}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrectOption = question.correctIndex === index;
            const revealCorrect = showCorrectAnswer && isCorrectOption;
            const isWrongSelected = showCorrectAnswer && isSelected && !isCorrectOption;

            return (
              <button
                key={option}
                type="button"
                onClick={() => onSelectOption(index)}
                className={`relative h-56 rounded-xl border-4 px-5 py-6 text-left text-xl font-bold text-[#efefef] shadow-lg transition sm:h-72 ${
                  revealCorrect
                    ? 'border-[#29c164] bg-[linear-gradient(160deg,#0d3352,#15654a)]'
                    : isWrongSelected
                      ? 'border-[#ff3e3e] bg-[linear-gradient(160deg,#0d3352,#4a1212)]'
                      : 'border-[#0d3352] bg-[#0d3352] hover:-translate-y-0.5'
                }`}
              >
                <span className="line-clamp-4">{option}</span>
                {revealCorrect && <span className="absolute right-3 top-3 text-2xl">✓</span>}
                {isWrongSelected && <span className="absolute right-3 top-3 text-2xl">✕</span>}
              </button>
            );
          })}
        </div>

        {showCorrectAnswer && !isCorrect && (
          <p className="mt-3 text-lg font-extrabold text-[#360c15] sm:text-xl">
            That answer is not correct. The correct option has been highlighted.
          </p>
        )}

        {question.media && question.media.length > 0 && (
          <div className="mt-6 grid gap-4 sm:mt-7 sm:grid-cols-2 sm:gap-8">
            {question.media.map(src => (
              <Image
                key={src}
                src={src}
                alt="Question visual"
                width={1200}
                height={720}
                className="h-48 w-full rounded-2xl object-cover shadow-xl sm:h-72"
              />
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between sm:mt-8">
          <p className="text-base font-extrabold text-[#0d3352] sm:text-xl">
            Question {questionIndex + 1} of {totalQuestions}
          </p>
          <button
            type="button"
            onClick={onNext}
            disabled={!isCorrect}
            className="rounded-md bg-[#0d3352] px-7 py-3 text-lg font-extrabold text-white shadow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>

      <QuestVisibilityControl onClick={onMinimize} />
    </section>
  );
}
