import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-google',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Google Review Flow - Authentic Customer Review Collection',
  description: 'Help genuine customers leave authentic Google reviews effortlessly with wording polish and quick routing.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full`}>
      <body className="min-h-screen bg-[#f8fafd] text-[#1f1f1f] flex flex-col font-sans selection:bg-[#c2e7ff]">
        {children}
      </body>
    </html>
  );
}
