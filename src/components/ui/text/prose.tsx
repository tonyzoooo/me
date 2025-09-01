import { cn } from '@/lib/utils';

type ValidProseTags = 'article' | 'div' | 'section' | 'main';

interface ProseProps extends React.HTMLAttributes<HTMLElement> {
  as?: ValidProseTags;
}

export function Prose({
  as: Tag = 'article',
  className,
  ...props
}: ProseProps) {
  return (
    <Tag
      className={cn('prose prose-neutral dark:prose-invert', className)}
      {...props}
    />
  );
}
