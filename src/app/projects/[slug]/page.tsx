import { allProjects } from 'contentlayer/generated';
import { getMDXComponent } from 'next-contentlayer2/hooks';
import { ProjectLayout } from '@/app/components';

export const generateStaticParams = () =>
  allProjects.map((project) => ({ slug: project.slug }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Project not found for slug: ${slug}`);
  return { title: project.title, description: project.summary ?? '' };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const project = allProjects.find((p) => p.slug === slug);
  if (!project) throw new Error(`Project not found: ${slug}`);
  const Content = getMDXComponent(project.body.code);

  return (
    <ProjectLayout project={project}>
      <Content />
    </ProjectLayout>
  );
}