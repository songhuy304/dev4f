'use client';

import { Button, ButtonProps } from '@/components/ui/button';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { useCopyToClipboard } from '@/shared/hooks/use-copy-clipboard';

const MotionCopyIcon = motion.create(CopyIcon);
const MotionCheckIcon = motion.create(CheckIcon);

const copyIconVariants = {
  initial: { rotate: 0, scale: 1, y: 0 },
  hover: {
    rotate: [0, -8, 8, -4, 0],
    scale: 1.1,
    y: -0.5,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

const checkIconVariants = {
  initial: { scale: 0, rotate: -30 },
  animate: {
    scale: [0, 1.3, 0.95, 1],
    rotate: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

interface ButtonCopyProps extends Omit<ButtonProps, 'children'> {
  content: string;
  text?: string;
}

const ButtonCopy = ({ content, text = 'Copy', ...props }: ButtonCopyProps) => {
  const [copied, copy] = useCopyToClipboard();

  const handleCopy = async () => {
    copy(content);
  };

  return (
    <Button
      className="relative min-w-22.5 overflow-hidden"
      onClick={handleCopy}
      disabled={!!copied}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1.5 text-green-300"
          >
            <MotionCheckIcon
              className="size-3.5 stroke-green-300"
              variants={checkIconVariants as Variants}
              initial="initial"
              animate="animate"
            />
            Copied!
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            whileHover="hover"
            className="inline-flex items-center gap-1.5"
          >
            <MotionCopyIcon
              className="size-3.5"
              variants={copyIconVariants as Variants}
              initial="initial"
            />
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
};

export { ButtonCopy };
