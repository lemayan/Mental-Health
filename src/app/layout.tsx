import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Baltimore Mental Health Navigator',
    template: '%s | Baltimore Mental Health Navigator',
  },
  description:
    'Find the right mental health support in Baltimore. Connect with therapists, psychiatrists, community programs, and crisis resources that match your needs.',
  keywords: [
    'mental health',
    'Baltimore',
    'therapy',
    'counseling',
    'psychiatry',
    'therapist',
    'mental health resources',
    'Maryland',
    'crisis support',
    'community mental health',
  ],
  authors: [{ name: 'Baltimore Mental Health Navigator' }],
  creator: 'Baltimore Mental Health Navigator',
  publisher: 'Baltimore Mental Health Navigator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Baltimore Mental Health Navigator',
    description:
      'Find the right mental health support in Baltimore. Connect with therapists, psychiatrists, community programs, and crisis resources.',
    siteName: 'Baltimore Mental Health Navigator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Baltimore Mental Health Navigator',
    description:
      'Find the right mental health support in Baltimore. Connect with therapists, psychiatrists, community programs, and crisis resources.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#4A90A4',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-neutral-50 font-sans antialiased">
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        {/* Crisis banner could be conditionally rendered here */}
        
        {children}
      </body>
    </html>
  );
}
