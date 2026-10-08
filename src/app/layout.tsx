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
  title: 'ReviewPulse - Authentic 5-Star Google Reviews on Autopilot',
  description: 'Help genuine customers leave authentic Google reviews effortlessly with AI wording polish and quick WhatsApp routing.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
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
