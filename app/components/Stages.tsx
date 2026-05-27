import { Question } from '../types/quiz';
import { OpeningStage } from './OpeningStage';
import { IntroStage } from './IntroStage';
import { QuestionsStage } from './QuestionsStage';
import { FinishStage } from './FinishStage';

type StagesProps = {
  stage: string;
  question: Question;
  questionIndex: number;
  selectedOption: number | null;
  showCorrectAnswer: boolean;
  isCorrect: boolean;
  onAnswer: (optionIndex: number) => void;
  onNextQuestion: () => void;
  warningProgress: number;
  showAgent: boolean;
  showStartMission: boolean;
  onStartMission: () => void;
  onPlay: () => void;
  onFinish: () => void;
  onMinimize: () => void;
  totalQuestions: number;
};

export function Stages({
  stage,
  question,
  questionIndex,
  selectedOption,
  showCorrectAnswer,
  isCorrect,
  onAnswer,
  onNextQuestion,
  warningProgress,
  showAgent,
  showStartMission,
  onStartMission,
  onPlay,
  onFinish,
  onMinimize,
  totalQuestions
}: StagesProps) {
  if (stage === 'map') {
    return null;
  }

  return (
    <section className="absolute inset-0 z-20 h-full w-full overflow-hidden">
      {stage === 'opening' && <OpeningStage onPlay={onPlay} onMinimize={onMinimize} />}

      {stage === 'intro' && (
        <IntroStage
          warningProgress={warningProgress}
          showAgent={showAgent}
          showStartMission={showStartMission}
          onStartMission={onStartMission}
          onMinimize={onMinimize}
        />
      )}

      {stage === 'questions' && (
        <QuestionsStage
          question={question}
          questionIndex={questionIndex}
          totalQuestions={totalQuestions}
          selectedOption={selectedOption}
          showCorrectAnswer={showCorrectAnswer}
          isCorrect={isCorrect}
          onSelectOption={onAnswer}
          onNext={onNextQuestion}
          onMinimize={onMinimize}
        />
      )}

      {stage === 'finish' && <FinishStage onFinish={onFinish} />}
    </section>
  );
}
