'use client';

import { ThemeProvider } from '@/components';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NavBar } from '@/app/components';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NavBar />
      <AnimatePresence mode="wait">
        {isMounted && (
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1"
          >
            {children}
          </motion.main>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
}
