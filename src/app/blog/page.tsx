import Link from 'next/link';
import { allPosts } from 'contentlayer/generated';

export default function BlogPage() {
  const posts = allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-10 text-4xl font-bold">Blog</h1>

      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post._id} className="space-y-2">
            <Link
              href={post.path}
              className="text-xl font-semibold hover:underline"
            >
              {post.title}
            </Link>

            <p className="text-muted-foreground">{post.description}</p>

            <div className="text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString()} • {post.readingTime}{' '}
              min read
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
