export type Stage = 'map' | 'opening' | 'intro' | 'questions' | 'finish';

export type Question = {
  id: string;
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  bg: string;
  media?: string[];
};
