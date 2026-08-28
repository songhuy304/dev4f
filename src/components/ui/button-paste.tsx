'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { ClipboardPasteIcon, CheckIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { usePasteFromClipboard } from '@/shared/hooks/use-paste-clipboard';

interface ButtonPasteProps extends Omit<ButtonProps, 'children' | 'onPaste'> {
  onPaste?: (text: string) => void;
  text?: string;
}

const ButtonPaste = ({
  onPaste,
  text = 'Paste',
  ...props
}: ButtonPasteProps) => {
  const { pasted, paste } = usePasteFromClipboard({
    onSuccess: (text) => {
      onPaste?.(text);
    },
  });

  return (
    <Button className="relative" onClick={paste} disabled={!!pasted} {...props}>
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">
        <AnimatePresence mode="wait" initial={false}>
          {pasted ? (
            <motion.span
              key="check"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex"
            >
              <CheckIcon className="size-3.5 stroke-green-300" />
            </motion.span>
          ) : (
            <motion.span
              key="paste"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="inline-flex"
            >
              <ClipboardPasteIcon className="size-3.5" />
            </motion.span>
          )}
        </AnimatePresence>

        {text}
      </span>
    </Button>
  );
};

export { ButtonPaste };
