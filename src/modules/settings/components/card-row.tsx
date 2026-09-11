import { Typography } from '@/components/ui/typography';

interface CardRowProps {
  title: string;
  icon?: React.ReactNode;
  description?: string;
  children?: React.ReactNode;
}

export const CardRow = ({ title, description, children }: CardRowProps) => {
  return (
    <div className="px-2 py-2 flex items-center gap-4 justify-between">
      <div className="flex flex-col max-w-[60%]">
        <Typography variant="p" className="font-medium text-sm">
          {title}
        </Typography>
        {description && (
          <Typography
            variant="p"
            className="text-xs leading-normal text-muted-foreground truncate"
          >
            {description}
          </Typography>
        )}
      </div>
      {children}
    </div>
  );
};
