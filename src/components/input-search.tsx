import { Search } from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { cn } from '@/shared/lib/utils';

type InputSearchProps = React.ComponentProps<typeof InputGroupInput> & {
  className?: string;
};

export function InputSearch({
  placeholder,
  className,
  ...props
}: InputSearchProps) {
  return (
    <InputGroup className={cn(className)}>
      <InputGroupInput placeholder={placeholder} {...props} />
      <InputGroupAddon>
        <Search className="size-3 text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  );
}
