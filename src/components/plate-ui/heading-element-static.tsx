import * as React from 'react';

import type { SlateElementProps } from '@udecode/plate';

import { cn } from '@udecode/cn';
import { SlateElement } from '@udecode/plate';
import { cva } from 'class-variance-authority';

interface HeadingElementViewProps extends SlateElementProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const headingVariants = cva('relative mb-1', {
  variants: {
    variant: {
      h1: 'font-heading mt-[1.6em] pb-1 text-4xl font-bold',
      h2: 'font-heading mt-[1.4em] pb-px text-2xl font-semibold tracking-tight',
      h3: 'font-heading mt-[1em] pb-px text-xl font-semibold tracking-tight',
      h4: 'font-heading mt-[0.75em] text-lg font-semibold tracking-tight',
      h5: 'mt-[0.75em] text-lg font-semibold tracking-tight',
      h6: 'mt-[0.75em] text-base font-semibold tracking-tight',
    },
  },
});

export const HeadingElementStatic = ({
  children,
  className,
  variant = 'h1',
  ...props
}: HeadingElementViewProps) => {
  return (
    <SlateElement
      as={variant}
      className={cn(className, headingVariants({ variant }))}
      {...props}
    >
      {children}
    </SlateElement>
  );
};
