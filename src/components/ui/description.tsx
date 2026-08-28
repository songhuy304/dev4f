import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/shared/lib/utils';
import { Typography } from './typography';

interface DescriptionItemProps {
  label: React.ReactNode;
  children: React.ReactNode;
  labelClassName?: string;
  valueClassName?: string;
  tooltip?: string;
}

export function DescriptionItem({
  label,
  children,
  labelClassName,
  valueClassName,
  tooltip,
}: DescriptionItemProps) {
  return (
    <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
      <TableCell
        className={cn(
          'w-40 py-3 text-sm font-medium bg-muted/80',
          labelClassName,
        )}
      >
        {label}
      </TableCell>
      <TableCell
        className={cn(
          'max-w-0 overflow-hidden py-3 text-sm whitespace-normal',
          valueClassName,
        )}
      >
        <Typography variant="small" ellipsis tooltip={tooltip} className="block w-full">
          {children}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

interface DescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function Description({ children, className }: DescriptionProps) {
  return (
    <div className={cn('mx-auto flex w-full flex-col', className)}>
      <div className="overflow-hidden rounded-lg border">
        <Table className="table-fixed">
          <TableBody>{children}</TableBody>
        </Table>
      </div>
    </div>
  );
}
