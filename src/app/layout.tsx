import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@/styles/tokens.css';
import '@/styles/base.css';
import { sans, mono } from './fonts';
import { site } from '@/config/site';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Cursor } from '@/components/Cursor';
import { Rail } from '@/components/Rail';
import { Effects } from '@/components/Effects';

const title = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  title,
  description: site.description,
  icons: { icon: '/favicon.svg' },
  openGraph: {
    type: 'website',
    title,
    description: site.description,
    siteName: site.name,
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Enhancement gate: CSS hides reveal targets only when JS is running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js='';" }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Rail />
        <Cursor />
        <Effects />
      </body>
    </html>
  );
}
