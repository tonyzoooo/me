import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

const headerVariants = cva('scroll-m-20 tracking-tight', {
  variants: {
    level: {
      h1: 'text-3xl font-bold mb-4',
      h2: 'text-2xl font-semibold mb-3',
      h3: 'text-xl font-semibold mb-2.5',
      h4: 'text-lg font-medium mb-2',
      h5: 'text-base font-medium mb-1.5',
      h6: 'text-sm font-medium mb-1',
    },
  },
  defaultVariants: {
    level: 'h2',
  },
});

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type HeaderProps = HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headerVariants> & {
    as?: HeadingLevel;
  };

export function Header({
  as,
  level = 'h2',
  className,
  children,
  ...props
}: HeaderProps) {
  const Tag = (as ?? level) as HeadingLevel;

  return (
    <Tag className={cn(headerVariants({ level }), className)} {...props}>
      {children}
    </Tag>
  );
}
