import { allProjects, allBlogs, allAboutMes } from 'contentlayer/generated';
import Link from 'next/link';
import { getMDXComponent } from 'next-contentlayer2/hooks';
import { Header, Prose } from '@/components';
import { PageLayout } from './components';

export default function HomePage() {
  const featuredProjects = allProjects
    .filter((project) => project.featured)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 2);

  const recentPosts = allBlogs.slice(0, 2);
  const AboutMe = getMDXComponent(allAboutMes[0].body.code);

  return (
    <PageLayout>
      <section>
        <Header level="h1">About me</Header>
        <Prose>
          <AboutMe />
        </Prose>
      </section>

      <section>
        <Header level="h1">Featured Projects</Header>
        <ul className="space-y-4">
          {featuredProjects.map((project) => (
            <li key={project._id}>
              <Link
                href={project.url || `/projects/${project._raw.flattenedPath}`}
                className="font-medium text-primary underline"
              >
                {project.title}
              </Link>
              {project.summary && (
                <p className="text-sm text-muted-foreground">
                  {project.summary}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Header level="h1">Recent Posts</Header>
        <ul className="space-y-4">
          {recentPosts.map((post) => (
            <li key={post._id}>
              <Link
                href={`/blog/${post._raw.flattenedPath}`}
                className="font-medium text-primary underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </PageLayout>
  );
}
