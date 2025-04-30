import { Quiz } from '@/components/quiz/Quiz';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <h1 className="text-4xl font-bold mb-8 text-foreground"> {/* Heading outside the card */}
        QuizMaster
      </h1>
      <Quiz />
    </main>
  );
}
