import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link'; // Import Link for navigation
import { Github, Linkedin } from 'lucide-react'; // Import icons

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <main className="flex-grow">{children}</main>
        <footer className="py-6 px-4 text-center bg-black text-white border-t border-border"> {/* Updated footer style */}
          <p className="text-sm"> {/* Removed muted-foreground */}
            Made with Love by Nishant Ranjan
          </p>
          <div className="flex justify-center items-center space-x-4 mt-2">
            <Link
              href="https://github.com/Nishant-codess/" // Replace with actual GitHub profile URL
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors" // Use white, hover to theme primary
              aria-label="Nishant Ranjan's GitHub Profile"
            >
              <Github size={20} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/nishant-ranjan-207844360/" // Replace with actual LinkedIn profile URL
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary transition-colors" // Use white, hover to theme primary
              aria-label="Nishant Ranjan's LinkedIn Profile"
            >
              <Linkedin size={20} />
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
