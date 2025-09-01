import { allProjects } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer2/hooks';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Badge, Header } from '@/components';
import { PageLayout } from '../components';

export default function ProjectsPage() {
  const projectsWithMDX = allProjects
    .filter((p) => p.featured || true) // keep all for now
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((project) => ({
      ...project,
      MDXContent: getMDXComponent(project.body.code),
    }));

  return (
    <PageLayout>
      <Header level={'h1'}>Projects</Header>
      {projectsWithMDX.length === 0 ? (
        <p className="text-muted-foreground">
          Projects will be listed here soon.
        </p>
      ) : (
        <ul className="space-y-10">
          {projectsWithMDX.map((project) => (
            <li key={project._id} className="border-b pb-6">
              <div className="flex flex-col gap-1">
                <Header level={'h2'}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:underline"
                  >
                    {project.title}
                  </Link>
                </Header>

                {project.date && (
                  <time
                    dateTime={project.date}
                    className="text-xs text-muted-foreground"
                  >
                    {format(parseISO(project.date), 'LLLL d, yyyy')}
                  </time>
                )}

                {project.summary && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.summary}
                  </p>
                )}

                {project.tech && project.tech.length > 0 && (
                  <ul className="flex flex-wrap gap-2 mt-2">
                    {project.tech.map((tech) => (
                      <li key={tech}>
                        <Badge variant="outline">{tech}</Badge>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex gap-4 mt-3 text-sm">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-primary hover:underline"
                  >
                    Read more
                  </Link>
                  {project.url && (
                    <Link
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Live demo
                    </Link>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageLayout>
  );
}
