import { format, parseISO } from 'date-fns';
import { allProjects } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer2/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components';

export const generateStaticParams = async () =>
  allProjects.map((project) => ({ slug: project.slug }));

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = await params;
  const project = allProjects.find((project) => project.slug === slug);
  if (!project) throw new Error(`Post not found for slug: ${slug}`);
  return {
    title: project.title,
    //description: project.summary ?? project.description ?? '',
  };
};

const PostLayout = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  const project = allProjects.find((project) => project.slug === slug);
  if (!project) throw new Error(`Post not found for slug: ${slug}`);
  const Content = getMDXComponent(project.body.code);

  return (
    <article className="mx-auto max-w-xl py-8">
      <div className="mb-8 text-center">
        {project.date && (
          <time dateTime={project.date} className="mb-1 text-xs text-gray-600">
            {format(parseISO(project.date), 'LLLL d, yyyy')}
          </time>
        )}
        <h1 className="text-3xl font-bold">{project.title}</h1>

        {/* {project.summary && (
          <p className="mt-2 text-gray-500">{project.summary}</p>
        )}
        {project.image && (
          <Image
            src={project.image}
            alt={project.imageAlt ?? project.title}
            width={800}
            height={400}
            className="mx-auto mt-4 rounded-lg border"
          />
        )} */}
        {project.tech && project.tech?.length > 0 && (
          <ul className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            {project.tech.map((t) => (
              <li key={t}>
                <Badge key={t}>{t}</Badge>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-center gap-4 text-sm">
          {project.url && (
            <Link href={project.url} className="text-blue-600 hover:underline">
              Live Demo
            </Link>
          )}
          {/* {project.repo && (
            <Link href={project.repo} className="text-blue-600 hover:underline">
              Source Code
            </Link>
          )} */}
        </div>
      </div>

      <Content />

      <div className="mt-8 text-sm text-gray-500">
        {/* {project.readingTime && (
          <p>
            ~{project.readingTime} min read · {project.wordCount} words
          </p>
        )} */}
      </div>
    </article>
  );
};

export default PostLayout;
