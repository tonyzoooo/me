import { Button, Header, Prose } from '@/components';
import { allCVs } from 'contentlayer/generated';
import { format } from 'date-fns';
import { useMDXComponent } from 'next-contentlayer2/hooks';
import { PageLayout } from '../components';

export default function CVPage() {
  const cv = allCVs[0];
  const MDXContent = useMDXComponent(cv.body.code);

  const links = cv.links as Record<string, string> | undefined;
  const updatedAt = cv.updatedAt as string | undefined;

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <Header level={'h1'}>{cv.title}</Header>
          <Button variant="link" asChild>
            <a
              href="https://drive.google.com/file/d/1t8Q05obmTruQdA_ME0iR84FqrZWAh9B1/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Human-readable version
            </a>
          </Button>
        </div>

        {/* Updated At */}
        {updatedAt && (
          <p className="text-sm text-muted-foreground mb-6">
            Last updated: {format(new Date(updatedAt), 'MMMM d, yyyy')}
          </p>
        )}

        <Prose>
          <MDXContent />
        </Prose>

        {/* External Links */}
        {links && (
          <section className="mt-12 pt-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              External Links
            </h2>
            <ul className="flex flex-wrap gap-4">
              {Object.entries(links).map(([label, url]) => (
                <li key={label}>
                  <Button
                    asChild
                    variant="link"
                    className="text-muted-foreground p-0 h-auto"
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {label.charAt(0).toUpperCase() + label.slice(1)}
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
