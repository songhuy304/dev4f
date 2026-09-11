'use client';

import * as React from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from 'cn';
import { LayoutGroup, motion } from 'motion/react';
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui';

import { toggleVariants } from '@/components/ui/toggle';

type ToggleGroupContextValue = VariantProps<typeof toggleVariants> & {
  spacing?: number;
  layoutId: string;
  value?: string | string[];
};

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({
  size: 'default',
  variant: 'default',
  spacing: 0,
  layoutId: '',
});

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  type = 'single',
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
  }) {
  const layoutId = React.useId();
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;

  const handleValueChange = React.useCallback(
    (next: string | string[]) => {
      if (!isControlled) setUncontrolledValue(next as typeof uncontrolledValue);
      // radix types differ for single vs multiple; cast keeps both call sites typed
      (onValueChange as ((v: string | string[]) => void) | undefined)?.(next);
    },
    [isControlled, onValueChange],
  );

  return (
    <ToggleGroupContext.Provider
      value={{ variant, size, spacing, layoutId, value }}
    >
      <LayoutGroup id={layoutId}>
        <ToggleGroupPrimitive.Root
          data-slot="toggle-group"
          data-variant={variant}
          data-size={size}
          data-spacing={spacing}
          style={{ '--gap': spacing } as React.CSSProperties}
          type={type}
          value={value as never}
          defaultValue={defaultValue as never}
          onValueChange={handleValueChange as never}
          className={cn(
            'group/toggle-group flex w-fit items-center gap-[--spacing(var(--gap))] rounded-xl bg-transparent! p-0.5',
            'data-[spacing=0]:data-[variant=outline]:border data-[spacing=0]:data-[variant=outline]:border-input data-[spacing=0]:data-[variant=outline]:shadow-xs dark:data-[spacing=0]:data-[variant=outline]:bg-input/30',
            className,
          )}
          {...props}
        >
          {children}
        </ToggleGroupPrimitive.Root>
      </LayoutGroup>
    </ToggleGroupContext.Provider>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  value,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);
  const resolvedVariant = context.variant || variant;
  const resolvedSize = context.size || size;

  const isActive = Array.isArray(context.value)
    ? context.value.includes(value)
    : context.value === value;

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      data-spacing={context.spacing}
      value={value}
      className={cn(
        toggleVariants({
          variant: resolvedVariant,
          size: resolvedSize,
        }),
        'relative w-auto min-w-0 shrink-0 cursor-pointer rounded-lg px-3 py-0.5 focus:z-10 focus-visible:z-10 hover:bg-transparent',
        'data-[spacing=0]:shadow-none data-[spacing=0]:data-[variant=outline]:border-0',
        // Surface moves via motion; keep text color transition.
        'data-[state=on]:bg-transparent data-[state=on]:text-accent-foreground',
        'transition-colors duration-200',
        'text-muted-foreground',
        className,
      )}
      {...props}
    >
      {isActive ? (
        <motion.span
          layoutId={`${context.layoutId}-indicator`}
          className="absolute inset-0 z-0 rounded-lg bg-accent shadow-sm"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      ) : null}

      <motion.span
        className="relative z-10 inline-flex items-center justify-center gap-2"
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {children}
      </motion.span>
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
