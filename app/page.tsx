'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapPage } from './components/MapPage';
import questionsData from './data/questions.json';
import type { Question, Stage } from './types/quiz';
import { Stages } from './components/Stages';

const QUESTIONS = questionsData as Question[];

export default function Home() {
  const [stage, setStage] = useState<Stage>('map');
  const [timelineVisible, setTimelineVisible] = useState(true);
  const [hasQuestStarted, setHasQuestStarted] = useState(false);
  const [resumeStage, setResumeStage] = useState<Exclude<Stage, 'map'>>('opening');

  const [yearIndex, setYearIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [warningProgress, setWarningProgress] = useState(100);
  const [showStartMission, setShowStartMission] = useState(false);

  const question = useMemo(() => QUESTIONS[questionIndex], [questionIndex]);
  const isCorrect = selectedOption === question.correctIndex;

  useEffect(() => {
    if (stage !== 'intro') {
      return;
    }

    if (showStartMission) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setWarningProgress(current => {
        if (current <= 0) {
          window.clearInterval(intervalId);
          return current;
        }

        const next = current - 2.2;
        if (next <= 0) {
          window.clearInterval(intervalId);
          window.setTimeout(() => setShowStartMission(true), 1000);
          return 0;
        }
        return next;
      });
    }, 90);

    return () => window.clearInterval(intervalId);
  }, [showStartMission, stage]);

  function moveToMap() {
    if (stage !== 'map') {
      setResumeStage(stage);
    }
    setStage('map');
  }

  function handleStartOrResume() {
    if (!hasQuestStarted) {
      setHasQuestStarted(true);
      setResumeStage('opening');
      setStage('opening');
      return;
    }

    setStage(resumeStage);
  }

  function onPlay() {
    setWarningProgress(100);
    setShowStartMission(false);
    setResumeStage('intro');
    setStage('intro');
  }

  function onStartMission() {
    setSelectedOption(null);
    setQuestionIndex(0);
    setResumeStage('questions');
    setStage('questions');
  }

  function onAnswer(optionIndex: number) {
    setSelectedOption(selectedOption === optionIndex ? null : optionIndex);
  }

  function onNextQuestion() {
    if (!isCorrect) {
      return;
    }

    if (questionIndex < QUESTIONS.length - 1) {
      setSelectedOption(null);
      setQuestionIndex(value => value + 1);
      return;
    }

    setResumeStage('finish');
    setStage('finish');
  }

  function onBack() {
    if (questionIndex > 0) {
      const prevIndex = questionIndex - 1;
      setQuestionIndex(prevIndex);
      setSelectedOption(QUESTIONS[prevIndex].correctIndex);
    } else {
      setShowStartMission(true);
      setWarningProgress(0);
      setResumeStage('intro');
      setStage('intro');
    }
  }

  function onFinish() {
    setStage('map');
    setHasQuestStarted(false);
    setResumeStage('opening');
    setQuestionIndex(0);
    setSelectedOption(null);
  }

  return (
    <main className="relative h-screen w-full overflow-hidden text-[#0d3352]">
      <MapPage
        hasQuestStarted={hasQuestStarted}
        yearIndex={yearIndex}
        timelineVisible={timelineVisible}
        onToggleTimeline={() => setTimelineVisible(value => !value)}
        onChangeYear={setYearIndex}
        onStartOrResume={handleStartOrResume}
      />
      <Stages
        stage={stage}
        question={question}
        questionIndex={questionIndex}
        selectedOption={selectedOption}
        isCorrect={isCorrect}
        onAnswer={onAnswer}
        onNextQuestion={onNextQuestion}
        onBack={onBack}
        warningProgress={warningProgress}
        showStartMission={showStartMission}
        onStartMission={onStartMission}
        onPlay={onPlay}
        onFinish={onFinish}
        onMinimize={moveToMap}
      />
    </main>
  );
}
