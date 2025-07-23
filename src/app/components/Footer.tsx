export const Footer = () => {
  return (
    <footer className="w-full border-t mt-10">
      <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-muted-foreground flex justify-between items-center">
        <p>&copy; {new Date().getFullYear()} Tony Zhou</p>
        <a
          href="https://github.com/tonyzoooo"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};
