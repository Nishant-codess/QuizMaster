import type { Metadata } from 'next';
// Correctly import Geist font styles from the 'geist' package
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import Link from 'next/link'; // Import Link for navigation
import { Github, Linkedin } from 'lucide-react'; // Import icons
import { cn } from '@/lib/utils'; // Import cn utility
import { Toaster } from "@/components/ui/toaster"; // Import Toaster for notifications

// Instantiate the fonts (no need for variable options for Geist package)
// The CSS variables are automatically handled by the geist package imports

export const metadata: Metadata = {
  title: 'QuizMaster', // Updated title
  description: 'Interactive Quiz Application', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}> {/* Add font variables to html tag */}
      {/* Removed extra whitespace here */}
      <body
        className={cn(
          'antialiased flex flex-col min-h-screen font-sans' // Use font-sans which is mapped to --font-geist-sans
        )}
      >
        <main className="flex-grow">{children}</main>
        <footer className="py-4 px-4 text-center bg-card text-card-foreground border-t border-border mt-auto"> {/* Use theme variables, ensure footer sticks to bottom */}
          <p className="text-sm text-muted-foreground"> {/* Use muted-foreground for less emphasis */}
            Made with Love by Nishant Ranjan
          </p>
          <div className="flex justify-center items-center space-x-4 mt-2">
            <Link
              href="https://github.com/nishantranjan" // Replace with actual GitHub profile URL
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors" // Use muted-foreground, hover to theme primary
              aria-label="Nishant Ranjan's GitHub Profile"
            >
              <Github size={18} /> {/* Slightly smaller icon */}
            </Link>
            <Link
              href="https://linkedin.com/in/nishantranjan" // Replace with actual LinkedIn profile URL
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors" // Use muted-foreground, hover to theme primary
              aria-label="Nishant Ranjan's LinkedIn Profile"
            >
              <Linkedin size={18} /> {/* Slightly smaller icon */}
            </Link>
          </div>
        </footer>
        <Toaster /> {/* Add Toaster component here for sitewide toasts */}
      </body>
    </html>
  );
}
