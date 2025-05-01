'use client';

import { Quiz } from '@/components/quiz/Quiz';
import SplashScreen from '@/components/splash-screen'; // Corrected import name casing
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use a shorter timeout for splash screen demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate loading for 1.5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SplashScreen isVisible={isLoading} />
      {/* Render main content only after loading is complete */}
      {!isLoading && (
        <main className="flex flex-1 flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24 mt-10 mb-10"> {/* Added mt/mb for spacing, flex-1 ensures it takes space */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-foreground text-center"> {/* Heading outside the card, centered */}
            QuizMaster
          </h1>
          <Quiz />
        </main>
      )}
    </>
  );
}
