'use client';

import { ThemeToggle } from '@/components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/cv', label: 'CV' },
  { href: '/contact', label: 'Contact' },
];

export const NavBar = () => {
  const pathname = usePathname();

  return (
    <header className="w-full border-b bg-background">
      <nav className="mx-auto max-w-4xl px-4 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-lg font-semibold hover:opacity-80 transition"
        >
          Home
        </Link>
        <div className="flex items-center gap-6">
          <ul className="flex gap-6 text-sm items-center">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'hover:underline transition',
                    pathname === href
                      ? 'font-semibold underline'
                      : 'text-muted-foreground',
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};
