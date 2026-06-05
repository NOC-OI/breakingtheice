export type Stage = 'map' | 'opening' | 'intro' | 'questions' | 'finish';

export type Question = {
  id: string;
  title: string;
  scenario: string;
  question: string;
  options: { image?: string; text: string; explanation: string }[];
  correctIndex: number;
  bg: string;
  media?: { image: string; position: string; transform: string, width?: string, height?: string }[];
};
