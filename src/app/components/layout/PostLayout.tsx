import { Header } from '@/components';
import type { Post } from 'contentlayer/generated';
import type { ReactNode } from 'react';
import Image from 'next/image';

type Props = {
  children: ReactNode;
  post: Post;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

export const PostLayout = ({ children, post }: Props) => {
  const published = formatDate(post.date);
  const updated = post.updatedAt ? formatDate(post.updatedAt) : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10 space-y-5">
        {post.cover && (
          <div className="overflow-hidden rounded-2xl border bg-muted">
            <Image
              src={post.cover}
              alt={post.coverAlt ?? post.title}
              className="h-64 w-full object-cover sm:h-80"
              loading="lazy"
            />
          </div>
        )}

        <div className="space-y-3">
          <Header>{post.title}</Header>

          <p className="text-lg text-muted-foreground">{post.description}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <time dateTime={post.date}>{published}</time>
            <span aria-hidden="true">•</span>
            <span>{post.readingTime} min read</span>
            <span aria-hidden="true">•</span>
            <span>{post.wordCount.toLocaleString()} words</span>
            {updated && (
              <>
                <span aria-hidden="true">•</span>
                <span>Updated {updated}</span>
              </>
            )}
          </div>

          {!!post.tags?.length && (
            <ul className="flex flex-wrap gap-2 pt-1">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <span className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs text-foreground">
                    {tag}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </header>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        {children}
      </div>
    </article>
  );
};
