'use client';

import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Badge, Header, Prose } from '@/components';

interface ProjectLayoutProps {
  children: React.ReactNode;
  project: {
    title: string;
    summary?: string;
    image?: string;
    imageAlt?: string;
    date?: string;
    updatedAt?: string;
    tech?: string[];
    tags?: string[];
    url?: string;
    repo?: string;
  };
}

export function ProjectLayout({ children, project }: ProjectLayoutProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-10 text-center">
        {project.date && (
          <time
            dateTime={project.date}
            className="block text-xs text-muted-foreground"
          >
            {format(parseISO(project.date), 'LLLL d, yyyy')}
          </time>
        )}

        <Header level="h1">{project.title}</Header>

        {project.updatedAt && (
          <p className="mt-1 text-xs text-muted-foreground">
            Last updated: {format(parseISO(project.updatedAt), 'MMMM d, yyyy')}
          </p>
        )}

        {project.summary && (
          <p className="mt-2 text-sm text-muted-foreground">
            {project.summary}
          </p>
        )}

        {project.image && (
          <Image
            src={project.image}
            alt={project.imageAlt ?? project.title}
            width={800}
            height={400}
            className="mx-auto mt-6 rounded-lg border"
          />
        )}

        {project.tech && project.tech?.length > 0 && (
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {project.tech.map((t) => (
              <li key={t}>
                <Badge>{t}</Badge>
              </li>
            ))}
          </ul>
        )}

        {project.tags && project.tags?.length > 0 && (
          <ul className="mt-2 flex flex-wrap justify-center gap-2 text-xs">
            {project.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="outline">{tag}</Badge>
              </li>
            ))}
          </ul>
        )}

        {(project.url || project.repo) && (
          <div className="mt-4 flex justify-center gap-6 text-sm">
            {project.url && (
              <Link href={project.url} className="text-primary hover:underline">
                Live Demo
              </Link>
            )}
            {project.repo && (
              <Link
                href={project.repo}
                className="text-primary hover:underline"
              >
                Source Code
              </Link>
            )}
          </div>
        )}
      </div>

      <Prose>{children}</Prose>
    </article>
  );
}
