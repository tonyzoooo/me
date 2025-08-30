import { allCVs } from 'contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer2/hooks';

export default function CVPage() {
  const cv = allCVs[0];
  const MDXContent = useMDXComponent(cv.body.code);

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{cv.title}</h1>
      <article className="prose prose-neutral dark:prose-invert">
        <MDXContent />
      </article>
    </main>
  );
}
