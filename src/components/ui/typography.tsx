import * as React from 'react';
import { Check, Copy } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { useCopyToClipboard } from '@/shared/hooks/use-copy-clipboard';
import { cn } from '@/shared/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      code: 'rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-medium',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
});

const typographyElements = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  p: 'p',
  lead: 'p',
  large: 'div',
  small: 'small',
  muted: 'p',
  code: 'code',
} as const;

type TypographyElement = keyof typeof typographyElements;

interface TypographyProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  copy?: boolean;
  ellipsis?: boolean;
  tooltip?: boolean;
}

function Typography({
  className,
  variant = 'p',
  copy = false,
  ellipsis = false,
  tooltip = false,
  children,
  ...props
}: TypographyProps) {
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const Component = typographyElements[
    variant as TypographyElement
  ] as React.ElementType;

  const text = React.useMemo(() => {
    if (typeof children === 'string') return children;
    if (typeof children === 'number') return String(children);

    return '';
  }, [children]);

  const handleCopy = () => {
    if (!text) return;

    copyToClipboard(text);
  };

  const copied = copiedText === text;

  const content = (
    <Component
      className={cn(
        typographyVariants({ variant }),
        ellipsis && 'min-w-0 truncate',
        copy && 'group inline-flex items-center gap-1.5',
        className,
      )}
      {...props}
    >
      <span className={cn(ellipsis && 'min-w-0 truncate')}>{children}</span>

      {copy && (
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'shrink-0 text-muted-foreground transition-opacity',
            'opacity-0 group-hover:opacity-100',
            'hover:text-foreground',
          )}
          aria-label={copied ? 'Copied' : 'Copy'}
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </button>
      )}
    </Component>
  );

  if (ellipsis && tooltip && text) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>

        <TooltipContent>
          <p className="max-w-sm break-all">{text}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export { Typography, typographyVariants };
