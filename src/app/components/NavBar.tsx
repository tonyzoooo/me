"use client";

import Link from "next/link";

export const NavBar = () => {
  return (
    <header className="w-full border-b">
      <nav className="mx-auto max-w-4xl px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-lg font-semibold">
          tonyzoooo
        </Link>
        <ul className="flex gap-6 text-sm">
          <li>
            <Link href="/projects" className="hover:underline">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
          </li>
          <li>
            <Link href="/cv" className="hover:underline">
              CV
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};
