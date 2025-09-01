import { allProjects } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer2/hooks';
import { ProjectLayout } from '@/app/components';

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
    description: project.summary ?? '',
  };
};
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = allProjects.find((p) => p.slug === params.slug);
  if (!project) throw new Error(`Project not found: ${params.slug}`);
  const Content = getMDXComponent(project.body.code);

  return (
    <ProjectLayout project={project}>
      <Content />
    </ProjectLayout>
  );
}
