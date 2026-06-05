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
  isCorrect: boolean;
  onAnswer: (optionIndex: number) => void;
  onNextQuestion: () => void;
  onBack: () => void;
  warningProgress: number;
  showStartMission: boolean;
  onStartMission: () => void;
  onPlay: () => void;
  onFinish: () => void;
  onMinimize: () => void;
};

export function Stages({
  stage,
  question,
  questionIndex,
  selectedOption,
  isCorrect,
  onAnswer,
  onNextQuestion,
  onBack,
  warningProgress,
  showStartMission,
  onStartMission,
  onPlay,
  onFinish,
  onMinimize
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
          showStartMission={showStartMission}
          onStartMission={onStartMission}
          onMinimize={onMinimize}
        />
      )}

      {stage === 'questions' && (
        <QuestionsStage
          question={question}
          questionIndex={questionIndex}
          selectedOption={selectedOption}
          isCorrect={isCorrect}
          onSelectOption={onAnswer}
          onNext={onNextQuestion}
          onBack={onBack}
          onMinimize={onMinimize}
        />
      )}

      {stage === 'finish' && <FinishStage onFinish={onFinish} />}
    </section>
  );
}
