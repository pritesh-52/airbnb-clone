import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

/**
 * Airbnb ships Circular, which is not licensed for redistribution. Inter is the
 * closest widely-available geometric sans and is loaded with `display: swap`
 * plus an adjusted fallback so the layout does not shift while it downloads.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'],
});

export const metadata: Metadata = {
  title: 'Cliffside villa with infinity pool and ocean views · Airbnb clone',
  description:
    'A four-bedroom cliffside villa in Uluwatu, Bali, with an infinity pool and ocean views. Airbnb listing page clone.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Cliffside villa with infinity pool and ocean views',
    description: 'A four-bedroom cliffside villa in Uluwatu, Bali.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {/* First tab stop: lets keyboard users bypass the header and nav. */}
        <a
          href="#main"
          className="sr-only rounded-lg bg-ink px-4 py-2 text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
        >
          Skip to content
        </a>

        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
