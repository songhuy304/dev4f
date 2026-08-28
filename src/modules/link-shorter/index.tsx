import { ButtonCopy } from '@/components/ui/button-copy';
import { ButtonPaste } from '@/components/ui/button-paste';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const LinkShorterPage = () => {
  const [originalLink, setOriginalLink] = useState('');
  const [shortLink, setShortLink] = useState('');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="original-link"
              className="text-xs text-muted-foreground"
            >
              Original Link
            </Label>

            <ButtonPaste
              size="sm"
              variant="link"
              className="text-xs h-auto"
              onPaste={setOriginalLink}
            />
          </div>

          <Input
            name="original-link"
            id="original-link"
            value={originalLink}
            onChange={(e) => setOriginalLink(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="short-link" className="text-xs text-muted-foreground">
            Short Link
          </Label>

          <Input
            name="short-link"
            id="short-link"
            value={shortLink}
            onChange={(e) => setShortLink(e.target.value)}
          />
        </div>

        <ButtonCopy
          text="Copy Short Link"
          variant="default"
          content={shortLink}
          onCopy={() => {}}
        />
      </div>
    </div>
  );
};

export { LinkShorterPage };
