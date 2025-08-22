import { allProjects, allBlogs } from 'contentlayer/generated';
import Link from 'next/link';

export default function HomePage() {
  const featuredProjects = allProjects.slice(0, 2);
  const recentPosts = allBlogs.slice(0, 2);

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-10">
      <section>
        <h1 className="text-3xl font-bold mb-2">About me</h1>
        <p className="text-muted-foreground">
          I’m a software engineer building tools and side projects around the
          web.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Featured Projects</h2>
        <ul className="space-y-4">
          {featuredProjects.map((project) => (
            <li key={project._id}>
              <Link
                href={`/projects/${project._raw.flattenedPath}`}
                className="font-medium text-primary underline"
              >
                {project.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Posts</h2>
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
    </main>
  );
}
