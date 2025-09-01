import Link from 'next/link';
import { Button } from '@/components';

export const Footer = () => {
  return (
    <footer className="w-full border-t mt-10">
      <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()}{' '}
          <Link
            href="/contact"
            className="hover:underline text-muted-foreground"
          >
            Tony Zhou
          </Link>
        </p>
        <Button
          asChild
          variant="link"
          className="text-muted-foreground p-0 h-auto"
        >
          <a
            href="https://github.com/tonyzoooo/me"
            target="_blank"
            rel="noopener noreferrer"
          >
            View source on GitHub
          </a>
        </Button>
      </div>
    </footer>
  );
};
