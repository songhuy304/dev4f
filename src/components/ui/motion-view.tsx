import { AnimatePresence, motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/shared/lib/utils';

type MotionAnimation =
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale';

type MotionViewProps = {
  show?: boolean;
  animation?: MotionAnimation;
  children: React.ReactNode;
  className?: string;
  duration?: number;
} & Omit<HTMLMotionProps<'div'>, 'children' | 'initial' | 'animate' | 'exit'>;

const animations: Record<
  MotionAnimation,
  {
    initial: Record<string, number>;
    animate: Record<string, number>;
    exit: Record<string, number>;
  }
> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  'slide-up': {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
  },

  'slide-down': {
    initial: { opacity: 0, y: -8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  },

  'slide-left': {
    initial: { opacity: 0, x: 8 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 8 },
  },

  'slide-right': {
    initial: { opacity: 0, x: -8 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -8 },
  },

  scale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.96 },
  },
};

const MotionView = ({
  show = true,
  animation = 'fade',
  duration = 0.2,
  children,
  className,
  ...props
}: MotionViewProps) => {
  const variants = animations[animation];

  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          {...props}
          className={cn(className)}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={{
            duration,
            ease: 'easeOut',
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { MotionView };
export type { MotionAnimation, MotionViewProps };
