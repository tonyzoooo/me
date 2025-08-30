'use client';

import { allProjects } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer2/hooks';
import Link from 'next/link';

export default function ProjectsPage() {
  const projectsWithMDX = allProjects.map((project) => ({
    ...project,
    MDXContent: getMDXComponent(project.body.code),
  }));

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>

      {projectsWithMDX.length === 0 ? (
        <p className="text-muted-foreground">
          Projects will be listed here soon.
        </p>
      ) : (
        <ul className="space-y-10">
          {projectsWithMDX.map((project) => (
            <li key={project._id}>
              <h2 className="text-xl font-semibold">{project.title}</h2>

              {project.tech && project.tech?.length > 0 && (
                <p className="text-sm mt-1">
                  <strong>Tech:</strong> {project.tech.join(', ')}
                </p>
              )}

              {project.url && (
                <Link
                  href={project.url}
                  className="text-sm text-primary underline mt-1 inline-block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View project
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
