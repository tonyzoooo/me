import { PostLayout } from '@/app/components';
import { allPosts } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer2/hooks';

export const generateStaticParams = () =>
  allPosts.map((post) => ({ slug: post.slug }));

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) throw new Error(`Post not found: ${slug}`);
  const Content = getMDXComponent(post.body.code);

  return (
    <PostLayout post={post}>
      <Content />
    </PostLayout>
  );
}
