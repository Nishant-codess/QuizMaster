export type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export const quizData: Question[] = [
  {
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
    correctAnswer: 'Mars',
  },
  {
    question: 'What is the largest ocean on Earth?',
    options: [
      'Atlantic Ocean',
      'Indian Ocean',
      'Arctic Ocean',
      'Pacific Ocean',
    ],
    correctAnswer: 'Pacific Ocean',
  },
  {
    question: 'What is the chemical symbol for water?',
    options: ['O2', 'H2O', 'CO2', 'NaCl'],
    correctAnswer: 'H2O',
  },
  {
    question: 'Who wrote "Hamlet"?',
    options: [
      'Charles Dickens',
      'William Shakespeare',
      'Leo Tolstoy',
      'Mark Twain',
    ],
    correctAnswer: 'William Shakespeare',
  },
];
