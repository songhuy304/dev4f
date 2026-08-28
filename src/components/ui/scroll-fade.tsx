import { cn } from '@/shared/lib/utils';
import type { ComponentProps } from 'react';

export type ScrollFadeEffectProps = ComponentProps<'div'> & {
  /**
   * Scroll direction to apply the fade effect.
   * @defaultValue "vertical"
   * */
  orientation?: 'horizontal' | 'vertical';
};

export function ScrollFadeEffect({
  className,
  orientation = 'vertical',
  ...props
}: ScrollFadeEffectProps) {
  return (
    <div
      data-orientation={orientation}
      className={cn(
        'min-h-0 min-w-0',
        'data-[orientation=horizontal]:overflow-x-auto data-[orientation=vertical]:overflow-y-auto',
        'data-[orientation=horizontal]:scroll-fade-effect-x data-[orientation=vertical]:scroll-fade-effect-y',
        className,
      )}
      {...props}
    />
  );
}
