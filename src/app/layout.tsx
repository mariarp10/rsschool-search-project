import { type ReactNode } from 'react';
import type { Metadata } from 'next';
import { QueryProvider } from '../providers/query-provider';
import { ThemeProvider } from '@components/theme-provider/theme-provider';
import { Header } from '@ui/header/header';
import { Footer } from '@ui/footer/footer';
import '../index.css';

export const metadata: Metadata = {
  title: 'Rick and Morty Search',
  description: 'Look up characters from Rick and Morty show',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          <QueryProvider>
            <ThemeProvider>
              <Header />
              {children}
              <Footer />
            </ThemeProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  );
}
