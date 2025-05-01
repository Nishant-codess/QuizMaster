import React from 'react';
import { cn } from '@/lib/utils'; // Import cn for conditional classes
import { Loader2 } from 'lucide-react'; // Use Lucide loader icon

interface SplashScreenProps {
  isVisible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
  // Use framer-motion or simple CSS transitions for fade-in/out if desired
  // For simplicity, we'll just conditionally render based on isVisible

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center overflow-hidden",
        "bg-background text-foreground" // Use theme variables
      )}
      role="status" // Add role for accessibility
      aria-live="polite" // Announce changes politely
    >
      {/* Subtle Background Pattern (Optional) */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
         backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 0), radial-gradient(circle at 75% 75%, hsl(var(--accent)) 1px, transparent 0)`
      }}></div>

      <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
        {/* Techy Loading Animation */}
        <Loader2 className="h-12 w-12 animate-spin text-primary" /> {/* Use Lucide Loader and theme primary color */}
        <p className="text-lg font-mono tracking-widest uppercase text-muted-foreground"> {/* Use font-mono and muted text color */}
          Initializing Quiz...
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
