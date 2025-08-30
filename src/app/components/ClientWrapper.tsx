'use client';

import { ThemeProvider } from '@/components';
import { useEffect, useState } from 'react';
import { Footer, Header } from '@/app/components';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Header />
      <main className="flex-1">{isMounted && children}</main>
      <Footer />
    </ThemeProvider>
  );
}
