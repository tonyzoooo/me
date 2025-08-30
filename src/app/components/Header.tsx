'use client';

import Link from 'next/link';
import { NavigationBar } from './NavigationBar';
import { ThemeToggle } from '@/components';
import { HomeIcon } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full border-b border-border px-4 py-2">
      <div className="mx-auto flex max-w-prose items-center justify-between">
        <Link href="/">
          <HomeIcon />
        </Link>
        <NavigationBar />
        <ThemeToggle />
      </div>
    </header>
  );
}
