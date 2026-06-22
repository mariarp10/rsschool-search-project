import { type ReactNode } from 'react';
import type { Metadata } from 'next';
import { QueryProvider } from '../providers/query-provider';

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
          <QueryProvider>{children}</QueryProvider>
        </div>
      </body>
    </html>
  );
}
