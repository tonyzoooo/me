import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export function PageLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn('max-w-2xl mx-auto px-4 py-10 space-y-10', className)}>
      {children}
    </main>
  );
}
